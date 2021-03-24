import {useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';
import OnlineServices from './routes/OnlineServices';
import Drivers from './routes/Drivers';
import Vehicles from './routes/Vehicles';

function App() {
  let [optionState, setOptionState] = useState(true);

  let navBarItems = [{name: "Online Services", route: "/onlineServices", component: <OnlineServices optionState={optionState} setOptionState={setOptionState} />},
                     {name: "Driver/ID", route: "/drivers", component: <Drivers optionState={optionState} setOptionState={setOptionState} />},
                     {name: "Vehicles", route: "/vehicles", component: <Vehicles optionState={optionState} setOptionState={setOptionState} />}];
  
  let routes = [];
  for (let i in navBarItems){
    routes.push(<Route key={i} path={navBarItems[i].route}> {navBarItems[i].component} </Route>);
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar navItems={navBarItems}/>
          <Switch>
            {routes}
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
