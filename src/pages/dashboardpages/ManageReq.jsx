import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import getUser from '../../hooks/getUser';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { MdOutlineDelete } from "react-icons/md";
import { SiTicktick } from "react-icons/si";
import Swal from 'sweetalert2'
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';

const ManageReq = () => {
    const [currentUser, isUser] = getUser();
    const { username, email } = currentUser;

    const axiosSecure = useAxiosSecure();    

    const [friendReq, setFriendReq] = useState([]);
    const { data: requests = [], isLoading, refetch } = useQuery({
        queryKey: ['requests', currentUser],
        queryFn: async () => {
            const res = await axiosSecure.get(`/request/${username}`)
            // console.log(res.data);

            setFriendReq(res.data);
            return res.data;
        },
        refetchOnWindowFocus: false
    })

    const handleAccept = async (req_email, rcv_email) => {
        const patchData = {
            req_email,
            rcv_email
        }        
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Accept Friend Request"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await axiosSecure.patch('/accept-request', patchData)
                console.log(result.data);
                
                if (result.data.result1.modifiedCount > 0) {
                    Swal.fire({
                        title: "Accepted!",
                        text: "Added to Friends List",
                        icon: "success"
                    });
                }
                refetch()
            }
        });
    }

    const handleCancle = async (req_email, rcv_email) => {
        const patchData = {
            req_email,
            rcv_email
        }        
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Reject Friend Request"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await axiosSecure.patch('/cancel-request', patchData)
                console.log(result.data);
                
                if (result.data.result1.modifiedCount > 0) {
                    Swal.fire({
                        title: "Rejected!",
                        text: "Deleted Friend Request",
                        icon: "success"
                    });
                }
                refetch()
            }
        });
    }
    if (isUser || isLoading) {
        return <LoadingSpinner />
    }
    return (
        <div className="z-0 mt-10 px-10 md:px-0">
            <Helmet>
                <title>LinkNest | Manage Requests</title>
            </Helmet>
            <h1 className="text-4xl font-bold font-ubuntu text-center mb-10">Incoming Requests</h1>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>UserName</th>
                            <th>Email</th>
                            <th>Accept</th>
                            <th>Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        {
                            friendReq.map(frnd => <tr key={frnd._id}>
                                <td>
                                    <img src={frnd.requester_photo} className="rounded-2xl w-16 h-16 object-center" />
                                </td>
                                <td>
                                    <p className="font-bold">{frnd.requester_username}</p>
                                </td>
                                <td>
                                    {frnd.requester_email}
                                </td>
                                <th>
                                    {
                                        <button onClick={() => handleAccept(frnd.requester_email, frnd.receiver_email)}
                                            className="btn bg-green-200 border-2 border-transparent text-green-800 
                            font-black text-lg hover:bg-transparent hover:border-green-800">
                                            <SiTicktick />
                                        </button>
                                    }
                                </th>
                                <th>
                                    <button onClick={() => handleCancle(frnd.requester_email, frnd.receiver_email)} className="btn bg-red-600 border-2 border-transparent text-white font-black text-xl 
                                    hover:bg-transparent hover:border-red-600 hover:text-red-600">
                                        <MdOutlineDelete />
                                    </button>
                                </th>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageReq;