import React from 'react';

export const Loading = () => {
    setInterval(function(){}, 3000);
    return(
        
        <div className="col-12">
            <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
            <p>Loading . . .</p>
        </div>
    );
};