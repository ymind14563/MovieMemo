const form = document.querySelector("form");

form.addEventListener('submit',async function(e) {
  e.preventDefault();

  const formData = new FormData(form);
  // { userId, password, confirmPassword, username }

  try {
    const response = await axios.post("/signup", formData);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
})