import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css'

/* 
 =========================================
 🔵 HƯỚNG DẪN KẾT NỐI GOOGLE OAUTH 🔵
 =========================================
 Bước 1: Vào trang https://console.cloud.google.com/
 Bước 2: Tạo một Project (Dự án) mới.
 Bước 3: Tìm kiếm "Google Sheets API" trên thanh tìm kiếm và bấm "Enable" (Bật).
 Bước 4: Vào mục "APIs & Services" -> "Credentials" (Thông tin xác thực).
 Bước 5: Bấm "Create Credentials" -> Chọn "OAuth client ID".
 Bước 6: Chọn Application type là "Web application".
 Bước 7: Ở mục "Authorized JavaScript origins", bấm Add URI và dán đường link Vercel của bạn vào (ví dụ: https://qr-tracking-system-one.vercel.app).
 Bước 8: Bấm Create. Sau đó copy chuỗi "Client ID" và dán đè vào chữ "YOUR_GOOGLE_CLIENT_ID_HERE..." ở bên dưới.
 =========================================
*/
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
