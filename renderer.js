// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require('electron');

document.getElementById('startBtn').onclick = () => {
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
  document.getElementById('t_ram0SlotNo').innerText = arg.ramSlots[0].slotNo + ' / ';
  document.getElementById('t_ram0Channel').innerText = arg.ramSlots[0].deviceLocator + ' / ';
  document.getElementById('t_ram0Manufacturer').innerText = arg.ramSlots[0].manufacturer + ' / ';
  document.getElementById('t_ram0Model').innerText = arg.ramSlots[0].model + ' / ';
  document.getElementById('t_ram0Capacity').innerText = arg.ramSlots[0].capacity + ' / ';
  document.getElementById('t_ram0ConfVoltage').innerText =
    arg.ramSlots[0].configuratedVoltage + ' / ';
  document.getElementById('t_ram0ConfSpeed').innerText =
    arg.ramSlots[0].configuratedClkSpeed + ' / ';
  document.getElementById('t_ram0ActSpeed').innerText = arg.ramSlots[0].activeClkSpeed;

  document.getElementById('t_ram1SlotNo').innerText = arg.ramSlots[1].slotNo + ' / ';
  document.getElementById('t_ram1Channel').innerText = arg.ramSlots[1].deviceLocator + ' / ';
  document.getElementById('t_ram1Manufacturer').innerText = arg.ramSlots[1].manufacturer + ' / ';
  document.getElementById('t_ram1Model').innerText = arg.ramSlots[1].model + ' / ';
  document.getElementById('t_ram1Capacity').innerText = arg.ramSlots[1].capacity + ' / ';
  document.getElementById('t_ram1ConfVoltage').innerText =
    arg.ramSlots[1].configuratedVoltage + ' / ';
  document.getElementById('t_ram1ConfSpeed').innerText =
    arg.ramSlots[1].configuratedClkSpeed + ' / ';
  document.getElementById('t_ram1ActSpeed').innerText = arg.ramSlots[1].activeClkSpeed;

  document.getElementById('t_ram2SlotNo').innerText = arg.ramSlots[2].slotNo + ' / ';
  document.getElementById('t_ram2Channel').innerText = arg.ramSlots[2].deviceLocator + ' / ';
  document.getElementById('t_ram2Manufacturer').innerText = arg.ramSlots[2].manufacturer + ' / ';
  document.getElementById('t_ram2Model').innerText = arg.ramSlots[2].model + ' / ';
  document.getElementById('t_ram2Capacity').innerText = arg.ramSlots[2].capacity + ' / ';
  document.getElementById('t_ram2ConfVoltage').innerText =
    arg.ramSlots[2].configuratedVoltage + ' / ';
  document.getElementById('t_ram2ConfSpeed').innerText =
    arg.ramSlots[2].configuratedClkSpeed + ' / ';
  document.getElementById('t_ram2ActSpeed').innerText = arg.ramSlots[2].activeClkSpeed;

  document.getElementById('t_ram3SlotNo').innerText = arg.ramSlots[3].slotNo + ' / ';
  document.getElementById('t_ram3Channel').innerText = arg.ramSlots[3].deviceLocator + ' / ';
  document.getElementById('t_ram3Manufacturer').innerText = arg.ramSlots[3].manufacturer + ' / ';
  document.getElementById('t_ram3Model').innerText = arg.ramSlots[3].model + ' / ';
  document.getElementById('t_ram3Capacity').innerText = arg.ramSlots[3].capacity + ' / ';
  document.getElementById('t_ram3ConfVoltage').innerText =
    arg.ramSlots[3].configuratedVoltage + ' / ';
  document.getElementById('t_ram3ConfSpeed').innerText =
    arg.ramSlots[3].configuratedClkSpeed + ' / ';
  document.getElementById('t_ram3ActSpeed').innerText = arg.ramSlots[3].activeClkSpeed;
});

// These values here could change every moments so must be shown dynamic
ipcRenderer.on('dynamicSystemInfoNeeded', (event, arg) => {
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

//--- Periodic update for dynamic variables ----------------
setInterval(() => {
  ipcRenderer.send('processContinue', 'ping');
}, 1000);
