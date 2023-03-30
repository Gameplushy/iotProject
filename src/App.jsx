import { useState } from 'react'
import './App.css'

function App() {
  const [script, setScript] = useState("")
  const [bluetoothDevice, setBluetoothDevice] = useState(null)

  function ConnectToBluetooth(){

  }

  function SendScript(){

  }

  return (
    <div className="App">
      <div><button onClick={ConnectToBluetooth}>Connect to Bluetooth</button></div>
      <div><textarea value={script} cols="20" rows="20"></textarea></div>
      <div><button onClick={SendScript}>Send</button></div>
    </div>
  )
}

export default App
