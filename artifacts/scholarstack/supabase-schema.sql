-- ================================================================
-- ScholarStack — Supabase Schema
-- Paste this into: Supabase Dashboard > SQL Editor > New Query
-- ================================================================

-- ─── Extensions ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Tables ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT,
  phone       TEXT,
  role        TEXT        NOT NULL DEFAULT 'student'
              CHECK (role IN ('student','scholar','admin')),
  expertise   TEXT,
  avatar_url  TEXT,
  is_verified BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id               BIGSERIAL   PRIMARY KEY,
  title            TEXT        NOT NULL,
  description      TEXT,
  scholar_id       UUID        REFERENCES profiles(id),
  scholar_name     TEXT        NOT NULL DEFAULT 'Scholar',
  price            TEXT        NOT NULL DEFAULT 'Free',
  original_price   TEXT        DEFAULT '',
  exam             TEXT,
  category         TEXT        CHECK (category IN ('competitive','university','board')),
  board_type       TEXT,
  subject          TEXT,
  pages            INTEGER     DEFAULT 100,
  color            TEXT        DEFAULT 'bg-violet-500',
  tag              TEXT        DEFAULT 'New',
  rating           NUMERIC(3,2) DEFAULT 0,
  reviews_count    INTEGER     DEFAULT 0,
  sales_count      INTEGER     DEFAULT 0,
  content_type     TEXT        DEFAULT 'PDF'
                   CHECK (content_type IN ('PDF','Video','Bundle')),
  status           TEXT        DEFAULT 'live'
                   CHECK (status IN ('review','live','rejected')),
  file_url         TEXT,
  thumbnail_url    TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchases (
  id             BIGSERIAL   PRIMARY KEY,
  student_id     UUID        REFERENCES profiles(id) ON DELETE CASCADE,
  note_id        BIGINT      REFERENCES notes(id) ON DELETE CASCADE,
  amount         TEXT        DEFAULT 'Free',
  payment_method TEXT        DEFAULT 'demo',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, note_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id          BIGSERIAL   PRIMARY KEY,
  student_id  UUID        REFERENCES profiles(id) ON DELETE CASCADE,
  note_id     BIGINT      REFERENCES notes(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, note_id)
);

CREATE TABLE IF NOT EXISTS scholar_approvals (
  id           BIGSERIAL   PRIMARY KEY,
  scholar_id   UUID        REFERENCES profiles(id) ON DELETE CASCADE,
  scholar_name TEXT,
  expertise    TEXT,
  status       TEXT        DEFAULT 'pending'
               CHECK (status IN ('pending','approved','rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Auto-create profile trigger ────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role','student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Row Level Security ──────────────────────────────────────
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholar_approvals ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- profiles
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin());

-- notes
DROP POLICY IF EXISTS "notes_select" ON notes;
DROP POLICY IF EXISTS "notes_insert" ON notes;
DROP POLICY IF EXISTS "notes_update" ON notes;
CREATE POLICY "notes_select" ON notes FOR SELECT
  USING (status = 'live' OR auth.uid() = scholar_id OR is_admin());
CREATE POLICY "notes_insert" ON notes FOR INSERT
  WITH CHECK (auth.uid() = scholar_id);
CREATE POLICY "notes_update" ON notes FOR UPDATE
  USING (auth.uid() = scholar_id OR is_admin());

-- purchases
DROP POLICY IF EXISTS "purchases_select" ON purchases;
DROP POLICY IF EXISTS "purchases_insert" ON purchases;
CREATE POLICY "purchases_select" ON purchases FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "purchases_insert" ON purchases FOR INSERT WITH CHECK (auth.uid() = student_id);

-- bookmarks
DROP POLICY IF EXISTS "bookmarks_all" ON bookmarks;
CREATE POLICY "bookmarks_all" ON bookmarks FOR ALL USING (auth.uid() = student_id);

-- scholar_approvals
DROP POLICY IF EXISTS "approvals_select" ON scholar_approvals;
DROP POLICY IF EXISTS "approvals_insert" ON scholar_approvals;
DROP POLICY IF EXISTS "approvals_update" ON scholar_approvals;
CREATE POLICY "approvals_select" ON scholar_approvals FOR SELECT
  USING (auth.uid() = scholar_id OR is_admin());
CREATE POLICY "approvals_insert" ON scholar_approvals FOR INSERT
  WITH CHECK (auth.uid() = scholar_id);
CREATE POLICY "approvals_update" ON scholar_approvals FOR UPDATE USING (is_admin());

-- ─── Seed: Demo Notes ────────────────────────────────────────
INSERT INTO notes (title, scholar_name, price, original_price, exam, category, pages, color, tag, rating, reviews_count, sales_count, status, content_type, description) VALUES

-- Competitive
('UPSC Polity Complete Notes 2025','Dr. Rajiv Menon','₹299','₹799','UPSC','competitive',324,'bg-orange-500','Bestseller',4.9,12400,3200,'live','PDF','Complete Polity for UPSC covering Laxmikant entirely. Includes Constitutional Framework, PYQ analysis 2011–2024, and 40+ mind maps.'),
('NEET Biology Master Notes','Priya Sharma','₹249','₹599','NEET','competitive',210,'bg-green-500','Top Rated',4.9,8200,2100,'live','PDF','Comprehensive NEET Biology with NCERT integration, diagrams, and MCQs for all chapters of Class 11 & 12.'),
('JEE Math Shortcut Tricks','Karan Mehta','₹199','₹499','JEE','competitive',180,'bg-blue-500','Trending',4.8,6100,1800,'live','PDF','High-impact tricks and pattern-based solving for JEE Math. Covers Algebra, Calculus, Coordinate Geometry.'),
('SSC CGL Math Tricks','Rahul Verma','Free','','SSC','competitive',90,'bg-yellow-500','Free',4.7,19400,14200,'live','PDF','All math shortcuts for SSC CGL/CHSL. Free for everyone — 90 pages of pure tricks.'),
('CAT Verbal Ability Notes','MBA Guru','₹399','₹999','CAT','competitive',150,'bg-purple-500','New',4.6,3200,890,'live','PDF','RC, Para-Jumbles, Verbal Logic — all covered with solved examples and CAT-level practice sets.'),
('GATE Computer Science Notes','Tech Scholar','₹349','₹799','GATE','competitive',280,'bg-cyan-500','Bestseller',4.8,4100,1200,'live','PDF','Complete GATE CS covering DS, Algorithms, OS, CN, DBMS, Theory of Computation with PYQs.'),
('Banking Awareness Complete Notes','Finance Pro','₹149','₹349','Banking','competitive',120,'bg-indigo-500','Top Rated',4.7,7200,2800,'live','PDF','Static GK, Current Affairs for Banking, RBI policies, and important financial terms.'),
('CUET UG Complete Strategy Guide','CUET Expert','₹279','₹699','CUET','competitive',200,'bg-rose-500','Trending',4.6,2800,760,'live','PDF','Domain-specific and general test preparation for CUET 2025 with mock test strategy.'),
('State PSC General Studies Package','PSC Topper','₹229','₹499','State PSC','competitive',160,'bg-amber-500','New',4.5,1900,540,'live','PDF','Covers History, Geography, Economy, Polity for all major State PSC exams with state-specific content.'),
('Defence Exam Notes — CDS & NDA','Defence Coach','Free','','Defence','competitive',140,'bg-teal-500','Free',4.8,9400,8200,'live','PDF','Complete free notes for CDS and NDA covering GK, Math, English, and General Science.'),

-- University
('Delhi University B.Com Semester 1','CA Aryan Shah','₹179','₹449','Delhi University','university',200,'bg-violet-500','Bestseller',4.7,3800,1100,'live','PDF','Full DU B.Com Sem 1: Financial Accounting, Business Laws, and Business Economics with solved previous year papers.'),
('Mumbai University Engineering Maths','Prof. Sanjay K','₹149','₹349','Mumbai University','university',160,'bg-indigo-500','Top Rated',4.6,2900,840,'live','PDF','Sem 3 Engineering Math: Fourier Series, Laplace Transforms, Vector Calculus, Numerical Methods.'),
('Anna University First Year Notes','Tamil Scholar','₹129','₹299','Anna University','university',220,'bg-blue-500','Trending',4.5,2100,610,'live','PDF','Complete first-year notes for all Anna University branches with solved university questions.'),
('VTU Engineering Sem 3 Complete','VTU Ranker','₹199','₹499','VTU','university',280,'bg-purple-500','Bestseller',4.8,4200,1300,'live','PDF','Covers all Sem 3 subjects for VTU: Data Structures, Digital Electronics, Engineering Maths 3, and BEEE.'),
('Pune University LLB Notes','Legal Eagle','₹249','₹599','Pune University','university',240,'bg-rose-500','Top Rated',4.7,1800,520,'live','PDF','Complete 3-year LLB notes covering Constitutional Law, IPC, CrPC, Evidence Act with case law.'),
('BHU BA Political Science Notes','BHU Scholar','₹149','₹349','BHU','university',180,'bg-green-500','New',4.5,1200,340,'live','PDF','BHU BA Political Science covering Indian Politics, International Relations, and Comparative Politics.'),

-- Board — CBSE
('CBSE Class 12 Physics All Chapters','Neha Jain','₹129','₹299','Class 12','board',190,'bg-blue-600','Bestseller',4.8,6700,2400,'live','PDF','All 15 chapters of CBSE Class 12 Physics with theory, derivations, numericals. Based on 2024–25 syllabus.'),
('CBSE Class 10 Math Solution Manual','Math Expert','₹99','₹249','Class 10','board',160,'bg-blue-500','Top Rated',4.9,9200,3800,'live','PDF','Complete solved NCERT + exemplar Math for Class 10. Every question answered step-by-step.'),
('CBSE Class 11 Chemistry Notes','Chem Teacher','₹149','₹349','Class 11','board',200,'bg-green-500','Trending',4.7,4100,1500,'live','PDF','Physical, Organic, and Inorganic Chemistry for CBSE Class 11 with reaction mechanisms.'),

-- Board — CISCE
('ICSE Class 10 Complete Pack','ICSE Topper','₹199','₹499','Class 10 (ICSE)','board',280,'bg-orange-500','Bestseller',4.8,3200,1100,'live','PDF','All subjects for ICSE Class 10 — Physics, Chemistry, Biology, Math, History & Civics.'),
('ISC Class 12 Mathematics','ISC Math Pro','₹179','₹449','Class 12 (ISC)','board',220,'bg-orange-600','Top Rated',4.7,2400,780,'live','PDF','Complete ISC Class 12 Math with solved specimen papers 2020–2024.'),

-- Board — State
('Maharashtra HSC Biology Notes','Bio Teacher','₹119','₹279','Maharashtra Board','board',180,'bg-yellow-500','Trending',4.6,2800,920,'live','PDF','HSC Biology for Maharashtra Board — Botany and Zoology with diagrams.'),
('UP Board Class 12 Hindi Sahitya','Hindi Expert','Free','','UP Board','board',140,'bg-amber-500','Free',4.5,4800,3900,'live','PDF','Complete Hindi Sahitya notes for UP Board Class 12. Free for all UP Board students.'),
('Tamil Nadu Board Class 11 Physics','TN Scholar','₹99','₹229','Tamil Nadu Board','board',160,'bg-red-500','New',4.6,1900,560,'live','PDF','TN Board Class 11 Physics following the new 2024–25 syllabus with volume exercises.'),

-- Additional scholar-uploaded (pre-approved live)
('UPSC GS Paper 1 Strategy Guide','Dr. Rajiv Menon','₹299','₹799','UPSC','competitive',280,'bg-orange-500','Bestseller',4.9,4820,1240,'live','PDF','Complete GS Paper 1 strategy with History, Geography, Art & Culture, and Indian Society. PYQ-mapped.'),
('NEET Physics Crash Course 2025','Priya Sharma','₹229','₹549','NEET','competitive',180,'bg-pink-500','Top Rated',4.8,3100,890,'live','PDF','Compact but complete NEET Physics with all formulas, NCERT-based MCQs, and topic-wise PYQs.')

ON CONFLICT DO NOTHING;

-- ─── Admin Setup ─────────────────────────────────────────────
-- STEP 1: Sign up with admin@scholarstack.in / ScholarAdmin@2024 through the app
-- STEP 2: Disable email confirmation in Supabase:
--         Authentication > Providers > Email > uncheck "Confirm email"
-- STEP 3: Run this to grant admin privileges:
--   UPDATE profiles SET role = 'admin' WHERE email = 'admin@scholarstack.in';

-- ─── Storage Bucket Policies ─────────────────────────────────
-- Run these for each bucket in Storage > Policies:
--
-- For "notes" bucket (scholar PDF uploads):
-- CREATE POLICY "Scholars can upload notes" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'notes' AND auth.role() = 'authenticated');
-- CREATE POLICY "Notes are publicly readable" ON storage.objects FOR SELECT
--   USING (bucket_id = 'notes');
--
-- For "videos" bucket:
-- CREATE POLICY "Scholars can upload videos" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');
-- CREATE POLICY "Videos are publicly readable" ON storage.objects FOR SELECT
--   USING (bucket_id = 'videos');
--
-- For "thumbnails" bucket:
-- CREATE POLICY "Anyone can upload thumbnails" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'thumbnails' AND auth.role() = 'authenticated');
-- CREATE POLICY "Thumbnails are public" ON storage.objects FOR SELECT
--   USING (bucket_id = 'thumbnails');
--
-- For "profiles" bucket (avatars):
-- CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'profiles' AND auth.role() = 'authenticated');
-- CREATE POLICY "Avatars are public" ON storage.objects FOR SELECT
--   USING (bucket_id = 'profiles');
