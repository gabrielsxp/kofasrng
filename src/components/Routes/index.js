import React from 'react';
import AppBar from '../AppBar/index';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import constants from './../../contants';

export default function Routes() {
    return <>
        <Router>
            <AppBar />
            <Switch>
                <Route path={constants.HOME}></Route>
                <Route path={constants.SUMMONS}></Route>
                <Route path={constants.TOPPULLS}></Route>
            </Switch>
        </Router>
    </>
}