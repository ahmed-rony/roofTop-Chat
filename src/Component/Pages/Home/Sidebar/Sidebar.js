import React from 'react';
import './Sidebar.scss';
import Nav from '../Nav/Nav';
import Search from '../Search/Search';
import ChatUsers from '../ChatUsers/ChatUsers';

const Sidebar = () => {
    return (
        <div className='col-md-4'>
            <div className="sidebar-content">
                <Nav></Nav>
                <Search></Search>
                <ChatUsers></ChatUsers>
            </div>
        </div>
    );
};

export default Sidebar;