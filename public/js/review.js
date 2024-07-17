//영화 상세페이지
// (영화)상세 페이지  viewMovieDetails()

//리뷰 등록
// 리뷰 등록 버튼 postReview()

const modal = document.querySelector('.movie_review_modal_bg');

const postReview = () => {
   modal.classList.remove('hidden');
   modal.classList.add('visible');
};

const closeModal = () => {
   modal.classList.add('hidden');
   modal.classList.remove('visible');
};