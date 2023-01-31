import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import './base.css';
import Home from './home';
import Register from './register';
import Login from './login';
import AdminEvent from './admin_event';
import StudentEvent from './student_event';
import AdminPrizes from './admin_prizes';
import StudentPrizes from './student_prizes';
import AdminDashboard from './admin_dashboard';
import PopupMain from './popups/popup_main';

const root = ReactDOM.createRoot(document.getElementById('root'));
function App() {

  function isNotEmpty(obj) {
    return Object.keys(obj).length !== 0;
  }

  const [auth] = useState(() => localStorage.getItem('user') !== null);
  const [user] = useState(localStorage.getItem('user'));
  const [userData, setUserData] = useState({});
  const [admin] = useState(localStorage.getItem('admin') == 'true' ? true : false );
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`/get/user?id=${user}&admin=${admin}`)
      .then(res => res.json())
      .then(data => {
        setUserData(data.user);
      });
    }
  }, []);

  function logIn(new_user) {
    localStorage.setItem('user', new_user['user_id']);
    if (new_user['admin']) {
      localStorage.setItem('admin', true);
    }
    else {
      localStorage.setItem('admin', false);
    }
    window.location.reload();
  } 

  function logOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    window.location.reload();
  }

  const removePopup = () => {
    setShowPopup(false);
  };

  const openPopup = (type) => {
    setShowPopup(true);
    setPopupType(type);
  };

  function getEvent() {
    return(admin ? <AdminEvent user={user} admin={admin} /> : <StudentEvent user={user} admin={admin}/>)
  }

  function getPrizes() {
    return(admin ? <AdminPrizes user={user} admin={admin} /> : <StudentPrizes user={user} admin={admin}/>)
  }
  return (
  <React.StrictMode>
    <div className="drawer" data-theme="">
        {showPopup && <PopupMain type={popupType} remove={removePopup} />}
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
        <div className="drawer-content flex flex-col">
          <div className="w-full navbar bg-primary">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </label>
            </div> 
            <div className="flex-1 px-2 mx-2">
              <a className="btn btn-ghost normal-case text-2xl text-white" href='/'>EventPrizer</a>
            </div>
            <div className="flex-none hidden lg:block text-white">
              <ul className="menu menu-horizontal px-1">
                <li><a href='/events'>Events</a></li>
                <li><a href='/prizes'>Prizes</a></li>
                {admin ? <li><a href='/dashboard'>Dashboard</a></li> : (user && <li onClick={() => openPopup(['student', user])}><a>Profile</a></li>)}
                {!auth && (
                  <li className='ml-3'>
                    <a className="btn btn-outline btn-ghost" href='/login'>Login</a>
                  </li>
                )}
              </ul>
            </div>
            {auth && (
              <div className="dropdown dropdown-end ml-3">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://placeimg.com/80/80/people" />
                  </div>
                </label>
                <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 text-base-content rounded-box w-52 flex-col">
                  <li>
                    <a className='pointer-events-none font-bold text-md'>
                      Welcome, {isNotEmpty(userData) && userData.name}!
                    </a>
                  </li>
                  <li><button type='button' onClick={() => logOut()}>Logout</button></li>
                </ul>
              </div>
            )}
          </div>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/register' element={auth ? <Navigate to='/events' /> : <Register login={logIn} />}/>
              <Route path='/login' element={auth ? <Navigate to='/events' /> : <Login login={logIn} />}/>
              <Route path='/events' element={auth ? getEvent() : <Navigate to='/register' state={'account'}/>}/>
              <Route path='/prizes' element={auth ? getPrizes() : <Navigate to='/register' state={'account'} />}/>
              <Route path='/dashboard' element={admin ? <AdminDashboard admin_id={user} /> : <Navigate to='/register' state={'admin'} />}/>
            </Routes>
          </BrowserRouter>
        </div> 
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label> 
          <ul className="menu p-4 w-80 bg-base-100">
            <li><a>Sidebar Item 1</a></li>
            <li><a>Sidebar Item 2</a></li>
          </ul>
        </div>
    </div>
  </React.StrictMode>
  )
};

root.render(<App/>)