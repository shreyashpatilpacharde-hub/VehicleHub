import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SoldVehicles.css";

function SoldVehicles() {

    const navigate = useNavigate();

    const [soldVehicles, setSoldVehicles] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 2;

    useEffect(() => {
        loadVehicles();
    }, [page]);

    const loadVehicles = async () => {

        try {

            const res = await axios.get(
                `http://localhost:3000/admin/sold?page=${page}`
            );

            setSoldVehicles(res.data.vehicles);
            setTotalPages(res.data.totalPages);

        } catch (err) {

            console.log(err);

            alert("Unable to Load Sold Vehicles");

        }

    };

    const searchVehicles = async () => {

        try {

            const res = await axios.post(
                "http://localhost:3000/admin/search-sold",
                {
                    search
                }
            );

            setSoldVehicles(res.data.sold);

        } catch (err) {

            console.log(err);

            alert("Search Failed");

        }
    };

    return (
        <div className="sold-page">

            <div className="page-shell">

                {/* Back Button */}
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                {/* Page Heading */}
                <h2>Sold Vehicles</h2>

                <div className="sold-panel">

                    {/* Search Section */}
                    <div className="search-toolbar">

                        <input
                            type="text"
                            placeholder="Search by vehicle no, brand, buyer name or date (YYYY-MM-DD)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button
                            className="button-primary"
                            onClick={searchVehicles}
                        >
                            Search
                        </button>

                    </div>

                    {/* Table */}
                    <div className="table-shell">

                        <table className="table-dark">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Owner</th>
                                    <th>Vehicle No</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Buyer Name</th>
                                    <th>Buyer Mobile</th>
                                    <th>Purchase Price</th>
                                    <th>Sold Price</th>
                                    <th>Sold Date</th>
                                </tr>
                            </thead>

                            <tbody>

                                {soldVehicles.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="text-center"
                                        >
                                            No Sold Vehicles
                                        </td>
                                    </tr>

                                ) : (

                                    soldVehicles.map((vehicle) => (

                                        <tr key={vehicle.vehicle_id}>

                                            <td>
                                                {vehicle.vehicle_id}
                                            </td>

                                            <td>
                                                {vehicle.owner_name}
                                            </td>

                                            <td>
                                                {vehicle.vehicle_number}
                                            </td>

                                            <td>
                                                {vehicle.brand}
                                            </td>

                                            <td>
                                                {vehicle.model}
                                            </td>

                                            <td>
                                                {vehicle.buyer_name}
                                            </td>

                                            <td>
                                                {vehicle.buyer_mobile}
                                            </td>

                                            <td>
                                                ₹ {vehicle.price}
                                            </td>

                                            <td className="sold-price">
                                                ₹ {vehicle.sold_price}
                                            </td>

                                            <td>
                                                {new Date(
                                                    vehicle.sold_at
                                                ).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                })}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* Pagination */}
                    <div className="pagination-row">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default SoldVehicles;