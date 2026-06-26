import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [articles, setArticles] = useState([]);

  const fetchArticles = () => {
    fetch("http://127.0.0.1:5055/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const deleteArticle = async (slug) => {
    await fetch(`http://127.0.0.1:5055/api/articles/${slug}`, {
      method: "DELETE",
    });

    setArticles(articles.filter((a) => a.slug !== slug));
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {articles.map((article) => (
            <tr key={article.slug}>
              <td>{article.title}</td>
              <td>{article.category}</td>

              <td>
                <Link to={`/edit/${article.slug}`}>Edit ✏️</Link>

                <button onClick={() => deleteArticle(article.slug)}>
                  Delete 🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;