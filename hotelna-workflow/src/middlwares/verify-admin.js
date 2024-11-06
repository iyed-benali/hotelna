const jwt = require("jsonwebtoken");



const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized." });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(403).json({ message: "Unauthorized." });
    }
    req.user = decoded;
    console.log("Decoded token:", decoded);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only." });
    }
    next();
  });
};



module.exports = verifyAdmin;
