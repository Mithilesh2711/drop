import React, {Component } from 'react';
import { Bookings } from '../redux/bookings';
import { Loading } from './LoadingComponent';

class Booking extends Component {

    constructor(props) {
        super(props);
    }

    render() {
               
        if(this.props.isLoading) {
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
            const products = this.props.booking;     
          console.log("prod",products)  
            return(
                <div className="container">
                     <div className="text-center">
                         <h1>Booking Requests</h1>
                     </div>
                     
                     <div >
                     <table className="table table-striped">
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Zip</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                          return  (
                        <tr key={product._id}>
                            <td>{product.firstname + " " + product.lastname}</td>
                            <td>{product.phone}</td>
                            <td>{(product.address)}</td>
                            <td> {product.zip}</td>
                        </tr>
                        );
                       
                        })}
                    </tbody>
                    </table>
                
                     </div>
                </div>
            );
    
        }
    }
}

export default Booking;