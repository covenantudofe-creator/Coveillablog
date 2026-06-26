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

      <div className="home-container">

        {/* ================= FEATURED STORY ================= */}
        <section className="featured-story">

          <div className="featured-story-text">

            <p className="section-kicker">
              FEATURED EXPERIENCE
            </p>

            <h2>Stories That Stay With You</h2>

            <p className="featured-description">
              Every screenplay, article, and character on Coveilla is
              written to leave something behind—an emotion, a question,
              or a memory that lingers long after the final page.
            </p>

            <Link to="/scripts" className="featured-btn">
              Start Reading →
            </Link>

          </div>

          <div className="featured-story-image">

            <img
  src="https://i.pinimg.com/1200x/53/b0/27/53b027de56295e89a773d411cd4256a2.jpg"
  alt="Featured Story"
/>
          </div>

        </section>

        {/* ================= FEATURED SCRIPTS ================= */}
        <section className="home-section">

          <div className="section-header">

            <div>
              <p className="section-kicker">
                COVEILLA ORIGINALS
              </p>

              <h2>Featured Scripts</h2>
            </div>

            <Link
              to="/scripts"
              className="section-link"
            >
              View All →
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

              <h2>Latest Articles</h2>
            </div>

            <Link
              to="/articles"
              className="section-link"
            >
              View All →
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

        {/* ================= CTA SECTION ================= */}
        <section className="home-cta">

          <div className="cta-content">

            <h2>
              Great stories deserve great readers.
            </h2>

            <p>
              Dive into cinematic screenplays,
              thoughtful articles, and unforgettable
              storytelling crafted to inspire.
            </p>

            <Link
              to="/articles"
              className="featured-btn"
            >
              Explore the Collection
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