// ************* firebase realtime database init ******************//
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
const db = firebase.database();


// set receiver && ssender
const userReceiver = document.querySelector('.userName').textContent;
const userReceiverProfile = document.querySelector('.userReceiverProfile');
const userReceiverProfileUrl = userReceiverProfile.src;
const usersSender = document.querySelector('.userNameSender').textContent;
const userSenderProfile = document.querySelector('.userSenderProfile');
const userSenderProfileUrl = userSenderProfile.src;
// console.log(userSenderProfileUrl);

const socket = io('http://localhost:8000');

socket.on('connection', () => {
    fetch('../update/socket', {
        method: "POST",
        headers: {
            'accept': '*/*',
            'content-type':'application/json'
        },
        body: JSON.stringify({
            profile:userSenderProfileUrl,
            name: usersSender,
            id:socket.id 
        })
    }).then(res => {
        return res.json();
    })
    // console.log(socket.id);
});

const sendButton = document.querySelector('.send');
const messageInput = document.getElementById('messageInput');


sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    const room = `${userReceiver}`;
    socket.emit('room', {
        receiver: `${userReceiverProfileUrl}`,
        room: `${room}`,
        message: `${message}`,
        sender: `${usersSender}`,
        senderProfile: `${userSenderProfileUrl}`
    });
    // console.log(socket.id);
    // console.log(message);
})

socket.on('message', (data) => {
    console.log(data.message);
    db.ref(`${data.fromName}-${data.to}/` + Date.now()).set({
        data,
    });
});

// ************************************** database /income mongodb ******************************//
db.ref(`${usersSender}-${userReceiver}`)
    .on(snapshot => {
        if (snapshot.empty) {
            console.log('no data or internet problem');
        } else {
            const data = snapshot.val();
            console.log(data);
        }

});


