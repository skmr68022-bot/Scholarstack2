import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "./context/AppContext";
import NotFound from "@/pages/not-found";

import Splash from "./pages/Splash";
import RoleSelect from "./pages/RoleSelect";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

import StudentLayout from "./layouts/StudentLayout";
import StudentHome from "./pages/student/Home";
import Browse from "./pages/student/Browse";
import NoteDetail from "./pages/student/NoteDetail";
import Reels from "./pages/student/Reels";
import Library from "./pages/student/Library";
import AiTutor from "./pages/student/AiTutor";
import Orders from "./pages/student/Orders";
import Profile from "./pages/student/Profile";

import ScholarLayout from "./layouts/ScholarLayout";
import ScholarOverview from "./pages/scholar/Overview";
import Upload from "./pages/scholar/Upload";
import VideoUpload from "./pages/scholar/VideoUpload";
import Content from "./pages/scholar/Content";
import Earnings from "./pages/scholar/Earnings";
import Analytics from "./pages/scholar/Analytics";
import ScholarProfile from "./pages/scholar/Profile";

const queryClient = new QueryClient();

function RequireAuth({ children, requiredRole }: { children: React.ReactNode; requiredRole: "student" | "scholar" | "admin" }) {
  const { currentUser, loading } = useApp();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070709]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!currentUser) {
    setLocation(`/auth/${requiredRole}`);
    return null;
  }
  if (currentUser.role !== requiredRole) {
    setLocation(`/auth/${requiredRole}`);
    return null;
  }
  return <>{children}</>;
}

function StudentRoutes() {
  return (
    <RequireAuth requiredRole="student">
      <StudentLayout>
        <Switch>
          <Route path="/student" component={StudentHome} />
          <Route path="/student/browse" component={Browse} />
          <Route path="/student/notes/:id" component={NoteDetail} />
          <Route path="/student/reels" component={Reels} />
          <Route path="/student/library" component={Library} />
          <Route path="/student/ai" component={AiTutor} />
          <Route path="/student/orders" component={Orders} />
          <Route path="/student/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </StudentLayout>
    </RequireAuth>
  );
}

function ScholarRoutes() {
  return (
    <RequireAuth requiredRole="scholar">
      <ScholarLayout>
        <Switch>
          <Route path="/scholar" component={ScholarOverview} />
          <Route path="/scholar/upload" component={Upload} />
          <Route path="/scholar/video" component={VideoUpload} />
          <Route path="/scholar/content" component={Content} />
          <Route path="/scholar/earnings" component={Earnings} />
          <Route path="/scholar/analytics" component={Analytics} />
          <Route path="/scholar/profile" component={ScholarProfile} />
          <Route component={NotFound} />
        </Switch>
      </ScholarLayout>
    </RequireAuth>
  );
}

function AdminRoute() {
  return (
    <RequireAuth requiredRole="admin">
      <Admin />
    </RequireAuth>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/role" component={RoleSelect} />
      <Route path="/auth/:role" component={Auth} />
      <Route path="/admin" component={AdminRoute} />
      <Route path="/student/:rest*" component={StudentRoutes} />
      <Route path="/student" component={StudentRoutes} />
      <Route path="/scholar/:rest*" component={ScholarRoutes} />
      <Route path="/scholar" component={ScholarRoutes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
