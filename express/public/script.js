const socket = io();
let _ = function(e) {
  return document.getElementById(e);
};

function createMessage(message) {
  let msg = document.createElement("div");
  msg.className = "message";

  let authorImage = document.createElement("img");
  authorImage.className = "message-author-image";
  authorImage.src = message.author.avatarURL;

  let authorName = document.createElement("div");
  authorName.className = "message-author-name";
  authorName.innerHTML = message.author.username;

  let content = document.createElement("div");
  content.className = "message-content";
  content.innerHTML = parse(message.content);

  let buttons = document.createElement("div");
  buttons.className = "message-buttons";

  msg.appendChild(authorImage);
  msg.appendChild(authorName);
  msg.appendChild(content);
  msg.appendChild(buttons);

  _("messages").appendChild(msg);
  _("messages").scrollTop = 9999999;
}

document.querySelectorAll(".channel").forEach(c => {
  c.onclick = function() {
    c.setAttribute("selected", "");
    document.querySelectorAll(".channel").forEach(cc => {
      if (cc !== c) cc.removeAttribute("selected");
    });
  };
  c.title = c.innerHTML;
});

let escape = function(string) {
  return String(string)
    .replace(/&/g, "﹠amp;")
    .replace(/"/g, "﹠quot;")
    .replace(/'/g, "﹠#39;")
    .replace(/</g, "﹠lt;")
    .replace(/>/g, "﹠gt;")
    .replace(/﹠/g, "&");
};

let parse = function(md) {
  let newStr = escape(md);
  let split = newStr.split("`");
  split.forEach(s => {
    if (split.indexOf(s) % 2 == 1) {
      split[split.indexOf(s)] = s.replace(/\*/g, "&#42;");
      split[split.indexOf(s)] = s.replace(/_/g, "&#95;");
      split[split.indexOf(s)] = s.replace(/%/g, "&#37;");
      split[split.indexOf(s)] = s.replace(/~/g, "&#8764;");
      split[split.indexOf(s)] = s.replace(/:/g, "&#58;");
    }
  });
  newStr = split.join("`");
  newStr = newStr
    .replace(/`(.*?)`/gi, "<code>$1</code>")
    .replace(/\*\*\*(.*?)\*\*\*/gi, "<b><i>$1</i></b>")
    .replace(/\*\*(.*?)\*\*/gi, "<b>$1</b>")
    .replace(/\*(.*?)\*/gi, "<i>$1</i>")
    .replace(/~~(.*?)~~/gi, "<s>$1</s>")
    .replace(/__(.*?)__/gi, "<u>$1</u>")
    .replace(/\|\|(.*?)\|\|/gi, "<spoiler>$1</spoiler>")
    .replace(/%color=(.*?) (.*?)%/gi, '<span style="color: $1;">$2</span>')
    .replace(/\[(.*?)\]\((.*?)\)/gi, '<a href="$2">$1</a>')
    .replace(
      /(\bhttps:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
      '<a href="$1">$1</a> '
    )
    .replace(
      /\[script\](.*?)\[\/script\]/gi,
      '<a href="javascript:' +
        "$1".split('"').join('\\"') +
        '" script-preview>Accept Script?</a>'
    );

  let customEmojis = {
    wut: "https://cdn.discordapp.com/emojis/621728346694221834.png",
    oof: "https://cdn.discordapp.com/emojis/621728331053662268.png",
    screech: "https://cdn.discordapp.com/emojis/578282095051538464.png",
    think_about_it: "https://cdn.discordapp.com/emojis/528511278776320001.png",
    thinking:
      "https://discordapp.com/assets/263a7f4eeb6f69e46d969fa479188592.svg",
    this: "https://cdn.discordapp.com/emojis/618811580997435392.png",
    eyess: "https://cdn.discordapp.com/emojis/641110312778596389.png"
  };
  Object.keys(customEmojis).forEach(em => {
    newStr = newStr
      .split(":" + em + ":")
      .join(
        '<img src="' +
          customEmojis[em] +
          '" class="emoji" alt="customEmoji" title=":' +
          em +
          ':">'
      );
  });

  return newStr;
};

socket.emit("fetchChannel", "0");
socket.on("returnChannel", channel => {
  channel.messages.forEach(m => {
    createMessage(m);
  });
});

socket.emit("fetchAccount", { email: "user@name.com", password: "userPass" });
socket.on("returnAccount", account => {
  _("username").innerHTML = account.username;
  _("discriminator").innerHTML = "#" + account.discriminator;
});

socket.on("message", message => {
  createMessage(message);
});

_("message-send").addEventListener("keyup", function(e) {
  if (e.key !== "Enter") return;
  let v = _("message-send").value.replace(/\n/g, "");
  if (!v) return;
  _("message-send").value = "";

  socket.emit("sendMessage", {
    author: {
      id: "0",
      username: "Thwampus the Wumpus",
      avatarURL:
        "https://cdn.discordapp.com/avatars/601445697362984970/8ca8a0860f402bcb76686154128160c8.png?size=128"
    },
    content: v
  });
});

_("message-send").select();

_("channel-bar-title").onmouseover = function() {
  let d = _("channel-divider").style;
  d.width = "100%";
  d["border-radius"] = "0px";
  d.margin = "-10px 0px 4px 0px";
};
_("channel-bar-title").onmouseout = function() {
  let d = _("channel-divider").style;
  d.width = "10vw";
  d["border-radius"] = "10px";
  d.margin = "-10px 4vw 4px 4vw";
};

_("message-bar-title").onmouseover = function() {
  let d = _("message-bar-divider").style;
  d.width = "100%";
  d["border-radius"] = "0px";
  d.margin = "-10px 0px 4px 0px";
};
_("message-bar-title").onmouseout = function() {
  let d = _("message-bar-divider").style;
  d.width = "40vw";
  d["border-radius"] = "10px";
  d.margin = "-10px 9vw 4px 9vw";
};

let themes = {
  1: {
    bright: "#ffffff",
    light: "#f1efef",
    dark: "#e8e8e8",
    black: "#dfdfdf",
    text: "#000000",
    hashtag: "black"
  },
  2: {
    bright: "#ebedef",
    light: "#ffffff",
    dark: "#f2f3f5",
    black: "#e3e5e8",
    text: "#2e3338",
    hashtag: "black"
  },
  3: {
    bright: "#25bdff",
    light: "#009aff",
    dark: "#0048ff",
    black: "#0024bd",
    text: "#000000",
    hashtag: "white"
  },
  4: {
    bright: "#40444b",
    light: "#36393f",
    dark: "#2f3136",
    black: "#202225",
    text: "#dcddde",
    hashtag: "white"
  },
  5: {
    bright: "#2d2c2c",
    light: "#1b1a1a",
    dark: "#0e0d0d",
    black: "#060606",
    text: "#E0E0E0",
    hashtag: "white"
  }
};

let t = 5;
setTheme(themes[Number(window.location.href.split("?theme=")[1] || 5)] || {});

function setTheme(theme) {
  let s = document.getElementById("themestyle");
  let sNotExist = false;
  if (!s) {
    s = document.createElement("style");
    sNotExist = true;
  }

  s.innerHTML = `:root {
  --text: ${theme.text};
  --link: #00ADFF;
  --background-bright: ${theme.bright};
  --background-light: ${theme.light};
  --background-dark: ${theme.dark};
  --background-black: ${theme.black};
  --hash: ${
    theme.hashtag == "black" ? 'url("/bhashtag.svg")' : 'url("/hashtag.svg")'
  }
}`;

  if (sNotExist) {
    s.id = "themestyle";
    document.head.appendChild(s);
  }
}

if (window.location.href.includes("?theme=x")) {
  setInterval(function() {
    if (t == 6) t = 2;
    setTheme(t);
    t++;
  }, 1000);
}
