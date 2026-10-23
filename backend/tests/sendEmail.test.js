const { test } = require("node:test");
const assert = require("node:assert/strict");

process.env.MAILGUN_API_KEY = "test-only-key";
process.env.MAILGUN_DOMAIN = "sandbox.example.test";
process.env.MAILGUN_BASE_URL = "https://api.mailgun.net";

const sendEmail = require("../utils/sendEmail");

test("Mailgun sender posts the intended recipient, subject, and HTML and logs acceptance accurately", async () => {
  const originalFetch = global.fetch;
  const originalInfo = console.info;
  const infoLogs = [];
  let request;
  global.fetch = async (url, options) => {
    request = { url, options };
    return { ok: true, status: 200, json: async () => ({ id: "test-message-id" }) };
  };
  console.info = (...args) => infoLogs.push(args.join(" "));

  try {
    const result = await sendEmail(
      "reader@example.test",
      "New Login to Your Coveilla Account",
      "<p>Successful login</p>",
      { notificationType: "login", audience: "reader" }
    );
    assert.equal(result.id, "test-message-id");
    assert.equal(request.url, "https://api.mailgun.net/v3/sandbox.example.test/messages");
    assert.equal(request.options.method, "POST");
    const submitted = new URLSearchParams(request.options.body);
    assert.equal(submitted.get("to"), "reader@example.test");
    assert.equal(submitted.get("subject"), "New Login to Your Coveilla Account");
    assert.equal(submitted.get("html"), "<p>Successful login</p>");
    assert.ok(infoLogs.some((line) => line.includes("Mailgun accepted email request (login audience=reader)")));
    assert.ok(infoLogs.some((line) => line.includes("Delivery is not confirmed")));
    assert.ok(infoLogs.every((line) => !line.includes("test-only-key")));
  } finally {
    global.fetch = originalFetch;
    console.info = originalInfo;
  }
});

test("Mailgun rejection includes only safe status diagnostics and propagates to the notification handler", async () => {
  const originalFetch = global.fetch;
  const originalError = console.error;
  const errorLogs = [];
  global.fetch = async () => ({
    ok: false,
    status: 403,
    json: async () => ({ message: "recipient rejected; diagnostic detail" }),
  });
  console.error = (...args) => errorLogs.push(args.join(" "));

  try {
    await assert.rejects(
      sendEmail("reader@example.test", "Login notice", "<p>Login</p>", {
        notificationType: "login", audience: "owner",
      }),
      (error) => error.code === "MAILGUN_HTTP_403" && error.status === 403
    );
    assert.ok(errorLogs.some((line) => line.includes("Mailgun rejected email request (login audience=owner) (HTTP 403)")));
    assert.ok(errorLogs.every((line) => !line.includes("recipient rejected")));
  } finally {
    global.fetch = originalFetch;
    console.error = originalError;
  }
});
