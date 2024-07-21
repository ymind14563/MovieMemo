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
const searchInput = document.querySelector('.search-box-word');

function performSearch() {
  const searchTerm = searchInput.value;
  const searchMethod = SmethodElement.textContent === 'Title' ? 'searchT' : 'searchA';
  window.location.href = `/movie/${searchMethod}/${searchTerm}`;
}
searchInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
  }
});
// 버튼 클릭 이벤트
searchBtn.addEventListener('click', performSearch);


function openLoginModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}


function updateUIForLoggedInUser() {
  if (loginBtn) {
    loginBtn.textContent = "로그아웃";
    loginBtn.removeEventListener("click", openLoginModal); // Remove login modal event listener
    loginBtn.addEventListener("click", logoutUser); // Add logout event listener
  }
  removeSignUpButton(); // Remove the sign-up button
  updateNavBarForLoggedInUser(); // Add the "마이페이지" button
}

// Function to update UI for logged-out users
function updateUIForLoggedOutUser() {
  if (loginBtn) {
    loginBtn.textContent = "로그인";
    loginBtn.removeEventListener("click", logoutUser); // Remove logout event listener
    loginBtn.addEventListener("click", openLoginModal); // Add login modal event listener
  }
  addSignUpButton(); // Re-add the sign-up button
  removeMyPageButton(); // Remove "마이페이지" button 
}

function updateNavBarForLoggedInUser() {
  const existingMyPageButton = document.querySelector("#myPageButton");
  if (!existingMyPageButton) {
    const myPageButton = document.createElement("button");
    myPageButton.id = "myPageButton";
    myPageButton.innerHTML = '<a href="/mypage">마이페이지</a>';
    
    const navList = document.querySelector("nav ul");

    const logoutButton = navList.querySelector("#openLoginModal");

    if (logoutButton) {
      navList.insertBefore(myPageButton, logoutButton);
    } else {
      navList.appendChild(myPageButton);
    }
  }
}

// Function to handle user logout
function logoutUser() {
  localStorage.removeItem("token"); // Remove token from local storage
  axios.defaults.headers.common["Authorization"] = ""; // Clear the Authorization header
  updateUIForLoggedOutUser(); // Update UI
  window.location.reload(); // Reload page to reset state
}

// Function to remove the sign-up button
function removeSignUpButton() {
  const signUpButton = document.querySelector("nav ul button a[href='/register']");
  if (signUpButton) {
    signUpButton.parentElement.remove(); // Remove the button element
  }
}

// Function to add back the sign-up button
function addSignUpButton() {
  const existingSignUpButton = document.querySelector("nav ul button a[href='/register']");
  if (!existingSignUpButton) {
    const signUpButton = document.createElement("button");
    signUpButton.innerHTML = '<a href="/register">회원가입</a>';
    navList.appendChild(signUpButton);
  }
}

// Function to remove "마이페이지" button
function removeMyPageButton() {
  const myPageButton = document.querySelector("#myPageButton");
  if (myPageButton) {
    myPageButton.remove();
  }
}

// Initialize UI based on login status
const token = localStorage.getItem("token");
if (token) {
  updateUIForLoggedInUser();
} else {
  updateUIForLoggedOutUser();
}
