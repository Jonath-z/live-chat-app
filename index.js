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
const { Console, clear } = require('console');
const fs = require('file-system');
const { storage } = require('firebase-admin');
const favicon = require('serve-favicon');
const moment = require('moment');
const mongoose = require('mongoose');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const url = require('url');
const querystring = require('querystring');
const circularFix = require('circular-ref-fix');
const { WebPushError } = require('web-push');
const createRefs = circularFix.createRefs;
const webpush = require('web-push');
const bcrypt = require('bcrypt');

// middleware
app.use(favicon(path.join(__dirname, './public', 'favicon.ico')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/statics', express.static(path.join(__dirname, './js')));
app.use('/static', express.static(path.join(__dirname, './css')));
app.use('/publics', express.static(path.join(__dirname, './views')));
app.set('view engine', 'ejs');

// ************************ VAPID keys**********************************************************//
const publicVapidKey = 'BH6C9KUzBHe8tFJ7drhsRdu-vVh1MeM5RY-xzNGAQnu8miOcCXzUHo-58npoKuCFb5iHRcZPDUmKvOJ9mX7Cssk';
const privateVapidKey = `${process.env.PRIVATE_VAPID_KEY}`;

// ****************************setting vapig keys details***************************************//
webpush.setVapidDetails('mailto:jonathanzihindula95@gmail.com', publicVapidKey,privateVapidKey);

// ******************************** firestore initialization *******************************************//
firestore.initializeApp({
    credential: firestore.credential.cert(serviceAccount)
});
const db = firestore.firestore();

//************************** mongoAtlas connection ************************************************//
mongoose.connect(`${process.env.MONGO_DATABASE}`, {useNewUrlParser: true, useUnifiedTopology: true});
const mongodb = mongoose.connection;

//**********************************subscribe route************************************************//
// app.post('/subscribe', (req, res) => {
//     //get push subscription object from the request
//     const subscription = req.body;
//     console.log(subscription);
//     //send status 201 for the request
//     const result = res.status(201);

//  const options = {
//         headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
//         }
//     }

//     //  console.log(result);
//     //create paylod: specified the detals of the push notification
//     const payload = JSON.stringify({ title: 'New message' });

//     //pass the object into sendNotification fucntion and catch any error
//     webpush.sendNotification(subscription, payload,options).catch(err => console.error(err));
// });

app.get('/', (req, res) => {
    res.redirect("/user/login");
});

// login page
app.get('/user/login', (req, res) => {
    res.render('index');
});

app.post('/login/user', (req, res) => {
    // const userDoc = db.collection('user');
    // // console.log(req.body);
    // async function getUser() {
    //     const snapshot = await userDoc.where("data.name", "==", req.body.name).get();
    //     if (snapshot.empty) {
    //         console.log("no data");
    //         res.render('index');
    //     } else {
    //         snapshot.forEach(doc => {
    //             userDoc.doc(doc.id).set({ password: `${req.body.password}` },
    //                 { merge: true });
                res.redirect('/user/login');
                // res.redirect('/chat');
    //         });
    //     }
    // }
    // getUser();
    // // res.render('chat');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup/user', (req, res) => {
    // console.log(req.body);
    const userDoc = db.collection('user');
    async function chekValidUserName() {
        const snapshot = await userDoc.where("data.name", "==", req.body.response.name).get();
        if (snapshot.empty) {
            async function setUser() {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                // console.log(hashedPassword);
                const UserData = {
                    data: req.body.response,
                    defaultProfile: req.body.url,
                    password: hashedPassword,
                    bio:req.body.bio
                }
                db.collection('user').doc(`${req.body.response.id}`).set(UserData);
                res.send('succed');
            }
            setUser();
        }
        else {
            console.log('fail to signup');
            res.send('this username is used,please change the username');
        }
        
    }
    chekValidUserName();

});

// app.get('/return', (req, res) => {
//     res.redirect('/login');
// })

app.post('/login', (req, res) => {
    const userDoc = db.collection('user');
    // console.log(req.body);
    
    async function getUser() {
        const name = req.body.name.trim();
        // console.log(name);
        const snapshot = await userDoc.where("data.name", "==", name).get();
        if (snapshot.empty) {
            console.log("no data");
            res.redirect('/');
        }
        else {
            snapshot.forEach(doc => {
                async function chekPassword() {
                    const validPassword = await bcrypt.compare(req.body.password, doc.data().password);
                    // console.log(validPassword);
                    if (validPassword) {
                        res.render('chat', {
                            data: doc.data()
                        });
                    }
                   else if (!validPassword && req.body.password === `${doc.data().password}`) {
                        res.render('chat', {
                            data: doc.data()
                        });
                    }
                    else {
                        res.send('<h1>Invalid password</h1>');
                    }
                } chekPassword();
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

app.post('/live', function (req, res){
    res.redirect(url.format({
        pathname: "/chat",
        query: {
            "userAccountProfile": `${req.body.userAccountProfile}`,
            "userAccountName": `${req.body.userAccountName}`,
            "url": `${req.body.url}`,
            "receiver": `${req.body.name}`
        }
    }));

});

app.get('/chat', (req, res) => {
    // res.render('userChat');
    if (req.query.userAccountName && req.query.userAccountProfile && req.query.url && req.query.receiver !== "undefined") {
     
        mongodb.collection("queries").insertOne(req.query);
        // console.log(req.query);
    }
    // const data = [];
   
    mongodb.collection("queries").find({}).toArray((err, data) => {
        const lastChild = data[data.length - 1];
        // console.log(lastChild)
        res.render('userChat', {
            userAccountProfile: lastChild.userAccountProfile,
            userAccountName: lastChild.userAccountName,
            url: lastChild.url,
            receiver: lastChild.receiver
        });
        // mongodb.collection("queries").deleteOne(lastChild);
    });

    // push.create('hello');
        //  res.status(307).send('chat'); 

});
// ********************** form fetch public profile************************//
app.post('/public/profile', (req, res) => {
    const userDoc = db.collection('user');
    // console.log(req.body);
    async function getUserDetails() {
        const snapshot = await userDoc.where("data.name", "==", `${req.body.name}`).get();
        // if (snapshot.empty) {
        //     console.log("no data");
        // }
        snapshot.forEach(doc => {
            res.redirect(url.format({
                pathname: "/profile",
                query: {
                    "bio": `${doc.data().bio}`,
                    "name": `${req.body.name}`,
                    "profilePic": `${req.body.src}`
                }
            }));
        });

    }
    getUserDetails();
});
// ***************************get public profile page***********************************//
app.get('/profile', (req, res) => {
    // console.log(req.query);
    if (req.query.bio && req.query.name && req.query.profilePic !== "undefined") {
        mongodb.collection("public-profile-queries").insertOne(req.query);
        // console.log(req.query);
    }
        mongodb.collection("public-profile-queries").find({}).toArray((err, data) => {
            if (err) {
                console.log(err);
            }
            const lastChild = data[data.length - 1];
            // console.log(lastChild);
            res.render('profile', {
                img: lastChild.profilePic,
                bio: lastChild.bio,
                name: lastChild.name
            });
        
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
        // console.log(data);
    });
});
// *************************get all user followers from mongoAtlas to chat page *********************//
app.get('/all/user/followers/chat', (req, res) => {
    mongodb.collection("users-followers").find({}).toArray((err, data) => {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
});
// *************************get all user followers from mongoAtlas to research *********************//
app.get('/all/user/followers/research', (req, res) => {
    mongodb.collection("users-followers").find({}).toArray((err, data) => {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
});
// ************************** user followers from fetch (352 chat.js)**********************************//
app.post('/user/followers', (req, res) => {
    mongodb.collection("users-followers").find({
       followedName:`${req.body.userName}` 
    }).toArray((err, data) => {
        if (err) {
            console.log(err);
        }
        res.send(data);
    })
})
// ***************************user following from fetch(392 chat.js)*********************************//
app.post('/user/following', (req, res) => {
    mongodb.collection("users-followers").find({
       followerName:`${req.body.userName}` 
    }).toArray((err, data) => {
        if (err) {
            console.log(err);
        }
        res.send(data);
    })
})
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
                // console.log(doc.data());
                res.send(doc.data());
                    
            });
        }
    }
    userProfile();
});
// ********************************* update user profile (photo) **************************************//

app.post('/update/user/profile', (req, res) => {
    // console.log(req.body);
    // *********** update firestore user defaultProfile ******************//
    const userDoc = db.collection('user');
    async function updateProfileImg() {
        const snapshot = await userDoc.where("password", "==", req.body.userPassword).where("data.name", "==", req.body.userName).get();
        if (snapshot.empty) {
            console.log("no data");
        } else {
            snapshot.forEach(doc => {
                userDoc.doc(doc.id).update({ "defaultProfile": `${req.body.newProfile}` });
                    
            });
            res.send(req.body);
        }
    }
    updateProfileImg();
    //******************* update userProfile in mongodb message's collection  **********//
    mongodb.collection("messages").updateMany(
        { fromName: `${req.body.userName}` },
        { $set: { fromProfile: `${req.body.newProfile}` } },
        function (err, res) {
            if (err) {
                console.log(err)
            }
            console.log(res.result.nModified + " documents updated");
            
        }
    );
    // ************** update userProfile in mongodb users-followers's collection (followers case) *********//
    mongodb.collection('users-followers').find({}).toArray((err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            if (data.length != 0) {
                mongodb.collection('users-followers').updateMany(
                    { followerName: `${req.body.userName}` },
                    { $set: { followerProfile: `${req.body.newProfile}` } },
                    function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(res.result.nModified + " documents updated");
                       
                    }
                );
       
                // ************ update userProfile in mongodb users-followers's collection (followed case) **********//
                mongodb.collection('users-followers').updateMany(
                    { followedName: `${req.body.userName}` },
                    { $set: { followedProfile: `${req.body.newProfile}` } },
                    function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(res.result.nModified + " documents updated");
                        mongodb.close();
                    }
                );
            }
            console.log('no data');
        }
    });
});

// **************************** update user's name and password *********************************//
app.post('/update/user/name/password', (req, res) => {
    // *************update user's name and passWord in firestore*******************//
    const userDoc = db.collection('user');
    async function updateNameAndPassword() {
        const snapshot = await userDoc.where("password", "==", req.body.formerPassword).where("data.name", "==", req.body.formerName).get();
        if (snapshot.empty) {
            console.log("no data");
        } else {
            snapshot.forEach(doc => {

                if (req.body.newName !== "") {
                    userDoc.doc(doc.id).update({
                        "data.name": `${req.body.newName}`,
                    });
                }
                if (req.body.newPassword !== "") {
                    async function cryptPassword() {
                        const salt = await bcrypt.genSalt(10);
                        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
                        userDoc.doc(doc.id).update({
                            "password": `${hashedPassword}`
                        });
                    }
                    cryptPassword();
                }
                if (req.body.bio !== "") {
                    userDoc.doc(doc.id).update({
                        bio: `${req.body.bio}`
                    });
                }
            
            });
            res.send(req.body);
        }
    }
    updateNameAndPassword();
    // *********** update user's name in mongodb messages's collection(sender case) **********//
    mongodb.collection("messages").updateMany(
        { fromName: `${req.body.formerName}` },
        { $set: { fromName: `${req.body.newName}` } },
        function (err, res) {
            if (err) {
                console.log(err)
            }
            console.log(res.result.nModified + " documents updated");
            
        }
    );
    // *********** update user's name in mongodb messages's collection(receiver case) **********//
    mongodb.collection("messages").updateMany(
        { to: `${req.body.formerName}` },
        { $set: { to: `${req.body.newName}` } },
        function (err, res) {
            if (err) {
                console.log(err)
            }
            console.log(res.result.nModified + " documents updated");
            
        }
    );
    // *********** update user's name in mongodb followers's collection(followers case) **********//
    mongodb.collection('users-followers').updateMany(
        { followerName: `${req.body.formerName}` },
        { $set: { followerName: `${req.body.newName}` } },
        function (err, res) {
            if (err) {
                console.log(err);
            }
            console.log(res.result.nModified + " documents updated");
           
        }
    );
    // *********** update user's name in mongodb followers's collection(followed case) **********//
    mongodb.collection('users-followers').updateMany(
        { followedName: `${req.body.formerName}` },
        { $set: { followedName: `${req.body.newName}` } },
        function (err, res) {
            if (err) {
                console.log(err);
            }
            console.log(res.result.nModified + " documents updated");
               
        }
    );
});

// ********************************* get people via reaserch ************************************//
app.post('/user/search', (req, res) => {
    const userDoc = db.collection('user');

    async function searchUser() {
        const snapshot = await userDoc.where("data.name", "==", req.body.name).get();
        if (snapshot.empty) {
            res.send({ data:"empty"});
        } else {
            snapshot.forEach(doc => {
                // console.log(doc.data());
                // res.send(doc.data());
                const data = [];
                data.push(doc.data());
                res.send(data);
            });
        }
    }
    searchUser();
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
                        time: `${moment().format('LT')}`
                    });
                    // ******************* send a private notification ******************//
                    socket.on( 'new_notification', function( data ) {
                        console.log(data.title,data.message);
                        socket.to(doc.data().socket).emit( 'show_notification', { 
                          title: data.title, 
                          message: data.message, 
                          icon: data.icon, 
                        });
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

    socket.on('user-passworod', data => {
        const userDoc = db.collection('user');

        async function userProfile() {
            const snapshot = await userDoc.where("defaultProfile", "==", data.profile).where("data.name", "==", data.name).get();
            if (snapshot.empty) {
                console.log("no data");
            } else {
                snapshot.forEach(doc => {
                    socket.emit('user-get-profile', doc.data());
                });
            }
        }
        userProfile();
    });
    socket.on('user-chat', data => {
        // console.log(data);
        socket.emit('user-chat', data);
    });

});


const port = process.env.PORT || 8000
server.listen(port, () => { console.log("server is running on " + port) });