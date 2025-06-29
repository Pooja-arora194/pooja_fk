import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import axios from "axios";

const EditCandidateModal = ({ open, onClose, candidates, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        dateOfJoining: "",
    });

    const [isChecked, setIsChecked] = useState(false);
    console.log(candidates, "cccccccccccccccccccc")
    useEffect(() => {
        if (candidates) {
            setFormData({
                name: candidates.name || "",
                email: candidates.email || "",
                phone: candidates.phone || "",
                position: candidates.position || "",
                department: candidates.department || "",
                joiningDate: candidates.joiningDate
                    ? new Date(candidates.joiningDate).toISOString().substring(0, 10)
                    : "",
            });
            setIsChecked(true);
        }
    }, [candidates]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!candidates || !candidates._id) return;

        try {
            const res = await axios.put(`http://localhost:8000/edit/${candidates._id}`, formData);
            if (onSubmit) onSubmit()
        } catch (error) {
            console.error("Error updating candidate:", error);
        }
    };

    return (
        <Modal
            title="Edit Candidate"
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <select
                            className="form-select"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Position</option>
                            <option value="Intern">Intern</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            className="form-control"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Department"
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <input
                            type="date"
                            className="form-control"
                            name="dateOfJoining"
                            value={formData.dateOfJoining}
                            onChange={handleChange}
                        />
                    </div>


                </div>

                <div className="text-center mt-4">
                    <Button type="primary" htmlType="submit" disabled={!isChecked}>
                        Update
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditCandidateModal;
