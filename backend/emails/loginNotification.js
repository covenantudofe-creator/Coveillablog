function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function details({ email, method, occurredAt, resetUrl }) {
  const safeEmail = email ? escapeHtml(email) : null;
  const safeMethod = escapeHtml(method);
  const safeDate = escapeHtml(occurredAt.replace("T", " ").replace(/\.\d{3}Z$/, " UTC"));
  const recovery = resetUrl
    ? `<p style="margin:24px 0"><a href="${escapeHtml(resetUrl)}" style="display:inline-block;padding:12px 18px;border-radius:4px;background:#e50914;color:#fff;font-weight:bold;text-decoration:none">Open password recovery</a></p><p style="color:#999;font-size:13px">Choose Forgot password on the sign-in page.</p>`
    : "<p>To change your password, open Coveilla and choose Forgot password on the sign-in page.</p>";
  return { safeEmail, safeMethod, safeDate, recovery };
}

function frame(title, content) {
  return `
    <div style="margin:0;padding:32px;background:#080808;color:#f5f5f5;font-family:Arial,Helvetica,sans-serif">
      <div style="max-width:560px;margin:0 auto;padding:32px;background:#141414;border-top:4px solid #e50914;border-radius:8px">
        <p style="color:#e50914;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Coveilla Blog</p>
        <h1 style="font-size:24px">${title}</h1>
        ${content}
      </div>
    </div>`;
}

function ownerLoginEmail(event) {
  const { safeEmail, safeMethod, safeDate } = details(event);
  const account = safeEmail
    ? `<p><strong>Account email:</strong> ${safeEmail}</p>`
    : "<p><strong>Account:</strong> Administrator username/password</p>";
  return frame("New Login to Coveilla Blog", `
    <p style="color:#c8c8c8;line-height:1.6">An account signed in successfully.</p>
    ${account}
    <p><strong>Login time:</strong> ${safeDate}</p>
    <p><strong>Login method:</strong> ${safeMethod}</p>
    <p style="color:#999;font-size:13px;line-height:1.6">Review this activity if you do not recognize it.</p>`);
}

function userLoginEmail(event) {
  const { safeMethod, safeDate, recovery } = details(event);
  return frame("New Login to Your Coveilla Account", `
    <p style="color:#c8c8c8;line-height:1.6">Your Coveilla account was accessed successfully.</p>
    <p><strong>Login time:</strong> ${safeDate}</p>
    <p><strong>Login method:</strong> ${safeMethod}</p>
    <p style="color:#c8c8c8;line-height:1.6">If you do not recognize this activity, secure your account by resetting your password.</p>
    ${recovery}`);
}

module.exports = { ownerLoginEmail, userLoginEmail };
