fetch('../all/users')
    .then(res => {
        return res.json();
    })
    .then(data => {
        // console.log(data);

        const navbarImage = document.querySelector('.chatProfile');
        const deleteProfile = navbarImage.src;
        const ddeleteUSerName = navbarImage.nextSibling.firstChild.data;
        data.find(function (posts, index) {
            if (posts.data.name == `${ddeleteUSerName}` && posts.defaultProfile == `${deleteProfile}`) {
                // console.log(posts);
                // console.log(index);
                for (let i = 0; i < data.length; i++) {
                    if (data[i] === posts) {
                        const userDeleted = data.splice(i, 1);
                        i--;
                        // console.log(userDeleted);
                        // console.log(data);
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

                    }
                }
                return true;
            }
        });

        const navbardiv = document.querySelector('.chatProfile');
        const userAccountProfile = navbardiv.src;
        const userAccountName = navbardiv.nextSibling.firstChild.data;

        const userChatEvent = document.querySelectorAll('.userChatDiv');
        userChatEvent.forEach(event => {
            event.addEventListener('click', () => {
                // console.log(event);

                const user = event.textContent;
                const userProfile = event.firstElementChild;
                const url = userProfile.getAttribute('src');

                fetch('../live', {
                    method: "POST",
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userAccountProfile: userAccountProfile,
                        userAccountName:userAccountName,
                        url: url,
                        name: user
                    })
                }).then(res => {
                    return res.text();
                }).then(data => {
                    // console.log(data);
                    window.open('../live/chat').document.write(`${data}`);

                });
            });
        });
        
    });

const peopleIcon = document.querySelector('.fa-users');
peopleIcon.style.color = "red";
const chatIcon = document.querySelector('.fa-comment');
// chatIcon.addEventListener('click', () => {
    
// })
    




