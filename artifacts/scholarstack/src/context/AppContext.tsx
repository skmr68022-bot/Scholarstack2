
import { createContext, useContext, useState, useEffect } from "react";

type Role = "student" | "scholar" | "admin" | null;

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "student" | "scholar";
  expertise?: string;
  createdAt: number;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "scholar" | "admin";
}

interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  currentUser: CurrentUser | null;
  login: (email: string, password: string, role: "student" | "scholar" | "admin") => { success: boolean; error?: string };
  signup: (data: { name: string; email: string; password: string; phone?: string; role: "student" | "scholar"; expertise?: string }) => { success: boolean; error?: string };
  signupWithPhone: (data: { name: string; phone: string; role: "student" | "scholar"; expertise?: string }) => { success: boolean; error?: string };
  loginWithPhone: (phone: string, role: "student" | "scholar") => { success: boolean; user?: RegisteredUser; error?: string };
  completePhoneLogin: (phone: string, role: "student" | "scholar") => { success: boolean; error?: string };
  logout: () => void;
  purchased: Set<number>;
  addPurchased: (id: number) => void;
  bookmarked: Set<number>;
  toggleBookmark: (id: number) => void;
  uploads: UploadItem[];
  addUpload: (item: UploadItem) => void;
  approveContent: (id: number) => void;
  rejectContent: (id: number) => void;
  pendingScholars: PendingScholar[];
  removeScholar: (id: number) => void;
  users: AdminUser[];
  banUser: (id: number) => void;
}

export interface UploadItem {
  id: number;
  title: string;
  type: string;
  price: string;
  original?: string;
  sales: number;
  earnings: string;
  rating: number;
  reviews: number;
  status: "review" | "live" | "rejected";
  category?: string;
  exam?: string;
  scholar?: string;
  scholarId?: string;
  description?: string;
  pages?: number;
  color?: string;
  tag?: string;
  subject?: string;
  boardType?: string;
  submittedAt?: number;
}

export interface PendingScholar {
  id: number;
  name: string;
  tag: string;
  avatar: string;
  bg: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  plan: string;
  status: string;
}

const ADMIN_EMAIL = "admin@scholarstack.in";
const ADMIN_PASSWORD = "ScholarAdmin@2024";
const USERS_KEY = "ss_registered_users";
const SESSION_KEY = "ss_current_user";

function loadUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveUsers(users: RegisteredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function loadSession(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveSession(user: CurrentUser | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

const DEMO_UPLOADS: UploadItem[] = [
  {
    id: 101, title: "UPSC GS Paper 1 — Complete Strategy Notes", type: "PDF",
    price: "₹299", original: "₹799", sales: 3240, earnings: "₹97,076",
    rating: 4.9, reviews: 4820, status: "live", category: "competitive", exam: "UPSC",
    scholar: "Dr. Rajiv Menon", scholarId: "scholar-demo-1", pages: 280,
    color: "bg-orange-500", tag: "Bestseller",
    description: "Complete GS Paper 1 strategy covering History, Geography, Indian Society, and Art & Culture. Includes PYQ analysis 2011–2024, high-value topic mapping, and 40+ mind maps.",
    submittedAt: Date.now() - 864000000,
  },
  {
    id: 102, title: "NEET Physics Crash Course Notes 2025", type: "PDF",
    price: "₹229", original: "₹549", sales: 1890, earnings: "₹39,710",
    rating: 4.8, reviews: 3100, status: "live", category: "competitive", exam: "NEET",
    scholar: "Priya Sharma", scholarId: "scholar-demo-2", pages: 180,
    color: "bg-pink-500", tag: "Top Rated",
    description: "Compact but complete Physics notes for NEET. All chapters from Class 11 & 12 with 200+ important formulas and NCERT-based MCQs.",
    submittedAt: Date.now() - 1728000000,
  },
  {
    id: 103, title: "JEE Advanced Chemistry Solutions — 10 Years", type: "PDF",
    price: "Free", original: "", sales: 22100, earnings: "₹0",
    rating: 4.9, reviews: 8200, status: "live", category: "competitive", exam: "JEE",
    scholar: "Karan Mehta", scholarId: "scholar-demo-3", pages: 220,
    color: "bg-blue-500", tag: "Free",
    description: "Detailed step-by-step solutions to all JEE Advanced Chemistry questions from 2014 to 2024. Covers Organic, Inorganic, and Physical Chemistry.",
    submittedAt: Date.now() - 2592000000,
  },
  {
    id: 104, title: "B.Tech Engineering Mathematics Notes (VTU Sem 3)", type: "PDF",
    price: "₹149", original: "₹349", sales: 2810, earnings: "₹44,619",
    rating: 4.7, reviews: 1940, status: "live", category: "university", exam: "VTU",
    scholar: "Prof. Sanjay K", scholarId: "scholar-demo-4", pages: 160,
    color: "bg-indigo-500", tag: "Trending",
    description: "Full semester 3 Engineering Mathematics notes for VTU. Covers Fourier Series, Laplace Transforms, Vector Calculus, and Numerical Methods with solved examples.",
    submittedAt: Date.now() - 3456000000,
  },
  {
    id: 105, title: "Class 12 CBSE Physics — All Chapters Notes", type: "PDF",
    price: "₹129", original: "₹299", sales: 5420, earnings: "₹70,018",
    rating: 4.8, reviews: 6700, status: "live", category: "board", exam: "Class 12",
    scholar: "Neha Jain", scholarId: "scholar-demo-5", pages: 190,
    color: "bg-blue-600", tag: "Bestseller",
    description: "All 15 chapters of CBSE Class 12 Physics with theory, important derivations, numericals, and board-exam tips. Based on latest 2024–25 syllabus.",
    boardType: "CBSE", subject: "Physics", submittedAt: Date.now() - 4320000000,
  },
  /* ── Pending admin approval (content queue) ── */
  {
    id: 201, title: "CAT 2025 Verbal Ability Master Shortcuts", type: "PDF",
    price: "₹349", original: "₹899", sales: 0, earnings: "₹0",
    rating: 0, reviews: 0, status: "review", category: "competitive", exam: "CAT",
    scholar: "MBA Guru", scholarId: "scholar-demo-6", pages: 160,
    color: "bg-purple-500", tag: "New",
    description: "All verbal ability tricks and shortcuts for CAT 2025. Covers Reading Comprehension, Para-Jumbles, and Verbal Logic.",
    submittedAt: Date.now() - 3600000,
  },
  {
    id: 202, title: "Maharashtra HSC Mathematics Solved Papers 2025", type: "PDF",
    price: "₹149", original: "₹349", sales: 0, earnings: "₹0",
    rating: 0, reviews: 0, status: "review", category: "board", exam: "Maharashtra Board",
    scholar: "Pune Toppers", scholarId: "scholar-demo-7", pages: 190,
    color: "bg-cyan-600", tag: "New",
    description: "Complete solved mathematics papers for Maharashtra HSC board exams 2019–2024 with step-by-step solutions.",
    boardType: "State Board", subject: "Mathematics", submittedAt: Date.now() - 7200000,
  },
  {
    id: 203, title: "Data Structures & Algorithms — Mumbai University", type: "PDF",
    price: "₹199", original: "₹499", sales: 0, earnings: "₹0",
    rating: 0, reviews: 0, status: "review", category: "university", exam: "Mumbai University",
    scholar: "Code with Ria", scholarId: "scholar-demo-8", pages: 240,
    color: "bg-pink-500", tag: "New",
    description: "Comprehensive DSA notes for Mumbai University exams. Covers Arrays, Linked Lists, Trees, Graphs, Sorting, and Searching with Java/C++ code.",
    subject: "Computer Science", submittedAt: Date.now() - 10800000,
  },
  /* ── Scholar's own content page items (pre-existing) ── */
  {
    id: 301, title: "UPSC Polity Complete Notes 2025", type: "PDF",
    price: "₹299", original: "₹799", sales: 1240, earnings: "₹37,076",
    rating: 4.9, reviews: 12400, status: "live",
    scholar: "Dr. Rajiv Menon", scholarId: "scholar-demo-1",
  },
  {
    id: 302, title: "Modern History Short Notes", type: "PDF",
    price: "₹149", original: "₹399", sales: 890, earnings: "₹13,261",
    rating: 4.8, reviews: 5600, status: "live",
    scholar: "Dr. Rajiv Menon", scholarId: "scholar-demo-1",
  },
  {
    id: 303, title: "Polity Shorts Series", type: "Video",
    price: "Free", original: "", sales: 14200, earnings: "₹0",
    rating: 4.7, reviews: 22000, status: "live",
    scholar: "Dr. Rajiv Menon", scholarId: "scholar-demo-1",
  },
];

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => loadSession());
  const [purchased, setPurchased] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [uploads, setUploads] = useState<UploadItem[]>(DEMO_UPLOADS);
  const [pendingScholars, setPendingScholars] = useState<PendingScholar[]>([
    { id: 1, name: "Neha Gupta", tag: "NEET Expert", avatar: "NG", bg: "from-pink-400 to-rose-400" },
    { id: 2, name: "Vikram Rao", tag: "UPSC Notes", avatar: "VR", bg: "from-orange-400 to-red-400" },
    { id: 3, name: "Sonia K.", tag: "CAT Mentor", avatar: "SK", bg: "from-blue-400 to-indigo-400" },
  ]);
  const [users, setUsers] = useState<AdminUser[]>([
    { id: 1, name: "Priya Sharma", email: "priya@email.com", role: "Student", plan: "Pro", status: "active" },
    { id: 2, name: "Dr. Rajiv M.", email: "rajiv@email.com", role: "Scholar", plan: "Verified", status: "active" },
    { id: 3, name: "Rahul Verma", email: "rahul@email.com", role: "Student", plan: "Free", status: "active" },
    { id: 4, name: "Spam User", email: "spam@test.com", role: "Student", plan: "Free", status: "flagged" },
  ]);

  useEffect(() => {
    if (currentUser) setRole(currentUser.role);
  }, []);

  const login = (email: string, password: string, loginRole: "student" | "scholar" | "admin"): { success: boolean; error?: string } => {
    const trimEmail = email.trim().toLowerCase();
    const trimPw = password.trim();
    if (!trimEmail || !trimPw) return { success: false, error: "Please fill in all fields." };
    if (loginRole === "admin") {
      if (trimEmail === ADMIN_EMAIL.toLowerCase() && trimPw === ADMIN_PASSWORD) {
        const user: CurrentUser = { id: "admin-1", name: "Admin", email: ADMIN_EMAIL, role: "admin" };
        setCurrentUser(user); saveSession(user); setRole("admin");
        return { success: true };
      }
      return { success: false, error: "Invalid admin credentials." };
    }
    const registeredUsers = loadUsers();
    const found = registeredUsers.find(u => u.email.toLowerCase() === trimEmail && u.password === trimPw && u.role === loginRole);
    if (!found) {
      const emailExists = registeredUsers.find(u => u.email.toLowerCase() === trimEmail);
      if (emailExists) return { success: false, error: "Incorrect password." };
      return { success: false, error: "No account found with this email. Please sign up." };
    }
    const user: CurrentUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    setCurrentUser(user); saveSession(user); setRole(found.role);
    return { success: true };
  };

  const signup = (data: { name: string; email: string; password: string; phone?: string; role: "student" | "scholar"; expertise?: string }): { success: boolean; error?: string } => {
    const trimEmail = data.email.trim().toLowerCase();
    const trimName = data.name.trim();
    const trimPw = data.password.trim();
    if (!trimName || !trimEmail || !trimPw) return { success: false, error: "Please fill in all required fields." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) return { success: false, error: "Please enter a valid email address." };
    if (trimPw.length < 8) return { success: false, error: "Password must be at least 8 characters." };
    const registeredUsers = loadUsers();
    if (registeredUsers.find(u => u.email.toLowerCase() === trimEmail)) return { success: false, error: "An account with this email already exists. Please sign in." };
    const newUser: RegisteredUser = { id: `user-${Date.now()}`, name: trimName, email: trimEmail, password: trimPw, phone: data.phone, role: data.role, expertise: data.expertise, createdAt: Date.now() };
    saveUsers([...registeredUsers, newUser]);
    const user: CurrentUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    setCurrentUser(user); saveSession(user); setRole(newUser.role);
    return { success: true };
  };

  const loginWithPhone = (phone: string, loginRole: "student" | "scholar"): { success: boolean; user?: RegisteredUser; error?: string } => {
    const trimPhone = phone.trim().replace(/\s/g, "");
    if (trimPhone.length !== 10 || !/^\d{10}$/.test(trimPhone)) return { success: false, error: "Please enter a valid 10-digit mobile number." };
    const registeredUsers = loadUsers();
    const found = registeredUsers.find(u => u.phone === trimPhone && u.role === loginRole);
    if (!found) return { success: false, error: "No account found with this number. Please sign up first." };
    return { success: true, user: found };
  };

  const completePhoneLogin = (phone: string, loginRole: "student" | "scholar"): { success: boolean; error?: string } => {
    const registeredUsers = loadUsers();
    const found = registeredUsers.find(u => u.phone === phone && u.role === loginRole);
    if (!found) return { success: false, error: "Account not found." };
    const user: CurrentUser = { id: found.id, name: found.name, email: found.phone!, role: found.role };
    setCurrentUser(user); saveSession(user); setRole(found.role);
    return { success: true };
  };

  const signupWithPhone = (data: { name: string; phone: string; role: "student" | "scholar"; expertise?: string }): { success: boolean; error?: string } => {
    const trimPhone = data.phone.trim().replace(/\s/g, "");
    const trimName = data.name.trim();
    if (!trimName) return { success: false, error: "Please enter your full name." };
    if (!/^\d{10}$/.test(trimPhone)) return { success: false, error: "Please enter a valid 10-digit mobile number." };
    const registeredUsers = loadUsers();
    if (registeredUsers.find(u => u.phone === trimPhone && u.role === data.role)) return { success: false, error: "An account with this number already exists. Please sign in." };
    const newUser: RegisteredUser = { id: `user-${Date.now()}`, name: trimName, email: `phone_${trimPhone}@scholarstack.local`, password: "", phone: trimPhone, role: data.role, expertise: data.expertise, createdAt: Date.now() };
    saveUsers([...registeredUsers, newUser]);
    const user: CurrentUser = { id: newUser.id, name: newUser.name, email: newUser.phone!, role: newUser.role };
    setCurrentUser(user); saveSession(user); setRole(newUser.role);
    return { success: true };
  };

  const logout = () => { setCurrentUser(null); setRole(null); saveSession(null); };

  const addPurchased = (id: number) => setPurchased(prev => new Set([...prev, id]));
  const toggleBookmark = (id: number) => setBookmarked(prev => {
    const ns = new Set(prev);
    ns.has(id) ? ns.delete(id) : ns.add(id);
    return ns;
  });
  const addUpload = (item: UploadItem) => setUploads(prev => [...prev, item]);
  const approveContent = (id: number) => setUploads(prev => prev.map(u => u.id === id ? { ...u, status: "live" } : u));
  const rejectContent = (id: number) => setUploads(prev => prev.map(u => u.id === id ? { ...u, status: "rejected" } : u));
  const removeScholar = (id: number) => setPendingScholars(prev => prev.filter(s => s.id !== id));
  const banUser = (id: number) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "banned" } : u));

  return (
    <AppContext.Provider value={{
      role, setRole, currentUser, login, signup, signupWithPhone, loginWithPhone, completePhoneLogin, logout,
      purchased, addPurchased, bookmarked, toggleBookmark,
      uploads, addUpload, approveContent, rejectContent,
      pendingScholars, removeScholar, users, banUser,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
