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
const moment = require('moment');
const mongoose = require('mongoose');


// middleware
app.use(favicon(path.join(__dirname, './public', 'favicon.ico')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/statics', express.static(path.join(__dirname, './js')));
app.use('/static', express.static(path.join(__dirname, './css')));
app.set('view engine', 'ejs');

// ******************************** firestore initialization *******************************************//
firestore.initializeApp({
    credential: firestore.credential.cert(serviceAccount)
});
const db = firestore.firestore();

//************************** mongoAtlas connection ************************************************//
mongoose.connect(`${process.env.MONGO_DATABASE}`, {useNewUrlParser: true, useUnifiedTopology: true});
const mongodb = mongoose.connection;


app.get('/', (req, res) => {
    res.redirect("/login/user");
});

// login page
app.get('/login/user', (req, res) => {
    res.render('index');
});

app.get('/chat', (req, res) => {
    const userDoc = db.collection('user');
    async function chatUser() {
        const snapshot = await userDoc.get();
        if (snapshot.empty) {
            console.log('no user');
        }
        snapshot.forEach(doc => {
            console.log(doc);
        });
        res.render('chat');
    }
    chatUser();
});

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
            });
        }
    }
    getUser();
    // res.render('chat');
});

app.get('/signup', (req, res) => {
    res.render('signup');
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
});


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
                res.render('chat', {
                    data: doc.data()
                });
               
            });
        }
    }
    getUser();
    
});

// *****************************************/get all users/**********************************************************

app.get('/all/users', (req, res) => {
    db.collection('user')
        .get()
        .then(querySnapshot => {
            const documents = querySnapshot.docs.map(doc => doc.data())
            res.send(documents)
        });
});

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
                    
            });
        }
    }
    getUserInfo();

});

app.get('/live/chat', (req, res) => {
    res.render('userChat');
});

app.post('/live', (req, res) => {
    // console.log(req.body);
    res.render('userChat', {
        userAccountProfile: req.body.userAccountProfile,
        userAccountName:req.body.userAccountName,
        url: req.body.url,
        receiver: req.body.name
    });
});

// ********************* from fetch (socket.js) updating user's socketID*******************//
app.post('/update/socket', (req, res) => {
    // console.log(req.body);
    const userDoc = db.collection('user');

    async function updateID() {
        const snapshot = await userDoc.where("defaultProfile", "==", req.body.profile).where("data.name", "==", req.body.name).get();
        if (snapshot.empty) {
            console.log("no data");
        } else {
            snapshot.forEach(doc => {
                userDoc.doc(doc.id).update({ socket: `${req.body.id}` });
                    
            });
            res.send(req.body);
        }
    }
    updateID();

});
// ************************** get user's message sent (from the client) && store ****************//
app.post('/messages/sent', (req, res) => {
    mongodb.collection("messages").insertOne(req.body);
})

// ************************ store user's followers in mongoAtlas **************************** //
app.post('/set/followers', (req, res) => {
    // console.log(req.body);
    mongodb.collection("users-followers").insertOne(req.body);
});

// ****************************** get all user's followers from mongoAtlas *************************//
app.get('/all/user/followers', (req, res) => {
    mongodb.collection("users-followers").find({}).toArray((err, data) => {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
});
// ***************************** unfollow user setting ******************************************* //
app.post('/unfollow', (req, res) => {
    mongodb.collection("users-followers").find({
        followerProfile: `${req.body.followerProfile}`,
        followerName: `${req.body.followerName}`,
        followedProfile: `${req.body.followedProfile}`,
        followedName: `${req.body.followedName}`
    }).toArray((err, data) => {
        mongodb.collection("users-followers").deleteOne(data[0]);
        // console.log(data);
    })
});

// ********************************** get users discussion ***************************************//
app.get('/user/message', (req, res) => {
    mongodb.collection("messages").find({}).toArray((err, data) => {
        if (err) {
            console.log(err)
        } else {
            // console.log(data);
            res.send(data);

        }
    });
    // console.log(req.body);
});

// *********************** get user's profile from firestore ********************************//
app.post('/user/profile', (req, res) => {
    const userDoc = db.collection('user');

    async function userProfile() {
        const snapshot = await userDoc.where("defaultProfile", "==", req.body.userProfile).where("data.name", "==", req.body.userName).get();
        if (snapshot.empty) {
            console.log("no data");
        } else {
            snapshot.forEach(doc => {
                console.log(doc.data());
                res.send(doc.data());
                    
            });
        }
    }
    userProfile();
});

// ********************************** socket.io **************************************************//
io.on('connection', (socket) => {
    console.log('users ID ', socket.id);
    socket.emit('connection');
    socket.on('room', (data) => {
        const userDoc = db.collection('user');
        async function getReceiverID() {
            const snapshot = await userDoc.where("defaultProfile", "==", data.receiver).where("data.name", "==", data.room).get();
            if (snapshot.empty) {
                console.log('no data');
            }
            else {
                snapshot.forEach(doc => {
        // *******************send a private message *********************** //
                    socket.to(doc.data().socket).emit('message', {
                        message: `${data.message}`,
                        fromName: `${data.sender}`,
                        fromProfile: `${data.senderProfile}`,
                        to: `${data.room}`,
                        date: `${moment().format('LT')}`
                    });

       // ******************* messages's storage ************************ //
                    mongodb.collection("messages").insertOne({
                        message: `${data.message}`,
                        fromName: `${data.sender}`,
                        fromProfile: `${data.senderProfile}`,
                        to: `${data.room}`,
                        time: `${moment().format('LT')}`
                    });
                    // console.log(doc.data().socket);
                });
            };
        };
        getReceiverID();
    });
});


const port = process.env.PORT || 8000
server.listen(port, () => { console.log("server is running on " + port) });