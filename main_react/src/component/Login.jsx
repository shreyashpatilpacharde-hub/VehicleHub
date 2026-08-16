import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" }); // type: "success" | "error"

    const changeHandler = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const submitHandler = async (e) => {

        e.preventDefault();

        setLoading(true);
        setMessage({ text: "", type: "" });

        try {

            const res = await axios.post(
                "https://vehiclehub-viee.onrender.com/login",
                user
            );

            if (res.data.message === "Login Successful") {

                sessionStorage.setItem("user_id", res.data.user_id);
                sessionStorage.setItem("name", res.data.name);
                sessionStorage.setItem("email", res.data.email);
                sessionStorage.setItem("mobile", res.data.mobile);

                setMessage({ text: "✅ Login Successful! Redirecting...", type: "success" });

                setTimeout(() => navigate("/dashboard"), 1000);

            } else {
                setMessage({ text: `⚠️ ${res.data.message}`, type: "error" });
            }

        } catch (err) {
            console.log(err);
            setMessage({ text: "❌ Server Error. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="brand-label">Vehicle Hub</span>
                    <h1 className="brand-title">Drive your next vehicle decision.</h1>
                    <p className="brand-copy">
                        Sign in to manage your vehicle purchases, sales, and marketplace inventory.
                    </p>
                </div>
                <div className="auth-panel">
                    <form className="auth-form" onSubmit={submitHandler}>
                        <h2>Sign in to your account</h2>
                        <p>Enter your email and password to continue.</p>

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

                        <div className="form-group">
                            <label className="label-text" htmlFor="email">Email address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={user.email}
                                onChange={changeHandler}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="label-text" htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={user.password}
                                onChange={changeHandler}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="button-primary"
                            disabled={loading}
                            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>

                        <div className="auth-actions">
                            <Link to="/register">Create new account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
