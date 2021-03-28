import {useState, useEffect} from 'react';
import {useRouteMatch} from "react-router-dom";

import ServiceOptions from '../components/ServiceOptions';
import {getVehicles, VATitle } from '../components/apiQueries';

export default function Vehicles({ optionState, setOptionState, driverAddress, allDrivers }){
    let match = useRouteMatch();
    let [vehicles, setVehicles] = useState(null);

    useEffect(() => getVehicles(driverAddress).then(res=>{setVehicles(res)}),[driverAddress]);

    let services = [{name: "Selling/donating a vehicle", route: `${match.url}/sellingOrDonating`},
                    {name: "Titling a vehicle in Virginia", route: `${match.url}/titleVA`, component: <TitleVA setOptions={setOptionState} driverAddress={driverAddress} vehicles={vehicles} setVehicles={setVehicles} />}];

    return(
        <ServiceOptions services={services} optionState={optionState} setOptions={setOptionState}/>
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