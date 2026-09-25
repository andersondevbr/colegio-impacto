(function () {
  'use strict';

  var WA_NUMBER = '5588993546223';
  var WA_DEFAULT = 'Olá! Vim pelo site e quero saber mais sobre as matrículas.';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasIO = 'IntersectionObserver' in window;

  var header = document.querySelector('.header');
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var hero = document.querySelector('.hero');

  function waLink(msg) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg || WA_DEFAULT);
  }

  document.querySelectorAll('.js-wa').forEach(function (el) {
    el.href = waLink(el.dataset.msg);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  document.getElementById('ano').textContent = new Date().getFullYear();

  var navItems = Array.prototype.slice.call(nav.querySelectorAll('a'));

  function openMenu() {
    nav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    header.classList.remove('is-hidden');
    navItems[0].focus();
    setTimeout(function () {
      if (nav.classList.contains('is-open') && !nav.contains(document.activeElement)) navItems[0].focus();
    }, 60);
  }
  function closeMenu(restoreFocus) {
    if (!nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    if (restoreFocus) burger.focus();
  }
  burger.addEventListener('click', function () {
    if (nav.classList.contains('is-open')) closeMenu(false);
    else openMenu();
  });
  navItems.forEach(function (a) {
    a.addEventListener('click', function () { closeMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (!nav.classList.contains('is-open')) return;
    if (e.key === 'Escape') { closeMenu(true); return; }
    if (e.key !== 'Tab') return;
    var cycle = [burger].concat(navItems);
    var i = cycle.indexOf(document.activeElement);
    if (i === -1) return;
    e.preventDefault();
    cycle[(i + (e.shiftKey ? cycle.length - 1 : 1)) % cycle.length].focus();
  });

  var bar = document.getElementById('progress-bar');
  var toTop = document.getElementById('to-top');
  var toTopBar = toTop.querySelector('.to-top__bar');
  var RING = 132;
  var lastY = window.scrollY;
  var ticking = false;

  function onScrollFrame() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(y / max, 1) : 0;

    header.classList.toggle('is-scrolled', y > 10);
    bar.style.transform = 'scaleX(' + p + ')';
    toTopBar.style.strokeDashoffset = String(RING * (1 - p));
    toTop.classList.toggle('is-on', y > 600);

    var keepHeader = nav.classList.contains('is-open') || header.contains(document.activeElement);
    if (!reduce && !keepHeader && y > 400 && y > lastY + 4) header.classList.add('is-hidden');
    else if (y < lastY - 4 || y <= 400 || keepHeader) header.classList.remove('is-hidden');
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
  }, { passive: true });
  header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
  requestAnimationFrame(onScrollFrame);

  function animateCount(el) {
    var to = parseInt(el.dataset.to, 10);
    if (reduce) { el.textContent = to; return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1400, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * to);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var reveals = document.querySelectorAll('.reveal');
  if (hasIO) {
    if (!reduce) document.querySelectorAll('.js-count').forEach(function (el) { el.textContent = '0'; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-visible');
        el.querySelectorAll('.js-count').forEach(animateCount);
        setTimeout(function () { el.style.transitionDelay = ''; }, 1400);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) {
      var siblings = el.parentElement.querySelectorAll(':scope > .reveal');
      var idx = Array.prototype.indexOf.call(siblings, el);
      el.style.transitionDelay = Math.min(idx, 5) * 80 + 'ms';
      io.observe(el);
    });

    var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) {
      var s = document.querySelector(a.getAttribute('href'));
      if (s) navIo.observe(s);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }
  window.impactoPronto = true;

  var carousel = document.getElementById('carousel');
  function scrollCarousel(dir) {
    var card = carousel.querySelector('.approved');
    var gap = parseFloat(getComputedStyle(carousel).columnGap) || 18;
    var step = card.offsetWidth + gap;
    var max = carousel.scrollWidth - carousel.clientWidth - 4;
    var behavior = reduce ? 'auto' : 'smooth';
    if (dir > 0 && carousel.scrollLeft >= max) carousel.scrollTo({ left: 0, behavior: behavior });
    else if (dir < 0 && carousel.scrollLeft <= 0) carousel.scrollTo({ left: carousel.scrollWidth, behavior: behavior });
    else carousel.scrollBy({ left: dir * step, behavior: behavior });
  }
  document.querySelectorAll('.carousel__nav .round-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { scrollCarousel(parseInt(btn.dataset.dir, 10)); });
  });
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollCarousel(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollCarousel(-1); }
  });

  var userHolding = false;
  var carouselOnScreen = !hasIO;
  ['pointerenter', 'touchstart', 'focusin'].forEach(function (ev) {
    carousel.addEventListener(ev, function () { userHolding = true; }, { passive: true });
  });
  carousel.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') userHolding = false; });
  carousel.addEventListener('focusout', function () { userHolding = false; });
  if (hasIO) {
    new IntersectionObserver(function (entries) {
      carouselOnScreen = entries[0].isIntersecting;
    }, { threshold: 0.4 }).observe(carousel);
  }
  if (!reduce) {
    setInterval(function () {
      if (!userHolding && carouselOnScreen && !document.hidden) scrollCarousel(1);
    }, 4500);
  }

  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('figcaption');
  var lbClose = lb.querySelector('.lightbox__close');
  var lastFocus = null;
  var lbBackground = Array.prototype.filter.call(document.body.children, function (el) {
    return el !== lb && el.tagName !== 'SCRIPT';
  });

  function setBackgroundInert(on) {
    lbBackground.forEach(function (el) {
      if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });
  }
  function closeLb() {
    lb.hidden = true;
    setBackgroundInert(false);
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('.gallery__item').forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      var caption = item.dataset.caption || img.alt;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = caption;
      lb.setAttribute('aria-label', 'Foto ampliada: ' + caption);
      lastFocus = item;
      lb.hidden = false;
      setBackgroundInert(true);
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    });
  });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.closest('.lightbox__close')) closeLb();
  });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
  });

  var faqItems = document.querySelectorAll('.faq details');
  faqItems.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqItems.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  var form = document.getElementById('form-matricula');
  var errorEl = document.getElementById('form-error');
  var tel = form.elements.telefone;

  var DDDS = ('11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 44 45 46 47 48 49 ' +
    '51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99').split(' ');

  function phoneDigits(value) {
    var d = value.replace(/\D/g, '').replace(/^0+/, '');
    if (d.length > 11 && d.indexOf('55') === 0) d = d.slice(2);
    return d.slice(0, 11);
  }
  function phoneValid(d) {
    if (d.length !== 10 && d.length !== 11) return false;
    if (/^(\d)\1+$/.test(d)) return false;
    if (DDDS.indexOf(d.slice(0, 2)) === -1) return false;
    if (d.length === 11) return d.charAt(2) === '9';
    return '2345'.indexOf(d.charAt(2)) !== -1;
  }

  tel.addEventListener('input', function () {
    var d = phoneDigits(tel.value);
    var out = d;
    if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length > 6 && d.length <= 10) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    if (d.length === 11) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, 3) + ' ' + d.slice(3, 7) + '-' + d.slice(7);
    tel.value = out;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var invalid = [];
    ['responsavel', 'aluno', 'serie', 'telefone'].forEach(function (name) {
      var field = f[name];
      var ok = name === 'telefone'
        ? phoneValid(phoneDigits(field.value))
        : field.value.trim().length >= (name === 'serie' ? 1 : 2);
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      if (!ok) {
        void field.offsetWidth;
        field.classList.add('is-invalid');
        field.setAttribute('aria-invalid', 'true');
        invalid.push(field);
      }
    });
    if (invalid.length) {
      errorEl.textContent = invalid.length === 1 && invalid[0] === tel
        ? 'Informe um WhatsApp válido, com DDD. Exemplo: (88) 9 0000-0000.'
        : 'Preencha os campos destacados para continuar.';
      invalid[0].focus();
      return;
    }
    errorEl.textContent = '';

    var msg = 'Olá! Vim pelo site e quero fazer a pré-matrícula no Colégio Impacto.\n\n' +
      '*Responsável:* ' + f.responsavel.value.trim() + '\n' +
      '*Aluno(a):* ' + f.aluno.value.trim() + '\n' +
      '*Série:* ' + f.serie.value + '\n' +
      '*Telefone:* ' + f.telefone.value.trim();
    if (f.mensagem.value.trim()) msg += '\n*Mensagem:* ' + f.mensagem.value.trim();

    window.open(waLink(msg), '_blank', 'noopener');
  });
  form.querySelectorAll('input, select').forEach(function (el) {
    el.addEventListener('input', function () {
      el.classList.remove('is-invalid');
      el.removeAttribute('aria-invalid');
    });
  });

  var rotator = document.getElementById('rotator');
  if (rotator && !reduce) {
    var words = rotator.dataset.words.split('|');
    var wi = 0;
    setInterval(function () {
      if (document.hidden) return;
      rotator.classList.remove('is-in');
      rotator.classList.add('is-out');
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        rotator.textContent = words[wi];
        rotator.classList.remove('is-out');
        rotator.classList.add('is-in');
      }, 350);
    }, 2400);
  }

  var logoVideo = document.getElementById('logo-video');
  if (logoVideo && !reduce) {
    var playLogo = function () {
      var p = logoVideo.play();
      if (p && p.catch) p.catch(function () {});
    };
    logoVideo.muted = true;
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        if (logoVideo.ended) return;
        if (entries[0].isIntersecting) playLogo();
        else logoVideo.pause();
      }).observe(logoVideo);
    } else {
      playLogo();
    }
  }

  var depo = document.getElementById('depo-video');
  var depoPlay = document.getElementById('depo-play');
  if (depo && depoPlay) {
    depoPlay.addEventListener('click', function () {
      depo.controls = true;
      depoPlay.hidden = true;
      var p = depo.play();
      if (p && p.catch) p.catch(function () {});
      depo.focus();
    });
    depo.addEventListener('ended', function () {
      depo.controls = false;
      depo.load();
      depoPlay.hidden = false;
    });
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting && !depo.paused) depo.pause();
      }, { threshold: 0.25 }).observe(depo);
    }
  }

  var bubble = document.getElementById('wa-bubble');
  var bubbleSeen = false;
  try { bubbleSeen = sessionStorage.getItem('waBubble') === '1'; } catch (err) {}
  if (bubble && !bubbleSeen) {
    var bubbleTimer;
    var closeBubble = function () {
      clearTimeout(bubbleTimer);
      bubble.hidden = true;
      try { sessionStorage.setItem('waBubble', '1'); } catch (err) {}
    };
    bubbleTimer = setTimeout(function () {
      bubble.hidden = false;
      bubbleTimer = setTimeout(closeBubble, 12000);
    }, 6000);
    bubble.querySelector('.wa-bubble__close').addEventListener('click', closeBubble);
    document.querySelector('.wa-float').addEventListener('click', closeBubble);
  }

  if (reduce) return;

  var layers = Array.prototype.slice.call(hero.querySelectorAll('[data-depth]'));
  if (finePointer && layers.length) {
    var mx = 0, my = 0, cx = 0, cy = 0, rafP = null;
    var stepParallax = function () {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      layers.forEach(function (el) {
        var d = parseFloat(el.dataset.depth);
        el.style.translate = (-cx * d).toFixed(2) + 'px ' + (-cy * d).toFixed(2) + 'px';
      });
      rafP = (Math.abs(mx - cx) > 0.001 || Math.abs(my - cy) > 0.001) ? requestAnimationFrame(stepParallax) : null;
    };
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      if (!rafP) rafP = requestAnimationFrame(stepParallax);
    });
    hero.addEventListener('pointerleave', function () {
      mx = 0; my = 0;
      if (!rafP) rafP = requestAnimationFrame(stepParallax);
    });
  }

  if (finePointer) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var glare = document.createElement('span');
      glare.className = 'glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);

      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.classList.add('is-tilting');
        card.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - py) * 10).toFixed(2) + 'deg');
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });

    document.querySelectorAll('.btn--lg').forEach(function (btn) {
      btn.classList.add('is-magnetic');
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  var canvas = document.getElementById('constelacao');
  if (!canvas || !canvas.getContext) return;

  function startConstellation() {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, pts = [], running = false, visible = true, raf = null;
    var mouse = { x: -9999, y: -9999 };
    var LINK = 130;
    var MOUSE_R2 = 32000;

    function makePoints() {
      var count = Math.max(26, Math.min(80, Math.round(W * H / 15000)));
      pts = [];
      for (var i = 0; i < count; i++) {
        var roll = Math.random();
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: roll > 0.92 ? 2.6 : roll > 0.78 ? 1.9 : 1.3,
          c: roll > 0.92 ? '255,210,63' : roll > 0.78 ? '43,212,91' : '255,255,255',
          tw: Math.random() * Math.PI * 2
        });
      }
    }

    function resize() {
      var r = hero.getBoundingClientRect();
      var widthChanged = Math.round(r.width) !== Math.round(W);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      LINK = W < 600 ? 105 : 135;
      if (widthChanged || !pts.length) makePoints();
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, dx, dy, d2, alpha, L2 = LINK * LINK;

      for (i = 0; i < pts.length; i++) {
        a = pts[i];
        dx = mouse.x - a.x; dy = mouse.y - a.y; d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_R2) { a.vx += dx * 0.00003; a.vy += dy * 0.00003; }
        a.vx *= 0.995; a.vy *= 0.995;
        if (Math.abs(a.vx) < 0.05) a.vx += (Math.random() - 0.5) * 0.04;
        if (Math.abs(a.vy) < 0.05) a.vy += (Math.random() - 0.5) * 0.04;
        a.x += a.vx; a.y += a.vy;
        if (a.x < -20) a.x = W + 20; else if (a.x > W + 20) a.x = -20;
        if (a.y < -20) a.y = H + 20; else if (a.y > H + 20) a.y = -20;
      }

      ctx.lineWidth = 1;
      for (i = 0; i < pts.length; i++) {
        a = pts[i];
        for (j = i + 1; j < pts.length; j++) {
          b = pts[j];
          dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy;
          if (d2 < L2) {
            alpha = (1 - d2 / L2) * 0.28;
            ctx.strokeStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        dx = a.x - mouse.x; dy = a.y - mouse.y; d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_R2) {
          alpha = (1 - d2 / MOUSE_R2) * 0.7;
          ctx.strokeStyle = 'rgba(43,212,91,' + alpha.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }

      for (i = 0; i < pts.length; i++) {
        a = pts[i];
        a.tw += 0.03;
        alpha = 0.55 + Math.sin(a.tw) * 0.35;
        ctx.fillStyle = 'rgba(' + a.c + ',' + alpha.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
        if (a.r > 2) {
          ctx.fillStyle = 'rgba(' + a.c + ',' + (alpha * 0.18).toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(a.x, a.y, a.r * 4, 0, Math.PI * 2); ctx.fill();
        }
      }
      raf = running ? requestAnimationFrame(frame) : null;
    }

    function play() {
      if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); }
    }
    function pause() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    resize();
    canvas.classList.add('is-on');
    play();

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(resize, 200);
    });
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });

    if (hasIO) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) play(); else pause();
      }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause(); else play();
    });
  }

  function whenIdle(fn) {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1500 });
    else setTimeout(fn, 300);
  }
  if (document.readyState === 'complete') whenIdle(startConstellation);
  else window.addEventListener('load', function () { whenIdle(startConstellation); });
})();
