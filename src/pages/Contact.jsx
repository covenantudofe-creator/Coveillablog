import { useState } from "react";
import profileImage from "../assets/Imageportfolio.jpg";
import "../styles/Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5055";

const res = await fetch(`${API_URL}/api/contact`, {        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSuccess("Message sent successfully. Thank you for reaching out!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">

      {/* HERO */}

      <section className="contact-hero">
        <div className="contact-hero-content">
          <p className="contact-kicker">CONTACT COVEILLA</p>

          <h1>Every Great Story Begins With A Conversation</h1>

          <p className="contact-intro">
            Whether you're looking to collaborate on a screenplay,
            discuss a creative project, or simply share your thoughts,
            I'd love to hear from you.
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <section className="contact-section">

        <div className="contact-container">

          <div className="contact-grid">

            {/* LEFT */}

            <div className="contact-info-card">


                <div className="creator-poster">
  <img
    src={profileImage}
    alt="Godscovenant Patrick Udofe"
    className="creator-image"
  />

  <div className="creator-overlay">
    <span className="creator-role">
      FOUNDER • SCREENWRITER
    </span>

    <h3>Godscovenant Patrick Udofe</h3>

    <p>
      Founder of <strong>Coveilla</strong>, creating
      cinematic stories, emotionally rich screenplays,
      and unforgettable storytelling experiences.
    </p>
  </div>
</div>

              <span className="contact-tag">
                GET IN TOUCH
              </span>

              <h2>
                Let's Build Something Cinematic
              </h2>

              <p>
                Whether you're looking for a screenwriter,
                a creative collaborator,
                or simply want to talk about storytelling,
                my inbox is always open.
              </p>

              <div className="contact-details">

                <div className="contact-detail-box">
                  <h3>Email</h3>
                  <p>coveillablog@gmail.com</p>
                </div>

                <div className="contact-detail-box">
                  <h3>Brand</h3>
                  <p>Coveilla</p>
                </div>

                <div className="contact-detail-box">
                  <h3>Specialties</h3>
                  <p>
                    Screenwriting • Storytelling •
                    Creative Writing • Film Concepts
                  </p>
                </div>

              </div>

            </div>

            {/* RIGHT */}

            <form
              className="contact-form-card"
              onSubmit={handleSubmit}
            >

              <span className="contact-tag">
                SEND A MESSAGE
              </span>

              <h2>Contact Form</h2>

              <div className="form-group">

                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>Subject</label>

                <input
                  type="text"
                  name="subject"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>Message</label>

                <textarea
                  rows="7"
                  name="message"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

              </div>

              {success && (
                <p className="form-success">{success}</p>
              )}

              {error && (
                <p className="form-error">{error}</p>
              )}

              <button
                className="contact-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Contact;