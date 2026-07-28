// =========================================================
// Mobile nav toggle
// =========================================================
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// =========================================================
// Footer year
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// =========================================================
// Streak grid — hero signature visual
// A habit-tracker-style grid that fills in progressively,
// echoing the "habit architecture" theme of the site.
// =========================================================
const streakGrid = document.getElementById('streak-grid');
const TOTAL_CELLS = 45; // 9 x 5
const pattern = []; // 'empty' | 'soft' | 'filled'

for (let i = 0; i < TOTAL_CELLS; i++) {
  const r = Math.random();
  if (i < TOTAL_CELLS * 0.55) {
    pattern.push(r > 0.15 ? 'filled' : 'soft');
  } else if (i < TOTAL_CELLS * 0.8) {
    pattern.push(r > 0.5 ? 'filled' : 'soft');
  } else {
    pattern.push(r > 0.75 ? 'soft' : 'empty');
  }
}

pattern.forEach((state) => {
  const cell = document.createElement('div');
  cell.className = 'streak-cell';
  if (state === 'filled') cell.classList.add('filled');
  if (state === 'soft') cell.classList.add('filled-soft');
  streakGrid.appendChild(cell);
});

const cells = streakGrid.querySelectorAll('.streak-cell');

function animateStreak() {
  cells.forEach((cell, i) => {
    setTimeout(() => cell.classList.add('in'), i * 18);
  });
}

const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateStreak();
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

heroObserver.observe(streakGrid);

// =========================================================
// Scroll reveal for sections
// =========================================================
const revealTargets = document.querySelectorAll(
  '.timeline-item, .pillar-card, .cred-card, .exp-list li, .spotlight-copy, .spotlight-stats'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

// =========================================================
// Contact form — client-side validation + mailto handoff
// This is a static site with no backend, so submitting opens
// the visitor's email client pre-filled with their message.
// To collect submissions directly, connect a form service
// like Formspree and swap the code in the try block below.
// =========================================================
const form = document.getElementById('contact-form');
const noteEl = document.getElementById('form-note');

function setError(fieldId, message) {
  const errEl = document.getElementById(`err-${fieldId}`);
  if (errEl) errEl.textContent = message;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const reason = form.reason.value;
  const message = form.message.value.trim();

  setError('name', '');
  setError('email', '');
  setError('message', '');
  noteEl.textContent = '';

  let valid = true;
  if (!name) { setError('name', 'Please enter your name.'); valid = false; }
  if (!email) { setError('email', 'Please enter your email.'); valid = false; }
  else if (!isValidEmail(email)) { setError('email', 'That email address doesn\u2019t look right.'); valid = false; }
  if (!message) { setError('message', 'Add a short message so Geetika knows how to help.'); valid = false; }

  if (!valid) return;

  const subject = encodeURIComponent(`${reason} — message from ${name}`);
  const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`);
  window.location.href = `mailto:geetika1991@gmail.com?subject=${subject}&body=${body}`;

  noteEl.textContent = 'Opening your email client to send this message…';
  form.reset();
});
