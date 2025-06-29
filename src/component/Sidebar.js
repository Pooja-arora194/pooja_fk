import { NavLink } from "react-router-dom";
import { FaUserFriends, FaChartBar, FaSignOutAlt, FaSun, FaUserPlus } from "react-icons/fa";

function Sidebar() {
    return (
        <div className="sidebar bg-white shadow-sm vh-100 p-3" style={{ width: "250px" }}>
            <h4 className="mb-4">LOGO</h4>
            <input className="form-control mb-4" placeholder="Search" />
            <div>
                <p className="text-muted">Recruitment</p>
                <NavLink to="/candidates" className="d-block mb-2"><FaUserPlus className="me-2" /> Candidates</NavLink>

                <p className="text-muted mt-4">Organization</p>
                <NavLink to="/employees" className="d-block mb-2"><FaUserFriends className="me-2" /> Employees</NavLink>
                <NavLink to="/attendance" className="d-block mb-2"><FaChartBar className="me-2" /> Attendance</NavLink>
                <NavLink to="/leaves" className="d-block"><FaSun className="me-2" /> Leaves</NavLink>

                <p className="text-muted mt-4">Others</p>
                <p className="d-block"><FaSignOutAlt className="me-2" /> Logout</p>
            </div>
        </div>
    );
}

export default Sidebar;
