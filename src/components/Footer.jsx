import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <h3 className="footer-title">
          Godscovenant Patrick Udofe
        </h3>

        {/* BRAND ROLES */}
        <p className="footer-role">
          Screenwriter • Creative Writer • Storyteller
        </p>

        {/* CONTACT */}
        <div className="footer-contact">
          <p>
            📩 <a href="mailto:Coveillablog@gmail.com">Coveillablog@gmail.com</a>
          </p>

          <p>
            📞 <a href="tel:+2349134020125">+234 9134020125</a>
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/scripts">Scripts</Link>
          <Link to="/articles">Articles</Link>
        </div>

        <div className="footer-divider"></div>

        <p className="copyright">
          © {new Date().getFullYear()} All Rights Reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;