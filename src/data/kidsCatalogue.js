/**
 * Publish entries only after source and artwork rights are reviewed.
 * Entries with an embedUrl also need verified embed permission and completion
 * of all child-directed player and privacy requirements for this site.
 *
 * Fields: id, title, description, ageGuidance, thumbnailUrl, thumbnailAlt,
 * officialSourceUrl, publicationStatus, artworkRightsStatus,
 * embedPermissionStatus, childDirectedRequirementsStatus, embedUrl.
 */
const kidsCatalogue = [
  {
    id: "an-almost-christmas-story",
    title: "An Almost Christmas Story",
    description: "Moon, a young owl, meets Luna in a heartwarming holiday adventure.",
    ageGuidance: "Disney+ rating: TV-G",
    thumbnailUrl: null,
    thumbnailAlt: null,
    officialSourceUrl: "https://ratedwap.com/areyouhuman5.php?fid=267085",
    officialSourceStatus: "verified",
    publicationStatus: "link-only",
    artworkRightsStatus: "not-used",
    embedPermissionStatus: "not-verified",
    childDirectedRequirementsStatus: "not-reviewed",
    embedUrl: null,
    sourceLinkLabel: "View the official Disney+ listing",
    accessNote: "Coveilla does not stream this film. Availability and account requirements depend on your region.",
  },
];

export default kidsCatalogue;
