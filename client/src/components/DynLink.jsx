function DynLink(props) {
    // endpoint, text -> <a>
    let prefix = process.env.PUBLIC_URL;
    let endpoint = props.endpoint.slice(0, 1) === "/" ?
            props.endpoint.slice(1) :
            props.endpoint;
    return (
        <a href={`${prefix}/${endpoint}`}>{props.text}</a>
    );
}

export default DynLink;