import { useState } from "react";
import axios from "axios";
import { Api_Url } from "../setting";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function Register() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
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
        if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        else if (!isEmailValid(form.email)) newErrors.email = "Invalid email address";
        if (!form.password) newErrors.password = "Password is required";
        else if (form.password.length < 6)
            newErrors.password = "Password must be at least 6 characters";
        if (!form.confirmPassword)
            newErrors.confirmPassword = "Confirm password is required";
        else if (form.confirmPassword !== form.password)
            newErrors.confirmPassword = "Passwords do not match";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const registerUser = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);

        try {
            await axios.post(`${Api_Url}/v2/register`, form);

            toast.success("Registration successful!", {
                autoClose: 1000,
                onClose: () => {
                    setLoading(false);
                    navigate("/");
                },
            });
        } catch (err) {
            setLoading(false);
            toast.error(err?.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-page">
            <ToastContainer position="top-right" />
            <div className="register-card">
                <h2>Register</h2>
                <form onSubmit={registerUser}>
                    <div className="mb-3">
                        <label className="form-label">
                            Full name <span className="text-danger">*</span>
                        </label>
                        <input
                            name="fullName"
                            type="text"
                            className="form-control"
                            placeholder="Full name"
                            value={form.fullName}
                            onChange={handleChange}
                        />
                        {errors.fullName && (
                            <div className="text-danger">{errors.fullName}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="Email Address"
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
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <div className="text-danger">{errors.password}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Confirm Password <span className="text-danger">*</span>
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                className="form-control"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && (
                                <div className="text-danger">{errors.confirmPassword}</div>
                            )}
                        </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            ) : null}
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>

                    <p className="mt-3 text-center">
                        Already registered? <a href="/">Login</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
