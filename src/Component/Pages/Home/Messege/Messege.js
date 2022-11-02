import React, { useContext, useRef, useEffect } from 'react';
import { ChatContext } from '../../../Hook_Context/ChatContext';
import useAuth from '../../../Hook_Context/useAuth';

const Messege = ({message}) => {
    const [ currentUser ] = useAuth();
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(()=>{
        ref.current.scrollIntoView({behavior: 'smooth'});
    }, [message])

    return (
        <div ref={ref} className={`messege-info ${ message.senderId === currentUser.uid && 'owner'}`}>
            <div className="messege-avatar">
                <img src={message.senderId === currentUser.uid 
                    ? currentUser.photoURL 
                    : data.user.photoURL} 
                    className='messege-img' alt="" />
            </div>
            <div className="messege-content">
                {message.text && <p className='messege-p f-ral'>{message.text}</p> }
                
                {message.img && <img src={message.img} className='attach-img' alt="" /> }
                
            </div>
        </div>
    );
};

export default Messege;