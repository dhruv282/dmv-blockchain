import {useState, useEffect} from 'react';
import {useRouteMatch} from "react-router-dom";

import ServiceOptions from '../components/ServiceOptions';
import {getVehicles, renewReg} from '../components/apiQueries';

export default function OnlineServices({ optionState, setOptionState, driverAddress }){
    let match = useRouteMatch();
    let [vehicles, setVehicles] = useState(null);

    useEffect(() => getVehicles(driverAddress).then(res=>{setVehicles(res)}),[driverAddress]);

    let services = [{name: "Vehicle Registration Renewal", route: `${match.url}/vehicleRegistrationRenewal`, component: <VehicleRegistrationRenewal setOptions={setOptionState} driverAddress={driverAddress} vehicles={vehicles} setVehicles={setVehicles}/>},
                    {name: "Address Change", route: `${match.url}/addressChange`},
                    {name: "Driver License Renewal", route: `${match.url}/driverLicenseRenewal`},
                    {name: "Report a Vehicle Sold/Traded", route: `${match.url}/vehicleSoldOrTraded`}];

    return(
        <ServiceOptions services={services} optionState={optionState} setOptions={setOptionState} />
    );
}

function VehicleRegistrationRenewal({setOptions, driverAddress, vehicles, setVehicles}){
    setOptions(false);

    let [selectedVehicle, setSelectedVehicle] = useState(null);
    let [vehicleExp, setVehicleExp] = useState(null);

    useEffect(()=>{
        if(vehicles && vehicles.length > 0){
            setSelectedVehicle(vehicles[0].vin);
            setVehicleExp(vehicles[0].registrationExp);
        } else {
            setSelectedVehicle(null);
            setVehicleExp(null);
        }
    }, [driverAddress, vehicles]);

    let submitHandler = function(event){
        event.preventDefault();
        let data = new FormData(event.target);
        renewReg(driverAddress, data).then(data => {
            setVehicleExp(data.status)
            if(data.status !== ""){
                let temp = vehicles;
                for(let i in vehicles){
                    if(vehicles[i].vin === selectedVehicle){
                        temp[i].registrationExp = data.status;
                        setVehicles(temp);
                        break;
                    }
                }
            }
        });
    }

    return(
        <div className="serviceForm">
            <p>{selectedVehicle}</p>
            <p>{vehicleExp}</p>
            <form onSubmit={submitHandler}>
                <label>
                    Vehicle:
                    <select name="vin" onChange={event => {
                        setSelectedVehicle(event.target.value);
                        for(let i in vehicles){
                            if(vehicles[i].vin === event.target.value){
                                setVehicleExp(vehicles[i].registrationExp);
                                break;
                            }
                        }
                    }}>
                        {
                            vehicles && vehicles.map(function(vehicle, i){
                                return <option key={i} value={vehicle.vin} >{vehicle.model}</option>
                            })
                        }
                    </select>
                </label>
                <label>
                    Months:
                    <input type="number" defaultValue="6" min="1" max="24" name="months"/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
}