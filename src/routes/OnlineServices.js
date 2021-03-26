import {useRouteMatch} from "react-router-dom";

import ServiceOptions from '../components/ServiceOptions';
import {getVehicles} from '../components/apiQueries';

export default function OnlineServices({ optionState, setOptionState, selectedDriver }){
    let match = useRouteMatch();

    let services = [{name: "Vehicle Registration Renewal", route: `${match.url}/vehicleRegistrationRenewal`, component: <VehicleRegistrationRenewal setOptions={setOptionState}/>},
                    {name: "Address Change", route: `${match.url}/addressChange`},
                    {name: "Driver License Renewal", route: `${match.url}/driverLicenseRenewal`},
                    {name: "Report a Vehicle Sold/Traded", route: `${match.url}/vehicleSoldOrTraded`}];

    return(
        <ServiceOptions services={services} optionState={optionState} setOptions={setOptionState} selectedDriver={selectedDriver} />
    );
}

function VehicleRegistrationRenewal({setOptions, selectedDriver}){
    setOptions(false);

    let submitHandler = function(event){
        alert(event)
    }

    return(
        <div className="serviceForm">
            <form>
                <label>
                    Vehicle:
                    <input type="tel" pattern="[0-9]*" maxLength="4" name="vinNum"/>
                </label>
                <label>
                    Months:
                    <input type="tel" pattern="[0-9]*" maxLength="4" name="vinNum"/>
                </label>
                <input type="submit" onSubmit={submitHandler} value="Submit"/>
            </form>
        </div>
    );
}