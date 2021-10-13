function DynLink(props) {
    // endpoint, text -> <a>
    let prefix =    (   !  process.env.NODE_ENV
                        || process.env.NODE_ENV === 'development'
                    ) ? "" : "/davinci" ;
    return (
        <a href={`${prefix}${props.endpoint}`}>{props.text}</a>
    );
}

export default DynLink;