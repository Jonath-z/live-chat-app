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


//************************************** set receiver && ssender ***************************************//
const userReceiver = document.querySelector('.userName').textContent;
const userReceiverProfile = document.querySelector('.userReceiverProfile');
const userReceiverProfileUrl = userReceiverProfile.src;
const usersSender = document.querySelector('.userNameSender').textContent;
const userSenderProfile = document.querySelector('.userSenderProfile');
const userSenderProfileUrl = userSenderProfile.src;
// console.log(userSenderProfileUrl);

// ****************************************** get user discussion **************************************** //
const ChatContainer = document.querySelector('.chatSection');
fetch('../user/message', {
    method: "POST",
    headers: {
        "accept": "*/*",
        "content-type": "application/json"
    },
    body: JSON.stringify({
        userReceiver: `${userReceiver}`,
        userReceiverProfile: `${userReceiverProfileUrl}`,
        userSenderProfile: `${userSenderProfileUrl}`,
        usersSender: `${usersSender}`
    })
}).then(res => {
    return res.json();
}).then(data => {
    data.forEach(message => {

        const messageDiv = document.createElement('div');
        messageDiv.classList = "incomeChat";
        const messagePara = document.createElement('p');
        messagePara.classList = "incomeChatPara";
        messagePara.innerHTML = `${message.message}`;

        messageDiv.appendChild(messagePara);
        ChatContainer.appendChild(messageDiv);
    });
    console.log(data);
});

// ******************************************* update user sockett ID **************************************//
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

// ************************************ emit message ***************************************************//
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

    const messageDiv2 = document.createElement('div');
    messageDiv2.classList = "outcomeChat";
    const messagePara2 = document.createElement('p');
    messagePara2.classList = "outcomeChatPara";
    messagePara2.innerHTML = `${message}`;
    messageDiv2.appendChild(messagePara2);
    ChatContainer.appendChild(messageDiv2);
    
    // ******************************** fetch message sent to the server ************************************//
    fetch('../messages/sent', {
        method: "POST",
        headers: {
            'accept': '*/*',
            'content-type':'application/json'
        },
        body: JSON.stringify({
            messageSentBy: `${usersSender}`,
            message: `${message}`,
            messageSentTo: `${userReceiver}`
        })
    }).then(res => {
        res.json();
    }).then(data => {
        console.log(data);
    })

    messageInput.value = '';
});
// *************************************** listen to the message ************************************ //
socket.on('message', (data) => {
    console.log(data);
    const para = document.createElement('p');
    if (`${data.fromName}` === `${userReceiver}`) {
        para.innerHTML = `${data.message}`;
        ChatContainer.appendChild(para);
    }
});



