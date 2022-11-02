import React from 'react';
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import { ChatProvider } from '../../Hook_Context/ChatContext';
import { DataProvider } from '../../Hook_Context/DataContext';
import Home from '../Home/Home/Home';
import Login from '../Login/Login/Login';
import PrivateRoute from '../Login/PrivateRoute/PrivateRoute';
import Page404 from '../Page404/Page404';

const MainPage = () => {
    return (
        <DataProvider>
            <ChatProvider>
                <Router>
                    <Routes>
                        <Route path='/login' element={<Login />}></Route>
                        <Route path='*' element={<Page404 />}></Route>
                        
                        {/* ============  private route  =============== */}
                        <Route element={<PrivateRoute />}>
                            <Route path='/' element={<Home />}></Route>
                        </Route>

                    </Routes>
                </Router>
            </ChatProvider>
        </DataProvider>
    );
};

export default MainPage;