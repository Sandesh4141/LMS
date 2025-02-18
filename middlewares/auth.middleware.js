import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "supersecretkey"; // Store this securely

// Middleware to authenticate users
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to restrict access based on role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

export { authenticateUser, authorizeRoles };
