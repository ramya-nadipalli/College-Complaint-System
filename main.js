/**
 * ACET College Complaint Portal – Shared Utilities (main.js)
 * Loaded on every page. Provides:
 *  - Auth guards (authGuard, adminGuard, logout)
 *  - Toast notification system
 *  - Notification panel toggle
 *  - Navbar scroll effect
 *  - Smooth entrance animations
 */

/* ============================================================
   AUTH GUARDS
   ============================================================ */

/** Redirect to login if student is not logged in */
function authGuard() {
  const loggedIn = localStorage.getItem('acet_logged_in') === 'true';
  const user = JSON.parse(localStorage.getItem('acet_user') || '{}');
  if (!loggedIn || !user.username) {
    window.location.href = 'login.html';
    return false;
  }
  // Admin should not access student pages
  if (user.role === 'admin') {
    window.location.href = 'admin-dashboard.html';
    return false;
  }
  return true;
}

/** Redirect to admin login if admin is not logged in */
function adminGuard() {
  const loggedIn = localStorage.getItem('acet_logged_in') === 'true';
  const user = JSON.parse(localStorage.getItem('acet_user') || '{}');
  if (!loggedIn || !user.username) {
    window.location.href = 'admin-login.html';
    return false;
  }
  if (user.role !== 'admin') {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/** Logout the current user */
function logout() {
  const user = JSON.parse(localStorage.getItem('acet_user') || '{}');
  const isAdmin = user.role === 'admin';
  localStorage.removeItem('acet_logged_in');
  localStorage.removeItem('acet_user');
  showToast('You have been logged out. Goodbye! 👋', 'info');
  setTimeout(() => {
    window.location.href = isAdmin ? 'admin-login.html' : 'login.html';
  }, 900);
}

/* ============================================================
   TOAST NOTIFICATION SYSTEM
   ============================================================ */

function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s, transform 0.4s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ============================================================
   NOTIFICATION PANEL TOGGLE
   ============================================================ */

function toggleNotif() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  panel.classList.toggle('open');

  // Close on outside click
  if (panel.classList.contains('open')) {
    setTimeout(() => {
      document.addEventListener('click', closeNotifOnOutside, { once: true });
    }, 10);
  }
}

function closeNotifOnOutside(e) {
  const panel = document.getElementById('notif-panel');
  const btn = document.getElementById('notif-btn');
  if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
    panel.classList.remove('open');
  }
}

/* ============================================================
   NAVBAR SCROLL EFFECT (Home Page)
   ============================================================ */

window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

/* ============================================================
   ANIMATED STAT COUNTERS (Home Page)
   ============================================================ */

function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        let current = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 20);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============================================================
   SCROLL-TRIGGERED ANIMATIONS (Stagger / FadeIn)
   ============================================================ */

function initScrollAnimations() {
  const items = document.querySelectorAll('.feature-card, .stat-card, .chart-card, .table-card');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });
}

/* ============================================================
   INIT ON DOM READY
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  initCounters();
  initScrollAnimations();
});
