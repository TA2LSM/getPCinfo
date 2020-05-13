// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
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

let ramSlots = [
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
const memory = { ramSlots, totalMax: '', installed: '', freeMemory: '' };

const motherboard = {
  manufacturer: '',
  model: '',
  revision: '',
  serialNumber: '',
  biosManufacturer: '',
  biosModel: '',
  biosVersion: '',
  usedRamSockets: '',
  //ramAvailableSockets: '',
};

const os = {
  name: '',
  architecture: '',
  buildNumber: '',
  serialNumber: '',
  skuNumber: '',
  uuid: '',
  installedDate: '',
  domain: '',
  computerName: '',
};

const infoPack = {
  motherboard,
  cpu,
  memory,
  os,
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
const getCpuInfo = async () => {
  return new Promise((resolve, reject) => {
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

      resolve('success');
    });
  });
};

//--- MOTHERBOARD -----------------------------------------------------
const getMotherboardInfo = async () => {
  return new Promise((resolve, reject) => {
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
      infoPack.motherboard.usedRamSockets = JSON.parse(JSON.stringify(data));
      infoPack.motherboard.usedRamSockets = findSubStr(infoPack.motherboard.usedRamSockets);

      resolve('success');
    });
  });
};

//--- RAM -------------------------------------------------------------
const getRamChipinfo = () => {
  return new Promise((resolve, reject) => {
    let ramChipData = [];
    let ramDataObjArr = [];
    let i, temp;

    cmd.get('wmic memphysical get MaxCapacity/value', (err, data, stderr) => {
      infoPack.memory.totalMax = JSON.parse(JSON.stringify(data));
      infoPack.memory.totalMax = findSubStr(infoPack.memory.totalMax);

      temp = (Number(infoPack.memory.totalMax) / 1048576).toFixed(2);
      infoPack.memory.totalMax = String(temp + ' GB');
    });

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

        let ramChipDataObj = {};

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
      for (i = 0; i < Number(infoPack.motherboard.usedRamSockets); ++i) {
        temp = (Number(ramDataObjArr[i].Capacity) / 1073741824).toFixed(2); //Bytes to Gigabytes
        temp = String(temp + ' GB');

        infoPack.memory.ramSlots.push({
          slotNo: ramDataObjArr[i].BankLabel,
          deviceLocator: ramDataObjArr[i].DeviceLocator,
          manufacturer: ramDataObjArr[i].Manufacturer,
          model: ramDataObjArr[i].PartNumber,
          capacity: temp,
          configuratedVoltage: ramDataObjArr[i].ConfiguredVoltage + ' mV',
          configuratedClkSpeed: ramDataObjArr[i].ConfiguredClockSpeed + ' Mhz',
          activeClkSpeed: ramDataObjArr[i].Speed + ' Mhz',
        });
      }

      //console.log(infoPack.memory.ramSlots);

      resolve('success');
    });
  });
};

const getFreeMemory = () => {
  return new Promise((resolve, reject) => {
    cmd.get('wmic os get FreePhysicalMemory/value', (err, data, stderr) => {
      infoPack.memory.freeMemory = JSON.parse(JSON.stringify(data));
      infoPack.memory.freeMemory = findSubStr(infoPack.memory.freeMemory);

      temp = (Number(infoPack.memory.freeMemory) / 1048576).toFixed(2);
      infoPack.memory.freeMemory = String(temp + ' GB');

      resolve('success');
    });
  });
};

const getMemoryInfo = async () => {
  let i, temp;

  try {
    await getRamChipinfo();
    await getFreeMemory();

    temp = 0;
    for (i = 0; i < Number(infoPack.motherboard.usedRamSockets); ++i) {
      temp += Number(infoPack.memory.ramSlots[i].capacity.replace(' GB', ''));
    }

    temp = temp.toFixed(2);
    infoPack.memory.installed = String(temp + ' GB');
    //console.log(infoPack.memory.installed);
  } catch (err) {
    console.log('Error: ', err);
  }
};

//--- OS --------------------------------------------------------------
const getOSInfo = () => {
  return new Promise((resolve, reject) => {
    let temp;

    cmd.get('wmic os get Caption/value', (err, data, stderr) => {
      infoPack.os.name = JSON.parse(JSON.stringify(data));
      infoPack.os.name = findSubStr(infoPack.os.name);
    });
    cmd.get('wmic os get OSArchitecture/value', (err, data, stderr) => {
      infoPack.os.architecture = JSON.parse(JSON.stringify(data));
      infoPack.os.architecture = findSubStr(infoPack.os.architecture);
    });
    cmd.get('wmic os get Buildnumber/value', (err, data, stderr) => {
      infoPack.os.buildNumber = JSON.parse(JSON.stringify(data));
      infoPack.os.buildNumber = findSubStr(infoPack.os.buildNumber);
    });
    cmd.get('wmic os get SerialNumber/value', (err, data, stderr) => {
      infoPack.os.serialNumber = JSON.parse(JSON.stringify(data));
      infoPack.os.serialNumber = findSubStr(infoPack.os.serialNumber);
    });
    cmd.get('wmic os get InstallDate/value', (err, data, stderr) => {
      temp = JSON.parse(JSON.stringify(data));
      temp = findSubStr(temp);

      infoPack.os.installedDate = temp.slice(6, 8);
      infoPack.os.installedDate += '.' + temp.slice(4, 6);
      infoPack.os.installedDate += '.' + temp.slice(0, 4);
      infoPack.os.installedDate +=
        ' / ' + temp.slice(8, 10) + ':' + temp.slice(10, 12) + '.' + temp.slice(12, 14);
    });
    cmd.get('wmic csproduct get SKUNumber/value', (err, data, stderr) => {
      infoPack.os.skuNumber = JSON.parse(JSON.stringify(data));
      infoPack.os.skuNumber = findSubStr(infoPack.os.skuNumber);
    });
    cmd.get('wmic csproduct get UUID/value', (err, data, stderr) => {
      infoPack.os.uuid = JSON.parse(JSON.stringify(data));
      infoPack.os.uuid = findSubStr(infoPack.os.uuid);
    });
    cmd.get('wmic computersystem get domain/value', (err, data, stderr) => {
      infoPack.os.domain = JSON.parse(JSON.stringify(data));
      infoPack.os.domain = findSubStr(infoPack.os.domain);
    });
    cmd.get('wmic os get CSName/value', (err, data, stderr) => {
      infoPack.os.computerName = JSON.parse(JSON.stringify(data));
      infoPack.os.computerName = findSubStr(infoPack.os.computerName);
    });
    cmd.get('wmic computersystem get UserName/value', (err, data, stderr) => {
      infoPack.os.userName = JSON.parse(JSON.stringify(data));
      infoPack.os.userName = findSubStr(infoPack.os.userName).replace(
        infoPack.os.computerName + '\\',
        ''
      );

      resolve('success');
    });
  });
};

//---------------------------------------------------------------------
const startProcess = async () => {
  console.log('Initializing please wait...');

  try {
    await getCpuInfo();
    await getOSInfo();
    await getMotherboardInfo();
    await getMemoryInfo();

    //console.log(infoPack);
    //console.log(infoPack.memory.ramSlots);
    //console.log(infoPack.memory.totalMax);

    setInterval(() => {
      getFreeMemory();
      console.log('Free RAM: ', infoPack.memory.freeMemory);
      //event.reply('dynamicSystemInfoNeeded', infoPack.memory);
    }, 1000);
    //---------------------------------------------------------------
  } catch (err) {
    console.log('Error: ', err);
  }
};

startProcess();

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

//--- Monitoring Codes -----------------------------------------------
ipcMain.on('processStarted', (event, arg) => {
  event.reply('cpuInfoNeeded', infoPack.cpu);
  event.reply('motherboardInfoNeeded', infoPack.motherboard);
  event.reply('memoryInfoNeeded', infoPack.memory);
  event.reply('osInfoNeeded', infoPack.os);
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
