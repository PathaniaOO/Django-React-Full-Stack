import{motion} from "framer-motion"
import {Link,useNavigate} from "react-router-dom";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constants";
import api from "../api";

function Header() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);

    const handleLogout = async () => {
        try{
            const refresh=localStorage.getItem(REFRESH_TOKEN);
            await api.post("/apiapp/logout/",{refresh});
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            navigate("/");
        }catch(err){
            console.error("Logout failed:",err);
        }
    };
    return (
    <motion.header 
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Game Leaderboard</h1>

        <nav className="flex gap-4">
        {!isLoggedIn ? (
            <>
            <Link to="login/" className="hover:underline hover:text-indigo-200 transition-colors duration-200">
                Login
            </Link>
            <Link to="register/" className="hover:underline hover:text-indigo-200 transition-colors duration-200">
                Register
            </Link>
            </>
        ) : (
            <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md hover:scale-105 transition-transform duration-200"
            >
            Logout
            </button>
        )}
        </nav>
    </div>
    </motion.header>
);
}

export default Header;
