const navbarImage = document.querySelector('.chatProfile');
const chatUser = document.querySelector('.chatUsers');

fetch('../all/users')
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
        const dataTable = [];
        dataTable.push(data);

        dataTable.forEach(user => {

            const userChat = `<div class="userChatDiv"><img src="${user.defaultProfile}" alt="profile" class="userChatProfile"> ${user.data.name}</div><hr>`;
            chatUser.innerHTML = userChat;
            const userChatProfile = document.querySelector('.userChatDiv');
            userChatProfile.addEventListener('click', openChat);

            function openChat() {
                const user = userChatProfile.firstElementChild;
                const userProfile = user.getAttribute('src');
                const url = userProfile;

                fetch('../open/chat', {
                    method: "POST",
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ url })
                })
                    .then(res => {
                        return res.json()
                    })
                    .then(data => {
                        console.log(data);
                        window.open(`../user/chat?id=${data.data.id}`, "_self")
                        socket.on('connection');
                    // .document.write(`
                    //  <!DOCTYPE html>                               
                    // <html lang="en">
                    // <head>
                    //   <meta charset="UTF-8">
                    //   <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    //   <link rel="stylesheet" href="/static/chat.css">
                    //   <script src="https://cdn.socket.io/socket.io-3.0.1.min.js"></script>
                    //   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                    //   <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                    //   <title>Chat</title>
                    // </head>
                    // <body>
                    // <section class="chatSection">
                    // <div class="incomeMessage"></div>
                    // <div class="outcomeMessage"></div>
                    
                    // </section>


                    // <footer>
                    // <div class="messageInput">
                    // <input type="text" name="message" placeholder="message here" id="messageInput"><button class="send">send</button>
                    // </footer>

                    // <script src="/statics/socket.js"></script>
                    // </body>
                    //  `)  

                    })
                
                // console.log(userProfile);

            }
        });
        
    });

