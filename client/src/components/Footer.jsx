import React from 'react';
import "./Footer.css";

function GitHub(props)
{
    return (
        props.link ?
        <p>[<a href={props.link}>GitHub</a>]</p> :
        (null)
    );
}

function Footer(props)
{
    const year = (new Date()).getFullYear();
    return (
    <footer>
        <hr/>
        Made with {props.madeWith} by {props.author}, {year}
        <GitHub link={props.gitHub} />
    </footer>
    );
}

export default Footer;