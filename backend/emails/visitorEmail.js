function visitorEmail(name) {
  return `
<div style="
  margin:0;
  padding:0;
  background:#000;
  font-family:Arial, Helvetica, sans-serif;
">

  <!-- MAIN WRAPPER -->
  <div style="
    max-width:680px;
    margin:0 auto;
    background:#000;
  ">

    <!-- HERO (NETFLIX STYLE OVERLAY DARK GRADIENT) -->
    <div style="
      padding:80px 40px 60px;
      text-align:center;
      background:radial-gradient(circle at top,#111 0%,#000 60%);
      border-bottom:1px solid #1a1a1a;
    ">

      <h1 style="
        margin:0;
        color:#E50914;
        font-size:46px;
        letter-spacing:10px;
        font-weight:900;
      ">
        COVEILLA
      </h1>

      <p style="
        margin-top:10px;
        color:#888;
        font-size:13px;
        letter-spacing:5px;
      ">
        EVERY STORY BEGINS HERE
      </p>

      <h2 style="
        margin-top:50px;
        color:#fff;
        font-size:30px;
        font-weight:800;
      ">
        Your story has reached us.
      </h2>

      <p style="
        margin-top:12px;
        color:#bdbdbd;
        font-size:16px;
        line-height:1.7;
      ">
        Now let us write the next chapter together.
      </p>

    </div>

    <!-- BODY (NO BOXES, JUST FLOW TEXT) -->
    <div style="
      padding:50px 40px;
      color:#e6e6e6;
      font-size:16px;
      line-height:2;
    ">

      <p style="color:#fff;font-size:18px;">
        Hello ${name}, 👋
      </p>

      <p>
        Thank you for contacting
        <span style="color:#E50914;font-weight:600;">Coveilla Blog</span>.
      </p>

      <p>
        We truly appreciate writers, readers, creatives,
        and everyone who takes the time to connect with us.
        Your message has been successfully received and is now under review.
      </p>

      <!-- NETFLIX STYLE STATUS STRIP (MINIMAL, NOT A BOX) -->
      <div style="
        margin:35px 0;
        padding-left:14px;
        border-left:2px solid #E50914;
      ">
        <p style="margin:6px 0;">✔ Message Received</p>
        <p style="margin:6px 0;">✔ Awaiting Review</p>
        <p style="margin:6px 0;">✔ Response Coming Soon</p>
      </div>

      <p>
        Rest assured, your message won’t be left unattended.
        We’ll review it carefully and respond as soon as possible.
      </p>

      <p>
        Every conversation starts with a single message — and yours just did.
      </p>

      <p style="
        color:#fff;
        font-size:18px;
        font-weight:700;
      ">
        We’re excited to connect with you.
      </p>

      <p>
        Thank you for being part of the
        <span style="color:#E50914;font-weight:600;">Coveilla community.</span>
      </p>

    </div>

    <!-- FOOTER (SUPER MINIMAL NETFLIX FEEL) -->
    <div style="
      padding:40px;
      text-align:center;
      border-top:1px solid #1a1a1a;
      background:#000;
    ">

      <p style="margin:0;color:#fff;font-weight:600;">
        Godscovenant Patrick Udofe
      </p>

      <p style="margin-top:10px;color:#E50914;">
        Founder, Coveilla Blog
      </p>

      <p style="
        margin-top:20px;
        color:#666;
        font-size:12px;
        font-style:italic;
      ">
        "Where stories inspire, creativity thrives, and every voice matters."
      </p>

      <p style="
        margin-top:25px;
        color:#444;
        font-size:11px;
      ">
        Automated confirmation email • Do not reply
      </p>

    </div>

  </div>
</div>
`;
}

module.exports = visitorEmail;