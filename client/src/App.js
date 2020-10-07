import React from 'react';
import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar'
import Home from './components/Home'
import Layout from './components/layout';

//pages 
import Signin from './components/pages/auth/SignIn'
import Signup from './components/pages/auth/SignUp'
import Activate from './components/pages/auth/Activate';



function App() {
  return (
    <div className="app-bar-main">
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/signup' component={Signup} />
            <Route exact path='/signin' component={Signin} />
            <Route exact path='/auth/activate/:token' component={Activate} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
