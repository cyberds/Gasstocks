"use client";

import React, { useState } from 'react';
import ContactModal from './ContactModal';

export default function ContactButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        className="btn btn-primary blueprint"
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9000,
          padding: '12px 24px',
          fontSize: '16px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
        }}
      >
        Contact Us
        <i className="corner tl"></i><i className="corner tr"></i><i className="corner bl"></i><i className="corner br"></i>
      </button>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
