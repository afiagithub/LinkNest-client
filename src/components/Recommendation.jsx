import React, { useState } from 'react';
import useAxiosPublic from '../hooks/useAxiosPublic';
import getUser from '../hooks/getUser';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './shared/LoadingSpinner';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const Recommendation = () => {
    const [currentUser, isUser] = getUser();
    const { _id } = currentUser;

    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure()
    const [recommend, setRecommend] = useState([]);

    const { data: recommends = [], isLoading, refetch } = useQuery({
        queryKey: ['recommends'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/recommend/${_id}`)
            setRecommend(res.data)
            return res.data;
        }
    })

    const handleRequest = async (email) => {
        const res = await axiosSecure.get(`/users/${email}`)
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
        refetch()
        window.location.reload(true);
    }

    if (isLoading || isUser) {
        return <LoadingSpinner />
    }
    return (
        <div className='w-5/6 text-center mb-5 lg:mb-0 mt-5 lg:mt-10 mx-auto'>
            <h1 className='text-left font-nun font-bold text-2xl'>Recommendation</h1>
            <div className='grid grid-cols-2 gap-5'>
                {
                    recommend.length > 0 ? recommend.map(rec => <div key={rec._id} rec={rec}
                        className="card card-compact w-60 shadow-xl bg-[#5654d136] mt-5 lg:mt-10">
                        <figure>
                            <img className='w-60 h-44 '
                                src={rec.photo}
                                alt="User" />
                        </figure>
                        <div className="card-body">
                            <div className='flex flex-row justify-between items-center'>
                                <div>
                                    <h2 className="card-title">{rec.username}</h2>
                                    <p className='text-left'>{rec.mutualCount} Mutual Connection</p>
                                </div>
                            </div>
                            {currentUser.request_list.includes(rec.username) ?
                                <button className='btn text-black' disabled>Request Pending</button> :
                                <button onClick={() => handleRequest(rec.email)}
                                    className='btn bg-[#5654D1] border-2 text-white border-[#5654D1] 
                                    hover:border-[#5654D1] hover:bg-transparent hover:text-[#5654D1]'>
                                    Add Friend</button>
                            }
                        </div>
                    </div>) :
                        <p className='text-lg py-2 text-red-500 text-left font-bold mt-5'>Sorry, No Recommendation Found</p>
                }
            </div>
        </div>
    );
};

export default Recommendation;