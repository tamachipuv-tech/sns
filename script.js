const API_URL = "YOUR_GAS_WEBAPP_URL"; // GASのデプロイURL

// 投稿送信
function postSubmit() {
  const name = document.getElementById("nameInput").value.trim();
  const text = document.getElementById("textInput").value.trim();
  const img = document.getElementById("imgInput").value.trim();

  if (!name || !text) { alert("名前と本文は必須です"); return; }

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ name, text, img })
  }).then(() => {
    document.getElementById("nameInput").value = "";
    document.getElementById("textInput").value = "";
    document.getElementById("imgInput").value = "";
    loadPosts();
  });
}

// 投稿表示
function loadPosts(admin=false) {
  const container = admin ? document.getElementById("adminPostsContainer") : document.getElementById("postsContainer");
  container.innerHTML = admin ? "<h2>管理者ページ - 投稿削除</h2>" : "<h2>投稿一覧</h2>";

  fetch(API_URL)
    .then(res => res.json())
    .then(posts => {
      posts.forEach((post, idx) => {
        const card = document.createElement("div");
        card.className = "post-card";
        card.innerHTML = `
          <p><strong>${post.name}</strong></p>
          <p>${post.text}</p>
          ${post.img ? `<img src="${post.img}">` : ''}
          ${admin ? `<button onclick="deletePost(${idx})">削除</button>` : ''}
        `;
        container.appendChild(card);
      });
    });
}

// 投稿削除（管理者用）
function deletePost(index) {
  if (!confirm("本当に削除しますか？")) return;

  fetch(`${API_URL}?delete=${index}`)
    .then(() => loadPosts(true));
}

// ページ読み込み時に投稿表示
if(document.getElementById("postsContainer")) loadPosts();
