import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/app-layout";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Reception from "@/pages/reception";
import Sampling from "@/pages/sampling";
import Results from "@/pages/results";
import Worklists from "@/pages/worklists";
import QualityControl from "@/pages/quality-control";
import Outbound from "@/pages/outbound";
import Reports from "@/pages/reports";
import Financial from "@/pages/financial";
import UserManagement from "@/pages/user-management";
import Pricing from "@/pages/pricing";
import Setup from "@/pages/setup";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/reception" component={Reception} />
      <Route path="/sampling" component={Sampling} />
      <Route path="/results" component={Results} />
      <Route path="/worklists" component={Worklists} />
      <Route path="/quality-control" component={QualityControl} />
      <Route path="/outbound" component={Outbound} />
      <Route path="/reports" component={Reports} />
      <Route path="/financial" component={Financial} />
      <Route path="/users" component={UserManagement} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/setup" component={Setup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLayout>
          <Router />
        </AppLayout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
