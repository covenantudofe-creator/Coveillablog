import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingControls from "./components/FloatingControls";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Scripts from "./pages/Scripts";
import Articles from "./pages/Articles";
import ScriptDetails from "./pages/ScriptDetails";
import ArticleDetails from "./pages/ArticleDetails";
import AdminMessages from "./pages/AdminMessages";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <FloatingControls />

        <main>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* About */}
            <Route path="/about" element={<About />} />

            {/* Contact */}
            <Route path="/contact" element={<Contact />} />

            {/* Scripts */}
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/script/:slug" element={<ScriptDetails />} />

            {/* Articles */}
            <Route path="/articles" element={<Articles />} />
            <Route path="/article/:slug" element={<ArticleDetails />} />

            {/* Admin */}
            <Route
              path="/admin/messages"
              element={<AdminMessages />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;