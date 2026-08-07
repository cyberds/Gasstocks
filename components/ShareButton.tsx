'use client';

import React, { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Gasstocks Limited',
      text: 'Check out Gasstocks Limited - Marine & Civil Infrastructure Contractor',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{
        background: 'transparent',
        border: '1px solid var(--color-divider)',
        color: 'var(--color-text)',
        padding: '6px 12px',
        fontSize: '11.5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-divider)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)';
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      {copied ? 'Link Copied!' : 'Share Page'}
    </button>
  );
}
