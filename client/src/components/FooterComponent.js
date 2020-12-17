import React from 'react';
import { Link } from 'react-router-dom';

function Footer(props) {
    return(
        <div id="foot" className="footer bgclr">
            <div className="container">
                <div className="row justify-content-center">             
                    <div className="col-4 offset-1 col-sm-2">
                        <h5>Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/aboutus">About Us</Link></li>
                        </ul>
                    </div>
                    <div className="col-7 col-sm-5">
                        <h5>Our Address</h5>
                        <address>
                        Shiv Puri Colony<br />
                        Near Sanskar Coaching Centre<br />
                        Chas, Bokaro, Jharkhand<br />
                        <i className="fa fa-phone fa-lg"></i>: +917979784087<br />
                        <i className="fa fa-envelope fa-lg"></i>: <a href="mailto:drop@gmail.com">
                            drop@gmail.com</a>
                        </address>
                    </div>
                    <div className="col-12 row col-sm-4 justify-content-center align-items-center">
                    <div className="text-center">
                            <a className="btn btn-social-icon btn-google" href="http://google.com/+"><i className="fa fa-google-plus"></i></a>
                            <a className="btn btn-social-icon btn-facebook" href="http://www.facebook.com/profile.php?id="><i className="fa fa-facebook"></i></a>
                            <a className="btn btn-social-icon btn-linkedin" href="http://www.linkedin.com/in/"><i className="fa fa-linkedin"></i></a>
                            <a className="btn btn-social-icon btn-twitter" href="http://twitter.com/"><i className="fa fa-twitter"></i></a>
                            <a className="btn btn-social-icon btn-google" href="http://youtube.com/"><i className="fa fa-youtube"></i></a>
                            <a className="btn btn-social-icon" href="mailto:drop@gmail.com"><i className="fa fa-envelope-o"></i></a>
                        </div>
                    </div>
                    <br></br>
                    
                        <br></br>
                </div>
                <div className="row justify-content-center">             
                    <div className="col-auto">
                        <p>Designed by <a href="https://linkedin.com/in/mithilesh-kumar-9946b5179">Mithilesh</a></p>
                    </div>
                </div>
                <div class="row justify-content-center align-item-center text-center">
                    <a data-toggle="tooltip" title="Facebook" href="https://www.facebook.com/profile.php?id=100014646164543" class="nav-item nav-link"><i class="fa fa-lg fa-facebook"></i></a>
                    <a data-toggle="tooltip" title="Instagram" href="https://www.instagram.com/sittu.mkd/" class="nav-item nav-link"><i class="fa fa-lg fa-instagram"></i></a>
                    <a data-toggle="tooltip" title="LinkedIn" href="https://linkedin.com/in/mithilesh-kumar-9946b5179" class="nav-item nav-link"><i class="fa fa-lg fa-linkedin"></i></a>
                </div>
            </div>
            <br></br>
            <div className="row justify-content-center">             
                    <div className="col-auto">
                        <p>© Copyright 2018 Drop</p>
                    </div>
                </div>
        </div>
    );
}

export default Footer;