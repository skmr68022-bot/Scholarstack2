
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
  category?: string;
  exam?: string;
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
  } catch {
    return [];
  }
}

function saveUsers(users: RegisteredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(user: CurrentUser | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => loadSession());
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

  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role);
    }
  }, []);

  const login = (email: string, password: string, loginRole: "student" | "scholar" | "admin"): { success: boolean; error?: string } => {
    const trimEmail = email.trim().toLowerCase();
    const trimPw = password.trim();

    if (!trimEmail || !trimPw) {
      return { success: false, error: "Please fill in all fields." };
    }

    if (loginRole === "admin") {
      if (trimEmail === ADMIN_EMAIL.toLowerCase() && trimPw === ADMIN_PASSWORD) {
        const user: CurrentUser = { id: "admin-1", name: "Admin", email: ADMIN_EMAIL, role: "admin" };
        setCurrentUser(user);
        saveSession(user);
        setRole("admin");
        return { success: true };
      }
      return { success: false, error: "Invalid admin credentials." };
    }

    const registeredUsers = loadUsers();
    const found = registeredUsers.find(
      u => u.email.toLowerCase() === trimEmail && u.password === trimPw && u.role === loginRole
    );

    if (!found) {
      const emailExists = registeredUsers.find(u => u.email.toLowerCase() === trimEmail);
      if (emailExists) {
        return { success: false, error: "Incorrect password." };
      }
      return { success: false, error: "No account found with this email. Please sign up." };
    }

    const user: CurrentUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    setCurrentUser(user);
    saveSession(user);
    setRole(found.role);
    return { success: true };
  };

  const signup = (data: { name: string; email: string; password: string; phone?: string; role: "student" | "scholar"; expertise?: string }): { success: boolean; error?: string } => {
    const trimEmail = data.email.trim().toLowerCase();
    const trimName = data.name.trim();
    const trimPw = data.password.trim();

    if (!trimName || !trimEmail || !trimPw) {
      return { success: false, error: "Please fill in all required fields." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }
    if (trimPw.length < 8) {
      return { success: false, error: "Password must be at least 8 characters." };
    }

    const registeredUsers = loadUsers();
    if (registeredUsers.find(u => u.email.toLowerCase() === trimEmail)) {
      return { success: false, error: "An account with this email already exists. Please sign in." };
    }

    const newUser: RegisteredUser = {
      id: `user-${Date.now()}`,
      name: trimName,
      email: trimEmail,
      password: trimPw,
      phone: data.phone,
      role: data.role,
      expertise: data.expertise,
      createdAt: Date.now(),
    };

    const updated = [...registeredUsers, newUser];
    saveUsers(updated);

    const user: CurrentUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    setCurrentUser(user);
    saveSession(user);
    setRole(newUser.role);
    return { success: true };
  };

  const loginWithPhone = (phone: string, loginRole: "student" | "scholar"): { success: boolean; user?: RegisteredUser; error?: string } => {
    const trimPhone = phone.trim().replace(/\s/g, "");
    if (trimPhone.length !== 10 || !/^\d{10}$/.test(trimPhone)) {
      return { success: false, error: "Please enter a valid 10-digit mobile number." };
    }

    const registeredUsers = loadUsers();
    const found = registeredUsers.find(u => u.phone === trimPhone && u.role === loginRole);
    if (!found) {
      return { success: false, error: "No account found with this number. Please sign up first." };
    }
    return { success: true, user: found };
  };

  const completePhoneLogin = (phone: string, loginRole: "student" | "scholar"): { success: boolean; error?: string } => {
    const registeredUsers = loadUsers();
    const found = registeredUsers.find(u => u.phone === phone && u.role === loginRole);
    if (!found) return { success: false, error: "Account not found." };
    const user: CurrentUser = { id: found.id, name: found.name, email: found.phone!, role: found.role };
    setCurrentUser(user);
    saveSession(user);
    setRole(found.role);
    return { success: true };
  };

  const signupWithPhone = (data: { name: string; phone: string; role: "student" | "scholar"; expertise?: string }): { success: boolean; error?: string } => {
    const trimPhone = data.phone.trim().replace(/\s/g, "");
    const trimName = data.name.trim();

    if (!trimName) return { success: false, error: "Please enter your full name." };
    if (!/^\d{10}$/.test(trimPhone)) return { success: false, error: "Please enter a valid 10-digit mobile number." };

    const registeredUsers = loadUsers();
    if (registeredUsers.find(u => u.phone === trimPhone && u.role === data.role)) {
      return { success: false, error: "An account with this number already exists. Please sign in." };
    }

    const newUser: RegisteredUser = {
      id: `user-${Date.now()}`,
      name: trimName,
      email: `phone_${trimPhone}@scholarstack.local`,
      password: "",
      phone: trimPhone,
      role: data.role,
      expertise: data.expertise,
      createdAt: Date.now(),
    };

    saveUsers([...registeredUsers, newUser]);
    const user: CurrentUser = { id: newUser.id, name: newUser.name, email: newUser.phone!, role: newUser.role };
    setCurrentUser(user);
    saveSession(user);
    setRole(newUser.role);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
    saveSession(null);
  };

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
    <AppContext.Provider value={{ role, setRole, currentUser, login, signup, signupWithPhone, loginWithPhone, completePhoneLogin, logout, purchased, addPurchased, bookmarked, toggleBookmark, uploads, addUpload, pendingScholars, removeScholar, users, banUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
