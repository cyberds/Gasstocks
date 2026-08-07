"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { SCOPES } from '../lib/enquiry';
import { DISPLAY, COMPANY } from '../lib/company';

const iconStyle: React.CSSProperties = { width: 20, height: 20, flexShrink: 0 };

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={iconStyle} aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.87.33 1.72.63 2.54a2 2 0 0 1-.45 2.11L7.8 8.8a16 16 0 0 0 6.42 6.42l.43-.43a2 2 0 0 1 2.11-.45c.82.3 1.67.51 2.54.63A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 308 308" style={iconStyle} fill="currentColor" aria-hidden="true">
      <g>
        <path d="M227.904,176.981c-0.6-0.288-23.054-11.345-27.044-12.781c-1.629-0.585-3.374-1.156-5.23-1.156c-3.032,0-5.579,1.511-7.563,4.479c-2.243,3.334-9.033,11.271-11.131,13.642c-0.274,0.313-0.648,0.687-0.872,0.687c-0.201,0-3.676-1.431-4.728-1.888c-24.087-10.463-42.37-35.624-44.877-39.867c-0.358-0.61-0.373-0.887-0.376-0.887c0.088-0.323,0.898-1.135,1.316-1.554c1.223-1.21,2.548-2.805,3.83-4.348c0.607-0.731,1.215-1.463,1.812-2.153c1.86-2.164,2.688-3.844,3.648-5.79l0.503-1.011c2.344-4.657,0.342-8.587-0.305-9.856c-0.531-1.062-10.012-23.944-11.02-26.348c-2.424-5.801-5.627-8.502-10.078-8.502c-0.413,0,0,0-1.732,0.073c-2.109,0.089-13.594,1.601-18.672,4.802c-5.385,3.395-14.495,14.217-14.495,33.249c0,17.129,10.87,33.302,15.537,39.453c0.116,0.155,0.329,0.47,0.638,0.922c17.873,26.102,40.154,45.446,62.741,54.469c21.745,8.686,32.042,9.69,37.896,9.69c0.001,0,0.001,0,0.001,0c2.46,0,4.429-0.193,6.166-0.364l1.102-0.105c7.512-0.666,24.02-9.22,27.775-19.655c2.958-8.219,3.738-17.199,1.77-20.458C233.168,179.508,230.845,178.393,227.904,176.981z"/>
        <path d="M156.734,0C73.318,0,5.454,67.354,5.454,150.143c0,26.777,7.166,52.988,20.741,75.928L0.212,302.716c-0.484,1.429-0.124,3.009,0.933,4.085C1.908,307.58,2.943,308,4,308c0.405,0,0.813-0.061,1.211-0.188l79.92-25.396c21.87,11.685,46.588,17.853,71.604,17.853C240.143,300.27,308,232.923,308,150.143C308,67.354,240.143,0,156.734,0z M156.734,268.994c-23.539,0-46.338-6.797-65.936-19.657c-0.659-0.433-1.424-0.655-2.194-0.655c-0.407,0-0.815,0.062-1.212,0.188l-40.035,12.726l12.924-38.129c0.418-1.234,0.209-2.595-0.561-3.647c-14.924-20.392-22.813-44.485-22.813-69.677c0-65.543,53.754-118.867,119.826-118.867c66.064,0,119.812,53.324,119.812,118.867C276.546,215.678,222.799,268.994,156.734,268.994z"/>
      </g>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={iconStyle} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 7 9-7" />
    </svg>
  );
}

export default function ContactModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1000);
  };

  return createPortal(
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal-content" onClick={e => e.stopPropagation()}>
        <button className="contact-modal-close" onClick={onClose}>&times;</button>
        
        <div className="contact-modal-header">
          <h3>Contact Us</h3>
          <p>Reach out to discuss your project requirements.</p>
        </div>

        <div className="contact-modal-actions">
          <a href={`tel:${COMPANY.phones.nigeria}`} className="btn-action call">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <PhoneIcon />
              <span>Call</span>
            </span>
          </a>
          <a href={`https://wa.me/${COMPANY.phones.nigeria.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="btn-action whatsapp">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <WhatsAppIcon />
              <span>WhatsApp</span>
            </span>
          </a>
          <a href={`mailto:${COMPANY.email}`} className="btn-action email">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <MailIcon />
              <span>Email</span>
            </span>
          </a>
        </div>

        <div className="contact-modal-divider">or send an enquiry</div>

        {sent ? (
          <div className="contact-success">
            <h4>Enquiry received.</h4>
            <p>We'll acknowledge it within one working day.</p>
            <button className="btn btn-secondary" onClick={() => setSent(false)}>Send another</button>
          </div>
        ) : (
          <form className="compact-form blueprint" onSubmit={handleSubmit}>
            <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
            <div className="form-row">
              <input type="text" className="input" placeholder="Name" required />
              <input type="email" className="input" placeholder="Email" required />
            </div>
            <select className="input" required defaultValue={SCOPES[0]}>
              {SCOPES.map(s => <option key={s}>{s}</option>)}
            </select>
            <textarea className="input" placeholder="Brief" required rows={3}></textarea>
            <button className="btn btn-primary" type="submit" disabled={sending}>
              {sending ? 'Sending...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
      <style>{`
        .contact-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .contact-modal-content {
          background: var(--color-surface-2, #1a1a1a);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          width: 90%;
          max-width: 450px;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        .contact-modal-close {
          position: absolute;
          top: 1rem; right: 1.5rem;
          background: none; border: none;
          color: white; font-size: 2rem; cursor: pointer;
        }
        .contact-modal-header h3 { margin: 0 0 0.5rem; font-size: 1.5rem; }
        .contact-modal-header p { color: #aaa; font-size: 0.9rem; margin-bottom: 1.5rem; }
        .contact-modal-actions {
          display: flex; gap: 0.5rem; margin-bottom: 1.5rem;
        }
        .btn-action {
          flex: 1; padding: 0.75rem 0;
          text-align: center; border-radius: 8px;
          text-decoration: none; color: white;
          font-size: 0.85rem; font-weight: 600;
          transition: filter 0.2s;
        }
        .btn-action:hover { filter: brightness(1.2); }
        .btn-action.call { background: #3b82f6; }
        .btn-action.whatsapp { background: #22c55e; }
        .btn-action.email { background: #f59e0b; }
        
        .contact-modal-divider {
          text-align: center; font-size: 0.8rem; color: #666;
          margin-bottom: 1rem; text-transform: uppercase;
        }
        .compact-form { display: flex; flex-direction: column; gap: 1rem; position: relative; padding: 1.5rem; background: var(--color-bg, #000); }
        .compact-form .form-row { display: flex; gap: 1rem; }
        .contact-success { text-align: center; padding: 2rem 0; }
        .contact-success h4 { color: #22c55e; margin-bottom: 0.5rem; font-size: 1.25rem; }
        .contact-success p { color: #aaa; margin-bottom: 1rem; }
      `}</style>
    </div>,
    document.body
  );
}
