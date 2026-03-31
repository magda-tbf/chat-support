import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Admin from './Admin';
import Signup from './Signup';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        {/* Default ruta: kada se otvori "/" idemo na Signup */}
        <Route path="/" exact>
          <Signup />
        </Route>

        {/* Customer login/chat */}
        <Route path="/login" exact>
          <Login />
        </Route>

        {/* Admin chat */}
        <Route path="/admin" exact>
          <Admin />
        </Route>

        {/* Sve ostalo redirect na "/" */}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();