// const jwt = require("jsonwebtoken");

// module.exports = function authMiddleware(req, res, next) {
//   const authHeader = req.headers["authorization"];

//   // Expecting header: Authorization: Bearer <token>
//   if (!authHeader) {
//     return res.status(401).json({ message: "Missing Authorization header" });
//   }

//   const token = authHeader.split(" ")[1]; // Extract token

//   if (!token) {
//     return res.status(401).json({ message: "Missing token" });
//   }

//   try {
//     const secret = process.env.JWT_SECRET;
//     if (!secret) {
//       console.error("❌ ERROR: JWT_SECRET missing from environment variables");
//       return res.status(500).json({ message: "Server config error (JWT missing)" });
//     }

//     const decoded = jwt.verify(token, secret);
//     req.user = decoded; // Attach user payload to request object

//     next(); // Continue to protected route
//   } catch (err) {
//     console.error("JWT verification failed:", err.message);
//     return res.status(403).json({ message: "Invalid or expired token" });
//   }
// };

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const jwt = require("jsonwebtoken");

module.exports = function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;    // The decoded user info (email)
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};