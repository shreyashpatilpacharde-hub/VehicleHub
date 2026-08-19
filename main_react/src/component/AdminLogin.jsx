import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {

    const navigate = useNavigate();

    const [admin, setAdmin] = useState({
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const changeHandler = (e) => {
        setAdmin({
            ...admin,
            [e.target.name]: e.target.value
        });
    };

    const login = async (e) => {

        e.preventDefault();

        setLoading(true);
        setMessage({ text: "", type: "" });

        try {

            const res = await axios.post(
                "https://vehiclehub-viee.onrender.com/admin/login",
                admin
            );

            if (res.data.message === "Admin Login Successful") {
                setMessage({ text: "✅ Login Successful! Redirecting...", type: "success" });
                setTimeout(() => navigate("/admindashboard"), 1000);
            } else {
                setMessage({ text: `⚠️ ${res.data.message}`, type: "error" });
            }

        } catch (err) {
            console.log(err);
            setMessage({ text: "❌ Admin Login Failed. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="admin-auth-page">
            <div className="admin-auth-card">
                <div className="admin-auth-hero">
                    <h2>Admin Access</h2>
                    <p>Secure admin control for vehicle approvals, inventory tracking, and buyer history.</p>
                </div>

                {/* In-page status message */}
                {message.text && (
                    <div style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        marginBottom: "16px",
                        fontWeight: 500,
                        fontSize: "14px",
                        backgroundColor: message.type === "success" ? "#d1fae5" : "#fee2e2",
                        color: message.type === "success" ? "#065f46" : "#991b1b",
                        border: `1px solid ${message.type === "success" ? "#6ee7b7" : "#fca5a5"}`
                    }}>
                        {message.text}
                    </div>
                )}

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
                            required
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
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="admin-login-btn"
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div style={{ marginTop: "16px", textAlign: "center" }}>
                        <Link to="/login" style={{ color: "#6366f1", fontSize: "14px", textDecoration: "none" }}>
                            ← Back to User Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default AdminLogin;
