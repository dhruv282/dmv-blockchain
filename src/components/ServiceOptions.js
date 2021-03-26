import {Switch, Route, Link} from "react-router-dom";

export default function ServiceOptions({ services, optionState, setOptions}){
    setOptions(true);
    let servicesComp = [];
    let routes = [];
    for (let i in services){
        routes.push(<Route key={i} path={services[i].route}> {services[i].component} </Route>);
        servicesComp.push(<li key={i}><Link to={services[i].route}>{services[i].name}</Link></li>);
    }

    return(
        <div>
            <Switch>
                {routes}
            </Switch>
                {
                    optionState && <div className="categoryServices">
                        <ul>
                            { servicesComp }
                        </ul>
                    </div>
                }
        </div>
        
    );
}