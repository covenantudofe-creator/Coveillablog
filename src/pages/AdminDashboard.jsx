import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../auth/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  const fetchArticles = () => {
    apiRequest("/api/articles", { token: null })
      .then((data) => setArticles(data))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const deleteArticle = async (slug) => {
    try {
      await apiRequest(`/api/articles/${slug}`, { method: "DELETE" });
      setArticles((current) => current.filter((article) => article.slug !== slug));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p><Link to="/admin/articles/new">Create article</Link> | <Link to="/admin/messages">Contact messages</Link></p>
      {error && <p role="alert">{error}</p>}

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
                <Link to={`/admin/articles/${article.slug}/edit`}>Edit</Link>

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
