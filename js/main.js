/* ============================
   サングロース不動産 - メインスクリプト
   ============================ */

// ---- ヘッダー（白背景固定のため scrolled クラスは影のみ） ----
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ---- ハンバーガーメニュー ----
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.nav-mobile');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.nav-mobile a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ---- スクロールアニメーション ----
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

// ---- FAQ アコーディオン ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      const ans = b.nextElementSibling;
      if (ans) ans.classList.remove('open');
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      const ans = btn.nextElementSibling;
      if (ans) ans.classList.add('open');
    }
  });
});

// ---- お問い合わせフォーム (Formspree AJAX) ----
const form = document.getElementById('contact-form-el');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');
    const errorMsg   = document.getElementById('form-error');

    const name    = form.querySelector('#f-name')?.value.trim();
    const tel     = form.querySelector('#f-tel')?.value.trim();
    const message = form.querySelector('#f-message')?.value.trim();
    if (!name || !tel || !message) {
      alert('必須項目（お名前・電話番号・お問い合わせ内容）を入力してください。');
      return;
    }

    btn.textContent = '送信中...';
    btn.disabled = true;
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg)   errorMsg.style.display   = 'none';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const redirect = form.dataset.redirect || 'thanks.html';
        window.location.href = redirect;
      } else { throw new Error(); }
    } catch {
      if (errorMsg) errorMsg.style.display = 'block';
      btn.textContent = '相談してみる';
      btn.disabled = false;
    }
  });
}

// ---- トップへ戻るボタン ----
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- コピーライト年自動更新 ----
const copyYear = document.getElementById('copy-year');
if (copyYear) copyYear.textContent = new Date().getFullYear();

// ---- ナビリンク: アクティブ強調 ----
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });
