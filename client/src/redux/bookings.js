import * as ActionTypes from './ActionTypes';

export const Bookings = (state = {
        isLoading: false ,
        errMess: null,
        bookings: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_BOOKINGS:
            return {...state, isLoading: false, errMess: null, bookings: action.payload};

        case ActionTypes.BOOKINGS_LOADING:
            return {...state, isLoading: true, errMess: null, bookings: []};

        case ActionTypes.BOOKINGS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, bookings: []};


        default:
            return state;
    }
}