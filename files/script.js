/* ==========================================================================
   BETU'S 18TH — MAIN SCRIPT
   Sections: Content data → Loader → Intro → Ambient FX → Lenis/GSAP →
             Per-page interactions → Countdown/Birthday-mode → Final page
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     0. CONTENT DATA — edit the words here any time, the layout adapts
  ------------------------------------------------------------------ */
  const TIMELINE = [
    { label: "Chapter one", emoji: "✨", title: "The beginning", text: "Two paths crossed without any plan, and somehow that ordinary day became one I still remember." },
    { label: "Chapter two", emoji: "😂", title: "Random conversations", text: "Somewhere between the nonsense and the overthinking, talking to you became my favourite habit." },
    { label: "Chapter three", emoji: "🌸", title: "Late night talks", text: "The hours when the world went quiet were somehow the ones where everything felt clearest." },
    { label: "Chapter four", emoji: "🤍", title: "Little fights", text: "Even the small misunderstandings taught me how much I didn't want to lose this." },
    { label: "Chapter five", emoji: "🌙", title: "Understanding each other", text: "No performance, no pretending — just two people slowly learning how to show up for one another." },
    { label: "Chapter six", emoji: "💕", title: "Here, now", text: "Every version of you I've met so far has been worth knowing. Here's to the ones still ahead." },
  ];

  const REASONS = [
    "Your smile", "Your laugh", "Your kindness", "Your maturity", "Your innocence",
    "Your loyalty", "Your caring nature", "Your childish side", "Your confidence",
    "Your strength", "Your honesty", "Your positivity", "Your smile even after getting angry",
    "Your random bakchodi", "Your patience", "Your dreams", "Your beautiful heart",
    "Your curiosity about everything",
  ];

  const GALLERY = [
    { seed: "betu-1", cap: "that one day" },
    { seed: "betu-2", cap: "just us being us" },
    { seed: "betu-3", cap: "the laugh I love" },
    { seed: "betu-4", cap: "a quiet moment" },
    { seed: "betu-5", cap: "somewhere, sometime" },
    { seed: "betu-6", cap: "a memory worth keeping" },
  ];

  const ENVELOPE_NOTES = [
    "You deserve happiness.", "Never stop smiling.", "You make people's lives brighter.",
    "You deserve every dream you're chasing.", "Keep believing in yourself.",
    "Krishna bless you, always.", "You are stronger than you know.",
    "Your kindness is rare — protect it.", "The world is lucky to have you in it.",
    "Never dim your light for anyone.", "You're allowed to outgrow people and places.",
    "Your feelings are always valid.", "Rest when you need to. You're doing fine.",
    "You are worthy of everything good.", "Trust your journey, it's unfolding perfectly.",
    "Your laugh is somebody's favourite sound.", "Be proud of how far you've come.",
    "You are loved more than you know.",
  ];

  const GIFT_WISHES = [
    "A year full of laughter that reaches your eyes.", "Every sunrise bringing a little more confidence.",
    "A heart that stays this soft, always protected.", "Friends who feel like home.",
    "Dreams that grow bigger than your doubts.", "A mind at peace, even on the loud days.",
    "Endless random bakchodi and inside jokes.", "Courage for every new beginning.",
    "A family that keeps cheering for you.", "Health that lets you chase everything you want.",
    "Patience with yourself on the hard days.", "A future you're proud to have built.",
    "More reasons to smile than to worry.", "The confidence to take up all the space you need.",
    "Someone who understands you without explanations.", "Krishna's blessings, quietly and always.",
    "A life as beautiful as your heart.", "Eighteen years down, infinite more to go.",
  ];

  const LETTER = [
    "I don't really know how to start this, so I'll just start with thank you.",
    "Thank you for the day we first started talking, back when neither of us knew this would turn into something worth writing a whole letter about.",
    "Somewhere between the random conversations and the long, unnecessary debates about nothing, you became one of the most comfortable parts of my life.",
    "We've grown a lot since then — some of it side by side, some of it in our own separate ways — but every version of you along the way has been one I'm glad I got to know.",
    "I've laughed more because of you, learned more from you than I probably tell you, and I'm genuinely thankful for every ordinary memory we've collected without even trying.",
    "I'm not writing this to make today feel bigger than it needs to — I just wanted you to know, clearly, that I'm grateful you exist, and that I'm always praying for your happiness.",
    "So here's to your dreams turning real, one by one — and to a smile that I hope never has a real reason to fade.",
  ];

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const PREFERS_REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IS_FINE_POINTER = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const IS_SMALL_SCREEN = matchMedia("(max-width: 640px)").matches;

  /* ------------------------------------------------------------------
     1. STARFIELD CANVAS (shared helper — loader / intro / memory sky)
  ------------------------------------------------------------------ */
  function starfield(canvas, opts) {
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    const settings = Object.assign({ density: 0.00025, twinkle: true }, opts);
    let stars = [];
    let w, h, raf = null;
    let resizeTimer;

    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      const count = Math.max(40, Math.floor(w * h * settings.density));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 * devicePixelRatio + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
      }));
    }
    function debouncedResize() { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() * 0.001;
      stars.forEach((s) => {
        const a = settings.twinkle ? 0.4 + Math.abs(Math.sin(t * s.speed * 10 + s.phase)) * 0.6 : 0.8;
        ctx.beginPath();
        ctx.fillStyle = `rgba(251,246,241,${a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }

    resize();
    if (!PREFERS_REDUCED) draw(); else { ctx.clearRect(0, 0, w, h); }
    window.addEventListener("resize", debouncedResize);

    return {
      pause() { if (raf) { cancelAnimationFrame(raf); raf = null; } },
      resume() { if (!raf && !PREFERS_REDUCED) draw(); },
      destroy() { cancelAnimationFrame(raf); window.removeEventListener("resize", debouncedResize); },
    };
  }

  const loaderStarsCtl = starfield($("#loaderStars"));
  const introStarsCtl = starfield($("#introStars"), { density: 0.00035 });

  /* ------------------------------------------------------------------
     2. LOADER
  ------------------------------------------------------------------ */
  const loader = $("#loader");
  const loaderFill = $("#loaderFill");
  const loaderPercent = $("#loaderPercent");

  function runLoader() {
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const MIN_VISIBLE_MS = 2200; // long enough to feel intentional, not stalled
    const start = performance.now();
    let done = false;

    function easeOutQuint(t) { return 1 - Math.pow(1 - t, 5); }

    function frame(now) {
      const t = Math.min(1, (now - start) / MIN_VISIBLE_MS);
      const pct = Math.floor(easeOutQuint(t) * 100);
      loaderFill.style.width = pct + "%";
      loaderPercent.textContent = pct + "%";
      if (t < 1) {
        requestAnimationFrame(frame);
      } else if (!done) {
        done = true;
        Promise.race([fontsReady, new Promise((r) => setTimeout(r, 900))]).then(() => {
          loaderFill.style.width = "100%";
          loaderPercent.textContent = "100%";
          setTimeout(() => {
            loader.classList.add("is-hidden");
            startIntroSequence();
            setTimeout(() => loaderStarsCtl && loaderStarsCtl.pause(), 1200);
          }, 350);
        });
      }
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === "complete") runLoader();
  else window.addEventListener("load", runLoader);
  // Safety net in case some CDN script stalls the load event
  setTimeout(() => { if (!loader.classList.contains("is-hidden") && loaderPercent.textContent === "0%") runLoader(); }, 4000);

  /* ------------------------------------------------------------------
     3. INTRO — sequential typewriter reveal
  ------------------------------------------------------------------ */
  const introLines = [
    "Happy 18th Birthday ❤️",
    "To the girl\nwho fills every room\nwith a little more light,",
    "and somehow made an ordinary friendship\nfeel like one of the best parts of my life.",
    "— made with love,\njust for you 🦋",
  ];
  const introTextEl = $("#introText");
  const introCta = $("#openJourneyBtn");
  let introStarted = false;

  function typeLine(text, el) {
    return new Promise((resolve) => {
      let i = 0;
      el.textContent = "";
      el.style.opacity = "1";
      const speed = 42;
      const interval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(resolve, 950);
        }
      }, speed);
    });
  }

  function fadeOutIn(el) {
    return new Promise((resolve) => {
      el.style.transition = "opacity .5s ease";
      el.style.opacity = "0";
      setTimeout(resolve, 520);
    });
  }

  async function startIntroSequence() {
    if (introStarted) return;
    introStarted = true;
    for (let i = 0; i < introLines.length; i++) {
      await typeLine(introLines[i], introTextEl);
      if (i < introLines.length - 1) await fadeOutIn(introTextEl);
    }
    introCta.classList.add("is-visible");
  }

  /* ------------------------------------------------------------------
     4. OPEN THE JOURNEY → reveal main site
  ------------------------------------------------------------------ */
  const intro = $("#intro");
  const site = $("#site");
  const soundHint = $("#soundHint");

  introCta.addEventListener("click", () => {
    site.hidden = false;
    document.body.classList.add("no-scroll");
    if (window.gsap) {
      gsap.to(intro, {
        opacity: 0, duration: 1, ease: "power2.inOut",
        onComplete: () => {
          intro.style.display = "none";
          document.body.classList.remove("no-scroll");
          introStarsCtl && introStarsCtl.pause();
          initSiteExperience();
        },
      });
    } else {
      intro.style.display = "none";
      document.body.classList.remove("no-scroll");
      introStarsCtl && introStarsCtl.pause();
      initSiteExperience();
    }
    attemptMusicPlay();
  });

  soundHint.addEventListener("click", attemptMusicPlay);

  /* ------------------------------------------------------------------
     5. MUSIC PLAYER
  ------------------------------------------------------------------ */
  const bgMusic = $("#bgMusic");
  const musicToggle = $("#musicToggle");
  const musicVolume = $("#musicVolume");
  const musicIndicator = $("#musicIndicator");
  bgMusic.volume = 0.4;

  function setMusicPlayingUI(isPlaying) {
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicIndicator.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
  }

  function attemptMusicPlay() {
    bgMusic.play().then(() => {
      setMusicPlayingUI(true);
      soundHint.style.display = "none";
    }).catch(() => { /* autoplay blocked — user can use the toggle */ });
  }

  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => setMusicPlayingUI(true)).catch(() => {});
    } else {
      bgMusic.pause();
      setMusicPlayingUI(false);
    }
  });
  musicVolume.addEventListener("input", (e) => { bgMusic.volume = parseFloat(e.target.value); });

  /* ------------------------------------------------------------------
     6. CURSOR GLOW + MOUSE TRAIL
  ------------------------------------------------------------------ */
  const cursorGlow = $("#cursorGlow");
  let mouseX = innerWidth / 2, mouseY = innerHeight / 2, glowX = mouseX, glowY = mouseY;
  window.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  (function glowLoop() {
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%,-50%)`;
    requestAnimationFrame(glowLoop);
  })();

  /* ------------------------------------------------------------------
     7. SITE INITIALISATION (runs once, after journey opens)
  ------------------------------------------------------------------ */
  let siteInitialised = false;
  function initSiteExperience() {
    if (siteInitialised) return;
    siteInitialised = true;

    initLenisAndScrollTrigger();
    initParticlesBackground();
    initAmbientFX();
    initChapterUnlock();
    initMagneticButtons();
    initCursorTrail();
    initChapterProgress();
    initCountdownBanner();
    initHeroPage();
    buildTimeline();
    buildReasons();
    buildGallery();
    buildEnvelopes();
    buildLetter();
    buildGifts();
    initMemorySky();
    initFinalPage();

    if (window.AOS) { AOS.init({ duration: 700, once: true, offset: 60 }); setTimeout(() => AOS.refresh(), 300); }
  }

  /* ---- magnetic buttons: nudge toward the cursor within a small radius ---- */
  function initMagneticButtons() {
    if (!IS_FINE_POINTER || PREFERS_REDUCED || !window.gsap) return;
    $$(".btn").forEach((btn) => {
      btn.classList.add("is-magnetic");
      const moveX = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
      const moveY = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        moveX((e.clientX - (r.left + r.width / 2)) * 0.28);
        moveY((e.clientY - (r.top + r.height / 2)) * 0.28);
      });
      btn.addEventListener("mouseleave", () => { moveX(0); moveY(0); });
      btn.addEventListener("mouseenter", () => spawnSparkles(btn));
    });
  }

  /* ---- soft trailing cursor dots, following the main glow with lag ---- */
  function initCursorTrail() {
    if (!IS_FINE_POINTER || PREFERS_REDUCED) return;
    const dots = Array.from({ length: 4 }, () => {
      const d = document.createElement("div");
      d.className = "cursor-dot";
      document.body.appendChild(d);
      return { el: d, x: mouseX, y: mouseY };
    });
    (function trailLoop() {
      let px = mouseX, py = mouseY;
      dots.forEach((d, i) => {
        d.x += (px - d.x) * 0.28;
        d.y += (py - d.y) * 0.28;
        d.el.style.opacity = String(0.5 - i * 0.11);
        d.el.style.transform = `translate(${d.x}px, ${d.y}px) translate(-50%,-50%)`;
        px = d.x; py = d.y;
      });
      requestAnimationFrame(trailLoop);
    })();
  }

  /* ---- tiny red sparkles on hover (desktop only) ---- */
  function spawnSparkles(el) {
    if (!IS_FINE_POINTER || PREFERS_REDUCED) return;
    const r = el.getBoundingClientRect();
    const count = 4;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "sparkle";
      s.style.left = (r.left + Math.random() * r.width) + "px";
      s.style.top = (r.top + Math.random() * r.height) + "px";
      s.style.animationDelay = (i * 60) + "ms";
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  }

  /* ---- Lenis + GSAP ScrollTrigger ---- */
  function initLenisAndScrollTrigger() {
    if (!window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      const lenis = new Lenis({
        smoothWheel: true,
        smoothTouch: false, // native touch scroll feels better and saves battery on mobile
        duration: PREFERS_REDUCED ? 0.4 : 1.25,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ---- particles.js ambient background ---- */
  function initParticlesBackground() {
    if (!window.particlesJS || IS_SMALL_SCREEN || PREFERS_REDUCED) return;
    particlesJS("particles-bg", {
      particles: {
        number: { value: 55, density: { enable: true, value_area: 900 } },
        color: { value: ["#b11226", "#5c0011", "#e2264a"] },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 2.4, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.4, direction: "top", random: true, straight: false, out_mode: "out" },
      },
      interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "bubble" }, resize: true },
        modes: { bubble: { distance: 120, size: 3.5, duration: 2, opacity: 0.8 } },
      },
      retina_detect: true,
    });
  }

  /* ---- ambient fireflies / hearts / butterflies ----
     A capped, tab-aware spawner: fewer particles on small screens, none while
     the tab is hidden, and never more than a handful alive at once — the
     scene should feel alive, not like it's costing anything to run. */
  function initAmbientFX() {
    if (PREFERS_REDUCED) return;

    const scale = IS_SMALL_SCREEN ? 0.45 : 1;
    const layers = {
      firefly: { el: $("#fireflies"), max: Math.round(7 * scale), every: 1100 },
      heart: { el: $("#floatPetals"), max: Math.round(4 * scale), every: 2600 },
      butterfly: { el: $("#floatButterflies"), max: Math.round(2 * scale), every: 6000 },
    };
    const builders = {
      firefly() {
        const el = document.createElement("div");
        el.className = "firefly";
        el.style.left = Math.random() * 100 + "vw";
        el.style.top = Math.random() * 100 + "vh";
        el.style.setProperty("--fx", (Math.random() * 60 - 30) + "px");
        el.style.setProperty("--fy", (Math.random() * -80 - 20) + "px");
        el.style.setProperty("--fx2", (Math.random() * 80 - 40) + "px");
        el.style.setProperty("--fy2", (Math.random() * -140 - 60) + "px");
        el.style.animationDuration = 6 + Math.random() * 5 + "s";
        return el;
      },
      heart() {
        const el = document.createElement("div");
        el.className = "float-petal";
        el.style.left = Math.random() * 100 + "vw";
        el.style.setProperty("--sz", 9 + Math.random() * 10 + "px");
        el.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
        el.style.setProperty("--drift2", (Math.random() * 140 - 70) + "px");
        el.style.animationDuration = 11 + Math.random() * 9 + "s";
        return el;
      },
      butterfly() {
        const el = document.createElement("div");
        el.className = "float-butterfly";
        el.textContent = "🦋";
        el.style.left = Math.random() * 100 + "vw";
        el.style.setProperty("--sz", 14 + Math.random() * 10 + "px");
        el.style.setProperty("--drift", (Math.random() * 140 - 70) + "px");
        el.style.setProperty("--drift2", (Math.random() * 160 - 80) + "px");
        el.style.animationDuration = 12 + Math.random() * 6 + "s";
        return el;
      },
    };

    const timers = [];
    Object.entries(layers).forEach(([kind, cfg]) => {
      let alive = 0;
      const timer = setInterval(() => {
        if (document.hidden || alive >= cfg.max) return;
        alive++;
        const el = builders[kind]();
        cfg.el.appendChild(el);
        const lifespan = (parseFloat(el.style.animationDuration) || 12) * 1000 + 300;
        setTimeout(() => { el.remove(); alive--; }, lifespan);
      }, cfg.every);
      timers.push(timer);
    });

    document.addEventListener("visibilitychange", () => {
      // clears any layer entirely on tab-hide so nothing keeps animating unseen
      if (document.hidden) {
        Object.values(layers).forEach((cfg) => { cfg.el.innerHTML = ""; });
      }
    });
  }

  /* ---- story unlock: chapter badges + curtain reveal per section ---- */
  function initChapterUnlock() {
    const pages = $$(".page", $("#site"));
    pages.forEach((page, i) => {
      const badge = document.createElement("div");
      badge.className = "chapter-badge";
      badge.innerHTML = `<span class="chapter-badge__num">${String(i + 1).padStart(2, "0")}</span><span class="chapter-badge__line"></span><span>${page.dataset.chapter || ""}</span>`;
      page.prepend(badge);
    });

    // the hero is already "open" the moment the journey begins
    $("#page1").classList.add("is-unlocked");

    if (PREFERS_REDUCED) {
      pages.forEach((p) => p.classList.add("is-unlocked"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-unlocked");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.22 });
    pages.forEach((p) => io.observe(p));
  }

  /* ---- chapter progress rail ---- */
  function initChapterProgress() {
    const fill = $("#chapterFill");
    window.addEventListener("scroll", () => {
      const scrollable = document.documentElement.scrollHeight - innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      fill.style.height = Math.min(100, Math.max(0, pct)) + "%";
    }, { passive: true });
  }

  /* ---- countdown / birthday-mode banner ---- */
  function initCountdownBanner() {
    const banner = $("#statusBanner");
    function update() {
      const now = new Date();
      let target = new Date(now.getFullYear(), 7, 12, 0, 0, 0); // August is month index 7
      if (now - target > 0 && !(now.getMonth() === 7 && now.getDate() === 12)) {
        target = new Date(now.getFullYear() + 1, 7, 12, 0, 0, 0);
      }
      const isBirthday = now.getMonth() === 7 && now.getDate() === 12;
      if (isBirthday) {
        document.body.classList.add("birthday-mode");
        banner.textContent = "It's her birthday today 🎂✨ Happy 18th, Betu ❤️";
      } else {
        const diffMs = target - now;
        const days = Math.ceil(diffMs / 86400000);
        banner.textContent = `${days} day${days === 1 ? "" : "s"} until Betu turns 18 ✦`;
      }
    }
    update();
    setInterval(update, 60 * 60 * 1000);
  }

  /* ---- PAGE 1: hero cinematic entrance ---- */
  function initHeroPage() {
    const canvas = $("#heroConfetti");
    canvas.width = innerWidth; canvas.height = innerHeight;
    window.addEventListener("resize", () => { canvas.width = innerWidth; canvas.height = innerHeight; });

    if (window.gsap) {
      gsap.from(".reveal-line", { yPercent: 120, opacity: 0, duration: 1, stagger: 0.25, ease: "power3.out", delay: 0.2 });
      gsap.from(".hero-page__cake", { scale: 0.4, opacity: 0, duration: 1, ease: "back.out(1.6)", delay: 0.1 });
    }

    if (window.Typed) {
      new Typed(".hero-page__age", { strings: ["Eighteen years of you."], typeSpeed: 45, showCursor: false });
    }

    // balloons
    const balloonColors = ["#8b0000", "#b11226", "#5c0011", "#e2264a"];
    const balloonLayer = $("#heroBalloons");
    for (let i = 0; i < 10; i++) {
      const b = document.createElement("div");
      b.className = "balloon";
      b.style.left = Math.random() * 100 + "%";
      b.style.background = `radial-gradient(circle at 30% 25%, #fff8, ${balloonColors[i % balloonColors.length]})`;
      b.style.animationDuration = 9 + Math.random() * 6 + "s";
      b.style.animationDelay = Math.random() * 6 + "s";
      b.style.setProperty("--bx", (Math.random() * 100 - 50) + "px");
      balloonLayer.appendChild(b);
    }

    if (window.confetti) {
      const myConfetti = confetti.create(canvas, { resize: true });
      setTimeout(() => {
        myConfetti({ particleCount: 140, spread: 100, origin: { y: 0.4 }, colors: balloonColors });
      }, 500);
    }

    $$('[data-scroll-next]').forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.closest(".page").nextElementSibling;
        if (next) next.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /* ---- PAGE 2: timeline ---- */
  function buildTimeline() {
    const wrap = $("#timelineList");
    TIMELINE.forEach((item, i) => {
      const el = document.createElement("div");
      el.className = "timeline-item";
      el.setAttribute("data-aos", "fade-up");
      el.setAttribute("data-aos-delay", String((i % 4) * 80));
      el.innerHTML = `
        <p class="timeline-item__label">${item.label}</p>
        <h3 class="timeline-item__title">${item.emoji} ${item.title}</h3>
        <p class="timeline-item__text">${item.text}</p>`;
      wrap.appendChild(el);
    });
  }

  /* ---- PAGE 3: 18 reason flip cards ---- */
  function buildReasons() {
    const grid = $("#reasonsGrid");
    REASONS.forEach((reason, i) => {
      const card = document.createElement("div");
      card.className = "reason-card";
      card.setAttribute("data-aos", "zoom-in");
      card.setAttribute("data-aos-delay", String((i % 6) * 60));
      card.innerHTML = `
        <div class="reason-card__inner">
          <div class="reason-card__face reason-card__face--front"><span class="reason-card__num">${String(i + 1).padStart(2, "0")} ✦</span></div>
          <div class="reason-card__face reason-card__face--back">${reason}</div>
        </div>`;
      card.addEventListener("click", () => card.classList.toggle("is-flipped"));
      card.addEventListener("mouseenter", () => spawnSparkles(card));
      grid.appendChild(card);
    });
  }

  /* ---- PAGE 4: gallery + lightbox ---- */
  function buildGallery() {
    const grid = $("#galleryGrid");
    GALLERY.forEach((photo, i) => {
      const url = `https://picsum.photos/seed/${photo.seed}/500/620`;
      const fig = document.createElement("div");
      fig.className = "polaroid";
      fig.style.setProperty("--rot", (Math.random() * 8 - 4) + "deg");
      fig.setAttribute("data-aos", "fade-up");
      fig.setAttribute("data-aos-delay", String((i % 6) * 70));
      fig.innerHTML = `<div class="polaroid__frame"><img src="${url}" alt="Placeholder photo — replace with a real memory" loading="lazy" decoding="async"></div><p class="polaroid__cap">${photo.cap}</p>`;
      fig.addEventListener("click", () => openLightbox(url, photo.cap));
      fig.addEventListener("mouseenter", () => spawnSparkles(fig));
      grid.appendChild(fig);
    });
  }

  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");
  function openLightbox(src, cap) {
    lightboxImg.src = src;
    lightboxCaption.textContent = cap;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-active"));
  }
  function closeLightbox() {
    lightbox.classList.remove("is-active");
    setTimeout(() => { lightbox.hidden = true; }, 450);
  }
  $("#lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });

  /* ---- PAGE 5: envelopes ---- */
  function buildEnvelopes() {
    const grid = $("#envelopesGrid");
    ENVELOPE_NOTES.forEach((note, i) => {
      const env = document.createElement("div");
      env.className = "envelope";
      env.innerHTML = `
        <div class="envelope__body">
          <div class="envelope__flap"></div>
          <span class="envelope__num">${i + 1}</span>
        </div>
        <div class="envelope__note">${note}</div>`;
      env.addEventListener("click", () => env.classList.toggle("is-open"));
      env.addEventListener("mouseenter", () => spawnSparkles(env));
      grid.appendChild(env);
    });

    $("#revealEnvelopesBtn").addEventListener("click", () => {
      $("#envelopesIntro").style.display = "none";
      grid.hidden = false;
      if (window.gsap) {
        gsap.from(".envelope", { opacity: 0, y: 24, scale: 0.85, duration: 0.6, stagger: 0.05, ease: "back.out(1.5)" });
      }
      if (window.confetti) confetti({ particleCount: 80, spread: 90, origin: { y: 0.3 } });
    });
  }

  /* ---- PAGE 6: letter, sequential reveal ---- */
  function buildLetter() {
    const body = $("#letterBody");
    LETTER.forEach((para) => {
      const p = document.createElement("p");
      p.textContent = para;
      body.appendChild(p);
    });
    const paras = $$("p", body);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          paras.forEach((p, i) => setTimeout(() => p.classList.add("is-in"), i * 350));
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(body);
  }

  /* ---- PAGE 7: 18 gifts ---- */
  function buildGifts() {
    const grid = $("#giftsGrid");
    GIFT_WISHES.forEach((wish, i) => {
      const gift = document.createElement("div");
      gift.className = "gift";
      gift.innerHTML = `
        <div class="gift__closed">🎁</div>
        <div class="gift__open">${wish}</div>
        <span class="gift__num">${i + 1}</span>`;
      gift.addEventListener("click", () => {
        const wasOpen = gift.classList.contains("is-open");
        gift.classList.toggle("is-open");
        if (!wasOpen && window.confetti) {
          const rect = gift.getBoundingClientRect();
          confetti({
            particleCount: 30, spread: 60, startVelocity: 22,
            origin: { x: (rect.left + rect.width / 2) / innerWidth, y: (rect.top + rect.height / 2) / innerHeight },
          });
        }
      });
      gift.addEventListener("mouseenter", () => spawnSparkles(gift));
      grid.appendChild(gift);
    });
  }

  /* ---- PAGE 8: memory sky ---- */
  function initMemorySky() {
    const skyCtl = starfield($("#skyStars"), { density: 0.0004 });
    const layer = $("#lanterns");
    let lanternTimer = null;

    function spawnLantern() {
      const l = document.createElement("div");
      l.className = "lantern";
      l.style.left = Math.random() * 100 + "vw";
      l.style.setProperty("--lx", (Math.random() * 100 - 50) + "px");
      l.style.animationDuration = 14 + Math.random() * 8 + "s";
      layer.appendChild(l);
      setTimeout(() => l.remove(), 24000);
    }
    function startLanterns() { if (!lanternTimer && !PREFERS_REDUCED) lanternTimer = setInterval(spawnLantern, 1800); }
    function stopLanterns() { clearInterval(lanternTimer); lanternTimer = null; }

    // only animate this page's canvas + lanterns while it's actually on screen
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { skyCtl && skyCtl.resume(); startLanterns(); }
        else { skyCtl && skyCtl.pause(); stopLanterns(); }
      });
    }, { threshold: 0.1 });
    io.observe($("#page8"));
  }

  /* ---- FINAL PAGE ---- */
  function initFinalPage() {
    const box = $("#finalGiftBox");
    const message = $("#finalMessage");
    box.addEventListener("click", () => {
      if (box.classList.contains("is-open")) return;
      box.classList.add("is-open");
      if (window.confetti) {
        confetti({ particleCount: 200, spread: 130, origin: { y: 0.5 }, colors: ["#8b0000", "#b11226", "#5c0011", "#e2264a", "#f2e4e2"] });
      }
      setTimeout(() => { message.hidden = false; }, 500);
    });

    $("#replayBtn").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      location.reload();
    });
  }
})();
