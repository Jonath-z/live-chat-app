
//************************************** set receiver && ssender ***************************************//
const userReceiver = document.querySelector('.userName').textContent;
const userReceiverProfile = document.querySelector('.userReceiverProfile');
const userReceiverProfileUrl = userReceiverProfile.src;
const usersSender = document.querySelector('.userNameSender').textContent;
const userSenderProfile = document.querySelector('.userSenderProfile');
const userSenderProfileUrl = userSenderProfile.src;
// console.log(document.querySelector('.userName'));

// ******************************************* update user sockett ID **************************************//
const socket = io('/');
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
    window.scrollTo(0,document.body.scrollHeight);
    // console.log(socket.id);
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
                window.scrollTo(0,document.body.scrollHeight);
                const messageDiv = document.createElement('div');
                const messagePara = document.createElement('p');
                messageDiv.classList = "incomeChat";
                messagePara.classList = "incomeChatPara";
                messagePara.innerHTML = `${message.message}<br><span class="span">${message.time}<span>`;
               
                const img = document.createElement('img');
                img.alt = "profile";
                img.classList = "chatProfile";
                img.src = `${message.fromProfile}`;
                img.style.width = "40px";
                img.style.borderRadius = "50%";
                img.style.marginTop = "5px";
                img.style.marginTop = "3px";
                messageDiv.style.color = "white";
                messageDiv.style.width = "70%";
                messageDiv.style.display = "grid";
                // messageDiv.style.overflow = "hidden";
                // messageDiv.style.display = "inline-block";
                messageDiv.style.gridTemplateColumns = "0.5fr 2fr"
                messageDiv.style.marginTop = "5px";
                messageDiv.style.marginLeft = "10px";

                messagePara.style.float = "left";

                const div = document.createElement('div');
                div.classList = "paraContainer";
                div.style.background = "rgb(0,0,20)";
                div.style.borderTopRightRadius = "20px";
                div.style.borderBottomRightRadius = "20px";
                div.style.borderBottomLeftRadius = "20px";
                div.style.marginLeft = "1px";
                div.style.width = "70%";

                messagePara.style.marginLeft = "5px";
                messagePara.style.paddingRight = "5px";
                div.style.overflowWrap = "anywhere";
                // div.style.paddingBottom = "50px";
                div.append(messagePara);
                messageDiv.append(img, div);
                const span = document.querySelectorAll('.span');
                span.forEach(time => {
                    time.style.fontSize = "10px";
                    // console.log(time);
                })

                ChatContainer.append(messageDiv);
                ChatContainer.style.paddingBottom = "55px";
                window.scrollTo(0, document.body.scrollHeight);
            };

            if (`${message.fromName}` === `${usersSender}` && `${message.to}` === `${userReceiver}`) {
                const messageDiv2 = document.createElement('div');
                const messagePara2 = document.createElement('p');
                messageDiv2.classList = "outcomeChat2";
                messagePara2.classList = "outcomeChatPara";
                messagePara2.innerHTML = `${message.message}<br><span class="span">${message.time}</span> `;
                messageDiv2.style.background = "white";
                messageDiv2.style.border = "1.5px solid rgb(0,0,20)";
                messageDiv2.style.borderTopLeftRadius = "20px";
                messageDiv2.style.borderBottomLeftRadius = "20px";
                messageDiv2.style.borderBottomRightRadius = "20px";
                // messageDiv2.style.display = "inline-block";
                // messageDiv2.style.width = "fit-content";
                messageDiv2.style.maxWidth = "50%";
                messageDiv2.style.marginTop = "10px";
                messageDiv2.style.marginLeft = "50%";
                messageDiv2.style.marginRight = "10px";
                messageDiv2.style.overflow = "hidden";
                // messageDiv2.style.float = "right";
                
                messagePara2.style.float = "right";
                // messagePara2.style.height = "55px";
                messagePara2.style.marginRight = "10px";
                messageDiv2.appendChild(messagePara2);
                messageDiv2.style.overflowWrap = "anywhere";
                // messageDiv2.paddingBottom = "50px";
                const span = document.querySelectorAll('.span');
                span.forEach(time => {
                    time.style.fontSize = "10px";
                    time.style.float = "right";
                    time.style.marginTop = "10px";
                    time.style.positon = "absolute";
                    time.style.bottom = "0";
                    // console.log(time);
                })
                ChatContainer.style.flexDirection = "column";
                ChatContainer.append(messageDiv2);
                ChatContainer.style.paddingBottom = "55px";
                window.scrollTo(0, document.body.scrollHeight);

                // messageDiv2.addEventListener('click', () => {
                //     console.log(messageDiv2);
                //     // confirm(`Delete the message`);
                //     if (confirm(`Delete the message`)) {
                //         const message = messageDiv2.childNodes[0].innerHTML;
                //         console.log(message);
                //         socket.emit('delete-message', {
                //             message: `${message}`,
                //             sender: `${usersSender}`,
                //             receiver: `${userReceiver}`
                //         });
                //         message = "message deleted";

                //     }
                    
                // });
            }
        });

    });
    



// ****************auto size input******************************//

// messageInput.addEventListener('onChange', (event) => {
//     if (event) {
//         const target = event.target ? event.target : event;
//         // console.log(target)
//         target.style.height = "45px";
//         target.style.height = `${target.scrollHeight}px`;
//     }
// });
// ************************************ emit message ***************************************************//
const sendButton = document.querySelector('.send');
const messageInput = document.getElementById('messageInput');
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    const room = `${userReceiver}`;
    if (message !== "") {
        socket.emit('room', {
            receiver: `${userReceiverProfileUrl}`,
            room: `${room}`,
            message: `${message}`,
            sender: `${usersSender}`,
            senderProfile: `${userSenderProfileUrl}`
        });
        const hours = new Date().toLocaleString("en-US", {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    
        // console.log(hours);
    
        const messageDiv3 = document.createElement('div');
        messageDiv3.classList = "outcomeChat3";
        const messagePara3 = document.createElement('p');
        messagePara3.classList = "outcomeChatPara";
        messagePara3.innerHTML = `${message}<br><span class="span">${hours}</span>`;
        messageDiv3.style.background = "white";
        messageDiv3.style.border = "1.5px solid rgb(0,0,20)";
        messageDiv3.style.borderTopLeftRadius = "20px";
        messageDiv3.style.borderBottomLeftRadius = "20px";
        messageDiv3.style.borderBottomRightRadius = "20px";
                
        messageDiv3.style.maxWidth = "50%";
        messageDiv3.style.marginTop = "10px";
        messageDiv3.style.marginLeft = "50%";
        messageDiv3.style.marginRight = "5px";
        messageDiv3.style.overflow = "hidden";
        messagePara3.style.float = "right";
        messagePara3.style.marginRight = "10px";
        // messageDiv3.style.paddingBottom = "50px";
        const span = document.querySelectorAll('.span');
        messageDiv3.appendChild(messagePara3);
        messageDiv3.style.overflowWrap = "anywhere";
        ChatContainer.appendChild(messageDiv3);
        ChatContainer.style.paddingBottom = "55px";
        span.forEach(time => {
            time.style.fontSize = "10px";
            // console.log(time);
        });

        // // ***********************send notification ****************************************************************//
        // const publicVapidKey = 'BH6C9KUzBHe8tFJ7drhsRdu-vVh1MeM5RY-xzNGAQnu8miOcCXzUHo-58npoKuCFb5iHRcZPDUmKvOJ9mX7Cssk';

        // function urlBase64ToUint8Array(base64String) {
        //     const padding = "=".repeat((4 - base64String.length % 4) % 4);
        //     const base64 = (base64String + padding)
        //         .replace(/\-/g, "+")
        //         .replace(/_/g, "/");
  
        //     const rawData = window.atob(base64);
        //     const outputArray = new Uint8Array(rawData.length);
  
        //     for (let i = 0; i < rawData.length; ++i) {
        //         outputArray[i] = rawData.charCodeAt(i);
        //     }
        //     return outputArray;
        // }
        // // ******************************check if the service worker is working on the current browser***********************//
        // if ('serviceWorker' in navigator) {
        //     send().catch(err => console.error(err));
        // }
        // //****************register the service worker, register our push api, send the notification*****************************//
        // async function send() {
        //     //register service worker
        //     const register = await navigator.serviceWorker.register('/publics/worker.js', {
        //         scope: 'publics/'
        //     });

        //     //register push
        //     const subscription = await register.pushManager.subscribe({
        //         userVisibleOnly: true,

        //         //public vapid key
        //         applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        //     });
        //     // console.log(subscription);
        //     //Send push notification
        //     await fetch("/subscribe", {
        //         method: "POST",
        //         body: JSON.stringify(subscription),
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     });
        // }
        
        
        messageInput.value = '';
        window.scrollTo(0, document.body.scrollHeight);
    }
});

// *************************************** listen to the message ************************************ //

socket.on('message', (data) => {
    // console.log(data.message);
    const para = document.createElement('p');
    if (`${data.fromName}` === `${userReceiver}`) {
        const messageDiv2 = document.createElement('div');
        messageDiv2.classList = "outcomeDiv";
        para.innerHTML = `${data.message}<br><span class="span">${data.time}</span>`;
        const img = document.createElement('img');
        img.alt = "profile";
        img.classList = "chatProfile";
        img.src = `${data.fromProfile}`;
        img.style.width = "40px";
        para.classList = "outcomeChatPara";
        img.style.borderRadius = "50%";
        img.style.marginTop = "5px";
        img.style.marginTop = "3px";
        messageDiv2.style.color = "white";
        messageDiv2.style.maxWidth = "70%";
        messageDiv2.style.display = "grid";
        messageDiv2.style.gridTemplateColumns = "0.5fr 2fr"
        messageDiv2.style.marginTop = "5px";
        messageDiv2.style.marginLeft = "10px";
        para.style.float = "left";
        //messageDiv2.style.width = "fit-content";
        const div = document.createElement('div');
        div.classList = "paraContainer";
        div.style.background = "rgb(0,0,20)";
        div.style.borderTopRightRadius = "20px";
        div.style.borderBottomRightRadius = "20px";
        div.style.borderBottomLeftRadius = "20px";
        div.style.marginLeft = "1px";
        div.style.width = "fit-content";
        div.style.overflowWrap = "anywhere";
        para.style.marginLeft = "5px";
        para.style.paddingRight = "5px"
        div.append(para);
        
        messageDiv2.append(img, div);
        // messageDiv2.style.paddingBottom = "50px";
        const span = document.querySelectorAll('.span');
        span.forEach(time => {
            time.style.fontSize = "10px";
            // console.log(time);
        })
     
        // ChatContainer.append(messageDiv);
        ChatContainer.appendChild(messageDiv2);
        ChatContainer.style.paddingBottom = "55px";
        window.scrollTo(0, document.body.scrollHeight);
        window.navigator.vibrate(200);
    }
});

 // ************************************* fa fa-arrow-left event ***************************************//
 const arrowLeft = document.querySelector('.fa-arrow-left');
 arrowLeft.addEventListener('click', () => {
     window.history.go(-1);
 });

