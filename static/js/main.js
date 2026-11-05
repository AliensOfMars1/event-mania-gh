// ============ Modern Mobile Nav Toggle ============
const toggle = document.getElementById('mobile-toggle');
const nav = document.getElementById('mainNav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    // Toggle body class for solid header background
    document.body.classList.toggle('menu-open', isOpen);
    
    // Prevent background scrolling when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
  });
}

// ============ Year in footer ============
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============ Portfolio filter ============
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('#gallery .gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      item.style.display = (filter === 'all' || item.dataset.category === filter) ? '' : 'none';
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

    formStatus.hidden = true;
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const response = await fetch(inquiryForm.action, {
        method: 'POST',
        body: new FormData(inquiryForm),
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
      submitBtn.innerHTML = originalBtnText;
    }
  });
}