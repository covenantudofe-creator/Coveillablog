import { scripts } from "../data/scripts";
import ScriptCard from "../components/ScriptCard";
import "../styles/Scripts.css";

function Scripts() {
  return (
    <main className="scripts-page">
      <div className="scripts-container">
        {/* PAGE HERO */}
        <section className="scripts-hero">
          <p className="scripts-kicker">COVEILLA STORIES</p>
          <h1 className="scripts-heading">Scripts & Screenplays</h1>
          <p className="scripts-intro">
            Explore original screenplays, dramatic stories, and character-driven
            narratives written to pull you into new worlds — from romance and
            emotional drama to suspense, conflict, and cinematic storytelling.
          </p>
        </section>

        {/* SCRIPTS GRID */}
        <section className="scripts-section">
          <div className="scripts-grid">
            {scripts.map((script) => (
              <ScriptCard key={script.slug} script={script} />
            ))}
          </div>
        </section>

        {/* EXTRA SECTION */}
        <section className="scripts-extra">
          <div className="scripts-extra-box">
            <p className="scripts-extra-kicker">KEEP READING</p>
            <h3>More stories are waiting inside Coveilla</h3>
            <p>
              From emotionally charged romance to cinematic suspense and layered
              character arcs, every script is built to be felt, not just read.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Scripts;