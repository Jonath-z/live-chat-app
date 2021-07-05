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
                fetch('../open/chat', {
                    method: "POST",
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                      },

                })
                console.log(userProfile);

            }
        });
        
    })

