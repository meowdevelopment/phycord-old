const express = require("express");
const app = express();
const server = require("http").createServer(app);
const fs = require("fs");

app.use(express.static("public"));

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

const listener = server.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

let ChannelAddMessage = function (id, message) {
  let messagesJSON;
  try {
    messagesJSON = fs.readFileSync(`./src/servers/0/channels/${id}.json`);
  } catch (e) {
    return;
  }
  messagesJSON = JSON.parse(String(messagesJSON));
  if (!messagesJSON) return;

  messagesJSON.messages.push({
    content: message.content,
    author: {
      avatarURL: message.author.avatarURL,
      username: message.author.username,
    },
  });

  messagesJSON = JSON.stringify(messagesJSON);

  fs.writeFileSync(`./src/servers/0/channels/${id}.json`, messagesJSON);
};

let FetchMessages = function (id) {
  let messagesJSON;
  try {
    messagesJSON = fs.readFileSync(`./src/servers/0/channels/${id}.json`);
  } catch (e) {
    return;
  }
  messagesJSON = JSON.parse(String(messagesJSON));
  if (!messagesJSON) return { error: "Not Found" };

  return messagesJSON;
};

let FetchAccount = function (details) {
  return { username: "Test", discriminator: "1234" };
};

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("Socket connected!");
  socket.on("sendMessage", (message) => {
    io.sockets.emit("message", message);
    ChannelAddMessage("0", message);
  });
  socket.on("fetchChannel", (id) => {
    socket.emit("returnChannel", FetchMessages("0"));
  });
  socket.on("fetchAccount", (details) => {
    socket.emit("returnAccount", FetchAccount(details));
  });
});
