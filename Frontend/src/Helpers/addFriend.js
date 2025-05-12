import axios from "axios";
const URL = import.meta.env.VITE_BACKENDAPI_URL;
const addFriend = async (friendId,toast) => {    
    try {
        const response = await axios.post(
            `${URL}/addFriend`,
            { friendId },
            { withCredentials: true }
        );
        toast.success(response.data.message);
        getFriends();
    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
    }
};
export default addFriend;