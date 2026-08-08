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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app, analytics, db;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
    db = getFirestore(app);
  } else {
    console.warn("⚠️ Firebase configuration is missing! Please check environment variables.");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export const logScanToFirebase = async (scanData) => {
  if (!db) {
    console.error("Cannot log to Firebase: Database not initialized.");
    return;
  }
  try {
    const docRef = await addDoc(collection(db, "scans"), scanData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getUnsyncedScans = async () => {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, "scans"));
    const scans = [];
    querySnapshot.forEach((doc) => {
      scans.push({ id: doc.id, ...doc.data() });
    });
    return scans;
  } catch (error) {
    console.error("Error fetching scans:", error);
    return [];
  }
};

export const deleteScanFromFirebase = async (id) => {
  if (!db) return;
  try {
    await deleteDoc(doc(db, "scans", id));
  } catch (error) {
    console.error("Error deleting scan:", error);
  }
};
