import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdatePrice.css";

function UpdatePrice() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [price, setPrice] = useState("");

    const updatePrice = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.put(
                `https://vehiclehub-viee.onrender.com/admin/update-price/${id}`,
                {
                    price
                }
            );

            alert(res.data.message);

            navigate("/admin/pending");

        } catch (err) {

            console.log(err);

            alert("Price Update Failed");

        }

    };

    return (
        <div className="update-price-page">
            <div className="update-price-card">
                <h3>Update Vehicle Price</h3>
                <form onSubmit={updatePrice}>
                    <input
                        type="number"
                        className="input-field"
                        placeholder="Enter New Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <button type="submit" className="button-primary">Update Price</button>
                </form>
            </div>
        </div>
    );

}

export default UpdatePrice;
