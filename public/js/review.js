//영화 상세페이지
// (영화)상세 페이지  viewMovieDetails()
//리뷰 등록
// 리뷰 등록 버튼 postReview()
let nowPage = 0;

const targerE = document.querySelector('.trailer_box');
const targerId = targerE.id;
  
// 리뷰 모달 버튼
const createReview = document.querySelector('.createReviewBtn');
const buttonClose = document.querySelector('.buttonClose');
const modal = document.querySelector('.movie_review_modal_bg');

createReview.addEventListener('click', () => {
  modal.classList.remove('hidden');
  modal.classList.add('visible');
})

buttonClose.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.classList.remove('visible');
})




// 영화 api 불러오기 관련
const key = "BNUTWI8LOC2C99593QD4";
const movieUrl = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&title="파묘"&ServiceKey=${key}`;

// 영화 제목
const movieTitle = document.querySelector('.movie_title > .contents_title');

// 영화 포스터
const moviePoster = document.querySelector('.poster_box');

// 영화 줄거리
const moviePlot = document.querySelector('.story_box > .story_text');

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

// 좋아요 버튼 누를 시 요청

const likeBtn = document.querySelector('.likeBtn');

// likeBtn.addEventListener('click', async () => {
//   const reviewId = likeBtn.dataset.reviewId; // 버튼에 reviewId 데이터 속성이 있다고 가정
//   const memberId = 'YOUR_MEMBER_ID'; // 실제 memberId를 설정하세요

//   try {
//       const response = await axios.post('/like', { reviewId }, {
//           headers: {
//               'Authorization': `Bearer ${memberId}` // 필요한 경우 인증 헤더 추가
//           }
//       });

//       // 성공적인 응답 처리
//       alert(response.data.message);
//       updateLikeCount(response.data.review.likeCount); // UI 업데이트 함수 호출
//   } catch (error) {
//       // 오류 처리
//       if (error.response) {
//           alert(error.response.data.message); // 서버에서 보낸 오류 메시지
//       } else {
//           console.error('Error:', error.message);
//           alert('좋아요를 처리하는 중 오류가 발생했습니다.');
//       }
//   }
// });

// UI 업데이트를 위한 함수
function updateLikeCount(likeCount) {
  const likeCountDisplay = document.querySelector('.likeCount');
  likeCountDisplay.textContent = likeCount; // 좋아요 수 업데이트
}




// 리뷰 작성 버튼

async function getUserNickname() {
  try {
    const response = await axios.get('/user/nickname', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });
      return response.data.nickname;
  } catch (error) {
      console.error('사용자 닉네임을 가져오는 중 오류 발생:', error);
      return null;
  }
}

document.querySelector('.reviewSubBtn').addEventListener('click', async function(e) {
  e.preventDefault();

  const rating = document.getElementById('rating').value;
  const reviewPost = document.getElementById('reviewPost').value;

  const nickname = await getUserNickname();

  if (!nickname) {
      document.getElementById('responseMessage').innerText = '닉네임을 가져오는 데 실패했습니다.';
      return;
  }

  try {
      const response = await axios.post('/review', {
          reviewMovieRating: rating,
          reviewPost,
          nickname
      }, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });

        document.getElementById('responseMessage').innerText = response.data.message;
        addReviewToList({ rating, reviewPost, nickname });
        document.getElementById('reviewForm').reset();
    } catch (error) {
        if (error.response) {
            document.getElementById('responseMessage').innerText = error.response.data.message;
        } else {
            document.getElementById('responseMessage').innerText = '서버에 요청 중 오류가 발생했습니다.';
        }
      }
  });

function addReviewToList(review) {
  const reviewList = document.getElementById('review_container');
  const reviewItem = document.createElement('div');

  // 현재 날짜 포맷
  const currentDate = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  reviewItem.innerHTML = `
    <span>${review.nickname}</span>
    <span>${review.rating}</span>
    <button type="button" class="likeBtn">좋아요</button>
    <button type="button" class="editBtn">수정버튼</button>
    <p class="likeCount"></p>
    <p>
    ${review.reviewPost}
    </p>
    <p>
      <span>${currentDate}</span>
      <button type="button" class="deleteBtn" data-review-id="123">삭제</button>
      <button type="button" class="warningBtn">신고버튼</button>
    </p>
  `;
  reviewList.appendChild(reviewItem);
}

// DOMContentLoaded 이벤트에 리스너 추가
document.addEventListener('DOMContentLoaded', async ()=>{
  
  let data;

  await axios({
      method : 'get',
    url : `/review/movie/${targerId}`,
  }).then((res)=>{
    data = res.data;
  })
  if( ( data.totalReviews - 6*nowPage ) < 7){ document.querySelector('.load_more').style.display = 'none';};
  data.reviews.forEach(review =>{
    let reviewHtml = `
            <div class="review_box">
          <div class="review_user">
            <div class="user_rating">
              <span class="user_nickname">${review.Member.nick}</span>
              <span> 별점 : ${review.reviewMovieRating}</span>
            </div>
            <div class="likeBox">
              <button type="button" class="likeBtn">
                <span class="material-symbols-rounded">
                  favorite
                </span>
              </button>
              <p class="likeCount">4</p>
            </div>
            <button type="button" class="editBtn">
              <span class="material-symbols-rounded">
                edit
              </span>
            </button>
          </div>
          <div class="review_content">
            <p>
            ${review.content}
            </p>
          </div>
          <div class="review_date">
            <span class="write_date">${review.createdAt.substr(0,9)}</span>

            <p class="review_btns_box">
              <button type="button" class="deleteBtn" data-review-id="123">
                <span class="material-symbols-rounded">
                  delete
                </span>
              </button>
              <button type="button" class="warningBtn">
                <span class="material-symbols-rounded">
                  dangerous
                </span>
              </button>
            </p>
          </div>`
          const reviewSc = document.querySelector('.review_section');
          reviewSc.insertAdjacentHTML('beforeend',reviewHtml);      
      })
});

const moreBtn = document.querySelector('.load_more');

moreBtn.addEventListener('click',async ()=>{
  nowPage = nowPage + 1;
  let pagedata;
  console.log(nowPage);
  
  await axios({
    method : 'get',
    url : `/review/movie/${targerId}`,
    params: {
      page : nowPage
    }
  }).then((res)=>{
    pagedata = res.data;
  })
  
  if( pagedata.totalReviews -6*nowPage < 7){ document.querySelector('.load_more').style.display = 'none';};
  pagedata.reviews.forEach(review =>{
    let reviewHtml = `
      <div class="review_box">
      <div class="review_user">
        <div class="user_rating">
          <span class="user_nickname">${review.Member.nick}</span>
          <span> 별점 : ${review.reviewMovieRating}</span>
        </div>
        <div class="likeBox">
          <button type="button" class="likeBtn">
            <span class="material-symbols-rounded">
              favorite
            </span>
          </button>
          <p class="likeCount">4</p>
        </div>
        <button type="button" class="editBtn">
          <span class="material-symbols-rounded">
            edit
          </span>
        </button>
      </div>
      <div class="review_content">
        <p>
        ${review.content}
        </p>
      </div>
      <div class="review_date">
        <span class="write_date">${review.createdAt.substr(0,9)}</span>

        <p class="review_btns_box">
          <button type="button" class="deleteBtn" data-review-id="123">
            <span class="material-symbols-rounded">
              delete
            </span>
          </button>
          <button type="button" class="warningBtn">
            <span class="material-symbols-rounded">
              dangerous
            </span>
          </button>
        </p>
      </div>`
      const reviewSc = document.querySelector('.review_section');
      reviewSc.insertAdjacentHTML('beforeend',reviewHtml);      
    })
});

