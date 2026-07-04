import { useState } from "react";
import { scripts } from "../data/tvSeries";
import "../styles/TVSeries.css";

function TVSeries() {
  // Find the first TV series
  const series = scripts.find(
    (item) => item.type === "tv-series"
  );

  // Safety check
  if (!series) {
    return (
      <main className="tv-series-page">
        <div className="series-error">
          <h2>No TV Series Found</h2>
          <p>Please add a TV series to your data file.</p>
        </div>
      </main>
    );
  }

  const [selectedEpisode, setSelectedEpisode] = useState(
    series.episodes[0]
  );

  return (
    <main className="tv-series-page">

      {/* ================= HERO ================= */}

      <section className="series-hero">

        <img
          src={series.image}
          alt={series.title}
          className="series-cover"
        />

        <div className="series-overlay">

          <span className="series-badge">
             ORIGINAL TV SERIES
          </span>

          <h1>{series.title}</h1>

          <p className="series-description">
            {series.genre} • {series.year}
          </p>

          <div className="series-meta">

            <span>
              {series.seasons}{" "}
              {series.seasons > 1 ? "Seasons" : "Season"}
            </span>

            <span>
              {series.totalEpisodes} Episodes
            </span>

            <span>
              By {series.author}
            </span>

            {series.mature && (
              <span className="mature">
                18+
              </span>
            )}

          </div>

        </div>

      </section>

      {/* ================= EPISODES ================= */}

      <section className="episodes-section">

        <div className="section-heading">

          <h2>Season 1 Episodes</h2>

          <p>
            Select an episode to read the screenplay.
          </p>

        </div>

        <div className="episode-list">

          {series.episodes.map((episode) => (

            <button
              key={episode.id}
              className={`episode-btn ${
                selectedEpisode.id === episode.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setSelectedEpisode(episode)
              }
            >

              <strong>
                Episode {episode.id}
              </strong>

              <small>
                {episode.title}
              </small>

            </button>

          ))}

        </div>

      </section>

      {/* ================= SCRIPT ================= */}

      <section className="script-section">

        <div className="script-header">

          <h2>
            Episode {selectedEpisode.id}:{" "}
            {selectedEpisode.title}
          </h2>

          <p className="duration">
            Runtime: {selectedEpisode.duration}
          </p>

        </div>

        <div className="script-card">

          <pre className="script-content">
            {selectedEpisode.script}
          </pre>

        </div>

      </section>

    </main>
  );
}

export default TVSeries;