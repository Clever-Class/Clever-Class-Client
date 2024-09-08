import React from 'react';

import { FaTiktok, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { RiTwitterXFill } from 'react-icons/ri';

import ChromeWebStoreBadge from '../../../public/asset/chrome_web_store.svg';
import AppleStoreBadge from '../../../public/asset/Download_on_the_App_Store_Badge.svg.webp';
import PlayStoreBadge from '../../../public/asset/GetItOnGooglePlay_Badge_Web_color_English.png';

import './Footer.scss';

const socialIcons = [
  <FaTiktok />,
  <FaInstagram />,
  <FaFacebookF />,
  <RiTwitterXFill />,
];

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-body">
        <div className="title-and-logo">
          <h2>Clever Class</h2>
          <div className="footer-social-icons">
            {socialIcons.map((icon, index) => (
              <div key={index} className="social-icon">
                {icon}
              </div>
            ))}
          </div>
        </div>
        <div className="download-store-badges">
          <img src={AppleStoreBadge} alt="" />
          <img src={PlayStoreBadge} alt="" />
        </div>
      </div>
      <div className="footer-content">
        <div className="footer-links">
          <div className="footer-column">
            <h3>PRODUCT</h3>
            <ul>
              <li>
                <a href="#">Extension</a>
              </li>
              <li>
                <a href="#">Mobile</a>
              </li>
              <li>
                <a href="#">Chat</a>{' '}
                <i className="fas fa-external-link-alt"></i>
              </li>
              <li>
                <a href="#">Write</a>{' '}
                <i className="fas fa-external-link-alt"></i>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>PLATFORM</h3>
            <ul>
              <li>
                <a href="#">Log In</a>
              </li>
              <li>
                <a href="#">Sign Up</a>
              </li>
              <li>
                <a href="#">Recover</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>RESOURCES</h3>
            <ul>
              <li>
                <a href="#">Help Center</a>{' '}
                <i className="fas fa-external-link-alt"></i>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
              <li>
                <a href="#">Academic Honesty</a>
              </li>
              <li>
                <a href="#">FAQ</a> <i className="fas fa-external-link-alt"></i>
              </li>
              <li>
                <a href="#">Influencer Program</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>LEGAL</h3>
            <ul>
              <li>
                <a href="#">Terms of Use</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Acceptable Use</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="horizontal-line"></div>
      <div className="footer-bottom">
        <p>© 2024 - Coursology LLC. All rights reserved.</p>
        <p>
          <a href="#">
            English <i className="fas fa-globe"></i>
          </a>
        </p>
      </div>
    </footer>
  );
};
