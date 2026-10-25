// ============ Mobile nav toggle ============
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============ Year in footer ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============ Scroll reveal (safe, no flicker) ============
(function () {
  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    // Do nothing — content stays visible by default
    return;
  }

  const reveals = document.querySelectorAll('.section, .card, .gallery-item, .page-hero');
  if (!reveals.length) return;

  // Only animate elements that are BELOW the fold on first paint.
  // Anything already visible stays visible — no opacity flip.
  const vh = window.innerHeight || document.documentElement.clientHeight;

  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    const isBelowFold = rect.top > vh * 0.9; // adjust 0.9 if you want more/less
    if (isBelowFold) {
      el.classList.add('reveal');
    } else {
      el.classList.add('in'); // already visible → no animation
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => {
    if (el.classList.contains('reveal')) io.observe(el);
  });

  // Safety net: if something goes wrong, force everything visible after 1.5s
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 1500);
})();

// ============ Portfolio filter ============
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('#gallery .gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const cat = item.dataset.category;
      const show = filter === 'all' || cat === filter;
      item.style.display = show ? '' : 'none';
    });
  });
});

// ============ Formspree AJAX form handling ============
const inquiryForm = document.getElementById('inquiry-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (inquiryForm) {
  inquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset status
    formStatus.hidden = true;
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    // Disable button
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const formData = new FormData(inquiryForm);

    try {
      const response = await fetch(inquiryForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        formStatus.textContent = "Thank you! Your inquiry has been sent. We'll be in touch within 24 hours.";
        formStatus.classList.add('success');
        formStatus.hidden = false;
        inquiryForm.reset();
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = (data.errors && data.errors.map(err => err.message).join(', ')) ||
                    'Something went wrong. Please try again or WhatsApp us.';
        formStatus.textContent = msg;
        formStatus.classList.add('error');
        formStatus.hidden = false;
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      formStatus.textContent = 'Network error. Please check your connection or WhatsApp us directly.';
      formStatus.classList.add('error');
      formStatus.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}