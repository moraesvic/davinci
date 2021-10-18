import "./NavBar.css";
import DynLink from './DynLink';

function NavBar(props) {
    /*
    props.dropdowns : list with JSON objects, each of which has a "title" and an
        "endpoint" property
    props.title : website title
    */
    if (!props.dropdowns || !props.title)
        return (null);

    let dropdownIndex = 0;
    
    return (
    <nav className="nav-bar">
    
        <div className="nav-title">
            <DynLink endpoint="/" text={props.title} />
        </div>
        { props.dropdowns.map( dropdown => {
            return (
                <div className="nav-item" key={`nav-item-${dropdownIndex++}`}>
                    <DynLink endpoint={dropdown.endpoint} text={dropdown.title} />
                </div>
            );
        })}
    </nav>
    );
}

export default NavBar;