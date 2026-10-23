import "./App.css";

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingControls from "./components/FloatingControls";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Scripts from "./pages/Scripts";
import Articles from "./pages/Articles";
import TVSeries from "./pages/TVSeries";
import ScriptDetails from "./pages/ScriptDetails";
import ArticleDetails from "./pages/ArticleDetails";
import AdminMessages from "./pages/AdminMessages";
import SignIn from "./pages/SignIn";
import KidsCorner from "./pages/KidsCorner";
import AdminLogin from "./pages/AdminLogin";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import RequireRole from "./auth/RequireRole";
import RequireAuth from "./auth/RequireAuth";
import { AuthProvider } from "./auth/AuthProvider";
import { useAuth } from "./auth/useAuth";

function LandingRoute() {
  const { user, loading } = useAuth();
  if (loading || !user) return <SignIn />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return <Home />;
}

function AppLayout() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const showSiteChrome = !["/sign-in", "/reset-password"].includes(location.pathname)
    && !(location.pathname === "/" && (loading || !user));

  return (
    <div className="app">
      {showSiteChrome && <Navbar />}
      {showSiteChrome && <FloatingControls />}
      <main>
        <Routes>
          <Route path="/" element={<LandingRoute />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/kids" element={<KidsCorner />} />

          <Route path="/about" element={<RequireAuth><About /></RequireAuth>} />
          <Route path="/contact" element={<RequireAuth><Contact /></RequireAuth>} />
          <Route path="/scripts" element={<RequireAuth><Scripts /></RequireAuth>} />
          <Route path="/script/:slug" element={<RequireAuth><ScriptDetails /></RequireAuth>} />
          <Route path="/tv-series" element={<RequireAuth><TVSeries /></RequireAuth>} />
          <Route path="/articles" element={<RequireAuth><Articles /></RequireAuth>} />
          <Route path="/article/:slug" element={<RequireAuth><ArticleDetails /></RequireAuth>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
          <Route path="/admin/articles/new" element={<RequireRole role="admin"><CreateArticle /></RequireRole>} />
          <Route path="/admin/articles/:slug/edit" element={<RequireRole role="admin"><EditArticle /></RequireRole>} />
          <Route path="/admin/messages" element={<RequireRole role="admin"><AdminMessages /></RequireRole>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showSiteChrome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
