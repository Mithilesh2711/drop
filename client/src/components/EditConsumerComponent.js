import React, { useState, Component } from 'react';
import { Loading } from './LoadingComponent';
import {Form, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,  Row, Col, Input, FormGroup, Label} from 'reactstrap';
import {Link} from 'react-router-dom';

 

class EditConsumer extends Component {

    constructor(props) {
        super(props);
      
        this.state = {
            isDropdownOpen: false,
            fieldname:""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }


    handleDropdown() {
        this.setState({
            isDropdownOpen: !this.state.isDropdownOpen
        });
    }

    handleChange(val) {
        this.setState({
            fieldname:val
        });
    }

    handleSubmit(event) {
        console.log("HandelSubmit",this.state.fieldname);
        const bearer = 'Bearer ' + localStorage.getItem('token');
        var field = this.state.fieldname;
        var val = this.fieldval.value;
        
        var data={id : this.props.id , field:field, val:val};
        return fetch('/consumer/edit/', {
            method: 'POST',
            headers: { 
                'Content-Type':'application/json' ,
                'Authorization': bearer
            },
            body: JSON.stringify(data),
            credentials: 'same-origin'
        })
        .then(response => {
        
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                console.log("err1",error);
                throw error;
            }
            },
            error => {
                console.log("err",error);
                throw error;
            })
        .then(response => response.json())
        .then(response => {
            alert("Data Changed Successfully!");
         })
        .catch(error => alert("Failed to edit consumer: ",error));

    }

    render() {
        

            if(this.props.isLoading) {
                return(
                    <Loading />
                );
            }
        
            else if (this.props.errMess) {
                return(
                    <h4>{this.props.errMess}</h4>
                );
            }
            else {
                if(this.props.consumers.consumers.filter((consumer) => consumer.id === this.props.id)[0]) {
                    var consumer = this.props.consumers.consumers.filter((consumer) => consumer.id === this.props.id)[0];
                return(
                    <div className="container">
                        <div className="align-item-center">
                            <h1>User Details</h1>
                          <h3>Consumer Id :  {consumer.id}</h3> 
                          <h3>First Name :  {consumer.firstname}</h3> 
                          <h3>Last Name : {consumer.lastname}</h3> 
                          <h3>Reading :  {consumer.reading}</h3> 
                          <h3>Date of Installation :  {consumer.doi}</h3>  
                          <h3>Phone No. :  {consumer.phone}</h3> 
                          <h3>Address :  {consumer.address} </h3>
                          <h3>City :  {consumer.city}</h3> 
                          <h3>District :  {consumer.district}</h3> 
                          <h3>State :  {consumer.state}</h3>
                          <br></br>
                        </div>
                        
        
                        <Form className="mt-3" >
                            <Row>
                                <Col className="offset-md-3" md={3}>
                                <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.handleDropdown}>
                                <DropdownToggle caret>
                                    Field Name
                                </DropdownToggle>
                                <DropdownMenu id="dropdown">
                                    <DropdownItem  onClick={() => this.handleChange("firstname")} value="firstname">First Name</DropdownItem>
                                    <DropdownItem  onClick={() => this.handleChange("lastname")}  value="lastname">Last Name</DropdownItem>
                                    <DropdownItem  onClick={() => this.handleChange("reading")}  value="reading">Reading</DropdownItem>
                                    <DropdownItem  onClick={() => this.handleChange("phone")} value="phone">Phone</DropdownItem>
                                    <DropdownItem  onClick={() => this.handleChange("doi")} value="doi">Date Of Installation</DropdownItem>
                                    <DropdownItem  onClick={() => this.handleChange("address")} value="address">Address</DropdownItem>
                                    <DropdownItem  onClick={() => this.handleChange("city")} value="city">City</DropdownItem>
                                    <DropdownItem  onClick={() => this.handleChange("district")} value="district">District</DropdownItem>
                                    <DropdownItem  onClick={() => this.handleChange("state")} value="state"> State</DropdownItem>
                                </DropdownMenu>
                                </Dropdown>
                                </Col>
                                <Col md={3}>
                                <FormGroup>
                                
                                    <Input type="text" id="fieldval" name="fieldval" placeholder="Field Value"
                                        innerRef={(input) => this.fieldval = input} />
                                 </FormGroup>
                                </Col>
                                <Col md={3}>
                                <Link to={`/editConsumer/${this.props.id}`}>
                                <Button onClick={this.handleSubmit}  type="button" color="primary">
                                        Change
                                   </Button>
                                </Link>
                                   
                                </Col>
                            </Row>
                        </Form>
                        <br></br> <br></br>
        
                    </div>
                );
                }
                else {
                    return(
                        <div>
                            <h1>Invalid Consumer Id</h1>
                        </div>
                    );
                }
            }
        
    }
}

export default EditConsumer;