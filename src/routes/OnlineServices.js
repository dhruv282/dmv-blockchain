import {useState, useEffect} from 'react';
import {useRouteMatch} from "react-router-dom";

import ServiceOptions from '../components/ServiceOptions';
import {getVehicles, renewReg, updateAddress, renewDL, vehicleSoldOrTraded } from '../components/apiQueries';

export default function OnlineServices({ optionState, setOptionState, driverAddress, allDrivers }){
    let match = useRouteMatch();
    let [vehicles, setVehicles] = useState(null);

    useEffect(() => getVehicles(driverAddress).then(res=>{setVehicles(res)}),[driverAddress]);

    let services = [{name: "Vehicle Registration Renewal", route: `${match.url}/vehicleRegistrationRenewal`, component: <VehicleRegistrationRenewal setOptions={setOptionState} driverAddress={driverAddress} vehicles={vehicles} setVehicles={setVehicles}/>},
                    {name: "Address Change", route: `${match.url}/addressChange`, component: <AddressChange setOptions={setOptionState} allDrivers={allDrivers} driverAddress={driverAddress} />},
                    {name: "Driver License Renewal", route: `${match.url}/driverLicenseRenewal`, component: <DLRenewal setOptions={setOptionState} allDrivers={allDrivers} driverAddress={driverAddress} />},
                    {name: "Report a Vehicle Sold/Traded", route: `${match.url}/vehicleSoldOrTraded`, component: <VehicleSoldOrTraded setOptions={setOptionState} driverAddress={driverAddress} vehicles={vehicles} setVehicles={setVehicles} />}];

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
            setVehicleExp(data.status);
            if(data.status !== ""){
                console.log(data)
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

function AddressChange({ setOptions, allDrivers, driverAddress }){
    setOptions(false);

    let [address, setAddress] = useState(null);

    useEffect(() => {
        for(let i in allDrivers){
            if(allDrivers[i].blockchainAddress === driverAddress){
                setAddress(allDrivers[i].address);
                break;
            }
        }
    }, [driverAddress]);

    let submitHandler = (event) => {
        event.preventDefault();
        let data = new FormData(event.target);
        updateAddress(driverAddress, data).then(data =>{
            setAddress(data.status);
            for(let i in allDrivers){
                if(allDrivers[i].blockchainAddress === driverAddress){
                    allDrivers[i].address = data.status;
                    break;
                }
            }
        });
    }

    return(
        <div className="serviceForm">
            <p>{address}</p>
            <form onSubmit={submitHandler}>
                <label> New Address:
                    <input name="address" style={{width: 350}} type="text"/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
}

function DLRenewal({ setOptions, allDrivers, driverAddress }){
    setOptions(false);
    
    let [dlExp, setdlExp] = useState(null);

    useEffect(() => {
        for(let i in allDrivers){
            if(allDrivers[i].blockchainAddress === driverAddress){
                setdlExp(allDrivers[i].DLexp);
                break;
            }
        }
    }, [driverAddress]);

    let submitHandler = (event) => {
        event.preventDefault();
        let data = new FormData(event.target);
        renewDL(driverAddress, data).then(data =>{
            setdlExp(data.status);
            for(let i in allDrivers){
                if(allDrivers[i].blockchainAddress === driverAddress){
                    allDrivers[i].DLexp = data.status;
                    break;
                }
            }
        });
    }

    return(
        <div className="serviceForm">
            <p>{dlExp}</p>
            <form onSubmit={submitHandler}>
                <label>
                    Months:
                    <input type="number" defaultValue="6" min="1" max="24" name="months"/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
}

function VehicleSoldOrTraded({ setOptions, driverAddress, vehicles, setVehicles }){
    setOptions(false);

    let [selectedVehicle, setSelectedVehicle] = useState(null);

    useEffect(() => {
        if(vehicles && vehicles.length > 0){
            setSelectedVehicle(vehicles[0].vin);
        }
    }, [driverAddress]);

    let submitHandler = (event) => {
        event.preventDefault();
        let data = new FormData(event.target);
        vehicleSoldOrTraded(driverAddress, data).then(data => {
            setVehicles(data);
        });
    }

    return(
        <div className="serviceForm">
            <p>{selectedVehicle}</p>
                <form onSubmit={submitHandler}>
                    <label>
                        Vehicle:
                        <select name="vin" onChange={event => {
                            setSelectedVehicle(event.target.value);
                        }}>
                            {
                                vehicles && vehicles.map(function(vehicle, i){
                                    return <option key={i} value={vehicle.vin} >{vehicle.model}</option>
                                })
                            }
                        </select>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
        </div>
    );

}