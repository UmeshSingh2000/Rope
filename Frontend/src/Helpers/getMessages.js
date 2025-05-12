import { setMessages } from "@/Redux/Features/Messages/messagesSlice";
import axios from "axios";
const URL = import.meta.env.VITE_BACKENDAPI_URL;
const getMessages = async (receiverId,dispatch,toast) => {
    try {
        const response = await axios.post(
            `${URL}/getAllMessages`,
            { receiverId },
            { withCredentials: true }
        );
        dispatch(setMessages({ id: receiverId, message: response.data }));
    } catch (error) {
        toast.error(
            error?.response?.data?.message ||
            error.message ||
            "Something went Wrong"
        );
    }
};
export default getMessages;