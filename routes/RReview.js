const express = require(`express`);
const router = express.Router();
const controller = require(`../controller/CReview`);

// 기본 요청 경로 localhost:PORT/review

// 리뷰 생성
router.get(`/`, controller.postReview);

// 특정 리뷰 한개 조회
router.get(`/:review_id`, controller.getReview);

// 회원이 작성한 리뷰 목록
router.get(`/member/:member_id`, controller.getMemberReviewList);

// 영화에 작성된 리뷰 목록
router.get(`/movie/:movie_id`, controller.getMovieReviewList);

// 특정 리뷰 내용 수정
router.patch(`/:review_id`, controller.updateReview);

// 특정 리뷰 내용 삭제
router.delete(`/:review_id`, controller.deleteReview);

module.exports = router;