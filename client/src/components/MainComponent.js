import React, {Component} from 'react';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import Home from './HomeComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import AdminLogin from './AdminLoginComponent';
import About from "./AboutComponent";
import EditConsumer  from './EditConsumerComponent';
import Payment from './PaymentComponent'
import Consumer from './ConsumerComponent';
import {Loading} from './LoadingComponent';
import Feedback from './FeedbackComponent';
import Booking from "./BookingComponent";
import { connect } from 'react-redux';
import { loginUser, logoutUser, createConsumer,fetchConsumers, fetchPayments, fetchFeedbacks, fetchBookings } from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
      auth: state.auth,
      consumers: state.consumers,
      payments: state.payments,
      feedbacks: state.feedbacks,
      bookings: state.bookings
    }
}

const mapDispatchToProps = (dispatch) => ({
  loginUser: (creds) => dispatch(loginUser(creds)),
  logoutUser: () => dispatch(logoutUser()),
  createConsumer: (data) => dispatch(createConsumer(data)),
  fetchConsumers: () => {dispatch(fetchConsumers())},
  fetchPayments: () => {dispatch(fetchPayments())},
  fetchFeedbacks: () => {dispatch(fetchFeedbacks())},
  fetchBookings: () => {dispatch(fetchBookings())}
});

class Main extends Component {

  constructor(props) {
    super(props);
 
  }

   componentDidMount() {
    this.props.fetchFeedbacks();
    this.props.fetchConsumers();
    this.props.fetchPayments();
    this.props.fetchBookings();
   }

   

    render() {
      const editWithId = ({match}) => {
         return(
          <EditConsumer 
          consumers={this.props.consumers}
          isLoading={this.props.consumers.isLoading}  errMess={this.props.consumers.errMess} 
          id={match.params.cid} fetchConsumers={this.props.fetchConsumers} 
          />
        );
      }

      

      const consumerWithId = ({match}) => {
        return(
              <Consumer 
            consumer={this.props.consumers.consumers.filter((consumer) => consumer.id === match.params.cid)[0]}
            isLoading={this.props.consumers.isLoading}  errMess={this.props.consumers.errMess} 
            id={match.params.cid} auth={this.props.auth} loginUser={this.props.loginUser } 
            logoutUser={this.props.logoutUser}  fetchPayments={this.props.fetchPayments}
            payments = {this.props.payments}
            //dues ={this.props.payments.payments.filter((payments) => payments.cid === match.params.cid)[0].dues}
            //closeReading={this.props.payments.payments.filter((payments) => payments.cid === match.params.cid)[0].payments.reverse()[0].closeReading}
            />
            );
        
      }

      const payment = ({match}) => {
           return(
            <Payment
            payments = {this.props.payments}
            isLoading={this.props.payments.isLoading}  
            errMess={this.props.payments.errMess} 
            id={match.params.cid}
            consumers = {this.props.consumers}
            consumer={this.props.consumers.consumers.filter((consumer) => consumer.id === match.params.cid)[0]}
            />
          );
      }

        const feedback= () => {
          return(
            <Feedback feedback={this.props.feedbacks.feedbacks} 
            isLoading={this.props.feedbacks.isLoading} errMess={this.props.feedbacks.errMess} />
          );
        }
    
        const booking= () => {
          return(
            <Booking booking={this.props.bookings.bookings} 
            isLoading={this.props.bookings.isLoading} errMess={this.props.bookings.errMess} />
          );
        }
      

      return (
      
          <div>
            {console.log("render")}
              <Header/>
              <Switch>
                <Route exact path="/" component={() => <Home auth={this.props.auth} createConsumer={this.props.createConsumer}
                    fetchFeedbacks={this.props.fetchFeedbacks}   fetchBookings={this.props.fetchBookings}/>} />
                <Route  path="/home" component={() => <Home auth={this.props.auth} fetchFeedbacks={this.props.fetchFeedbacks}
                     createConsumer={this.props.createConsumer} fetchBookings={this.props.fetchBookings}  />} />
                <Route path="/aboutus" component={() => <About/>} />
                <Route path="/editConsumer/:cid" component={editWithId} />
                <Route path="/consumer/:cid" component={consumerWithId} />
                <Route path="/payments/:cid" component={payment} />
                <Route path="/feedback" component={feedback} />
                <Route path="/booking" component={booking} />
              </Switch>
              <Footer/>
              <AdminLogin auth={this.props.auth} loginUser={this.props.loginUser} logoutUser={this.props.logoutUser}/>
          </div>
      );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));