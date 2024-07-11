const encUtil = require("../utils/encrypt");
const jwt = require("jsonwebtoken");
const { Member } = require("../model");
const { validationResult } = require("express-validator");

exports.getMember = async (req, res) => {
  try {
    const { name, password } = req.body;

    // 입력값 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 아이디로 회원 찾기
    const member = await Member.findOne({ where: { name } });

    if (!member) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 틀렸습니다." });
    }

    // 비밀번호 비교
    const isMatch = await encUtil.comparePw(password, member.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 틀렸습니다." });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { memberId: member.memberId, isAdmin: member.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "600 * 1000",
      }
    ); //.env 파일에 JWT_SECRET=your-secret-key 키 추가

    // 세션에 저장
    req.session.token = token;

    // 로그인 성공
    res.redirect("/member");
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
};

exports.postMember = async (req, res) => {
  try {
    const { name, nick, email, password } = req.body;

    // 입력값 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 비밀번호 해시화
    const hashedPassword = await encUtil.hashPw(password, 10);

    // 회원 생성
    const newMember = await Member.create({
      name,
      nick,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
};

exports.patchMember = async (req, res) => {
  // 비밀번호 수정 로직 구현
};

exports.deleteMember = async (req, res) => {
  // 회원 탈퇴 로직 구현
};
