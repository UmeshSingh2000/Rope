import axios from "axios";
const URL = import.meta.env.VITE_BACKENDAPI_URL;
import { setFriends } from "@/Redux/Features/User/friendsSlice";
const getFriends = async (dispatch,setFilteredFriend,toast) => {
    try {
        const response = await axios.get(`${URL}/getMyFriends`, {
            withCredentials: true,
        });
        dispatch(setFriends(response.data.friendsList));
        setFilteredFriend(response.data.friendsList || []);
    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
    }
};
export default getFriends;