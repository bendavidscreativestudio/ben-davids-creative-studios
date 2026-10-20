(() => {
  const sidebar = document.getElementById('sidebar');
  const menu = document.getElementById('mobileMenu');
  const scrim = document.getElementById('mobileScrim');
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const sections = [...document.querySelectorAll('main section[id]')];

  function closeMenu() {
    sidebar.classList.remove('open');
    scrim.classList.remove('show');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
  }
  function openMenu() {
    sidebar.classList.add('open');
    scrim.classList.add('show');
    menu.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-label', 'Close navigation');
    document.body.classList.add('menu-open');
  }
  menu.addEventListener('click', () => sidebar.classList.contains('open') ? closeMenu() : openMenu());
  scrim.addEventListener('click', closeMenu);

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      if (link.hasAttribute('data-nav')) {
        navLinks.forEach(item => item.classList.toggle('active', item === link));
      }
      closeMenu();
      if (history.replaceState) history.replaceState(null, '', link.getAttribute('href'));
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const visibleId = entry.target.id;
      const navId = visibleId === 'home' || visibleId === 'about' ? 'home' : visibleId === 'services' ? 'services' : visibleId === 'contact' ? 'contact' : null;
      if (navId) navLinks.forEach(link => link.classList.toggle('active', link.dataset.nav === navId));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));

  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const select = document.getElementById('service');
      if (select) select.value = link.dataset.service;
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent('Website enquiry: ' + data.get('service'));
    const body = encodeURIComponent(
      'Name: ' + data.get('name') + '\\n' +
      'Email: ' + data.get('email') + '\\n' +
      'Phone: ' + (data.get('phone') || 'Not provided') + '\\n' +
      'Service: ' + data.get('service') + '\\n\\n' +
      'Project details:\\n' + data.get('message')
    );
    // Replace this sample address with the real business email before publishing.
    const recipient = 'hello@yourdomain.co.za';
    note.textContent = 'Your email app should open with the enquiry prepared. If it does not, email hello@yourdomain.co.za directly after replacing the sample address with your real business email.';
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  });
})();
