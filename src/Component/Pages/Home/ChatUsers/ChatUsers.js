import React, { useState, useEffect, useContext } from 'react';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { ChatContext } from '../../../Hook_Context/ChatContext';
import useAuth from '../../../Hook_Context/useAuth';

const ChatUsers = () => {
    const [chatUsers, setChatUsers] = useState([]);
    const [ currentUser, setCurrentUser] = useAuth();
    const {dispatch} = useContext(ChatContext);

    const db = getFirestore();
    useEffect(()=>{

        const getChatUsers = () =>{
            const unsub = onSnapshot(doc(db, "userchats", currentUser.uid), (doc) => {
                // console.log("Current data: ", doc.data());
                setChatUsers(Object.entries(doc.data()));
            });
            return () =>{
                unsub();
            }
        }

        currentUser.uid && getChatUsers();
    }, [currentUser.uid]);

    const handleSelect = (u) =>{
        dispatch({type:'CHANGE_USER', payload: u})
    }

    return (
        <div className="userChat-content">
            {
                chatUsers.sort((a,b)=> b[1].date - a[1].date).map(chats =>
                    <div className="userChat" key={chats[0]} onClick={()=> handleSelect(chats[1].userInfo)} >
                        <img src={chats[1].userInfo.photoURL} alt="" className='userChat-avatar' />
                        <div className="userChatInfo">
                            <span className='f-rub'>{chats[1].userInfo.displayName}</span>
                            {chats[1].lastMessage && <p className='front-messege mb-0'>{chats[1].lastMessage.text}</p> }
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ChatUsers;