// ユーザーデータの取得
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

// ユーザーデータの保存
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// サインアップ
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

// ログイン
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

// ログアウト
function logout() {
  localStorage.removeItem("loginUserId");
  location.href = "login.html";
}

// 投稿
function uploadPost() {
  const content = document.getElementById("postContent").value;
  if (!content) return alert("投稿内容を入力");

  const user = localStorage.getItem("loginUserId");
  let users = getUsers();
  users[user].posts.push(content);
  saveUsers(users);

  loadPosts();
  document.getElementById("postContent").value = "";
}

// 投稿表示
function loadPosts() {
  const postsDiv = document.getElementById("posts");
  if (!postsDiv) return;

  const users = getUsers();
  let html = "";
  for (let user in users) {
    users[user].posts.forEach(post => {
      html += `<p><strong>${user}</strong>: ${post}</p>`;
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
