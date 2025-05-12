import axios from "axios";
const URL = import.meta.env.VITE_BACKENDAPI_URL;
const handleLogout = async (toast) => {
    try {
        const response = await axios.get(`${URL}/logout`, { withCredentials: true });
        toast.success(response.data.message);

        window.location.reload()
    }
    catch (error) {
        toast.error(error?.response?.data?.message || error.message || "Something went wrong")
    }
}
export default handleLogout;