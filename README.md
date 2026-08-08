# QR Tracking System

Hệ thống Tracking QR là một ứng dụng web giúp bạn tạo mã QR, theo dõi lượt quét và đồng bộ dữ liệu thống kê trực tiếp lên Google Sheets. 

Ứng dụng được xây dựng bằng **React (Vite)**, lưu trữ dữ liệu tạm thời trên **Firebase (Firestore)**, và tích hợp **Google OAuth & Google Sheets API** để xuất báo cáo nhanh chóng.

## 🌟 Tính Năng Chính
1. **Tạo QR Code Theo Dõi**: Cho phép nhập `Campaign`, `UTM Source`, và `Destination URL` để tạo ra một mã QR và link tracking tùy chỉnh.
2. **Theo Dõi Lượt Quét (Scan Tracking)**: Khi người dùng quét mã QR, hệ thống sẽ lưu lại thông tin (Chiến dịch, nguồn UTM, thời gian quét, thiết bị) vào Firebase trước khi tự động chuyển hướng đến link đích.
3. **Đồng Bộ Google Sheets**: Quản trị viên có thể đăng nhập bằng tài khoản Google, nhập Spreadsheet ID và tự động chuyển toàn bộ dữ liệu quét chưa đồng bộ từ Firebase sang Google Sheets để tiện làm báo cáo. Dữ liệu sau khi đồng bộ thành công sẽ được xóa khỏi Firebase để tiết kiệm dung lượng.

## 🚀 Công Nghệ Sử Dụng
- **Frontend**: React.js (Vite), React Router
- **Database**: Firebase Firestore
- **Authentication**: @react-oauth/google (để lấy quyền truy cập Google Sheets của người dùng)
- **Tiện ích khác**: `qrcode.react` (Tạo mã QR)

## 🛠 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local)

### 1. Cài đặt các thư viện (Dependencies)
```bash
npm install
```

### 2. Thiết lập Firebase
1. Vào [Firebase Console](https://console.firebase.google.com/) và tạo một Project mới.
2. Kích hoạt tính năng **Firestore Database** (chọn chế độ `Start in test mode` hoặc sửa rule để cho phép read/write).
3. Đăng ký Web App và lấy đoạn mã `firebaseConfig`.
4. Mở file `src/firebase.js` và cập nhật thông tin cấu hình của bạn vào biến `firebaseConfig`.

### 3. Thiết lập Google OAuth (Cho tính năng đồng bộ Google Sheets)
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Kích hoạt API **Google Sheets API**.
3. Vào phần **APIs & Services > Credentials** -> Tạo thông tin xác thực loại **OAuth client ID** (chọn loại ứng dụng là Web application).
4. Thêm URL của bạn (ví dụ: `http://localhost:5173`) vào **Authorized JavaScript origins** và **Authorized redirect URIs**.
5. Copy `Client ID` và bọc component `<GoogleOAuthProvider clientId="YOUR_CLIENT_ID">` (Thường được cấu hình trong `main.jsx` của project).

### 4. Chạy dự án
```bash
npm run dev
```
Truy cập ứng dụng tại `http://localhost:5173`.

## 📖 Cách Sử Dụng
1. **Tạo mã QR**: Mở trang chủ, nhập Domain của bạn (nếu đã deploy), Tên chiến dịch, UTM Source, URL đích. Sau đó bấm **Tạo QR Code**. Tải QR Code về và dán lên banner/poster.
2. **Đồng bộ dữ liệu**: 
   - Tạo một Google Sheet mới trên Drive của bạn (ví dụ: Sheet1) với các cột tương ứng (Thời gian, Campaign, UTM Source, User Agent).
   - Copy **Spreadsheet ID** trên thanh địa chỉ trình duyệt của Google Sheet (là chuỗi dài giữa `/d/` và `/edit`).
   - Mở Dashboard hệ thống tracking, dán ID vào ô **Google Spreadsheet ID**.
   - Bấm **Đăng nhập & Đồng bộ**, cho phép ứng dụng quyền chỉnh sửa Google Sheets. Hệ thống sẽ bắn tất cả dữ liệu từ Firebase vào Sheet của bạn.

## 📄 Cấu trúc Thư Mục Chính
- `/src/pages/Dashboard.jsx`: Giao diện Admin để tạo QR code và đồng bộ dữ liệu.
- `/src/pages/RedirectPage.jsx`: Trang trung gian để xử lý logic lưu dữ liệu quét vào Firebase và redirect sang trang đích.
- `/src/firebase.js`: Khởi tạo và cấu hình Firebase Firestore.

---
*Dự án này là mã nguồn mở, bạn có thể tự do chỉnh sửa và mở rộng theo nhu cầu.*
