import { db } from './firebase.js';
import { collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const params = new URLSearchParams(location.search);
const dept = params.get("dept");
document.getElementById("dept-title").textContent = `${dept}のスレッド一覧`;

const threadRef = collection(db, "departments", dept, "threads");
const list = document.getElementById("thread-list");

onSnapshot(threadRef, snapshot => {
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "thread-item";
    div.innerHTML = `<a href="thread.html?dept=${dept}&threadId=${doc.id}">${data.title}</a><br><span>${data.createdAt?.toDate?.().toLocaleString() || ""}</span>`;
    list.appendChild(div);
  });
});

document.getElementById("new-thread-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("thread-title").value.trim();
  if (!title) return;
  await addDoc(threadRef, {
    title,
    createdAt: serverTimestamp()
  });
  document.getElementById("thread-title").value = "";
});
