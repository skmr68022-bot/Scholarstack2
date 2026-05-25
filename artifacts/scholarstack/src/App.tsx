import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./context/AppContext";
import NotFound from "@/pages/not-found";

import Splash from "./pages/Splash";
import RoleSelect from "./pages/RoleSelect";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

import StudentLayout from "./layouts/StudentLayout";
import StudentHome from "./pages/student/Home";
import Notes from "./pages/student/Notes";
import NoteDetail from "./pages/student/NoteDetail";
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

function StudentRoutes() {
  return (
    <StudentLayout>
      <Switch>
        <Route path="/student" component={StudentHome} />
        <Route path="/student/notes" component={Notes} />
        <Route path="/student/notes/:id" component={NoteDetail} />
        <Route path="/student/reels" component={Reels} />
        <Route path="/student/library" component={Library} />
        <Route path="/student/ai" component={AiTutor} />
        <Route path="/student/orders" component={Orders} />
        <Route path="/student/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </StudentLayout>
  );
}

function ScholarRoutes() {
  return (
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
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/role" component={RoleSelect} />
      <Route path="/auth/:role" component={Auth} />
      <Route path="/admin" component={Admin} />
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
