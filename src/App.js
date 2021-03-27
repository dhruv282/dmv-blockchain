import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';
import OnlineServices from './routes/OnlineServices';
import Drivers from './routes/Drivers';
import Vehicles from './routes/Vehicles';
import {getDrivers, checkChainValidity} from './components/apiQueries';

function SelectDriver({ allDrivers, setSelectedDriver, setDriverAddress }){
   return(
     allDrivers && <select onChange={event => {
       setSelectedDriver(event.target.value);
       setDriverAddress(getDriverAddress(allDrivers, event.target.value));
     }}>
       {allDrivers.map(function(driver, i){
          return <option key={i} value={driver.fname + " " + driver.lname}>{driver.fname + " " + driver.lname}</option>
       })}
     </select>
   );
}

function getDriverAddress(allDrivers, selectedDriver){
  let driverAddress = null;
  for(let i in allDrivers){
    let names = selectedDriver.split(" ");
    if(allDrivers[i].fname === names[0] && allDrivers[i].lname === names[1]){
        driverAddress = allDrivers[i].blockchainAddress;
    }
  }
  return driverAddress
}

function App() {
  
  let [allDrivers, setAllDrivers] = useState(null);
  let [selectedDriver, setSelectedDriver] = useState(null);
  let [optionState, setOptionState] = useState(true);
  let [driverAddress, setDriverAddress] = useState(null);

  useEffect(()=>{
    if (!allDrivers){
      getDrivers().then(res=>{
        setAllDrivers(res);
        res && res.length > 0 && setSelectedDriver(res[0].fname + " " + res[0].lname);
        res && res.length > 0 && setDriverAddress(getDriverAddress(res, res[0].fname + " " + res[0].lname));
      });
    }
  }, [allDrivers]);

  let navBarItems = [{name: "Online Services", route: "/onlineServices", component: <OnlineServices optionState={optionState} setOptionState={setOptionState} driverAddress={driverAddress} allDrivers={allDrivers} />},
                    {name: "Driver/ID", route: "/drivers", component: <Drivers optionState={optionState} setOptionState={setOptionState} driverAddress={driverAddress} allDrivers={allDrivers} setAllDrivers={setAllDrivers} />},
                    {name: "Vehicles", route: "/vehicles", component: <Vehicles optionState={optionState} setOptionState={setOptionState} />}];
  
  let routes = [];
  for (let i in navBarItems){
    routes.push(<Route key={i} path={navBarItems[i].route}> {navBarItems[i].component} </Route>);
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <button onClick={() =>
            checkChainValidity().then(data => {
              if (data.result){
                window.alert("Chain is valid :)");
              } else {
                window.alert("Chain is not valid :(")
              }
            })
          }>Check Chain Validity</button>
          <div id="driverSelect">
            <SelectDriver allDrivers={allDrivers} setSelectedDriver={setSelectedDriver} setDriverAddress={setDriverAddress}/>
            <p>{selectedDriver}</p>
          </div>
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
