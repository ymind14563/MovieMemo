//영화 상세페이지
// (영화)상세 페이지  viewMovieDetails()

//리뷰 등록
// 리뷰 등록 버튼 postReview()


// 리뷰 모달 버튼
const modal = document.querySelector('.movie_review_modal_bg');

const postReview = () => {
   modal.classList.remove('hidden');
   modal.classList.add('visible');
};

const closeModal = () => {
   modal.classList.add('hidden');
   modal.classList.remove('visible');
};



// 영화 api 불러오기 관련
const key = "BNUTWI8LOC2C99593QD4";
const movieUrl = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&title="파묘"&ServiceKey=${key}`;

async function movieInfo(){

  try{
      const movie = await axios.get(movieUrl);
    
      console.log("영화 데이터 전체", movie);

      
  }catch(error){
    console.log(error);
  }
}

movieInfo();