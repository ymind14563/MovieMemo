const express = require(`express`);
const router = express.Router();
const controller = require(`../controller/CMember`);

// 기본 요청 경로 localhost:PORT/member

// 로그인
router.get("/login", controller.getMember);

// 회원가입
router.post("/register", controller.postMember);

// 로그인 (다시 정의)
router.post("/login", controller.getMember);

// 회원 검색
router.get("/member/search", controller.getFindMember);

// 비밀번호 수정
router.patch("/member/password", controller.patchMember);

// 회원 탈퇴
router.delete("/member", controller.deleteMember);

module.exports = router;

/*
post /member url로 요청을 보내면 검증을 통해 로그인 -> /member 페이지로 이동

get /member 로그인이 되어 있으면 회원페이지로 이동 안되어 있으면 로그인을 하라는 문구를 출력 



*/
