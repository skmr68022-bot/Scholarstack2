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
import Notes from "./pages/student/Notes";
import NoteDetail from "./pages/student/NoteDetail";
import UniversityNotes from "./pages/student/UniversityNotes";
import BoardNotes from "./pages/student/BoardNotes";
import Reels from "./pages/student/Reels";
import Library from "./pages/student/Library";
import AiTutor from "./pages/student/AiTutor";
import Orders from "./pages/student/Orders";
import Profile from "./pages/student/Profile";

import ScholarLayout from "./layouts/ScholarLayout";
import ScholarOverview from "./pages/scholar/Overview";
import Upload from "./pages/scholar/Upload";
import Content from "./pages/scholar/Content";
import Earnings from "./pages/scholar/Earnings";
import Analytics from "./pages/scholar/Analytics";

const queryClient = new QueryClient();

function RequireAuth({ children, requiredRole }: { children: React.ReactNode; requiredRole: "student" | "scholar" | "admin" }) {
  const { currentUser } = useApp();
  const [, setLocation] = useLocation();

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
          <Route path="/student/notes" component={Notes} />
          <Route path="/student/notes/:id" component={NoteDetail} />
          <Route path="/student/university" component={UniversityNotes} />
          <Route path="/student/board" component={BoardNotes} />
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
          <Route path="/scholar/content" component={Content} />
          <Route path="/scholar/earnings" component={Earnings} />
          <Route path="/scholar/analytics" component={Analytics} />
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
