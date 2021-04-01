import {useState, useEffect} from 'react';
import {useRouteMatch} from "react-router-dom";

import ServiceOptions from '../components/ServiceOptions';
import { getVehicles, createRealID, updatePracticeExamScore } from '../components/apiQueries';

export default function Drivers({ optionState, setOptionState, driverAddress, allDrivers, setAllDrivers }){
    let match = useRouteMatch();
    let [vehicles, setVehicles] = useState(null);

    useEffect(() => getVehicles(driverAddress).then(res=>{setVehicles(res)}),[driverAddress]);

    let services = [{name: "Practice Exams", route: `${match.url}/practiceExams`, component: <PracticeExams setOptions={setOptionState} driverAddress={driverAddress} allDrivers={allDrivers} setAllDrivers={setAllDrivers} />},
                    {name: "Real ID", route: `${match.url}/createRealID`, component: <RealID setOptions={setOptionState} driverAddress={driverAddress} allDrivers={allDrivers} setAllDrivers={setAllDrivers} />},
                    {name: "Obtain Vital Record", route: `${match.url}/obtainVitalRecord`, component: <VitalRecord setOptions={setOptionState} driverAddress={driverAddress} allDrivers={allDrivers} vehicles={vehicles} /> }];

    return(
        <ServiceOptions services={services} optionState={optionState} setOptions={setOptionState}/>
    );
}

function PracticeExams({ setOptions, driverAddress, allDrivers, setAllDrivers }){
    setOptions(false);
    let [score, setScore]  = useState(null);

    useEffect(() => {
        for(let i in allDrivers){
            if(allDrivers[i].blockchainAddress === driverAddress){
                setScore(allDrivers[i].practiceTestScore);
                break;
            }
        }
    },[driverAddress, allDrivers]);

    let submitHandler = (event) => {
        event.preventDefault();
        let data = new FormData(event.target);
        updatePracticeExamScore(driverAddress, data).then(data => setAllDrivers(data));
    }

    return(
        <div className="serviceForm">
            <p>Score: {score}%</p>
            <form onSubmit={submitHandler}>
                <label>
                    New score:
                    <input type="number" min="0" max="100" name="score"/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    );
}

function RealID({ setOptions, driverAddress, allDrivers, setAllDrivers }){
    setOptions(false);
    let [realID, setRealID] = useState(null);

    useEffect(() => {
        for(let i in allDrivers){
            if(allDrivers[i].blockchainAddress === driverAddress){
                setRealID(allDrivers[i].realID);
                break;
            }
        }
    }, [driverAddress]);

    let submitHandler = () => {
        createRealID(driverAddress).then(data => {
            setAllDrivers(data);
            for(let i in allDrivers){
                if(data[i].blockchainAddress === driverAddress){
                    setRealID(data[i].realID);
                    break;
                }
            }
        });
    }

    return(
        <div className="serviceForm">
            {realID && <p>Driver has a Real ID</p> }
            {!realID && 
                <div>
                    <p>Driver does not have a Real ID</p>
                    <button onClick={submitHandler} id="createRealID" >Convert to Real ID</button>
                </div>
            }
        </div>
    );
}

function VitalRecord({ setOptions, driverAddress, allDrivers, vehicles }){
    setOptions(false);
    let [driverInfo, setDriverInfo] = useState(null);
    let [curVehicle, setCurVehicle] = useState(null);

    useEffect(() => {
        for(let i in allDrivers){
            if(allDrivers[i]. blockchainAddress === driverAddress){
                setDriverInfo(allDrivers[i]);
                break;
            }
        }
    }, [driverAddress]);

    useEffect(() => {
        if(vehicles && vehicles.length > 0){
            setCurVehicle(vehicles[0].vin);
        } else {
            setCurVehicle(null);
        }
    }, [vehicles]);

    return(
        driverInfo && <div style={{textAlign: "left", height: "450px", overflowY: "scroll", padding: "0px 25px"}} className="serviceForm">
            <h3>Driver Info</h3>
            <p><b>Name:</b> {driverInfo.fname + " " + driverInfo.lname}</p>
            <p><b>Address:</b> {driverInfo.address}</p>
            <p><b>License Exp:</b> {driverInfo.DLexp}</p>
            <p><b>Real ID:</b> {driverInfo.realID ? "True" : "False"}</p>
            <p><b>Practice Test Score:</b> {driverInfo.practiceTestScore}%</p>

            {curVehicle && 
                <div>
                    <hr style={{width:"100%",textAlign:"left",marginLeft:0}}/> 
                    <h3>Vehicle Info</h3>
                    <select onChange={event => {
                        setCurVehicle(event.target.value);
                    }}>
                        {vehicles && vehicles.map(function(vehicle, i){
                            return <option key={i} value={vehicle.vin}>{vehicle.model}</option>
                        })}
                    </select>
                    {vehicles.map(function(vehicle, i){
                        if (vehicle.vin === curVehicle){
                            return <div key={i}>
                                <p><b>Model:</b> {vehicle.model}</p>
                                <p><b>VIN:</b> {vehicle.vin}</p>
                                <p><b>Title State:</b> {vehicle.titleState}</p>
                                <p><b>Registration Exp:</b> {vehicle.registrationExp}</p>
                            </div>
                        }
                    })}
                </div>  
            }
        </div>
    );
}