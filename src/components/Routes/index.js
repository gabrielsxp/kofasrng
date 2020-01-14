import React, { useEffect } from 'react';
import Home from '../Home/index';
import Summon from '../Summon/index';
import AppBar from '../AppBar/index';
import Banners from '../Banners/index';
import Stats from '../Stats/index';
import Dashboard from '../Dashboard/index';
import SignIn from '../SignIn/index';
import SignUp from '../SignUp/index';
import Privacy from '../Privacy/index';
import Pull from '../Pull/index';
import TierListMaker from '../TierListMaker/index';
import TierLists from '../TierLists/index';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import constants from './../../constants';
import { isAuthenticated } from '../../services/Auth/index';

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
        <Route path={constants.BANNERS} exact component={Banners}></Route>
        <Route path={constants.PULL} component={Pull}></Route>
        <Route path={constants.STATS} exact component={Stats}></Route>
        <Route path={constants.TIER_LIST_MAKER} component={TierListMaker}></Route>
        <Route path={constants.TIER_LISTS} exact component={TierLists}></Route>
        <Route path={constants.PRIVACY} exact>{Privacy}</Route>
        <PrivateRoute path={`${constants.ADMIN}`} exact component={Dashboard}></PrivateRoute>
        <Route path={`${constants.SIGN_IN}`} exact component={SignIn}></Route>
        <Route path={`${constants.SIGN_UP}`} exact component={SignUp}></Route>
      </Switch>
    </Router>
  </>
}