import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BuyHistory.css";

function BuyHistory() {

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [buyHistory, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 2;

    useEffect(() => {
        loadHistory();
    }, [page]);

    const loadHistory = async () => {

        try {

            const res = await axios.get(
                `http://localhost:3000/admin/buy-history?page=${page}`
            );

            setHistory(res.data.history);
            setTotalPages(res.data.totalPages);

        } catch (err) {

            console.log(err);

            alert("Unable to Load Buy History");

        }

    };

    const searchHistory = async () => {

        try {

            const res = await axios.post(
                "http://localhost:3000/admin/search-history",
                {
                    search
                }
            );

            setHistory(res.data);

        } catch (err) {

            console.log(err);

            alert("Search Failed");

        }

    };

    return (
        <div className="history-page">

            <div className="page-shell">

                {/* Back Button */}
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <h2>Buy History</h2>

                <div className="history-panel">

                    {/* Search Section */}
                    <div className="search-toolbar">

                        <input
                            type="text"
                            placeholder="Search by vehicle no, brand, buyer name or date (YYYY-MM-DD)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button
                            type="button"
                            className="button-primary"
                            onClick={searchHistory}
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
                                    <th>Vehicle No</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Owner Name</th>
                                    <th>Buyer Name</th>
                                    <th>Buyer Mobile</th>
                                    <th>Purchase Price</th>
                                    <th>Sold Price</th>
                                    <th>Purchase Date</th>
                                </tr>
                            </thead>

                            <tbody>

                                {buyHistory.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="text-center"
                                        >
                                            No Buy History Found
                                        </td>
                                    </tr>

                                ) : (

                                    buyHistory.map((item) => (

                                        <tr key={item.vehicle_id}>

                                            <td>
                                                {item.vehicle_id}
                                            </td>

                                            <td>
                                                {item.vehicle_number}
                                            </td>

                                            <td>
                                                {item.brand}
                                            </td>

                                            <td>
                                                {item.model}
                                            </td>

                                            <td>
                                                {item.owner_name}
                                            </td>

                                            <td>
                                                {item.buyer_name}
                                            </td>

                                            <td>
                                                {item.buyer_mobile}
                                            </td>

                                            <td>
                                                ₹ {item.price}
                                            </td>

                                            <td>
                                                ₹ {item.sold_price}
                                            </td>

                                            <td>
                                                {new Date(
                                                    item.sold_at
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
                            type="button"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            type="button"
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

export default BuyHistory;