import React, {useEffect, useState} from "react";
import { BsEnvelopeFill, BsFillBellFill } from "react-icons/bs";
import { Modal, Form, Input, Select, Button } from "antd";
import AddCandidateModal from "../modal/addCandidate";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const { Option } = Select;

const status = [
   'New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'
];
const position = [
    'Intern', 'Full Time', 'Part Time'
]
const Candidates = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPosition, setFilterPosition] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [candidates, setCandidates] = useState([]);

    const handleAddCandidate = (values) => {
        console.log("New Candidate:", values);
        setIsModalOpen(false);
        fetchCandidates()
        form.resetFields();
    };
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
    const filteredCandidates = candidates.filter((cand) => {
        const matchesSearch =
            cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cand.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cand.department.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus ? cand.status === filterStatus : true;
        const matchesPosition = filterPosition
            ? cand.position === filterPosition
            : true;

        return matchesSearch && matchesStatus && matchesPosition;
    });

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:8000/update-status/${id}`, {
                status: newStatus,
            });
            toast.success("Status updated successfully");
            fetchCandidates();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    return (
        <div>
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div className="d-flex gap-2 mb-2">
                    <select
                        className="form-select"
                        style={{ width: 150 }}
                        value={filterPosition}
                        onChange={(e) => setFilterPosition(e.target.value)}
                    >
                        <option value="">Positions</option>
                        {position.map((pos) => (
                            <option key={pos} value={pos}>
                                {pos}
                            </option>
                        ))}
                    </select>

                    <select
                        className="form-select"
                        style={{ width: 180 }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Status</option>
                        {status.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="d-flex align-items-center gap-3 mb-2">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search"
                        style={{ width: 200 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <button
                        className="btn btn-primary rounded-pill"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Candidate
                    </button>


                </div>
            </div>


            <table className="table table-hover">
                <thead style={{ backgroundColor: "#4B0082", color: "white" }}>
                <tr>
                    <th>Sr No.</th>
                    <th>Candidate Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Experience</th>
                    <th>Resume</th>
                </tr>
                </thead>
                <tbody>
                {filteredCandidates.length === 0 ? (
                    <tr>
                        <td colSpan="9" className="text-center">
                            No candidates found.
                        </td>
                    </tr>
                ) : (
                    filteredCandidates.map((cand,index) => (
                        <tr key={cand.id}>
                            <td>{index + 1}</td>
                            <td>{cand.name}</td>
                            <td>{cand.email}</td>
                            <td>{cand.phone}</td>
                            <td>{cand.position}</td>
                            <td>
                                <select
                                    className="form-select rounded-pill"
                                    value={cand.status}
                                    onChange={(e) => handleStatusChange(cand._id, e.target.value)}
                                >
                                    <option value="New">New</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Selected">Selected</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </td>
                            <td>
                                {cand.department}
                            </td>
                            <td>
                                {cand.resume ? (
                                    <a
                                        href={`http://localhost:8000/uploads/${cand.resume}`}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        Download
                                    </a>
                                ) : (
                                    <span className="text-muted">No Resume</span>
                                )}
                            </td>


                        </tr>
                    ))
                )}
                </tbody>
            </table>
            <AddCandidateModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddCandidate}
            />

        </div>
    );
};

export default Candidates;
