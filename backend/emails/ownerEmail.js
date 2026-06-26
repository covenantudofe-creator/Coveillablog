function ownerEmail(name, email, subject, message) {
  return `
<!doctype html>
<html>
<head>
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
</head>

<body style="
  margin:0;
  padding:0;
  background:#000;
  font-family:Arial, Helvetica, sans-serif;
">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#000;">
    <tr>
      <td align="center">

        <!-- MAIN CONTAINER -->
        <table role="presentation" width="680" cellspacing="0" cellpadding="0" style="
          max-width:680px;
          width:100%;
          background:#000;
          border:1px solid #1a1a1a;
        ">

          <!-- HEADER STRIP -->
          <tr>
            <td style="
              padding:18px 24px;
              background:#0b0b0b;
              border-bottom:1px solid #1f1f1f;
            ">

              <span style="
                color:#E50914;
                font-weight:700;
                letter-spacing:2px;
                font-size:13px;
              ">
                COVEILLA ALERT
              </span>

              <span style="
                float:right;
                color:#666;
                font-size:11px;
              ">
                FOUNDER DASHBOARD
              </span>

            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td style="
              padding:60px 40px 30px;
              text-align:left;
            ">

              <div style="
                color:#fff;
                font-size:30px;
                font-weight:800;
              ">
                🎬 New message detected
              </div>

              <div style="
                margin-top:10px;
                color:#888;
                font-size:13px;
              ">
                Coveilla Blog • Incoming transmission
              </div>

            </td>
          </tr>

          <!-- DETAILS (NETFLIX META STYLE) -->
          <tr>
            <td style="
              padding:0 40px 30px;
              color:#ddd;
              font-size:14px;
              line-height:1.9;
            ">

              <div style="margin-bottom:14px;">
                <span style="color:#666;">NAME</span><br>
                <span style="color:#fff;">${name}</span>
              </div>

              <div style="margin-bottom:14px;">
                <span style="color:#666;">EMAIL</span><br>
                <span style="color:#fff;">${email}</span>
              </div>

              <div style="margin-bottom:14px;">
                <span style="color:#666;">SUBJECT</span><br>
                <span style="color:#fff;">${subject}</span>
              </div>

            </td>
          </tr>

          <!-- MESSAGE BLOCK (CINEMATIC STRIP) -->
          <tr>
            <td style="
              padding:0 40px 30px;
            ">

              <div style="
                background:#0f0f0f;
                border-left:3px solid #E50914;
                padding:20px;
              ">

                <div style="
                  color:#E50914;
                  font-weight:700;
                  margin-bottom:10px;
                  font-size:13px;
                  letter-spacing:1px;
                ">
                  MESSAGE
                </div>

                <div style="
                  color:#e6e6e6;
                  white-space:pre-wrap;
                  line-height:2;
                  font-size:14px;
                ">
${message}
                </div>

              </div>

            </td>
          </tr>

          <!-- STATUS STRIP -->
          <tr>
            <td style="
              padding:0 40px 40px;
            ">

              <div style="
                padding:14px 16px;
                background:#0b0b0b;
                border:1px solid #1a1a1a;
              ">

                <span style="color:#00e676;font-size:12px;">
                  ● LIVE REQUEST
                </span>

                <span style="
                  float:right;
                  color:#999;
                  font-size:12px;
                ">
                  Reply → ${email}
                </span>

              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="
              padding:30px;
              text-align:center;
              border-top:1px solid #1a1a1a;
            ">

              <div style="
                color:#E50914;
                font-weight:700;
                font-size:13px;
              ">
                Coveilla System
              </div>

              <div style="
                margin-top:10px;
                color:#555;
                font-size:11px;
              ">
                Automated alert • Do not ignore
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
}

module.exports = ownerEmail;