import React from 'react';
import Home from '../Home/index';
import AppBar from '../AppBar/index';
import Summon from '../Summon';
import BannerContainer from '../BannerContainer/index';
import PoolContainer from '../PoolContainer/index';
import Dashboard from '../Dashboard/index';
import SignIn from '../SignIn/index';
import SignUp from '../SignUp/index';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import constants from './../../constants';
import {isAuthenticated} from '../../services/Auth/index';

const PrivateRoute = ({ component: Component = null, render: Render = null, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          Render ? (
            Render(props)
          ) : Component ? (
            <Component {...props} />
          ) : null
        ) : (
            <Redirect to={{ pathname: constants.SIGN_IN, state: { from: props.location } }} />
          )
      }
    />
  );
  

export default function Routes() {
    return <>
        <Router>
            <AppBar />
            <Switch>
                <Route path={constants.HOME} exact component={Home}></Route>
                <Route path={constants.SUMMON} component={Summon}></Route>
                <Route path={constants.TOPPULLS} exact></Route>
                <PrivateRoute path={`${constants.ADMIN}`} exact component={Dashboard}></PrivateRoute>
                <PrivateRoute path={`${constants.ADMIN}/pool`} exact component={PoolContainer}></PrivateRoute>
                <PrivateRoute path={`${constants.ADMIN}/banner`} exact component={BannerContainer}></PrivateRoute>
                <Route path={`${constants.SIGN_IN}`} exact component={SignIn}></Route>
                <Route path={`${constants.SIGN_UP}`} exact component={SignUp}></Route>
            </Switch>
        </Router>
    </>
}