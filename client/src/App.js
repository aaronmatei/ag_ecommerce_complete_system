import React from 'react';
import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home'
import Layout from './components/layout';
import { ToastContainer } from "react-toastify"

//pages 
import Signin from './components/pages/auth/SignIn'
import Signup from './components/pages/auth/SignUp'
import Activate from './components/pages/auth/Activate';
import User_info from './components/pages/auth/User_info';
import EditProfileForm from './components/pages/auth/EditProfileForm';
import AllUsers from './components/pages/auth/AllUsers';
import ForgotPassword from './components/pages/auth/ForgotPassword';
import ResetPassword from './components/pages/auth/ResetPassword';



function App() {
  return (
    <div className="app-bar-main">
      <BrowserRouter>
        <Layout>
          <ToastContainer />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/users' component={AllUsers} />

            <Route exact path='/auth/activate/:token' component={Activate} />
            <Route exact path='/auth/user/user_info/:id' component={User_info} />
            <Route exact path='/auth/user/edit_profile/:id' component={EditProfileForm} />
            <Route exact path='/auth/user/forgot_password' component={ForgotPassword} />
            <Route exact path='/auth/user/reset_password/:token' component={ResetPassword} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
