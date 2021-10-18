import React from 'react';

import "./Image.css";

function ImageTag(id, alt)
    {
        let prefix = process.env.PUBLIC_URL;
        let src = `${prefix}/pictures/${id}`.replace(/\/\//g, "/");
        return id ?
        <img src={src}
        title={alt}
        alt={alt}
        className="demo-pic"/>
        :
        <img src={require('../img/no-icon.png').default}
        title={alt}
        alt={alt}
        className="demo-pic" />;
    }

function Image(props)
{
    return (
    <div className="pic-box">
        {ImageTag(props.id, props.alt)}
    </div>
    );
}

export default Image;