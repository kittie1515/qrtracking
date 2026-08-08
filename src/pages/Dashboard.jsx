import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useGoogleLogin } from '@react-oauth/google';
import { getUnsyncedScans, deleteScanFromFirebase } from '../firebase';

export default function Dashboard() {
  const [campaign, setCampaign] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [dest, setDest] = useState('https://daynite.app');
  const [domain, setDomain] = useState(window.location.origin);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Fetch unsynced count on load
    getUnsyncedScans().then(scans => setUnsyncedCount(scans.length)).catch(console.error);
  }, []);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!campaign || !dest) return alert("Vui lòng điền Campaign và Destination URL");
    
    const url = new URL(`${domain}/redirect`);
    url.searchParams.set('campaign', campaign);
    if (utmSource) url.searchParams.set('utm_source', utmSource);
    url.searchParams.set('dest', dest);
    
    setGeneratedUrl(url.toString());
  };

  const loginAndSync = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    onSuccess: async (tokenResponse) => {
      if (!spreadsheetId) {
        alert("Vui lòng nhập Spreadsheet ID trước khi đồng bộ.");
        return;
      }
      setSyncing(true);
      try {
        const scans = await getUnsyncedScans();
        if (scans.length === 0) {
          alert("Không có dữ liệu mới để đồng bộ.");
          setSyncing(false);
          return;
        }

        const values = scans.map(scan => [
          scan.timestamp,
          scan.campaign,
          scan.utm_source,
          scan.userAgent
        ]);

        // Call Google Sheets API
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:D:append?valueInputOption=USER_ENTERED`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ values })
        });

        if (!response.ok) {
          throw new Error("Lỗi khi ghi vào Google Sheets");
        }

        // Delete from Firebase after successful sync
        for (const scan of scans) {
          await deleteScanFromFirebase(scan.id);
        }

        alert(`Đồng bộ thành công ${scans.length} bản ghi!`);
        setUnsyncedCount(0);
      } catch (err) {
        console.error(err);
        alert("Đã xảy ra lỗi khi đồng bộ: " + err.message);
      } finally {
        setSyncing(false);
      }
    },
    onError: () => {
      alert("Đăng nhập Google thất bại.");
    }
  });

  return (
    <div className="dashboard-card">
      <h1>Hệ thống Tracking QR</h1>
      
      <form onSubmit={handleGenerate}>
        <div className="form-group">
          <label>Tên miền hệ thống (Third-party/Vercel)</label>
          <input 
            type="text" 
            value={domain} 
            onChange={e => setDomain(e.target.value)} 
            placeholder="https://your-vercel-app.vercel.app"
            required
          />
        </div>
        <div className="form-group">
          <label>Tên chiến dịch (Campaign)</label>
          <input 
            type="text" 
            value={campaign} 
            onChange={e => setCampaign(e.target.value)} 
            placeholder="Ví dụ: summer_sale_2024" 
            required
          />
        </div>
        <div className="form-group">
          <label>Nguồn UTM (UTM Source)</label>
          <input 
            type="text" 
            value={utmSource} 
            onChange={e => setUtmSource(e.target.value)} 
            placeholder="Ví dụ: poster_01, flyer_A" 
          />
        </div>
        <div className="form-group">
          <label>URL Đích (Destination URL)</label>
          <input 
            type="url" 
            value={dest} 
            onChange={e => setDest(e.target.value)} 
            placeholder="https://landingpage.com/product" 
            required
          />
        </div>
        
        <button type="submit" className="btn">Tạo QR Code</button>
      </form>

      {generatedUrl && (
        <div className="qr-result-container">
          <div className="qr-box">
            <QRCodeSVG value={generatedUrl} size={200} />
          </div>
          <div className="url-display">{generatedUrl}</div>
        </div>
      )}

      <div className="sync-section">
        <div className="sync-header">
          <h3>Đồng bộ Google Sheets</h3>
          <span style={{color: '#64748b', fontSize: '14px', fontWeight: '500'}}>
            Đang chờ: <strong>{unsyncedCount}</strong> lượt quét
          </span>
        </div>
        <div className="form-group">
          <label>Google Spreadsheet ID</label>
          <input 
            type="text" 
            value={spreadsheetId} 
            onChange={e => setSpreadsheetId(e.target.value)} 
            placeholder="Ví dụ: 1BxiMVs0XRYFgwnTE91..." 
          />
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => loginAndSync()}
          disabled={syncing || unsyncedCount === 0}
        >
          {syncing ? 'Đang đồng bộ...' : 'Đăng nhập & Đồng bộ'}
        </button>
      </div>
    </div>
  );
}
