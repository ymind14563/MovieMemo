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
      return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { memberId: member.memberId, isAdmin: member.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    // 세션에 저장
    req.session.token = token;

    // 로그인 성공
    // res.redirect("/member");
    res.json({ message: member });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "서버 오류" });
  }
};

exports.postMember = async (req, res) => {
  try {
    const { gender, age, name, nick, email, password } = req.body;

    // 입력값 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // 비밀번호 해시화
    const hashedPassword = await encUtil.hashPw(password);

    // 회원 생성
    const newMember = await Member.create({
      name,
      nick,
      email,
      password: hashedPassword,
      gender,
      age,
    });

    res.status(201).json(newMember);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "서버 오류" });
  }
};

//비밀번호 수정
exports.patchMember = async (req, res) => {
  try {
    const { password } = req.body;

    // 입력값 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 비밀번호 해싱 처리
    const hashedPassword = await encUtil.hashPw(password);

    // 회원 비밀번호 업데이트
    await Member.update(
      { password: hashedPassword },
      { where: { name: req.body.name } }
    );

    res.status(200).json({ message: "비밀번호가 변경되었습니다." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "서버 오류" });
  }
};

//회원 탈퇴
exports.deleteMember = async (req, res) => {
  try {
    await Member.destroy({ where: { name: req.body.name } });

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "로그아웃 실패" });
      }
      res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
    });
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
};
