function isOnMyPage(){
  return window.location.pathname === "/mypage"
}


function updateUIForLoggedInUser(isAdmin) {
  if (loginBtn) {
    loginBtn.textContent = "로그아웃";
    loginBtn.removeEventListener("click", openLoginModal); // Remove login modal event listener
    loginBtn.addEventListener("click", logoutUser); // Add logout event listener
  }
  removeSignUpButton(); // Remove the sign-up button
  updateNavBarForLoggedInUser(); // Add the '마이페이지' button

  // 관리자 버튼을 보이거나 숨기는 로직 추가
  const adminButton = document.getElementById("adminButton");
  if (isAdmin) {
    adminButton.classList.remove("hidden");
  } else {
    adminButton.classList.add("hidden");
  }
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

  // 로그아웃 시 관리자 버튼 숨김
  const adminButton = document.getElementById("adminButton");
  adminButton.classList.add("hidden");
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
  const signUpButton = document.querySelector(
    "nav ul button a[href='/register']"
  );
  if (signUpButton) {
    signUpButton.parentElement.remove(); // Remove the button element
  }
}

// Function to add back the sign-up button
function addSignUpButton() {
  const existingSignUpButton = document.querySelector(
    "nav ul button a[href='/register']"
  );
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

// 초기화 함수에서 토큰을 확인하고 로그인 상태와 관리자 권한에 따라 UI 업데이트
function initializeUI() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      updateUIForLoggedInUser(decoded.isAdmin);
    } catch (error) {
      console.error("Invalid token:", error);
      updateUIForLoggedOutUser();
    }
  } else {
    updateUIForLoggedOutUser();
  }
}

initializeUI(); // 초기화 함수 호출

if(isOnMyPage()){
  removeMyPageButton()
}


