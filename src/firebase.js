import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

/* 
 =========================================
 🔴 HƯỚNG DẪN KẾT NỐI FIREBASE 🔴
 =========================================
 Bước 1: Vào trang https://console.firebase.google.com/
 Bước 2: Bấm "Add project" (Thêm dự án) và tạo một dự án mới.
 Bước 3: Trong bảng điều khiển (Dashboard) của dự án vừa tạo, bấm vào biểu tượng Web (</>) để tạo ứng dụng Web.
 Bước 4: Đăng ký ứng dụng và bạn sẽ nhận được một đoạn mã `firebaseConfig`.
 Bước 5: Copy các giá trị tương ứng từ đoạn mã đó và dán đè vào các chữ "YOUR_..." ở bên dưới.
 Bước 6 (Quan trọng): Vào mục "Firestore Database" ở thanh menu bên trái -> Create database -> Chọn "Start in test mode" (hoặc chỉnh sửa Rules cho phép write).
 =========================================
*/
const firebaseConfig = {
  apiKey: "AIzaSyCt_Rfad0310DDltseJghpvUGlOq1Vr8u8",
  authDomain: "qrtracking-4e97d.firebaseapp.com",
  projectId: "qrtracking-4e97d",
  storageBucket: "qrtracking-4e97d.firebasestorage.app",
  messagingSenderId: "941450086340",
  appId: "1:941450086340:web:4af32a4b64f2e0b2efc691",
  measurementId: "G-59HSQQ4GS0"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

export const logScanToFirebase = async (scanData) => {
  try {
    const docRef = await addDoc(collection(db, "scans"), scanData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getUnsyncedScans = async () => {
  const querySnapshot = await getDocs(collection(db, "scans"));
  const scans = [];
  querySnapshot.forEach((doc) => {
    scans.push({ id: doc.id, ...doc.data() });
  });
  return scans;
};

export const deleteScanFromFirebase = async (id) => {
  await deleteDoc(doc(db, "scans", id));
};
