import miloAndMoon from "../data/miloAndMoon";
import MiloAnimatedStory from "./MiloAnimatedStory";

export default function MiloStory() {
  return (
    <article className="milo-story" id="milo-story" aria-labelledby="milo-story-title">
      <header className="milo-story-header">
        <div className="milo-story-intro">
          <span className="kids-overline">A COVEILLA KIDS STORY</span>
          <h2 id="milo-story-title">{miloAndMoon.title}</h2>
          <p className="milo-story-subtitle">{miloAndMoon.subtitle}</p>
          <p className="milo-story-byline">
            <strong>{miloAndMoon.author}</strong><span>{miloAndMoon.authorDescription}</span>
          </p>
        </div>
        <div className="milo-story-cover" role="img" aria-label={miloAndMoon.coverAlt}>
          <span className="milo-cover-star star-a" aria-hidden="true">✦</span>
          <span className="milo-cover-star star-b" aria-hidden="true">·</span>
          <span className="milo-cover-moon" aria-hidden="true" />
          <span className="milo-cover-bear" aria-hidden="true">🐻</span>
          <span className="milo-cover-hill" aria-hidden="true" />
        </div>
      </header>

      <MiloAnimatedStory />

      <nav className="milo-chapter-nav" aria-label="Milo and the Moon chapters">
        <h3>In this story</h3>
        <ol>
          {miloAndMoon.chapters.map((chapter, index) => (
            <li key={chapter.title}>
              <a href={`#milo-chapter-${index + 1}`}>{chapter.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="milo-chapters">
        {miloAndMoon.chapters.map((chapter, index) => (
          <section className="milo-chapter" id={`milo-chapter-${index + 1}`} key={chapter.title}>
            <h3><span>Chapter {index + 1}</span>{chapter.title}</h3>
            {chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </div>

      <div className="milo-learning-sections">
        <section className="milo-learning-card milo-lesson" aria-labelledby="milo-lesson-title">
          <h3 id="milo-lesson-title">The Lesson from Milo's Story</h3>
          <ul>{miloAndMoon.lesson.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="milo-learning-card milo-activities" aria-labelledby="milo-activities-title">
          <h3 id="milo-activities-title">A Little Activity for You, Little One!</h3>
          <p className="milo-activity-note">These activities are optional. You can do them in your own notebook or print this page. You never have to share what you write or draw.</p>
          <div className="milo-activity-grid">
            {miloAndMoon.activities.map((activity, index) => (
              <article className="milo-activity" key={activity.title}>
                <span className="milo-activity-icon" aria-hidden="true">{activity.icon}</span>
                <h4>{index + 1}. {activity.title}</h4>
                <p>{activity.prompt}</p>
                {activity.drawingSpace && (
                  <div className="milo-drawing-space" role="img" aria-label="Blank space for drawing a moon and stars" />
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="milo-learning-card milo-adult-note" aria-labelledby="milo-adult-note-title">
          <h3 id="milo-adult-note-title">A Note for Parents and Teachers</h3>
          {miloAndMoon.parentNote.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section className="milo-learning-card milo-discussion" aria-labelledby="milo-discussion-title">
          <h3 id="milo-discussion-title">Discussion Questions for Adults</h3>
          <ol>{miloAndMoon.discussionQuestions.map((question) => <li key={question}>{question}</li>)}</ol>
        </section>

        <section className="milo-learning-card milo-author" aria-labelledby="milo-author-title">
          <h3 id="milo-author-title">About the Author</h3>
          <p><strong>{miloAndMoon.author}</strong> — {miloAndMoon.authorDescription}</p>
          <p>{miloAndMoon.authorBiography}</p>
        </section>

        <p className="milo-fiction-note">{miloAndMoon.fictionDisclaimer}</p>
      </div>
    </article>
  );
}
