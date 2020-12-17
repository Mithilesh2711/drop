import React, { Component } from 'react';

class About extends Component {
    render(){
        return(
            <div className="about">
                <div className="container">
                  <div className="row">
		        <div className="image round fit col-12 col-sm-4 img-fluid align-self-center">
					<img src= {require("../images/ceo.jpg")} class="rounded-circle mt-4" width="300" height="236" alt="founder" />
				</div>
				<br></br>	<br></br>
				<div className="col-12 col-sm-6 my-4 align-self-center">
                    <h3><strong>Lucky Sharma</strong><blockquote className="blockquote">Founder</blockquote> </h3>
                    <p className="para"><em><strong>Drop</strong> gives not only pure and mineralized water 
                    but at much lesser rate than that of market. I believe on customer satisfaction 
                    so any issues caused will be solved within hours.</em></p>
                </div>						
		    </div>
            </div>
            </div>
        );
    }
}

export default About;