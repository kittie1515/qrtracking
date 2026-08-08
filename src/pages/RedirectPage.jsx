import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function RedirectPage() {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const campaign = searchParams.get('campaign') || 'unknown';
    const utmSource = searchParams.get('utm_source') || 'unknown';
    const dest = searchParams.get('dest');

    if (!dest) {
      document.body.innerHTML = "<h1>Invalid destination URL.</h1>";
      return;
    }

    const webAppUrl = import.meta.env.VITE_GOOGLE_WEB_APP_URL;

    // Redirect function
    const doRedirect = () => {
      window.location.href = dest;
    };

    if (!webAppUrl) {
      console.warn("VITE_GOOGLE_WEB_APP_URL is not configured.");
      doRedirect();
      return;
    }

    // Prepare parameters for Google Apps Script
    const timestamp = new Date().toISOString();
    const userAgent = navigator.userAgent;
    
    const query = new URLSearchParams({
      campaign: campaign,
      utm_source: utmSource,
      timestamp: timestamp,
      userAgent: userAgent
    });

    const fullUrl = `${webAppUrl}?${query.toString()}`;

    // Ping the Web App, limit wait to 1.5s
    const timeout = new Promise(resolve => setTimeout(resolve, 1500));
    
    Promise.race([
      fetch(fullUrl, { mode: 'no-cors' }),
      timeout
    ]).finally(() => {
      doRedirect();
    });

  }, [searchParams]);

  return (
    <div className="redirect-container">
      <div className="spinner"></div>
      <p style={{color: '#6b7280'}}>Đang chuyển hướng...</p>
    </div>
  );
}

