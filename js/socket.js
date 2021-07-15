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
// console.log(document.querySelector('.userName'));

// ******************************************* update user sockett ID **************************************//
const socket = io('http://localhost:8000');
socket.on('connection', () => {
    fetch('../update/socket', {
        method: "POST",
        headers: {
            'accept': '*/*',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            profile: userSenderProfileUrl,
            name: usersSender,
            id: socket.id
        })
    }).then(res => {
        return res.json();
    });

    // console.log(socket.id);
});

fetch('../all/user/followers')
    .then(res => {
        return res.json()
    })
    .then(data => {
        data.forEach(user => {
            if (user.followerName !== usersSender || user.followedName !== userReceiver) {
                // if (`${user.followedProfile}` !== `${userReceiverProfileUrl}` && `${user.followedName}` !== `${userReceiver}`) {
                const messageInput = document.getElementById('messageInput');
                console.log(messageInput);
                messageInput.setAttribute('readonly', 'true');
                const sendButton = document.querySelector('.send');
                console.log(sendButton);
                sendButton.remove();

                const signalPara = document.createElement('p');
                signalPara.classList = "signalPara";
                signalPara.innerHTML = `please follow ${usersSender} before this conversation.`;
                const alertDiv = document.querySelector('.alertSection');
                alertDiv.append(signalPara);
                
                // }
            }
        })
        console.log(data);
    });

// ****************************************** get user discussion **************************************** //
const ChatContainer = document.querySelector('.chatSection');
fetch('../user/message')
    .then(res => {
        return res.json();
    })
    .then(data => {
        data.forEach(message => {
            // console.log(message);

            if (`${message.fromName}` === `${userReceiver}` && `${message.to}` === `${usersSender}`) {
                const messageDiv = document.createElement('div');
                const messagePara = document.createElement('p');
                messageDiv.classList = "incomeChat";
                messagePara.classList = "incomeChatPara";
                messagePara.innerHTML = `${message.message}`;
                messageDiv.style.background = "grey";
                messageDiv.style.width = "50%";
                messageDiv.appendChild(messagePara);
                ChatContainer.append(messageDiv);
            };

            if (`${message.fromName}` === `${usersSender}` && `${message.to}` === `${userReceiver}`) {
                const messageDiv2 = document.createElement('div');
                const messagePara2 = document.createElement('p');
                messageDiv2.classList = "outcomeChat2";
                messagePara2.classList = "outcomeChatPara";
                messagePara2.innerHTML = `${message.message}`;
                messageDiv2.style.background = "yellow";
                messageDiv2.style.width = "50%";
                messageDiv2.style.marginLeft = "50%";
                messageDiv2.appendChild(messagePara2);
                ChatContainer.append(messageDiv2);
            }
        })
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
    
    const messageDiv3 = document.createElement('div');
    messageDiv3.classList = "outcomeChat3";
    const messagePara3 = document.createElement('p');
    messagePara3.classList = "outcomeChatPara";
    messagePara3.innerHTML = `${message}`;
    messageDiv3.style.background = "yellow";
    messageDiv3.style.width = "50%";
    messageDiv3.style.marginLeft = "50%";
    messageDiv3.appendChild(messagePara3);
    ChatContainer.appendChild(messageDiv3);

    messageInput.value = '';
});

// *************************************** listen to the message ************************************ //

socket.on('message', (data) => {
    // console.log(data.message);
    const para = document.createElement('p');
    if (`${data.fromName}` === `${userReceiver}`) {
        const messageDiv2 = document.createElement('div');
        para.innerHTML = `${data.message}`;
        para.classList = "outcomeChatPara";
        messageDiv2.appendChild(para);
        messageDiv2.style.background = "grey";
        messageDiv2.style.width = "50%";
        messageDiv2.appendChild(para);
        ChatContainer.appendChild(messageDiv2);
    }
});
