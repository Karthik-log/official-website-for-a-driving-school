
  // ===== EMAILJS INIT =====
  const EMAILJS_PUBLIC_KEY       = '-NAdAnMp1kvTmetRp'; // corrected (l not I)
  const EMAILJS_SERVICE_ID       = 'service_kp66rhx';
  const EMAILJS_ENQUIRY_TEMPLATE = 'template_qghslnp';
  const EMAILJS_CONTACT_TEMPLATE = 'template_ffqeao5';

  // Proper init using object syntax (required by EmailJS v4)
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  // ===== TOAST =====
  function showToast(msg, isError) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast' + (isError ? ' error' : '');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
  }

  // ===== DARK MODE =====
  function toggleDark() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  }
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  // ===== PAGE NAVIGATION =====
  function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navEl = document.getElementById('nav-' + name);
    if (navEl) navEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ===== MOBILE NAV =====
  function toggleMobile() {
    document.getElementById('navLinks').classList.toggle('open');
    document.getElementById('hamburger').classList.toggle('open');
  }
  function closeMobile() {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  }

  // ===== STICKY NAV =====
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
  });

  // ===== HERO SLIDER =====
  let currentSlide = 0;
  const slidesEl = document.getElementById('slides');
  const totalSlides = 4;
  const dotsEl = document.getElementById('sliderDots');
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsEl.appendChild(dot);
  }
  function goToSlide(n) {
    currentSlide = (n + totalSlides) % totalSlides;
    slidesEl.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }
  function changeSlide(dir) { goToSlide(currentSlide + dir); }
  setInterval(() => changeSlide(1), 5000);

  // ===== INTRO VIDEO =====
  function playIntroVideo() {
    const wrap = document.getElementById('introVideoWrap');
    const frame = document.getElementById('introFrame');
    wrap.style.display = 'none';
    frame.classList.add('show');
    document.getElementById('introIframe').src = 'https://www.youtube.com/embed/PZWcB6PeK5E?autoplay=1&mute=0';
  }

  // ===== COURSE TOGGLE =====
  function toggleDesc(btn) {
    const desc = btn.nextElementSibling;
    const open = desc.classList.toggle('open');
    btn.textContent = open ? '▲ Hide Details' : '▼ Show Details';
  }

  // ===== GALLERY — FIXED =====
  let galleryExpanded = false;
  // Hide extra items on load
  document.querySelectorAll('.gallery-extra').forEach(el => el.style.display = 'none');

  function toggleGallery() {
    galleryExpanded = !galleryExpanded;
    document.querySelectorAll('.gallery-extra').forEach(el => {
      el.style.display = galleryExpanded ? '' : 'none';
    });
    const btn = document.getElementById('galleryToggleBtn');
    btn.textContent = galleryExpanded ? 'Show Less ▲' : 'Show More Photos ▼';
  }

  // ===== LIGHTBOX =====
  function openLightbox(src) {
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(e) {
    if (!e || e.target === document.getElementById('lightbox') || e.target.className === 'lightbox-close') {
      document.getElementById('lightbox').classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ===== MODAL =====
  function showModal() {
    document.getElementById('enquireModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    document.getElementById('enquireModal').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('enquireModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  // ===== ENQUIRY FORM — sends email only (no WhatsApp) =====
  async function submitEnquire() {
    let valid = true;
    const fields = [
      { id: 'eq-name', errId: 'eq-name-err', msg: 'Full name is required.' },
      { id: 'eq-age', errId: 'eq-age-err', msg: 'Please enter your age.' },
      { id: 'eq-gender', errId: 'eq-gender-err', msg: 'Please select your gender.' },
      { id: 'eq-phone', errId: 'eq-phone-err', msg: 'Please enter your phone number.' },
    ];
    fields.forEach(f => {
      const el = document.getElementById(f.id);
      const err = document.getElementById(f.errId);
      if (!el.value.trim()) { err.style.display = 'block'; err.textContent = f.msg; valid = false; }
      else { err.style.display = 'none'; }
    });
    if (!valid) return;

    const name    = document.getElementById('eq-name').value.trim();
    const age     = document.getElementById('eq-age').value.trim();
    const gender  = document.getElementById('eq-gender').value;
    const phone   = document.getElementById('eq-phone').value.trim();
    const email   = document.getElementById('eq-email').value.trim();
    const course  = document.getElementById('eq-course').value || 'Not specified';
    const timing  = document.getElementById('eq-timing').value || 'Not specified';
    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const btn = document.getElementById('enquireSubmitBtn');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    // Build a self-contained message so it works no matter how the EmailJS template is set up
    const enquiryBody =
      `📋 NEW ENQUIRY — Naveen Motor Driving School\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Full Name     : ${name}\n` +
      `📅 Age           : ${age}\n` +
      `⚤  Gender        : ${gender}\n` +
      `📞 Phone         : ${phone}\n` +
      `📧 Email         : ${email || 'Not provided'}\n` +
      `📚 Course        : ${course}\n` +
      `⏰ Timing        : ${timing}\n` +
      `🕐 Submitted At  : ${submittedAt}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ENQUIRY_TEMPLATE, {
        // Standard EmailJS variables — map these in your template
        to_email      : 'naveenmotordrivingschool@gmail.com',
        from_name     : name,
        subject       : `New Enquiry from ${name} — Naveen Driving School`,
        // Individual fields (use any of these in your template as {{field_name}})
        age           : age,
        gender        : gender,
        phone         : phone,
        email         : email || 'Not provided',
        course        : course,
        timing        : timing,
        submitted_at  : submittedAt,
        // Single full message — use {{message}} in your template body
        message       : enquiryBody
      });

      document.getElementById('eq-success').style.display = 'block';
      document.getElementById('eq-success').textContent = '✅ Enquiry submitted! We will contact you soon.';

    } catch(err) {
      console.error('EmailJS enquiry error:', err);
      // Show error to user so they know to retry or call directly
      const errEl = document.getElementById('eq-success');
      errEl.style.display = 'block';
      errEl.style.background = '#fde8e8';
      errEl.style.borderColor = '#c62828';
      errEl.style.color = '#c62828';
      errEl.textContent = '❌ Could not send an enquiry Email. Please call us directly at 7204416546.';
    }

    // Reset form fields
    ['eq-name','eq-age','eq-gender','eq-phone','eq-email','eq-course','eq-timing'].forEach(id => {
      const el = document.getElementById(id);
      if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else el.value = '';
    });

    btn.disabled = false;
    btn.textContent = 'Submit Enquiry 🚗';

    setTimeout(() => {
      const s = document.getElementById('eq-success');
      s.style.display = 'none';
      s.style.background = '';
      s.style.borderColor = '';
      s.style.color = '';
      closeModal();
    }, 4000);
  }

  // ===== CONTACT FORM — sends email only (no WhatsApp) =====
  async function submitContactForm() {
    const name  = document.getElementById('cf-name').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const msg   = document.getElementById('cf-msg').value.trim();
    let valid = true;

    if (!name) { document.getElementById('cf-name-err').style.display = 'block'; valid = false; }
    else { document.getElementById('cf-name-err').style.display = 'none'; }

    if (!phone || !/^\d{10,12}$/.test(phone)) { document.getElementById('cf-phone-err').style.display = 'block'; valid = false; }
    else { document.getElementById('cf-phone-err').style.display = 'none'; }

    if (!valid) return;

    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const contactBody =
      `📩 NEW MESSAGE — Naveen Motor Driving School Website\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 Name          : ${name}\n` +
      `📞 Phone         : ${phone}\n` +
      `💬 Message       : ${msg || 'No message provided'}\n` +
      `🕐 Submitted At  : ${submittedAt}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const cfBtn = document.querySelector('#contactForm .btn-submit');
    if (cfBtn) { cfBtn.disabled = true; cfBtn.textContent = 'Sending...'; }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE, {
        to_email     : 'naveenmotordrivingschool@gmail.com',
        from_name    : name,
        subject      : `Website Message from ${name} — Naveen Driving School`,
        phone        : phone,
        submitted_at : submittedAt,
        message      : contactBody
      });

      document.getElementById('cf-success').style.display = 'block';
      document.getElementById('cf-success').textContent = '✅ Message sent! We will contact you soon.';
      document.getElementById('cf-name').value = '';
      document.getElementById('cf-phone').value = '';
      document.getElementById('cf-msg').value = '';

    } catch(err) {
      console.error('EmailJS contact error:', err);
      const s = document.getElementById('cf-success');
      s.style.display = 'block';
      s.style.background = '#fde8e8';
      s.style.borderColor = '#c62828';
      s.style.color = '#c62828';
      s.textContent = '❌ Could not send message. Please call us at 7204416546 or contact us via WhatsApp.';
      setTimeout(() => { s.style.display = 'none'; s.style.background = ''; s.style.borderColor = ''; s.style.color = ''; }, 6000);
    }

    if (cfBtn) { cfBtn.disabled = false; cfBtn.textContent = 'Send Message ✉️'; }
    setTimeout(() => { document.getElementById('cf-success').style.display = 'none'; }, 5000);
  }