import { Link } from "react-router-dom";
import heroImage from "../assets/hero-image.jpg";
import "../styles/Hero.css";

const Hero = () => {
  return (
    <section className="hero">

      <div className="hero-overlay"></div>

      <div className="hero-container">

        {/* LEFT */}

        <div className="hero-content">

          <div className="hero-kicker">
            <span className="hero-line"></span>
            <p>WELCOME TO COVEILLA</p>
          </div>

          <h1 className="hero-title">
            Stories That
            <br />
            Feel <span>Cinematic.</span>
          </h1>

          <p className="hero-description">
            Original screenplays, immersive stories,
            and thoughtful articles crafted to leave
            an unforgettable impression.
          </p>

          <div className="hero-actions">

            <Link
              to="/scripts"
              className="hero-btn primary"
            >
              Explore Scripts
            </Link>

            <Link
              to="/articles"
              className="hero-btn secondary"
            >
              Read Articles
            </Link>

          </div>

          <div className="hero-features">

            <div>
              <h3>20+</h3>
              <p>Stories</p>
            </div>

            <div>
              <h3>Original</h3>
              <p>Screenplays</p>
            </div>

            <div>
              <h3>Articles</h3>
              <p>Creative Writing</p>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="hero-image">

          <img
            src={heroImage}
            alt="Cinematic writing"
          />

          <div className="hero-image-overlay">

            <span>FEATURED</span>

            <h3>WHEN THE SMOKE CLEARS</h3>

            <p>
              A cinematic military thriller.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;