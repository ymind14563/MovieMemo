// (영화)상세 페이지  viewMovieDetails()
//리뷰 등록
// 리뷰 등록 버튼 postReview()
let nowPage = 0;

const targerE = document.querySelector('.trailer_box');
const targerId = targerE.id;
  
// 리뷰 모달 버튼
const createReview = document.querySelector('.createReviewBtn');
const buttonClose = document.querySelector('.buttonClose');
const rvmodal = document.querySelector('.movie_review_modal_bg');

createReview.addEventListener('click', () => {
  rvmodal.classList.remove('hidden');
  rvmodal.classList.add('visible');
})

buttonClose.addEventListener('click', () => {
  rvmodal.classList.add('hidden');
  rvmodal.classList.remove('visible');
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

// UI 업데이트를 위한 함수
function updateLikeCount(likeCount) {
  const likeCountDisplay = document.querySelector('.likeCount');
  likeCountDisplay.textContent = likeCount; // 좋아요 수 업데이트
}

// 리뷰 작성 버튼

async function getUserNickname() {
  try {
    let result = {};
    await axios.get('/member/nickname', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      }).then((res)=>{
        result = res.data;
      });

      return result;
  } catch (error) {
      console.error('사용자 닉네임을 가져오는 중 오류 발생:', error);
      return null;
  }
}

function getRating() {
  // name이 'rating'인 모든 라디오 버튼을 선택합니다.
  const ratingInputs = document.querySelectorAll('input[name="rating"]');
  
  // 선택된 라디오 버튼을 찾습니다.
  for (const input of ratingInputs) {
    if (input.checked) {
      return input.value; // 선택된 라디오 버튼의 값을 반환합니다.
    }
  }
  
  // 선택된 라디오 버튼이 없는 경우
  return null;
}

document.querySelector('.reviewSubBtn').addEventListener('click', async function(e) {
  e.preventDefault();
  const RVRating = getRating();
  if( !RVRating ){
    alert('리뷰에 등록할 평점을 입력해주세요');
  }

  const reviewPost = document.getElementById('reviewPost').value;
  const memberInfo = await getUserNickname();
  let userNick = memberInfo.nickname;
  let userId = memberInfo.userId;

  try {  
    const response = await axios.post('/review', 
          {
            reviewMovieRating: RVRating,
            content : reviewPost,
            memberId : userId,
            movieId: targerId
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // document.getElementById('responseMessage').innerText = response.data.message;
        document.querySelector('#reviewForm').reset();
        
        window.location.href = `/movie/movieInfo/${targerId}`
      } catch (error) {
        console.error(err)
      }
  });


document.addEventListener('DOMContentLoaded', async ()=>{
  
  let data;

  await axios({
    method : 'get',
    url : `/review/movie/${targerId}`,
  }).then((res)=>{
    data = res.data;
  })
  if( ( 
    data.totalReviews - 6*nowPage ) < 7){ document.querySelector('.load_more').style.display = 'none';};
    data.reviews.forEach(review =>{
    let reviewHtml = `
            <div class="review_box">
          <div class="review_user">
            <div class="user_rating">
              <span class="user_nickname">${review.Member.nick}</span>
              <span> 별점 : ${review.reviewMovieRating}</span>
            </div>
            <div class="likeBox">
              <button type="button" class="likeBtn" id="likeBtn${review.reviewId}">
                <div class="like-btn-img">
                </div>
              </button>
              <p class="likeCount">${review.likeCount}</p>
            </div>
            <button type="button" class="editBtn" id="editBtn${review.reviewId}">
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
              <button type="button" class="deleteBtn" id="deleteBtn${review.reviewId}" data-review-id="123">
                <span class="material-symbols-rounded">
                  delete
                </span>
              </button>
              <button type="button" class="warningBtn" id="warningBtn${review.reviewId}">
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
  
  await axios({
    method : 'get',
    url : `/review/movie/${targerId}`,
    params: {
      page : nowPage
    }
  }).then((res)=>{
    pagedata = res.data;
  })
  
  if( 
    pagedata.totalReviews -6*nowPage < 7){ document.querySelector('.load_more').style.display = 'none';};
    pagedata.reviews.forEach(review =>{
    let reviewHtml = `
      <div class="review_box">
      <div class="review_user">
        <div class="user_rating">
          <span class="user_nickname">${review.Member.nick}</span>
          <span> 별점 : ${review.reviewMovieRating}</span>
        </div>
        <div class="likeBox">
          <button type="button" class="likeBtn" id="likeBtn${review.reviewId}">
            <div class="like-btn-img">
            </div>
          </button>
          <p class="likeCount">${review.likeCount}</p>
        </div>
        <button type="button" class="editBtn" id="editBtn${review.reviewId}">
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
          <button type="button" class="deleteBtn" id="deleteBtn${review.reviewId}" data-review-id="123">
            <span class="material-symbols-rounded" >
              delete
            </span>
          </button>
          <button type="button" class="warningBtn" id="warningBtn${review.reviewId}">
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


document.querySelector('.review_section').addEventListener('click', async function(e) {
  // 삭제 버튼 클릭 처리
  if (e.target.closest('.deleteBtn')) {
    const reviewId = e.target.closest('.deleteBtn').getAttribute('id').replace('deleteBtn','');
    await axios({
      method :'delete',
      url: `/review/${reviewId}`,
      data:{

      }
    }).then((res)=>{
      window.location.href = `/movie/movieInfo/${targerId}`
    })
    await alert('리뷰가 삭제되었습니다.')
  }

  // 신고 버튼 클릭 처리
  if (e.target.closest('.warningBtn')) {
    const reviewId = e.target.closest('.warningBtn').id.replace('warningBtn', '');
    
    await axios({
      method : 'post',
      url: `/review/report`,
      data:{
        reviewId: reviewId  
      }
    }).then((res)=>{
      window.location.href = `/movie/movieInfo/${targerId}`
    })
    await alert('리뷰를 신고했습니다.')
  }

  if (e.target.closest('.likeBtn')) {
    const reviewId = e.target.closest('.likeBtn').id.replace('likeBtn', '');

    await axios({
      method : 'post',
      url: `/review/like`,
      data:{
        reviewId: reviewId  
      }
    }).then((res)=>{
      console.log('res.result',res.data.result);
      if (res.data.result) {

      }
      window.location.href = `/movie/movieInfo/${targerId}`
    })
    await alert('리뷰에 좋아요에 대한 요청을 전달했습니다.')
  }

  // 수정 버튼 클릭 처리
  // if (e.target.closest('.editBtn')) {
  //   const reviewId = e.target.closest('.editBtn').id.replace('edidBtn', '');
  //   console.log('수정 버튼 클릭됨, 리뷰 ID:', reviewId);
  //
  // }
});

//release date

document.addEventListener('DOMContentLoaded', () => {
  const releaseBox = document.querySelector('.releaseBox');
  const releaseDateStr = releaseBox.getAttribute('data-release-date');
  
  if (releaseDateStr) {
    const releaseDate = new Date(
      releaseDateStr.substring(0, 4),  // Year
      releaseDateStr.substring(4, 6) - 1,  // Month (0-based index)
      releaseDateStr.substring(6, 8)  // Day
    );
    
    // yyyy-mm-dd
    const formattedDate = releaseDate.toISOString().slice(0, 10);
    
    document.getElementById('releaseDate').innerText = formattedDate;
  }
});