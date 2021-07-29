const signInBtn = document.getElementById('btnToSignUp');
signInBtn.addEventListener('click', () => {
    window.open('../signup', "_self");
});

const userNameInput = document.getElementById('userName');
const passwordInput = document.getElementById('password');
// **********************get username and password value***********************************//
// const userName = userNameInput.valuel;
// const password = passwordInput.valuel;

// console.log(userName, password);