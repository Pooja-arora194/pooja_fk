import { useState, useEffect } from "react";
import { FaUserFriends, FaChartBar, FaSignOutAlt, FaSun } from "react-icons/fa";
import { BsFillBellFill, BsEnvelopeFill } from "react-icons/bs";
import Candidates from "../component/Candidate";
import Employees from "../component/Employee";
import Attendance from "../component/Attendance";
import Leaves from "../component/Leaves";
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const [activeComponent, setActiveComponent] = useState("Candidates");

    const renderComponent = () => {
        switch (activeComponent) {
            case "Candidates":
                return <Candidates />;
            case "Employees":
                return <Employees />;
            case "Attendance":
                return <Attendance />;
            case "Leaves":
                return <Leaves />;
            default:
                return null;
        }
    };
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            const expiry = localStorage.getItem("tokenExpiry");
            if (Date.now() > expiry) {
                localStorage.clear();
                navigate("/");
            }
        }, 60 * 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="d-flex">
            <div className="sidebar bg-white shadow-sm" style={{ minWidth: 250, height: "100vh" }}>
                <div className="p-3">
                    <h4 className="mb-4">LOGO</h4>
                    <p
                        className={`menu-item ${activeComponent === "Candidates" ? "text-primary fw-bold" : ""}`}
                        onClick={() => setActiveComponent("Candidates")}
                    >
                        + Candidates
                    </p>

                    <p
                        className={`menu-item ${activeComponent === "Employees" ? "text-primary fw-bold" : ""}`}
                        onClick={() => setActiveComponent("Employees")}
                    >
                        <FaUserFriends /> Employees
                    </p>

                    <p
                        className={`menu-item ${activeComponent === "Attendance" ? "text-primary fw-bold" : ""}`}
                        onClick={() => setActiveComponent("Attendance")}
                    >
                        <FaChartBar /> Attendance
                    </p>

                    <p
                        className={`menu-item ${activeComponent === "Leaves" ? "text-primary fw-bold" : ""}`}
                        onClick={() => setActiveComponent("Leaves")}
                    >
                        <FaSun /> Leaves
                    </p>
                    <div className="mt-4">
                        <p className="text-muted">Others</p>
                        <p className="menu-item text-danger fw-bold" onClick={() => {
                            localStorage.clear();
                            navigate("/");
                        }}>
                            <FaSignOutAlt /> Logout
                        </p>
                    </div>
                </div>
            </div>


            <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h2>{activeComponent}</h2>
                    <div className="d-flex align-items-center gap-3">

                        <BsEnvelopeFill size={20} />
                        <BsFillBellFill size={20} />
                    </div>

                </div>

                <div className="p-4">
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
