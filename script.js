(() => {
  'use strict';

  document.documentElement.classList.remove('no-js');

  const config = window.ARENAJOIN_CONFIG || {};
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.page-progress span');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');
  const cursorLight = document.querySelector('.cursor-light');

  const updateScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${height > 0 ? (scrollTop / height) * 100 : 0}%`;
    header?.classList.toggle('is-scrolled', scrollTop > 24);
  };

  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  if (cursorLight && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      cursorLight.style.left = `${event.clientX}px`;
      cursorLight.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menu?.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const optionalVideos = [...document.querySelectorAll('video[data-optional-media]')];
  optionalVideos.forEach((video) => {
    const wrapper = video.parentElement;
    let sourceSucceeded = false;

    const markAvailable = () => {
      sourceSucceeded = true;
      wrapper?.classList.remove('media-missing');
    };
    const markMissing = () => {
      if (!sourceSucceeded) wrapper?.classList.add('media-missing');
    };

    video.addEventListener('loadedmetadata', markAvailable, { once: true });
    video.addEventListener('canplay', markAvailable, { once: true });
    video.addEventListener('error', markMissing);
    window.setTimeout(() => {
      if (video.readyState === 0) markMissing();
    }, 1600);
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting && !video.parentElement?.classList.contains('media-missing')) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.2 });
    optionalVideos.forEach((video) => videoObserver.observe(video));
  }

  const heroVideo = document.querySelector('.hero-video');
  const soundControl = document.querySelector('.sound-control');
  if (heroVideo && soundControl) {
    heroVideo.addEventListener('loadedmetadata', () => {
      if (heroVideo.duration > 0 && !reduceMotion) soundControl.hidden = false;
    }, { once: true });
    soundControl.addEventListener('click', () => {
      const active = soundControl.getAttribute('aria-pressed') === 'true';
      heroVideo.muted = active;
      soundControl.setAttribute('aria-pressed', String(!active));
      const label = soundControl.querySelector('.sound-label');
      if (label) label.textContent = active ? 'Ativar som' : 'Desativar som';
      if (!active) heroVideo.play().catch(() => {});
    });
  }

  const dialog = document.getElementById('partner-dialog');
  const dialogInterest = dialog?.querySelector('select[name="interesse"]');
  const openDialog = (interest = '') => {
    if (!dialog) return;
    if (interest && dialogInterest) {
      const matchingOption = [...dialogInterest.options].find((option) => option.textContent?.toLowerCase() === interest.toLowerCase());
      if (matchingOption) dialogInterest.value = matchingOption.value;
    }
    if (typeof dialog.showModal === 'function') dialog.showModal();
  };

  document.querySelectorAll('[data-open-dialog]').forEach((button) => {
    button.addEventListener('click', () => openDialog(button.dataset.interest || ''));
  });
  document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => dialog?.close()));
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll('[data-scroll-interest]').forEach((button) => {
    button.addEventListener('click', () => {
      const interest = button.dataset.scrollInterest || '';
      const select = document.querySelector('#lead-form select[name="interesse"]');
      if (select) {
        const match = [...select.options].find((option) => option.textContent === interest);
        if (match) select.value = match.value;
      }
      document.getElementById('novidades')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  const normalizePhone = (input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      const digits = input.value.replace(/\D/g, '').slice(0, 11);
      if (digits.length <= 2) input.value = digits;
      else if (digits.length <= 7) input.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      else input.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    });
  };
  document.querySelectorAll('input[type="tel"]').forEach(normalizePhone);

  const submitForm = async (form) => {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());

    status?.classList.remove('is-success', 'is-error');
    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) {
        status.textContent = 'Confira os campos obrigatórios.';
        status.classList.add('is-error');
      }
      return;
    }
    if (data.website) return;

    const payload = {
      ...data,
      tipo: form.dataset.formKind || 'contato',
      origem: window.location.href,
      enviadoEm: new Date().toISOString()
    };

    const endpoint = config.formEndpoint || '/api/submit';
    const originalText = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = 'Enviando...';
    }
    if (status) status.textContent = '';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Não foi possível enviar agora.');

      form.reset();
      if (status) {
        status.textContent = 'Interesse registrado. Obrigado por acompanhar a construção da ArenaJoin.';
        status.classList.add('is-success');
      }
      if (form.id === 'partner-form') window.setTimeout(() => dialog?.close(), 1800);
    } catch (error) {
      if (status) {
        status.textContent = error.message || 'Não foi possível enviar. Tente novamente em instantes.';
        status.classList.add('is-error');
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = originalText || 'Enviar';
      }
    }
  };

  document.querySelectorAll('form[data-form-kind]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitForm(form);
    });
  });

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll('[data-placeholder-link]').forEach((link) => {
    const key = link.dataset.placeholderLink;
    const href = config.links?.[key];
    if (href) {
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    } else {
      link.addEventListener('click', (event) => event.preventDefault());
      link.setAttribute('aria-disabled', 'true');
      link.title = 'Link será adicionado quando o canal oficial estiver definido.';
    }
  });
})();
