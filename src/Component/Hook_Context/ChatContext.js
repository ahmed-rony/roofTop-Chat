import React, { createContext, useReducer } from 'react';
import useAuth from './useAuth';

export const ChatContext = createContext();

export const ChatProvider = (props) => {
    const[currentUser] = useAuth();

    const INITIAL_STATE = {
        chatId: 'null',
        user: {}
    }
    const chatReducer = (state, action) =>{
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid,
                };
        
            default:
                break;
        }
    }
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data:state, dispatch }}>
            {props.children}
        </ChatContext.Provider>
    );
};
