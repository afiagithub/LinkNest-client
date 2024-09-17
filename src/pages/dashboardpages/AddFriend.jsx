import React, { useState } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import getUser from '../../hooks/getUser';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2'
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AddFriend = () => {
    const [currentUser, isUser] = getUser();
    const { username, request_list, friend_list } = currentUser;

    const [allUser, setAllUser] = useState([])
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['users', request_list],
        queryFn: async () => {
            const res = await axiosSecure.get('/users')
            setAllUser(res.data);
            return res.data;
        }
    })

    const handleSearch = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const res = await axiosPublic.get(`/user/${username}`)
        // console.log(res.data);        
        setAllUser(res.data);
    }

    const handleRequest = async (email) => {
        const res = await axiosSecure.get(`/users/${email}`)
        // console.log(res.data);
        const rcv_username = res.data.username;
        const patchData = {
            rcv_username,
            send_username: currentUser.username
        }

        const requestData = {
            requester_email: currentUser.email,
            requester_username: currentUser.username,
            requester_photo: currentUser.photo,
            receiver_email: res.data.email,
            receiver_username: res.data.username,
            status: 'Pending'
        }
        const requestRes = await axiosPublic.post(`/request`, requestData);
        if (requestRes.data.insertedId) {
            const result = await axiosPublic.patch(`/request-list`, patchData)
            if (result.data.result1.modifiedCount > 0) {
                Swal.fire({
                    title: "Sent Request!",
                    text: "Friend Request has been sent",
                    icon: "success",
                    showConfirmButton: false,
                });                   
            }
        }
        window.location.reload(true);
    }

    if (isUser || isLoading) {
        return <LoadingSpinner />
    }
    return (
        <div className='mb-5 lg:mb-0 mt-5 lg:mt-10'>
            <h1 className='text-center my-5 lg:my-10 text-3xl font-nun font-bold'>Search User & Add Friend</h1>
            <form onSubmit={handleSearch} className="flex flex-row gap-4 items-center justify-end mr-5 md:mr-10 mb-5 md:mb-8">
                <input type="text" name="username" placeholder="Enter username" className="input input-bordered w-48 md:w-auto" />
                <button className="btn bg-[#5654D1] text-white border-2 border-[#5654D1] 
                hover:border-[#5654D1] hover:bg-transparent hover:text-[#5654D1]">Search</button>
            </form>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {
                    allUser.length > 0 ? allUser.map(user => <div key={user?._id} user={user} className='flex flex-row items-center gap-4 mx-auto w-4/5 py-4'>
                        <img className='w-20 h-20 rounded-lg' src={user?.photo} alt="User" />
                        <div className='flex flex-col justify-center items-center gap-3'>
                            <h2 className='text-lg font-semibold'>{user?.username}</h2>
                            <h2 className='text-sm'>{user?.email}</h2>
                            {username === user.username ? <p className='text-green-500'>Your Profile</p> :
                                friend_list.includes(user.username) ? <p className='text-blue-500'>Friend</p> :
                                    request_list.includes(user.username) ?
                                        <button className='btn text-black' disabled>Request Pending</button> :
                                        <button onClick={() => handleRequest(user.email)}
                                            className='btn bg-[#5654D1] border-2 text-white border-[#5654D1] 
                                    hover:border-[#5654D1] hover:bg-transparent hover:text-[#5654D1]'>
                                            Add Friend</button>
                            }

                        </div>
                    </div>) : <p className='text-center text-lg py-2 text-red-500'>Sorry, No User Found</p>
                }
            </div>
        </div>
    );
};

export default AddFriend;