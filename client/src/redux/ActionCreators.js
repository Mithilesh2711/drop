import * as ActionTypes from './ActionTypes';

export const requestLogin = (creds) => {
    return {
        type: ActionTypes.LOGIN_REQUEST,
        creds
    }
}
  
export const receiveLogin = (response) => {
    if(!response.admin) {
        return {
            type: ActionTypes.LOGIN_STAFF,
            token: response.token
        }
    }

    else {
        return {
            type: ActionTypes.LOGIN_ADMIN,
            token: response.token
        }   
    }
}
  
export const loginError = (message) => {
    return {
        type: ActionTypes.LOGIN_FAILURE,
        message
    }
}

export const loginUser = (creds) => (dispatch) => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds))

    return fetch('/users/login', {
        method: 'POST',
        headers: { 
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(creds)
    })
    .then(response => {
        if (response.ok) {
            return response;
        } else {
            alert("Incorrect Username or Password");
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
        if (response.success) {
            // If login was successful, set the token in local storage
            localStorage.setItem('token', response.token);
            localStorage.setItem('creds', JSON.stringify(creds));
            localStorage.setItem('admin', response.admin);
            // Dispatch the success action
            console.log("admin",localStorage.getItem('admin'));
            dispatch(receiveLogin(response));
        }
        else {
            var error = new Error('Error ' + response.status);
            error.response = response;
            throw error;
        }
    })
    .catch(error => dispatch(loginError(error.message)))
};

export const createConsumer = (data) => (dispatch) => {

    const bearer = 'Bearer ' + localStorage.getItem('token');
    console.log("dat-",JSON.stringify(data));

    return fetch('/consumer/create/', {
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
         return  dispatch(addConsumer(response.res));
        }
     })
    .catch(error => alert("Failed to create consumer: ",error));
};



export const editConsumer = (data) => (dispatch) => {
    dispatch(consumersLoading(true));
    const bearer = 'Bearer ' + localStorage.getItem('token');
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
            throw error;
        }
        },
        error => {
            throw error;
        })
    .then(response => response.json())
    .then(response => {
        alert("Data Changed Successfully!");
        return  dispatch(addConsumers(response));
     })
    .catch(error => dispatch(consumersFailed(error.message)));

};

export const addConsumer = (data) => {

    return({ type: ActionTypes.ADD_CONSUMER,
    payload: data
});}

export const requestLogout = () => {
    return {
      type: ActionTypes.LOGOUT_REQUEST
    }
}
  
export const receiveLogout = () => {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    }
}

// Logs the user out
export const logoutUser = () => (dispatch) => {
    dispatch(requestLogout())
    localStorage.removeItem('token');
    localStorage.removeItem('creds');
    localStorage.removeItem('admin');
    dispatch(receiveLogout())
}


export const fetchConsumers = () => (dispatch) => {
    dispatch(consumersLoading(true));

    return fetch('/consumer')
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => {
            return response.json();
        })
        .then(consumers => {
            console.log("items : ",consumers);
            return  dispatch(addConsumers(consumers));
        })
        .catch(error => dispatch(consumersFailed(error.message)));
}


export const consumersLoading = () => ({
    type: ActionTypes.CONSUMERS_LOADING
});

export const consumersFailed = (errmess) => ({
    type: ActionTypes.CONSUMERS_FAILED,
    payload: errmess
});

export const addConsumers = (consumers) => ({
    type: ActionTypes.ADD_CONSUMERS,
    payload: consumers
});



export const fetchPayments = () => (dispatch) => {
    dispatch(paymentsLoading(true));

    return fetch(`/payment/payments`)
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => {
            return response.json();
        })
        .then(payments => {
            return  dispatch(addPayments(payments));
        })
        .catch(error => dispatch(paymentsFailed(error.message)));
}


export const paymentsLoading = () => ({
    type: ActionTypes.PAYMENTS_LOADING
});

export const paymentsFailed = (errmess) => ({
    type: ActionTypes.PAYMENTS_FAILED,
    payload: errmess
});

export const addPayments = (payments) => ({
    type: ActionTypes.ADD_PAYMENTS,
    payload: payments
});





export const fetchFeedbacks = () => (dispatch) => {
    dispatch(feedbacksLoading(true));

    return fetch('/feedback')
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => {
            return response.json();
        })
        .then(feedbacks => {
            return  dispatch(addFeedbacks(feedbacks));
        })
        .catch(error => dispatch(feedbacksFailed(error.message)));
}


export const feedbacksLoading = () => ({
    type: ActionTypes.FEEDBACKS_LOADING
});

export const feedbacksFailed = (errmess) => ({
    type: ActionTypes.FEEDBACKS_FAILED,
    payload: errmess
});

export const addFeedbacks = (feedbacks) => ({
    type: ActionTypes.ADD_FEEDBACKS,
    payload: feedbacks
});

export const fetchBookings = () => (dispatch) => {
    dispatch(bookingsLoading(true));

    return fetch('/contact')
        .then(response => {
            if (response.ok) {
                return response;
            }
            else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        },
        error => {
            var errmess = new Error(error.message);
            throw errmess;
        })
        .then(response => {
            return response.json();
        })
        .then(bookings => {
            return  dispatch(addBookings(bookings));
        })
        .catch(error => dispatch(bookingsFailed(error.message)));
}


export const bookingsLoading = () => ({
    type: ActionTypes.BOOKINGS_LOADING
});

export const bookingsFailed = (errmess) => ({
    type: ActionTypes.BOOKINGS_FAILED,
    payload: errmess
});

export const addBookings = (bookings) => ({
    type: ActionTypes.ADD_BOOKINGS,
    payload: bookings
});