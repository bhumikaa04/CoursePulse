import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"; // Social Media Icons
import "../styles/Footer.css"; // Import your CSS file for styling

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Quick Links */}
                <div className="footer-section quick-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/explore">Explore</Link>
                        </li>
                        <li>
                            <Link to="/create-course">Create Course</Link>
                        </li>
                        <li>
                            <Link to="/about-us">About Us</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div className="footer-section social-media">
                    <h4>Social Media</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="footer-section newsletter">
                    <h4>Newsletter</h4>
                    <form className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                        />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>© 2025 CoursePulse. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;