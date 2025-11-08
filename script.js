// ========================================
// 1. GAS URL
// ========================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbx-9PcTL3xc6Dlbiw_uZawVCT7cOROoki10HMpahMnoG_CpdcNkVlMXy7nFOfjCzXWVOA/exec";

// ========================================
// 2. db ラッパー（Firebase風）
// ========================================
const db = {
  collection: function(collectionName) {
    return {
      doc: function(docId) {
        return {
          set: function(data) {
            return fetch(GAS_URL, {
              method: "POST",
              body: JSON.stringify({ username: docId, password: data.password || null, post: data.post || null })
            })
            .then(res => res.json());
          },
          get: function() {
            return fetch(GAS_URL)
              .then(res => res.json())
              .then(users => {
                const data = users[docId] || {}; // 存在しない場合は空オブジェクト
                return {
                  exists: !!users[docId],
                  data: () => ({ password: data.password, post: data.post })
                };
              });
          }
        }
      }
    }
  }
};

// ========================================
// 3. サインアップ
// ========================================
function signup() {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;

  if (!username || !password) return alert("入力してください");

  db.collection("users").doc(username).set({ password })
    .then(res => {
      if (res.status === "exists") {
        alert("そのユーザー名は既に存在します");
      } else {
        localStorage.setItem("loginUserId", username);
        location.href = "index.html";
      }
    });
}

// ========================================
// 4. ログイン（修正版）
// ========================================
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) return alert("入力してください");

  db.collection("users").doc(username).get()
    .then(doc => {
      const userData = doc.data();
      if (doc.exists && userData.password === password) {
        localStorage.setItem("loginUserId", username);
        location.href = "index.html";
      } else {
        alert("アカウント名またはパスワードが間違っています");
      }
    });
}

// ========================================
// 5. ログアウト
// ========================================
function logout() {
  localStorage.removeItem("loginUserId");
  location.href = "login.html";
}

// ========================================
// 6. 投稿
// ========================================
function uploadPost() {
  const content = document.getElementById("postContent").value;
  const user = localStorage.getItem("loginUserId");

  if (!content) return alert("投稿内容を入力");

  db.collection("users").doc(user).set({ password: null, post: content })
    .then(() => {
      alert("投稿しました");
      location.href = "index.html";
    });
}

// ========================================
// 7. 投稿表示
// ========================================
function loadPosts() {
  const postsDiv = document.getElementById("posts");
  if (!postsDiv) return;

  fetch(GAS_URL)
    .then(res => res.json())
    .then(data => {
      postsDiv.innerHTML = "";
      for (let username in data) {
        if (data[username]?.post) {
          postsDiv.innerHTML += `<p><strong>${username}</strong>: ${data[username].post}</p>`;
        }
      }
    });
}

// ========================================
// 8. プロフィール表示
// ========================================
function showProfile() {
  const profileDiv = document.getElementById("profileInfo");
  if (!profileDiv) return;

  const user = localStorage.getItem("loginUserId");
  profileDiv.innerHTML = `<p>ユーザー名: ${user}</p>`;
}
