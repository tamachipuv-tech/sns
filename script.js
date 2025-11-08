const GAS_URL = "https://script.google.com/macros/s/AKfycbx-9PcTL3xc6Dlbiw_uZawVCT7cOROoki10HMpahMnoG_CpdcNkVlMXy7nFOfjCzXWVOA/exec"; // コピーしたURLを入れる

// サインアップ
function signup() {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  if (!username || !password) return alert("入力してください");

  fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "exists") {
      alert("そのユーザー名は既に存在します");
    } else {
      localStorage.setItem("loginUserId", username);
      location.href = "index.html";
    }
  });
}

// ログイン
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (!username || !password) return alert("入力してください");

  fetch(GAS_URL)
    .then(res => res.json())
    .then(users => {
      if (users[username] && users[username] === password) {
        localStorage.setItem("loginUserId", username);
        location.href = "index.html";
      } else {
        alert("ユーザー名かパスワードが間違っています");
      }
    });
}

// ログアウト
function logout() {
  localStorage.removeItem("loginUserId");
  location.href = "login.html";
}
