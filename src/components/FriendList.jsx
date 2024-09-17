import React, { useState } from 'react';
import LoadingSpinner from './shared/LoadingSpinner';
import getUser from '../hooks/getUser';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2'
import useAxiosSecure from '../hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';

const FriendList = () => {
    const [currentUser, isUser] = getUser();
    const { _id } = currentUser;

    const axiosPublic = useAxiosPublic()
    const axiosSecure = useAxiosSecure()
    const [frnd, setFrnd] = useState([]);

    const { data: friends = [], isLoading, refetch } = useQuery({
        queryKey: ['friends'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/friend/${_id}`)
            setFrnd(res.data)
            return res.data;
        }
    })

    const handleUnfriend = async (userName) => {
        const patchData = {
            user_username: currentUser.username,
            frnd_username: userName
        }
        console.log(patchData);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: `Unfriend ${userName}`
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await axiosSecure.patch('/unfriend', patchData)
                console.log(result.data);

                if (result.data.result1.modifiedCount > 0) {
                    Swal.fire({
                        title: "Unfriend!",
                        text: "Unfriend Successful",
                        icon: "success"
                    });
                }
                refetch()
            }
        });
    }

    if (isLoading || isUser) {
        return <LoadingSpinner />
    }
    return (
        <div className='w-5/6 text-center mb-5 lg:mb-0 mt-5 lg:mt-10 mx-auto'>
            <Helmet>
                <title>LinkNest | Friends</title>
            </Helmet>
            <h1 className='text-left font-nun font-bold text-2xl'>Friends List</h1>
            <div className='grid grid-cols-2 gap-5'>
                {
                    frnd.length > 0 ? frnd.map(fr => <div key={fr._id} fr={fr}
                        className="card card-compact w-60 shadow-xl bg-[#5654d136] mt-5 lg:mt-10">
                        <figure>
                            <img className='w-60 h-44 '
                                src={fr.photo}
                                alt="Shoes" />
                        </figure>
                        <div className="card-body">
                            <div className='flex flex-row justify-between items-center'>
                                <div>
                                    <h2 className="card-title">{fr.username}</h2>
                                    <p className='text-left'>{fr.email}</p>
                                </div>
                                <p className='text-green-500 font-bold font-nun text-right'>Friend</p>
                            </div>
                            <button onClick={() => handleUnfriend(fr.username)} className="btn bg-red-600 text-white btn-sm text-base border-2 
                            border-red-600 hover:bg-transparent hover:text-red-600 hover:border-red-600">
                                Unfriend</button>
                        </div>
                    </div>) :
                        <p className='text-lg py-2 text-red-500 text-left font-bold mt-5'>Sorry, No Friends Found</p>
                }
            </div>
        </div>
    );
};

export default FriendList;