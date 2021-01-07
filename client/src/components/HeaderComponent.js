import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false
        };
        this.toggleNav = this.toggleNav.bind(this);
    }

    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    render(){
        return(
            <React.Fragment>
                <Navbar dark color="dark" expand="md">
                    <div className="container">
                        <NavbarToggler className="nav-icon" onClick={this.toggleNav} />
                       <pre>        </pre> <NavbarBrand className="mr-auto" href="/">
                           <img src="drop.jpg" height="70" width="100"
                                alt="Drop" />
                        </NavbarBrand>
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link mx-2" to="/home">
                                        <span className="fa fa-home fa-lg"></span> Home
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link mx-1" to="/aboutus">
                                        <span className="fa fa-info fa-lg"></span> About Us
                                    </NavLink>
                                </NavItem>
                                <pre>                                                            </pre>
                                <div  class="navbar-nav ml-4">
                                    <a  data-toggle="tooltip" title="Facebook" href="#" class="nav-item nav-link"><i class="fa fa-lg fa-facebook"></i></a>
                                    <a data-toggle="tooltip" title="Twitter" href="#" class="nav-item nav-link"><i class="fa fa-lg fa-twitter"></i></a>
                                    <a data-toggle="tooltip" title="Instagram" href="#" class="nav-item nav-link"><i class="fa fa-lg fa-instagram"></i></a>
                                    <a data-toggle="tooltip" title="LinkedIn" href="#" class="nav-item nav-link"><i class="fa fa-lg fa-linkedin"></i></a>
                                </div>
                            </Nav>
                            
                        </Collapse>
                    </div>
                </Navbar>
            </React.Fragment>
        );
    }
}

export default Header;