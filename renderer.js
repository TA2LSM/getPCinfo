// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require("electron");

let cnt = 0;
//
document.getElementById("startBtn").onclick = () => {
  //   setInterval(() => {
  //     document.getElementById("counter").innerText = cnt++;
  //     console.log(cnt);
  //   }, 1000);
  console.log("started");
  ipcRenderer.send("parameter", "ping");
};

ipcRenderer.on("parameter", (event, arg) => {
  document.getElementById("counter").innerText = arg;
});