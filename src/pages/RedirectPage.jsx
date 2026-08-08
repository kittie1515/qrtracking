import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { logScanToFirebase } from '../firebase';

export default function RedirectPage() {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const campaign = searchParams.get('campaign');
    const utmSource = searchParams.get('utm_source');
    const dest = searchParams.get('dest');

    if (!dest) {
      document.body.innerHTML = "<h1>Invalid destination URL.</h1>";
      return;
    }

    // Log to Firebase async, don't block the redirect
    logScanToFirebase({
      campaign: campaign || 'unknown',
      utm_source: utmSource || 'unknown',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }).finally(() => {
      // Redirect to destination
      window.location.href = dest;
    });

  }, [searchParams]);

  return (
    <div className="redirect-container">
      <div className="spinner"></div>
      <p style={{color: '#6b7280'}}>Đang chuyển hướng...</p>
    </div>
  );
}
