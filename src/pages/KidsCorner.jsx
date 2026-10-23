import { useState } from "react";
import MiloStory from "../components/MiloStory";
import MiloMoonIllustration from "../components/MiloMoonIllustration";
import kidsCatalogue from "../data/kidsCatalogue";
import "../styles/KidsCorner.css";

const stories = [
  { title: "Milo and the Moon", kind: "Bedtime adventure", emoji: "🐻", color: "peach", scene: "moon" },
  { title: "Pip’s Big Garden", kind: "A tiny nature tale", emoji: "🐸", color: "mint", scene: "garden" },
  { title: "Rocket to Rainbow", kind: "A colorful space trip", emoji: "🦊", color: "lilac", scene: "space" },
];

function getSafeEmbedUrl(value) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:"
      || url.hostname !== "www.youtube-nocookie.com"
      || !url.pathname.startsWith("/embed/")
    ) return null;

    url.searchParams.set("autoplay", "0");
    return url.toString();
  } catch {
    return null;
  }
}

export default function KidsCorner() {
  const [selected, setSelected] = useState(stories[0]);
  const [playing, setPlaying] = useState(false);
  const approvedCartoons = kidsCatalogue.filter((cartoon) => (
    (cartoon.publicationStatus === "approved" || cartoon.publicationStatus === "link-only")
    && cartoon.officialSourceUrl
    && cartoon.officialSourceStatus === "verified"
    && (cartoon.thumbnailUrl
      ? cartoon.artworkRightsStatus === "approved"
      : cartoon.artworkRightsStatus === "not-used")
    && (!cartoon.embedUrl || (
      cartoon.publicationStatus === "approved"
      && cartoon.artworkRightsStatus === "approved"
      && cartoon.embedPermissionStatus === "approved"
      && cartoon.childDirectedRequirementsStatus === "approved"
    ))
  ));

  return (
    <section className="kids-page">
      <div className={`cartoon-stage scene-${selected.scene} ${playing ? "is-playing" : ""}`}>
        {selected.title === "Milo and the Moon" && <div className="kids-hero-art"><MiloMoonIllustration sceneId="meet-milo" /></div>}
        <div className="stage-stars" aria-hidden="true">✦ · ✧ · ✦ · ✧</div>
        <div className="stage-cloud cloud-left" aria-hidden="true">☁️</div>
        <div className="stage-cloud cloud-right" aria-hidden="true">☁️</div>
        <div className="stage-orbit" aria-hidden="true">{selected.scene === "garden" ? "🌼" : selected.scene === "space" ? "🪐" : "🌙"}</div>
        <div className="stage-character" aria-label={`Cartoon friend ${selected.emoji}`} role="img">{selected.emoji}</div>
        <div className="stage-hill hill-back" aria-hidden="true" />
        <div className="stage-hill hill-front" aria-hidden="true" />
        <div className="stage-caption">
          <span className="kids-pill">✨ STORY TIME</span>
          <h1>{selected.title}</h1>
          <p>{selected.kind}</p>
          <button className="story-play" onClick={() => setPlaying((value) => !value)}>
            <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span> {playing ? "Pause the fun" : "Start the adventure"}
          </button>
          {selected.title === "Milo and the Moon" && <a className="story-read-link" href="#milo-story">Read the full story <span aria-hidden="true">↓</span></a>}
        </div>
        <span className="stage-bubble bubble-one" aria-hidden="true">✦</span>
        <span className="stage-bubble bubble-two" aria-hidden="true">♥</span>
      </div>

      <div className="kids-content">
        <div className="kids-heading">
          <div><span className="kids-overline">COVEILLA KIDS</span><h2>Pick your next little adventure</h2></div>
          <p>Made for curious minds and cozy story breaks.</p>
        </div>
        <div className="story-grid">
          {stories.map((story) => (
            <button
              className={`story-card ${story.color} ${selected.title === story.title ? "selected" : ""}`}
              key={story.title}
              onClick={() => { setSelected(story); setPlaying(false); }}
              aria-pressed={selected.title === story.title}
            >
              <span className="story-emoji" aria-hidden="true">{story.emoji}</span>
              <span className="story-card-copy"><strong>{story.title}</strong><small>{story.kind}</small></span>
              <span className="story-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        {selected.title === "Milo and the Moon" && <MiloStory />}
        <section className="kids-video-section kids-catalogue" aria-labelledby="kids-catalogue-heading">
          <div className="kids-video-heading">
            <span className="kids-overline">COVEILLA KIDS LIBRARY</span>
            <h2 id="kids-catalogue-heading">Cartoon collection</h2>
            <p>Explore verified official listings. Videos appear here only after their source, artwork permissions, and embedding requirements have been reviewed.</p>
          </div>
          {approvedCartoons.length ? (
            <div className="kids-catalogue-grid">
              {approvedCartoons.map((cartoon) => (
                <article className="kids-catalogue-card" key={cartoon.id}>
                  {cartoon.thumbnailUrl && (
                    <img src={cartoon.thumbnailUrl} alt={cartoon.thumbnailAlt || `${cartoon.title} artwork`} loading="lazy" />
                  )}
                  <div className="kids-catalogue-copy">
                    <h3>{cartoon.title}</h3>
                    <p>{cartoon.description}</p>
                    <p className="kids-age-guidance">{cartoon.ageGuidance}</p>
                    {getSafeEmbedUrl(cartoon.embedUrl) ? (
                      <>
                      <div className="kids-video-frame">
                        <iframe
                          src={getSafeEmbedUrl(cartoon.embedUrl)}
                          title={`${cartoon.title} video player`}
                          loading="lazy"
                          allow="encrypted-media; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </div>
                        <p className="kids-video-fallback">
                          If the player is unavailable, ask a grown-up to <a href={cartoon.officialSourceUrl} target="_blank" rel="noreferrer">open the official source</a>.
                        </p>
                      </>
                    ) : (
                      <a href={cartoon.officialSourceUrl} target="_blank" rel="noreferrer">{cartoon.sourceLinkLabel || "Open the official source"}</a>
                    )}
                    {cartoon.accessNote && <p>{cartoon.accessNote}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="kids-catalogue-empty" role="status">
              <span aria-hidden="true">✦</span>
              <h3>New adventures are being reviewed</h3>
              <p>There are no cartoons approved for this collection yet. Your storytime adventures are ready while we review sources and permissions.</p>
            </div>
          )}
        </section>

        <section className="kids-premium-card" aria-labelledby="kids-premium-heading">
          <div>
            <span className="kids-overline">COMING SOON</span>
            <h2 id="kids-premium-heading">Coveilla Kids Premium</h2>
            <p className="kids-premium-price">₦2,000 <span>/ month (proposed)</span></p>
            <p>Premium licensed cartoons are planned for the future. Availability depends on content rights and payment setup being confirmed.</p>
          </div>
          <button type="button" disabled aria-disabled="true">Premium access coming soon</button>
        </section>
        <p className="kids-note">A grown-up can help you explore. Remember: be kind, take breaks, and let your imagination lead!</p>
      </div>
    </section>
  );
}
