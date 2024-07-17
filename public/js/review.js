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

// 영화 제목
const movieTitle = document.querySelector('.movie_title > .contents_title');

// 영화 포스터
const moviePoster = document.querySelector('.poster_box');

// 영화 줄거리
const moviePlot = document.querySelector('.story_box > .content_text');

// 출연 배우들
const actors = document.querySelector('.cast_list');

// 개봉일
const releaseDate = document.querySelector('.release_date');

// 영화 감독
const director = document.querySelector('.director');

// 영화 장르
const movieGenre = document.querySelector('.genre');

// 영화 예고편
const trailerMovie = document.querySelector('.trailer_box');


async function movieInfo(){

  try{
      const movie = await axios.get(movieUrl);
    
      // console.log("영화 데이터 전체", movie);

      // 데이터 공통 경로 변수에 담기
      const movieShort = movie.data.Data[0].Result[0];

      // * 영화 포스터 가져오기 *
      const urlString = movie.data.Data[0].Result[0].posters;

      // 1. URL을 '|'로 분리하여 배열로 만듭니다.
      const posterUrls = urlString.split('|');
      
      // 2. 첫 번째 URL을 가져옵니다.
      const firstUrl = posterUrls[0];
      
      // 3. img 태그에 이미지 넣기
      moviePoster.innerHTML = `<img src="${firstUrl}" alt="${movieShort.title}">`;



      // 영화 예고편 가져오기
      const trailerUrl = new URL(movieShort.vods.vod[0].vodUrl);

      // 쿼리 파라미터에서 'pFileNm' 값을 가져옴
      const pFileNmValue = trailerUrl.searchParams.get('pFileNm');
          
      // pathname에서 'trailerPlayPop'를 'play'로 변경
      trailerUrl.pathname = trailerUrl.pathname.replace('/trailerPlayPop', '/play');
          
      // 최종 URL 생성
      const newUrl = `${trailerUrl.origin}${trailerUrl.pathname}/${pFileNmValue}`;

      trailerMovie.innerHTML = `<video src="${newUrl}" autoplay muted loop></video>`;

      //영화 제목 가져오기
      movieTitle.textContent = movie.data.KMAQuery;
      
  }catch(error){
    console.log(error);
  }
}

movieInfo();