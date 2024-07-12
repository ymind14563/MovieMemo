const express = require(`express`);
const router = express.Router();
const controller = require(`../controller/CReview`);

// 기본 요청 경로 localhost:PORT/review

// 리뷰 생성
router.post(`/`, controller.postReview);

// 특정 리뷰 한개 조회
router.get(`/:reviewId`, controller.getReview);

// 회원이 작성한 리뷰 목록
router.get(`/member/:memberId`, controller.getMemberReviewList);

// 영화에 작성된 리뷰 목록
router.get(`/movie/:movieId`, controller.getMovieReviewList);

// 특정 리뷰 내용 수정
router.patch(`/:reviewId`, controller.patchReview);

// 특정 리뷰 내용 삭제
router.delete(`/:reviewId`, controller.deleteReview);

// 좋아요
router.post('/like', controller.likeReview);

// 신고
router.post('/report', controller.reportReview);

module.exports = router;