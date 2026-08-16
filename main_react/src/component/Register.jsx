import { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        mobile: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {

        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value
        });

        let error = "";

        if (name === "email") {
            if (!/\S+@\S+\.\S+/.test(value)) {
                error = "Invalid Email";
            }
        }

        if (name === "password") {
            if (value.length < 6) {
                error = "Password should be at least 6 characters";
            }
        }

        if (name === "mobile") {
            if (!/^\d{10}$/.test(value)) {
                error = "Mobile Number must be 10 digits";
            }
        }

        

        setErrors({
            ...errors,
            [name]: error
        });
    };

    const validate = () => {

        let newErrors = {};

        if (user.name.trim() === "") {
            newErrors.name = "Name is required";
        }

        if (user.email === "") {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = "Invalid Email";
        }

        if (user.password === "") {
            newErrors.password = "Password is required";
        } else if (user.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (user.mobile === "") {
            newErrors.mobile = "Mobile Number is required";
        } else if (!/^\d{10}$/.test(user.mobile)) {
            newErrors.mobile = "Mobile Number must be 10 digits";
        }

        

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (validate()) {

            try {

                const res = await axios.post(
                    "https://vehiclehub-viee.onrender.com/register",
                    user
                );

                alert(res.data.message);

                if (res.data.message === "Registration Successful") {
                    navigate("/login");
                }

                setUser({
                    name: "",
                    email: "",
                    password: "",
                    mobile: ""
                });

            } catch (err) {

                console.log(err);

                alert(err.response?.data?.message || "Registration Failed");

            }

        }

    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="brand-header">
                    <span className="brand-badge">Vehicle Hub</span>
                    <h2>Register your account</h2>
                    <p>Get started with Vehicle Hub to manage vehicles, bookings, and services in one place.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            className="form-input"
                            placeholder="Enter your name"
                            value={user.name}
                            onChange={handleChange}
                        />
                        <p className="error-text">{errors.name}</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={user.email}
                            onChange={handleChange}
                        />
                        <p className="error-text">{errors.email}</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter a secure password"
                            value={user.password}
                            onChange={handleChange}
                        />
                        <p className="error-text">{errors.password}</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="mobile">Mobile Number</label>
                        <input
                            id="mobile"
                            type="text"
                            name="mobile"
                            className="form-input"
                            placeholder="Enter mobile number"
                            value={user.mobile}
                            onChange={handleChange}
                        />
                        <p className="error-text">{errors.mobile}</p>
                    </div>

                    <button type="submit" className="submit-button">
                        Create Account
                    </button>

                    <div className="form-links">
                        <Link to="/login" className="text-link">
                            Already have an account? Login
                        </Link>
                        
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
