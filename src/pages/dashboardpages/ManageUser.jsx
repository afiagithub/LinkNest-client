import React from 'react';
import getUser from '../../hooks/getUser';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const ManageUser = () => {
    const [currentUser, isUser] = getUser();
    const { _id, username, email, photo, friend_list, request_list, fullname, hobbies } = currentUser;

    const axiosPublic = useAxiosPublic()

    if (isUser) {
        return <LoadingSpinner />
    }
    const handleUpdate = async (e) => {
        e.preventDefault();
        const form = e.target;

        const username = form.username.value;
        const email = form.email.value;
        const photo = form.photo.value;
        const fullname = form.fullName.value;
        const hobbies = form.hobbies.value;

        const userInfo = {
            username,
            email,
            fullname,
            photo: photo || 'https://i.ibb.co/QnTrVRz/icon.jpg',
            friend_list,
            request_list,
            hobbies: hobbies.split(","),
            status: 'active'
        }
        console.log(userInfo);
        const res = await axiosPublic.put(`/users/${_id}`, userInfo);
        console.log(res);
    }
    return (
        <div className="flex flex-col max-w-md mx-auto p-6 rounded-md">
            <div className="mb-5 text-center">
                <h1 className="my-3 text-3xl font-bold font-nun text-[#20B2AA]">Update Your Profile</h1>
            </div>
            <form onSubmit={handleUpdate} className="space-y-8 text-left">
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm">Username</label>
                        <input type="text" name="username" defaultValue={username} disabled
                            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-500 dark:text-white" />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm">Email Address</label>
                        <input type="email" name="email" defaultValue={email} disabled
                            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-500 dark:text-white" />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm">Full Name</label>
                        <input type="text" name="fullName" defaultValue={fullname}
                            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800" />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm">Photo URL</label>
                        <input type="text" name="photo" defaultValue={photo}
                            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800" />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm">Hobbies (divide with ,)</label>
                        <input type="text" name="hobbies" defaultValue={hobbies}
                            className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800" />
                    </div>
                </div>
                <div>
                    <input type="submit" value="Update Profile"
                        className="w-full px-8 py-3 bg-[#5654D1] text-white text-lg font-semibold rounded-xl 
                            border-2 border-[#5654D1] hover:border-[#5654D1] hover:bg-transparent 
                            hover:text-[#5654D1]" />
                </div>
            </form>

        </div>
    );
};

export default ManageUser;