import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import UserHomePage from './components/UserHome';
import { useEffect, useState } from 'react';
import AdminHome from './components/AdminHome';
import UserDetails from './components/UserDetails';
import EditProfilePage from './components/EditUser';

function App() {

  return (
    <BrowserRouter >

      <Header/>
    <Routes>
      <Route path='/signup' element={<Signup/>} />
      <Route path='/' element={<Login/>} />
      <Route path='/userhome' element={<UserHomePage  />} />
      <Route path='/adminhome' element={<AdminHome  />} />
      <Route path="/admin/user/:userId" element={<UserDetails />} />
      <Route path="/edit-page" element={<EditProfilePage />} />


      
    </Routes>
     
    </BrowserRouter>
  );
}

export default App;
