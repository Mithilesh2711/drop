import React, {Component } from 'react';
import { Loading } from './LoadingComponent';
import {Form, Button,  Table} from 'reactstrap';
import {Link} from 'react-router-dom';

class Payment extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        
                      
        if(this.props.isLoading || this.props.consumers.isLoading) {
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
        
        else            
        {
            if(this.props.payments.payments) {
                const products = this.props.payments.payments.filter((payments) => payments.cid === this.props.id)[0].payments;
                products.reverse();
            return(
            <div className="container">
                 <div className="text-center">
                     <h1>Welcome {this.props.consumer.firstname}</h1>
                 </div>
                 <h2><u>Consumer Id: {this.props.id} </u></h2> <br></br>
                 <h3>Payments</h3> <br></br> 
                 <h4>Total Dues : {this.props.payments.payments.filter((payments) => payments.cid === this.props.id)[0].dues}</h4>
                 <div>
                 <table className="table table-striped  table-responsive">
                <thead>
                    <tr>
                    <th>Paid</th>
                    <th>Open Reading</th>
                    <th>Close Reading</th>
                    <th>Method</th>
                    <th>Receiver</th>
                    <th>Date(yyyy/mm/dd)</th>
                    <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => {
                       if(product.image)
                      return  (
                    <tr key={product.pid}>
                        <td>{product.paid}</td>
                        <td>{product.openReading}</td>
                        <td>{product.closeReading}</td>
                        <td>{product.method}</td>
                        <td>{product.receiver}</td>
                        <td>{(product.date).substring(0,10)}</td>
                        <td><a style={{display: "table-cell"}} href = {product.image} 
                        target = "_blank" rel = "noopener noreferrer">Image Link</a></td>
                    </tr>
                    );
                    else
                    return  (
                        <tr key={product.pid}>
                            <td>{product.paid}</td>
                            <td>{product.openReading}</td>
                            <td>{product.closeReading}</td>
                            <td>{product.method}</td>
                            <td>{product.receiver}</td>
                            <td>{(product.date).substring(0,10)}</td>
                            <td></td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            
                 </div>
            </div>
        );
        }
        else 
        return(
            <div>
                <h1>No Payments</h1>
            </div>
        );
     }
    }
}

export default Payment;