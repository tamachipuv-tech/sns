// ユーザーデータ取得・保存（localStorage）
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

// 投稿（テキスト＋画像＋動画）
function uploadPost() {
  const text = document.getElementById("postContent").value;
  const img = document.getElementById("imageUrl").value;
  const video = document.getElementById("videoUrl").value;
  if (!text && !img && !video) return alert("何か入力してください");

  const user = localStorage.getItem("loginUserId");
  let users = getUsers();
  users[user].posts.push({ text, img, video });
  saveUsers(users);

  loadPosts();
  document.getElementById("postContent").value = "";
  document.getElementById("imageUrl").value = "";
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
