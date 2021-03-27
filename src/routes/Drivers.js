import {useState, useEffect} from 'react';
import {useRouteMatch} from "react-router-dom";

import ServiceOptions from '../components/ServiceOptions';
import { createRealID } from '../components/apiQueries';

export default function Drivers({ optionState, setOptionState, driverAddress, allDrivers, setAllDrivers }){
    let match = useRouteMatch();

    let services = [{name: "Practice Exams", route: `${match.url}/practiceExams`},
                    {name: "Real ID", route: `${match.url}/createRealID`, component: <RealID setOptions={setOptionState} driverAddress={driverAddress} allDrivers={allDrivers} setAllDrivers={setAllDrivers} />},
                    {name: "Obtain Vital Record", route: `${match.url}/obtainVitalRecord`}];

    return(
        <ServiceOptions services={services} optionState={optionState} setOptions={setOptionState}/>
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
            {realID && <p>Driver already has a Real ID</p> }
            {!realID && 
                <div>
                    <p>Driver does not have a Real ID</p>
                    <button onClick={submitHandler} id="createRealID" >Convert to Real ID</button>
                </div>
            }
        </div>
    );
}