// Modules to control application life and create native browser window
//const { app, BrowserWindow, ipcMain } = require('electron');
//const path = require('path');
const cmd = require('node-cmd');

const cpu = {
  name: '',
  L2CacheSize: '',
  L3CacheSize: '',
  numOfCores: '',
  enabledCores: '',
  logicalProcessors: '',
  threads: '',
  socketType: '',
};

let ram = [
  // {
  //   slotNo: '',
  //   deviceLocator: '',
  //   manufacturer: '',
  //   model: '',
  //   capacity: '',
  //   configuratedVoltage: '',
  //   configuratedClkSpeed: '',
  //   activeClkSpeed: '',
  // },
];
const memory = { ram, totalMax: '', totalUsedMemSlots: '' };

const motherboard = {
  manufacturer: '',
  model: '',
  revision: '',
  serialNumber: '',
  biosManufacturer: '',
  biosModel: '',
  biosVersion: '',
  ramUsedSockets: '',
  //ramAvailableSockets: '',
};

const os = {
  name: '',
  buildNumber: '',
  serialNumber: '',
  skuNumber: '',
  uuid: '',
  installedDate: '',
  domain: '',
};

const infoPack = {
  cpu,
  memory,
  motherboard,
  os,
  userName: '',
};

/*
const delayMs = (ms) => {
  return new Promise((resolve, reject) => {
    if (ms >= 0)
      setTimeout(() => {
        //resolve("delay result");
        resolve(ms);
        console.log('Timeout!');
      }, ms);
    else reject(new Error('Input parameter Error'));
  });
};
*/

function findSubStr(myStr) {
  let idx;

  idx = myStr.indexOf('=');
  myStr = myStr.slice(idx + 1);

  idx = myStr.indexOf('\r');
  return myStr.slice(0, idx);
}

/*
function splitLines(t) {
  return t.split(/\r\n|\r|\n/);
}
*/

//--- CPU -------------------------------------------------------------
function getCpuInfo() {
  cmd.get('wmic cpu get name/value', (err, data, stderr) => {
    infoPack.cpu.name = JSON.parse(JSON.stringify(data));
    infoPack.cpu.name = findSubStr(infoPack.cpu.name);
  });
  cmd.get('wmic cpu get L2CacheSize/value', (err, data, stderr) => {
    infoPack.cpu.L2CacheSize = JSON.parse(JSON.stringify(data));
    infoPack.cpu.L2CacheSize = findSubStr(infoPack.cpu.L2CacheSize);
    infoPack.cpu.L2CacheSize += ' KB';
  });
  cmd.get('wmic cpu get L3CacheSize/value', (err, data, stderr) => {
    infoPack.cpu.L3CacheSize = JSON.parse(JSON.stringify(data));
    infoPack.cpu.L3CacheSize = findSubStr(infoPack.cpu.L3CacheSize);
    infoPack.cpu.L3CacheSize += ' KB';
  });
  cmd.get('wmic cpu get NumberOfCores/value', (err, data, stderr) => {
    infoPack.cpu.numOfCores = JSON.parse(JSON.stringify(data));
    infoPack.cpu.numOfCores = findSubStr(infoPack.cpu.numOfCores);
  });
  cmd.get('wmic cpu get NumberOfEnabledCore/value', (err, data, stderr) => {
    infoPack.cpu.enabledCores = JSON.parse(JSON.stringify(data));
    infoPack.cpu.enabledCores = findSubStr(infoPack.cpu.enabledCores);
  });
  cmd.get('wmic cpu get NumberOfLogicalProcessors/value', (err, data, stderr) => {
    infoPack.cpu.logicalProcessors = JSON.parse(JSON.stringify(data));
    infoPack.cpu.logicalProcessors = findSubStr(infoPack.cpu.logicalProcessors);
  });
  cmd.get('wmic cpu get ThreadCount/value', (err, data, stderr) => {
    infoPack.cpu.threads = JSON.parse(JSON.stringify(data));
    infoPack.cpu.threads = findSubStr(infoPack.cpu.threads);
  });
  cmd.get('wmic cpu get SocketDesignation/value', (err, data, stderr) => {
    infoPack.cpu.socketType = JSON.parse(JSON.stringify(data));
    infoPack.cpu.socketType = findSubStr(infoPack.cpu.socketType);
  });
}

//--- MOTHERBOARD -----------------------------------------------------
function getMotherboardInfo() {
  cmd.get('wmic baseboard get Manufacturer/value', (err, data, stderr) => {
    infoPack.motherboard.manufacturer = JSON.parse(JSON.stringify(data));
    infoPack.motherboard.manufacturer = findSubStr(infoPack.motherboard.manufacturer);
  });
  cmd.get('wmic baseboard get Product/value', (err, data, stderr) => {
    infoPack.motherboard.model = JSON.parse(JSON.stringify(data));
    infoPack.motherboard.model = findSubStr(infoPack.motherboard.model);
  });
  cmd.get('wmic baseboard get Version/value', (err, data, stderr) => {
    infoPack.motherboard.revision = JSON.parse(JSON.stringify(data));
    infoPack.motherboard.revision = findSubStr(infoPack.motherboard.revision);
  });
  cmd.get('wmic baseboard get SerialNumber/value', (err, data, stderr) => {
    infoPack.motherboard.serialNumber = JSON.parse(JSON.stringify(data));
    infoPack.motherboard.serialNumber = findSubStr(infoPack.motherboard.serialNumber);
  });
  cmd.get('wmic bios get manufacturer/value', (err, data, stderr) => {
    infoPack.motherboard.biosManufacturer = JSON.parse(JSON.stringify(data));
    infoPack.motherboard.biosManufacturer = findSubStr(infoPack.motherboard.biosManufacturer);
  });
  cmd.get('wmic bios get version/value', (err, data, stderr) => {
    infoPack.motherboard.biosModel = JSON.parse(JSON.stringify(data));
    infoPack.motherboard.biosModel = findSubStr(infoPack.motherboard.biosModel);
  });
  cmd.get('wmic bios get caption/value', (err, data, stderr) => {
    infoPack.motherboard.biosVersion = JSON.parse(JSON.stringify(data));
    infoPack.motherboard.biosVersion = findSubStr(infoPack.motherboard.biosVersion);
  });
  cmd.get('wmic memphysical get MemoryDevices/value', (err, data, stderr) => {
    infoPack.motherboard.ramUsedSockets = JSON.parse(JSON.stringify(data));
    infoPack.motherboard.ramUsedSockets = findSubStr(infoPack.motherboard.ramUsedSockets);
  });
}
//--- RAM -------------------------------------------------------------
function getRamChipinfo() {
  let ramChipData = [];
  let ramDataObjArr = [];
  let ramChipDataObj = {};

  cmd.get('wmic memorychip get /Format: list', (err, data, stderr) => {
    ramChipData = data.split('Attributes=');
    //ramChipData = "Attributes=" hariç sonrasındaki herşeyi bir sonraki "Attributes="e kadar alıp
    //yeni dizi yaptık

    ramChipData = ramChipData.map((el) => 'Attributes=' + el);
    //ramChipData'nın her elemanının başına sildiğimiz "Attributes=" ifadesini ekledik

    ramChipData = ramChipData.slice(1);
    //ramChipData[0] çöp veri idi onu kesip attık

    //console.log('ramChipData: ', ramChipData[1]);
    //ramChipData içindeki elemanları tek tek item içine al ve işlem yap
    ramChipData.forEach((item) => {
      item = item.split('\n');
      //ramChipData içindeki verileri satır satır böldük

      // boşluk, \r \n vs götürür (baştan ve sondan)
      //alt iki kod birbirinin aynısı (tek satırda fonksiyon gibi return vs gerek yok)
      // boşluk, \r \n vs götürür (baştan ve sondan)
      item = item.map((el) => el.trim());
      /*
      item = item.map((el) => {
        return el.trim();
      });
      */

      //alt iki kod birbirinin aynısı (tek satırda fonksiyon gibi return vs gerek yok)
      //el (element) değeri boş değilse yeni diziye döndürür, boşsa (undefined) döndürmez
      item = item.filter((el) => el);
      /*
      item = item.filter((el) => {
        return el;
      });
      */

      // item = [ "Attributes=2", ...... ]
      item.forEach((el) => {
        // el = "Attributes=2"
        el = el.split('=');
        // el = [ "Attribute", "2"]

        ramChipDataObj[el[0]] = el[1];
        //ramChipDataObj = { {Attribute: "2"}, {...} }
      });

      ramDataObjArr.push(ramChipDataObj);
    });

    //console.log(ramDataObjArr);

    let temp;

    for (i = 0; i < infoPack.motherboard.ramUsedSockets; ++i) {
      temp = Number(ramDataObjArr[i].Capacity) / 1073741824; //Bytes to Gigabytes
      temp = String(temp + ' GB');

      infoPack.memory.ram.push({
        slotNo: ramDataObjArr[i].BankLabel,
        deviceLocator: ramDataObjArr[i].DeviceLocator,
        manufacturer: ramDataObjArr[i].Manufacturer,
        model: ramDataObjArr[i].PartNumber,
        capacity: temp,
        configuratedVoltage: ramDataObjArr[i].ConfiguredVoltage,
        configuratedClkSpeed: ramDataObjArr[i].ConfiguredClockSpeed,
        activeClkSpeed: ramDataObjArr[i].Speed,
      });
    }
  });
}

getCpuInfo();
getMotherboardInfo();
getRamChipinfo();

setTimeout(() => {
  //console.log(infoPack);
  console.log(infoPack.memory.ram);
}, 1000);

/*
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on('parameter', (event, arg) => {
  // cmd.get("wmic cpu get caption", function (err, data, stderr) {
  //   console.log("parameter :\n\n", data);
  // });
  //console.log("HERE!");

  cmd.get('wmic cpu get caption', (err, data, stderr) => {
    infoPack.cpu.name = data;
    event.reply('parameter', infoPack.cpu.name);
  });
});
*/
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.