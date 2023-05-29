# P2P Video Chat App 

Simple Web Application that offer you to create video and audio calling room as well as chat with other users using WebRTC and Socket.

## Prerequisites
You have to install Node.js and React JS in your machine.

## Installing
```bash
npm install in both frontend and backend folders
To run backend  - npm run dev
To run frontend - npm start 
```


## Features
```
Refer to the uploaded video for a clear working of app and features 
```
- Register to create an account or login if account already exists
( Done authentication for repeat emails and phone numbers )

- For chatting go to chat page and you can send text or image to your friend.
( Used Socket.io and ImageKit API for the above purpose and to store messages used MONGODB database )

- For Video or audio call go to video call page and audio call page respectfully then either create a room or join using the same ID as of your friend.
( Used WEBRTC for the implementing both the features )

- Implemented protected routing to prevent accessing the pages without being logged in(done using Json Web Token authentication)

- Profile page to display the user information

- Also deployed the app on render


## Built With

* Node Js  - The Backend
* React JS - The Frontend
* SocketIo - For realtime communication
* NPM      - Dependency Management
* GITLab   - Used for version control
* WEBRTC   - For video and audio calling
* MONGODB  - For storing the user information and chats
* ImageKit - For storing images used in chat 
* Render   - Used to Deploy Node.js applications

## Other Contributers

* Sankalp Bahad
* Aabid Raina
* Abhinay Maurya
