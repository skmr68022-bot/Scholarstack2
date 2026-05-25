
import { createContext, useContext, useState } from "react";

type Role = "student" | "scholar" | "admin" | null;

interface AppContextType {
  role: Role;
  setRole: (r: Role) => void;
  purchased: Set<number>;
  addPurchased: (id: number) => void;
  bookmarked: Set<number>;
  toggleBookmark: (id: number) => void;
  uploads: UploadItem[];
  addUpload: (item: UploadItem) => void;
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
  sales: number;
  earnings: string;
  rating: number;
  status: string;
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

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [purchased, setPurchased] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [uploads, setUploads] = useState<UploadItem[]>([
    { id:1, title:"UPSC Polity Complete Notes 2025", type:"PDF", price:"₹299", sales:1240, earnings:"₹37,076", rating:4.9, status:"active" },
    { id:2, title:"Modern History Short Notes", type:"PDF", price:"₹149", sales:890, earnings:"₹13,261", rating:4.8, status:"active" },
    { id:3, title:"Polity Shorts Series", type:"Video", price:"Free", sales:14200, earnings:"₹0", rating:4.7, status:"active" },
  ]);
  const [pendingScholars, setPendingScholars] = useState<PendingScholar[]>([
    { id:1, name:"Neha Gupta", tag:"NEET Expert", avatar:"NG", bg:"from-pink-400 to-rose-400" },
    { id:2, name:"Vikram Rao", tag:"UPSC Notes", avatar:"VR", bg:"from-orange-400 to-red-400" },
    { id:3, name:"Sonia K.", tag:"CAT Mentor", avatar:"SK", bg:"from-blue-400 to-indigo-400" },
  ]);
  const [users, setUsers] = useState<AdminUser[]>([
    { id:1, name:"Priya Sharma", email:"priya@email.com", role:"Student", plan:"Pro", status:"active" },
    { id:2, name:"Dr. Rajiv M.", email:"rajiv@email.com", role:"Scholar", plan:"Verified", status:"active" },
    { id:3, name:"Rahul Verma", email:"rahul@email.com", role:"Student", plan:"Free", status:"active" },
    { id:4, name:"Spam User", email:"spam@test.com", role:"Student", plan:"Free", status:"flagged" },
  ]);

  const addPurchased = (id: number) => setPurchased(prev => new Set([...prev, id]));
  const toggleBookmark = (id: number) => setBookmarked(prev => {
    const ns = new Set(prev);
    ns.has(id) ? ns.delete(id) : ns.add(id);
    return ns;
  });
  const addUpload = (item: UploadItem) => setUploads(prev => [...prev, item]);
  const removeScholar = (id: number) => setPendingScholars(prev => prev.filter(s => s.id !== id));
  const banUser = (id: number) => setUsers(prev => prev.map(u => u.id === id ? {...u, status:"banned"} : u));

  return (
    <AppContext.Provider value={{ role, setRole, purchased, addPurchased, bookmarked, toggleBookmark, uploads, addUpload, pendingScholars, removeScholar, users, banUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
