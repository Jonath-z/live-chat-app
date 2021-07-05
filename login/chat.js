const navbarImage = document.querySelector('.chatProfile');
const chatUser = document.querySelector('.chatUsers');
fetch('../all/users')
    .then(res => {
        return res.json();
    })
    .then(data => {
        console.log(data);
        data.forEach(user => {
            // const div = document.createElement('div');
            // div.classList = 'userOnChat';
            // const img = document.createElement('img');
            // img.classList = 'userProfile';
            // img.src = `${user.defaultProfile}`
            // div.appendChild(img);
            // chatUser.appendChild(img)
            console.log(user.defaultProfile);
        });
    })
