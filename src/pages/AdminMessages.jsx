import { useEffect, useState } from "react";
import { apiRequest } from "../auth/api";
import "../styles/AdminMessages.css";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      await apiRequest(`/api/contact/${id}`, {
        method: "DELETE",
      });

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  useEffect(() => {
    let active = true;
    apiRequest("/api/contact")
      .then((data) => { if (active) setMessages(data.data || []); })
      .catch((err) => { if (active) setError(err.message || "Something went wrong"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <p className="admin-kicker">COVEILLA ADMIN</p>
        <h1>Contact Messages</h1>
        <p className="admin-intro">
          View, manage, and delete messages sent through your contact form.
        </p>
      </section>

      <section className="admin-section">
        <div className="admin-container">
          {loading && <p className="admin-status">Loading messages...</p>}

          {!loading && error && <p className="admin-error">{error}</p>}

          {!loading && !error && messages.length === 0 && (
            <p className="admin-status">No messages yet.</p>
          )}

          {!loading && !error && messages.length > 0 && (
            <div className="messages-grid">
              {messages.map((msg) => (
                <article className="message-card" key={msg.id}>
                  <div className="message-top">
                    <div className="message-meta">
                      <h2>{msg.subject}</h2>
                      <p className="message-name">{msg.name}</p>
                      <p className="message-email">{msg.email}</p>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(msg.id)}
                    >
                      Delete
                    </button>
                  </div>

                  <p className="message-body">{msg.message}</p>

                  <p className="message-date">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString()
                      : msg.created_at
                      ? new Date(msg.created_at).toLocaleString()
                      : "No date"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminMessages;
