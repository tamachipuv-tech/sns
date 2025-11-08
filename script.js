// localStorage ユーザーデータ
function getUsers() { return JSON.parse(localStorage.getItem("users") || "{}"); }
function saveUsers(users) { localStorage.setItem("users", JSON.stringify(users)); }

// サインアップ / ログイン / ログアウト（前回と同じ）

function signup() {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  if (!username || !password) return alert("入力してください");

  let users = getUsers();
  if (users[username]) return alert("そのユーザー名は既に存在します");

  users[username] = { password: password, posts: [] };
  saveUsers(users);
  localStorage.setItem("loginUserId", username);
  location.href = "index.html";
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (!username || !password) return alert("入力してください");

  let users = getUsers();
  if (users[username] && users[username].password === password) {
    localStorage.setItem("loginUserId", username);
    location.href = "index.html";
  } else {
    alert("アカウント名またはパスワードが間違っています");
  }
}

function logout() {
  localStorage.removeItem("loginUserId");
  location.href = "login.html";
}

// 投稿（テキスト＋画像ファイル＋動画URL）
function uploadPost() {
  const text = document.getElementById("postContent").value;
  const fileInput = document.getElementById("imageFile");
  const video = document.getElementById("videoUrl").value;

  if (!text && !fileInput.files.length && !video) return alert("何か入力してください");

  const user = localStorage.getItem("loginUserId");
  let users = getUsers();

  // 画像を base64 に変換
  if (fileInput.files.length) {
    const reader = new FileReader();
    reader.onload = function(e) {
      users[user].posts.push({ text, img: e.target.result, video });
      saveUsers(users);
      loadPosts();
    }
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    users[user].posts.push({ text, img: null, video });
    saveUsers(users);
    loadPosts();
  }

  document.getElementById("postContent").value = "";
  fileInput.value = "";
  document.getElementById("videoUrl").value = "";
}

// 投稿表示（動画・画像対応）
function loadPosts() {
  const postsDiv = document.getElementById("posts");
  if (!postsDiv) return;

  const users = getUsers();
  let html = "";
  for (let user in users) {
    users[user].posts.forEach(post => {
      html += `<div class="post"><strong>${user}</strong>: ${post.text || ""}<br>`;
      if (post.img) html += `<img src="${post.img}" class="post-img">`;
      if (post.video) html += `<iframe class="post-video" src="${post.video}" frameborder="0" allowfullscreen></iframe>`;
      html += `</div>`;
    });
  }
  postsDiv.innerHTML = html;
}

// プロフィール表示
function showProfile() {
  const profileDiv = document.getElementById("profileInfo");
  const user = localStorage.getItem("loginUserId");
  if (profileDiv && user) profileDiv.innerHTML = `<p>ユーザー名: ${user}</p>`;
}
