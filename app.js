import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyBMdNIVlGBLlatRpX5Y1nDUThBhaomq1vI",
  authDomain: "dendenkeiji.firebaseapp.com",
  projectId: "dendenkeiji",
  storageBucket: "dendenkeiji.firebasestorage.app",
  messagingSenderId: "467760351926",
  appId: "1:467760351926:web:f3e619bcb4e2fa09a6b417",
  measurementId: "G-P2CGZVBYX9"
};

// 初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const messagesRef = collection(db, "messages");

// DOM要素取得
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signup");
const loginBtn = document.getElementById("login");
const logoutBtn = document.getElementById("logout");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message");
const messagesDiv = document.getElementById("messages");

// ユーザー登録
signupBtn.addEventListener("click", async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert("登録完了！");
  } catch (e) {
    alert("登録エラー：" + e.message);
  }
});

// ログイン
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert("ログイン成功！");
  } catch (e) {
    alert("ログインエラー：" + e.message);
  }
});

// ログアウト
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// 認証状態を監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("ログイン中:", user.email);
    chatForm.style.display = "block";
    logoutBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
  } else {
    console.log("ログアウト済み");
    chatForm.style.display = "none";
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
  }
});

// メッセージ送信
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;

  await addDoc(messagesRef, {
    name: auth.currentUser.email,
    message,
    createdAt: serverTimestamp()
  });

  messageInput.value = "";
});

// メッセージをリアルタイム表示
const q = query(messagesRef, orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const el = document.createElement("div");
    el.className = "message";
    el.innerHTML = `<strong>${data.name}</strong>: ${data.message}<br><span>${data.createdAt?.toDate?.().toLocaleString() || ""}</span>`;
    messagesDiv.appendChild(el);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
