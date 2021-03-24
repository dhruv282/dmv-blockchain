import {useRouteMatch} from "react-router-dom";

import ServiceOptions from '../components/ServiceOptions';

export default function OnlineServices({ optionState, setOptionState }){
    let match = useRouteMatch();

    let services = [{name: "Vehicle Registration Renewal", route: `${match.url}/vehicleRegistrationRenewal`, component: <VehicleRegistrationRenewal setOptions={setOptionState}/>},
                    {name: "Address Change", route: `${match.url}/addressChange`},
                    {name: "Driver License Renewal", route: `${match.url}/driverLicenseRenewal`},
                    {name: "Report a Vehicle Sold/Traded", route: `${match.url}/vehicleSoldOrTraded`}];

    return(
        <ServiceOptions services={services} optionState={optionState} setOptions={setOptionState}/>
    );
}

function VehicleRegistrationRenewal({setOptions}){
    setOptions(false);

    let submitHandler = function(event){
        alert(event)
    }

    return(
        <div class="serviceForm">
            <form>
                <label>
                    Last 4 digits of VIN:
                    <input type="tel" pattern="[0-9]*" maxlength="4" name="vinNum"/>
                </label>
                <input type="submit" onSubmit={submitHandler} value="Submit"/>
            </form>
        </div>
    );
}