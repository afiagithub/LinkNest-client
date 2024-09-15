import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import RegisterLogo from '../lotties/register.json'
import Lottie from "lottie-react";
import useAuth from "../hooks/useAuth"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPublic from "../hooks/useAxiosPublic"

const Register = () => {
    const { createUser, updateUserProfile, setUser } = useAuth();

    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const photoURL = 'https://i.ibb.co/QnTrVRz/icon.jpg';

    const [show, setShow] = useState(false);
    const handleToggle = () => {
        setShow(!show);
    }

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const { userName, email, pass, confirmPass } = data;
        if (pass.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        else if (!/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(pass)) {
            toast.error("Password must have a uppercase and a lowercase letter");
            return;
        }
        else if (pass !== confirmPass) {
            toast.error("Password does not match Confirm Password");
            return;
        }
        createUser(email, pass)
            .then((result) => {
                updateUserProfile(userName, photoURL)
                .then(async () => {
                    console.log(result.user);
                    setUser({ ...result.user, photoURL: photoURL, displayName: userName })

                    const userInfo = {
                        username: userName,
                        email,
                        fullname: '',                        
                        photo: photoURL || 'https://i.ibb.co/QnTrVRz/icon.jpg',
                        friend_list: [],
                        hobbies: [],
                        status: 'active'
                    }
                    const res = await axiosPublic.post("/users", userInfo);
                    console.log(res);
                    if (res.data.insertedId) {
                        navigate('/')
                        toast.success("Successfully Registered")
                    }
                    else{
                        toast.error("User already exists")
                    }
                });
            })
            .catch((error) => {
                console.log(error.message)
            });

    }
    return (
        <div className="flex flex-col lg:flex-row justify-between items-center w-full rounded-md sm:p-10 mb-10 mt-5">
            <div className="hidden lg:flex w-3/6">
                <p className="w-96 mx-auto"><Lottie animationData={RegisterLogo} loop={true}></Lottie></p>
            </div>
            <div className="flex flex-col w-3/5 md:w-3/5 lg:w-2/6 mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="my-3 text-4xl font-bold text-[#5654D1]">Register</h1>
                    <p className="text-sm dark:text-[#2D3663]">Create your LinkNest account</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-2 text-sm">UserName</label>
                            <input type="text" name="name" placeholder="Enter Username" {...register("userName", { required: true })}
                                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800" />
                        </div>
                        {errors.userName && <span className="text-red-700 font-semibold">This field is required</span>}
                        <div>
                            <label className="block mb-2 text-sm">Email address</label>
                            <input type="email" name="email" placeholder="Enter email address" {...register("email", { required: true })}
                                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800" />
                        </div>
                        {errors.email && <span className="text-red-700 font-semibold">This field is required</span>}

                        <div className="relative">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm">Password</label>
                            </div>
                            <input type={show ? "text" : "password"} name="password" id="password" placeholder="*****" {...register("pass", { required: true })}
                                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800" />
                            <div className="absolute top-10 right-4 text-lg" onClick={handleToggle}>
                                {show ? <FaEyeSlash /> : <FaRegEye />}
                            </div>
                        </div>
                        {errors.pass && <span className="text-red-700 font-semibold">This field is required</span>}

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm">Confirm Password</label>
                            </div>
                            <input type="password" name="password" id="con-password" placeholder="*****" {...register("confirmPass", { required: true })}
                                className="w-full px-3 py-2 border rounded-md dark:border-gray-300 dark:bg-gray-50 dark:text-gray-800" />
                        </div>
                        {errors.confirmPass && <span className="text-red-700 font-semibold">This field is required</span>}
                    </div>
                    <div className="space-y-2">
                        <div>
                            <input type="submit" value="Sign Up"
                                className="w-full px-8 py-3 bg-[#5654D1] text-white border-2 border-[#5654D1] 
                                hover:border-[#5654D1] hover:bg-transparent hover:text-[#5654D1] rounded-xl font-bold" />
                        </div>
                        <p className="px-6 text-sm text-center dark:text-[#5654D1]">Already have an account?
                            <Link to="/login" className="hover:underline dark:text-[#2D3663] font-bold">
                                Sign in</Link>.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;