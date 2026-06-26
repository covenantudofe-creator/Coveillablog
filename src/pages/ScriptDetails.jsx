import { useParams, Link } from "react-router-dom";
import { scripts } from "../data/scripts";
import "../styles/ScriptDetails.css";

function ScriptDetails() {
  const { slug } = useParams();

  const scriptItem = scripts.find((item) => item.slug === slug);

  if (!scriptItem) {
    return (
      <main className="script-details">
        <section className="script-body">
          <article className="script-text">
            <h2>Script Not Found</h2>
            <p>The script you’re looking for doesn’t exist.</p>
            <Link to="/scripts" className="back-link">
              ← Back to Scripts
            </Link>
          </article>
        </section>
      </main>
    );
  }

  const paragraphs = scriptItem.script
    ? scriptItem.script
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
    : [];

  const relatedScripts = scripts
    .filter((item) => item.slug !== scriptItem.slug)
    .slice(0, 3);

  return (
    <main className="script-details">
      {/* HERO */}
      <header
        className="script-hero"
        style={{
          backgroundImage: `url(${scriptItem.image})`,
        }}
      >
        <div className="script-overlay">
          <div className="script-content">
            <span className="script-genre">
              {scriptItem.genre || "Script"}
            </span>

            <h1>{scriptItem.title}</h1>

            <div className="script-meta">
              {scriptItem.author && (
                <span>By {scriptItem.author}</span>
              )}
              {scriptItem.duration && (
                <span>{scriptItem.duration}</span>
              )}
              {scriptItem.year && (
                <span>{scriptItem.year}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SCRIPT BODY */}
      <section className="script-body">
        <article className="script-text">
          {paragraphs.map((paragraph, index) => {
            if (
              paragraph === paragraph.toUpperCase() &&
              paragraph.length < 80 &&
              !paragraph.includes(".")
            ) {
              return <h2 key={index}>{paragraph}</h2>;
            }

            return <p key={index}>{paragraph}</p>;
          })}
        </article>
      </section>

      {/* CONTINUE READING */}
      <section className="continue-scripts">
        <div className="continue-scripts-inner">
          <div className="continue-header">
            <p className="continue-kicker">MORE STORIES</p>
            <h2>Continue Exploring Scripts</h2>
            <p className="continue-subtext">
              Dive into more stories, worlds, and characters from Coveilla.
            </p>
          </div>

          <div className="continue-grid">
            {relatedScripts.map((item) => (
              <Link
                key={item.slug}
                to={`/script/${item.slug}`}
                className="article-card"
              >
                <div className="article-card-image">
                  <img src={item.image} alt={item.title} />
                </div>

                <div className="article-card-content">
                  <span className="article-category">
                    {item.genre || "Script"}
                  </span>

                  <h3 className="article-title">{item.title}</h3>

                  <p className="article-excerpt">
                    {item.duration
                      ? `${item.duration} • ${item.year || ""}`
                      : "Read this script."}
                  </p>

                  <span className="article-read">Read Script →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ScriptDetails;