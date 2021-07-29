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
const fireStorage = firebase.storage();
//*********************** get all user from the server *************************************/
fetch('../all/users')
    .then(res => {
        return res.json();
    })
    .then(data => {
        // console.log(data);
        const navbarImage = document.querySelector('.chatProfile');
        const deleteProfile = navbarImage.src;
        const ddeleteUSerName = document.querySelector('.userName');
        const deletedUserName = ddeleteUSerName.innerHTML;
        data.find(function (posts, index) {
            if (posts.data.name == `${deletedUserName}` && posts.defaultProfile == `${deleteProfile}`) {
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
                            para.innerHTML = `${user.data.name}`;
                            const hr = document.createElement('hr');
                            hr.style.border = "1px solid rgb(0,0,20)";
                            hr.classList = "hr";
                            // const divButton = document.createElement('div');
                            // divButton.classList = "divButton";
                            // divButton.append(followButton);
                            div.style.display = "grid";
                            div.style.gridTemplateColumns = "1fr 2fr 1fr";
                            followButton.style.border = "none"
                            followButton.style.height = "25px"
                            followButton.style.borderRadius = "5px";
                            followButton.style.marginRight = "20px";
                            followButton.style.marginTop = "20px";
                            followButton.style.fontFamily = "sans-serif";
                            
                            img.style.marginLeft = "20px";
                            para.style.fontFamily = "sans-serif";
                            hr.style.marginLeft = "5em";
                            hr.style.marginRight = "1em";
                            hr.style.opacity = "0.5";
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

        // ********************** follow button (event set) *******************************************************//
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
                    // console.log(div);
                    button.innerHTML = "Unfollow";
                    button.style.background = "rgb(0,0,20)";
                    button.style.color = "white";
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
                    button.style.background = " rgb(241, 241, 241)";
                    button.style.color = "rgb(0,0,20)";
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
                                div.childNodes[2].style.background = "rgb(0,0,20)";
                                div.childNodes[2].style.color = "white";
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
            chatIcon.style.color = "rgb(0,0,20)";
            peopleIcon.style.color = "red";
            profileIcon.style.color = "rgb(0,0,20)";
            window.document.location.reload();
        });
        //**************************************************get chat page ************************************************************ //
        const chatIcon = document.querySelector('.fa-comment');
        chatIcon.addEventListener('click', () => {
            const navbarImage = document.querySelector('.chatProfile');
            const userProfile = navbarImage.src;
            const userName = navbarImage.nextSibling.firstChild.data;

            // **********************remove all div on the people page ********************************//
            const alluserDiv = document.querySelectorAll('.userChatDiv');
            const chatUserDiv = document.querySelector('.chatUsers');
            const hr = document.querySelectorAll('.hr');
            hr.forEach(line => {
                if (line) {
                    line.remove();
                }
            })
            alluserDiv.forEach(div => {
                div.remove();
            });
            // *********** remove all password and userName div on profile page ********//
            const passwordDiv = document.querySelector('.passworDiv');
            const userNameDiv = document.querySelector('.userNameDiv');
            const newButton = document.querySelector('.updateButton');
            const divNewName = document.querySelector('.divNewName');
            const divNewPass = document.querySelector('.divNewpass');
            const deconnectButtonDiv = document.querySelector('.divDeconnect');
            if (passwordDiv || userNameDiv || newButton || divNewName || divNewPass || deconnectButtonDiv) {
                passwordDiv.remove();
                userNameDiv.remove();
                deconnectButtonDiv.remove();
                if (newButton) {
                    newButton.remove();
                }
                if (divNewName || divNewPass) {
                    divNewName.remove();
                    divNewPass.remove();
                }

            }
            fetch('../all/user/followers/chat')
                .then(res => {
                    return res.json();
                }).then(data => {
                    
                    data.forEach(user => {
                        if (`${user.followerName}` === `${userName}`) {
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
                            hr.classList = "hr";
                            hr.style.borderBottom = "1px solid rgb(0,0,20)";
                            img.style.marginLeft = "20px"
                            para.style.fontFamily = "sans-serif";
                            div.append(img, para);
                            chatUserDiv.append(div, hr);
                        

                            // ************************** open the userChat page *********************************//
                            
                            const navbardiv = document.querySelector('.chatProfile');
                            const userAccountProfile = navbardiv.src;
                            const userAccountName = navbardiv.nextSibling.firstChild.data;

                            const userChatEvent = document.querySelectorAll('.userChatDiv');
                            userChatEvent.forEach(user => {
                                user.addEventListener('click', () => {
                                    // console.log(event);

                                    const users = user.childNodes[1].innerHTML;
                                    // console.log(users);
                                    const userProfile = user.firstElementChild;
                                    const url = userProfile.getAttribute('src');
                                    async function openChat() {
                                        await fetch('../live', {
                                            method: "POST",
                                            headers: {
                                                'content-type': 'application/json',
                                                'accept': '*/*',
                                            },
                                            body: JSON.stringify({
                                                userAccountProfile: userAccountProfile,
                                                userAccountName: userAccountName,
                                                url: url,
                                                name: users
                                            })
                                        }).then(res => {
                                            return res.text();
                                        }).then(data => {
                                            // console.log(data);
                                            // window.open('../chat','_self').document.write(`${data}`);
                                            window.open('../chat', '_self');
                                            // document.open(`${data}`,'replace');
                    
                                        });
                                    }
                                    openChat();
                                }, { once: true });
                            });
                        }
                    });
                    
                    // console.log(data);
                });

            // console.log(userProfile, userName);
            const peopleIcon = document.querySelector('.fa-users');
            peopleIcon.style.color = "rgb(0,0,20)";
            profileIcon.style.color = "rgb(0,0,20)";
            chatIcon.style.color = "red";
        }, { once: true });
        // ********************************** set profile page's element ******************************************//
        const profileIcon = document.querySelector('.fa-user');
        profileIcon.addEventListener('click', () => {
            profileIcon.style.color = "red";
            chatIcon.style.color = "rgb(0,0,20)";
            peopleIcon.style.color = "rgb(0,0,20)";
            const alluserDiv = document.querySelectorAll('.userChatDiv');
            alluserDiv.forEach(div => {
                div.remove();
            });
            const reseachBar = document.getElementById('searchBar');
            if (reseachBar) {
                reseachBar.remove();
            }

            const navbardiv = document.querySelector('.chatProfile');
            const userProfile = navbardiv.src;
            const userName = navbardiv.nextSibling.firstChild.data;
            const userNamePara = document.querySelector('.userName');
            // console.log(userNamePara.innerHTML);
            // console.log(userProfile, userName);
            // console.log(navbardiv);
            const chatUserSection = document.querySelector('.chatUsers');
            const hr = document.querySelectorAll('.hr');
            hr.forEach(line => {
                line.remove()
            });

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
                // navbardiv.style.cursor = "pointer";
                const nameDiv = document.querySelector('.userNameDiv');
                const passDiv = document.querySelector('.passworDiv');
                const buttonDiv = document.querySelector('.divDeconnect');
                const filInput = document.querySelector('.inputFIle');
                if (!nameDiv || !passDiv || !buttonDiv || !filInput) {
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
                    i.style.cursor = "pointer";
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
                    // const userProfileImg = userProfile;
                    const inputFile = document.createElement('input');
                    inputFile.type = "file";
                    inputFile.name = "file";
                    inputFile.hidden = "true";
                    inputFile.classList = "inputFIle";
                    const div3 = document.createElement('div');
                    div3.classList = "divDeconnect";
                    const deconnectButton = document.createElement('button');
                    deconnectButton.classList = "deconnectButton";
                    deconnectButton.innerHTML = "log out";
                    deconnectButton.style.background = "rgb(0,0,20)";
                    deconnectButton.style.color = "white";
                    deconnectButton.style.border = "none";
                    deconnectButton.style.borderRadius = "5px";
                    deconnectButton.style.marginTop = "30px";
                    deconnectButton.style.fontFamily = "sans-serif";
                    deconnectButton.style.width = "10em";
                    deconnectButton.style.height = "25px";

                    div3.append(deconnectButton);
                    div3.style.textAlign = "center";
                    chatUserSection.append(div1, div2, inputFile, div3);
                    deconnectButton.addEventListener('click', () => {
                        if (confirm('Do you want to log out ?')) {
                            window.open('../', '_self');
                        }
                    }, { once: true });
                
                    // const body = document.getElementsByTagName('body');
                    // body[0].append(navbardiv, div2);

                    // ************************** update user Profile *********************************************************//
                
                    // userProfile.style.cursor = "pointer";
                    // const navbardiv = document.querySelector('.chatProfile');
                    // *************************store new profile in firestore ************************************************//
                    const userProfileImg = navbardiv;
                    userProfileImg.onclick = function () {
                        inputFile.click();
                    }
                    inputFile.onchange = function (event) {
                        const date = Date.now();
                        const imageName = `image_${date}`;
                        const myFile = event.target.files;
                        // console.log(myFile)
                        const storageRef = fireStorage.ref(`user-profile-photos/` + imageName);
                        const uploadTask = storageRef.put(myFile[0]);
                        uploadTask.on("state_changed", function (snapshot) {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            // prog.innerHTML = progress + "%";
                            // console.log(progress);
                          
                            const progressBar = document.getElementById('progressBar');
                            const value =  progressBar.value = `${progress}`;
                            progressBar.hidden = false;
                            const max = progressBar.max;
                            if (`${value}` === `${max}`) {
                                alert('update complete');
                                progressBar.hidden = true;
                            }
                        
                            
                        },
                    
                            function (err) {
                                console.log(err)
                            },
       
                            function () {
                                uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
                                    console.log(url);
                                    navbardiv.src = `${url}`;
                                    fetch('../update/user/profile', {
                                        method: "POST",
                                        headers: {
                                            "accept": "*/*",
                                            "content-type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            newProfile: `${url}`,
                                            userName: `${inputName.value}`,
                                            userPassword: `${inputPassword.value}`
                                        })
                                    });
                                    
                                });
                            },
                        )
                    }
                
                    //******************* update name and password ****************************/ 
                    i.onclick = function () {
                        // ********input new password*************//
                        const newNameDiv = document.querySelector('.divNewName');
                        const newPassDiv = document.querySelector('.divNewpass');
                        const newButtonDiv = document.querySelector('.divButton');
                        // ************* prevent double click******************//
                        if (!newNameDiv || !newPassDiv || !newButtonDiv) {
                            const divPass = document.createElement('div');
                            divPass.classList = "divNewpass";
                            const labelPass = document.createElement('label');
                            labelPass.setAttribute('for', 'password');
                            labelPass.classList = "labelPassword";
                            labelPass.innerHTML = "Password";
                            const inputNewPassword = document.createElement('input');
                            inputNewPassword.classList = "inputNewPassword";
                            inputNewPassword.name = "password";
                            inputNewPassword.type = "password";
                            inputNewPassword.value = `${data.password}`;
                            divPass.append(labelPass, inputNewPassword);
                            // *********input new name**************//
                            const divName = document.createElement('div');
                            divName.classList = "divNewName";
                            const labelName = document.createElement('label');
                            labelName.classList = "userNamePara";
                            labelName.setAttribute('for', 'userName');
                            labelName.innerHTML = "Name";
                            const inputNewName = document.createElement('input');
                            inputNewName.name = "userName";
                            inputNewName.classList = "inputNewName";
                            inputNewName.value = `${data.data.name}`;
                            divName.append(labelName, inputNewName);
                            // ***********update button*************//
                            const divButton = document.createElement('div');
                            divButton.classList = "divButton";
                            const newButton = document.createElement('button');
                            newButton.classList = "updateButton";
                            newButton.innerHTML = "Update";
                            divButton.append(newButton);
                            divPass.style.textAlign = "center";
                            chatUserSection.append(divName, divPass, divButton);
                            // const updateButton = document.querySelector('.updateButton');
                    
                            newButton.addEventListener("click", function () {
                                const newPasswordInput = document.querySelector('.inputNewPassword');
                                const newPassword = newPasswordInput.value;
                                const newNameInput = document.querySelector('.inputNewName');
                                const newName = newNameInput.value;
                                userNamePara.innerHTML = `${newName}`;
                                // ************* fetch for updating user's name and password************//
                                // ************* fetch for updating user's name and password************//
                                fetch('../update/user/name/password', {
                                    method: "POST",
                                    headers: {
                                        "accept": "*/*",
                                        "content-type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        formerName: `${data.data.name}`,
                                        formerPassword: `${data.password}`,
                                        newName: `${newName}`,
                                        newPassword: `${newPassword}`
                                    })
                                });
                                window.document.location.reload();
                            }, { once: true });
                        }
                    }
                }
            }).catch(err => console.log(err));
        
        });
    
        //************************************* search bar people **************************************************************************************//
        const searchBar = document.getElementById('searchBar');
        searchBar.value = "";
        // *****************************search user to the server ***************************//
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
                // ******************clear the page **********************************//
                const allDiv = document.querySelectorAll('.userChatDiv');
                allDiv.forEach(div => {
                    div.remove();
                });
                peopleIcon.style.color = "black";
                //**********************check if user exist ********************************* */
                if (data.data === "empty") {
                    const para = document.createElement('p');
                    para.classList = "noData";
                    para.innerHTML = `NO DATA MATCHED ON THIS VALUE {${searchBar.value}} try again or go to people.`;
                    const body = document.getElementsByTagName('body');
                    body[0].append(para);
                }
        
                searchBar.value = "";
                const errorPara = document.querySelector('.noData');
                const hr = document.querySelectorAll('.hr');
                console.log(hr);
                if (hr) {
                    hr.forEach(line => {
                        line.remove();
                    });
                }
                if (errorPara) {
                    errorPara.remove();
                }
                //****************************desplay users*************************************** */
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


                    //***************************** set and deplay user's following state ***************************************//
                    fetch('../all/user/followers/research')
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
                                            div.childNodes[2].style.background = "rgb(0,0,20)";
                                            div.childNodes[2].style.color = "white";
                                        }
                                    }
                                });
                            });
                        });


                    // const followButton = document.createElement('button');
                    followButton.innerHTML = "Follow";
                    followButton.classList = "followButton";
                    para.classList = 'username';
                    para.innerHTML = user.data.name;
                    const hr = document.createElement('hr');
                    hr.style.border = "1px solid rgb(0,0,20)";
                    hr.classList = "hr";
                    // const divButton = document.createElement('div');
                    // divButton.classList = "divButton";
                    // divButton.append(followButton);
                    div.style.display = "grid";
                    div.style.gridTemplateColumns = "1fr 2fr 1fr";
                    followButton.style.border = "none"
                    followButton.style.height = "25px"
                    followButton.style.borderRadius = "5px";
                    followButton.style.marginRight = "20px";
                    followButton.style.marginTop = "20px";
                    followButton.style.fontFamily = "sans-serif";
                    img.style.marginLeft = "20px";
                    para.style.fontFamily = "sans-serif";
                    hr.style.marginLeft = "5em";
                    hr.style.marginRight = "1em";
                    hr.style.opacity = "0.5";
                    div.append(img, para, followButton);
                    chatUserDiv.append(div, hr);
                });
                //************************** Open user discution *********************************/
                // const navbardiv = document.querySelector('.chatProfile');
                // const userAccountProfile = navbardiv.src;
                // const userAccountName = navbardiv.nextSibling.firstChild.data;

                // const userChatEvent = document.querySelectorAll('.userChatDiv');
                // userChatEvent.forEach(event => {
                //     event.addEventListener('click', () => {
                //         // console.log(event);

                //         const user = event.childNodes[1].innerHTML;
                //         console.log(user);
                //         const userProfile = event.firstElementChild;
                //         const url = userProfile.getAttribute('src');

                //         fetch('../live', {
                //             method: "POST",
                //             headers: {
                //                 'Accept': '*/*',
                //                 'Content-Type': 'application/json'
                //             },
                //             body: JSON.stringify({
                //                 userAccountProfile: userAccountProfile,
                //                 userAccountName: userAccountName,
                //                 url: url,
                //                 name: user
                //             })
                //         }).then(res => {
                //             return res.text();
                //         }).then(data => {
                //             // console.log(data);
                //             window.open('../chat', '_self');
                    
                //         });
                //     });
                // });


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
                
            






