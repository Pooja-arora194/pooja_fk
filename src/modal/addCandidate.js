import React, { useState } from "react";
import { Modal, Button } from "antd";
import axios from "axios";
import { Api_Url } from "../setting";

const AddCandidateModal = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        joiningDate: "",
        experience: "",
        resume: null,
    });

    const [isChecked, setIsChecked] = useState(false);
    const [errors, setErrors] = useState({});

    const isEmailValid = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!isEmailValid(formData.email)) newErrors.email = "Invalid email";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.position.trim()) newErrors.position = "Position is required";
        if (!formData.department.trim()) newErrors.department = "Department is required";
        if (!formData.experience.trim()) newErrors.experience = "Experience is required";
        if (!formData.resume) newErrors.resume = "Resume is required";
        if (!isChecked) newErrors.declaration = "You must agree to the declaration";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "resume") {
            setFormData({ ...formData, resume: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
            if (val) payload.append(key, val);
        });

        try {
            await axios.post(`${Api_Url}/add`, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setFormData({
                name: "",
                email: "",
                phone: "",
                position: "",
                department: "",
                joiningDate: "",
                experience: "",
                resume: null,
            });
            setIsChecked(false);
            setErrors({});
            if (onSubmit) onSubmit();
        } catch (error) {
            console.error("Error submitting candidate:", error);
        }
    };

    return (
        <Modal
            title="Add Candidate"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <form onSubmit={handleSubmit}>
                <div className="row mt-3">
                    {[
                        { name: "name", placeholder: "Full Name" },
                        { name: "email", placeholder: "Email Address", type: "email" },
                        { name: "phone", placeholder: "Phone Number" },
                        { name: "department", placeholder: "Department" },
                        { name: "experience", placeholder: "Experience" },
                    ].map((field, i) => (
                        <div className="col-md-6 mb-3" key={field.name}>
                            <input
                                type={field.type || "text"}
                                className="form-control"
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                            />
                            {errors[field.name] && (
                                <div className="text-danger">{errors[field.name]}</div>
                            )}
                        </div>
                    ))}

                    <div className="col-md-6 mb-3">
                        <select
                            className="form-select"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                        >
                            <option value="">Select Position</option>
                            <option value="Intern">Intern</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                        </select>
                        {errors.position && (
                            <div className="text-danger">{errors.position}</div>
                        )}
                    </div>

                    <div className="col-md-12 mb-3">
                        <input
                            type="file"
                            name="resume"
                            className="form-control"
                            onChange={handleChange}
                            accept=".pdf,.doc,.docx"
                        />

                        {errors.resume && (
                            <div className="text-danger">{errors.resume}</div>
                        )}
                    </div>

                    <div className="col-12 mt-2">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="declaration"
                                checked={isChecked}
                                onChange={() => setIsChecked(!isChecked)}
                            />
                            <label className="form-check-label" htmlFor="declaration">
                                I hereby declare that the above information is true to the best of my knowledge and belief.
                            </label>
                        </div>
                        {errors.declaration && (
                            <div className="text-danger mt-1">{errors.declaration}</div>
                        )}
                    </div>
                </div>

                <div className="text-center mt-4">
                    <button
                        className="btn btn-primary rounded-pill"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddCandidateModal;
