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
}

function toggleModal(){
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
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

loginBtn.addEventListener("click", toggleModal);

closeBtn.addEventListener("click", toggleModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    toggleModal();
  }
});

document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const form = document.getElementById("login-form");
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value,key) => {
      data[key] = value; //add key and value in data object
    })

    //send post request
    try {
      const response = await axios.post("/login", data);
      console.log(response);
      if(response.status === 200){
        handleSuccessfulLogin();
        window.location.href = '/' //main page when successed
      }
      
    } catch (error) {
      if(error.response && error.response.status === 400){
        const errors = error.response.data.errors;
        displayErrors(errors)
      } else {
        console.log(error);
      }
      
    }
  });

  function displayErrors(errors){
    const errorContainer = document.getElementById('error-container')
    errorContainer.innerHTML = '';

    errors.forEach((error) => {
     errorContainer.innerHTML +=`<p>${error.msg}</p>` 
    })
  }


 // main posters api 


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
  const genres = ['액션', '코메디', '멜로드라마','드라마','판타지','SF','어드벤처'];
  const sectionClasses = ['action-section', 'comedy-section', 'romance-section','drama-section','fantasy-section', 'sf-section','adventure-section'];

  shuffleArraysInSync(genres, sectionClasses);

  const sections = document.querySelectorAll('.second-swiper');


  sections.forEach(async (section, index) => {
    const genre = genres[index];
    const sectionClass = sectionClasses[index];

    section.innerHTML = ''; // Clear existing content

    // Set the genre as the section title (h3 element)
    const h3 = document.createElement('h3');
    h3.textContent = genre;
    section.appendChild(h3);

    // Fetch movies by genre and populate swiper slides
    const moviesWithPosters = await fetchMoviesByGenre(genre);

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');

    moviesWithPosters.forEach((movie) => {
      const posterUrls = movie.posters.split("|").map((url) => url.trim());
      const firstPosterUrl = posterUrls.length > 0 ? posterUrls[0] : null;
      dynamicSlides(firstPosterUrl, sectionClass, movie, swiperWrapper);
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

createSection()

async function fetchMoviesByGenre(genre){
  try {
    const response = await axios.get(`/movie/genreList/${encodeURIComponent(genre)}`)
    return response.data.movies;
  }catch(error){
    console.error(error)
    throw error
  }
}

async function sendMovieIdToBackend(movieId) {
  try {
    const response = await axios.get(
      `/movie/movieInfo/${encodeURIComponent(movieId)}`
    );
    console.log("Movie ID sent to backend successfully", response.data);
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

  cardContent.appendChild(image);
  cardContainer.appendChild(cardContent);
  swiperSlide.appendChild(cardContainer);
  swiperWrapper.appendChild(swiperSlide);

  image.addEventListener("click", () => {
    const movieId = movieData.movieId;
    if (movieId) {
      sendMovieIdToBackend(movieId); // Send movie ID to backend
      window.location.href = `reviewpage.html?id=${encodeURIComponent(
        movieId
      )}`;
    } else {
      console.error("No movieId for this movie", movieData);
    }
  });

}


