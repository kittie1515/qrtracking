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

    // Create a timeout promise that resolves after 2 seconds
    const timeout = new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log to Firebase, but don't wait more than 2 seconds
    Promise.race([
      logScanToFirebase({
        campaign: campaign || 'unknown',
        utm_source: utmSource || 'unknown',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }),
      timeout
    ]).finally(() => {
      // Redirect to destination guaranteed after max 2 seconds
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
