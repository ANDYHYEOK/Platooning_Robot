const { app, BrowserWindow } = require("electron");

function createWindow() {
  // 브라우저 창을 생성
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 주의: 보안 취약점 가능성
      contextIsolation: false, // 주의: 보안 취약점 가능성
    },
  });

  //브라우저창이 읽어 올 파일 위치
  win.loadFile("./index.html");
}

app.on("ready", createWindow);
