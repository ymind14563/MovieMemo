const encUtil = require("../utils/encrypt");
const jwt = require("jsonwebtoken");
const { Member } = require("../model");
const { validationResult } = require("express-validator");

//로그인
exports.loginMember = async (req, res) => {
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
    req.headers.authorization = `Bearer ${token}`;
    req.session.token = token;
    
    // 로그인 성공
    // res.redirect("/member");
    res.json({ message: member, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "서버 오류" });
  }
};

//회원 가입
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

// 비밀번호 수정 (회원정보 업데이트)
exports.patchMember = async (req, res) => {
  try {
    const { currentPassword, password, age, gender } = req.body;

    // 입력값 검증
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 현재 비밀번호 검증
    const memberId = req.memberId;
    const member = await Member.findOne({ where: { memberId } });
    if (!member) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    const isMatch = await encUtil.comparePw(currentPassword, member.password);
    if (!isMatch) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    const updateData = {};
    if (password) {
      // 비밀번호 해싱 처리
      const hashedPassword = await encUtil.hashPw(password);
      updateData.password = hashedPassword;
    }

    if (age) {
      updateData.age = age;
    }

    if (gender) {
      updateData.gender = gender;
    }

    // 회원 정보 업데이트
    await Member.update(updateData, { where: { memberId } });

    return res.status(200).json({ message: '회원정보가 성공적으로 업데이트되었습니다.' });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: '서버 오류', error: error.message });
  }
};

// 비밀번호 확인
exports.verifyPassword = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const memberId = req.memberId;

    const member = await Member.findOne({ where: { memberId } });
    if (!member) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    const isMatch = await encUtil.comparePw(currentPassword, member.password);
    if (isMatch) {
      return res.status(200).json({ message: '비밀번호가 일치합니다.' });
    } else {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: '서버 오류' });
  }
};

//회원 탈퇴
exports.deleteMember = async (req, res) => {
  const memberId = req.memberId;
  const isAdmin = req.isAdmin;

  try {
    const member = await Member.findOne({ where: { memberId } });
    if (!member) {
      return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
    }

    if (member.memberId !== memberId && !isAdmin) {
      console.log('권한이 없습니다.');
      return res.status(403).json({ message: '유효하지 않은 접근입니다.' });
    }

    console.log('Deleting member with ID:', memberId);
    await Member.destroy({ where: { memberId } });

    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ message: '로그아웃 실패' });
      }
      res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' });
    });
  } catch (error) {
    console.error('회원 탈퇴 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};


// 로그아웃
exports.logoutMember = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "로그아웃 실패" });
      }
      res.status(200).json({ message: "로그아웃 되었습니다." });
      req.headers.authorization = '';
    });
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }

};


