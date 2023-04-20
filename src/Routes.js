import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import Index from "./Pages/index/index";
import CML from "./Pages/detail/cml";
import TestPoint from "./Pages/detail/testPoint";
import Thickness from "./Pages/detail/thickness";
import history from "./Pages/history";

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Index} />
                    <Route path="/cml" component={CML} />
                    <Route path="/tp" component={TestPoint} />
                    <Route path="/thickness" component={Thickness} />
                </Switch>
            </Router>
        )
    }
}