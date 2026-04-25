/* ============================================================
   auth.js — SkillBridge Supabase Auth v2.0
   ============================================================ */

const SUPABASE_URL  = 'https://toszjtkgbschcqdvzofv.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc3pqdGtnYnNjaGNxZHZ6b2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjMzNDIsImV4cCI6MjA5MjU5OTM0Mn0.9HxL5WuON4NKulEb3X4PqNpxx8nhY-ZPzzAeiGb0MHA';

const PROTECTED = ['profil.html','portfolio-builder.html','chat.html'];

(function loadSDK(cb){
  if(window.supabase) return cb();
  const s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
  s.onload=cb; s.onerror=()=>console.error('[SBAuth] Gagal load SDK');
  document.head.appendChild(s);
})(async function(){
  window._sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON,{auth:{persistSession:true,autoRefreshToken:true}});
  await SBAuth.init();
});

const SBAuth={
  user:null, profile:null,

  async init(){
    this.injectStyles(); this.injectModals(); this.injectToast();
    const {data:{session}}=await window._sb.auth.getSession();
    this.user=session?.user??null;
    if(this.user) this.profile=await this._fetchProfile(this.user.id);
    const page=window.location.pathname.split('/').pop()||'index.html';
    if(PROTECTED.includes(page)&&!this.user){window.location.href='index.html';return;}
    this.updateNavUI();
    window._sb.auth.onAuthStateChange(async(_e,sess)=>{
      this.user=sess?.user??null;
      this.profile=this.user?await this._fetchProfile(this.user.id):null;
      this.updateNavUI();
    });
  },

  async _fetchProfile(uid){
    const {data,error}=await window._sb.from('profiles').select('*').eq('id',uid).single();
    if(error&&error.code==='PGRST116'){await this._upsertProfile(uid);return this._fetchProfile(uid);}
    return data||null;
  },

  async _upsertProfile(uid){
    const u=this.user; const m=u?.user_metadata||{};
    await window._sb.from('profiles').upsert({
      id:uid, full_name:m.full_name||u?.email?.split('@')[0]||'Pengguna',
      email:u?.email||'', role:m.role||'mahasiswa'
    },{onConflict:'id'});
  },

  updateNavUI(){
    const cta=document.querySelector('.nav-cta'); if(!cta) return;
    if(this.user){
      const name=this.profile?.full_name||this.user.user_metadata?.full_name||this.user.email?.split('@')[0]||'Saya';
      const ini=name.trim().split(/\s+/).map(w=>w[0]).join('').toUpperCase().slice(0,2);
      cta.innerHTML=`
        <div class="nav-user-pill" id="navPill">
          <div class="nav-av">${ini}</div>
          <span class="nav-av-name">${name.split(' ')[0]}</span>
          <i class="fas fa-chevron-down" style="font-size:.6rem;color:var(--text3,#5a6285)"></i>
          <div class="nav-user-menu" id="navMenu">
            <a href="profil.html" class="umenu-item"><i class="fas fa-user-circle"></i> Profil Saya</a>
            <a href="portfolio-builder.html" class="umenu-item"><i class="fas fa-layer-group"></i> Portfolio</a>
            <a href="gamification.html" class="umenu-item"><i class="fas fa-trophy"></i> Rewards & XP</a>
            <a href="chat.html" class="umenu-item"><i class="fas fa-comment-dots"></i> Pesan</a>
            <div class="umenu-divider"></div>
            <div class="umenu-item umenu-logout" onclick="SBAuth.logout()"><i class="fas fa-sign-out-alt"></i> Keluar</div>
          </div>
        </div>`;
      document.getElementById('navPill')?.addEventListener('click',e=>{
        e.stopPropagation();
        document.getElementById('navMenu')?.classList.toggle('open');
      });
      document.addEventListener('click',()=>document.getElementById('navMenu')?.classList.remove('open'));
    } else {
      cta.innerHTML=`<button class="btn-ghost" onclick="SBAuth.openLogin()">Masuk</button><button class="btn-primary" onclick="SBAuth.openRegister()">Daftar Gratis</button>`;
    }
    document.querySelectorAll('[data-auth="required"]').forEach(el=>el.style.display=this.user?'':'none');
    document.querySelectorAll('[data-auth="guest"]').forEach(el=>el.style.display=this.user?'none':'');
    window.dispatchEvent(new CustomEvent('sb:authReady',{detail:{user:this.user,profile:this.profile}}));
  },

  async register(){
    const name=document.getElementById('registerName')?.value.trim();
    const email=document.getElementById('registerEmail')?.value.trim();
    const pass=document.getElementById('registerPassword')?.value;
    const role=document.getElementById('registerRole')?.value||'mahasiswa';
    if(!name||!email||!pass) return this._err('registerError','Semua field wajib diisi.');
    if(pass.length<8) return this._err('registerError','Password minimal 8 karakter.');
    if(!email.includes('@')) return this._err('registerError','Format email tidak valid.');
    this._load('registerBtn',true);
    const {data,error}=await window._sb.auth.signUp({email,password:pass,options:{data:{full_name:name,role}}});
    this._load('registerBtn',false);
    if(error){
      return this._err('registerError',
        error.message.includes('already registered')||error.message.includes('User already registered')
          ?'Email sudah terdaftar. Silakan masuk.':error.message);
    }
    if(data?.session){
      this.user=data.session.user;
      this.profile=await this._fetchProfile(this.user.id);
      this.closeRegister();
      this._toast('🎉',`Halo ${name.split(' ')[0]}! Selamat bergabung!`);
      setTimeout(()=>window.location.href='profil.html',900);
    } else {
      this._ok('registerSuccess','📧 Cek emailmu untuk konfirmasi, lalu kembali dan login.');
    }
  },

  async login(){
    const email=document.getElementById('loginEmail')?.value.trim();
    const pass=document.getElementById('loginPassword')?.value;
    if(!email||!pass) return this._err('loginError','Email dan password wajib diisi.');
    this._load('loginBtn',true);
    const {data,error}=await window._sb.auth.signInWithPassword({email,password:pass});
    this._load('loginBtn',false);
    if(error){
      return this._err('loginError',
        error.message.includes('Invalid login')||error.message.includes('invalid_credentials')
          ?'Email atau password salah.':
        error.message.includes('Email not confirmed')
          ?'Konfirmasi email dulu ya! Cek inbox atau folder spam.':error.message);
    }
    this.user=data.session.user;
    this.profile=await this._fetchProfile(this.user.id);
    this.closeLogin(); this.updateNavUI();
    const dn=this.profile?.full_name||this.user.user_metadata?.full_name||'kamu';
    this._toast('👋',`Selamat datang, ${dn.split(' ')[0]}!`);
    setTimeout(()=>window.location.href='profil.html',900);
  },

  async sendReset(){
    const email=document.getElementById('forgotEmail')?.value.trim();
    if(!email) return this._err('forgotError','Masukkan email kamu.');
    this._load('forgotBtn',true);
    const base=window.location.href.replace(/[^/]*$/,'');
    const {error}=await window._sb.auth.resetPasswordForEmail(email,{redirectTo:base+'profil.html'});
    this._load('forgotBtn',false);
    if(error) return this._err('forgotError',error.message);
    this._ok('forgotSuccess','📧 Link reset password telah dikirim!');
    setTimeout(()=>this.closeForgot(),4000);
  },

  async updateProfile(fields){
    if(!this.user) return {error:'Belum login'};
    const {data,error}=await window._sb.from('profiles').update(fields).eq('id',this.user.id).select().single();
    if(!error) this.profile=data;
    return {data,error};
  },

  async logout(){
    await window._sb.auth.signOut();
    this.user=null; this.profile=null;
    this._toast('👋','Sampai jumpa!');
    setTimeout(()=>window.location.href='index.html',700);
  },

  openLogin()    {this._clr();document.getElementById('sb-modal-login')?.classList.add('open');setTimeout(()=>document.getElementById('loginEmail')?.focus(),150);},
  closeLogin()   {document.getElementById('sb-modal-login')?.classList.remove('open');},
  openRegister() {this._clr();document.getElementById('sb-modal-register')?.classList.add('open');setTimeout(()=>document.getElementById('registerName')?.focus(),150);},
  closeRegister(){document.getElementById('sb-modal-register')?.classList.remove('open');},
  openForgot()   {this.closeLogin();document.getElementById('sb-modal-forgot')?.classList.add('open');setTimeout(()=>document.getElementById('forgotEmail')?.focus(),150);},
  closeForgot()  {document.getElementById('sb-modal-forgot')?.classList.remove('open');},
  switchToRegister(){this.closeLogin();this.openRegister();},
  switchToLogin()   {this.closeRegister();this.openLogin();},

  checkStrength(input){
    const bar=document.getElementById('pwStrength'); if(!bar) return;
    const v=input.value;
    const s=[v.length>=8,/[A-Z]/.test(v),/[0-9]/.test(v),/[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
    bar.style.width=v?['25%','50%','75%','100%'][s-1]||'10%':'0';
    bar.style.background=['#f87171','#f7884f','#f5c842','#38d9a9'][s-1]||'#f87171';
  },

  togglePw(id,btn){
    const el=document.getElementById(id); if(!el) return;
    const show=el.type==='password'; el.type=show?'text':'password';
    btn.innerHTML=show?'<i class="fas fa-eye-slash"></i>':'<i class="fas fa-eye"></i>';
  },

  _err(id,msg){const el=document.getElementById(id);if(!el)return;el.innerHTML='⚠️ '+msg;el.style.display='block';setTimeout(()=>el.style.display='none',6000);},
  _ok(id,msg){const el=document.getElementById(id);if(!el)return;el.innerHTML=msg;el.style.display='block';},
  _clr(){['loginError','loginSuccess','registerError','registerSuccess','forgotError','forgotSuccess'].forEach(id=>{const el=document.getElementById(id);if(el){el.style.display='none';el.innerHTML='';};});},
  _load(id,on){const btn=document.getElementById(id);if(!btn)return;btn.disabled=on;if(on){btn._o=btn.innerHTML;btn.innerHTML='<span class="sb-spin"></span> Memproses...';}else if(btn._o)btn.innerHTML=btn._o;},
  _toast(icon,msg){const t=document.getElementById('sb-toast');const ti=document.getElementById('sb-ti');const tm=document.getElementById('sb-tm');if(!t)return;if(ti)ti.textContent=icon;if(tm)tm.textContent=msg;t.style.transform='translateX(0)';clearTimeout(this._tt);this._tt=setTimeout(()=>t.style.transform='translateX(140%)',3800);},

  injectStyles(){
    if(document.getElementById('sb-styles')) return;
    const st=document.createElement('style'); st.id='sb-styles';
    st.textContent=`
.nav-user-pill{display:flex;align-items:center;gap:.55rem;padding:.35rem .9rem .35rem .45rem;border-radius:100px;border:1px solid var(--border,#252d47);background:var(--card,#1a2035);cursor:pointer;position:relative;user-select:none;transition:border-color .2s;}
.nav-user-pill:hover{border-color:var(--accent,#4f8ef7);}
.nav-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent,#4f8ef7),var(--accent2,#7b5ef8));display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:.7rem;font-weight:800;color:#fff;flex-shrink:0;}
.nav-av-name{font-size:.82rem;font-weight:600;color:var(--text,#e8edf8);}
.nav-user-menu{display:none;position:absolute;top:calc(100% + .65rem);right:0;background:var(--card2,#1e2640);border:1px solid var(--border,#252d47);border-radius:14px;padding:.5rem;min-width:188px;z-index:2000;box-shadow:0 16px 48px rgba(0,0,0,.5);}
.nav-user-menu.open{display:block;animation:sbMen .2s ease;}
@keyframes sbMen{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.umenu-item{display:flex;align-items:center;gap:.65rem;padding:.62rem .9rem;border-radius:9px;font-size:.83rem;color:var(--text2,#8a96b8);text-decoration:none;cursor:pointer;transition:background .15s;}
.umenu-item:hover{background:var(--bg3,#161b28);color:var(--text,#e8edf8);}
.umenu-item i{width:15px;text-align:center;font-size:.8rem;color:var(--accent,#4f8ef7);}
.umenu-divider{height:1px;background:var(--border,#252d47);margin:.4rem .6rem;}
.umenu-logout{color:#f87171!important;}.umenu-logout i{color:#f87171!important;}
.umenu-logout:hover{background:rgba(248,113,113,.1)!important;}
.sb-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(7px);z-index:5000;display:none;align-items:center;justify-content:center;padding:1rem;}
.sb-overlay.open{display:flex;}
.sb-box{background:var(--card2,#1e2640);border:1px solid var(--border,#252d47);border-radius:22px;padding:2.1rem;width:min(430px,97%);position:relative;animation:sbIn .28s cubic-bezier(.34,1.4,.64,1);}
@keyframes sbIn{from{opacity:0;transform:scale(.91) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
.sb-x{position:absolute;top:1rem;right:1rem;background:transparent;border:none;color:var(--text3,#5a6285);font-size:1.1rem;cursor:pointer;width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.sb-x:hover{background:var(--bg3,#161b28);color:var(--text,#e8edf8);}
.sb-box h3{font-family:'Sora',sans-serif;font-weight:800;font-size:1.22rem;color:var(--text,#e8edf8);margin-bottom:.3rem;}
.sb-sub{font-size:.84rem;color:var(--text2,#8a96b8);margin-bottom:1.5rem;line-height:1.5;}
.sb-fg{margin-bottom:1rem;}
.sb-fg label{display:block;font-size:.78rem;font-weight:600;color:var(--text2,#8a96b8);margin-bottom:.4rem;}
.sb-fg input,.sb-fg select{width:100%;background:var(--bg3,#161b28);border:1px solid var(--border,#252d47);border-radius:10px;padding:.72rem 1rem;color:var(--text,#e8edf8);font-family:'DM Sans',sans-serif;font-size:.9rem;outline:none;transition:border-color .2s;-webkit-appearance:none;}
.sb-fg input:focus,.sb-fg select:focus{border-color:var(--accent,#4f8ef7);box-shadow:0 0 0 3px rgba(79,142,247,.12);}
.sb-pw-wrap{position:relative;}.sb-pw-wrap input{padding-right:2.8rem;}
.sb-eye{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);background:transparent;border:none;color:var(--text3,#5a6285);cursor:pointer;font-size:.85rem;padding:.25rem;}
.sb-strength{height:3px;border-radius:2px;margin-top:.45rem;transition:width .3s,background .3s;width:0;}
.sb-acts{display:flex;gap:.7rem;margin-top:1.6rem;}
.sb-btn{flex:1;padding:.78rem;border-radius:11px;font-family:'DM Sans',sans-serif;font-size:.92rem;font-weight:700;cursor:pointer;transition:opacity .2s;display:flex;align-items:center;justify-content:center;gap:.5rem;}
.sb-btn.primary{border:none;background:linear-gradient(135deg,var(--accent,#4f8ef7),var(--accent2,#7b5ef8));color:#fff;}
.sb-btn.primary:hover{opacity:.87;}.sb-btn.primary:disabled{opacity:.45;cursor:not-allowed;}
.sb-btn.outline{border:1px solid var(--border,#252d47);background:transparent;color:var(--text2,#8a96b8);}
.sb-btn.outline:hover{border-color:var(--accent,#4f8ef7);color:var(--accent,#4f8ef7);}
.sb-err{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.22);border-radius:9px;padding:.6rem .9rem;font-size:.8rem;color:#f87171;margin-bottom:1rem;display:none;}
.sb-ok{background:rgba(56,217,169,.1);border:1px solid rgba(56,217,169,.22);border-radius:9px;padding:.6rem .9rem;font-size:.8rem;color:#38d9a9;margin-bottom:1rem;display:none;}
.sb-switch{text-align:center;margin-top:1.1rem;font-size:.82rem;color:var(--text2,#8a96b8);}
.sb-switch a{color:var(--accent,#4f8ef7);cursor:pointer;font-weight:600;text-decoration:none;}
.sb-switch a:hover{text-decoration:underline;}
.sb-forgot{text-align:right;margin:.2rem 0 .6rem;}
.sb-forgot a{font-size:.77rem;color:var(--accent,#4f8ef7);cursor:pointer;}
.sb-spin{width:15px;height:15px;border:2.5px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sbRot .7s linear infinite;display:inline-block;}
@keyframes sbRot{to{transform:rotate(360deg)}}`;
    document.head.appendChild(st);
  },

  injectModals(){
    if(document.getElementById('sb-modal-login')) return;
    const w=document.createElement('div');
    w.innerHTML=`
<div class="sb-overlay" id="sb-modal-login">
  <div class="sb-box">
    <button class="sb-x" onclick="SBAuth.closeLogin()"><i class="fas fa-times"></i></button>
    <h3>👋 Selamat Datang Kembali</h3>
    <p class="sb-sub">Masuk untuk melanjutkan perjalanan karirmu</p>
    <div class="sb-err" id="loginError"></div>
    <div class="sb-ok" id="loginSuccess"></div>
    <div class="sb-fg"><label>Email</label>
      <input type="email" id="loginEmail" placeholder="email@contoh.com" onkeydown="if(event.key==='Enter')SBAuth.login()">
    </div>
    <div class="sb-fg"><label>Password</label>
      <div class="sb-pw-wrap">
        <input type="password" id="loginPassword" placeholder="••••••••" onkeydown="if(event.key==='Enter')SBAuth.login()">
        <button class="sb-eye" onclick="SBAuth.togglePw('loginPassword',this)" type="button"><i class="fas fa-eye"></i></button>
      </div>
    </div>
    <div class="sb-forgot"><a onclick="SBAuth.openForgot()">Lupa password?</a></div>
    <div class="sb-acts">
      <button class="sb-btn primary" id="loginBtn" onclick="SBAuth.login()"><i class="fas fa-sign-in-alt"></i> Masuk</button>
    </div>
    <p class="sb-switch">Belum punya akun? <a onclick="SBAuth.switchToRegister()">Daftar sekarang →</a></p>
  </div>
</div>
<div class="sb-overlay" id="sb-modal-register">
  <div class="sb-box">
    <button class="sb-x" onclick="SBAuth.closeRegister()"><i class="fas fa-times"></i></button>
    <h3>🚀 Bergabung dengan SkillBridge</h3>
    <p class="sb-sub">Gratis selamanya · 12K+ lowongan menunggumu</p>
    <div class="sb-err" id="registerError"></div>
    <div class="sb-ok" id="registerSuccess"></div>
    <div class="sb-fg"><label>Nama Lengkap</label>
      <input type="text" id="registerName" placeholder="Nama lengkap kamu">
    </div>
    <div class="sb-fg"><label>Email</label>
      <input type="email" id="registerEmail" placeholder="email@contoh.com">
    </div>
    <div class="sb-fg"><label>Password</label>
      <div class="sb-pw-wrap">
        <input type="password" id="registerPassword" placeholder="Min. 8 karakter" oninput="SBAuth.checkStrength(this)" onkeydown="if(event.key==='Enter')SBAuth.register()">
        <button class="sb-eye" onclick="SBAuth.togglePw('registerPassword',this)" type="button"><i class="fas fa-eye"></i></button>
      </div>
      <div class="sb-strength" id="pwStrength"></div>
    </div>
    <div class="sb-fg"><label>Saya adalah</label>
      <select id="registerRole">
        <option value="mahasiswa">🎓 Mahasiswa</option>
        <option value="fresh_graduate">🎉 Fresh Graduate</option>
        <option value="profesional">💼 Profesional</option>
      </select>
    </div>
    <div class="sb-acts">
      <button class="sb-btn primary" id="registerBtn" onclick="SBAuth.register()"><i class="fas fa-rocket"></i> Daftar Sekarang</button>
    </div>
    <p class="sb-switch">Sudah punya akun? <a onclick="SBAuth.switchToLogin()">Masuk →</a></p>
  </div>
</div>
<div class="sb-overlay" id="sb-modal-forgot">
  <div class="sb-box">
    <button class="sb-x" onclick="SBAuth.closeForgot()"><i class="fas fa-times"></i></button>
    <h3>🔑 Reset Password</h3>
    <p class="sb-sub">Masukkan email kamu, kami kirim link reset.</p>
    <div class="sb-err" id="forgotError"></div>
    <div class="sb-ok" id="forgotSuccess"></div>
    <div class="sb-fg"><label>Email</label>
      <input type="email" id="forgotEmail" placeholder="email@contoh.com" onkeydown="if(event.key==='Enter')SBAuth.sendReset()">
    </div>
    <div class="sb-acts">
      <button class="sb-btn outline" onclick="SBAuth.closeForgot()">Batal</button>
      <button class="sb-btn primary" id="forgotBtn" onclick="SBAuth.sendReset()"><i class="fas fa-paper-plane"></i> Kirim Link</button>
    </div>
  </div>
</div>`;
    document.body.appendChild(w);
    ['sb-modal-login','sb-modal-register','sb-modal-forgot'].forEach(id=>{
      document.getElementById(id)?.addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');});
    });
  },

  injectToast(){
    if(document.getElementById('sb-toast')) return;
    const t=document.createElement('div'); t.id='sb-toast';
    t.style.cssText='position:fixed;bottom:2rem;right:2rem;z-index:9999;background:var(--card2,#1e2640);border:1px solid var(--border,#252d47);border-radius:13px;padding:.9rem 1.3rem;display:flex;align-items:center;gap:.75rem;transform:translateX(140%);transition:transform .38s cubic-bezier(.34,1.5,.64,1);box-shadow:0 10px 48px rgba(0,0,0,.5);max-width:300px;pointer-events:none;';
    t.innerHTML='<span id="sb-ti" style="font-size:1.15rem">✅</span><span id="sb-tm" style="font-size:.875rem;font-weight:500;color:var(--text,#e8edf8);line-height:1.4;"></span>';
    document.body.appendChild(t);
  },
};

window.openModal=window.openModal||function(id){
  if(id==='login') SBAuth.openLogin();
  else if(id==='register') SBAuth.openRegister();
};