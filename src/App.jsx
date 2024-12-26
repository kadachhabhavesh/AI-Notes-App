import { useState } from 'react'
import './App.css'
// import Calculator from './Calculator'
import Calculator from './Calculator1'


function App() {
  const [count, setCount] = useState(0)

  return <Calculator />
}

export default App
