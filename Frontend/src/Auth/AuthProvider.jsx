import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext()

const URL = import.meta.env.VITE_BACKENDAPI_URL;



export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await axios.get(`${URL}/verifyToken`, {
                    withCredentials: true
                })
                if (response.status === 200) {
                    setIsAuthenticated(true)
                }
            } catch (error) {
                setIsAuthenticated(false)
            }
            finally {
                setChecked(true)
            }
        }
        checkToken()
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checked }}>
            {children}
        </AuthContext.Provider>

    )
}

export const useAuth = () => useContext(AuthContext);