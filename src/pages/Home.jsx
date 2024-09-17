import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from 'react-helmet-async';

const Home = () => {
    const { user, logOut } = useAuth();
    console.log(user);
    return (
        <div className="bg-[#5654D1] h-screen flex flex-col justify-center items-center text-white">
            <Helmet>
                <title>LinkNest</title>
            </Helmet>
            <h1 className="text-4xl lg:text-5xl font-bold mb-5 font-nun">LinkNest</h1>
            <p className="font-light text-sm lg:text-base">Explore your next friendship with LinkNest – Where connections begin!</p>
            {
                user ? <Link to={'dashboard'} className="btn bg-[#5DFBC5] border-2 border-[#5DFBC5] hover:border-[#5DFBC5] 
                hover:bg-transparent hover:text-[#5DFBC5] lg:text-lg font-bold mt-5">Go to Dashboard</Link> :
                    <div className="text-black flex flex-row justify-center items-center gap-5 mt-5">
                        <Link to={'/login'} className="btn bg-[#5DFBC5] border-2 border-[#5DFBC5] hover:border-[#5DFBC5] 
                hover:bg-transparent hover:text-[#5DFBC5] lg:text-lg font-bold">Log-In</Link>
                        <Link to={'/register'} className="btn bg-[#5DFBC5] border-2 border-[#5DFBC5] hover:border-[#5DFBC5] 
                hover:bg-transparent hover:text-[#5DFBC5] lg:text-lg font-bold">Register</Link>
                    </div>
            }
        </div>
    );
};

export default Home;