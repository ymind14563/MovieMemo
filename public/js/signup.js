const form = document.querySelector("form");

form.addEventListener('submit',async function(e) {
  e.preventDefault();

  const formData = new FormData(form);
  // { userId:값, password:값, confirmPassword:값, username:값, gender:값, age:값 }

  const data = {};

  formData.forEach((value,key) => {
    data[key] = value; //add key and value in data object
  })

  try {
    const response = await axios.post("/register", data);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
})