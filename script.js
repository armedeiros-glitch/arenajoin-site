(() => {
  'use strict';

  document.documentElement.classList.remove('no-js');

  const config = window.ARENAJOIN_CONFIG || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.page-progress span');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');

  const updateScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    header?.classList.toggle('is-scrolled', y > 18);
  };
  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });

  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menu?.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
  });
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });
    reveals.forEach((item) => observer.observe(item));
  }

  const optionalVideos = [...document.querySelectorAll('video[data-optional-media]')];
  optionalVideos.forEach((video) => {
    const wrapper = video.parentElement;
    let available = false;
    const ok = () => { available = true; wrapper?.classList.remove('media-missing'); };
    const missing = () => { if (!available) wrapper?.classList.add('media-missing'); };
    video.addEventListener('loadedmetadata', ok, { once: true });
    video.addEventListener('canplay', ok, { once: true });
    video.addEventListener('error', missing);
    setTimeout(() => { if (video.readyState === 0) missing(); }, 1400);
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && !video.parentElement?.classList.contains('media-missing')) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: .16 });
    optionalVideos.forEach((video) => videoObserver.observe(video));
  }

  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('input', () => {
      const d = input.value.replace(/\D/g, '').slice(0, 11);
      if (d.length <= 2) input.value = d;
      else if (d.length <= 7) input.value = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      else input.value = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    });
  });

  const submitForm = async (form) => {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    status?.classList.remove('is-success', 'is-error');

    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) { status.textContent = 'Confira os campos obrigatórios.'; status.classList.add('is-error'); }
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return;
    const payload = { ...data, tipo: form.dataset.formKind || 'contato', origem: location.href, enviadoEm: new Date().toISOString() };
    const original = button?.textContent;
    if (button) { button.disabled = true; button.textContent = 'Enviando...'; }
    if (status) status.textContent = '';

    try {
      const response = await fetch(config.formEndpoint || '/api/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Não foi possível enviar agora.');
      form.reset();
      if (status) { status.textContent = 'Contato registrado. Obrigado por fazer parte da construção da ArenaJoin.'; status.classList.add('is-success'); }
    } catch (error) {
      if (status) { status.textContent = error.message || 'Não foi possível enviar. Tente novamente.'; status.classList.add('is-error'); }
    } finally {
      if (button) { button.disabled = false; button.textContent = original || 'Enviar contato'; }
    }
  };

  document.querySelectorAll('form[data-form-kind]').forEach((form) => {
    form.addEventListener('submit', (event) => { event.preventDefault(); submitForm(form); });
  });

  document.querySelectorAll('[data-current-year]').forEach((node) => { node.textContent = String(new Date().getFullYear()); });
  document.querySelectorAll('[data-placeholder-link]').forEach((link) => {
    const href = config.links?.[link.dataset.placeholderLink];
    if (href) { link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    else { link.addEventListener('click', (event) => event.preventDefault()); link.setAttribute('aria-disabled', 'true'); link.title = 'Canal oficial ainda não definido.'; }
  });
})();
