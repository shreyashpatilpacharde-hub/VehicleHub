import { useNavigate } from "react-router-dom";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaGlobe
} from "react-icons/fa";

import "./Contact.css";

function Contact() {

    const navigate = useNavigate();

    return (
        <div className="contact-page">

            {/* Back Button */}
            <button
                className="contact-back-button"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>


            {/* Contact Content */}
            <div className="contact-content">

                <div className="contact-card">

                    <h2>Contact Us</h2>

                    <p className="contact-intro">
                        Get in touch with Vehicle Hub for any assistance or information.
                    </p>


                    {/* Address */}
                    <div className="contact-item">

                        <FaMapMarkerAlt className="contact-icon" />

                        <span>
                            Pune, Maharashtra, India
                        </span>

                    </div>


                    {/* Phone */}
                    <div className="contact-item">

                        <FaPhoneAlt className="contact-icon" />

                        <span>
                            +91 9876543210
                        </span>

                    </div>


                    {/* Email */}
                    <div className="contact-item">

                        <FaEnvelope className="contact-icon" />

                        <span>
                            vehiclehub@gmail.com
                        </span>

                    </div>


                    {/* Website */}
                    <div className="contact-item">

                        <FaGlobe className="contact-icon" />

                        <span>
                            www.vehiclehub.com
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Contact;