import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../auth/api";

function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest(`/api/articles/${slug}`, { token: null })
      .then((data) => setForm(data))
      .catch((err) => setError(err.message));
  }, [slug]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await apiRequest(`/api/articles/${slug}`, { method: "PUT", body: JSON.stringify(form) });
      navigate(`/article/${slug}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !form) return <p role="alert">{error}</p>;
  if (!form) return <p>Loading...</p>;

  return (
    <form onSubmit={handleUpdate}>
      {error && <p role="alert">{error}</p>}
      <input name="title" value={form.title} onChange={handleChange} />
      <input name="category" value={form.category} onChange={handleChange} />
      <textarea name="content" value={form.content} onChange={handleChange} />

      <button type="submit">Update</button>
    </form>
  );
}

export default EditArticle;
