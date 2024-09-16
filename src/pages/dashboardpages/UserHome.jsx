import React, { useState } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from "../../components/shared/LoadingSpinner"
import getUser from '../../hooks/getUser';
import Swal from 'sweetalert2'
import FriendList from '../../components/FriendList';

const UserHome = () => {
    const [currentUser, isUser] = getUser();
    const { username, email, photo, fullname, friend_list, request_list, hobbies } = currentUser;

    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const [allUser, setAllUser] = useState([])

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
        setAllUser(res.data);
    }

    const handleRequest = async (email) => {
        const res = await axiosPublic.get(`/users/${email}`)
        // console.log(res.data);
        if (res.data) {
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
        }
        window.location.reload(true);
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
                    <p className="font-bold">Requests: <span className="text-[#5654D1]">{request_list}</span></p>
                    <p className="font-bold">Hobbies: <span className="text-[#5654D1]">{hobbies}</span></p>
                </div>
                <FriendList/>
            </div>
            <hr className="lg:hidden border-[#2D3663] mr-4 mb-5" />
            <hr className="lg:hidden border-[#2D3663] mr-4" />
            

            <div className='mt-5 lg:mt-10 mx-8 lg:mx-0 lg:mr-8 lg:w-2/6'>
                <form onSubmit={handleSearch} className="flex flex-row gap-4 items-center justify-end mr-5 md:mr-10 mb-5 md:mb-8">
                    <input type="text" name="username" placeholder="Enter username" className="input input-bordered w-48 md:w-auto" />
                    <button className="btn bg-[#5654D1] text-white border-2 border-[#5654D1] 
                hover:border-[#5654D1] hover:bg-transparent hover:text-[#5654D1]">Search</button>
                </form>
                <hr />
                <h3 className='text-xl font-bold font-nun text-center py-3'>Make New Friends</h3>
                <hr />
                {
                    allUser.length > 0 ? allUser.slice(0,4).map(user => <div key={user?._id} user={user} className='flex flex-row items-center gap-4 mx-auto w-4/5 py-4'>
                        <img className='w-16 h-16 rounded-lg' src={user?.photo} alt="User" />
                        <div className='flex flex-col justify-center items-center gap-3'>
                            <h2 className='text-lg font-semibold'>{user?.username}</h2>
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

export default UserHome;