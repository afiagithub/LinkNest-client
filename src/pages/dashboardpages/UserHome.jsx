import React, { useState } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from "../../components/shared/LoadingSpinner"
import getUser from '../../hooks/getUser';

const UserHome = () => {
    const [currentUser, isUser] = getUser();
    const {username, email, photo, fullname, friend_list, hobbies} = currentUser;

    const axiosPublic = useAxiosPublic();
    const [allUser, setAllUser] = useState([])

    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosPublic.get('/users')
            setAllUser(res.data);
            return res.data;
        },
        refetchOnWindowFocus: false,
    })

    const handleSearch = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const res = await axiosPublic.get(`/user/${username}`)
        setAllUser(res.data);
    }
    if (isLoading || isUser) {
        return <LoadingSpinner />
    }
    return (
        <div className='flex flex-col lg:flex-row justify-between'>
            <div className="lg:w-4/6 text-center mb-5 lg:mb-0 mt-5 lg:mt-10">
                <img className="w-32 h-32 rounded-full mx-auto object-center" src={photo} alt="" />
                <h2 className="text-2xl font-bold my-5">Welcome, {username}</h2>
                <div className="text-left ml-6 md:ml-10 lg:ml-12">
                    <p className="my-5 text-xl font-bold">User Information: </p>
                    <p className="font-bold">Email: <span className="text-[#5654D1]">{email}</span></p>
                    <p className="font-bold">Full Name: <span className="text-[#5654D1]">{fullname}</span></p>                    
                    <p className="font-bold">Hobbies: <span className="text-[#5654D1]">{hobbies}</span></p>
                </div>
            </div>
            <hr className="lg:hidden border-[#2D3663] mr-4 mb-5" />
            <hr className="lg:hidden border-[#2D3663] mr-4" />
            <div className='mt-5 lg:mt-10 mx-8 lg:mx-0 lg:mr-8 lg:w-2/6'>
                <form onSubmit={handleSearch} className="flex flex-row gap-4 items-center justify-end mr-5 md:mr-10 mb-5 md:mb-8">
                    <input type="text" name="username" placeholder="Enter username" className="input input-bordered w-48 md:w-auto" />
                    <button className="btn bg-[#47CCC8] text-white border-2 border-[#47CCC8] 
                hover:border-[#47CCC8] hover:bg-transparent hover:text-[#47CCC8]">Search</button>
                </form>
                <hr />
                <h3 className='text-xl font-bold font-nun text-center py-3'>Make New Friends</h3>
                <hr />
                {
                    allUser.length > 0 ? allUser.map(user => <div key={user?._id} user={user} className='flex flex-row items-center gap-4 mx-auto w-4/5 py-4'>
                        <img className='w-16 h-16 rounded-lg' src={user?.photo} alt="User" />
                        <div className='flex flex-col justify-center items-center gap-3'>
                            <h2 className='text-lg font-semibold'>{user?.username}</h2>
                            <button 
                            className='btn bg-[#5654D1] border-2 text-white border-[#5654D1] hover:border-[#5654D1] 
                hover:bg-transparent hover:text-[#5654D1]'>Add Friend</button>
                        </div>
                    </div>) : <p className='text-center text-lg py-2 text-red-500'>Sorry, No User Found</p>
                }
            </div>
        </div>
    );
};

export default UserHome;