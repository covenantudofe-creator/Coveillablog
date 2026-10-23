
const bcrypt = require("bcryptjs");
const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

rl.question("Enter your new admin password: ", async (password) => {
  try {
    if (!password || password.length < 12) {
      console.error("\nUse a password of at least 12 characters.");
      process.exitCode = 1;
      return;
    }

    const hash = await bcrypt.hash(password, 12);
    console.log("\nYour ADMIN_PASSWORD_HASH:\n");
    console.log(hash);
  } catch {
    console.error("Could not generate the password hash.");
    process.exitCode = 1;
  } finally {
    rl.close();
  }
});
