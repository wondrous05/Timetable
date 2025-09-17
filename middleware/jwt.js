const jwt = require("jsonwebtoken");
const Admin = require("../model/Adminmodel");

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Expected format: "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  console.log(token);

  if (!token) {
    return res.status(401).json({ msg: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload
    console.log(decoded);

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// middleware/auth.js

// const verifyAdmin = async (req, res, next) => {
// try {
// const authHeader = req.headers.authorization || req.headers.Authorization;
// if (!authHeader || !authHeader.startsWith("Bearer "))
// return res.status(401).json({ msg: "No token provided" });

// const token = authHeader.split(" ")[1];
// const decoded = jwt.verify(token, process.env.JWT_SECRET);

// // optional: load admin from DB and attach to request
// const admin = await Admin.findById(decoded.id).select("-password");
// if (!admin) return res.status(401).json({ msg: "Invalid token" });

// // ensure role is admin
// if (admin.role !== "admin" && admin.role !== "superadmin")
// return res.status(403).json({ msg: "Insufficient permissions" });

// req.user = admin;
// next();
// } catch (error) {
// console.error("verifyAdmin error", error);
// return res.status(401).json({ msg: "Token invalid or expired" });
// }
// };

module.exports = { isAuthenticated };
