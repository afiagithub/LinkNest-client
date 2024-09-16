import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from "../../components/shared/LoadingSpinner"

const UserHome = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    const [allUser, setAllUser] = useState([])
    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosPublic.get('/users')
            setAllUser(res.data);
            return res.data;
        }
    })

    const handleSearch = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const res = await axiosSecure.get(`/users/${username}`)
        setAllReserves(res.data);
    }
    if (isLoading) {
        return <LoadingSpinner />
    }
    return (
        <div className='flex flex-col lg:flex-row justify-between'>
            <div className='w-4/6'>
                <h1>Hello, {user.displayName}</h1>
            </div>
            <div className='mt-5 lg:mt-10 mr-8 w-2/6'>
                <form onSubmit={handleSearch} className="flex flex-row gap-4 items-center justify-end mr-5 md:mr-10 mb-5 md:mb-8">
                    <input type="text" name="username" placeholder="Enter username" className="input input-bordered w-24 md:w-auto" />
                    <button className="btn bg-[#47CCC8] text-white border-2 border-[#47CCC8] 
                hover:border-[#47CCC8] hover:bg-transparent hover:text-[#47CCC8]">Search</button>
                </form>
                <hr />
                <h3 className='text-xl font-bold font-nun text-center py-3'>Make New Friends</h3>
                <hr />
                {
                    allUser.map(user => <div key={user._id} user={user} className='flex flex-row items-center gap-4 mx-auto w-4/5 py-4'>
                        <img className='w-16 h-16 rounded-lg' src={user.photo} alt="User" />
                        <div className='flex flex-col justify-center items-center gap-3'>
                            <h2 className='text-lg font-semibold'>{user.username}</h2>
                            <button className='btn'>Add Friend</button>
                        </div>
                    </div>)
                }
            </div>
        </div>
    );
};

export default UserHome;