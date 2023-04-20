import React from 'react';
import PipeTable from'./Pages/index/index'
import CmlTable from './Pages/detail/cml';
import TestPointTable from './Pages/detail/testPoint';
import ThicknessTable from './Pages/detail/thickness';
import { BrowserRouter as Router, Route, Switch, Link, useRouteMatch, useParams } from "react-router-dom";

const Index = () => {
  return  <div>
            <PipeTable />
          </div>;
};

const Cml = ({match}) => {
  const { line_number } = useParams();
  return  <div>
            <CmlTable line_number ={line_number} />
          </div>;
};

const TestPoint = () => {
  return  <div>
            <TestPointTable />
          </div>;
};

const Thickness = () => {
  return  <div>
            <ThicknessTable />
          </div>;
};


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/cml/:line_number" component={Cml} />
        <Route path="/testPoint" component={TestPoint} />
        <Route path="/thickness" component={Thickness} />
      </Switch>
    </Router>
  );
}

export default App;