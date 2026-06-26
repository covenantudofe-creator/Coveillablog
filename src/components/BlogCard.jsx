import { Link } from "react-router-dom";

const BlogCard = ({ item }) => {
  const tag = item.category || item.genre || "Article";

  const excerpt =
    item.subtitle ||
    item.content?.replace(/[#*`]/g, "").slice(0, 110) + "..." ||
    "Read this article.";

  return (
    <Link to={`/article/${item.slug}`} className="article-card">
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
};

export default BlogCard;