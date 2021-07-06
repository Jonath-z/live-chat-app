
const messageIput = document.getElementById('messageInput')

// const socket = io('http://localhost:8080');

const sendButton = document.querySelector('.send');
sendButton.addEventListener('click', sendMessage);
function sendMessage() {
    const msg = messageIput.value;
    socket.emit('message', msg);
    console.log(msg);
}
const outcomeMessage = document.getElementById('outcomeMessage');
socket.on('message', (data) => {
    console.log(data);
    outcomeMessage.innerHTML = `<p class="message">${data}</p>`
    console.log(data);
});