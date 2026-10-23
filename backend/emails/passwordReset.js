function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

module.exports = function passwordResetEmail(resetUrl) {
  const safeUrl = escapeHtml(resetUrl);
  return `
    <div style="margin:0;padding:32px;background:#080808;color:#f5f5f5;font-family:Arial,Helvetica,sans-serif">
      <div style="max-width:560px;margin:0 auto;padding:32px;background:#141414;border-top:4px solid #e50914;border-radius:8px">
        <p style="color:#e50914;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase">Coveilla Blog</p>
        <h1 style="font-size:26px">Reset your password</h1>
        <p style="color:#c8c8c8;line-height:1.6">A password reset was requested for your Coveilla account. Use the link below within 30 minutes to choose a new password.</p>
        <p style="margin:28px 0"><a href="${safeUrl}" style="display:inline-block;padding:13px 20px;border-radius:4px;background:#e50914;color:#fff;font-weight:bold;text-decoration:none">Choose a new password</a></p>
        <p style="color:#999;font-size:13px;line-height:1.6">If you did not request this change, you can ignore this email. The link can only be used once.</p>
      </div>
    </div>`;
};
