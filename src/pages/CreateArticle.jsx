import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateArticle.css";

function CreateArticle() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    category: "",
    image: "",
    subtitle: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;

    setForm({
      ...form,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5055/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setLoading(false);

      // redirect to article page
      navigate(`/article/${data.slug}`);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="create-article-page">
      <h1>Create New Article</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="create-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleTitleChange}
          required
        />

        <input
          type="text"
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          type="text"
          name="subtitle"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={handleChange}
        />

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />

        <textarea
          name="content"
          placeholder="Write your article..."
          value={form.content}
          onChange={handleChange}
          rows="10"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Article"}
        </button>
      </form>
    </div>
  );
}

export default CreateArticle;