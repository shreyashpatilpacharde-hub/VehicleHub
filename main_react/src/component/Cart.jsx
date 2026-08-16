import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

function Cart() {

    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const user_id = sessionStorage.getItem("user_id");
    const buyer_name = sessionStorage.getItem("name");
    const buyer_mobile = sessionStorage.getItem("mobile");


    // ================= LOAD CART =================

    useEffect(() => {

        if (!user_id) {

            navigate("/login");

            return;

        }

        loadCart();

    }, [user_id, navigate]);


    const loadCart = async () => {

        try {

            const res = await axios.get(
                `https://vehiclehub-viee.onrender.com/cart/${user_id}`
            );

            console.log("Cart Data:", res.data.cart);

            setCart(res.data.cart || []);

        } catch (err) {

            console.log("Cart Error:", err);

            setCart([]);

        } finally {

            setLoading(false);

        }

    };


    // ================= REMOVE FROM CART =================

    const removeFromCart = async (vehicle_id) => {

        try {

            await axios.delete(
                `https://vehiclehub-viee.onrender.com/cart/${user_id}/${vehicle_id}`
            );

            alert("Vehicle removed from cart");

            loadCart();

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Failed to remove vehicle"
            );

        }

    };


    // ================= PAYMENT =================

    const payment = async (vehicle_id) => {

        try {

            if (!user_id) {

                alert("Please Login Again");

                navigate("/login");

                return;

            }


            if (!buyer_name || !buyer_mobile) {

                alert("Buyer information not found. Please Login Again");

                navigate("/login");

                return;

            }


            /*
             * First find Pending Order for this vehicle
             */

            const orderRes = await axios.get(
                `https://vehiclehub-viee.onrender.com/orders/${user_id}`
            );


            const orders = orderRes.data.orders || [];


            const order = orders.find(
                (o) =>
                    Number(o.vehicle_id) === Number(vehicle_id) &&
                    o.status === "Pending"
            );


            if (!order) {

                alert("Pending order not found");

                console.log(
                    "Vehicle ID:",
                    vehicle_id
                );

                console.log(
                    "Orders:",
                    orders
                );

                return;

            }


            console.log(
                "Order ID:",
                order.order_id
            );


            /*
             * Payment
             */

            const paymentRes = await axios.put(
                `https://vehiclehub-viee.onrender.com/orders/${order.order_id}/payment`
            );


            alert(
                paymentRes.data.message ||
                "You purchased vehicle successfully"
            );


            loadCart();

        } catch (err) {

            console.log(
                "Payment Error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Payment failed"
            );

            loadCart();

        }

    };


    // ================= IMAGE URL =================

    const getImageUrl = (image) => {

        if (!image) {

            return "";

        }


        if (image.startsWith("http")) {

            return image;

        }


        return `https://vehiclehub-viee.onrender.com/uploads/${image}`;

    };


    return (

        <div className="cart-page">


            {/* ================= BACK BUTTON ================= */}

            <button
                className="cart-back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>


            {/* ================= HEADER ================= */}

            <div className="cart-header">

                <h1>
                    My Cart
                </h1>

                <p>
                    Vehicles added to your cart.
                </p>

            </div>


            {/* ================= CART CONTENT ================= */}

            <div className="cart-container">


                {loading ? (

                    <div className="cart-message">

                        Loading cart...

                    </div>


                ) : cart.length === 0 ? (

                    <div className="cart-message">

                        <h3>
                            No Vehicles
                        </h3>

                        <p>
                            Add a vehicle to your cart to see it here.
                        </p>

                    </div>


                ) : (

                    cart.map((item) => (

                        <div
                            className="cart-card"
                            key={item.cart_id}
                        >


                            {/* ================= IMAGE ================= */}

                            <div className="cart-image-section">

                                <img
                                    src={getImageUrl(
                                        item.vehicle_image
                                    )}
                                    alt={item.model}
                                    className="cart-image"
                                />

                            </div>


                            {/* ================= DETAILS ================= */}

                            <div className="cart-details">

                                <p className="cart-label">
                                    VEHICLE
                                </p>


                                <h2>
                                    {item.brand}
                                </h2>


                                <h3>
                                    {item.model}
                                </h3>


                                <div className="cart-info">


                                    <p>

                                        <span>
                                            Vehicle Number
                                        </span>

                                        <strong>
                                            {item.vehicle_number}
                                        </strong>

                                    </p>


                                    <p>

                                        <span>
                                            Year
                                        </span>

                                        <strong>
                                            {item.year}
                                        </strong>

                                    </p>


                                    <p>

                                        <span>
                                            Fuel
                                        </span>

                                        <strong>
                                            {item.fuel_type}
                                        </strong>

                                    </p>


                                    <p>

                                        <span>
                                            KM Driven
                                        </span>

                                        <strong>
                                            {item.km_driven}
                                        </strong>

                                    </p>


                                    <p>

                                        <span>
                                            Condition
                                        </span>

                                        <strong>
                                            {item.vehicle_condition}
                                        </strong>

                                    </p>


                                </div>


                                {/* ================= PRICE ================= */}

                                <div className="cart-price">

                                    ₹ {Number(
                                        item.sold_price ||
                                        item.price ||
                                        0
                                    ).toLocaleString("en-IN")}

                                </div>


                            </div>


                            {/* ================= ACTIONS ================= */}

                            <div className="cart-actions">


                                {/* REMOVE */}

                                <button
                                    className="remove-button"
                                    onClick={() =>
                                        removeFromCart(
                                            item.vehicle_id
                                        )
                                    }
                                >
                                    Remove
                                </button>


                                {/* PAYMENT */}

                                <button
                                    className="payment-button"
                                    onClick={() =>
                                        payment(
                                            item.vehicle_id
                                        )
                                    }
                                >
                                    Payment
                                </button>


                            </div>


                        </div>

                    ))

                )}

            </div>

        </div>

    );

}

export default Cart;
