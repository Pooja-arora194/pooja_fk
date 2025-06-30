
import React, { useState, useEffect } from 'react';
import { Calendar, Form } from 'antd';
import dayjs from 'dayjs';
import AddLeaveModal from "../modal/addLeave";
import axios from 'axios';
import 'antd/dist/reset.css';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Api_Url } from "../setting";
const position = ['Approve', 'Reject', ];
const Leaves = () => {
    const [form] = Form.useForm();
    const [value, setValue] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [allLeave, setAllLeave] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await axios.get(`${Api_Url}/allLeaves`);
            setAllLeave(res.data);
        } catch (err) {
            console.error("Error fetching leaves", err);
        }
    };

    const handleAddLeave = (values) => {
        setIsModalOpen(false);
        form.resetFields();
        fetchLeaves();
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`${Api_Url}/update-leave-status/${id}`, {
                status: newStatus,
            });
            toast.success("Status updated successfully");
            fetchLeaves();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const onSelectDate = (date) => {
        setSelectedDate(date);
    };

    const filteredLeaves = allLeave.filter(leave =>
        leave.status === "Approve" &&
        dayjs(leave.leaveDate).format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD")
    );
    const getApprovedLeavesByDate = (date) => {
        return allLeave.filter(
            (leave) =>
                leave.status === "Approve" &&
                dayjs(leave.leaveDate).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
        );
    };
    return (
        <div className="container-fluid">
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <div className="d-flex gap-2 mb-2">
                    <select className="form-select" style={{ width: 150 }}>
                        <option value="">Status</option>
                        {position.map((pos) => (
                            <option key={pos} value={pos}>{pos}</option>
                        ))}
                    </select>
                </div>
                <div className="d-flex align-items-center gap-3 mb-2">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search"
                        style={{ width: 200 }}
                    />
                    <button
                        className="btn btn-primary rounded-pill"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Leave
                    </button>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            Candidate Leave Requests
                        </div>
                        <div className="card-body p-0">
                            <table className="table table-hover mb-0">
                                <thead className="bg-light">
                                <tr>
                                    <th>Sr No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allLeave.map((leave, index) => (
                                    <tr key={leave._id || index}>
                                        <td>{index + 1}</td>
                                        <td>{leave.candidateId?.name || "N/A"}</td>
                                        <td>{leave.candidateId?.email || "N/A"}</td>
                                        <td>{leave.candidateId?.phone || "N/A"}</td>
                                        <td>{leave.candidateId?.position || "N/A"}</td>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={leave.status}
                                                onChange={(e) => handleStatusChange(leave._id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Approve">Approve</option>
                                                <option value="Reject">Reject</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-sm-4">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            Leave Calendar
                        </div>
                        <div className="card-body">
                            <Calendar
                                fullscreen={false}
                                value={selectedDate}
                                onSelect={onSelectDate}
                                dateCellRender={(date) => {
                                    const approvedLeaves = getApprovedLeavesByDate(date);
                                    return approvedLeaves.length > 0 ? (
                                        <div className="d-flex justify-content-center">
        <span
            style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                backgroundColor: 'purple',
                borderRadius: '50%',
                marginTop: 2,
            }}
        ></span>
                                        </div>
                                    ) : null;
                                }}
                            />
                            {filteredLeaves.length > 0 && (
                                <div className="mt-3">
                                    <h6 className="text-primary">Approved Leaves</h6>
                                    <div className="d-flex flex-wrap gap-3">
                                        {filteredLeaves.map((leave) => (
                                            <div key={leave._id} className="border rounded p-2" style={{ minWidth: 220 }}>
                                                <div className="d-flex justify-content-between">
                                                    <strong>{leave.candidateId?.name}</strong>
                                                    <span>{dayjs(leave.leaveDate).format("DD/MM/YY")}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AddLeaveModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddLeave}
            />
        </div>
    );
};

export default Leaves;
