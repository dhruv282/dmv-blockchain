import {Link} from "react-router-dom";
import logo from '../dmvLogo.png';

export default function Navbar({ navItems }){
    let navContent = [];
    for (let i in navItems){
        navContent.push(<li key={i}><Link to={navItems[i].route}>{navItems[i].name}</Link></li>);
    }

    return(
        <header className="Navbar">
            <Link to="/"><img src={logo} className="App-logo" alt="logo"/></Link>
            <ul>
                { navContent }
            </ul>
        </header>
    );
}