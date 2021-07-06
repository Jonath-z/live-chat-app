const express = require('express');
const path = require('path');
const firestore = require('firebase-admin');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const serviceAccount = require('./chatapp-318511-firebase-adminsdk-n508y-f89762a63d.json');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const { Console } = require('console');
const fs = require('file-system');
const { storage } = require('firebase-admin');
const favicon = require('serve-favicon');



// middleware
app.use(favicon(path.join(__dirname, './public', 'favicon.ico')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/statics', express.static(path.join(__dirname, './login')));
app.use('/static', express.static(path.join(__dirname, './css')));
app.set('view engine', 'ejs');
  
firestore.initializeApp({
    credential: firestore.credential.cert(serviceAccount)
})
const db = firestore.firestore();
const storageFiebase = firestore.storage()



app.get('/', (req, res) => {
    res.redirect("/login/user");
});

// login page
app.get('/login/user', (req, res) => {
    res.render('index')
})

app.get('/chat', (req, res) => {
    const userDoc = db.collection('user');
    async function chatUser() {
        const snapshot = await userDoc.get();
        if (snapshot.empty) {
            console.log('no user');
        }
        snapshot.forEach(doc => {
            console.log(doc);
        })
        res.render('chat');
    }
    chatUser();
})

app.post('/login/user', (req, res) => {
    const userDoc = db.collection('user');
    // console.log(req.body);
    async function getUser() {
        const snapshot = await userDoc.where("data.name", "==", req.body.name).get();
        if (snapshot.empty) {
            console.log("no data");
            res.render('index');
        } else {
            snapshot.forEach(doc => {
                userDoc.doc(doc.id).set({ password: `${req.body.password}` },
                    { merge: true });
                res.render('chat', {
                    data: doc.data()
                });
            })
        }
    }
    getUser();
    // res.render('chat');
});

app.get('/signup', (req, res) => {
    res.render('signup')
});

app.post('/signup/user', (req, res) => {
    async function setUser() {
        const UserData = {
            data: req.body.response,
            defaultProfile: req.body.url

        }
        db.collection('user').doc(`${req.body.response.id}`).set(UserData);
    }
    setUser();
    // console.log(req.body);
})

app.post('/login', (req, res) => {
    const userDoc = db.collection('user');
    // console.log(req.body);
    async function getUser() {
        const snapshot = await userDoc.where("password", "==", req.body.password).where("data.name", "==", req.body.name).get();
        if (snapshot.empty) {
            console.log("no data");
            res.redirect('/');
        } else {
            snapshot.forEach(doc => {
                // userDoc.doc(doc.id).set({ password: `${req.body.password}` },
                //     { merge: true });
                res.render('chat', {
                    data: doc.data()
                });
               
            })
        }
    }
    getUser();
    // res.render('chat');
})

// get all users
app.get('/all/users', (req, res) => {
    db.collection('user')
    .get()
    .then(querySnapshot => {
      const documents = querySnapshot.docs.map(doc => doc.data())
        res.send(documents[0]);  
    })
})

app.post('/open/chat', (req, res) => {
    const userProfile = req.body.url;
    const userDoc = db.collection('user');
    async function getUserInfo() {
        const snapshot = await userDoc.where("defaultProfile", "==", userProfile).get();
        if (snapshot.empty) {
            console.log('no data');
        }
        else {
            snapshot.forEach(doc => {
                res.send(doc.data()); 
                    
            })
        }
    }
    getUserInfo();

});

app.get('/user/chat', (req, res) => {
    res.render('userChat');
    
    io.on('connection', (socket) => {
        console.log(socket.id);
        if (socket.id > 1) {
            console.log('disconnected');
        }
        socket.on('message', (data) => {
            console.log(data);
            socket.emit('message', data);
        });
    });
});



const port = process.env.PORT || 8080
server.listen(port, () => { console.log("server is running on " + port) });