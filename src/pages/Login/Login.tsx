// LoginPage.jsx
import React from 'react';

import GoogleIcon from '../../../public/asset/google-icon.png';
import MicrosoftIcon from '../../../public/asset/microsoft-icon.png';

import './LoginPage.scss';

export const LoginPage = () => {
  return (
    <div>
      <div className="login-page">
        <div className="login-form">
          <div className="logo">CLEVER CLASS</div>
          <h2>Welcome back</h2>
          <p>Log in to your account to continue</p>

          <div className="o-auth-login-btns">
            <button className="social-login google">
              <img src={GoogleIcon} alt="Google" />
              Sign in with Google
            </button>
            <button className="social-login microsoft">
              <img src={MicrosoftIcon} alt="Microsoft" />
              Sign in with Microsoft
            </button>
          </div>

          <div className="divider">OR</div>

          <form>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <a href="#">Sign up</a>
          </p>
          <p className="forgot-password">
            <a href="#">Forgot password?</a>
          </p>
        </div>

        <div className="promo-section">
          <h2>450+ Million validated leads data-base</h2>
          <img
            src="https://getheroes-public.s3.eu-west-3.amazonaws.com/asset-auth/auth_img_4.webp"
            alt="Promo"
            className="promo-image"
          />
        </div>
      </div>
    </div>
  );
};
