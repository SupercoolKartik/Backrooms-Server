const http = require("http");
const express = require("express");
const socketio = require("socket.io");

// Express initialization
const app = express();
const server = http.createServer(app);

// Define CORS options for socket.io
const io = socketio(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

// Global constants
const PORT = 5001;

//#1

io.on("connection", async (socket) => {
  let room;
  let name;
  await socket.on("userdetails", (details) => {
    console.log("userdetails", details.name, details.room);

    name = details.name; // Assign value to the global variable name
    room = details.room; // Assign value to the global variable room

    socket.join(room);
    socket.emit("connection msg", "You joined the room"); //Contn msf for Sender
    socket.to(room).emit("connection msg", name + " joined the room"); //Contn msg for Reciever
  });

  console.log("name", name);
  console.log("room", room); // Access the global variable room

  socket.on("sent message", (data) => {
    const { name, room, message } = data;
    console.log("sentmsg", name, room);
    console.log("sent msg", message);

    // Send the message to the sender with event "chat message right"
    socket.emit("chat message right", data);
    // Send the message to all other clients in the same room with event "chat message left"
    socket.to(room).emit("chat message left", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    io.to(room).emit("connection msg", name + " left the room");
  });
});

// Fire up server
server.listen(PORT, () => console.log(`Server is running !`));
