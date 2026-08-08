# Hệ thống Tracking QR Tự Động (Zero-Login)

Dự án này là một hệ thống web nội bộ giúp tạo các mã QR Code có gắn tham số theo dõi (Campaign, UTM Source, Destination URL). Khi người dùng dùng điện thoại quét mã, hệ thống sẽ ngay lập tức bắt thông tin quét và **đồng bộ trực tiếp vào Google Sheets theo thời gian thực (real-time)** rồi mới chuyển hướng người dùng đến link đích.

Đặc điểm nổi bật của kiến trúc mới này là sự **Tinh gọn & Tự động 100%**:
- ❌ **Không cần Firebase / Database**: Tiết kiệm chi phí và không lo lỗi cấu hình server.
- ❌ **Không cần đăng nhập Google (OAuth)**: Bỏ qua giới hạn hết hạn phiên đăng nhập 1 giờ.
- ✅ **Sử dụng Google Apps Script Webhook**: Ghi dữ liệu trực tiếp 24/7. Bạn chỉ việc mở Google Sheets ra và xem kết quả nhảy lên từng giây!

---

## 📂 Cấu Trúc Các File Chính

- `src/pages/Dashboard.jsx`: Giao diện Bảng điều khiển (Dashboard). Dùng để bạn nhập các thông số (Tên miền, Campaign, UTM, URL đích) và tạo ra hình ảnh QR Code. Trang này hoàn toàn chạy offline trên trình duyệt của bạn sau khi truy cập.
- `src/pages/RedirectPage.jsx`: **Trái tim của hệ thống tracking.** Khi mã QR được quét, điện thoại sẽ truy cập vào trang này trước tiên. Trang này sẽ làm 2 việc:
  1. Gửi ngầm một gói tin chứa thông tin người quét lên **Google Apps Script Webhook URL**.
  2. Ngay lập tức chuyển hướng (Redirect) người dùng đến URL đích của bạn.
- `vercel.json`: Tệp cấu hình bắt buộc để Vercel hiểu rằng đây là một ứng dụng Single Page Application (SPA), giúp điều hướng mọi đường dẫn ảo về lại `index.html` (tránh lỗi 404).
- `package.json`: Danh sách các thư viện được sử dụng (`react`, `react-router-dom`, `qrcode.react`).

---

## 🚀 Hướng Dẫn Cài Đặt Chi Tiết Dành Cho Admin

Hệ thống bao gồm 2 mảnh ghép: **Frontend (trên Vercel)** và **Backend (Google Apps Script trên Google Sheets)**. Bạn hãy làm theo thứ tự sau để cài đặt:

### Bước 1: Tạo Google Sheets & Cài đặt Apps Script (Backend)
Đây là nơi lưu trữ toàn bộ dữ liệu quét QR của bạn.

1. Vào Google Drive và tạo một file **Google Sheets** mới.
2. Trên thanh menu của Google Sheets, chọn **Tiện ích mở rộng (Extensions)** -> **Apps Script**.
3. Cửa sổ code hiện ra, bạn xóa toàn bộ code mặc định đi và dán đoạn code này vào:
   ```javascript
   function doGet(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     
     // Lấy dữ liệu từ đường dẫn (URL param)
     var timestamp = e.parameter.timestamp || new Date().toISOString();
     var campaign = e.parameter.campaign || "unknown";
     var utmSource = e.parameter.utm_source || "unknown";
     var userAgent = e.parameter.userAgent || "unknown";
     
     // Ghi 1 dòng mới vào Sheet
     sheet.appendRow([timestamp, campaign, utmSource, userAgent]);
     
     // Báo cáo thành công để RedirectPage không bị nghẽn
     return ContentService.createTextOutput("Success");
   }
   ```
4. Bấm **Ctrl + S** (hoặc biểu tượng đĩa mềm) để lưu lại.
5. Ở góc phải trên cùng, bấm **Triển khai (Deploy)** -> **Triển khai mới (New deployment)**.
6. Chọn biểu tượng bánh răng ⚙️ -> Chọn **Ứng dụng web (Web app)**.
7. Cấu hình cực kỳ quan trọng:
   - Chạy dưới dạng (Execute as): **Tôi (Me)** 
   - Ai có quyền truy cập (Who has access): **Bất kỳ ai (Anyone)** *(Bắt buộc, nếu không người lạ quét mã sẽ bị lỗi)*.
8. Bấm **Triển khai (Deploy)**. *(Google sẽ yêu cầu bạn cấp quyền - Cứ bấm Advanced -> Go to project (unsafe) -> Allow)*.
9. **Copy đường link Web app URL** (`https://script.google.com/macros/...`). Đừng làm mất đường link này.

### Bước 2: Khởi tạo mã nguồn và Đưa lên Vercel (Frontend)
1. Fork hoặc Push mã nguồn này lên tài khoản GitHub cá nhân của bạn.
2. Vào [Vercel](https://vercel.com/), bấm **Add New...** -> **Project**.
3. Liên kết với tài khoản GitHub và chọn dự án chứa mã nguồn này để Import.
4. Ở màn hình cấu hình trước khi Deploy, bấm vào mục **Environment Variables** (Các biến môi trường) và thêm:
   - **Key**: `VITE_GOOGLE_WEB_APP_URL`
   - **Value**: Dán cái `Web app URL` mà bạn đã Copy ở Bước 1 vào đây.
5. Bấm **Deploy**.
6. Đợi 1-2 phút cho Vercel chạy xong là bạn đã có một đường link Vercel của riêng mình (Ví dụ: `https://qrtracking.vercel.app`).

---

## 📖 Hướng Dẫn Sử Dụng Hằng Ngày

Mỗi khi bạn có một chiến dịch mới:
1. Mở trang Vercel Dashboard của bạn (`https://qrtracking.vercel.app`).
2. Nhập các thông tin:
   - **Tên miền hệ thống**: Chính là đường link Vercel hiện tại của bạn.
   - **Campaign**: Tên chiến dịch (VD: `khuyen_mai_thang_10`).
   - **UTM Source**: Nơi dán mã QR (VD: `standee_truoc_cua`).
   - **URL đích**: Trang web mà khách hàng sẽ thấy sau khi quét (VD: `https://shopee.vn/...`).
3. Bấm **Tạo QR Code**.
4. Quét thử bằng điện thoại để kiểm tra. Ngay khi trên điện thoại của bạn hiện ra trang web đích, mở **Google Sheets** ra, bạn sẽ thấy 1 dòng mới tinh vừa được ghi lại!
5. Tải ảnh QR Code đó và in ra sử dụng. 

**🎉 Chúc bạn thành công! Toàn bộ quá trình theo dõi giờ đây là hoàn toàn tự động.**
