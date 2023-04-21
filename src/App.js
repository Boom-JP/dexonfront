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

const Cml = () => {
  const { line_number } = useParams();
  return  <div>
            <CmlTable 
              line_number ={line_number} 
            />
          </div>;
};

const TestPoint = () => {
  const { line_number } = useParams();
  const { cml_number } = useParams();
  return  <div>
            <TestPointTable 
              line_number ={line_number} 
              cml_number ={cml_number}
            />
          </div>;
};

const Thickness = () => {
  const { line_number } = useParams();
  const { cml_number } = useParams();
  const { tp_number } = useParams();
  return  <div>
            <ThicknessTable
              line_number = {line_number}
              cml_number = {cml_number}
              tp_number = {tp_number}
            />
          </div>;
};


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/cml/:line_number" component={Cml} />
        <Route path="/testPoint/:line_number/:cml_number" component={TestPoint} />
        <Route path="/thickness/:line_number/:cml_number/:tp_number" component={Thickness} />
      </Switch>
    </Router>
  );
}

export default App;