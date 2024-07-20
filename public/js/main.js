
//first slide



async function fetchTopReviews(limit = 3) {
  try {
    const response = await axios.get(`/review/getTopReviews/${limit}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching top reviews:", error);
    return [];
  }
}

fetchTopReviews().then((data) => console.log("Fetched data:", data));

async function fetchMovieDetails(movieId) {
  try {
    const response = await axios.get(`/movie/movieInfo/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching movie details for movieId ${movieId}:`,
      error
    );
    return null;
  }
}


async function initializeSwiper() {
  //fetch top reviews
  const reviews = await fetchTopReviews();

  //unique movieId
  const movieIds = reviews.map((review) => review.movieId);
  
  //fetch movie details for movieId
  const movieDetailsPromises = movieIds.map((id) => fetchMovieDetails(id));
  const movieDetailsArray = await Promise.all(movieDetailsPromises);

  const movieDetailsMap = movieDetailsArray.reduce((map, movie) => {
    if (movie) {
      map[movie.movieId] = movie;
    }
    return map;
  }, {});

  const swiperWrapper = document.querySelector('.swiper-wrapper')

  reviews.forEach(review => {
   const movie = movieDetailsMap[review.movieId];

   if (movie) {
     const slide = document.createElement("div");
     slide.classList.add("swiper-slide");

     // Create content with poster and review text
     const poster = document.createElement("img");
     poster.src = movie.posterUrl; // URL of the movie poster
     poster.alt = movie.movieTitle;

     const content = document.createElement("p");
     content.textContent = review.content; // Review content

     slide.appendChild(poster);
     slide.appendChild(content);

     swiperWrapper.appendChild(slide);
   }
  })
const firstSwiper = new Swiper(".first-swiper", {
  // Optional parameters
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },

  // Navigation arrows
  navigation: {
    nextEl: ".custom-next-button-first",
    prevEl: ".custom-prev-button-first",
  },

  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});

  
}
initializeSwiper()

// modal

const loginBtn = document.querySelector("#openLoginModal");
const modal = document.querySelector(".loginModal");
const closeBtn = document.querySelector(".close");
const overlay = document.querySelector(".overlay");

function handleSuccessfulLogin() {
  localStorage.setItem('isLoggedIn', 'true');
  updateUIForLoggedInUser();
}

function updateUIForLoggedInUser() {
  if (loginBtn) {
    loginBtn.textContent = "로그아웃";
    loginBtn.removeEventListener("click", toggleModal);
    loginBtn.addEventListener("click", logoutUser);
  }
  updateNavBarForLoggedInUser();
}

function updateNavBarForLoggedInUser() {
  const navList = document.querySelector("nav ul");
  const myPageButton = document.createElement("button");
  myPageButton.innerHTML = '<a href="/mypage">마이페이지</a>';
  const existingMyPageButton = document.querySelector('#myPageButton');
  if (!existingMyPageButton) {
    myPageButton.id = 'myPageButton'; 
    navList.appendChild(myPageButton);
  }
}


function logoutUser(){
  localStorage.removeItem("isLoggedIn");
  window.location.reload();
} 

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    updateUIForLoggedInUser();
  }
});

//  main posters api 


function shuffleArraysInSync(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have the same length');
  }

  for (let i = arr1.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements in both arrays
    [arr1[i], arr1[j]] = [arr1[j], arr1[i]];
    [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
  }
}

// Function to create sections with shuffled genres and section classes
async function createSection() {
  const genres = ['액션', '코메디', '멜로','드라마','판타지','SF','어드벤처'];
  const sectionClasses = ['action-section', 'comedy-section', 'romance-section','drama-section','fantasy-section', 'sf-section','adventure-section'];

  shuffleArraysInSync(genres, sectionClasses);

  const sections = document.querySelectorAll('.second-swiper');


  sections.forEach(async(section, index) => {
    const genre = genres[index];
    const sectionClass = sectionClasses[index];
    let moviesFromBackend;
    section.innerHTML = ''; // Clear existing content

    // Set the genre as the section title (h3 element)
    const h3 = document.createElement('h3');
    h3.textContent = genre;
    section.appendChild(h3);
    // Fetch movies by genre and populate swiper slides
    const result = await axios({
      method : 'get',
      url : `/movie/genreList/${genre}`,
    }).then((res)=>{
      moviesFromBackend = res.data.data;
    })
    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    await moviesFromBackend.forEach((movie) => {
      const posterUrls = movie.posterUrl
      dynamicSlides(posterUrls, sectionClass, movie, swiperWrapper);
      });
    
    section.appendChild(swiperWrapper);

    const prevButton = document.createElement('div');
    prevButton.classList.add('swiper-button-prev');
    section.appendChild(prevButton);

    const nextButton = document.createElement('div');
    nextButton.classList.add('swiper-button-next');
    section.appendChild(nextButton);

    new Swiper(section, {
      slidesPerView: 6,
      spaceBetween: 0,
      loop: true,
      navigation: {
        nextEl: section.querySelector('.swiper-button-next'),
        prevEl: section.querySelector('.swiper-button-prev'),
      },
    });


  }); 

  
}

async function fetchMoviesByGenre(genre){
  try {
    const response = await axios.get(`/movie/genreList/${(genre)}`)
    return response.data.movies;
  }catch(error){
    console.error(error)
    throw error
  }
}
async function sendMovieIdToBackend(movieId) {
  try {
    const response = await axios.get(
      `/movie/movieInfo/${(movieId)}`
    );
    // console.log("Movie ID sent to backend successfully", response.data);
  } catch (error) {
    console.error("Error sending movie ID to backend", error);
  }
}


function dynamicSlides(url, sectionClass, movieData, swiperWrapper) {
  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');

  const cardContent = document.createElement('div');
  cardContent.classList.add('card-content');

  const image = document.createElement('img');
  image.src = url;
  image.alt = 'poster';
  image.id = movieData.movieId;
  
  cardContent.appendChild(image);
  cardContainer.appendChild(cardContent);
  swiperSlide.appendChild(cardContainer);
  swiperWrapper.appendChild(swiperSlide);

  image.addEventListener("click", (e) => {
    let targetE =e.target;
    const movieId = e.target.id;
    if (movieId) {
      sendMovieIdToBackend(movieId); // Send movie ID to backend
      window.location.href = `/movie/movieInfo/${(movieId)}`;
    } else {
      console.error("No movieId for this movie", movieData);
    }
  });

}

createSection();