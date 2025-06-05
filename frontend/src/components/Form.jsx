import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post(route, { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        }
        catch (error) {
            alert(error)

        } finally {
            setLoading(false)
        }
    };

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{method === "login" ? "Login" : "Register"}</h1>
        <input className="form-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="form-btn" type="submit">{method === "login" ? "Login" : "Register"}</button>
    </form>
}

export default Form;