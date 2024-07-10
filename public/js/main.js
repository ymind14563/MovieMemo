const firstSwiper = new Swiper(".first-swiper", {
  // Optional parameters
  loop: true,

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});

const secondSwiper = new Swiper(".second-swiper", {
  slidesPerView: 6,
  spaceBetween: 0,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

// modal

const loginBtn = document.querySelector("#openLoginModal");
const modal = document.querySelector(".loginModal");
const closeBtn = document.querySelector(".close");
const overlay = document.querySelector(".overlay");

loginBtn.addEventListener("click", function () {
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
});

closeBtn.addEventListener("click", function () {
  modal.classList.toggle("hidden");
  overlay.classList.toggle("hidden");
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    modal.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
  }
});
