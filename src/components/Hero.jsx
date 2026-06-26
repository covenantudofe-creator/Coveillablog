import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">

          <h1>
            Stories That <span>Stay With You</span>
          </h1>

          <p>
            Screenplays, stories and articles crafted
            to entertain, inspire and provoke thought.
          </p>

          <div className="hero-actions">

            <button
              className="hero-btn primary"
              onClick={() => navigate("/articles")}
            >
              Explore Articles
            </button>

            <button
              className="hero-btn secondary"
              onClick={() => navigate("/scripts")}
            >
              Read Scripts
            </button>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;