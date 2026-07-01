// ---------- Theme toggle ----------
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(mode){
  if(mode === 'dark'){
    root.setAttribute('data-theme','dark');
    themeIcon.innerHTML = '<path d="M21 12.5A9 9 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z" stroke-linecap="round" stroke-linejoin="round"/>';
  } else {
    root.removeAttribute('data-theme');
    themeIcon.innerHTML = '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" stroke-linecap="round"/>';
  }
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('dkm-theme'); } catch(e) {}
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('dkm-theme', next); } catch(e) {}
});

// ---------- Mobile menu ----------
const menuToggle = document.getElementById('menuToggle');
const mobilePanel = document.getElementById('mobilePanel');
menuToggle.addEventListener('click', () => {
  mobilePanel.classList.toggle('open');
});
mobilePanel.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobilePanel.classList.remove('open'));
});

// ---------- Active nav link on scroll ----------
const navLinks = document.querySelectorAll('.nav-links a');
const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));

function updateActiveNav(){
  let currentId = null;
  const scrollPos = window.scrollY + 140;
  sections.forEach(sec => {
    if(sec && sec.offsetTop <= scrollPos){
      currentId = '#' + sec.id;
    }
  });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === currentId));
}

// ---------- Header scroll state + scroll progress ----------
const header = document.getElementById('siteHeader');
const progressBar = document.getElementById('progressBar');
const backTop = document.getElementById('backTop');

function onScroll(){
  const scrollTop = window.scrollY;
  header.classList.toggle('scrolled', scrollTop > 10);
  backTop.classList.toggle('show', scrollTop > 500);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';

  updateActiveNav();
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

backTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

// ---------- Typing effect ----------
const roles = [
  'Statistician',
  'Data Scientist',
  'AI Researcher'
];
const typedEl = document.getElementById('typedText');
let roleIndex = 0, charIndex = 0, deleting = false;
typedEl.textContent = '';

function typeLoop(){
  const current = roles[roleIndex];
  if(!deleting){
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if(charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if(charIndex === 0){
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 75);
}
typeLoop();

// ---------- Scroll reveal (progressive enhancement: content is visible by
// default in CSS; this only adds the fade-in effect when JS + IntersectionObserver work) ----------
if('IntersectionObserver' in window){
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(el => el.classList.add('pre'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
}

// ---------- Animated counters ----------
if('IntersectionObserver' in window){
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1400;
        const start = performance.now();
        function step(now){
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if(progress < 1){
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObserver.observe(el));
}

// ---------- Project filter ----------
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const show = filter === 'all' || card.getAttribute('data-cat') === filter;
      card.style.display = show ? '' : 'none';
    });
  });
});

// ---------- Contact form ----------
const contactForm = document.getElementById('contactForm');

// Create a response message element dynamically
const formResponse = document.createElement('p');
formResponse.style.marginTop = '14px';
formResponse.style.fontSize = '14px';
contactForm.appendChild(formResponse);

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  formResponse.textContent = '';

  const formData = new FormData(contactForm);

  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
  })
  .then(async (response) => {
    let json = await response.json();
    if (response.status == 200) {
      formResponse.style.color = 'var(--teal)';
      formResponse.textContent = "Message sent successfully!";
      contactForm.reset();
    } else {
      console.error(response);
      formResponse.style.color = 'var(--terracotta)';
      formResponse.textContent = json.message || "Something went wrong!";
    }
  })
  .catch(error => {
    console.error(error);
    formResponse.style.color = 'var(--terracotta)';
    formResponse.textContent = "Something went wrong!";
  })
  .then(() => {
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
    setTimeout(() => {
      formResponse.textContent = '';
    }, 5000);
  });
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
