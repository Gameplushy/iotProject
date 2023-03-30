import { useState } from 'react'
import './App.css'

function App() {
  const [script, setScript] = useState("")
  const [bluetoothDevice, setBluetoothDevice] = useState(null)

  function ConnectToBluetooth(){
    if (!('bluetooth' in navigator)) {
      $target.innerText = 'Bluetooth API not supported.';
      return;
    }
    Connect();
  }

function Connect() {
  navigator.bluetooth.requestDevice({filters :[{name : 'Decathlon Dual HR', services : ['00002a37-0000-1000-8000-00805f9b34fb']}]})
    .then(function (device) {
      console.log(device.gatt)
      setBlueetoothDevice(device.gatt.connect());
    })
    // .then(function (server) {
    //   console.log(server)
    //   return server.getPrimaryService('00002a37-0000-1000-8000-00805f9b34fb');
    // })
    // .then(function (service) {
    //   console.log(service)
    //   return service.getCharacteristic('4af9208bab88');
    // })
    // .then(function (characteristic) {
    //   return characteristic.readValue();
    // })
    // .then(function (value) {
    //   changeRes('Battery percentage is ' + value.getUint8(0) + '.');
    // })
    // .catch(function (error) {
    //   changeRes(error.message);
    //   // setTimeout(() => {
    //   //   changeRes("")
    //   // }, 3000);
    // });
}

// // A function that will be called once got characteristics
// function gotCharacteristics(error, characteristics) {
//   if (error || !characteristics){
//     console.log("error: ", error);
//     return;
//   } 
//   console.log("characteristics: ", characteristics);
//   myCharacteristic = characteristics['4af9208bab88'];
//   // Read the value of the first characteristic
//   myBLE.read(myCharacteristic, gotValue);
// }

// // A function that will be called once got values
// function gotValue(error, value) {
//   if (error) console.log("error: ", error);
//   console.log("value: ", value);
//   myValue = value;
//   // After getting a value, call p5ble.read() again to get the value again
//   myBLE.read(myCharacteristic, gotValue);
// }

  function SendScript(){
    if(!bluetoothDevice){
      alert("No Bluetooth device connected")
      return;
    }
  }

  return (
    <div className="App">
      <div><button onClick={ConnectToBluetooth}>Connect to Bluetooth</button></div>
      <div><textarea value={script} onChange={e=>setScript(e.target.value)} cols="20" rows="20"></textarea></div>
      <div><button onClick={SendScript}>Send</button></div>
    </div>
  )
}

export default App
