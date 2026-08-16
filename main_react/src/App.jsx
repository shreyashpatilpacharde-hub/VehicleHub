import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/theme.css";

import Register from "./component/Register";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";
import SellVehicle from "./component/SellVehicle";
import BuyVehicle from "./component/BuyVehicle";
import AdminLogin from "./component/AdminLogin";
import AdminDashboard from "./component/AdminDashboard";
import PendingVehicle from "./component/PendingVehicle";
import UpdatePrice from "./component/UpdatePrice";
import SoldVehicles from "./component/SoldVehicles";
import BuyHistory from "./component/BuyHistory";
import Chatbot from "./component/Chatbot";
import Contact from "./component/Contact";
import Cart from "./component/Cart";
import AdminOrders from "./component/AdminOrders";
import Home from "./component/Home";



function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Register */}
                <Route path="/register" element={<Register />} />

                <Route path="/login" element={<Login />} />

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/sell" element={<SellVehicle />} />

                <Route path="buy" element={<BuyVehicle />} />

                <Route path="adminlogin" element={<AdminLogin />} />

                <Route path="admindashboard" element={<AdminDashboard />} />

                <Route path="pending" element={<PendingVehicle />} />

                <Route path="updateprice" element={<UpdatePrice />} />

                <Route path="adminsold" element={<SoldVehicles />} />

                <Route path="buyhistory" element={<BuyHistory />} />

                <Route path="chatbot" element={<Chatbot />} />

                <Route path="contact" element={<Contact />} />

                <Route path="cart" element={<Cart />} />

                <Route path="adminorders" element={<AdminOrders />} />

                <Route path="home" element={<Home />} />

                <Route path="/" element={<Home />} />

                
            </Routes>

        </BrowserRouter>

    );

}

export default App;