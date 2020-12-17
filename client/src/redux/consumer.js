import * as ActionTypes from './ActionTypes';

export const Consumer = (state = {
        isLoading: true ,
        errMess: null,
        consumers: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_CONSUMERS:
            return {...state, isLoading: false, errMess: null, consumers: action.payload};

        case ActionTypes.CONSUMERS_LOADING:
            return {...state, isLoading: true, errMess: null, consumers: []};

        case ActionTypes.CONSUMERS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, consumers: []};

        case ActionTypes.ADD_CONSUMER:
            var user = action.payload;
            return {...state, consumers: state.consumers.concat(user)};

        default:
            return state;
    }
}