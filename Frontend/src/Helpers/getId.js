import axios from "axios";
const URL = import.meta.env.VITE_BACKENDAPI_URL;
const getId = async (setCurrentUserId,toast) => {
    try {
        const response = await axios.get(`${URL}/getMyId`, {
            withCredentials: true,
        });
        setCurrentUserId(response.data.id);
    } catch (error) {
        toast.error(error?.response?.data.message || "Something went wrong");
    }
};
export default getId;