import React, { useState } from 'react';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import getUser from '../../hooks/getUser';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const AddFriend = () => {
    const [currentUser, isUser] = getUser();
    const { username, request_list } = currentUser;

    const [allUser, setAllUser] = useState([])
    const axiosPublic = useAxiosPublic();

    const handleSearch = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const res = await axiosPublic.get(`/user/${username}`)
        // console.log(res.data);        
        setAllUser(res.data);
    }

    const handleRequest = async (email) => {
        const res = await axiosPublic.get(`/users/${email}`)
        // console.log(res.data);
        const rcv_username = res.data.username;
        const patchData = {
            rcv_username,
            send_username: currentUser.username
        }

        const requestData = {
            requester_email: currentUser.email,
            requester_username: currentUser.username,
            receiver_email: res.data.email,
            receiver_username: res.data.username,
            status: 'Pending'
        }
        const requestRes = await axiosPublic.post(`/request`, requestData);
        if (requestRes.data.insertedId) {
            const result = await axiosPublic.patch(`/request-list`, patchData)
            console.log(result);
        }
    }

    if (isUser) {
        return <LoadingSpinner />
    }
    return (
        <div className='mb-5 lg:mb-0 mt-5 lg:mt-10'>
            <form onSubmit={handleSearch} className="flex flex-row gap-4 items-center justify-end mr-5 md:mr-10 mb-5 md:mb-8">
                <input type="text" name="username" placeholder="Enter username" className="input input-bordered w-48 md:w-auto" />
                <button className="btn bg-[#5654D1] text-white border-2 border-[#5654D1] 
                hover:border-[#5654D1] hover:bg-transparent hover:text-[#5654D1]">Search</button>
            </form>
            <div>
                {
                    allUser.length > 0 ? allUser.map(user => <div key={user?._id} user={user} className='flex flex-row items-center gap-4 mx-auto w-4/5 py-4'>
                        <img className='w-20 h-20 rounded-lg' src={user?.photo} alt="User" />
                        <div className='flex flex-col justify-center items-center gap-3'>
                            <h2 className='text-lg font-semibold'>{user?.username}</h2>
                            <h2 className='text-sm'>{user?.email}</h2>
                            {username === user.username ? <p className='text-green-500'>Your Profile</p> :
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