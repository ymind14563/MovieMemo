const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "유효하지 않은 접근입니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.memberId = decoded.memberId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (err) {
    res.status(401).json({ message: "유효하지 않은 접근입니다." });
  }
};

const authenticateAdmin = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "유효하지 않은 접근입니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "유효하지 않은 접근입니다." });
    }
    req.memberId = decoded.memberId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (err) {
    res.status(401).json({ message: "유효하지 않은 접근입니다." });
  }
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
};
