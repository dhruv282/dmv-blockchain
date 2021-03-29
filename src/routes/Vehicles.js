import {useState, useEffect} from 'react';
import {useRouteMatch} from "react-router-dom";

import ServiceOptions from '../components/ServiceOptions';
import {getDrivers, getVehicles, updateVehicleOwner, VATitle } from '../components/apiQueries';

export default function Vehicles({ optionState, setOptionState, driverAddress, allDrivers, setAllDrivers }){
    let match = useRouteMatch();
    let [vehicles, setVehicles] = useState(null);

    useEffect(() => getVehicles(driverAddress).then(res=>{setVehicles(res)}),[driverAddress]);

    let services = [{name: "Selling/donating a vehicle", route: `${match.url}/sellingOrDonating`, component: <ChangeVehicleOwner setOptions={setOptionState} driverAddress={driverAddress} allDrivers={allDrivers} setAllDrivers={setAllDrivers} vehicles={vehicles} setVehicles={setVehicles} />},
                    {name: "Titling a vehicle in Virginia", route: `${match.url}/titleVA`, component: <TitleVA setOptions={setOptionState} driverAddress={driverAddress} vehicles={vehicles} setVehicles={setVehicles} />}];

    return(
        <ServiceOptions services={services} optionState={optionState} setOptions={setOptionState}/>
    );
}

function ChangeVehicleOwner({ setOptions, driverAddress, allDrivers, setAllDrivers, vehicles, setVehicles }){
    setOptions(false);
    let [curVehicle, setCurVehicle] = useState(null);
    let [newOwner, setNewOwner] = useState(null);

    useEffect(() => {
        if(vehicles && vehicles.length > 0){
            setCurVehicle(vehicles[0].vin);
        } else {
            setCurVehicle(null);
        }
        for(let i in allDrivers){
            if(allDrivers[i].blockchainAddress !== driverAddress){
                setNewOwner(allDrivers[i].blockchainAddress);
                break;
            }
        }
    }, [driverAddress]);

    let submitHandler = event => {
        event.preventDefault();
        let data = new FormData(event.target);
        updateVehicleOwner(driverAddress, newOwner, data).then(data => {
            if(data.length === 0){
                setCurVehicle(null);
            } else {
                setVehicles(data)
                setCurVehicle(data[0])
            }
            getDrivers().then(data => setAllDrivers(data));
        });
    }

    return(
        <div className="serviceForm">
            {vehicles && vehicles.length > 0 && curVehicle ? <form onSubmit={submitHandler}>
                <label>
                    Vehicle:
                    <select name="vin" onChange={event => {setCurVehicle(event.target.value)}}>
                        {vehicles.map(function(vehicle, i){return <option key={i} value={vehicle.vin}>{vehicle.model}</option>})}
                    </select>
                </label>
                <label>
                    New Owner:
                    <select name="newOwner" onChange={event => {setNewOwner(event.target.value)}}>
                        {allDrivers && allDrivers.map(function(driver, i){
                            return driver.blockchainAddress !== driverAddress ? <option key={i} value={driver.blockchainAddress}>{driver.fname + " " + driver.lname}</option> : ""
                        })}
                    </select>
                </label>
                <input type="submit" value="Submit"/>
            </form> : ""
            }
            {(!vehicles || vehicles.length === 0 || !curVehicle) ? <p>Driver does not own any vehicles</p> : ""}
        </div>
    );
}

function TitleVA({ setOptions, driverAddress, vehicles, setVehicles }){
    setOptions(false);
    let [curVehicle, setCurVehicle] = useState(null);
    let [vaTitle, setVAtitle] = useState(false);

    useEffect(() => {
        if(vehicles && vehicles.length > 0){
            setCurVehicle(vehicles[0].vin);
            setVAtitle(false);
            for(let v in vehicles){
                if(vehicles[v].vin === vehicles[0].vin && vehicles[v].titleState === "VA"){
                    setVAtitle(true);
                }
            }
        } else {
            setCurVehicle(null);
            setVAtitle(false);
        }
    }, [vehicles]);

    let submitHandler = (event) => {
        event.preventDefault();
        VATitle(driverAddress, curVehicle).then(data => setVehicles(data));
    }

    return(
        <div className="serviceForm">
            {curVehicle && <div>
                <label>
                    Vehicle:
                    <select name="vin" onChange={event=>{
                        setCurVehicle(event.target.value);
                        setVAtitle(false);
                        for(let v in vehicles){
                            if(vehicles[v].vin === event.target.value && vehicles[v].titleState === "VA"){
                                setVAtitle(true);
                                break;
                            }
                        }
                    }}>
                        {
                            vehicles && vehicles.map(function(vehicle, i){
                                return <option key={i} value={vehicle.vin}>{vehicle.model}</option>
                            })
                        }
                    </select>
                </label>
                {!vaTitle && <button id="vaTitle" style={{display: "block"}} onClick={submitHandler} >Update title state to VA</button>}
                {vaTitle && <p>Vehicle registered in VA</p>}
            </div>}
            {!curVehicle && <p>Driver does not own any vehicles</p>}
        </div>
    );
}