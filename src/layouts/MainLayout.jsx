import React from 'react';
import Navbar from '../components/shared/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className='font-poppins'>
            <Outlet/>
        </div>
    );
};

export default MainLayout;