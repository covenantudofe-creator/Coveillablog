# Coveilla Kids Premium: safe first version and activation checklist

## Current implementation

- The `/kids` route remains inside the existing React application. The original interactive storytime section remains available.
- The catalogue has one text-only link to the official Disney+ listing for *An Almost Christmas Story*; Coveilla does not play or host it. Add playable entries only after the official source, hosting rights, and artwork permissions are documented. The catalogue data structure is in `src/data/kidsCatalogue.js`.
- YouTube embeds are gated on both verified embedding permission and completion of child-directed player/privacy requirements. Coveilla has not been configured or verified for YouTube's required child-directed self-designation, so no third-party embeds are published in this version.
- The page displays **Coveilla Kids Premium — ₦2,000/month (proposed)** and a disabled “Premium access coming soon” button. There is no checkout, payment endpoint, subscription entitlement, or Paystack credential in use.

## Before publishing cartoon content

1. Obtain and retain written rights that cover the intended display, artwork, audience, territories, and any future paid access. An official source or a working embed alone does not establish commercial licensing rights.
2. Record the official source URL, age guidance, thumbnail source and artwork rights, and an accountable approval record for each catalogue entry.
3. For YouTube, verify the uploader permits embedding and that the video is currently embeddable. YouTube notes that policy or third-party claims may still prevent playback even when the uploader permits embedding.
4. Because this section is child-directed, complete YouTube's required site/app self-designation and review its embedded-player and data-handling requirements before publishing any YouTube player. Recheck these requirements when the integration changes.
5. Review applicable child privacy, parental-consent, advertising, and consumer requirements for the markets where Coveilla operates. Do not add child profiles, behavioral tracking, or unnecessary personal-data collection as part of the catalogue.

## Paystack integration plan (not activated)

The existing server uses Express, Sequelize, and Neon PostgreSQL, with reader authentication already available. A future payment implementation should:

1. Confirm business/merchant readiness, licensing for paid distribution, final NGN price, renewal terms, cancellation/refund terms, and customer disclosures before enabling checkout.
2. Create the monthly plan in Paystack and configure its plan code on the server. Treat NGN 2,000 as proposed until the owner confirms it.
3. Require a reader session on a backend initialization endpoint. Derive the reader identity and amount/plan from trusted server-side data; never accept a frontend flag as proof of purchase and never expose the secret key.
4. Verify a transaction server-to-server before granting access. Check successful status, reference, currency, expected amount/plan, and the expected customer/account. A browser redirect is not proof of payment.
5. Process signed Paystack webhooks using the raw request body and HMAC-SHA512 signature validation. Make event handling idempotent and return promptly after acknowledging valid events.
6. Add an additive, reviewed Sequelize migration for subscription metadata only when the entitlement feature is ready. Store the reader foreign key, provider references, state, billing period, cancellation/failure state, and processed webhook identifiers. Enforce unique provider references and never store card details.
7. Gate premium content on server-checked subscription state tied to the authenticated reader. Define renewal, failed-payment, cancellation, refund, and webhook-replay behavior before launch.

Future deployment configuration will likely require a server-only `PAYSTACK_SECRET_KEY` and a `PAYSTACK_PLAN_CODE` created in the merchant account. A frontend public key is only needed if the eventual checkout UI uses a Paystack browser SDK; it is not needed for this disabled first version. No credential values or plan identifiers are configured by this change.

Reference documentation:

- [YouTube embedding guidance](https://support.google.com/youtube/answer/171780)
- [YouTube video status fields, including embedding permission](https://developers.google.com/youtube/v3/docs/videos#status.embeddable)
- [YouTube child-directed content status and handling](https://developers.google.com/youtube/v3/guides/made_for_kids_status)
- [Paystack server-side payment initialization and verification](https://paystack.com/docs/payments/accept-payments/)
- [Paystack subscriptions](https://paystack.com/docs/payments/subscriptions/)
- [Paystack webhook signature validation](https://paystack.com/docs/payments/webhooks/)
