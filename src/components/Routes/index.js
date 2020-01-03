import React from 'react';
import Home from '../Home/index';
import AppBar from '../AppBar/index';
import Summon from '../Summon';
import BannerContainer from '../BannerContainer/index';
import PoolContainer from '../PoolContainer/index';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import constants from './../../constants';

export default function Routes() {
    return <>
        <Router>
            <AppBar />
            <Switch>
                <Route path={constants.HOME} exact component={Home}></Route>
                <Route path={constants.SUMMON} component={Summon}></Route>
                <Route path={constants.TOPPULLS} exact></Route>
                <Route path={`${constants.ADMIN}/pool`} exact component={PoolContainer}></Route>
                <Route path={`${constants.ADMIN}/banner`} exact component={BannerContainer}></Route>
            </Switch>
        </Router>
    </>
}