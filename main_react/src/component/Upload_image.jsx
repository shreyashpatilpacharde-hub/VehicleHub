import { useState } from "react";
import axios from "axios";
import "./Upload_image.css";

function Upload_image() {
    const [image, setImage] = useState(null);

    const handleImageUpload = async (e) => {
        e.preventDefault();
        
        if (!image) {
            alert("Please select an image first");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        
        try {
            const res = await axios.post("https://vehiclehub-viee.onrender.com/upload", formData);
            console.log("Success!", res.data);
            alert(`Image uploaded! Filename: ${res.data.image}`);
        } catch (err) {
            console.error("Upload failed", err);
            alert("Image upload failed");
        }
    };

    return (
        <div className="upload-page">
            <div className="upload-card">
                <h2>Upload an Image</h2>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button className="button-primary" onClick={handleImageUpload}>
                    Upload Image
                </button>
            </div>
        </div>
    );
}

export default Upload_image;
