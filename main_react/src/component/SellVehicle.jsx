import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SellVehicle.css";

function SellVehicle() {

    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState({
        user_id: sessionStorage.getItem("user_id"),
        vehicle_number: "",
        brand: "",
        model: "",
        year: "",
        fuel_type: "",
        km_driven: "",
        vehicle_condition: "",
        price: "",
        vehicle_image: ""
    });

    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setVehicle({
            ...vehicle,
            [name]: value
        });

    };

    // Compress image: FileReader → canvas resize → JPEG base64
    // Falls back to raw FileReader result if canvas fails (e.g. webp on some browsers)
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = (e) => {
                const originalBase64 = e.target.result;
                const img = new Image();

                img.onload = () => {
                    try {
                        const MAX_W = 800;
                        const MAX_H = 600;
                        let width = img.width;
                        let height = img.height;

                        // Scale down proportionally if needed
                        if (width > MAX_W || height > MAX_H) {
                            const ratio = Math.min(MAX_W / width, MAX_H / height);
                            width = Math.round(width * ratio);
                            height = Math.round(height * ratio);
                        }

                        const canvas = document.createElement("canvas");
                        canvas.width = width;
                        canvas.height = height;

                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);

                        // Export as JPEG at 70% quality
                        const compressed = canvas.toDataURL("image/jpeg", 0.70);
                        resolve(compressed);

                    } catch (canvasErr) {
                        // Canvas failed (security / format issue) → use original
                        console.warn("Canvas compression failed, using original:", canvasErr);
                        resolve(originalBase64);
                    }
                };

                img.onerror = () => {
                    // Image element failed → use original FileReader result
                    resolve(originalBase64);
                };

                img.src = originalBase64;
            };

            reader.onerror = () => reject(new Error("Failed to read file"));

            reader.readAsDataURL(file);
        });
    };

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Max original file size: 10MB
        if (file.size > 10 * 1024 * 1024) {
            setUploadMsg("❌ Image too large. Max file size is 10MB.");
            return;
        }

        setUploading(true);
        setUploadMsg("⏳ Processing image...");

        try {
            const base64 = await compressImage(file);
            setVehicle((prev) => ({
                ...prev,
                vehicle_image: base64
            }));
            setUploadMsg("✅ Image ready!");
        } catch (err) {
            console.log("Image processing error:", err);
            setUploadMsg("❌ Could not read image. Please try a different file.");
        } finally {
            setUploading(false);
        }
    };

    const validate = () => {

        let newErrors = {};

        if (vehicle.vehicle_number === "")
            newErrors.vehicle_number = "Vehicle Number is required";

        if (vehicle.brand === "")
            newErrors.brand = "Brand is required";

        if (vehicle.model === "")
            newErrors.model = "Model is required";

        if (vehicle.year === "")
            newErrors.year = "Year is required";

        if (vehicle.fuel_type === "")
            newErrors.fuel_type = "Fuel Type is required";

        if (vehicle.km_driven === "")
            newErrors.km_driven = "Kilometer Driven is required";

        if (vehicle.vehicle_condition === "")
            newErrors.vehicle_condition = "Vehicle Condition is required";

        if (vehicle.price === "")
            newErrors.price = "Price is required";

        if (vehicle.vehicle_image === "")
            newErrors.vehicle_image = "Vehicle Image is required";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (validate()) {

            try {

                const data = {
                    ...vehicle,
                    user_id: sessionStorage.getItem("user_id")
                };

                const res = await axios.post(
                    "https://vehiclehub-viee.onrender.com/sell",
                    data
                );

                alert(res.data.message);

            } catch (err) {

                console.log(err);

                alert(
                    err.response?.data?.message ||
                    "Vehicle Not Added"
                );

            }

        }

    };

    return (
        <div className="sell-page">

            <div className="page-shell">

                {/* Back Button */}
                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>

                <div className="sell-panel">

                    <h2>Sell Your Vehicle</h2>

                    <p className="page-intro">
                        List your car with premium presentation and get buyer attention quickly.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="form-panel"
                    >

                        <div className="form-row">

                            <div className="field-group">

                                <label
                                    className="form-label"
                                    htmlFor="vehicle_number"
                                >
                                    Vehicle Number
                                </label>

                                <input
                                    id="vehicle_number"
                                    type="text"
                                    name="vehicle_number"
                                    className="input-field"
                                    placeholder="Vehicle Number"
                                    value={vehicle.vehicle_number}
                                    onChange={handleChange}
                                />

                                <p className="error-text">
                                    {errors.vehicle_number}
                                </p>

                            </div>


                            <div className="field-group">

                                <label
                                    className="form-label"
                                    htmlFor="brand"
                                >
                                    Brand
                                </label>

                                <input
                                    id="brand"
                                    type="text"
                                    name="brand"
                                    className="input-field"
                                    placeholder="Brand"
                                    value={vehicle.brand}
                                    onChange={handleChange}
                                />

                                <p className="error-text">
                                    {errors.brand}
                                </p>

                            </div>

                        </div>


                        <div className="form-row">

                            <div className="field-group">

                                <label
                                    className="form-label"
                                    htmlFor="model"
                                >
                                    Model
                                </label>

                                <input
                                    id="model"
                                    type="text"
                                    name="model"
                                    className="input-field"
                                    placeholder="Model"
                                    value={vehicle.model}
                                    onChange={handleChange}
                                />

                                <p className="error-text">
                                    {errors.model}
                                </p>

                            </div>


                            <div className="field-group">

                                <label
                                    className="form-label"
                                    htmlFor="year"
                                >
                                    Year
                                </label>

                                <input
                                    id="year"
                                    type="number"
                                    name="year"
                                    className="input-field"
                                    placeholder="Year"
                                    value={vehicle.year}
                                    onChange={handleChange}
                                />

                                <p className="error-text">
                                    {errors.year}
                                </p>

                            </div>

                        </div>


                        <div className="form-row">

                            <div className="field-group">

                                <label
                                    className="form-label"
                                    htmlFor="fuel_type"
                                >
                                    Fuel Type
                                </label>

                                <select
                                    id="fuel_type"
                                    name="fuel_type"
                                    className="select-field"
                                    value={vehicle.fuel_type}
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select Fuel
                                    </option>

                                    <option value="Petrol">
                                        Petrol
                                    </option>

                                    <option value="Diesel">
                                        Diesel
                                    </option>

                                    <option value="Petrol,CNG">
                                        Petrol,CNG
                                    </option>

                                    <option value="CNG">
                                        CNG
                                    </option>

                                    <option value="Petrol,LPG">
                                        Petrol,LPG
                                    </option>

                                    <option value="Electric">
                                        Electric
                                    </option>

                                </select>

                                <p className="error-text">
                                    {errors.fuel_type}
                                </p>

                            </div>


                            <div className="field-group">

                                <label
                                    className="form-label"
                                    htmlFor="km_driven"
                                >
                                    Kilometer Driven
                                </label>

                                <input
                                    id="km_driven"
                                    type="number"
                                    name="km_driven"
                                    className="input-field"
                                    placeholder="Kilometer Driven"
                                    value={vehicle.km_driven}
                                    onChange={handleChange}
                                />

                                <p className="error-text">
                                    {errors.km_driven}
                                </p>

                            </div>

                        </div>


                        <div className="form-row">

                            <div className="field-group">

                                <label
                                    className="form-label"
                                    htmlFor="vehicle_condition"
                                >
                                    Condition
                                </label>

                                <select
                                    id="vehicle_condition"
                                    name="vehicle_condition"
                                    className="select-field"
                                    value={vehicle.vehicle_condition}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Vehicle Condition
                                    </option>

                                    <option value="Excellent">
                                        Excellent
                                    </option>

                                    <option value="Very Good">
                                        Very Good
                                    </option>

                                    <option value="Good">
                                        Good
                                    </option>

                                    <option value="Average">
                                        Average
                                    </option>

                                </select>

                                <p className="error-text">
                                    {errors.vehicle_condition}
                                </p>

                            </div>


                            <div className="field-group">

                                <label
                                    className="form-label"
                                    htmlFor="price"
                                >
                                    Price
                                </label>

                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    className="input-field"
                                    placeholder="Price"
                                    value={vehicle.price}
                                    onChange={handleChange}
                                />

                                <p className="error-text">
                                    {errors.price}
                                </p>

                            </div>

                        </div>


                        <div className="form-group">

                            <label
                                className="form-label"
                                htmlFor="vehicle_image"
                            >
                                Vehicle Image
                            </label>

                            <input
                                id="vehicle_image"
                                type="file"
                                accept="image/*"
                                className="file-field"
                                onChange={handleFile}
                                disabled={uploading}
                            />

                            {uploadMsg && (
                                <p style={{
                                    marginTop: "6px",
                                    fontSize: "13px",
                                    color: uploadMsg.includes("✅") ? "#065f46" : uploadMsg.includes("❌") ? "#991b1b" : "#6366f1",
                                    fontWeight: 500
                                }}>{uploadMsg}</p>
                            )}

                            <p className="error-text">
                                {errors.vehicle_image}
                            </p>

                        </div>


                        <button
                            type="submit"
                            className="button-primary sell-submit"
                            disabled={uploading}
                            style={{ opacity: uploading ? 0.6 : 1, cursor: uploading ? "not-allowed" : "pointer" }}
                        >
                            {uploading ? "Uploading Image..." : "Sell Vehicle"}
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default SellVehicle;
