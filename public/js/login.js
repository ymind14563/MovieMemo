document.addEventListener("DOMContentLoaded", function () {
  const openLoginModal = document.getElementById("openLoginModal");
  const modal = document.querySelector(".loginModal");
  const overlay = document.querySelector(".overlay");
  const closeModal = document.querySelector(".close");

  openLoginModal.addEventListener("click", function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  });

  closeModal.addEventListener("click", function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
  });

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const userId = document.getElementById("user-id").value;
    const password = document.getElementById("password").value;

    try {
      const response = await axios.post("/member/login", {
        name: userId,
        password: password,
      });

      // 로그인 성공 시 토큰을 세션에 저장
      const token = response.data.token;
      localStorage.setItem("token", token);

      // 세션에 저장한 토큰을 서버에서 사용할 수 있도록 axios 설정
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alert("로그인성공 ");
      // 로그인 성공 시 메인 페이지로 이동
      window.location.href = "/"; // 메인 페이지 경로로 수정
    } catch (error) {
      console.error(error.response.data.message);
      // 에러 처리 (예: 사용자에게 메시지 표시)
    }
  });
});
