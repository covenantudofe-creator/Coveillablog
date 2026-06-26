import { useParams, Link } from "react-router-dom";
import { articles } from "../data/articles";
import "../styles/ArticleDetails.css";

function ArticleDetails() {
  const { slug } = useParams();

  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return (
      <main className="article-details">
        <section className="article-body">
          <article className="article-text">
            <h2>Article Not Found</h2>
            <p>The article you’re looking for doesn’t exist.</p>
          </article>
        </section>
      </main>
    );
  }

  const articleTag = article.category || article.genre || "Article";

  const paragraphs = article.content
    ? article.content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
    : [];

  const relatedArticles = articles
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  return (
    <main className="article-details">
      {/* HERO */}
      <header
        className="article-hero"
        style={{
          backgroundImage: `url(${article.image})`,
        }}
      >
        <div className="article-overlay">
          <div className="article-content">
            <span className="article-category">{articleTag}</span>

            <h1>{article.title}</h1>

            {article.subtitle && (
              <p className="article-subtitle">{article.subtitle}</p>
            )}
          </div>
        </div>
      </header>

      {/* ARTICLE BODY */}
      <section className="article-body">
        <article className="article-text">
          {paragraphs.map((paragraph, index) => {
            if (paragraph.startsWith("# ")) {
              return <h2 key={index}>{paragraph.replace("# ", "")}</h2>;
            }

            if (paragraph.startsWith("## ")) {
              return <h3 key={index}>{paragraph.replace("## ", "")}</h3>;
            }

            return <p key={index}>{paragraph}</p>;
          })}
        </article>
      </section>

      {/* CONTINUE READING */}
      <section className="continue-reading">
        <div className="continue-reading-inner">
          <div className="continue-header">
            <p className="continue-kicker">KEEP READING</p>
            <h2>Continue Reading</h2>
            <p className="continue-subtext">
              Explore more reflections, psychology pieces, and writing from Coveilla.
            </p>
          </div>

          <div className="continue-grid">
            {relatedArticles.map((item) => {
              const tag = item.category || item.genre || "Article";

              const excerpt =
                item.subtitle ||
                item.content
                  ?.replace(/[#*`]/g, "")
                  .replace(/\s+/g, " ")
                  .trim()
                  .slice(0, 110) + "...";

              return (
                <Link
                  key={item.slug}
                  to={`/article/${item.slug}`}
                  className="article-card"
                >
                  <div className="article-card-image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="article-card-content">
                    <span className="article-category">{tag}</span>

                    <h3 className="article-title">{item.title}</h3>

                    <p className="article-excerpt">{excerpt}</p>

                    <span className="article-read">Read Article →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ArticleDetails;