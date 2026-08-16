import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();

        navigate("/login");
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-panel page-shell">
                <div className="admin-hero">
                    <div>
                        <h2>Admin Dashboard</h2>
                        <p>Manage pending approvals, sold inventory, and purchase history with premium admin tools.</p>
                    </div>
                    <button onClick={logout}>Logout</button>
                </div>
                <div className="admin-actions">
                    <Link to="/pending">Pending Vehicles</Link>
                    <Link to="/adminsold">Sold Vehicles</Link>
                    <Link to="/buyhistory">Buy History</Link>
                    <Link to="/adminorders">Orders</Link>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;