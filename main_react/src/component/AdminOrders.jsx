import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

function AdminOrders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);


    // ================= GET ORDERS =================

    const getOrders = async () => {

        try {

            const res = await axios.get(
                "http://localhost:3000/admin/orders"
            );

            setOrders(res.data.orders || []);

        } catch (err) {

            console.log(err);

            setOrders([]);

        } finally {

            setLoading(false);

        }

    };


    // ================= LOAD ORDERS =================

    useEffect(() => {

        getOrders();

    }, []);


    // ================= IMAGE =================

    const getImage = (image) => {

        if (!image) {
            return "";
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `http://localhost:3000/uploads/${image}`;

    };


    return (

        <div className="admin-orders-page">


            {/* Back Button */}

            <button
                className="admin-orders-back"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>


            {/* Heading */}

            <div className="admin-orders-header">

                <p>
                    VEHICLE MANAGEMENT SYSTEM
                </p>

                <h1>
                    Orders
                </h1>

                <span>
                    Manage vehicle purchase orders
                </span>

            </div>


            {/* Orders */}

            <div className="admin-orders-container">


                {loading ? (

                    <div className="orders-message">
                        Loading Orders...
                    </div>

                ) : orders.length === 0 ? (

                    <div className="orders-message">

                        <h3>
                            No Orders Found
                        </h3>

                        <p>
                            There are currently no vehicle orders.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="orders-table">

                            <thead>

                                <tr>

                                    <th>
                                        Image
                                    </th>

                                    <th>
                                        Brand
                                    </th>

                                    <th>
                                        Model
                                    </th>

                                    <th>
                                        Vehicle Number
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Buyer Name
                                    </th>

                                    <th>
                                        Buyer Mobile
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Order Date
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {orders.map((order) => (

                                    <tr
                                        key={order.order_id}
                                    >


                                        {/* Image */}

                                        <td>

                                            {order.vehicle_image ? (

                                                <img
                                                    src={getImage(
                                                        order.vehicle_image
                                                    )}
                                                    alt="Vehicle"
                                                    className="order-image"
                                                />

                                            ) : (

                                                <span>
                                                    No Image
                                                </span>

                                            )}

                                        </td>


                                        {/* Brand */}

                                        <td>
                                            {order.brand}
                                        </td>


                                        {/* Model */}

                                        <td>
                                            {order.model}
                                        </td>


                                        {/* Vehicle Number */}

                                        <td>
                                            {order.vehicle_number}
                                        </td>


                                        {/* Price */}

                                        <td className="order-price">

                                            ₹ {Number(
                                                order.sold_price || 0
                                            ).toLocaleString("en-IN")}

                                        </td>


                                        {/* Buyer Name */}

                                        <td>
                                            {order.buyer_name}
                                        </td>


                                        {/* Buyer Mobile */}

                                        <td>
                                            {order.buyer_mobile}
                                        </td>


                                        {/* Status */}

                                        <td>

                                            {order.status === "Sold" ? (

                                                <span className="status sold">
                                                    Sold
                                                </span>

                                            ) : order.status === "Pending" ? (

                                                <span className="status pending">
                                                    Pending
                                                </span>

                                            ) : (

                                                <span className="status">
                                                    {order.status}
                                                </span>

                                            )}

                                        </td>


                                        {/* Date */}

                                        <td>

                                            {order.created_at
                                                ? new Date(
                                                    order.created_at
                                                ).toLocaleDateString("en-IN")
                                                : "-"
                                            }

                                        </td>


                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default AdminOrders;