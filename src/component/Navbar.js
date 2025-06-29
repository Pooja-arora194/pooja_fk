import { BsEnvelopeFill, BsFillBellFill } from "react-icons/bs";

function Navbar({ title }) {
    return (
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
            <div className="d-flex gap-2">
                <select className="form-select" style={{ width: 150 }}>
                    <option>Status</option>
                </select>
                <select className="form-select" style={{ width: 150 }}>
                    <option>Position</option>
                </select>
            </div>

            <div className="d-flex align-items-center gap-3">
                <input className="form-control" style={{ width: 200 }} placeholder="Search" />
                <button className="btn btn-primary rounded-pill">Add Candidate{title}</button>
                <BsEnvelopeFill size={20} />
                <BsFillBellFill size={20} />
            </div>
        </div>
    );
}

export default Navbar;
