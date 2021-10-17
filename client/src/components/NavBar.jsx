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
    
    return (
    <nav class="nav-bar">
    
        <div class="nav-title">
            <DynLink endpoint="/" text={props.title} />
        </div>
        { props.dropdowns.map( dropdown => {
            return (
                <div class="nav-item">
                    <DynLink endpoint={dropdown.endpoint} text={dropdown.title} />
                </div>
            );
        })}
    </nav>
    );
}

export default NavBar;