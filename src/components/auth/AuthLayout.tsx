import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/images/logo.jpg';
import './Auth.scss';


interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  return (
    <div className="auth-container">

      <div className="auth-left"><img src={logoImg} alt="Innotter Logo" className="logo-img" /></div>
      
      <div className="auth-right">
        
        <div className="top-bar">
          <Link
            to="#"
            className="back-link"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            &lt; Back
          </Link>
        </div>
        
        <div className="form-content">
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
          {children}
        </div>
      
      </div>
    </div>
  );
};