import React, { useState } from 'react';

const initialState = {
    loggedIn: false,
    user: {},
    googleToken: '',
    businessID: ''
}


export const authContext = React.createContext(initialState);

function AuthContextProvider(props) {
    const [authState, setAuthState] = useState(initialState)
    return (
        <authContext.Provider value={{ authState, setAuthState }}>
            {props.children}
        </authContext.Provider>
    )
}
export default AuthContextProvider;

