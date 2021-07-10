
const socket = io('http://localhost:8000');
socket.on('connection');

// set receiver
const userReceiver = document.querySelector('.userName').textContent;

// get the send button
const sendButton = document.querySelector('.send');

sendButton.addEventListener('click', () => {
    // get the input message form
    const messageInput = document.getElementById('messageInput');
    // get the input message value
    const message = messageInput.value;
    // console.log(message);
    // send the massage to the receiver
    socket.emit('sendMessage', `${message}`, `${userReceiver} from ${socket.id}`);
    console.log(socket.id);
})
function receiveMessage() {
    const incomeMessage = document.querySelector('.incomeMessage');
    socket.on('message', message => {
        incomeMessage.innerHTML = `${incomeMessage}`;
        console.log(message);
    })
}
receiveMessage();
