

const firebaseConfig = {
    apiKey: "AIzaSyBFJCVc3WVg-AzuZUjV1nSd3kHqNchRZgM",
    authDomain: "chatapp-318511.firebaseapp.com",
    databaseURL: "https://chatapp-318511-default-rtdb.firebaseio.com",
    projectId: "chatapp-318511",
    storageBucket: "chatapp-318511.appspot.com",
    messagingSenderId: "968379108682",
    appId: "1:968379108682:web:f8ea4a7fe25bda530185b3"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();



const userNameInput = document.getElementById('userName');
const passwordInput = document.getElementById('password');


const btn = document.getElementById('signup');

btn.addEventListener('click', () => {
  const passWord = passwordInput.value;
  const userName = userNameInput.value;
  const data = {
    name: userName,
    id: Date.now(),
  }
  console.log(data, passWord.length);

  if (data.name !== "") {
    userNameInput.value = "please complete your name";
  }
  if (data.name !== "" && passWord.length >= 4) {
    async function getURL() {

      // get the default profile url
      await storage.ref('default_profile/' + 'default-profile.png').getDownloadURL()
        .then((url) => {
          console.log(url);
              
          // fetching the response to the server
          fetch('../signup/user', {
            method: "POST",
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              response: data,
              url: url,
              password: passWord
            })
          })
        });
    }
    getURL();
    window.open('..//user/login', 'self');
    passwordInput.value = "";
    userNameInput.value = "";
  }
  
}, { once: true });

            
