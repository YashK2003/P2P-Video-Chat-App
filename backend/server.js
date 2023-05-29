const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const ImageKit = require('imagekit');
const app = express();
const http = require('http');
const server = http.createServer(app);


const PORT = 4000;

// app.use(cors());
app.use(cors({
  origin: '*'
}));

// Add Access Control Allow Origin headers
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to mongodb
mongoose.connect("mongodb+srv://yashkawade:qTauHQ8ZBw2ViAj1@cluster0.urn2uyj.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const imagekit = new ImageKit({
  urlEndpoint: 'https://ik.imagekit.io/tb5em07q5',
  publicKey: 'public_n1qVVkAdBe09dzJ2xXnLSzx6wxY=',
  privateKey: 'private_T3IsMlHI+tuCLurhZnIlt2Wopu4='
});


const connection = mongoose.connection;


connection.once("open", () => {
  console.log("MongoDB database connection established succesfully.");
});

app.get('/authimg', function (req, res) {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
});


// API endpoints

const userdatarouting = require("./routes/userdata");
app.use("/data", userdatarouting);

const authrouting = require("./routes/auth");
app.use("/auth", authrouting);

const conversationrouting = require("./routes/conversation");
app.use("/conv", conversationrouting);

const messagerouting = require("./routes/message");
app.use("/mess", messagerouting);

const { Server } = require("socket.io");
const io = new Server(server ,{
  cors: {
    origin: '*',
    // origin: "http://localhost:3000",
    // origin: "http://192.168.137.149:3000"
  },
})

server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});


let users = [];

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //when connect
    // console.log("a user connected.");
    io.emit("welcome", "Test message");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        if (userId != null) {
            addUser(userId, socket.id);
        }
        io.emit("getUsers", users);
        console.log("added user here");
    });

    // *********
    // CODE FOR WEBRTC 
    socket.emit("me", socket.id);
    
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    });
    // CODE FOR WEBRTC 
    // *********
    
    socket.on("room:join", (data) => {
        // console.log(users)
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);
        io.to(room).emit("user:joined", { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
      });
    
      socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
      });

      socket.on("uservideoclose:call", ({ to }) => {
        // console.log("here reached step-1");
        io.to(to).emit("closevideo:call", { from: socket.id });
      });

      socket.on("uservideoopen:call", ({ to }) => {
        // console.log("here reached step-1");
        io.to(to).emit("openvideo:call", { from: socket.id });
      });

      socket.on("useraudioclose:call", ({ to }) => {
        // console.log("here reached step-1");
        io.to(to).emit("closeaudio:call", { from: socket.id });
      });

      socket.on("useraudioopen:call", ({ to }) => {
        // console.log("here reached step-1");
        io.to(to).emit("openaudio:call", { from: socket.id });
      });

      socket.on("userhangup:call", ({ to }) => {
        // console.log("here reached step-1");
        io.to(to).emit("hangupcallnow:call", { from: socket.id });
      });
    
      socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
      });
    
      socket.on("peer:nego:needed", ({ to, offer }) => {
        // console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
      });
    
      socket.on("peer:nego:done", ({ to, ans }) => {
        // console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
      });
    
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        // console.log(user);
        if(user !== undefined){
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });}
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!!!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
