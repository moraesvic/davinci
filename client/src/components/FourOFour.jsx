import React from 'react';

function FourOFour()
{
    const TIMEOUT = 3000; // given in milliseconds
    const rootNoDoubleSlash = `/${process.env.PUBLIC_URL}`.replace(/\/\//g, "/");
    return (
    <div className="center">
        <h1>
            404 &mdash; Not Found
        </h1>
        <p>
            You will be redirected to main page
            in {`${Math.round(TIMEOUT / 1000)}`} seconds.
        </p>
        <script>
            { 
                
                setTimeout( () => {
                    window.location.pathname = rootNoDoubleSlash
                    }, TIMEOUT)
            }
        </script>
    </div> );
}

export default FourOFour;