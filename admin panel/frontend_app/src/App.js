import './App.css';
import Header from './components/Header';
import Hello from './components/Hello'
import Login from './components/Login';
import Signup from './components/Signup';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import UserHomePage from './components/UserHome';
import { useEffect, useState } from 'react';
import AdminHome from './components/AdminHome';

function App() {

  // const [myData, setMyData] = useState([]);

  // // Retrieve data from localStorage on page load
  // useEffect(() => {
  //     const savedData = localStorage.getItem('myData');
  //     if (savedData) {
  //         setMyData(JSON.parse(savedData));
  //     }
  // }, []);

  // // Save data to localStorage whenever it changes
  // useEffect(() => {
  //     if (myData.length > 0) {
  //         localStorage.setItem('myData', JSON.stringify(myData));
  //     }
  // }, [myData]);

  return (
    <BrowserRouter >

      {/* <Hello/> */}
      <Header/>
    <Routes>
      <Route path='/signup' element={<Signup/>} />
      <Route path='/' element={<Login/>} />
      <Route path='/userhome' element={<UserHomePage  />} />
      <Route path='/admin' element={<AdminHome  />} />


      
    </Routes>
     
    </BrowserRouter>
  );
}

export default App;
