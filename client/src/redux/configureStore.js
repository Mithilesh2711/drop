import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Auth } from './auth';
import {Consumer} from './consumer';
import {Payment} from './payments';
import {Feedback} from './feedback'
import {Bookings} from "./bookings";
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            auth: Auth,
            consumers : Consumer,
            payments: Payment,
            feedbacks: Feedback,
            bookings: Bookings
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}