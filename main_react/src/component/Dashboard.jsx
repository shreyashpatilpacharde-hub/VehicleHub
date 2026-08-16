import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);
import "./Dashboard.css";
import Chatbot from "./Chatbot";

function Dashboard() {
    const navigate = useNavigate();

    if(!sessionStorage.getItem("user_id")) {
        navigate("/login");
    }

    const [dashboard, setDashboard] = useState({

        totalVehicles: 0,
        totalUsers: 0,
        soldVehicles: 0,
        availableVehicles: 0,
        totalBrands: 0
    });

    const [status,setStatus] = useState({
        available: 0,
        sold: 0
    });

    const [brandData, setBrandData] = useState([]);

    useEffect(() => {
        loadDashboard();

        axios.get("https://vehiclehub-viee.onrender.com/vehicle-status")
          .then((res) => setStatus(res.data));

        axios.get("https://vehiclehub-viee.onrender.com/brand-chart")
          .then((res) => {
            setBrandData(res.data);
          });
    }, []);

    const data = {
        labels: ["Available", "Sold"],
        datasets: [
            {
                label: "Vehicle Status",
                data: [status.available,status.sold],
                backgroundColor: [
                    "#28a745",
                    "#dc3545"
                ],
                borderColor: [
                    "#28a745",
                    "#dc3545"
                ],
                borderWidth: 2
            }
        ]
    };

    const brandChart = {
        labels: brandData.map((item) => item.brand),

        datasets: [
            {
                label: "Vehicles by Brand",

                data:brandData.map(
                    (item) => item.total
                ),

                borderColor:"#1565c0",

                backgroundColor: "#1565c0",

                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 15,
                
                ticks: {
                    stepSize: 5,
                    precision: 0
                }
            }
        }
    };

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%"
    };

    const loadDashboard = async () => {

        try {

            const res = await axios.get("https://vehiclehub-viee.onrender.com/admin/dashboard");

            setDashboard(res.data);

        } catch(err) {

            console.log(err);
        }
    };

    const logout = async () => {

        const id = sessionStorage.getItem("user_id");

           
        await axios.delete(
            `https://vehiclehub-viee.onrender.com/logout/${id}`
        )
        
        sessionStorage.clear();

        navigate("/login");
    };

    return (
        <div className="dashboard">

            <div className="sidebar">
                <h2>Vehicle Hub</h2>

                <Link to="/dashboard" className="menu">Home</Link>

                <Link to="/buy" className="menu">Buy Vehicle</Link>

                <Link to="/sell" className="menu">Sell Vehicle</Link>

                <Link to="/cart" element="menu">Cart</Link>

                <Link to="/contact" className="menu">Contact Us</Link>

                <button className="logout-btn"onClick={logout}>Logout</button>
            </div>

            <div className="main-content">
           

              <div className="dashboard-cards">

                  <div className="dashboard-card total-card">
                      <div className="card-icon">🚗</div>
                      <h4>Total Vehicles</h4>
                      <h2>{dashboard.totalVehicles}</h2>
                  </div>

                  <div className="dashboard-card total-card">
                      <div className="card-icon">👤</div>
                      <h4>Total Users</h4>
                      <h2>{dashboard.totalUsers}</h2>
                  </div>

                  <div className="dashboard-card total-card">
                      <div className="card-icon">✅</div>
                      <h4>Sold Vehicles</h4>
                      <h2>{dashboard.soldVehicles}</h2>
                  </div>

                  <div className="dashboard-card total-card">
                      <div className="card-icon">🚘</div>
                      <h4>Available Vehicles</h4>
                      <h2>{dashboard.availableVehicles}</h2>
                  </div>

                  <div className="dashboard-card total-card">
                      <div className="card-icon">🏷️</div>
                      <h4>Total Brands</h4>
                      <h2>{dashboard.totalBrands}</h2>
                  </div>

                  

                  </div>

                      <h3>Vehicle Status</h3>
                      <div className="chart-section">

                        <div className="chart-box">
                          <Doughnut data={data} />
                        </div>

                        <div className="chart-box">
                          <h3>Brand Analysis</h3>

                          <Line data={brandChart} options={options} />
                        </div>
                      </div>
              </div>

              <Chatbot />
        </div>
    );
}

export default Dashboard;
