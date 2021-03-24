import {useRouteMatch} from "react-router-dom";

import ServiceOptions from '../components/ServiceOptions';

export default function Drivers({ optionState, setOptionState }){
    let match = useRouteMatch();

    let services = [{name: "Practice Exams", route: `${match.url}/practiceExams`},
                    {name: "Real ID", route: `${match.url}/realID`},
                    {name: "Obtain Vital Record", route: `${match.url}/obtainVitalRecord`}];

    return(
        <ServiceOptions services={services} optionState={optionState} setOptions={setOptionState}/>
    );
}