import React, {useEffect, useState} from "react";
import { BsEnvelopeFill, BsFillBellFill } from "react-icons/bs";
import { Modal, Form, Input, Select, Button } from "antd";
import EditCandidateModal from "../modal/editCandidate";
import axios from "axios";
import moment from 'moment'
import { ToastContainer, toast } from "react-toastify";
import { Dropdown, Menu } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { Api_Url } from "../setting";
const { Option } = Select;

const position = [
    'Intern', 'Full Time', 'Part Time'
]
const Employee = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterPosition, setFilterPosition] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isModalOpen, setIsModalOpen] = useState({
        visible:false,
        candidates: {}
    });
    const [form] = Form.useForm();

    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const res = await axios.get(`${Api_Url}/all`);
            const selectedCandidates = res.data.filter(item => item.status === 'Selected');
            setCandidates(selectedCandidates);
        } catch (err) {
            console.error("Error fetching candidates", err);
        }
    };
    const filteredCandidates = candidates.filter((cand) => {
        const matchesSearch =
            cand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cand.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cand.department.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPosition = filterPosition
            ? cand.position === filterPosition
            : true;

        return matchesSearch && matchesPosition;
    });
    const handleEditCandidate = (values) => {
        console.log("New Candidate:", values);
        setIsModalOpen(false);
        fetchCandidates()
        form.resetFields();
    };
    const handleDeleteCandidate = async (id) => {
        try {
            await axios.delete(`${Api_Url}/delete/${id}`);
            toast.success("Candidate deleted successfully");
            fetchCandidates();
        } catch (err) {
            console.error("Delete error", err);
            toast.error("Failed to delete candidate");
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


                </div>
            </div>


            <table className="table table-hover">
                <thead style={{ backgroundColor: "#4B0082", color: "white" }}>
                <tr>
                    <th>Sr No.</th>
                    <th>Employee Name</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Date Of Joining</th>
                    <th>Action</th>
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
                                {cand.department}
                            </td>
                            <td>{cand.joiningDate ? moment(cand.joiningDate).format("DD/MM/YYYY") : "-"}</td>

                            <td>
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="edit" onClick={() => setIsModalOpen({visible: true, candidates: cand})}>
                                                Edit
                                            </Menu.Item>
                                            <Menu.Item key="delete" onClick={() => handleDeleteCandidate(cand._id)}>
                                                Delete
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    trigger={["click"]}
                                >
                                <span style={{ fontSize: 20, cursor: "pointer" }}>
                                  <MoreOutlined />
                                </span>
                                </Dropdown>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
            <EditCandidateModal
                open={isModalOpen.visible}
                candidates={isModalOpen.candidates}
                onClose={() => setIsModalOpen({visible: false, candidates: {}})}
                onSubmit={handleEditCandidate}
            />
        </div>
    );
};

export default Employee;
