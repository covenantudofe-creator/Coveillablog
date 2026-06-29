import { useParams, Link } from "react-router-dom";
import { articles } from "../data/articles";
import "../styles/ArticleDetails.css";

const ArticleDetails = () => {
  const { slug } = useParams();

  const article = articles.find(
    (item) => item.slug === slug
  );

  if (!article) {
    return (
      <section className="article-details">

        <div className="article-not-found">

          <h1>Article Not Found</h1>

          <p>
            The article you're looking for doesn't exist
            or may have been removed.
          </p>

          <Link
            to="/articles"
            className="article-btn"
          >
            ← Back to Articles
          </Link>

        </div>

      </section>
    );
  }

  return (
    <section className="article-details">

      {/* ================= HERO ================= */}

      <div className="article-hero">

        <img
          src={article.image}
          alt={article.title}
        />

        <div className="article-hero-overlay">

          <div className="article-hero-content">

            <span className="article-category">
              {article.category || "Article"}
            </span>

            <h1>{article.title}</h1>

            {article.subtitle && (
              <p className="article-subtitle">
                {article.subtitle}
              </p>
            )}

          </div>

        </div>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="article-wrapper">

        <article className="article-content">

          <div className="article-meta">

            <span>
              By{" "}
              <strong>
                {article.author || "Godscovenant Patrick Udofe"}
              </strong>
            </span>

            {article.date && (
              <span>{article.date}</span>
            )}

          </div>

          <div className="article-divider"></div>

          <div className="article-body">

            {typeof article.content === "string" ? (

              article.content
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))

            ) : (

              article.content

            )}

          </div>

          <div className="article-footer">

            <Link
              to="/articles"
              className="article-btn"
            >
              ← Back to Articles
            </Link>

          </div>

        </article>

      </div>

    </section>
  );
};

export default ArticleDetails;