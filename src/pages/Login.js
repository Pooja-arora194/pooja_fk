import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {Api_Url} from "../setting";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isEmailValid = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!isEmailValid(form.email)) newErrors.email = "Invalid email address";

        if (!form.password) newErrors.password = "Password is required";
        else if (form.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const loginUser = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await axios.post(`${Api_Url}/v2/login`, form);
            localStorage.setItem("token", res.data.token);
            const token = res.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("tokenExpiry", Date.now() + 2 * 60 * 60 * 1000);
            navigate("/dashboard");
            toast.success("Login successful!", {
                autoClose: 1000,
                onClose: () => navigate("/dashboard"),
            });
        } catch (err) {
            toast.error(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <ToastContainer position="top-right" />
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={loginUser}>
                    <div className="mb-3">
                        <label className="form-label">
                            Email <span className="text-danger">*</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        {errors.email && (
                            <div className="text-danger">{errors.email}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Password <span className="text-danger">*</span>
                        </label>
                        <input
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={handleChange}
                        />
                        {errors.password && (
                            <div className="text-danger">{errors.password}</div>
                        )}
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>

                    <p className="mt-3 text-center">
                        Don’t have an account? <a href="/register">Register</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
