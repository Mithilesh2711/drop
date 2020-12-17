import * as ActionTypes from './ActionTypes';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
export const Auth = (state = {
        isLoading: false,
        isAdmin: localStorage.getItem('admin')==="true" ? true :false ,
        isAuthenticated: localStorage.getItem('token') ? true : false,
        token: localStorage.getItem('token'),
        user: localStorage.getItem('creds') ? JSON.parse(localStorage.getItem('creds')) : null,
        errMess: null
    }, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_REQUEST:
            return {...state,
                isLoading: true,
                isAuthenticated: false,
                isAdmin: false,
                user: action.creds
            };
        case ActionTypes.LOGIN_STAFF:
            return {...state,
                isLoading: false,
                isAuthenticated: true,
                isAdmin: false,
                errMess: '',
                token: action.token
            };
        case ActionTypes.LOGIN_ADMIN:
            return {...state,
                isLoading: false,
                isAuthenticated: true,
                isAdmin: true,
                errMess: '',
                token: action.token
            };    
        case ActionTypes.LOGIN_FAILURE:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                isAdmin: false,
                errMess: action.message
            };
        case ActionTypes.LOGOUT_REQUEST:
            return {...state,
                isLoading: true,
                isAuthenticated: true
            };
        case ActionTypes.LOGOUT_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                isAdmin: false,
                token: '',
                user: null
            };
        default:
            return state
    }
}