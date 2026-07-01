import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close menu with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="navbar">

      {/* LOGO */}
      <Link
        to="/"
        className="logo"
        onClick={closeMenu}
      >
        COVEILLA BLOG
      </Link>

      {/* MOBILE MENU BUTTON */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* NAVIGATION */}
      <nav
        id="main-navigation"
        className={`nav-links ${menuOpen ? "active" : ""}`}
      >
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/scripts" onClick={closeMenu}>
          Scripts
        </Link>

        <Link to="/articles" onClick={closeMenu}>
          Articles
        </Link>

        <Link to="/about" onClick={closeMenu}>
          About
        </Link>

        <Link to="/contact" onClick={closeMenu}>
          Contact
        </Link>
      </nav>

    </header>
  );
};

export default Navbar;