import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-[#5654D1] h-screen flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-5 font-nun">LinkNest</h1>
            <p className="font-light text-sm lg:text-base">Explore your next friendship with LinkNest – Where connections begin!</p>
            <div className="text-black flex flex-row justify-center items-center gap-5 mt-5">
                <Link to={'/login'} className="btn bg-[#5DFBC5] border-2 border-[#5DFBC5] hover:border-[#5DFBC5] 
                hover:bg-transparent hover:text-[#5DFBC5] lg:text-lg font-bold">Log-In</Link>
                <Link to={'/register'} className="btn bg-[#5DFBC5] border-2 border-[#5DFBC5] hover:border-[#5DFBC5] 
                hover:bg-transparent hover:text-[#5DFBC5] lg:text-lg font-bold">Register</Link>
            </div>
        </div>
    );
};

export default Home;