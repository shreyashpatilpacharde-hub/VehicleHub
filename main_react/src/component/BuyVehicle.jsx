import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BuyVehicle.css";

function BuyVehicle() {

    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 2;

    const loadVehicles = async () => {

        try {

            const res = await axios.get(
                `http://localhost:3000/buy?page=${page}`
            );

            setVehicles(res.data.vehicles);
            setTotalPages(res.data.totalPages);

        } catch (err) {

            console.log(err);
            alert("Failed to Load Vehicles");

        }

    };

    useEffect(() => {

        loadVehicles();

    }, [page]);


    // ================= ADD TO CART =================

    const addToCart = async (vehicle_id) => {

    try {

        const user_id = sessionStorage.getItem("user_id");

        if (!user_id) {

            alert("Please Login Again");

            navigate("/login");

            return;

        }

        const res = await axios.post(
            "http://localhost:3000/cart",
            {
                user_id,
                vehicle_id
            }
        );

        alert(res.data.message);

    } catch (err) {

        console.log(err);

        alert(
            err.response?.data?.message ||
            "Failed to add vehicle to cart"
        );

    }

};
    const searchVehicles = async () => {

        if (search.trim() === "") {

            loadVehicles();
            return;

        }

        try {

            const res = await axios.post(
                "http://localhost:3000/search",
                {
                    search
                }
            );

            setVehicles(res.data);

        } catch (err) {

            console.log(err);
            alert("Search Failed");

        }

    };


    return (

        <div className="buy-page">

            {/* Header */}

            <div className="buy-header">

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <div className="buy-title">

                    <p className="page-label">
                        VEHICLE MARKETPLACE
                    </p>

                    <h2>
                        Available Vehicles
                    </h2>

                    <p className="page-description">
                        Find your perfect vehicle from our available collection.
                    </p>

                </div>

                <div className="header-space"></div>

            </div>


            {/* Search */}

            <div className="search-section">

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search Brand or Model"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

                <button
                    className="search-button"
                    onClick={searchVehicles}
                >
                    Search
                </button>

            </div>


            {/* Vehicle List */}

            <div className="vehicle-list">

                {
                    vehicles.length > 0 ?

                    vehicles.map((v) => (

                        <div
                            key={v.vehicle_id}
                            className="vehicle-card"
                        >

                            <div className="vehicle-image-section">

                                <img
                                    src={`http://localhost:3000/uploads/${v.vehicle_image}`}
                                    alt="Vehicle"
                                    className="vehicle-image"
                                />

                                <div className="vehicle-price">
                                    ₹ {v.sold_price}
                                </div>

                            </div>


                            <div className="vehicle-details">

                                <div className="vehicle-title">

                                    <div>

                                        <p className="vehicle-label">
                                            VEHICLE
                                        </p>

                                        <h3>
                                            {v.brand}
                                        </h3>

                                        <p className="vehicle-model">
                                            {v.model}
                                        </p>

                                    </div>

                                </div>


                                <div className="vehicle-info">

                                    <div className="info-item">

                                        <span>
                                            Owner
                                        </span>

                                        <strong>
                                            {v.owner_name}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                                        <span>
                                            Vehicle Number
                                        </span>

                                        <strong>
                                            {v.vehicle_number}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                                        <span>
                                            Year
                                        </span>

                                        <strong>
                                            {v.year}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                                        <span>
                                            Fuel
                                        </span>

                                        <strong>
                                            {v.fuel_type}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                                        <span>
                                            KM Driven
                                        </span>

                                        <strong>
                                            {v.km_driven}
                                        </strong>

                                    </div>


                                    <div className="info-item">

                                        <span>
                                            Condition
                                        </span>

                                        <strong>
                                            {v.vehicle_condition}
                                        </strong>

                                    </div>

                                </div>


                                {/* Add To Cart */}

                                <button
                                    className="buy-button"
                                    onClick={() =>
                                        addToCart(v.vehicle_id)
                                    }
                                >
                                    Add to Cart
                                </button>

                            </div>

                        </div>

                    ))

                    :

                    <div className="no-vehicle">

                        <h3>
                            No Vehicle Available
                        </h3>

                        <p>
                            There are currently no vehicles matching your search.
                        </p>

                    </div>

                }

            </div>


            {/* Pagination */}

            <div className="pagination">

                <button
                    className="pagination-button"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>


                <span className="page-number">
                    Page {page} of {totalPages}
                </span>


                <button
                    className="pagination-button"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>

            </div>

        </div>

    );

}

export default BuyVehicle;