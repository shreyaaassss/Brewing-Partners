// Mobile nav toggle
const nav = document.getElementById('nav');
const toggle = nav.querySelector('.nav-toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('.nav-links a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// Reveal on scroll
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }),
  { threshold: 0.05 }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Chartreuse underline draws in once its word is fully on screen
const markIO = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('drawn');
      markIO.unobserve(e.target);
    }
  }),
  { threshold: 1 }
);
document.querySelectorAll('.mark').forEach((el) => markIO.observe(el));

// Testimonials (home page)
const quoteText = document.getElementById('quote-text');
if (quoteText) {
  const quotes = [
    { text: '“The only café where the barista remembers my order <em>and</em> tells me which hillside it came from.”', name: 'Rohan Mehta', role: 'Regular since day one' },
    { text: '“I came for the cold brew, stayed for the Thursday cuppings. It’s become my <em>favourite</em> hour of the week.”', name: 'Ishita Rao', role: 'Thursday cupping regular' },
    { text: '“We switched our office coffee to Brewing Partners and the team actually <em>looks forward</em> to Mondays now.”', name: 'Karan Shah', role: 'Wholesale partner' },
  ];
  const dots = document.querySelectorAll('.quote-dots button');
  let current = 0;
  const showQuote = (i) => {
    current = i;
    const q = quotes[i];
    quoteText.innerHTML = q.text;
    document.getElementById('quote-name').textContent = q.name;
    document.getElementById('quote-role').textContent = q.role;
    document.getElementById('quote-initial').textContent = q.name[0];
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
  };
  dots.forEach((d, i) => d.addEventListener('click', () => showQuote(i)));
  setInterval(() => showQuote((current + 1) % quotes.length), 7000);
}

// Newsletter form (front-end only — wire to your email provider later)
const signup = document.getElementById('signup-form');
if (signup) {
  signup.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email');
    const note = document.getElementById('form-note');
    if (!email.checkValidity() || !email.value) {
      note.textContent = 'Please enter a valid email address.';
      note.classList.remove('ok');
      return;
    }
    note.textContent = 'Thank you — see you in the next letter.';
    note.classList.add('ok');
    email.value = '';
  });
}

// Menu page: tabs show one category at a time (all categories show without JS)
const tabs = [...document.querySelectorAll('.tabs .tab')];
const panels = [...document.querySelectorAll('.arch[id]')];
if (tabs.length && panels.length) {
  const tabBar = document.querySelector('.tabs');
  const arches = document.querySelector('.arches');
  tabBar.querySelector('.tabs-inner').setAttribute('role', 'tablist');

  const show = (id, scroll) => {
    if (!panels.some((p) => p.id === id)) id = panels[0].id;
    panels.forEach((p) => { p.hidden = p.id !== id; });
    tabs.forEach((t) => {
      const on = t.getAttribute('href') === '#' + id;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on);
      if (on) t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    // Bring the top of the menu back into view if the reader had scrolled past it
    const top = arches.getBoundingClientRect().top + window.scrollY - tabBar.offsetHeight;
    if (scroll && window.scrollY > top) window.scrollTo({ top });
  };

  tabs.forEach((t) => {
    t.setAttribute('role', 'tab');
    t.addEventListener('click', (e) => {
      e.preventDefault();
      const id = t.getAttribute('href').slice(1);
      history.replaceState(null, '', '#' + id);
      show(id, true);
    });
  });
  panels.forEach((p) => p.setAttribute('role', 'tabpanel'));
  window.addEventListener('hashchange', () => show(location.hash.slice(1), true));
  show(location.hash.slice(1), false);
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Hero video: respect reduced-motion and pause it when off screen
const heroVideo = document.querySelector('.arch-frame video');
if (heroVideo) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  } else {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) heroVideo.play().catch(() => {});
      else heroVideo.pause();
    }).observe(heroVideo);
  }
}
