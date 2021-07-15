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
                            const followButton = document.createElement('button');
                            followButton.innerHTML = "Follow";
                            followButton.classList = "followButton";
                            para.classList = 'username';
                            para.innerHTML = user.data.name;
                            const hr = document.createElement('hr');
                
                            div.append(img, para, followButton);
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

        const userChatEvent = document.querySelectorAll('.username');
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
                        userAccountName: userAccountName,
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
        const peopleIcon = document.querySelector('.fa-users');
        peopleIcon.style.color = "red";
        // const chatIcon = document.querySelector('.fa-comment');
        const followButtons = document.querySelectorAll('.followButton');
        // console.log(followButtons);
        followButtons.forEach(button => {

            
            button.addEventListener('click', () => {
                if (`${button.innerHTML}` === "Follow") {
                    const navbarImage = document.querySelector('.chatProfile');
                    const userProfile = navbarImage.src;
                    const userName = navbarImage.nextSibling.firstChild.data;
                    const div = button.parentNode.childNodes;
                    const followedProfile = div[0].src;
                    const followedName = div[1].textContent;
                    // console.log(followedName,followedProfile);
                    button.innerHTML = "Unfollow";
    
                    fetch('../set/followers', {
                        method: "POST",
                        headers: {
                            'accept': '*/*',
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            followerProfile: `${userProfile}`,
                            followerName: `${userName}`,
                            followedProfile: `${followedProfile}`,
                            followedName: `${followedName}`
                        })
                    });
                }
                else {
                    const navbarImage = document.querySelector('.chatProfile');
                    const userProfile = navbarImage.src;
                    const userName = navbarImage.nextSibling.firstChild.data;
                    const div = button.parentNode.childNodes;
                    const followedProfile = div[0].src;
                    const followedName = div[1].textContent;
                    // console.log(followedName,followedProfile);
                    button.innerHTML = "Follow";
    
                    fetch('../unfollow', {
                        method: "POST",
                        headers: {
                            'accept': '*/*',
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            followerProfile: `${userProfile}`,
                            followerName: `${userName}`,
                            followedProfile: `${followedProfile}`,
                            followedName: `${followedName}`
                        })
                    });
                }
            });
        
        });
            
        fetch('../all/user/followers')
            .then(res => {
                return res.json();
            })
            .then(data => {
                // console.log(data);
                data.forEach(user => {
                    const navbarImage = document.querySelector('.chatProfile');
                    const userProfile = navbarImage.src;
                    const userName = navbarImage.nextSibling.firstChild.data;
                    const allDiv = document.querySelectorAll('.userChatDiv');
                    allDiv.forEach(div => {
                        const divProfile = div.childNodes[0].src;
                        const divName = div.childNodes[1].textContent;
                        if (`${userProfile}` === `${user.followerProfile}` && `${userName}` === `${user.followerName}`) {
                            if (`${divName}` === `${user.followedName}` && `${divProfile}` === `${user.followedProfile}`) {
                                div.childNodes[2].innerHTML = "Unfollow";
                            }
                        }
                    });
                });
            });
    });
                
              

    




