import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {

    const navigate = useNavigate();

    const [admin, setAdmin] = useState({
        username: "",
        password: ""
    });

    const changeHandler = (e) => {

        setAdmin({
            ...admin,
            [e.target.name]: e.target.value
        });

    };

    const login = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:3000/admin/login",
                admin
            );

            alert(res.data.message);

            if (res.data.message === "Admin Login Successful") {

                navigate("/admindashboard");

            }

        } catch (err) {

            console.log(err);

            alert("Admin Login Failed");

        }

    };

    return (
        <div className="admin-auth-page">
            <div className="admin-auth-card">
                <div className="admin-auth-hero">
                    <h2>Admin Access</h2>
                    <p>Secure admin control for vehicle approvals, inventory tracking, and buyer history.</p>
                </div>
                <form className="admin-auth-form" onSubmit={login}>
                    <div className="admin-form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            className="admin-input"
                            placeholder="Admin username"
                            onChange={changeHandler}
                        />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="admin-input"
                            placeholder="Password"
                            onChange={changeHandler}
                        />
                    </div>
                    <button type="submit" className="admin-login-btn">Login</button>
                </form>
            </div>
        </div>
    );

}

export default AdminLogin;