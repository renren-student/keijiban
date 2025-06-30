import { db, auth } from './firebase.js';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(location.search);
const dept = params.get("dept");
const threadId = params.get("threadId");
const messagesRef = collection(db, "departments", dept, "threads", threadId, "messages");

// スレッド名取得
(async () => {
  const threadDoc = await getDoc(doc(db, "departments", dept, "threads", threadId));
  document.getElementById("thread-name").textContent = threadDoc.data()?.title || "スレッド";
})();

// メッセージ送信
const form = document.getElementById("chat-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("message").value.trim();
  if (!msg) return;
  await addDoc(messagesRef, {
    name: auth.currentUser?.email || "匿名",
    message: msg,
    createdAt: serverTimestamp()
  });
  document.getElementById("message").value = "";
});

// 表示
const q = query(messagesRef, orderBy("createdAt", "asc"));
const messagesDiv = document.getElementById("messages");
onSnapshot(q, snapshot => {
  messagesDiv.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const el = document.createElement("div");
    el.className = "message";
    el.innerHTML = `<strong>${data.name}</strong>: ${data.message}<br><span>${data.createdAt?.toDate?.().toLocaleString() || ""}</span>`;
    messagesDiv.appendChild(el);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});