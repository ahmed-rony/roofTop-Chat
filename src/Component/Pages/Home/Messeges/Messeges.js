import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../../../Hook_Context/ChatContext';
import { db } from '../../Login/firebase.config';
import Input from '../Input/Input';
import Messege from '../Messege/Messege';

const Messeges = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    const db = getFirestore();
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
        })
        return () => {
            unsub();
        }
    }, [data.chatId]);
    return (
        <div className='messege-container'>
            {
                messages.map(m => <Messege message={m} key={m.id} ></Messege>)
            }

            <div className='input-contents'>
                <Input></Input>
            </div>
        </div>
    );
};

export default Messeges;