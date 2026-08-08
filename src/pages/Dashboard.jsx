import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const [campaign, setCampaign] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [dest, setDest] = useState('https://daynite.app');
  const [domain, setDomain] = useState(window.location.origin);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!campaign || !dest) return alert("Vui lòng điền Campaign và Destination URL");
    
    const url = new URL(`${domain}/redirect`);
    url.searchParams.set('campaign', campaign);
    if (utmSource) url.searchParams.set('utm_source', utmSource);
    url.searchParams.set('dest', dest);
    
    setGeneratedUrl(url.toString());
  };

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
          <h3>Trạng thái Đồng bộ</h3>
        </div>
        <p style={{color: '#64748b', fontSize: '14px', lineHeight: '1.6'}}>
          Hệ thống đang sử dụng <strong>Google Apps Script Webhook</strong>. 
          Bất kỳ ai quét mã QR sẽ tự động được ghi nhận vào thẳng Google Sheets theo thời gian thực (real-time). 
          Bạn không cần phải đăng nhập hay bấm đồng bộ thủ công nữa.
        </p>
        <p style={{color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginTop: '10px'}}>
          <em>Lưu ý: Đảm bảo bạn đã dán VITE_GOOGLE_WEB_APP_URL vào Vercel Environment Variables.</em>
        </p>
      </div>
    </div>
  );
}
