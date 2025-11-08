// ---- Firebase 設定（ここを置き換えてください） ----
const ref = await db.collection('users').add({
username: name,
passcodeHash: passHash,
bio: '',
followers: [],
following: [],
createdAt: nowTimestamp()
});


msg.textContent='作成しました。ログイン画面へ移動します';
setTimeout(()=>location.href='login.html',800);
});
}


// Login page
if(path=="login.html"){
document.getElementById('loginBtn').addEventListener('click', async ()=>{
const name = document.getElementById('loginName').value.trim();
const pass = document.getElementById('loginPass').value;
const msg = document.getElementById('loginMsg'); msg.textContent='';
if(!name||!pass){ msg.textContent='入力してください'; return; }


const q = await db.collection('users').where('username','==',name).get();
if(q.empty){ msg.textContent='ユーザーが見つかりません'; return; }
const doc = q.docs[0];
const data = doc.data();
const passHash = await sha256(pass);
if(passHash !== data.passcodeHash){ msg.textContent='パスコードが違います'; return; }


const userDoc = { id: doc.id, ...data };
setSession(userDoc);
location.href='index.html';
});
}


// Index page behavior
if(path=="index.html"||path===''){
const user = getSession();
if(!user){ location.href='login.html'; return; }


document.getElementById('logoutBtn').addEventListener('click', ()=>{ clearSession(); location.href='login.html'; });


// 検索
const searchInput = document.getElementById('searchUserInput');
searchInput.addEventListener('input', async ()=>{
const qv = searchInput.value.trim();
const box = document.getElementById('searchResults'); box.innerHTML='';
if(qv.length<1) return;
const q = await db.collection('users').where('username','>=',qv).where('username','<',qv+'\uf8ff').limit(10).get();
q.forEach(doc=>{
const d = doc.data();
const el = document.createElement('div'); el.className='userRow';
el.innerHTML = `<strong>${d.username}</strong> <button data-id="${doc.id}">プロフィール</button>`;
el.querySelector('button').addEventListener('click', ()=>{ location.href=`profile.html?uid=${doc.id}`; });
box.appendChild(el);
});
});


// タイムライン表示（フォロー中のユーザー & 自分の投稿）
const timelineEl = document.getElementById('timeline');
