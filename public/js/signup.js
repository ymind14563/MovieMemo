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
    window.location.href = '/' //main page when successed
  } catch (error) {
    if(error.response && error.response.status === 400){
      const errors = error.response.data.errors; //array
      displayErrors(errors)
    } else {
      console.log(error);
    }
    
  }
})

function displayErrors(errors){
  const nameError = document.getElementById('name-error')
  const passwordError = document.getElementById('password-error')
  const nickError = document.getElementById('nick-error')
  // const confirmPasswordError = document.getElementById('confirmPassword-error')

  //clear the previous error messages
  nameError.textContent = '';
  nickError.textContent = '';
  passwordError.textContent = '';
  // confirmPasswordError.textContent = '';

  errors.forEach((error) => {
    switch(error.param){
      case 'name':
        nameError.textContent = error.msg;
        break;
      case 'nick':
        nickError.textContent = error.msg;
        break;
      case 'password':
        passwordError.textContent = error.msg;
        break;
      // case 'confirmPassword':
      //   confirmPasswordError.textContent = error.msg;
      //   break;
        default:
          break;
    }
  })
}