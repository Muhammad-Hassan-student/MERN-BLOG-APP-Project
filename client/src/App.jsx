import { Button } from 'flowbite-react'
import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Header from './components/Header'
import FooterComponent from './components/FooterComponent'
import PrivateRoutes from './components/PrivateRoutes'


function App() {
 

  return (
    <>
        <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/projects' element={<Projects/>}/> 
          <Route element={<PrivateRoutes/>}>
          <Route path='/dashboard' element={<Dashboard/>}/>

          </Route>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/sign-in' element={<SignIn/>}/>
        </Routes>
        <FooterComponent/>
        </BrowserRouter>
    </>
  )
}

export default App
