import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
    Button, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink } from 'react-router-dom';

class AdminLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        };
      
        this.toggleModal = this.toggleModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleLogin(event) {
        console.log("handleLogin")
        this.toggleModal();
        this.props.loginUser({username: this.username.value, password: this.password.value});
        event.preventDefault();

    }

    handleLogout() {
        this.props.logoutUser();
    }

    render() {
        if(!this.props.auth.isAuthenticated)
        return(
            <>
            <div className="row justify-content-center">
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-sign-in fa-lg"></span> Admin Login 
                </Button>
            </div>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Admin Login</ModalHeader>
            <ModalBody>
                <Form onSubmit={this.handleLogin}>
                    <FormGroup>
                        <Label htmlFor="username">Username</Label>
                        <Input type="text" id="username" name="username"
                            innerRef={(input) => this.username = input} />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" name="password"
                            innerRef={(input) => this.password = input}  />
                    </FormGroup>
                    <Button type="submit" value="submit" color="primary">Login</Button>
                </Form>
            </ModalBody>
            </Modal>
            </>
        );

        else {
            return(
                <div className="row justify-content-center">
                <Button outline onClick={this.handleLogout}>
                    <span className="fa fa-sign-in fa-lg"></span> Logout 
                </Button>
            </div>
            );
        }
    }
}

export default AdminLogin;