// Firebase 設定（自分のプロジェクトに置き換えてね）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- ユーザー登録 ---
function signup() {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  if(!username || !password){ alert("入力してください"); return; }

  db.collection("users").doc(username).set({ password })
    .then(() => {
      localStorage.setItem("loginUserId", username);
      location.href = "index.html";
    })
    .catch(err => alert(err));
}

// --- ログイン ---
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if(!username || !password){ alert("入力してください"); return; }

  db.collection("users").doc(username).get()
    .then(doc => {
      if(doc.exists && doc.data().password === password){
        localStorage.setItem("loginUserId", username);
        location.href = "index.html";
      } else {
        alert("ユーザー名かパスワードが間違っています");
      }
    });
}

// --- ログアウト ---
function logout() {
  localStorage.removeItem("loginUserId");
  location.href = "login.html";
}

// --- 投稿 ---
function uploadPost() {
  const content = document.getElementById("postContent").value;
  const user = localStorage.getItem("loginUserId");
  if(!content) return alert("投稿内容を入力");

  db.collection("posts").add({
    user,
    content,
    createdAt: new Date()
  }).then(() => {
    alert("投稿しました");
    location.href = "index.html";
  });
}

// --- 投稿表示 ---
function loadPosts() {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";
  db.collection("posts").orderBy("createdAt", "desc").get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const post = doc.data();
        postsDiv.innerHTML += `<p><strong>${post.user}</strong>: ${post.content}</p>`;
      });
    });
}

// --- プロフィール表示 ---
function showProfile() {
  const profileDiv = document.getElementById("profileInfo");
  const user = localStorage.getItem("loginUserId");
  profileDiv.innerHTML = `<p>ユーザー名: ${user}</p>`;
}
