import { articles } from "../data/articles";
import { Link } from "react-router-dom";
import "../styles/Article.css";

function Articles() {
  return (
    <main className="articles-page">
      <div className="articles-container">
        {/* PAGE HEADER */}
        <section className="articles-hero">
         
          <h1 className="articles-heading">Articles & Reflections</h1>
          <p className="articles-intro">
            A collection of essays, reflections, psychology pieces, and personal
            writing exploring creativity, self-development, storytelling, and
            the emotional realities behind modern life.
          </p>
        </section>

        {/* ARTICLES GRID */}
        <section className="articles-section">
          <div className="articles-grid">
            {articles.map((article) => {
              const tag = article.category || article.genre || "Article";

              const excerpt =
                article.subtitle ||
                article.content
                  ?.replace(/[#*`]/g, "")
                  .replace(/\s+/g, " ")
                  .trim()
                  .slice(0, 120) + "...";

              return (
                <Link
                  key={article.slug}
                  to={`/article/${article.slug}`}
                  className="article-card"
                >
                  <div className="article-card-image">
                    <img src={article.image} alt={article.title} />
                  </div>

                  <div className="article-card-content">
                    <span className="article-category">{tag}</span>

                    <h2 className="article-title">{article.title}</h2>

                    <p className="article-excerpt">{excerpt}</p>

                    <span className="article-read">Read Article →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CONTINUE READING / EXPLORE MORE */}
        <section className="articles-extra">
          <div className="articles-extra-box">
            <p className="articles-extra-kicker">KEEP EXPLORING</p>
            <h3>Continue reading more stories from Coveilla</h3>
            <p>
              Dive deeper into writing, psychology, personal growth, and the
              thoughts behind the work. Every article is part of a bigger
              conversation.
            </p>

            <Link to="/" className="articles-extra-link">
              Back to Home →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Articles;