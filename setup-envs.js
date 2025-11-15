const fs = require("fs");
const path = require("path");

console.log("🔧 Creating .env files for microservices...");

// Helper function to safely write .env files
function createEnv(servicePath, content) {
  const fullPath = path.join(__dirname, servicePath, ".env");

  if (fs.existsSync(fullPath)) {
    console.log(`Skipped: ${servicePath}/.env already exists`);
    return;
  }

  fs.writeFileSync(fullPath, content.trim() + "\n");
  console.log(`Created: ${servicePath}/.env`);
}

// -----------------------------
// LOGIN SERVICE (.env)
// -----------------------------
createEnv("Backend/login-service", `
PORT=7000
JWT_SECRET=changeme_secret_key
DATABASE_PATH=./login.sqlite
`);

// -----------------------------
// CLIENT SERVICE (.env)
// -----------------------------
createEnv("Backend/client-service", `
PORT=7002
JWT_SECRET=changeme_secret_key
DATABASE_PATH=./client.sqlite
`);

// -----------------------------
// LLM SERVICE (.env)
// -----------------------------
createEnv("Backend/llm-service", `
PORT=7001
GEMINI_API_KEY=AIzaSyBrGzToNCENjJz-maYY3-yu07NhW8_f_7A
DATABASE_PATH=./llm.sqlite
`);

console.log("\nAll .env files created!");