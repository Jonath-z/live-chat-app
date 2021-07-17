
//*********************** get all user from the server *************************************/
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
                            // const divButton = document.createElement('div');
                            // divButton.classList = "divButton";
                            // divButton.append(followButton);
                
                            div.append(img, para, followButton, hr);
                            chatUserDiv.append(div);
                            
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

        // ********************** follow button event set *******************************************************//
        const followButtons = document.querySelectorAll('.followButton');
        // console.log(followButtons);
        followButtons.forEach(button => {

            button.addEventListener('click', () => {
                // **************** check the state of user (follwed or not yet)**************************//      
                if (`${button.innerHTML}` === "Follow") {
                    const navbarImage = document.querySelector('.chatProfile');
                    const userProfile = navbarImage.src;
                    const userName = navbarImage.nextSibling.firstChild.data;
                    const div = button.parentNode.childNodes;
                    const followedProfile = div[0].src;
                    const followedName = div[1].textContent;
                    console.log(div);
                    button.innerHTML = "Unfollow";
                    //**************** if user is follewed so the event is unfollow ****************** //
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
                    //****************** if not so the event is follow ***********************//       
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
        
        })
        
        //***************************** set and deplay user's followers ***************************************//
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
        // *********************** get people page (mainpage) **********************************************//       
        const peopleIcon = document.querySelector('.fa-users');
        peopleIcon.style.color = "red";
        peopleIcon.addEventListener('click', () => {
            const chatIcon = document.querySelector('.fa-comment');
            chatIcon.style.color = "black";
            peopleIcon.style.color = "red";
            profileIcon.style.color = "black";
            window.document.location.reload();
        });
        //**************************************************get chat page ************************************************************ //
        const chatIcon = document.querySelector('.fa-comment');
        chatIcon.addEventListener('click', () => {
            const navbarImage = document.querySelector('.chatProfile');
            const userProfile = navbarImage.src;
            const userName = navbarImage.nextSibling.firstChild.data;

            fetch('../all/user/followers')
                .then(res => {
                    return res.json();
                }).then(data => {
                    // **********************remove all div on the people page ********************************//
                    const alluserDiv = document.querySelectorAll('.userChatDiv');
                    const chatUserDiv = document.querySelector('.chatUsers');
                    alluserDiv.forEach(div => {
                        div.remove();
                    });
                    // *********** remove all password and userName div on profile page ********//
                    const passwordDiv = document.querySelector('.passworDiv');
                    const userNameDiv = document.querySelector('.userNameDiv');
                    if (passwordDiv || userNameDiv) {
                        passwordDiv.remove();
                        userNameDiv.remove();
                        // div.append(img, para, hr);
                        // chatUserDiv.append(div);
                    }
                    
                    data.forEach(user => {
                        if (`${user.followerName}` === `${userName}`) {
                            // if (passwordDiv && userNameDiv) {
                            //     passwordDiv.remove();
                            //     userNameDiv.remove();
                            // }
                      
                            const div = document.createElement('div');
                            div.classList = 'userChatDiv';
                            const img = document.createElement('img');
                            img.src = user.followedProfile;
                            img.alt = 'profile';
                            img.classList = 'userChatProfile';
                            const para = document.createElement('p');
                            para.classList = 'username';
                            para.innerHTML = user.followedName;
                            const hr = document.createElement('hr');

                            div.append(img, para, hr);
                            chatUserDiv.appendChild(div);
                        

                            // ************************** open the userChat page *********************************//
                            const navbardiv = document.querySelector('.chatProfile');
                            const userAccountProfile = navbardiv.src;
                            const userAccountName = navbardiv.nextSibling.firstChild.data;

                            const userChatEvent = document.querySelectorAll('.userChatDiv');
                            userChatEvent.forEach(event => {
                                event.addEventListener('click', () => {
                                    // console.log(event);

                                    const user = event.childNodes[1].innerHTML;
                                    console.log(user);
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
                                        window.open('../live/chat', '_self').document.write(`${data}`);
                    
                                    });
                                });
                            });
                        }
                    });
                    
                    console.log(data);
                })

            console.log(userProfile, userName);
            const peopleIcon = document.querySelector('.fa-users');
            peopleIcon.style.color = "black";
            profileIcon.style.color = "black";
            chatIcon.style.color = "red";
        });
        // ********************************** set profile page's element ******************************************//
        const profileIcon = document.querySelector('.fa-user');
        profileIcon.addEventListener('click', () => {
            profileIcon.style.color = "red";
            chatIcon.style.color = "black";
            peopleIcon.style.color = "black";
            const alluserDiv = document.querySelectorAll('.userChatDiv');
            alluserDiv.forEach(div => {
                div.remove();
            });
            const reseachBar = document.getElementById('searchBar');
            if (reseachBar) {
                reseachBar.remove();
            }
            const navbardiv = document.querySelector('.navBar');
            navbardiv.remove();
            console.log(navbardiv.childNodes[1]);
            const userProfile = navbardiv.childNodes[1].firstChild.src;
            const userName = navbardiv.childNodes[1].lastChild.innerHTML;
            // console.log(userProfile, userName);

            //************** get user's profile Page ************************************/
            fetch('../user/profile', {
                method: "POST",
                headers: {
                    'accept': '*/*',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    userProfile: `${userProfile}`,
                    userName: `${userName}`
                })
            }).then(res => {
                return res.json();
            }).then(data => {
                // ************************ create node for each user's profile element *******************************//
                //************************* set each user's profile the page *************************************** */       

                // const detailsSection = document.createElement('section');
                // detailsSection.classList = "detailsSection";

                const div1 = document.createElement('div');
                div1.classList = "userNameDiv";
                const label = document.createElement('label');
                label.classList = "userNamePara";
                label.setAttribute('for', 'userName');
                label.innerHTML = "Name";

                const inputName = document.createElement('input');
                inputName.name = "userName";
                inputName.classList = "inputName";
                inputName.setAttribute('readonly', 'true');
                inputName.value = `${data.data.name}`;

                const i = document.createElement('i');
                i.classList = "fa fa-pencil";
                
                div1.append(label, inputName, i);
                
                const labelPassword = document.createElement('label');
                labelPassword.setAttribute('for', 'password');
                labelPassword.classList = "labelPassword";
                labelPassword.innerHTML = "Password";

                const div2 = document.createElement('div');
                div2.classList = "passworDiv";
                const inputPassword = document.createElement('input');
                inputPassword.classList = "inputPassword";
                inputPassword.name = "password";

                inputPassword.type = "password";
                inputPassword.value = `${data.password}`;
                inputPassword.setAttribute('readonly', 'true');
                div2.append(labelPassword, inputPassword, i);

                navbardiv.append(div1);

                const body = document.getElementsByTagName('body');
                body[0].append(navbardiv, div2);

                // console.log(data);
            })
   
        });
        //************************************* search bar people **************************************************************************************//
        const searchBar = document.getElementById('searchBar');
        searchBar.value = "";
        searchBar.addEventListener('change', () => {
            fetch('../user/search', {
                method: "POST",
                headers: {
                    'accept': '*/*',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: `${searchBar.value}`
                })
            }).then(res => {
                return res.json();
            }).then(data => {
                const allDiv = document.querySelectorAll('.userChatDiv');
                allDiv.forEach(div => {
                    div.remove();
                });
                peopleIcon.style.color = "black";
                if (data.data === "empty") {
                    const para = document.createElement('p');
                    para.classList = "noData";
                    para.innerHTML = `NO DATA MATCHED ON THIS VALUE {${searchBar.value}} try again or go to people.`;
                    const body = document.getElementsByTagName('body');
                    body[0].append(para);
                }
        
                searchBar.value = "";
                data.forEach(user => {
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
                                            followButton.innerHTML = "Unfollow";
                                        }
                                    }
                                });
                            });
                        });


                    followButton.innerHTML = "Follow";
                    followButton.classList = "followButton";
                    para.classList = 'username';
                    para.innerHTML = user.data.name;
                    const hr = document.createElement('hr');
                    // const divButton = document.createElement('div');
                    // divButton.classList = "divButton";
                    // divButton.append(followButton);
                        
                    div.append(img, para, followButton, hr);
                    chatUserDiv.append(div);
                                    
                    // chatUserDiv.appendChild(userChatProfile);
                    // console.log(userChat);
                    // console.log(chatUserDiv); 
                    // console.log(userProfile);
                });
                //************************** get all users and desplay in people page *********************************/
                const navbardiv = document.querySelector('.chatProfile');
                const userAccountProfile = navbardiv.src;
                const userAccountName = navbardiv.nextSibling.firstChild.data;

                const userChatEvent = document.querySelectorAll('.userChatDiv');
                userChatEvent.forEach(event => {
                    event.addEventListener('click', () => {
                        // console.log(event);

                        const user = event.childNodes[1].innerHTML;
                        console.log(user);
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

                const followButtons = document.querySelectorAll('.followButton');
                followButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        // **************** check the state of user (follwed or not yet)**************************//     
                        console.log(button);
                        if (`${button.innerHTML}` === "Follow") {
                            const navbarImage = document.querySelector('.chatProfile');
                            const userProfile = navbarImage.src;
                            const userName = navbarImage.nextSibling.firstChild.data;
                            const div = button.parentNode.childNodes;
                            const followedProfile = div[0].src;
                            const followedName = div[1].textContent;
                            console.log(div);
                            button.innerHTML = "Unfollow";
                            //**************** if user is follewed so the event is unfollow ****************** //
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
                            //****************** if not so the event is follow ***********************//       
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
            });
            // ********************** follow button event set *******************************************************//
            // const followButtons = document.querySelectorAll('.followButton');
            // console.log(followButtons);
            
           
          
        });

    });
                
            
    



