const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "인증되지 않았습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
    req.memberId = decoded.memberId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (err) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

const authenticateAdmin = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: "인증되지 않았습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "관리자만 접근 가능합니다." });
    }
    req.memberId = decoded.memberId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (err) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
};
