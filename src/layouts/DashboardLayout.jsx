import { Link, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { IoLogInOutline } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useState } from "react";

const DashBoardLayout = () => {
    const { user, logOut } = useAuth();
    const [show, setShow] = useState(false);
    const handleLogOut = () => {
        logOut()
            .then(() => {
                toast.success("Logged Out")
            })
    }

    const handleCollaspe = () => {
        setShow(!show)
    }

    const links = <>
        <li><Link to='/dashboard'>Home Page</Link></li>
        <li><Link to='/dashboard/update-profile'>Manage Profile</Link></li>
        <li><Link to='/dashboard/all-friends'>All Friends List</Link></li>
        <li><Link to='/dashboard/add-friend'>Add Friend</Link></li>
        <li><Link to='/dashboard/manage-req'>Manage Friend Request</Link></li>
        <li><Link to='/dashboard/recommend'>Recommended Friends</Link></li></>
    return (
        <div className="flex flex-row gap-5 relative">
            <div className="fixed md:hidden text-2xl pl-4 pt-5" onClick={handleCollaspe}>
                {
                    show ? <IoIosCloseCircleOutline /> :
                        <IoMdMenu />
                }

            </div>
            <div className={show ?
                'min-w-44 fixed md:hidden translate-y-12 bg-[#5654D1] text-[#ECDFCC] pt-4 pb-6 px-4 transition-all duration-200 z-10'
                : 'fixed translate-y-12 md:hidden bg-[#5654D1] text-[#ECDFCC] pt-4 pb-6 px-4 -translate-x-72 transition-all duration-200'}>
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-5">{}</h2>
                        <hr />
                        <ul className="font-semibold space-y-2 font-ubuntu mt-4">
                            {links}
                        </ul>
                    </div>
                    <div>
                        <hr />
                        <ul className="font-semibold space-y-2 font-ubuntu my-4">
                            <li><button className="flex flex-row items-center justify-center gap-2"
                                onClick={handleLogOut}>LogOut <IoLogInOutline className="text-xl" /></button></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="min-w-56 hidden md:flex min-h-screen bg-[#5654D1] text-[#ECDFCC] pt-4 pb-6 px-4">
                <div className="flex flex-col gap-5 h-full w-full">
                    <div>
                        <h2 className="text-2xl font-bold mb-5">{user.displayName}</h2>
                        <hr />
                        <ul className="font-semibold space-y-2 font-ubuntu mt-4">
                            {links}
                        </ul>
                    </div>
                    <div>
                        <hr />
                        <ul className="font-semibold space-y-2 font-ubuntu my-4">
                            <li><button className="flex flex-row items-center justify-center gap-2"
                                onClick={handleLogOut}>LogOut <IoLogInOutline className="text-xl" /></button></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex-1">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default DashBoardLayout;