import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";


const getUser = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: currentUser = {}, isLoading: isUser, refetch } = useQuery({
        queryKey: ['user', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`)
            return res.data
        },
        refetchOnWindowFocus: false,
    })
    return [currentUser, isUser, refetch]
};

export default getUser;