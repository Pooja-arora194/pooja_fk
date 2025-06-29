import React, { useState , useEffect} from "react";
import { Modal, Button, DatePicker } from "antd";
import axios from "axios";
import moment from "moment";

const AddLeaveModal = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        candidateId: "",
        candidate: "",
        designation: "",
        leaveDate: null,
        reason: "",
        document: null,
    });
    const [candidates, setCandidates] = useState([]);
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const res = await axios.get("http://localhost:8000/all");
            setCandidates(res.data);
        } catch (err) {
            console.error("Error fetching candidates", err);
        }
    };
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "document") {
            setFormData({ ...formData, document: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, leaveDate: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = new FormData();
        payload.append("candidateId", formData.candidateId);
        payload.append("designation", formData.designation);
        payload.append("designation", formData.designation);
        payload.append("leaveDate", formData.leaveDate);
        payload.append("reason", formData.reason);
        if (formData.document) {
            payload.append("document", formData.document);
        }

        try {
            const response = await axios.post("http://localhost:8000/addLeaves", payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Leave submitted successfully:", response.data);
            setFormData({
                user: "",
                designation: "",
                leaveDate: null,
                reason: "",
                document: null,
            });
            setIsChecked(false);
            if (onSubmit) onSubmit();
        } catch (error) {
            console.error("Error submitting leave:", error);
        }
    };

    return (
        <Modal title="Apply for Leave" open={open} onCancel={onClose} footer={null} width={700}>
            <form onSubmit={handleSubmit}>
                <div className="row mt-3">
                    <div className="col-md-6 mb-3">
                        <select
                            className="form-select"
                            name="candidateId"
                            value={formData.candidateId}
                            onChange={(e) =>
                                setFormData({ ...formData, candidateId: e.target.value })
                            }
                            required
                        >
                            <option value="">Select User</option>
                            {candidates.map((candidate) => (
                                <option key={candidate.id} value={candidate._id}>
                                    {candidate.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <input
                            type="text"
                            className="form-control"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="Designation"
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <input
                            type="date"
                            className="form-control"
                            name="leaveDate"
                            value={formData.leaveDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <input
                            type="file"
                            className="form-control"
                            name="document"
                            onChange={handleChange}
                            accept=".pdf,.doc,.docx"
                        />

                    </div>

                    <div className="col-md-12 mb-3">
            <textarea
                className="form-control"
                rows="3"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Reason for Leave"
                required
            />
                    </div>


                </div>

                <div className="text-center mt-4">
                    <button
                        className="btn btn-primary rounded-pill"
                    >
                       Save
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddLeaveModal;
