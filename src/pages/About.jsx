import React from "react";
import "../styles/About.css";
import aboutImage from "../assets/Imageportfolio.jpg";

function About() {
  return (
    <main className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-text">
          <span className="about-kicker">ABOUT THE FOUNDER</span>

          <h1>About Coveilla Blog</h1>

          <p className="about-intro">
            Hi, I’m <strong>Godscovenant Patrick Udofe</strong> — a writer,
            storyteller, philosophy graduate, and aspiring developer with a deep
            love for meaningful stories and creative expression. Coveilla Blog
            is more than a website to me. It is a dream I carried for a long
            time, and now, it is finally taking shape.
          </p>
        </div>

        <div className="about-hero-image-wrap">
          <img
            src={aboutImage}
            alt="Godscovenant Patrick Udofe"
            className="about-hero-image"
          />
        </div>
      </section>

      {/* CONTENT */}
      <section className="about-content">
        <div className="about-container">
          <div className="about-grid">
            {/* PERSONAL */}
            <article className="about-card">
              <span className="about-card-tag">WHO I AM</span>
              <h2>The Mind Behind Coveilla</h2>
              <p>
                My name is <strong>Godscovenant Patrick Udofe</strong>, born on{" "}
                <strong>23rd July 2003</strong>. I am a graduate of Philosophy,
                and I obtained my degree in <strong>2025</strong> from the
                University of Uyo. My academic background taught me how to think
                deeply, ask difficult questions, and explore ideas beyond the
                surface.Skills that now shape both my writing and the way I
                approach storytelling.
              </p>
              <p>
                At <strong>23 years old</strong>, I have written over{" "}
                <strong>15 articles</strong> and <strong>10 scripts</strong>,
                and I’m still writing, still learning, and still building.
              </p>
            </article>

            {/* CODING JOURNEY */}
            <article className="about-card">
              <span className="about-card-tag">MY JOURNEY INTO CODING</span>
              <h2>How Writing Led Me to Tech</h2>
              <p>
                After graduating from university, I stepped into the world of
                coding. What surprised me most was how naturally it connected
                with the part of me that already loved writing. Both writing and
                coding require structure, imagination, problem-solving, and the
                ability to build something from nothing.
              </p>
              <p>
                I fell in love with coding because it gave me another way to
                create — not just with words, but with design, logic, and
                digital experiences. It became an extension of my storytelling,
                and that is one of the reasons Coveilla Blog means so much to
                me.
              </p>
            </article>

            {/* ORIGINAL COVEILLA STORY */}
            <article className="about-card">
              <span className="about-card-tag">OUR STORY</span>
              <h2>How Coveilla Began</h2>
              <p>
                During the rise of social media and viral content, I noticed a
                pattern: countless blogs covered public figures, entertainment,
                and culture, yet many readers only trusted information when it
                came from established platforms.
              </p>
              <p>
                That made one thing clear — trust is everything. Across every
                space, people gravitate toward sources that consistently prove
                their credibility. Coveilla Blog was born from the desire to
                create a platform that values both storytelling and trust.
              </p>
            </article>

            {/* VALUES */}
            <article className="about-card">
              <span className="about-card-tag">WHAT WE STAND FOR</span>
              <h2>Authenticity Over Noise</h2>
              <p>
                Coveilla Blog is built on authenticity, responsible
                storytelling, and creative honesty. I believe content should be
                thoughtful, emotionally intelligent, and respectful of both
                facts and the people behind the stories.
              </p>
              <p>
                Instead of chasing distortion, clout, or sensationalism,
                Coveilla focuses on creating a reading experience that feels
                intentional, elevated, and worth returning to.
              </p>
            </article>

            {/* PERSONAL BELIEF */}
            <article className="about-card">
              <span className="about-card-tag">WHAT I BELIEVE</span>
              <h2>Determination. Resilience. Growth.</h2>
              <p>
                I strongly believe that <strong>determination is the key to
                success</strong>, and <strong>resilience is one of the most
                important steps in achieving any goal in life</strong>. Every
                meaningful dream requires consistency, patience, and the courage
                to keep going even when progress feels slow.
              </p>
              <p>
                Coveilla Blog is built on that same belief. It represents the
                part of me that refuses to stop creating, refuses to stop
                learning, and refuses to let vision stay only in my head.
              </p>
            </article>

            {/* VISION */}
            <article className="about-card">
              <span className="about-card-tag">OUR VISION</span>
              <h2>A Trusted Digital Storytelling Space</h2>
              <p>
                My vision is to build a platform where storytelling,
                creativity, and information meet integrity — a space where
                readers can engage with content they genuinely enjoy while still
                feeling confident in what they are reading.
              </p>
              <p>
                Coveilla is not just about publishing content. It is about
                building a brand that people can trust, revisit, and grow with.
              </p>
            </article>

            {/* WHY IT MATTERS */}
            <article className="about-card">
              <span className="about-card-tag">WHY IT MATTERS</span>
              <h2>Credibility Still Matters</h2>
              <p>
                In today’s fast-moving digital world, attention often matters
                more than truth. But long-term impact is built on credibility,
                consistency, and respect for the audience.
              </p>
              <p>
                Coveilla Blog chooses a different path,one that values
                thoughtful writing, creative expression, and trust over empty
                noise.
              </p>
            </article>

            {/* DREAM */}
            <article className="about-card">
              <span className="about-card-tag">THE DREAM</span>
              <h2>Coveilla Coming to Life</h2>
              <p>
                Coveilla Blog is my dream finally coming into existence. It is a
                platform where my passion for writing, storytelling, and
                creativity can live openly. It is a home for ideas, articles,
                scripts, reflections, and the kind of content that carries both
                heart and intention.
              </p>
              <p>
                More than anything, I want Coveilla to become a space that feels
                inspiring, thoughtful, and honest.A place where creativity is
                taken seriously and stories are allowed to matter.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;