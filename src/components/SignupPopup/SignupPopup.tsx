// SignupPopup.jsx
import React from 'react';
import './SignupPopup.scss';

export const SignupPopup = ({ onClose }: any) => {
  return (
    <div className="signup-popup">
      <div className="signup-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Sign up to Clever Class</h2>

        <button className="signup-button apple">
          <img
            src="https://pngimg.com/d/apple_logo_PNG19680.png"
            alt="Google"
          />
          Sign up with Google
        </button>
        <button className="signup-button google">
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            alt="Google"
          />
          Sign up with Google
        </button>

        <div className="divider">OR</div>

        <form>
          <input type="text" placeholder="Name*" required />
          <input type="email" placeholder="Email*" required />
          <div className="phone-input">
            <select>
              <option>+1</option>
              {/* Add more country codes as needed */}
            </select>
            <input type="tel" placeholder="Phone" />
          </div>
          <div className="password-input">
            <input type="password" placeholder="Password*" required />
            <span className="password-toggle">👁</span>
          </div>
          <p className="password-hint">
            Use at least 5 characters for your password
          </p>
          <button type="submit" className="submit-button">
            Sign Up
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="#">Log In</a>
        </p>

        <p className="terms">
          By signing up, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>. This site is protected by reCAPTCHA
          and the Google <a href="#">Privacy Policy</a> and{' '}
          <a href="#">Terms of Service</a> also apply.
        </p>
      </div>
    </div>
  );
};
