export default function MiloMoonIllustration({ talking = "", sceneId = "meet-milo" }) {
  const isMemoryScene = ["milo-loses-mom", "dear-moon", "smile-again", "hopeful-conclusion"].includes(sceneId);
  return (
    <svg className={`milo-scene-art scene-art-${sceneId}`} viewBox="0 0 960 540" role="img" aria-labelledby="milo-scene-art-title" xmlns="http://www.w3.org/2000/svg">
      <title id="milo-scene-art-title">Milo and Mara together beneath the moon in the {sceneId.replaceAll("-", " ")} scene</title>
      <defs>
        <linearGradient id="milo-sky" x2="0" y2="1"><stop stopColor="#101b46"/><stop offset="1" stopColor="#40376f"/></linearGradient>
        <radialGradient id="milo-glow"><stop stopColor="#fff5c8" stopOpacity=".42"/><stop offset="1" stopColor="#fff5c8" stopOpacity="0"/></radialGradient>
        <linearGradient id="milo-hill" x2="0" y2="1"><stop stopColor="#46577a"/><stop offset="1" stopColor="#263a53"/></linearGradient>
      </defs>
      <path fill="url(#milo-sky)" d="M0 0h960v540H0z"/>
      <circle cx="730" cy="145" r="155" fill="url(#milo-glow)"/>
      <circle cx="730" cy="145" r="55" fill="#fff0b2"/>
      <circle cx="713" cy="128" r="8" fill="#eadba7" opacity=".5"/><circle cx="748" cy="160" r="6" fill="#eadba7" opacity=".45"/>
      <g fill="#fff4ce">
        <circle className="milo-star" cx="112" cy="92" r="3"/><circle className="milo-star" cx="234" cy="157" r="2.5"/><circle className="milo-star" cx="355" cy="78" r="3"/>
        <circle className="milo-star" cx="514" cy="128" r="2"/><circle className="milo-star" cx="855" cy="67" r="3"/><circle className="milo-star" cx="876" cy="245" r="2.5"/>
        <path d="M172 220v13m-6.5-6.5h13M605 57v12m-6-6h12" stroke="#fff4ce" strokeWidth="2"/>
      </g>
      {sceneId === "happy-memories" && <g className="scene-motifs scene-happy-motifs" fill="#ffd88d"><path d="M390 265c-16-15-32 9 0 29 32-20 16-44 0-29z"/><path d="M655 296c-12-11-24 7 0 22 24-15 12-33 0-22z"/><path d="M331 323l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z"/></g>}
      {sceneId === "mara-is-ill" && <g className="scene-motifs scene-calm-motifs" fill="#d8d7f1" opacity=".58"><circle cx="389" cy="286" r="5"/><circle cx="681" cy="269" r="4"/><path d="M523 290v20m-7-10h14" stroke="#e1d9ef" strokeWidth="2"/></g>}
      {sceneId === "goodbye-to-mara" && <g className="scene-motifs scene-goodbye-motifs" fill="#ffe9b0"><circle cx="378" cy="289" r="4"/><circle cx="662" cy="256" r="3"/><circle cx="704" cy="316" r="3"/></g>}
      {sceneId === "milo-loses-mom" && <g className="scene-motifs scene-memory-motifs" fill="#fff0bc"><path d="M477 251l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z"/><circle cx="526" cy="274" r="3"/><circle cx="453" cy="278" r="3"/></g>}
      {sceneId === "dear-moon" && <g className="scene-letter" transform="translate(365 374) rotate(-8)"><path d="M0 0h54v40H0z" fill="#f3e4bc" stroke="#d9c89f" strokeWidth="2"/><path d="M4 5l23 18L50 5" fill="none" stroke="#bdad8f" strokeWidth="2"/></g>}
      {sceneId === "smile-again" && <g className="scene-motifs scene-hope-motifs" fill="#f1d58e"><path d="M306 470l8-21 8 21 15-12-3 22h-39l-3-22zM721 479l7-18 8 18 12-10-2 19h-35l-2-19z"/></g>}
      {sceneId === "hopeful-conclusion" && <path className="scene-dawn" d="M0 404q210-99 410-4t550-17v54q-274 49-551-7T0 454z" fill="#f4bd7e" opacity=".3"/>}
      <g className="milo-cloud" fill="#b8c2e0" opacity=".3"><ellipse cx="200" cy="270" rx="68" ry="17"/><ellipse cx="159" cy="266" rx="27" ry="20"/><ellipse cx="218" cy="258" rx="34" ry="24"/></g>
      <g className="milo-cloud milo-cloud-late" fill="#b8c2e0" opacity=".22"><ellipse cx="550" cy="226" rx="58" ry="14"/><ellipse cx="519" cy="222" rx="24" ry="19"/><ellipse cx="568" cy="216" rx="30" ry="22"/></g>
      <path fill="#384966" d="M0 399q170-100 339-9t307-8q167-92 314 20v138H0z"/>
      <path fill="url(#milo-hill)" d="M0 453q194-99 410-12t550-19v118H0z"/>
      <g fill="#1c3141"><path d="M78 421h15v-88H78zM59 358q25-52 52 0zM54 385q30-60 62 0z"/><path d="M864 420h13v-73h-13zM848 374q23-44 46 0zM843 396q28-53 55 0z"/></g>
      <ellipse cx="540" cy="520" rx="174" ry="10" fill="#1b2b3c" opacity=".48"/>
      {/* Milo's seated figure is drawn from original SVG shapes. */}
      <g className="milo-boy" stroke="#172b43" strokeWidth="4" strokeLinejoin="round">
        <path fill="#263b55" d="M420 423q16-41 57-41 42 0 59 41l22 57H397z"/>
        <path fill="#2f75b5" d="M416 392q13-35 61-35 42 0 56 35l-17 55h-82z"/>
        <path fill="none" stroke="#e5b49a" strokeWidth="10" strokeLinecap="round" d="M421 407l-27 31"/>
        <path fill="none" stroke="#e5b49a" strokeWidth="10" strokeLinecap="round" d={isMemoryScene ? "M548 407l-18 26" : "M548 407l8 30"}/>
        <path fill="#24364d" d="M407 466q26 8 51 0l-5 41h-55q-8-8 9-41zm72 0q27 8 49-1l19 42h-54z"/>
        <path fill="#1a2b40" d="M393 497q24-11 58 0l16 13q2 8-8 8h-67q-12-2 1-21zm101 0q21-11 43 1l16 15q1 8-9 8h-57q-9-3 7-24z"/>
        <ellipse cx="477" cy="323" rx="47" ry="53" fill="#8d5038"/>
        <path fill="#211d27" d="M430 319q-8-47 21-58 8-20 30-14 25-9 36 13 25 12 9 49-6-22-22-29-22 13-49 5-8 17-25 34z"/>
        <circle cx="462" cy="328" r="3.5" fill="#211d27" stroke="none"/><circle cx="493" cy="328" r="3.5" fill="#211d27" stroke="none"/>
        <ellipse className="milo-blink" cx="462" cy="328" rx="5" ry="4" fill="#8d5038" stroke="none"/><ellipse className="milo-blink" cx="493" cy="328" rx="5" ry="4" fill="#8d5038" stroke="none"/>
        <g className={`milo-mouth ${talking === "Milo" ? "is-talking" : ""}`}>
          <path className="mouth-closed" d="M469 346q8 7 17 0" fill="none" stroke="#402b2b" strokeWidth="3" strokeLinecap="round"/>
          <path className="mouth-smile" d="M467 343q10 12 21 0" fill="none" stroke="#402b2b" strokeWidth="3" strokeLinecap="round"/>
          <ellipse className="mouth-open" cx="477" cy="347" rx="6" ry="2" fill="#402b2b"/>
          <ellipse className="mouth-wide" cx="477" cy="348" rx="8" ry="5" fill="#402b2b"/>
        </g>
        <path d="M449 381q28 17 57 0" fill="none" stroke="#194e83" strokeWidth="7"/>
      </g>
      {/* Mara sits beside Milo; their joined hands rest over the shared hill line. */}
      <g className={`mara-girl ${isMemoryScene ? "mara-memory" : ""}`} stroke="#342b3b" strokeWidth="4" strokeLinejoin="round">
        <path fill="#6c456a" d="M576 423q15-40 53-40 41 0 55 40l23 56h-150z"/>
        <path fill="#d67571" d="M579 395q12-35 50-35 39 0 51 35l-11 55h-78z"/>
        <path fill="#593e59" d="M593 462q15 7 30 0l-5 43h-29q-6-7 4-43zm31 0q17 7 31 0l13 43h-28z"/>
        <path fill="#3b344b" d="M586 500q16-8 31 1l8 12q1 7-7 7h-38q-8-2 6-20zm60 0q13-8 25 1l8 12q1 7-7 7h-31q-8-2 5-20z"/>
        <path fill="none" stroke="#9b5b43" strokeWidth="10" strokeLinecap="round" d={isMemoryScene ? "M585 409l-6 19" : "M585 409l-24 26"}/>
        <path fill="none" stroke="#9b5b43" strokeWidth="10" strokeLinecap="round" d="M690 408l23 30"/>
        <ellipse cx="626" cy="323" rx="44" ry="51" fill="#9b6047"/>
        <path fill="#30232d" d="M582 319q-7-44 22-54 11-18 30-12 23-6 34 14 20 11 5 44-8-25-25-29-21 13-44 4-7 19-22 33z"/>
        <path fill="none" stroke="#30232d" strokeWidth="7" strokeLinecap="round" d="M599 300q-19-17-10-34m63-4q19-15 26-3"/>
        <g className="mara-braids" fill="none" stroke="#30232d" strokeWidth="5" strokeLinecap="round"><path d="M590 296q-13 18-6 36t-3 22"/><path d="M658 296q13 18 6 36t3 22"/></g>
        <circle cx="612" cy="328" r="3.5" fill="#30232d" stroke="none"/><circle cx="640" cy="328" r="3.5" fill="#30232d" stroke="none"/>
        <ellipse className="milo-blink" cx="612" cy="328" rx="5" ry="4" fill="#9b6047" stroke="none"/><ellipse className="milo-blink" cx="640" cy="328" rx="5" ry="4" fill="#9b6047" stroke="none"/>
        <g className={`milo-mouth mara-mouth ${talking === "Mara" ? "is-talking" : ""}`}>
          <path className="mouth-closed" d="M617 346q8 7 17 0" fill="none" stroke="#512e34" strokeWidth="3" strokeLinecap="round"/>
          <path className="mouth-smile" d="M615 343q10 12 21 0" fill="none" stroke="#512e34" strokeWidth="3" strokeLinecap="round"/>
          <ellipse className="mouth-open" cx="625" cy="347" rx="6" ry="2" fill="#512e34"/>
          <ellipse className="mouth-wide" cx="625" cy="348" rx="8" ry="5" fill="#512e34"/>
        </g>
        <path d="M602 382q24 15 49 0" fill="none" stroke="#874863" strokeWidth="7"/>
      </g>
      <path fill="#9bb483" d="M104 506l7-12 5 12 8-7 2 11H97zM802 502l6-14 7 14 9-8 2 12h-30zM650 519l6-10 6 10 7-6 2 9h-25z"/>
    </svg>
  );
}
