const navbarImage = document.querySelector('.chatProfile');


fetch('../all/users')
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);

        data.map(user => {
            const chatUserDiv = document.querySelector('.chatUsers');
            // const userChat = `<div class="userChatDiv"><img src="${user.defaultProfile}" alt="profile" class="userChatProfile"> ${user.data.name}</div><hr>`;
            const div = document.createElement('div');
            div.classList = 'userChatDiv';
            const img = document.createElement('img');
            img.src = user.defaultProfile;
            img.alt = 'profile';
            img.classList = 'userChatProfile';
            const para = document.createElement('p');
            para.classList = 'username';
            para.innerText = user.data.name;
            const hr = document.createElement('hr');

            div.append(img, para);
            chatUserDiv.append(div, hr);
            
            // chatUserDiv.appendChild(userChatProfile);
            // console.log(userChat);
            // console.log(chatUserDiv);
            
                
            // console.log(userProfile);
        
        });
        const userChatEvent = document.querySelectorAll('.userChatDiv');
        userChatEvent.forEach(event => {
            event.addEventListener('click', () => {
                console.log(event);

                const user = event.firstElementChild;
                const userProfile = user.getAttribute('src');
                const url = userProfile;
                // window.open('../live/chat', '_self');
        
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
                        // window.open(`../user/chat?id=${data.data.id}`, "_self")
                        // socket.on('connection');
                    })
                    .catch(err => {
                        console.log(err);
                })
            });
        });
    });



