import { useState } from 'react'
import './App.css'
import { Buffer } from 'buffer'

function App() {
  const [script, setScript] = useState("")
  const [bluetoothDevice, setBluetoothDevice] = useState(null)
  const [ledToggler1, toggleLed1] = useState("")
  const [ledToggler2, toggleLed2] = useState("")
  const [ledToggler3, toggleLed3] = useState("")

  const [ganttSpans,setSpans] = useState([])

  function ConnectToBluetooth(){
    if (!('bluetooth' in navigator)) {
      $target.innerText = 'Bluetooth API not supported.';
      return;
    }
    Connect();
  }

  function Connect() {
    navigator.bluetooth.requestDevice({ filters: [{ name: 'ESP_group_666' }], optionalServices: ["4fafc201-1fb5-459e-8fcc-c5c9c331914b", "beb5483e-36e1-4688-b7f5-ea07361b26a8"] })
      .then(function (device) {
        console.log(device.gatt)
        /*setBluetoothDevice(*/device.gatt.connect()
          .then(async (res) => {
            return await res?.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
          }).then(async (res) => {
            return await res?.getCharacteristic("beb5483e-36e1-4688-b7f5-ea07361b26a8")
          }).then(res => setBluetoothDevice(res));
      })
      .catch((err) => {
        console.log('an error occured : ' + err.message)
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

  async function SendScript() {
    if (!bluetoothDevice) {
      alert("No Bluetooth device connected")
      return;
    }
    if (!script)
      return;
    var verif = script.match(/^[1-3] \d+ \d+$/gim)
    var size = script.split(/\r\n|\r|\n/)
    if (!verif || verif.length != size.length) {
      alert("Bad parsing. Each line must be \"[LED ID] [START TIME] [END TIME]\"")
      return;
    }
    if(size.length>50){
      alert("Max limit hit (50)")
      return;
    }
    var oneline = script.replaceAll(/\r\n|\r|\n/g,";")
    console.log(oneline)
    Flash()
    Gantt()
    //ENVOYER ONELINE
    console.log(bluetoothDevice)
    /*const service = await bluetoothDevice?.getPrimaryService("4fafc201-1fb5-459e-8fcc-c5c9c331914b")
    const characteristic = await service.getCharacteristic("beb5483e-36e1-4688-b7f5-ea07361b26a8")*/
    console.log(Buffer.from(oneline, 'utf-8'))
    bluetoothDevice.writeValue(Buffer.from(oneline, 'utf-8'))
  }

  function Flash() {
    var flashFunctions = [toggleLed1, toggleLed2, toggleLed3]
    var numberOfFlashAsks = [0, 0, 0]
    script.split(/\r\n|\r|\n/).forEach(flash => {
      var flashArray = flash.split(" ");
      flashArray[0] = flashArray[0] - 1
      setTimeout(() => {
        numberOfFlashAsks[flashArray[0]]++
        if (numberOfFlashAsks[flashArray[0]] == 1) flashFunctions[flashArray[0]]("ledon");
        setTimeout(() => {
          numberOfFlashAsks[flashArray[0]]--
          if (numberOfFlashAsks[flashArray[0]] == 0) flashFunctions[flashArray[0]]("");
        }, flashArray[2] - flashArray[1]);
      }, flashArray[1]);
    })
  }

  function Gantt(){
    setSpans([])
    var commands = script.split(/\r\n|\r|\n/)
    var endTime = Math.max(...commands.map(t=>parseInt(t.split(" ")[2])))
    commands.forEach(cmd => {
      var value = {top: 0, left: 0, size: 0};
      cmd = cmd.split(" ")
      value.top = ((cmd[0])-1)*(100/3)
      value.left = (((cmd[1])/endTime)*100)
      value.size = (((cmd[2]-cmd[1])/endTime)*100)
      //var value = "{top : "+top+"%; left : "+left+"%; width : "+size+"%}"
      setSpans(ganttSpans=>[...ganttSpans,value])
    })
  }

  return (
    <div className="App">
      <div><button onClick={ConnectToBluetooth}>Connect to Bluetooth</button></div>
      <div><textarea value={script} onChange={e => setScript(e.target.value)} cols="20" rows="20"></textarea></div>
      <div id="ledrow">
        <span className={"led " + ledToggler1}>1</span>
        <span className={"led " + ledToggler2}>2</span>
        <span className={"led " + ledToggler3}>3</span>
      </div>
      <div id="ganttContainer">
        {ganttSpans.length!=0 ? ganttSpans.map(s=><span className='ganttBar' style={{'top': s.top+'%', 'left': s.left+'%', 'width': s.size+'%'}}></span>) : ""}
      </div>
      <div><button onClick={SendScript}>Send</button></div>
    </div>
  )
}

export default App