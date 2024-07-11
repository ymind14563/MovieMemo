const express = require(`express`);
const { check } = require("express-validator");
const router = express.Router();
const controller = require(`../controller/CMember`);

// 기본 요청 경로 localhost:PORT/member

// 로그인
router.post(
  "/login",
  [
    check("name").notEmpty().withMessage("이름을 입력해주세요."),
    check("password")
      .isLength({ min: 8 })
      .withMessage("비밀번호는 최소 8자 이상이어야 합니다.")
      .matches(/[0-9]/)
      .withMessage("비밀번호는 숫자를 포함해야 합니다.")
      .matches(/[a-z]/)
      .withMessage("비밀번호는 소문자를 포함해야 합니다.")
      .matches(/[A-Z]/)
      .withMessage("비밀번호는 대문자를 포함해야 합니다.")
      .matches(/[\W]/)
      .withMessage("비밀번호는 특수문자를 포함해야 합니다."),
  ],
  controller.getMember
);

// 회원가입
router.post(
  "/register",
  [
    check("name").notEmpty().withMessage("이름을 입력해주세요."),
    check("nick").notEmpty().withMessage("닉네임을 입력해주세요."),
    check("password")
      .isLength({ min: 8 })
      .withMessage("비밀번호는 최소 8자 이상이어야 합니다.")
      .matches(/[0-9]/)
      .withMessage("비밀번호는 숫자를 포함해야 합니다.")
      .matches(/[a-z]/)
      .withMessage("비밀번호는 소문자를 포함해야 합니다.")
      .matches(/[A-Z]/)
      .withMessage("비밀번호는 대문자를 포함해야 합니다.")
      .matches(/[\W]/)
      .withMessage("비밀번호는 특수문자를 포함해야 합니다."),
  ],
  controller.postMember
);

// 회원 검색
router.get("/search", controller.getFindMember);

// 비밀번호 수정
router.patch(
  "/password",
  [
    check("password")
      .isLength({ min: 8 })
      .withMessage("비밀번호는 최소 8자 이상이어야 합니다.")
      .matches(/[0-9]/)
      .withMessage("비밀번호는 숫자를 포함해야 합니다.")
      .matches(/[a-z]/)
      .withMessage("비밀번호는 소문자를 포함해야 합니다.")
      .matches(/[A-Z]/)
      .withMessage("비밀번호는 대문자를 포함해야 합니다.")
      .matches(/[\W]/)
      .withMessage("비밀번호는 특수문자를 포함해야 합니다."),
  ],
  controller.patchMember
);

// 회원 탈퇴
router.delete("/", controller.deleteMember);

module.exports = router;
