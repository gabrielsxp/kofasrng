import React from 'react';
import Home from '../Home/index';
import AppBar from '../AppBar/index';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import constants from './../../contants';

export default function Routes() {
    return <>
        <Router>
            <AppBar />
            <Switch>
                <Route path={constants.HOME} exact component={Home}></Route>
                <Route path={constants.SUMMON} exact></Route>
                <Route path={constants.TOPPULLS} exact></Route>
            </Switch>
        </Router>
    </>
}