

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


(function (d, s, id) {
  var js,
  fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; } js = d.createElement(s);
  js.id = id; js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

    function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
        console.log('statusChangeCallback');
        console.log(response);                   // The current login status of the person.
        if (response.status === 'connected') {   // Logged into your webpage and Facebook.
          testAPI();  
        } else {                                 // Not logged into your webpage or we are unable to tell.
          document.getElementById('status').innerHTML = 'Please log ' +
            'into this webpage.';
        }
      }
    
    
      function checkLoginState() {               // Called when a person is finished with the Login Button.
        FB.getLoginStatus(function(response) {   // See the onlogin handler
          statusChangeCallback(response);
        });
      }

    
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '523836402204082',
      cookie     : true,                     // Enable cookies to allow the server to access the session.
      xfbml      : true,                     // Parse social plugins on this webpage.
      version    : 'v11.0'           // Use this Graph API version for this call.
    });


    FB.getLoginStatus(function(response) {   // Called after the JS SDK has been initialized.
      statusChangeCallback(response);       // Returns the login status.
        
    });
  };
    function statusChangeCallback(response) {
        if (response.status === 'connected') {
            testAPI();
        } 
    }
 
function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me',
    'GET',
    { 'fields': 'id,name,email,first_name,birthday,link' },
    function (response) {
      // console.log('Successful login for: ' + response.name);
      console.log(response);

      // get the default profile url
      storage.ref('default_profile/' + 'default-profile.png').getDownloadURL()
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
              response: response,
              url: url
            })
          })
        });
            
      const name = document.getElementById('userName');
      name.value = `${response.name}`;
      const faceboockBtn = document.getElementById('facebookLogin');
      faceboockBtn.remove();
    });
}

