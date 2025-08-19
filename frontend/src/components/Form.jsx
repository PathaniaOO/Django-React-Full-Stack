import { useState } from "react";
import api from "../api";
import {useNavigate} from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted!"); // Debug log
        console.log("Username:", username, "Password:", password); // Debug log
        
        setLoading(true);

     try {
            const res = await api.post(route, {
                username,
                password,
            });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            }else{
                navigate("/login");
                }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            {/* Background image */}
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}
            />

            {/* Overlay (darken the image slightly for contrast) */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Form card - Option 1: More transparent */}
            <form
                onSubmit={handleSubmit}
                className="relative z-10 w-11/12 max-w-sm p-6 
                           bg-white/20 backdrop-blur-lg 
                           rounded-2xl shadow-xl border border-white/30"
            >
                <h2 className="text-2xl font-bold mb-6 text-white text-center">
                    {name}
                </h2>

                {/* Username */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-white mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-xl shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Loading..." : name}
                </button>
            </form>
        </div>
    );
}

export default Form;