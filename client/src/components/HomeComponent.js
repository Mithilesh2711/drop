import React, { Component } from 'react';
import { Input, Button ,Jumbotron , Label, Modal, ModalBody, ModalHeader, Form, FormGroup, Row, Col} from 'reactstrap';
import { Loading } from './LoadingComponent';
import {Link} from 'react-router-dom';
import ReactSearchBox from 'react-search-box';
import  Carousels  from "../components/CarouselComponent";
import CarouselsOffer from "../components/CarouselOfferComponent";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false,
            isModalOpen: false,
            isModalOpenStaff: false ,
            firstname: '',
            lastname:'',
            reading: null,
            city: '',
            state: '',
            district: '',
            address:'',
            doi:'',
            id:'',
            phone:'',
            id2:'',
            id3:'', 
            charge:null,
            repos: [],
            key:'',
            contactFirstname:'',
            contactLastname:'',
            contactAddress:'',
            contactPhone:null,
            contactZip:null,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getLocation= this.getLocation.bind(this);
        this.stateHandel= this.stateHandel.bind(this);
        this.getId= this.getId.bind(this);
        this.toggleModalStaff = this.toggleModalStaff.bind(this);
        this.handleSubmitStaff = this.handleSubmitStaff.bind(this);
        this.handleCharge = this.handleCharge.bind(this);
        this.handleFeedback = this.handleFeedback.bind(this);
        this.searchKey = this.searchKey.bind(this);    
        this.getItemsAsync = this.getItemsAsync.bind(this);
        this.handleContact = this.handleContact.bind(this);
        this.handleBooking = this.handleBooking.bind(this);
    }

    handleFeedback() {
        this.props.fetchFeedbacks();
    }


    handleBooking() {
        this.props.fetchBokings();
    }

    handleContact() {
       
            var ob= {firstname:this.state.contactFirstname, lastname:this.state.contactLastname, phone: this.state.contactPhone,
                      address:this.state.contactAddress, zip: this.state.contactZip};

            
            fetch('/contact', {
                method: 'POST',
                headers: { 
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(ob),
                credentials: 'same-origin'
            })
            .then(response => {
                if (response.ok) {
                    console.log("success");
                    return response;
                } else {
                    console.log("err1");
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
                },
                error => {
                    console.log("Err",error);
                    throw error;
                })
            .then(response => response.json())
            .then(response => {
                if(response.success) {
                    alert(response.msg);
                }
             })
            .catch(error => {alert("Failed to send Details: ",error)});
    }

    handleCharge() {

            var ob = {"charge":this.state.charge}
            const bearer = 'Bearer ' + localStorage.getItem('token');
            console.log("fetch");
        
            fetch('/values/', {
                method: 'POST',
                headers: { 
                    'Content-Type':'application/json' ,
                    'Authorization': bearer
                },
                body: JSON.stringify(ob),
                credentials: 'same-origin'
            })
            .then(response => {
                if (response.ok) {
                    console.log("success");
                    return response;
                } else {
                    console.log("err1");
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
                },
                error => {
                    console.log("Err",error);
                    throw error;
                })
            .then(response => response.json())
            .then(response => {
                if(response.status) {
                    alert("Charge Value Changed");
                }
             })
            .catch(error => error);
    

    }

    stateHandel(val1,val2,val3,val4) {
        this.setState({
           city: val1,
           district: val2,
           state: val3,
           address: val4
        });
    }
    

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    toggleModalStaff () {
        this.setState({
            isModalOpenStaff: !this.state.isModalOpenStaff
        });
    }

    searchKey(val) {
        this.setState({
            key: val.split("/")[1]
        });
    }

    handleSubmitStaff() {
        this.toggleModalStaff();

        var ob= {firstname:this.firstname.value, lastname:this.lastname.value,
            username: this.username.value, password: this.password.value};

            const bearer = 'Bearer ' + localStorage.getItem('token');
            console.log("fetch");
        
            fetch('/users/signupStaff', {
                method: 'POST',
                headers: { 
                    'Content-Type':'application/json' ,
                    'Authorization': bearer
                },
                body: JSON.stringify(ob),
                credentials: 'same-origin'
            })
            .then(response => {
                console.log("res staff",response);
                if (response.ok) {
                    console.log("success");
                    return response;
                } else {
                    console.log("err1");
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
                },
                error => {
                    console.log("Err",error);
                    throw error;
                })
            .then(response => response.json())
            .then(response => {
                if(response.success) {
                    alert(response.status);
                }
             })
            .catch(error => {alert("Failed to create Staff: ",error)});
    

    }

    getId() {
   
        String.prototype.lpad = function(padString, length) {
            var str = this;
            while (str.length < length)
                str = padString + str;
            return str;
        }

        var count=1;

        fetch('/consumer/')
        .then(response => {
            if (response.ok) {
                return response;
            } 
            })
            
        .then(response => {
            if(response)
            return response.json();
        })
        .then(response => {
            
            if(response) {
                count=response.length +1;
            }
            else
            count = 1;
        
            var tid = this.state.state.slice(0,2).toUpperCase() + this.state.district.slice(0,2).toUpperCase() +
            this.state.doi.split("-")[0].slice(2) + this.state.doi.split("-")[1]+count.toString().lpad("0",4)  ;
        
            this.setState({
                id:tid
            })
        })

            
    }

    handleSubmit(event) {
    
        this.toggleModal();
        this.props.createConsumer({id: this.state.id, firstname: this.state.firstname, lastname: this.state.lastname, 
            doi:this.state.doi, reading:this.state.reading , address:this.state.address, city:this.state.city, 
            district:this.state.district, state: this.state.state, phone: this.state.phone});
        event.preventDefault();

    }

    getLocation(event) {

        const showPosition = (position) =>{

            var apikey = '76033ff8adfd4e0d9fc2434940fbebd0';
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            var api_url = 'https://api.opencagedata.com/geocode/v1/json'

            var request_url = api_url
                + '?'
                + 'key=' + apikey
                + '&q=' + encodeURIComponent(latitude + ',' + longitude) 
                + '&pretty=1'
                + '&no_annotations=1';

            // see full list of required and optional parameters:23.6269983
            // https://opencagedata.com/api#forward

            var request = new XMLHttpRequest();
            request.open('GET', request_url, true);

            request.onload = function() {
                // see full list of possible response codes:
                // https://opencagedata.com/api#codes

                if (request.status == 200){ 
                // Success!
                var data = JSON.parse(request.responseText);
                console.log("data: ",data);
                //document.getElementById("cit").value=data.results[0].components.town;
                
                this.stateHandel(data.results[0].components.town,data.results[0].components.state_district,
                    data.results[0].components.state,data.results[0].components.suburb)
                //this.firstname.value=data.results[0].components.town;
                //this.state.value=data.results[0].components.state;
                return data;

                } else if (request.status <= 500){ 
                // We reached our target server, but it returned an error
                                    
                console.log("unable to geocode! Response code: " + request.status);
                var data = JSON.parse(request.responseText);
                console.log(data.status.message);
                } else {
                console.log("server error");
                }
            }.bind(this);

            request.onerror = function() {
                // There was a connection error of some sort
                console.log("unable to connect to server");        
            };

            request.send(); 
          }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
          
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      }


      
  getItemsAsync(value) {
    fetch("/consumer").then( (response) => {
      if(response.ok)  
      return response.json();
      else
      alert("No consumer available")
    }).then((results) => {
      if(results.length){
        let items = results.map( (res) => { return { value: res.firstname + "/" +res.id } })
        this.setState({ repos: items })
      }
    });
    this.setState({key:value.split("/")[1]});
  }
    

    render() {
        if(this.props.auth.isAuthenticated) {
            
            if (this.props.auth.isLoading) {
                return(
                    <div className="container">
                        <div className="row">
                            <Loading />
                        </div>
                    </div>
                );
            }
            else if (this.props.auth.errMess) {
                return(
                    <div className="container">
                        <div className="row">
                            <h4>{this.props.auth.errMess}</h4>
                        </div>
                    </div>
                )
            }
            else if(this.props.auth.isAdmin) {
                return(
                    
                    <div className="container">
                       <h1>Admin Page</h1>

                       <div className="row row-rows">
                            <div className="col-12 col-sm-4 my-2">
                                <Button color="primary" outline onClick={this.toggleModal}>
                                    Create Consumer
                                </Button>
                            </div>
                            <div className="col-12 offset-sm-2 col-sm-4 my-2">
                                <ReactSearchBox 
                                    data={this.state.repos}
                                    placeholder='Search Consumer'
                                    multiple={true}
                                    onChange={(val) => this.getItemsAsync(val)}
                                    inputBoxFontSize="100%"
                                    value="" />
                                    
                                <Link to={`editConsumer/${this.state.key}`}>
                                    <Button className="mt-1" outline  type="button" >Search</Button>
                                </Link>  
                            </div>
                       </div>


                       <div className="row row-rows">
                            <div className="col-12 col-sm-4 my-2">
                                <Button color="primary" outline onClick={this.toggleModalStaff}>
                                    Create Staff
                                </Button>
                            </div>
                            <div className="col-12 offset-sm-2 col-sm-4 my-2">
                                
                            <Input   type="text" id="cid" name="cid" placeholder="Consumer Id"
                            value={this.state.id2} onChange={(e) => {this.setState({id2: e.target.value })}} />
                        
                            <Link to={`/editConsumer/${this.state.id2}`}>
                                <Button className="mt-1" outline type="submit" >
                                    Edit Consumer
                                </Button>
                            </Link>
                            </div>
                       </div>

                       <div className="row row-rows">
                            <div className="col-12 col-sm-4 my-2">
                                <Link to="/feedback">
                                    <Button color="primary" outline  onClick={this.handleFeedback}  type="button" >See Feedbacks</Button>
                                </Link>
                            </div>
                            
                            <div className="col-12 offset-sm-2 col-sm-4 my-2">
                    
                                    <Input placeholder="Charge per reading" type="number" name="charge" id="charge" value={this.state.charge} onChange={(e) => {this.setState({charge: e.target.value })}}/>
                            
                                <Button className="mt-1" outline onClick={this.handleCharge}  type="button" >Change Charge</Button>
                            </div>
                       </div>

                       <div className="row row-rows">
                            <div className="col-12 col-sm-4 my-2">
                                <Link to="/booking">
                                    <Button color="primary" outline   type="button" >Booking Requests</Button>
                                </Link>
                            </div>
                       </div>

                       <br></br> <br></br>

                       
                        <Modal isOpen={this.state.isModalOpenStaff} toggle={this.toggleModalStaff}>
                        <ModalHeader toggle={this.toggleModalStaff}>Create Staff</ModalHeader>
                        <ModalBody>
                            <Form>
                                <FormGroup>
                                    <Label htmlFor="firstname">First Name</Label>
                                    <Input type="text" id="firstname" name="firstname"
                                        innerRef={(input) => this.firstname = input} />
                                </FormGroup>
                                <FormGroup>
                                    <Label htmlFor="lastname">Last Name</Label>
                                    <Input type="text" id="lastname" name="lastname"
                                        innerRef={(input) => this.lastname = input}  />
                                </FormGroup>
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
                                <Button  onClick={this.handleSubmitStaff} type="button" value="submit" color="primary">Create</Button>
                            </Form>
                        </ModalBody>
                        </Modal>

                        
            

                        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                            <ModalHeader toggle={this.toggleModal}>Create Consumer</ModalHeader>
                            <ModalBody>
                            <Form onSubmit={this.handleSubmit} >
                            <FormGroup>
                                <Label htmlFor="firstname">First Name</Label>
                                <Input type="text" id="firstname" name="firstname"
                                    value={this.state.firstname} onChange={(e) => {this.setState({firstname: e.target.value })}} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="lastname">Last Name</Label>
                                <Input type="lastname" id="lastname" name="lastname"
                                    value={this.state.lastname} onChange={(e) => {this.setState({lastname: e.target.value })}} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="doi">Date of Installation</Label>
                                <Input
                                type="date"
                                name="doi"
                                id="doi"
                                placeholder="DOI"
                                value={this.state.doi} onChange={(e) => {this.setState({doi: e.target.value })}}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="reading">Reading</Label>
                                <Input
                                type="number"
                                name="reading"
                                id="reading"
                                placeholder="Reading"
                                value={this.state.reading} onChange={(e) => {this.setState({reading: e.target.value })}}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="phone">Phone No.</Label>
                                <Input
                                type="string"
                                name="phone"
                                id="phone"
                                placeholder="Contact No."
                                value={this.state.phone} onChange={(e) => {this.setState({phone: e.target.value })}}
                                />
                            </FormGroup>
                            <Button onClick={this.getLocation} type="button" value="submit" color="info">Get Address</Button>
                            <FormGroup>
                                <Label htmlFor="address">Address</Label>
                                <Input type="text" name="address" id="address" 
                                placeholder="Apartment, studio, or floor"
                                value={this.state.address} onChange={(e) => {this.setState({address: e.target.value })}}/>
                            </FormGroup>
                             <Row form>
                                 <Col md={3}>
                                <FormGroup>
                                    <Label htmlFor="city">City</Label>
                                    <Input  type="text" name="city" id="city" value={this.state.city} onChange={(e) => {this.setState({city: e.target.value })}}/>
                                </FormGroup>
                                </Col>
                                <Col md={3}>
                                <FormGroup>
                                    <Label htmlFor="district">District</Label>
                                    <Input  type="text" name="district" id="district" value={this.state.district} onChange={(e) => {this.setState({district: e.target.value })}}/>
                                </FormGroup>
                                </Col>
                                <Col md={4}>
                                <FormGroup>
                                    <Label htmlFor="state">State</Label>
                                    <Input type="text" name="state" id="state" value={this.state.state} onChange={(e) => {this.setState({state: e.target.value })}}/>
                                </FormGroup>
                                </Col>
                            </Row>  
                            <Button onClick={this.getId} type="button" value="submit" color="info">Get ConsumerId</Button>
                            <FormGroup>
                                    <Label htmlFor="state">Consumer Id</Label>
                                    <Input type="text" name="state" id="state" value={this.state.id} onChange={(e) => {this.setState({id: e.target.value })}}/>
                            </FormGroup>
                            <Button  type="submit"  color="primary">Create</Button>
                        </Form>
                            </ModalBody>
                        </Modal>
                        

                        
                    </div>
                );
            }

            else if(!this.props.auth.isAdmin) {
                return(
                    <div>
                       <h1>Only For Admin</h1>
                    </div>
                );
            }
        }

        else {
            return(
                <div>
                <Carousels />
                    <Jumbotron>
                        <div className="container">
                            <div className="row row-header">
                                <div className="col-12 col-sm-5">
                                    <h1>Drop Welcomes You</h1>
                                    <p>Welcome to the best water service that provides pure and mineralized water 
                                        in cheap rates.</p>
                                </div>
                                <div className="col-12 col-sm-5 offset-sm-2">
                                    <h3>Consumer Login</h3>
                                        <Form>
                                        <Input type="text" id="id" name="id"
                                        value={this.state.id3} onChange={(e) => {this.setState({id3: e.target.value })}} />
                                        <Link to={`/consumer/${this.state.id3}`}>
                                            <Button className="mt-2" outline type="submit" >
                                                Submit
                                            </Button>
                                        </Link>
                                        </Form>
                                </div>
                            </div>
                        </div>
                    </Jumbotron>
                    <CarouselsOffer />
                    <div className="container bg-light my-4 justify-item-center">
                        <h2>Contact for Registration</h2>
                        <h6>Submit your details and our team will get to you soon</h6>
                    <form class="row g-3" onSubmit={this.handleContact}>
                        <div class="col-md-4 my-2">
                            <div class="form-outline">
                            <input
                                type="text"
                                class="form-control"
                                id="validationDefault01"
                                value={this.state.contactFirstname} 
                                onChange={(e) => {this.setState({contactFirstname: e.target.value })}}
                                required
                            />
                            <label for="validationDefault01" class="form-label">First name</label>
                            </div>
                        </div>
                        <div class="col-md-4 my-2">
                            <div class="form-outline">
                            <input
                                type="text"
                                class="form-control"
                                id="validationDefault02"
                                value={this.state.contactLastname} 
                                onChange={(e) => {this.setState({contactLastname: e.target.value })}}
                                required
                            />
                            <label for="validationDefault02" class="form-label">Last name</label>
                            </div>
                        </div>
                        <div class="col-md-4 my-2">
                            <div class="input-group form-outline">
                            <input
                                type="number"
                                class="form-control"
                                id="validationDefault04"
                                aria-describedby="inputGroupPrepend2"
                                value={this.state.contactPhone} 
                                onChange={(e) => {this.setState({contactPhone: e.target.value })}}
                                required
                            />
                            <br></br>
                            <label for="validationDefault04" class="form-label mt-1">Phone Number</label>
                            </div>
                        </div>
                        <div class="col-md-7 my-2">
                            <div class="form-outline">
                            <input type="text" class="form-control" id="validationDefault03"
                            value={this.state.contactAddress} 
                            onChange={(e) => {this.setState({contactAddress: e.target.value })}}
                             required />
                            <label for="validationDefault03" class="form-label">Address</label>
                            </div>
                        </div>
                        <div class="col-md-4 my-2">
                            <div class="form-outline">
                            <input type="number" class="form-control" id="validationDefault05"
                            value={this.state.contactZip} 
                            onChange={(e) => {this.setState({contactZip: e.target.value })}}
                            required />
                            <label for="validationDefault05" class="form-label">Zip</label>
                            </div>
                        </div>
                        <div class="col-12 mb-2">
                            <button class="btn btn-primary" type="submit">Submit form</button>
                        </div>
                    </form>
                    </div>
                </div>
            );
        }
    }
}

export default Home;