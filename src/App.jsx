import { useState } from 'react'
import './App.css'

function App() {
  const [script, setScript] = useState("")
  const [bluetoothDevice, setBluetoothDevice] = useState(null)
  const [ledToggler1,toggleLed1] = useState("")
  const [ledToggler2,toggleLed2] = useState("")
  const [ledToggler3,toggleLed3] = useState("")

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
    // if(!bluetoothDevice){
    //   alert("No Bluetooth device connected")
    //   return;
    // }
    if(!script)
      return;
    console.log(script)
    var verif = script.match(/^[1-3] \d+ \d+$/gim)
    var size = script.split(/\r\n|\r|\n/)
    if(!verif || verif.length != size.length){
      alert("Bad parsing. Each line must be \"[LED ID] [START TIME] [END TIME]\"")
      return;
    }
    var oneline = script.replaceAll(/\r\n|\r|\n/g,";")
    console.log(oneline)
    Flash()
    //ENVOYER ONELINE
  }

  function Flash(){
    var flashFunctions = [toggleLed1,toggleLed2,toggleLed3]
    script.split(/\r\n|\r|\n/).forEach(flash=>{
      var flashArray = flash.split(" ");
      setTimeout(() => {
        flashFunctions[flashArray[0]-1]("ledon");
        setTimeout(() => {
          flashFunctions[flashArray[0]-1]("");
        }, flashArray[2]-flashArray[1]);
      }, flashArray[1]);
    })
  }

  return (
    <div className="App">
      <div><button onClick={ConnectToBluetooth}>Connect to Bluetooth</button></div>
      <div><textarea value={script} onChange={e=>setScript(e.target.value)} cols="20" rows="20"></textarea></div>
      <div id="ledrow">
        <span className={"led "+ledToggler1}>1</span>
        <span className={"led "+ledToggler2}>2</span>
        <span className={"led "+ledToggler3}>3</span>
      </div>
      <div><button onClick={SendScript}>Send</button></div>
    </div>
  )
}

export default App
