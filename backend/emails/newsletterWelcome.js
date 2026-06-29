module.exports = (email) => {
  return `
  <div style="
    margin:0;
    padding:50px 20px;
    background:#050505;
    font-family:Arial,Helvetica,sans-serif;
  ">

    <div style="
      max-width:650px;
      margin:auto;
      background:#111111;
      border:1px solid #1d1d1d;
      border-radius:20px;
      overflow:hidden;
      box-shadow:0 20px 60px rgba(0,0,0,.45);
    ">

      <div style="
        background:#E50914;
        padding:35px;
        text-align:center;
      ">
        <h1 style="
          color:#fff;
          margin:0;
          font-size:34px;
          letter-spacing:2px;
        ">
          COVEILLA
        </h1>

        <p style="
          color:#fff;
          margin-top:12px;
          font-size:15px;
          opacity:.95;
        ">
          Stories That Stay With You
        </p>
      </div>

      <div style="padding:45px;">

        <h2 style="
          color:#ffffff;
          margin-top:0;
        ">
          Welcome to Coveilla 🎬
        </h2>

        <p style="
          color:#cfcfcf;
          line-height:1.9;
          font-size:16px;
        ">
          Thank you for subscribing to the
          <strong style="color:#fff;"> Coveilla Blog.</strong>
        </p>

        <p style="
          color:#cfcfcf;
          line-height:1.9;
          font-size:16px;
        ">
          You'll now receive updates about:
        </p>

        <ul style="
          color:#ffffff;
          line-height:2;
          padding-left:20px;
        ">
          <li>🎬 Original Screenplays</li>
          <li>✍ Creative Writing Articles</li>
          <li>📚 Storytelling Tips</li>
          <li>🚀 Exclusive Coveilla Content</li>
        </ul>

        <div style="
          margin:40px 0;
          text-align:center;
        ">

          <a
            href="https://yourwebsite.com"
            style="
              background:#E50914;
              color:white;
              text-decoration:none;
              padding:15px 30px;
              border-radius:10px;
              display:inline-block;
              font-weight:bold;
            "
          >
            Visit Coveilla
          </a>

        </div>

        <hr style="
          border:none;
          border-top:1px solid #222;
          margin:35px 0;
        ">

        <p style="
          color:#8d8d8d;
          font-size:14px;
          line-height:1.8;
        ">
          This email was sent to
          <strong style="color:#fff;">${email}</strong>
          because you subscribed to Coveilla.
        </p>

        <p style="
          color:#666;
          font-size:13px;
          margin-top:25px;
        ">
          © ${new Date().getFullYear()} Coveilla.
          All rights reserved.
        </p>

      </div>

    </div>

  </div>
  `;
};