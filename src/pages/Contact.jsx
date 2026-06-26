import { useState } from "react";
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
      const res = await fetch("http://localhost:5055/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Message sent successfully 💌");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <p className="contact-kicker">CONTACT COVEILLA</p>
          <h1>Let’s Talk</h1>
          <p className="contact-intro">
            Whether you want to collaborate, ask a question, pitch an idea, or
            simply say hello, I’d love to hear from you.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-grid">
            <div className="contact-info-card">
              <span className="contact-tag">GET IN TOUCH</span>
              <h2>Reach out to Coveilla</h2>
              <p>
                Coveilla is built on storytelling, creativity, and meaningful
                connection. If you have a project, an idea, a partnership
                request, or just want to send a message, use the form and I’ll
                get back to you.
              </p>

              <div className="contact-details">
                <div className="contact-detail-box">
                  <h3>Email</h3>
                  <p>coveillablog@gmail.com</p>
                </div>

                <div className="contact-detail-box">
                  <h3>Brand</h3>
                  <p>Coveilla Blog</p>
                </div>

                <div className="contact-detail-box">
                  <h3>Focus</h3>
                  <p>Writing, storytelling, scripts, creative projects</p>
                </div>
              </div>
            </div>

            <form className="contact-form-card" onSubmit={handleSubmit}>
              <span className="contact-tag">SEND A MESSAGE</span>
              <h2>Contact Form</h2>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {success && <p className="form-success">{success}</p>}
              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="contact-btn" disabled={loading}>
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