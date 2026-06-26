import { useParams } from "react-router-dom";
import { articles } from "../data/articles";
import "../styles/BlogDetails.css";

const BlogDetails = () => {
  const { slug } = useParams();

  const article = articles.find(
    (article) => article.slug === slug
  );

  if (!article) {
    return (
      <div className="blog-details">
        <h1>Article Not Found</h1>
      </div>
    );
  }

  return (
    <div className="blog-details">
      <div className="blog-hero">
        <img
          src={article.image}
          alt={article.title}
        />
      </div>

      <div className="blog-content">
        <span className="blog-category">
          {article.category}
        </span>

        <h1>{article.title}</h1>

        <h3>{article.subtitle}</h3>

        <p>{article.content}</p>
      </div>
    </div>
  );
};

export default BlogDetails;