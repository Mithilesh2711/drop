import React, {Component } from 'react';
import { Loading } from './LoadingComponent';
import {Form, Button,  Modal, ModalBody, ModalHeader, Input, FormGroup, Label, NavbarText} from 'reactstrap';
import {Link} from 'react-router-dom';
import ImageUploader from 'react-images-upload';

 

class Consumer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            isModalOpenPayment: true,
            isModalOpenFeedback: false,
            picturesFeedback: [],
            pictures: [],
            paid: null,
            openReading: null,
            closeReading: null,
            method:"Cash",
            charge:null,
            prevCharge: 1
        };
      
        this.toggleModal = this.toggleModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.toggleModalPayment= this.toggleModalPayment.bind(this);
        this.handlePayment= this.handlePayment.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDropFeedback = this.onDropFeedback.bind(this);
        this.paymentHistory= this.paymentHistory.bind(this);
        this.toggleModalFeedback= this.toggleModalFeedback.bind(this);
        this.handleFeedback= this.handleFeedback.bind(this);
        this.returnCharge = this.returnCharge.bind(this);
    }

    toggleModalFeedback() {
        this.setState({
            isModalOpenFeedback: !this.state.isModalOpenFeedback
        });
    }

    componentDidMount() {
        console.log("didmount");
        if(this.state.prevCharge!==this.state.charge)
        {
            this.state.prevCharge=this.state.charge;
            this.returnCharge();
        }
    }

    returnCharge() {
        fetch('/values/')
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
            
            if(response.status) {
                var charge= response.res.charge;
                this.setState({charge: charge})
                
            }
        })
    }

    onDropFeedback(picture) {
        this.setState({
            picturesFeedback: this.state.picturesFeedback.concat(picture),
        });
    }

    handleFeedback(event) {
            
            if (this.state.picturesFeedback.length)
            {
                const imageFile = this.state.picturesFeedback[0];

                const formData = new FormData();
                formData.append('image', imageFile);

                fetch('https://api.imgur.com/3/image', {
                    method: 'POST',
                    headers: new Headers({
                    Authorization: 'Client-ID 0c1e35d60af557a',
                    }),
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                       alert('Image uploaded');
                       return response;  
                    }
                },(err) => alert("Error: ",err))
                .then(response => response.json())
                .then(response => {
                    console.log("imgur",response);

                    var data= {
                        cid: this.props.id,
                        message: this.message.value,
                        image:response.data.link
                    };


                    fetch("/feedback", {
                        method: 'POST',
                        headers: { 
                            'Content-Type':'application/json' 
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => {
                    
                        if (response.ok) {
                            return response;
                        } else {
                            console.log("err1");
                            var error = new Error('Error ' + response.status + ': ' + response.statusText);
                            error.response = response;
                            throw error;
                        }
                        },
                        error => {
                            throw error;
                        })
                    .then(response => response.json())
                    .then(response => {
                        if(response.status) {
                            alert(response.mes);
                        }
                     },(err) => alert(err))
                     .catch((err) =>  alert("Failed to add Payment data: ",err));
                })
                .catch(error => {
                    console.error(JSON.stringify(error));
                    alert('Image Upload failed: ' + error);
                });
                
                
            }

           else{
                var data= {
                    cid: this.props.id,
                    message: this.message.value
                };

              fetch("/feedback", {
                method: 'POST',
                headers: { 
                    'Content-Type':'application/json' 
                },
                body: JSON.stringify(data)
                })
                .then(response => {
                
                    if (response.ok) {
                        return response;
                    } else {
                        console.log("err1");
                        var error = new Error('Error ' + response.status + ': ' + response.statusText);
                        error.response = response;
                        throw error;
                    }
                    },
                    error => {
                        throw error;
                    })
                .then(response => response.json())
                .then(response => {
                    if(response.status) {
                        alert(response.mes);
                    }
                },(err) => alert(err))
                .catch((err) =>  alert("Failed to add Payment data: ",err));
            }
           

            
          
        event.preventDefault();

    }

    paymentHistory() {
        this.props.fetchPayments();
    }

    onDrop(picture) {
        this.setState({
            pictures: this.state.pictures.concat(picture),
        });
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
        });
    }

    toggleModalPayment() {
        this.setState({
            isModalOpenPayment: !this.state.isModalOpenPayment
        });
        if(!this.state.isModalOpenPayment)
        localStorage.setItem('clicked', false);
    }

    handlePayment(event) {

        console.log("state",this.state);
        
        var charge;
        var cid=this.props.id;
        var pid;

        fetch(`/payment/${cid}/pid`)
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
            pid = response.pid



        fetch('/values/')
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
            
            if(response.status) {
                charge= response.res.charge
                console.log("met",this.state);


            if(this.state.method==="Online")
            {
                const imageFile = this.state.pictures[0];

                const formData = new FormData();
                formData.append('image', imageFile);

                fetch('https://api.imgur.com/3/image', {
                    method: 'POST',
                    headers: new Headers({
                    Authorization: 'Client-ID 0c1e35d60af557a',
                    }),
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                       alert('Image uploaded');
                       return response;  
                    }
                },(err) => alert("Error: ",err))
                .then(response => response.json())
                .then(response => {
                    console.log("imgur",response);

                    if(this.props.auth.isAdmin)
                    var data= {
                        paid:this.state.paid,
                        openReading: this.state.openReading,
                        closeReading: this.state.closeReading,
                        method: this.state.method,
                        charge: charge,
                        image: response.data.link
                    } 

                    else
                    var data= {
                        paid:this.state.paid,
                        closeReading: this.state.closeReading,
                        method: this.state.method,
                        charge: charge,
                        image: response.data.link
                    }

                    console.log("data",data);
                    const bearer = 'Bearer ' + localStorage.getItem('token');
                    return fetch(`/payment/${cid}`, {
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
                            console.log("resp",response);
                            return response;
                        } else {
                            console.log("err1");
                            var error = new Error('Error ' + response.status + ': ' + response.statusText);
                            error.response = response;
                            throw error;
                        }
                        },
                        error => {
                            throw error;
                        })
                    .then(response => response.json())
                    .then(response => {
                        if(response.status) {
                            alert(response.msg);
                            this.props.logoutUser();
                        }
                    })
                    .catch((err) => {
                        alert("Failed to add Payment data: ",err)
                        this.props.logoutUser();
                    })
                })
                .catch(error => {
                    console.error(JSON.stringify(error));
                    alert('Image Upload failed: ' + error);
                    this.props.logoutUser();
                });
          }



            else {

                if(this.props.auth.isAdmin)
                var data= {
                paid:this.state.paid,
                openReading: this.state.openReading,
                closeReading: this.state.closeReading,
                method: this.state.method,
                charge: charge
                } 

                else
                var data= {
                    paid:this.state.paid,
                    closeReading: this.state.closeReading,
                    method: this.state.method,
                    charge: charge
                } 
                
            
                console.log("data",data);
                const bearer = 'Bearer ' + localStorage.getItem('token');
                return fetch(`/payment/${cid}`, {
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
                        console.log("resp",response);
                        return response;
                    } else {
                        console.log("err1");
                        var error = new Error('Error ' + response.status + ': ' + response.statusText);
                        error.response = response;
                        throw error;
                    }
                    },
                    error => {
                        throw error;
                    })
                .then(response => response.json())
                .then(response => {
                    console.log("resp1",response)
                    if(response.status) {
                        alert(response.msg);
                        this.props.logoutUser();
                    }
                 })
                 .catch((err) => {
                    alert("Failed to add Payment data: ",err)
                    this.props.logoutUser();
                })
                            
            }

            }
            
        })
        .catch((err) => alert(err));

        })
        .catch((err) => alert("Error:",err));

       // window.location.reload(false);
       // this.props.logoutUser();
        event.preventDefault();
        
        localStorage.setItem('clicked', false);
   }
    

    handleLogin(event) {
        console.log("handleLogin")
        this.toggleModal();
        this.props.loginUser({username: this.username.value, password: this.password.value});
        localStorage.setItem('clicked', true);
        event.preventDefault();

    }

    render() {
        console.log("state1",this.state)

        if(this.props.isLoading || this.props.payments.isLoading) {
            console.log("loading")
            return(
                <Loading />
            );
        }

        else if (this.props.errMess) {
            console.log("error")
            return(
                <h4>{this.props.errMess}</h4>
            );
        }
        else if(this.props.consumers.consumers.filter((consumer) => consumer.id === this.props.id)[0]) {
        if(this.props.auth.isAuthenticated) {
          if(localStorage.getItem('clicked'))  {
            if(this.props.auth.isAdmin)  
             return(
                 <div>
                    <Modal isOpen={this.state.isModalOpenPayment } toggle={this.toggleModalPayment}>
                    <ModalHeader toggle={this.toggleModalPayment}>Payment Details</ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label htmlFor="paid">Paid Amount</Label>
                                <Input type="Number" id="paid" name="paid"
                                value={this.state.paid} onChange={(e) => {this.setState({paid: e.target.value })}} />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="openReading">Open Reading</Label>
                                <Input type="Number" id="openReading" name="openReading"
                                    value={this.state.openReading} onChange={(e) => {this.setState({openReading: e.target.value })}}  />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="closeReading">Close Reading</Label>
                                <Input type="Number" id="closeReading" name="closeReading"
                                    value={this.state.closeReading} onChange={(e) => {this.setState({closeReading: e.target.value })}}  />
                            </FormGroup>
                            <FormGroup>
                                <Label>Payment Method</Label>
                            </FormGroup>  
                            <FormGroup>
                            <select class="browser-default custom-select" name="method" id="method" onChange={(e) => {this.setState({method: e.target.value })}}>
                            <option  value="Cash">Cash</option>
                            <option value="Online">Online</option>
                            </select>   
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="file">Upload image of payment(in Online payment only)</Label>
                                <ImageUploader
                                    withIcon={true}
                                    buttonText='Choose images'
                                    onChange={this.onDrop}
                                    imgExtension={['.jpg','.jpeg', '.gif', '.png', '.gif']}
                                    maxFileSize={5242880}
                                    withPreview={true}
                                    withLabel={true}
                                />
                            </FormGroup>
                            
                            <Button onClick={this.handlePayment} type="button" value="submit" color="primary">Add Payment</Button>
                        </Form>
                    </ModalBody>
                    </Modal>
                 </div>
             );
             else 
             return(
                <div>
                <Modal isOpen={this.state.isModalOpenPayment } toggle={this.toggleModalPayment}>
                <ModalHeader toggle={this.toggleModalPayment}>Payment Details</ModalHeader>
                <ModalBody>
                    <Form>
                        
                        <FormGroup>
                            <Label htmlFor="closeReading">Reading</Label>
                            <Input type="Number" id="closeReading" name="closeReading"
                            placeholder="Enter valid reading"
                                value={this.state.closeReading} onChange={(e) => {this.setState({closeReading: e.target.value })}}  />
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="paid">Paid Amount</Label>
                            <Input type="Number" id="paid" name="paid"
                            value={this.state.paid} onChange={(e) => {this.setState({paid: e.target.value })}} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Payment Method</Label>
                        </FormGroup>  
                        <FormGroup>
                        <select class="browser-default custom-select" name="method" id="method" onChange={(e) => {this.setState({method: e.target.value })}}>
                        <option  value="Cash">Cash</option>
                        <option value="Online">Online</option>
                        </select>   
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="file">Upload image of payment(in Online payment only)</Label>
                            <ImageUploader
                                withIcon={true}
                                buttonText='Choose images'
                                onChange={this.onDrop}
                                imgExtension={['.jpg','.jpeg', '.gif', '.png', '.gif']}
                                maxFileSize={5242880}
                                withPreview={true}
                                withLabel={true}
                            />
                        </FormGroup>
                        {this.props.payments.payments.filter(
                           (payments) => payments.cid === this.props.id)[0].payments.reverse()[0].closeReading > this.state.closeReading ?
                           console.log("Enter valid reading.") :
                           <Button onClick={this.handlePayment} type="button" value="submit" color="primary">Add Payment</Button>
                         }
                       
                        
                    </Form>
                </ModalBody>
                </Modal>
             </div>
             );
          }
        }


        if(this.props.payments.payments.filter((payments) => payments.cid === this.props.id)[0]) {
            console.log("pay-len",this.props.payments.payments.filter((payments) => payments.cid === this.props.id)[0])
            localStorage.setItem('clicked', false);
        return(
            <div className="container">
                 <div className="text-center">
                     <h1>Welcome {this.props.consumer.firstname}</h1>
                 </div>
                 <h2><u>Consumer Details:</u></h2> <br></br>
                 <div>
                    <em>
                        <h4><span className="fld">Consumer Id : </span> <span className="val">{this.props.consumer.id}</span></h4>
                        <h4><span className="fld">Name : </span> <span className="val">{this.props.consumer.firstname + " " + 
                             this.props.consumer.lastname}</span></h4>
                        <h4><span className="fld">Phone : </span> <span className="val">{this.props.consumer.phone}</span></h4>
                        <h4><span className="fld">Address : </span> <span className="val">{this.props.consumer.address + 
                        ", " + this.props.consumer.city + ", " + this.props.consumer.district + ", " + this.props.consumer.state}</span></h4> 
                        <h4><span className="fld">Date of Installation(yyyy/mm/dd) : </span> <span className="val">{this.props.consumer.doi}</span></h4>
                        <h4><span className="fld">Charge per Reading : </span> <span className="val">{this.state.charge}</span></h4>
                        <h4><span className="fld">Open Reading : </span> <span className="val">{this.props.payments.payments.filter((payments) => payments.cid === this.props.id)[0].payments.reverse()[0].closeReading}</span></h4>
                        <h4><span className="fld">Total Dues : </span> <span className="val">{this.props.payments.payments.filter((payments) => payments.cid === this.props.id)[0].dues}</span></h4>
                    </em>   
                 </div><br></br><br></br>

                 
                    
            
                 <Link to={`/payments/${this.props.id}`}>
                 <Button  type="button" onClick={this.props.fetchPayments} >
                        Payment History
                    </Button>
                 </Link>

                 <br></br><br></br>

                 <Label><strong>Login For Payment</strong> <em>(only via staff members)  </em> </Label> &nbsp;
                 <Button className="btn btm-lg" type="button" onClick={this.toggleModal}>
                    Login
                 </Button>
                 <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                <ModalBody>
                    <Form>
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
                        <Button onClick={this.handleLogin} type="button" value="submit" color="primary">Login</Button>
                    </Form>
                </ModalBody>
                </Modal>

                <br></br> <br></br>

                <Button  type="button" onClick={this.toggleModalFeedback}>
                    Send Feedback
                 </Button>
                 <Modal isOpen={this.state.isModalOpenFeedback} toggle={this.toggleModalFeedback}>
                <ModalHeader toggle={this.toggleModalFeedback}>Feedback</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label htmlFor="message">Feedback</Label>
                            <Input type="textarea" className="form-control z-depth-1" id="message" name="message"
                                rows="3" placeholder="Feedback or Complain"
                                innerRef={(input) => this.message = input} />
                        </FormGroup>
                        <FormGroup>
                                <Label htmlFor="file">Upload image as Feedback.</Label>
                                <ImageUploader
                                    withIcon={true}
                                    buttonText='Choose images'
                                    onChange={this.onDropFeedback}
                                    imgExtension={['.jpg','.jpeg', '.gif', '.png', '.gif']}
                                    maxFileSize={5242880}
                                    withPreview={true}
                                    withLabel={true}
                                />
                        </FormGroup>
                        <Button onClick={this.handleFeedback} type="button" value="submit" color="primary">Submit</Button>
                    </Form>
                </ModalBody>
                </Modal>

            </div>
        );
     }

        else {
            localStorage.setItem('clicked', false);
        return(
            <div className="container">
                 <div className="text-center">
                     <h1>Welcome {this.props.consumer.firstname}</h1>
                 </div>
                 <h2><u>Consumer Details:</u></h2> <br></br>
                 <div>
                    <em>
                        <h4><span className="fld">Consumer Id : </span> <span className="val">{this.props.consumer.id}</span></h4>
                        <h4><span className="fld">Name : </span> <span className="val">{this.props.consumer.firstname + " " + 
                             this.props.consumer.lastname}</span></h4>
                        <h4><span className="fld">Phone : </span> <span className="val">{this.props.consumer.phone}</span></h4>
                        <h4><span className="fld">Address : </span> <span className="val">{this.props.consumer.address + 
                        ", " + this.props.consumer.city + ", " + this.props.consumer.district + ", " + this.props.consumer.state}</span></h4> 
                        <h4><span className="fld">Date of Installation(yyyy/mm/dd) : </span> <span className="val">{this.props.consumer.doi}</span></h4>
                        <h4><span className="fld">Charge per Reading : </span> <span className="val">{this.state.charge}</span></h4>
                    </em>   
                 </div><br></br><br></br>

                 <Label><strong>Login For Payment </strong>(only via staff members) </Label>
                 <Button type="button" onClick={this.toggleModal}>
                    Login
                 </Button>
                 <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                <ModalBody>
                    <Form>
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
                        <Button onClick={this.handleLogin} type="button" value="submit" color="primary">Login</Button>
                    </Form>
                </ModalBody>
                </Modal>

                <br></br> <br></br>
                <Button  type="button" onClick={this.toggleModalFeedback}>
                    Send Feedback
                 </Button>
                 <Modal isOpen={this.state.isModalOpenFeedback} toggle={this.toggleModalFeedback}>
                <ModalHeader toggle={this.toggleModalFeedback}>Feedback</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label htmlFor="message">Feedback</Label>
                            <Input type="textarea" className="form-control z-depth-1" id="message" name="message"
                                rows="3" placeholder="Feedback or Complain"
                                innerRef={(input) => this.message = input} />
                        </FormGroup>
                        <FormGroup>
                                <Label htmlFor="file">Provide image as feedback</Label>
                                <ImageUploader
                                    withIcon={true}
                                    buttonText='Choose images'
                                    onChange={this.onDropFeedback}
                                    imgExtension={['.jpg','.jpeg', '.gif', '.png', '.gif']}
                                    maxFileSize={5242880}
                                    withPreview={true}
                                    withLabel={true}
                                />
                        </FormGroup>
                        <Button onClick={this.handleFeedback} type="button" value="submit" color="primary">Submit</Button>
                    </Form>
                </ModalBody>
                </Modal>
            </div>
        );
        
    }

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

export default Consumer;