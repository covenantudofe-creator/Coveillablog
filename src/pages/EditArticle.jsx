import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5050/api/articles/${slug}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [slug]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(`http://127.0.0.1:5055/api/articles/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    navigate(`/article/${slug}`);
  };

  if (!form) return <p>Loading...</p>;

  return (
    <form onSubmit={handleUpdate}>
      <input name="title" value={form.title} onChange={handleChange} />
      <input name="category" value={form.category} onChange={handleChange} />
      <textarea name="content" value={form.content} onChange={handleChange} />

      <button type="submit">Update</button>
    </form>
  );
}

export default EditArticle;