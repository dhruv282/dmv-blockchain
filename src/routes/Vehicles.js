import {useRouteMatch} from "react-router-dom";

import ServiceOptions from '../components/ServiceOptions';

export default function Vehicles({ optionState, setOptionState }){
    let match = useRouteMatch();

    let services = [{name: "Selling/donating a vehicle", route: `${match.url}/sellingOrDonating`},
                    {name: "Titling a vehicle in Virginia", route: `${match.url}/titleVA`}];

    return(
        <ServiceOptions services={services} optionState={optionState} setOptions={setOptionState}/>
    );
}