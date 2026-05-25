
export const examTags = ["UPSC","NEET","JEE","CAT","SSC","GATE","CUET","Banking","State PSC","Defence"];

export const universityTags = ["Delhi University","Mumbai University","Anna University","VTU","Pune University","Osmania University","Calcutta University","BHU","JNU","IGNOU","Madras University","Rajasthan University"];

export const boardTags = {
  cbse:  ["Class 9","Class 10","Class 11","Class 12"],
  cisce: ["Class 9 (ICSE)","Class 10 (ICSE)","Class 11 (ISC)","Class 12 (ISC)"],
  state: ["AP Board","UP Board","Maharashtra Board","Tamil Nadu Board","Karnataka Board","West Bengal Board","Rajasthan Board","Bihar Board","MP Board","Gujarat Board"],
};

export type NoteCategory = "competitive" | "university" | "board";

export interface Note {
  id: number;
  title: string;
  scholar: string;
  price: string;
  original: string;
  rating: number;
  reviews: number;
  tag: string;
  exam: string;
  pages: number;
  color: string;
  category: NoteCategory;
  boardType?: "CBSE" | "CISCE" | "State Board";
  subject?: string;
}

export interface Scholar {
  name: string;
  tag: string;
  avatar: string;
  bg: string;
  rating: number;
  students: string;
  verified: boolean;
}

export interface Reel {
  id: number;
  title: string;
  scholar: string;
  avatar: string;
  bg: string;
  exam: string;
  likes: string;
  comments: string;
  saves: string;
  premium: boolean;
}

export const notes: Note[] = [
  /* ── Competitive ── */
  { id:1,  title:"UPSC Polity Complete Notes 2025",   scholar:"Dr. Rajiv Menon", price:"₹299", original:"₹799", rating:4.9, reviews:12400, tag:"Bestseller", exam:"UPSC",    pages:324, color:"bg-orange-500",  category:"competitive" },
  { id:2,  title:"NEET Biology Master Notes",         scholar:"Priya Sharma",    price:"₹249", original:"₹599", rating:4.9, reviews:8200,  tag:"Top Rated",  exam:"NEET",    pages:210, color:"bg-green-500",   category:"competitive" },
  { id:3,  title:"JEE Math Shortcut Tricks",          scholar:"Karan Mehta",     price:"₹199", original:"₹499", rating:4.8, reviews:6100,  tag:"Trending",   exam:"JEE",     pages:180, color:"bg-blue-500",    category:"competitive" },
  { id:4,  title:"SSC CGL Math Tricks",               scholar:"Rahul Verma",     price:"Free", original:"",     rating:4.7, reviews:19400, tag:"Free",        exam:"SSC",     pages:90,  color:"bg-yellow-500",  category:"competitive" },
  { id:5,  title:"CAT Verbal Ability Notes",          scholar:"MBA Guru",        price:"₹399", original:"₹999", rating:4.6, reviews:3200,  tag:"New",         exam:"CAT",     pages:150, color:"bg-purple-500",  category:"competitive" },
  { id:6,  title:"GATE ECE Full Syllabus",            scholar:"Rohit Singh",     price:"₹349", original:"₹899", rating:4.8, reviews:4100,  tag:"Complete",    exam:"GATE",    pages:280, color:"bg-cyan-500",    category:"competitive" },
  { id:7,  title:"UPSC Modern History Notes",         scholar:"Dr. Rajiv Menon", price:"₹199", original:"₹499", rating:4.7, reviews:7800,  tag:"Popular",     exam:"UPSC",    pages:180, color:"bg-orange-400",  category:"competitive" },
  { id:8,  title:"NEET Chemistry Formulas",           scholar:"Priya Sharma",    price:"₹149", original:"₹399", rating:4.8, reviews:5600,  tag:"Quick Ref",   exam:"NEET",    pages:90,  color:"bg-green-400",   category:"competitive" },
  { id:9,  title:"JEE Physics Formula Sheet",         scholar:"Karan Mehta",     price:"Free", original:"",     rating:4.9, reviews:22000, tag:"Free",        exam:"JEE",     pages:60,  color:"bg-blue-400",    category:"competitive" },

  /* ── University ── */
  { id:10, title:"B.Com Financial Accounting Notes",   scholar:"CA Aryan Shah",   price:"₹179", original:"₹449", rating:4.7, reviews:3100, tag:"Bestseller", exam:"Delhi University",    pages:200, color:"bg-violet-500",  category:"university", subject:"Accounting" },
  { id:11, title:"Engineering Maths – Sem 3 (VTU)",   scholar:"Prof. Sanjay K",  price:"₹149", original:"₹349", rating:4.6, reviews:5400, tag:"Trending",   exam:"VTU",                 pages:160, color:"bg-indigo-500",  category:"university", subject:"Mathematics" },
  { id:12, title:"Data Structures & Algorithms Notes", scholar:"Code with Ria",   price:"₹229", original:"₹549", rating:4.9, reviews:7200, tag:"Top Rated",  exam:"Mumbai University",   pages:240, color:"bg-pink-500",    category:"university", subject:"Computer Science" },
  { id:13, title:"Organic Chemistry – BSc 2nd Year",  scholar:"Dr. Meena P",     price:"Free", original:"",     rating:4.8, reviews:8900, tag:"Free",        exam:"Pune University",     pages:130, color:"bg-emerald-500", category:"university", subject:"Chemistry" },
  { id:14, title:"Indian Constitution – BA LLB",      scholar:"Adv. Kapoor",     price:"₹199", original:"₹499", rating:4.7, reviews:2800, tag:"Popular",    exam:"Calcutta University", pages:180, color:"bg-amber-500",   category:"university", subject:"Law" },
  { id:15, title:"Macroeconomics Short Notes",         scholar:"Econ Queen",      price:"₹129", original:"₹299", rating:4.5, reviews:1900, tag:"New",         exam:"Delhi University",    pages:110, color:"bg-teal-500",    category:"university", subject:"Economics" },
  { id:16, title:"Machine Learning Essentials",        scholar:"AI Ananya",       price:"₹299", original:"₹699", rating:4.9, reviews:6100, tag:"Hot",         exam:"Anna University",     pages:260, color:"bg-rose-500",    category:"university", subject:"Computer Science" },

  /* ── Board – CBSE ── */
  { id:17, title:"Class 12 Physics CBSE Notes",       scholar:"Neha Jain",       price:"₹149", original:"₹349", rating:4.8, reviews:14200, tag:"Bestseller", exam:"Class 12", pages:190, color:"bg-blue-600",    category:"board", boardType:"CBSE",       subject:"Physics" },
  { id:18, title:"Class 10 Math Formula Booklet",     scholar:"Sumit Sir",       price:"Free", original:"",     rating:4.9, reviews:32000, tag:"Free",        exam:"Class 10", pages:60,  color:"bg-green-600",   category:"board", boardType:"CBSE",       subject:"Mathematics" },
  { id:19, title:"Class 12 Biology CBSE Diagrams",    scholar:"BioStar Priya",   price:"₹99",  original:"₹249", rating:4.7, reviews:9800,  tag:"Trending",   exam:"Class 12", pages:80,  color:"bg-emerald-600", category:"board", boardType:"CBSE",       subject:"Biology" },
  { id:20, title:"Class 11 Chemistry Revision",       scholar:"Chem Guru",       price:"₹129", original:"₹299", rating:4.6, reviews:6700,  tag:"Popular",    exam:"Class 11", pages:120, color:"bg-yellow-600",  category:"board", boardType:"CBSE",       subject:"Chemistry" },

  /* ── Board – CISCE ── */
  { id:21, title:"ICSE Class 10 History Notes",       scholar:"History Hub",     price:"₹129", original:"₹299", rating:4.7, reviews:4200,  tag:"Top Rated",  exam:"Class 10 (ICSE)", pages:150, color:"bg-orange-600", category:"board", boardType:"CISCE",   subject:"History" },
  { id:22, title:"ISC Class 12 Math Solutions",       scholar:"MathsIQ",         price:"₹179", original:"₹399", rating:4.8, reviews:3800,  tag:"Bestseller", exam:"Class 12 (ISC)",  pages:200, color:"bg-red-600",    category:"board", boardType:"CISCE",   subject:"Mathematics" },
  { id:23, title:"ICSE Class 10 English Notes",       scholar:"Grammar Guru",    price:"Free", original:"",     rating:4.6, reviews:11200, tag:"Free",        exam:"Class 10 (ICSE)", pages:90,  color:"bg-violet-600", category:"board", boardType:"CISCE",   subject:"English" },

  /* ── Board – State Boards ── */
  { id:24, title:"Maharashtra HSC Physics Notes",     scholar:"Pune Toppers",    price:"₹149", original:"₹349", rating:4.7, reviews:8100,  tag:"Popular",    exam:"Maharashtra Board", pages:170, color:"bg-cyan-600",   category:"board", boardType:"State Board", subject:"Physics" },
  { id:25, title:"UP Board Class 12 Hindi Notes",     scholar:"Hindi Master",    price:"Free", original:"",     rating:4.8, reviews:28000, tag:"Free",        exam:"UP Board",          pages:140, color:"bg-lime-600",   category:"board", boardType:"State Board", subject:"Hindi" },
  { id:26, title:"Tamil Nadu Board Bio Guide",        scholar:"TN Toppers",      price:"₹119", original:"₹279", rating:4.6, reviews:5200,  tag:"Trending",   exam:"Tamil Nadu Board",  pages:130, color:"bg-fuchsia-600",category:"board", boardType:"State Board", subject:"Biology" },
];

export const scholars: Scholar[] = [
  { name:"Dr. Rajiv Menon", tag:"IAS AIR 7 · UPSC", avatar:"RM", bg:"from-orange-400 to-red-500", rating:4.9, students:"48K", verified:true },
  { name:"Priya Sharma", tag:"NEET 720/720", avatar:"PS", bg:"from-pink-400 to-rose-500", rating:4.8, students:"62K", verified:true },
  { name:"Karan Mehta", tag:"IIT Bombay · JEE", avatar:"KM", bg:"from-blue-400 to-indigo-500", rating:4.9, students:"35K", verified:true },
  { name:"MBA Guru", tag:"CAT 99.8%ile", avatar:"MG", bg:"from-purple-400 to-violet-500", rating:4.7, students:"29K", verified:true },
];

export const reels: Reel[] = [
  { id:1, title:"Preamble in 60 Seconds", scholar:"Dr. Rajiv Menon", avatar:"RM", bg:"from-orange-400 to-red-500", exam:"UPSC", likes:"24.8K", comments:"1.2K", saves:"8.9K", premium:false },
  { id:2, title:"Mitosis vs Meiosis", scholar:"Priya Sharma", avatar:"PS", bg:"from-pink-400 to-rose-500", exam:"NEET", likes:"41.2K", comments:"3.4K", saves:"18.2K", premium:false },
  { id:3, title:"Integration by Parts", scholar:"Karan Mehta", avatar:"KM", bg:"from-blue-400 to-indigo-500", exam:"JEE", likes:"18.6K", comments:"940", saves:"12.4K", premium:true },
];
