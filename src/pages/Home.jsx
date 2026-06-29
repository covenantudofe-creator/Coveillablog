import Hero from "../components/Hero";
import BlogCard from "../components/BlogCard";
import ScriptCard from "../components/ScriptCard";
import Newsletter from "../components/Newsletter";

import { articles } from "../data/articles";
import { scripts } from "../data/scripts";

import { Link } from "react-router-dom";

import "../styles/Home.css";

const Home = () => {
  return (
    <main className="home-page">

      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= PAGE CONTENT ================= */}
      <div className="home-container">

        {/* ================= FEATURED SCREENPLAYS ================= */}
        <section className="home-section">

          <div className="section-header">

            <div>

              <p className="section-kicker">
                FEATURED COLLECTION
              </p>

              <h2>
                Original Screenplays
              </h2>

              <p className="section-description">
                Character-driven stories written with cinematic emotion,
                unforgettable conflicts, and powerful endings.
              </p>

            </div>

            <Link
              to="/scripts"
              className="section-link"
            >
              View Library →
            </Link>

          </div>

          <div className="home-grid">

            {scripts.slice(0, 4).map((script) => (
              <ScriptCard
                key={script.slug}
                script={script}
              />
            ))}

          </div>

        </section>

        {/* ================= LATEST ARTICLES ================= */}
        <section className="home-section">

          <div className="section-header">

            <div>

              <p className="section-kicker">
                LATEST WRITING
              </p>

              <h2>
                Articles & Reflections
              </h2>

              <p className="section-description">
                Essays, reflections, psychology, creativity,
                and the stories behind the storyteller.
              </p>

            </div>

            <Link
              to="/articles"
              className="section-link"
            >
              Explore Articles →
            </Link>

          </div>

          <div className="home-grid">

            {articles.slice(0, 4).map((article) => (
              <BlogCard
                key={article.slug}
                item={article}
              />
            ))}

          </div>

        </section>

        {/* ================= CINEMATIC QUOTE ================= */}
        <section className="cinema-quote">

          <p className="section-kicker">
            COVEILLA
          </p>

          <h2>
            "Stories don't end when the credits roll.
            The best ones stay with you."
          </h2>

        </section>

        {/* ================= CALL TO ACTION ================= */}
        <section className="home-cta">

          <div className="cta-content">

            <p className="section-kicker">
              START YOUR JOURNEY
            </p>

            <h2>
              Discover Stories Worth Remembering
            </h2>

            <p>
              Explore original screenplays, thoughtful articles,
              and cinematic storytelling created to inspire,
              challenge, and stay with you long after you've finished reading.
            </p>

            <Link
              to="/scripts"
              className="featured-btn"
            >
              Explore Coveilla
            </Link>

          </div>

        </section>

        {/* ================= NEWSLETTER ================= */}
        <section className="home-newsletter">

          <Newsletter />

        </section>

      </div>

    </main>
  );
};

export default Home;

