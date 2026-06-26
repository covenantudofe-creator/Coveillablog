import { Link } from "react-router-dom";

const ScriptCard = ({ script }) => {
  const tag = script.genre || script.category || "Script";

  return (
    <Link to={`/script/${script.slug}`} className="article-card">
      <div className="article-card-image">
        <img src={script.image} alt={script.title} />
      </div>

      <div className="article-card-content">
        <span className="article-category">{tag}</span>

        <h3 className="article-title">{script.title}</h3>

        <p className="article-excerpt">
          {script.logline ||
            script.description ||
            "Explore this screenplay, its story world, and characters."}
        </p>

        <span className="article-read">Read Script →</span>
      </div>
    </Link>
  );
};

export default ScriptCard;