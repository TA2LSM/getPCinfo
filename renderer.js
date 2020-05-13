// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron');

let cnt = 0;
//
document.getElementById('startBtn').onclick = () => {
  //   setInterval(() => {
  //     document.getElementById("counter").innerText = cnt++;
  //     console.log(cnt);
  //   }, 1000);

  //console.log('Process started...');
  ipcRenderer.send('processStarted', 'ping');

  //ipcRenderer.send('cpuInfoNeeded', 'ping');
  //ipcRenderer.send('motherboardInfoNeeded', 'ping');
  //ipcRenderer.send('memoryInfoNeeded', 'ping');
  //ipcRenderer.send('osInfoNeeded', 'ping');
};

ipcRenderer.on('cpuInfoNeeded', (event, arg) => {
  document.getElementById('t_cpuName').innerText = arg.name;
  document.getElementById('t_cpuL2CacheSize').innerText = arg.L2CacheSize;
  document.getElementById('t_cpuL3CacheSize').innerText = arg.L3CacheSize;
  document.getElementById('t_cpuNumberOfCores').innerText = arg.numOfCores;
  document.getElementById('t_cpuEnabledCores').innerText = arg.enabledCores;
  document.getElementById('t_cpuLogicalProcessors').innerText = arg.logicalProcessors;
  document.getElementById('t_cpuThreads').innerText = arg.threads;
  document.getElementById('t_cpuSocketType').innerText = arg.socketType;
});

ipcRenderer.on('motherboardInfoNeeded', (event, arg) => {
  document.getElementById('t_mbManufacturer').innerText = arg.manufacturer;
  document.getElementById('t_mbModel').innerText = arg.model;
  document.getElementById('t_mbRevision').innerText = arg.revision;
  document.getElementById('t_mbSerialNumber').innerText = arg.serialNumber;
  document.getElementById('t_mbBiosManufacturer').innerText = arg.biosManufacturer;
  document.getElementById('t_mbBiosModel').innerText = arg.biosModel;
  document.getElementById('t_mbBiosVersion').innerText = arg.biosVersion;
  document.getElementById('t_mbUsedRamSockets').innerText = arg.usedRamSockets;
});

ipcRenderer.on('memoryInfoNeeded', (event, arg) => {
  document.getElementById('t_memTotalMax').innerText = arg.totalMax;
  document.getElementById('t_memInstalled').innerText = arg.installed;

  // could change every moments so must be shown dynamic
  document.getElementById('t_memFree').innerText = arg.freeMemory;

  //how to add all slot's of ram infor here?
});

ipcRenderer.on('memoryFreeInfoNeeded', (event, arg) => {
  // could change every moments so must be shown dynamic
  document.getElementById('t_memFree').innerText = arg.freeMemory;
});

ipcRenderer.on('osInfoNeeded', (event, arg) => {
  document.getElementById('t_osName').innerText = arg.name;
  document.getElementById('t_osArchitecture').innerText = arg.architecture;
  document.getElementById('t_osBuildNumber').innerText = arg.buildNumber;
  document.getElementById('t_osSerialNumber').innerText = arg.serialNumber;
  document.getElementById('t_osSkuNumber').innerText = arg.skuNumber;
  document.getElementById('t_osUuid').innerText = arg.uuid;
  document.getElementById('t_osInstalledDate').innerText = arg.installedDate;
  document.getElementById('t_osDomain').innerText = arg.domain;
  document.getElementById('t_osComputerName').innerText = arg.computerName;
});
