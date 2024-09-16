import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";


const getUser = () => {
    const {user} = useAuth();
    const axiosPublic = useAxiosPublic();
    const { data: currentUser = {}, isLoading: isUser, refetch } = useQuery({
        queryKey: ['user', user.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/${user.email}`)
            return res.data
        },
        refetchOnWindowFocus: false,
    })
    return [currentUser, isUser, refetch]
};

export default getUser;