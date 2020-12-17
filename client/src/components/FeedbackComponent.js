import React, {Component } from 'react';
import { Loading } from './LoadingComponent';

class Feedback extends Component {

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
            const products = this.props.feedback;     
          console.log("prod",products)  
            return(
                <div className="container">
                     <div className="text-center">
                         <h1>Consumer Feedbacks</h1>
                     </div>
                     
                     <div >
                     <table className="table table-striped">
                    <thead>
                        <tr>
                        <th>Consumer Id</th>
                        <th>Message</th>
                        <th>Date(yyyy/mm/dd)</th>
                        <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                           if(product.image)
                          return  (
                        <tr key={product._id}>
                            <td>{product.cid}</td>
                            <td>{product.message}</td>
                            <td>{(product.date).substring(0,10)}</td>
                            <td><a style={{display: "table-cell"}} href = {product.image} 
                            target = "_blank" rel = "noopener noreferrer">Image Link</a></td>
                        </tr>
                        );
                        else
                        return  (
                            <tr key={product._id}>
                            <td>{product.cid}</td>
                            <td>{product.message}</td>
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
    }
}

export default Feedback;