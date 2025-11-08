// --------------------
// ユーザー管理
// --------------------
function getUsers() { return JSON.parse(localStorage.getItem("users") || "{}"); }
function saveUsers(users) { localStorage.setItem("users", JSON.stringify(users)); }

// --------------------
// サインアップ
// --------------------
function signup() {
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  const iconFile = document.getElementById("iconFile").files[0];
  const bioText = document.getElementById("bioText").value;

  if(!username || !password) return alert("入力してください");

  let users = getUsers();
  if(users[username]) return alert("そのユーザー名は既に存在します");

  users[username] = { password, icon:null, bio:"", posts:[], followers:[], following:[] };

  if(iconFile){
    const reader = new FileReader();
    reader.onload = e => {
      users[username].icon = e.target.result;
      users[username].bio = bioText;
      saveUsers(users);
      localStorage.setItem("loginUserId", username);
      location.href = "index.html";
    }
    reader.readAsDataURL(iconFile);
  } else {
    users[username].bio = bioText;
    saveUsers(users);
    localStorage.setItem("loginUserId", username);
    location.href = "index.html";
  }
}

// --------------------
// ログイン / ログアウト
// --------------------
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if(!username || !password) return alert("入力してください");

  let users = getUsers();
  if(users[username] && users[username].password === password){
    localStorage.setItem("loginUserId", username);
    location.href = "index.html";
  } else {
    alert("アカウント名またはパスワードが間違っています");
  }
}

function logout(){
  localStorage.removeItem("loginUserId");
  location.href = "login.html";
}

// --------------------
// プロフィール表示 / 編集
// --------------------
function showProfile(){
  const profileDiv = document.getElementById("profileInfo");
  const user = localStorage.getItem("loginUserId");
  const users = getUsers();
  if(profileDiv && user){
    const icon = users[user].icon ? `<img src="${users[user].icon}" class="post-user-icon">` : '';
    profileDiv.innerHTML = `${icon} <strong>${user}</strong> <p>${users[user].bio}</p>`;
  }
}

function editProfile(){
  const user = localStorage.getItem("loginUserId");
  const iconFile = document.getElementById("newIconFile").files[0];
  const bioText = document.getElementById("newBioText").value;
  let users = getUsers();

  if(iconFile){
    const reader = new FileReader();
    reader.onload = e=>{
      users[user].icon = e.target.result;
      if(bioText) users[user].bio = bioText;
      saveUsers(users);
      showProfile();
    }
    reader.readAsDataURL(iconFile);
  } else if(bioText){
    users[user].bio = bioText;
    saveUsers(users);
    showProfile();
  }
}

// --------------------
// 投稿
// --------------------
function uploadPost(){
  const text = document.getElementById("postContent").value;
  const fileInput = document.getElementById("imageFile");
  const video = document.getElementById("videoUrl").value;
  if(!text && !fileInput.files.length && !video) return alert("何か入力してください");

  const user = localStorage.getItem("loginUserId");
  let users = getUsers();

  if(fileInput.files.length){
    const reader = new FileReader();
    reader.onload = e=>{
      users[user].posts.push({ text, img:e.target.result, video, likes:0, comments:[] });
      saveUsers(users);
      loadPosts();
    }
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    users[user].posts.push({ text, img:null, video, likes:0, comments:[] });
    saveUsers(users);
    loadPosts();
  }

  document.getElementById("postContent").value = "";
  fileInput.value = "";
  document.getElementById("videoUrl").value = "";
}

// --------------------
// 投稿表示（カード風）
// --------------------
function loadPosts(){
  const postsDiv = document.getElementById("posts");
  if(!postsDiv) return;

  const users = getUsers();
  let html = "";

  Object.keys(users).forEach((uname, uidx)=>{
    users[uname].posts.forEach((post, pidx)=>{
      const icon = users[uname].icon ? `<img src="${users[uname].icon}" class="post-user-icon">` : '';
      html += `<div class="post-card">
                <div class="post-header">${icon}<strong>${uname}</strong>
                  <button onclick="toggleFollow('${uname}')">
                    ${users[localStorage.getItem("loginUserId")].following.includes(uname) ? "フォロー中" : "フォロー"}
                  </button>
                </div>
                <div class="post-text">${post.text||''}</div>`;
      if(post.img) html += `<img src="${post.img}" class="post-img">`;
      if(post.video) html += `<iframe class="post-video" src="${post.video}" frameborder="0" allowfullscreen></iframe>`;
      html += `<div class="post-actions">
                  <button onclick="likePost(${uidx},${pidx})">👍 ${post.likes}</button>
                  <input type="text" id="commentInput-${uidx}-${pidx}" placeholder="コメント">
                  <button onclick="commentPost(${uidx},${pidx}, document.getElementById('commentInput-${uidx}-${pidx}').value)">コメント</button>
               </div>
               <div class="post-comments">`;
      post.comments?.forEach(c=>{
        html += `<p><strong>${c.user}</strong>: ${c.text}</p>`;
      });
      html += `</div></div>`;
    });
  });

  postsDiv.innerHTML = html;
}

// --------------------
// いいね / コメント / フォロー
// --------------------
function likePost(uidx, pidx){
  const user = localStorage.getItem("loginUserId");
  let users = getUsers();
  users[Object.keys(users)[uidx]].posts[pidx].likes++;
  saveUsers(users);
  loadPosts();
}

function commentPost(uidx, pidx, commentText){
  const user = localStorage.getItem("loginUserId");
  if(!commentText) return;
  let users = getUsers();
  users[Object.keys(users)[uidx]].posts[pidx].comments.push({user, text:commentText});
  saveUsers(users);
  loadPosts();
}

function toggleFollow(targetUser){
  const user = localStorage.getItem("loginUserId");
  let users = getUsers();
  if(!users[user].following.includes(targetUser)){
    users[user].following.push(targetUser);
    users[targetUser].followers.push(user);
  } else {
    users[user].following = users[user].following.filter(u=>u!==targetUser);
    users[targetUser].followers = users[targetUser].followers.filter(u=>u!==user);
  }
  saveUsers(users);
  loadPosts();
}
