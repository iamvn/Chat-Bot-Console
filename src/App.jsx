import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/login/login'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Main from './components/main/main'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='login' element={<Login/>}/>
        <Route path='home' element={<Main/>}/>
        <Route path='*' element={<Navigate to="login" replace/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
