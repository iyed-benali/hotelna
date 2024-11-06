const jwt = require("jsonwebtoken");
const { createErrorResponse } = require("../utils/error-handle");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; 

  if (!token) {
    return res.status(401).json(createErrorResponse("Access denied. No token provided.", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json(createErrorResponse("Invalid or expired token.", 401));
  }
};

module.exports = verifyToken;
