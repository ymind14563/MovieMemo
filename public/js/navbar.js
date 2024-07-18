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

//nav-bar search Area
const SmethodElement = document.querySelector('.search-box-Smethod');

SmethodElement.addEventListener('click', () => {
  let Smethod = SmethodElement.textContent.trim();
  if (Smethod === 'Title') {
    SmethodElement.innerHTML=`<span style="color: red; font-size: 2rem;">A</span>ctor`;
    document.querySelector('.search-box-word').setAttribute('placeholder','배우 이름을 입력해주세요');
  } else {
    SmethodElement.innerHTML=`<span style="color: red; font-size: 2rem;">T</span>itle`;
    document.querySelector('.search-box-word').setAttribute('placeholder','영화 제목을 입력해주세요');
  }
});

const searchBtn = document.querySelector('.search-box-btn');
searchBtn.addEventListener('click',()=>{
  window.location.href = SmethodElement.textContent==='Title'
  ? `/movie/searchT/${document.querySelector('.search-box-word').value}`
  : `/movie/searchA/${document.querySelector('.search-box-word').value}`;
})