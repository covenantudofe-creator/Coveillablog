import "../styles/Newsletter.css";

const Newsletter = () => {
  return (
    <section className="newsletter">
      <div className="newsletter-content">
        <h2>Stay Updated</h2>

        <p>
          Get the latest screenplays, storytelling insights,
          writing tips, and exclusive content delivered directly
          to your inbox.
        </p>

        <form className="newsletter-form">
          <input
            type="email"
            placeholder="Enter your email"
          />

          <button type="submit">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;