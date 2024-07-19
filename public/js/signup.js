const form = document.querySelector("form");
const errorMessage = document.querySelector(".error-message")


form.addEventListener('submit',async function(e) {
  e.preventDefault();
  

  const data = {
    name: document.getElementById('user-id').value, 
    password: document.getElementById('password').value,
    confirmPassword: document.getElementById('confirmPassword').value,
    nick: document.getElementById('username').value, 
    email: document.getElementById('email').value,
    gender: document.querySelector('input[name="gender"]:checked')?.value,
    age: document.querySelector('input[name="age"]:checked')?.value,
  };


  console.log(data)

  try {
    const response = await axios.post("/member/register", data);
    console.log(response);
    // window.location.href = '/' //main page when successed
  } catch (error) {
    if(error.response && error.response.status === 400){
      const errorArrays = error.response.data.errors; //array
      errorArrays.forEach((error) => {
        console.log(error.msg)
        let errorMessage = ''
        // const p = document.createElement('p');
        // p.textContent = error.msg; 
        // errorMessage.appendChild(p);
        errorMessage += `<p>${error.msg}</p>`
      })
    
    } else {
      console.log(error);
    }
    
  }
})
// error.response.data.errors[0].msg
// error.response.data.errors[1].msg
// error.response.data.errors[2].msg
// error.response.data.errors[3].msg
// function displayErrors(errors){
//   const nameError = document.getElementById('name-error')
//   const passwordError = document.getElementById('password-error')
//   const nickError = document.getElementById('nick-error')




//   //clear the previous error messages
//   nameError.textContent = '';
//   nickError.textContent = '';
//   passwordError.textContent = '';

// // errors = 배열

//   errors.forEach((error) => {
//     switch(error.param){
//       case 'name':
//         nameError.textContent = error.msg;
//         break;
//       case 'nick':
//         nickError.textContent = error.msg;
//         break;
//       case 'password':
//         passwordError.textContent = error.msg;
//         break;
//       default:
//           break;
//     }
//   })
// }