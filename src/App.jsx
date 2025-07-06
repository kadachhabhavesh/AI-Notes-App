import { useState } from 'react'
import './App.css'
// import Calculator from './Calculator'
import Calculator from './Calculator1'
import HomePage from './Pages/Home'


function App() {
  const [count, setCount] = useState(0)

  return <HomePage />
}

export default App
