import React, { useContext } from 'react';
import DataContext from './DataContext';

const useAuth = () => {
    return useContext(DataContext);
};

export default useAuth;