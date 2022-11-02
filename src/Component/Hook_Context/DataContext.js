import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = (props) => {
    const [ loggedIn, setLoggedIn] = useState({});
    const [ currentUser, setCurrentUser] = useState({});
    const [user, setUser] = useState();
    
    return (
        <DataContext.Provider value={
            [ loggedIn, setLoggedIn, currentUser, setCurrentUser, user, setUser ]
        }>
            {props.children}
        </DataContext.Provider>
    );
};

export default DataContext;