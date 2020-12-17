import * as ActionTypes from './ActionTypes';

export const Payment = (state = {
        isLoading: true ,
        errMess: null,
        payments: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_PAYMENTS:
            return {...state, isLoading: false, errMess: null, payments: action.payload};

        case ActionTypes.CONSUMERS_LOADING:
            return {...state, isLoading: true, errMess: null, payments: []};

        case ActionTypes.CONSUMERS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, payments: []};

        default:
            return state;
    }
}