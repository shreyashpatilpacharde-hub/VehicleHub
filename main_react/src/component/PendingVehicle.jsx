import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PendingVehicle.css";

function AdminPendingVehicles() {

    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {

        try {

            const res = await axios.get(
                "https://vehiclehub-viee.onrender.com/admin/pending"
            );

            setVehicles(res.data);

        } catch (err) {

            console.log(err);

            alert("Unable to Load Vehicles");

        }

    };

    // Change Sold Price

    const handlePriceChange = (id, value) => {

        setVehicles(

            vehicles.map((vehicle) => {

                if (vehicle.vehicle_id === id) {

                    return {
                        ...vehicle,
                        sold_price: value
                    };

                }

                return vehicle;

            })

        );

    };

    // Update Price

    const updatePrice = async (id, sold_price) => {

        try {

            const res = await axios.put(

                `https://vehiclehub-viee.onrender.com/admin/update-price/${id}`,

                {
                    sold_price: sold_price
                }

            );

            alert(res.data.message);

            loadVehicles();

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                "Price Update Failed"
            );

        }

    };

    // Smart image URL: Cloudinary full URL or fallback to local
    const getImageUrl = (image) => {
        if (!image) return "";
        if (image.startsWith("http")) return image;
        return `https://vehiclehub-viee.onrender.com/uploads/${image}`;
    };

    return (
        <div className="pending-page">

            <div className="page-shell">

                {/* Back Button */}
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h2>Pending Vehicles</h2>

                <div className="pending-panel">

                    <div className="table-shell">

                        <table className="pending-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Owner</th>
                                    <th>Vehicle Number</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Year</th>
                                    <th>Fuel</th>
                                    <th>KM</th>
                                    <th>Condition</th>
                                    <th>Update Price</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {vehicles.length === 0 ? (

                                    <tr>
                                        <td colSpan="12" className="text-center">
                                            No Pending Vehicles
                                        </td>
                                    </tr>

                                ) : (

                                    vehicles.map((vehicle) => (

                                        <tr key={vehicle.vehicle_id}>

                                            <td>{vehicle.vehicle_id}</td>

                                            <td>{vehicle.owner_name}</td>

                                            <td>{vehicle.vehicle_number}</td>

                                            <td>{vehicle.brand}</td>

                                            <td>{vehicle.model}</td>

                                            <td>{vehicle.year}</td>

                                            <td>{vehicle.fuel_type}</td>

                                            <td>{vehicle.km_driven}</td>

                                            <td>{vehicle.vehicle_condition}</td>

                                            <td>
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    value={
                                                        vehicle.sold_price ||
                                                        vehicle.price
                                                    }
                                                    onChange={(e) =>
                                                        handlePriceChange(
                                                            vehicle.vehicle_id,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>

                                            <td>
                                                <img
                                                    src={getImageUrl(vehicle.vehicle_image)}
                                                    width="80"
                                                    height="60"
                                                    alt="Vehicle"
                                                />
                                            </td>

                                            <td>
                                                <button
                                                    className="button-primary"
                                                    onClick={() =>
                                                        updatePrice(
                                                            vehicle.vehicle_id,
                                                            vehicle.sold_price ||
                                                            vehicle.price
                                                        )
                                                    }
                                                >
                                                    Update Price
                                                </button>
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminPendingVehicles;
