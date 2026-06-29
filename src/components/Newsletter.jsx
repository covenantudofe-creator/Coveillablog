import { useState } from "react";
import "../styles/Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/newsletter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(
        "🎉 Welcome to Coveilla! Check your email for your welcome message."
      );

      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter">

      <div className="newsletter-content">

        <span className="newsletter-tag">
          JOIN THE COMMUNITY
        </span>

        <h2>Stay Updated</h2>

        <p>
          Get original screenplays, storytelling tips,
          writing insights and exclusive Coveilla content
          delivered directly to your inbox.
        </p>

        <form
          className="newsletter-form"
          onSubmit={handleSubmit}
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>

        </form>

        {message && (
          <p className="newsletter-success">
            {message}
          </p>
        )}

        {error && (
          <p className="newsletter-error">
            {error}
          </p>
        )}

      </div>

    </section>
  );
};

export default Newsletter;