import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UserHomePage from './components/UserHome';
import { useEffect, useState } from 'react';
import AdminHome from './components/AdminHome';
import UserDetails from './components/UserDetails';
import EditProfilePage from './components/EditUser';
import ProtectedRoute from './protect/ProtectedRoute';
import AdminProtect from './protect/AdminProtect';

function App() {

  return (
    <BrowserRouter >

      <Header />
      <Routes>
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Login />} />

        <Route path='/userhome' element={
          <ProtectedRoute>
            <UserHomePage />
          </ProtectedRoute>
        } />

        <Route path="/edit-page" element={
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        } />

        <Route path='/adminhome' element={
          <AdminProtect>
            <AdminHome />
          </AdminProtect>

        } />
        <Route path="/admin/user/:userId" element={
          <AdminProtect>
            <UserDetails />
          </AdminProtect>
        } />



      </Routes>

    </BrowserRouter>
  );
}

export default App;
