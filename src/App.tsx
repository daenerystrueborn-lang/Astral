import { Switch, Route, Router as WouterRouter } from "wouter";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import HomePage from "@/pages/Home";
import PremiumPage from "@/pages/Premium";
import RankingsPage from "@/pages/Rankings";
import FactionsPage from "@/pages/Factions";
import PlayerProfilePage from "@/pages/PlayerProfile";
import ProfilePage from "@/pages/Profile";
import SeasonPage from "@/pages/Season";
import MembershipPage from "@/pages/Membership";
import LoginPage from "@/pages/Login";
import TermsPage from "@/pages/Terms";
import NotFoundPage from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/premium" component={PremiumPage} />
      <Route path="/rankings" component={RankingsPage} />
      <Route path="/factions" component={FactionsPage} />
      <Route path="/profile/:username" component={PlayerProfilePage} />
      <Route path="/me" component={ProfilePage} />
      <Route path="/season" component={SeasonPage} />
      <Route path="/membership" component={MembershipPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/terms" component={TermsPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Navbar />
        <Router />
        <Footer />
        <MobileBottomNav />
        <AuthModal />
      </WouterRouter>
    </AuthProvider>
  );
}

export default App;
