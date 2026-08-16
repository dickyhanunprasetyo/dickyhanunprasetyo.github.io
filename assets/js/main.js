/**
* MDHP Portfolio — DEVWORKSPACE
* Base: BootstrapMade Folio template (adapted)
* Vanilla JS, no framework
*/

(function () {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /**
   * Header scrolled state
   */
  function toggleScrolled() {
    const body = document.body;
    if (window.scrollY > 60) body.classList.add("scrolled");
    else body.classList.remove("scrolled");
  }
  document.addEventListener("scroll", toggleScrolled, { passive: true });
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToggle() {
    document.body.classList.toggle("mobile-nav-active");
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle("bi-list");
      mobileNavToggleBtn.classList.toggle("bi-x");
      mobileNavToggleBtn.setAttribute(
        "aria-label",
        document.body.classList.contains("mobile-nav-active")
          ? "Close menu"
          : "Open menu"
      );
    }
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
    mobileNavToggleBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        mobileNavToggle();
      }
    });
  }

  // Close mobile menu when a nav link is clicked
  document.querySelectorAll("#navmenu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (document.body.classList.contains("mobile-nav-active")) {
        mobileNavToggle();
      }
    });
  });

  /**
   * Splash Screen — Modern tech loading with progress simulation
   */
  const splashScreen = document.querySelector("#splash-screen");
  const splashProgressFill = document.getElementById("splash-progress-fill");
  const splashProgressGlow = document.querySelector(".splash-progress-glow");
  const splashParticlesContainer = document.getElementById("splash-particles");
  const splashLoadingText = document.getElementById("splash-loading-text");

  if (splashScreen) {
    // ---- Build title dynamically with correct delays (no nth-child bugs) ----
    const splashTitleEl = document.getElementById("splash-title");
    if (splashTitleEl) {
      const rawName = splashTitleEl.getAttribute("data-splash-name") || "MDHP";
      // Parse name into segments (words separated by spaces)
      const nameParts = rawName.split(/(\s+)/); // preserves spaces
      const letterDelay = 55; // ms between each letter

      splashTitleEl.textContent = ""; // clear

      let globalIndex = 0;
      nameParts.forEach((part) => {
        if (/^\s+$/.test(part)) {
          // Space segment
          const spaceSpan = document.createElement("span");
          spaceSpan.className = "splash-space";
          spaceSpan.style.width = "18px";
          spaceSpan.style.display = "inline-block";
          splashTitleEl.appendChild(spaceSpan);
        } else {
          // Word segment
          [...part].forEach((char, idx) => {
            const span = document.createElement("span");
            span.className = "splash-letter";
            span.textContent = char;
            // First letter of each word gets accent color
            if (idx === 0) span.classList.add("word-start");
            // Set data-delay for JS reveal
            span.setAttribute("data-delay", globalIndex * letterDelay);
            splashTitleEl.appendChild(span);
            globalIndex++;
          });
        }
      });

      // Staggered reveal using setTimeout
      const allLetters = splashTitleEl.querySelectorAll(".splash-letter");
      allLetters.forEach((letter) => {
        const delay = parseInt(letter.getAttribute("data-delay"), 10);
        setTimeout(() => {
          letter.classList.add("revealed");
        }, 800 + delay); // start after logo draw (~0.8s)
      });
    }

    // Simulate loading progress
    let loadProgress = 0;
    let loadInterval;
    let dotInterval;

    // ---- Animated loading text with bouncing dots ----
    const loadingBase = "LOADING";
    let dotCount = 0;

    const updateLoadingText = (text, withDots) => {
      if (!splashLoadingText) return;
      splashLoadingText.textContent = text;
      if (withDots) {
        // Append 3 span-dots with staggered bounce
        for (let i = 1; i <= 3; i++) {
          const dot = document.createElement("span");
          dot.className = "dot";
          dot.textContent = ".";
          splashLoadingText.appendChild(dot);
        }
      }
    };

    // Start dot cycling
    const startDotAnimation = () => {
      updateLoadingText(loadingBase, true);
      dotInterval = setInterval(() => {
        if (splashLoadingText && !splashLoadingText.classList.contains("is-done")) {
          // Re-render dots to reset animation
          splashLoadingText.textContent = loadingBase;
          for (let i = 1; i <= 3; i++) {
            const dot = document.createElement("span");
            dot.className = "dot";
            dot.textContent = ".";
            splashLoadingText.appendChild(dot);
          }
        }
      }, 1500); // re-trigger dot animation every 1.5s
    };

    // Stop dot animation and show completion
    const showLoadingComplete = () => {
      if (dotInterval) clearInterval(dotInterval);
      if (splashLoadingText) {
        splashLoadingText.textContent = "";
        splashLoadingText.classList.add("is-done");
        // Type out "READY ✓" letter by letter
        const doneText = "READY ✓";
        let charIdx = 0;
        const typeDone = setInterval(() => {
          if (splashLoadingText) {
            splashLoadingText.textContent = doneText.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx >= doneText.length) clearInterval(typeDone);
          }
        }, 80);
      }
    };

    const updateProgressBar = () => {
      if (splashProgressFill) {
        splashProgressFill.style.width = loadProgress + "%";
      }
      if (splashProgressGlow) {
        splashProgressGlow.style.left = "calc(" + loadProgress + "% - 2px)";
      }
    };

    const startProgressSimulation = () => {
      loadInterval = setInterval(() => {
        // Faster loading curve: reaches 100% quickly
        if (loadProgress < 40) {
          loadProgress += 2.5 + Math.random() * 3;
        } else if (loadProgress < 70) {
          loadProgress += 1.5 + Math.random() * 2.5;
        } else if (loadProgress < 90) {
          loadProgress += 1.2 + Math.random() * 1.8;
        } else if (loadProgress < 100) {
          loadProgress += 0.8 + Math.random() * 1.2;
        }
        if (loadProgress >= 100) {
          loadProgress = 100;
          updateProgressBar();
          clearInterval(loadInterval);
          // Progress is full — show completion and dismiss
          showLoadingComplete();
          setTimeout(dismissSplash, 600);
          return;
        }
        updateProgressBar();
      }, 160);
    };

    const completeProgress = () => {
      clearInterval(loadInterval);
      // Smoothly animate from current to 100%
      const completeStep = () => {
        if (loadProgress < 100) {
          loadProgress += 0.5;
          if (loadProgress > 100) loadProgress = 100;
          updateProgressBar();
          if (loadProgress < 100) {
            requestAnimationFrame(() => setTimeout(completeStep, 30));
          }
        }
      };
      completeStep();
    };

    // Track actual start time for minimum display duration
    const splashStartTime = Date.now();
    const MIN_SPLASH_DURATION = 1800; // Minimum 1.8 seconds display

    // Generate floating splash particles
    if (splashParticlesContainer && !reducedMotion) {
      const spCanvas = document.createElement("canvas");
      spCanvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
      splashParticlesContainer.appendChild(spCanvas);
      const spCtx = spCanvas.getContext("2d");

      const spw = () => splashScreen.clientWidth;
      const sph = () => splashScreen.clientHeight;
      spCanvas.width = spw();
      spCanvas.height = sph();

      const spParticles = Array.from({ length: 35 }, () => ({
        x: Math.random() * spw(),
        y: Math.random() * sph(),
        r: 0.6 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: 0.15 + Math.random() * 0.35,
        twinkleSpeed: 0.004 + Math.random() * 0.006,
        phase: Math.random() * Math.PI * 2,
      }));

      let spRaf = null;
      const spFrame = (ts) => {
        spCtx.clearRect(0, 0, spw(), sph());
        for (const p of spParticles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = spw() + 10;
          if (p.x > spw() + 10) p.x = -10;
          if (p.y < -10) p.y = sph() + 10;
          if (p.y > sph() + 10) p.y = -10;
          const tw = 0.55 + 0.45 * Math.sin(ts * p.twinkleSpeed + p.phase);
          spCtx.fillStyle = "rgba(124, 92, 252," + (p.alpha * tw) + ")";
          spCtx.beginPath();
          spCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          spCtx.fill();
        }
        spRaf = requestAnimationFrame(spFrame);
      };
      spRaf = requestAnimationFrame(spFrame);

      // Cleanup after splash is gone
      const cleanupSpRaf = () => { cancelAnimationFrame(spRaf); };
      window.addEventListener("load", () => {
        setTimeout(cleanupSpRaf, 1200);
      });
    }

    // Start progress simulation after a short delay
    setTimeout(startProgressSimulation, 500);
    // Start dot animation right away
    startDotAnimation();

    // Hide splash screen respecting minimum display time
    const dismissSplash = () => {
      splashScreen.classList.add("splash-out");
      setTimeout(() => {
        splashScreen.style.display = "none";
      }, 600);
    };

    window.addEventListener("load", () => {
      const elapsed = Date.now() - splashStartTime;
      const remaining = Math.max(0, MIN_SPLASH_DURATION - elapsed);

      // If progress hasn't reached 100% yet, speed it up
      setTimeout(() => {
        if (loadProgress < 100 && loadInterval) {
          clearInterval(loadInterval);
          // Rapidly finish the remaining progress
          const rushTo100 = () => {
            if (loadProgress < 100) {
              loadProgress += 3;
              if (loadProgress > 100) loadProgress = 100;
              updateProgressBar();
              if (loadProgress < 100) {
                requestAnimationFrame(() => setTimeout(rushTo100, 25));
              } else {
                showLoadingComplete();
                setTimeout(dismissSplash, 500);
              }
            }
          };
          rushTo100();
        }
      }, remaining);
    });

    // Fallback: force dismiss after timeout in case load event doesn't fire
    setTimeout(() => {
      if (!splashScreen.classList.contains("splash-out")) {
        if (loadInterval) clearInterval(loadInterval);
        loadProgress = 100;
        updateProgressBar();
        showLoadingComplete();
        setTimeout(dismissSplash, 500);
      }
    }, 5000);
  }

  /**
   * Preloader (legacy fallback)
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      setTimeout(() => preloader.remove(), 450);
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector(".scroll-top");
  function toggleScrollTop() {
    if (scrollTop) scrollTop.classList.toggle("active", window.scrollY > 300);
  }
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    });
  }
  document.addEventListener("scroll", toggleScrollTop, { passive: true });
  window.addEventListener("load", toggleScrollTop);

  /**
   * AOS init (disabled for reduced motion)
   */
  function aosInit() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: reducedMotion ? 0 : 700,
        easing: "ease-out-cubic",
        once: true,
        mirror: false,
        offset: 40,
        disable: reducedMotion,
      });
    }
  }
  window.addEventListener("load", aosInit);

  /**
   * Typed.js — technology list animation
   */
  const typedEl = document.querySelector(".typed");
  if (typedEl && typeof Typed !== "undefined") {
    const strings = typedEl
      .getAttribute("data-typed-items")
      .split(",")
      .map((s) => s.trim());
    new Typed(".typed", {
      strings,
      loop: true,
      typeSpeed: 75,
      backSpeed: 35,
      backDelay: 2400,
      startDelay: 600,
      showCursor: true,
      cursorChar: "|",
      smartBackspace: true,
    });
  }

  /**
   * Isotope project filters
   */
  document.querySelectorAll(".isotope-layout").forEach((item) => {
    const layout = item.getAttribute("data-layout") || "masonry";
    const filter = item.getAttribute("data-default-filter") || "*";
    const sort = item.getAttribute("data-sort") || "original-order";
    const container = item.querySelector(".isotope-container");
    if (!container) return;

    let iso;
    imagesLoaded(container, () => {
      iso = new Isotope(container, {
        itemSelector: ".isotope-item",
        layoutMode: layout,
        filter,
        sortBy: sort,
      });
    });

    item.querySelectorAll(".isotope-filters li").forEach((f) => {
      f.addEventListener("click", () => {
        const active = item.querySelector(".isotope-filters .filter-active");
        if (active) active.classList.remove("filter-active");
        f.classList.add("filter-active");
        if (iso) iso.arrange({ filter: f.getAttribute("data-filter") });
      });
    });
  });

  /**
   * Smooth scroll for hash links on page load
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
          });
        }, 120);
      }
    }
  });

  /**
   * Navmenu scrollspy
   */
  const navLinks = document.querySelectorAll('.navmenu a[href^="#"]');
  function navmenuScrollspy() {
    const pos = window.scrollY + 160;
    navLinks.forEach((link) => {
      const section = document.querySelector(link.hash);
      if (!section) return;
      if (pos >= section.offsetTop && pos < section.offsetTop + section.offsetHeight) {
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }
  document.addEventListener("scroll", navmenuScrollspy, { passive: true });
  window.addEventListener("load", navmenuScrollspy);

  /**
   * Hero name — staggered letter reveal
   */
  const nameEl = document.getElementById("animated-name");
  if (nameEl) {
    const fullName = nameEl.getAttribute("data-name") || "";
    if (reducedMotion) {
      nameEl.textContent = fullName;
    } else {
      nameEl.innerHTML = "";
      fullName.split("").forEach((char, i) => {
        const s = document.createElement("span");
        s.className = "letter";
        s.style.animationDelay = `${i * 0.018}s`;
        s.textContent = char === " " ? "\u00A0" : char;
        nameEl.appendChild(s);
      });
    }
  }

  /**
   * Background particle field — theme-aware, lightweight
   * Colors follow the active theme (--primary / --secondary tokens).
   */
  const particleCanvas = document.getElementById("bg-particles");
  if (particleCanvas && !reducedMotion) {
    const pctx = particleCanvas.getContext("2d");
    let particles = [];
    let pw = 0;
    let ph = 0;

    const hexToRgb = (hex) => {
      const h = hex.replace("#", "");
      return {
        r: parseInt(h.slice(0, 2), 16) || 124,
        g: parseInt(h.slice(2, 4), 16) || 92,
        b: parseInt(h.slice(4, 6), 16) || 252,
      };
    };
    const readToken = (name) => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      return v ? hexToRgb(v) : hexToRgb("#7c5cfc");
    };

    let primary = readToken("--primary");
    let secondary = readToken("--secondary");

    // Re-read colors when the theme changes (dark <-> light)
    const themeObserver = new MutationObserver(() => {
      primary = readToken("--primary");
      secondary = readToken("--secondary");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const spawnParticle = () => ({
      x: Math.random() * pw,
      y: Math.random() * ph,
      r: 1 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      baseA: 0.22 + Math.random() * 0.38,
      phase: Math.random() * Math.PI * 2,
      pulse: 0.003 + Math.random() * 0.004,
      useSecondary: Math.random() < 0.3,
    });

    function resizeParticles() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      pw = window.innerWidth;
      ph = window.innerHeight;
      particleCanvas.width = Math.round(pw * dpr);
      particleCanvas.height = Math.round(ph * dpr);
      particleCanvas.style.width = pw + "px";
      particleCanvas.style.height = ph + "px";
      pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(
        80,
        Math.max(26, Math.floor((pw * ph) / 22000))
      );
      particles = Array.from({ length: count }, spawnParticle);
    }

    let pRaf = null;
    let pLast = performance.now();

    function particleFrame(now) {
      const dt = Math.min(now - pLast, 64);
      pLast = now;
      pctx.clearRect(0, 0, pw, ph);

      // Connections (subtle constellation lines)
      const linkDist = 130;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        if (p.x < -20) p.x = pw + 20;
        else if (p.x > pw + 20) p.x = -20;
        if (p.y < -20) p.y = ph + 20;
        else if (p.y > ph + 20) p.y = -20;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist * linkDist) {
            const a = (1 - Math.sqrt(d2) / linkDist) * 0.07;
            pctx.strokeStyle = `rgba(${primary.r},${primary.g},${primary.b},${a})`;
            pctx.lineWidth = 1;
            pctx.beginPath();
            pctx.moveTo(p.x, p.y);
            pctx.lineTo(q.x, q.y);
            pctx.stroke();
          }
        }
      }

      // Particles with gentle twinkle
      for (const p of particles) {
        const tw = 0.6 + 0.4 * Math.sin(now * p.pulse + p.phase);
        const c = p.useSecondary ? secondary : primary;
        pctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${p.baseA * tw})`;
        pctx.beginPath();
        pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pctx.fill();
      }
      pRaf = requestAnimationFrame(particleFrame);
    }

    const startParticles = () => {
      if (pRaf === null) pRaf = requestAnimationFrame(particleFrame);
    };
    const stopParticles = () => {
      cancelAnimationFrame(pRaf);
      pRaf = null;
    };

    let pResizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(pResizeTimer);
      pResizeTimer = setTimeout(resizeParticles, 180);
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopParticles();
      else {
        resizeParticles();
        startParticles();
      }
    });

    resizeParticles();
    startParticles();
  }

  /**
   * ==========================================
   * Dark / Light Mode Toggle
   * 1. localStorage → 2. prefers-color-scheme → 3. default dark
   * ==========================================
   */
  const THEME_KEY = "mdhp-portfolio-theme";
  const rootEl = document.documentElement;

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function systemTheme() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function currentTheme() {
    return rootEl.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function applyTheme(theme, animate = false) {
    if (animate) rootEl.classList.add("theme-transitioning");
    rootEl.setAttribute("data-theme", theme);
    rootEl.setAttribute("data-bs-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* storage unavailable */
    }
    const tip = theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode";
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.setAttribute("title", tip);
      btn.setAttribute(
        "aria-label",
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      );
    });
    if (animate) {
      setTimeout(() => rootEl.classList.remove("theme-transitioning"), 380);
    }
  }

  function toggleTheme() {
    applyTheme(currentTheme() === "light" ? "dark" : "light", true);
  }

  document
    .querySelectorAll(".theme-toggle")
    .forEach((btn) => btn.addEventListener("click", toggleTheme));

  // Set initial tooltips
  applyTheme(currentTheme());

  // Follow system preference only if the user hasn't chosen explicitly
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
      if (!getStoredTheme()) applyTheme(e.matches ? "light" : "dark");
    });
  }

  /**
   * ==========================================
   * Language Toggle (ID / EN)
   * 1. localStorage → 2. default Indonesian
   * ==========================================
   */
  const LANG_KEY = "mdhp-portfolio-lang";
  let currentLang = "id";

  const I18N = {
    en: {
      nav_home: "Home",
      nav_about: "About",
      nav_cv: "CV",
      nav_projects: "Projects",
      nav_contact: "Contact",
      hero_status: "Available for opportunities",
      hero_desc:
        "Building scalable web applications from backend systems to responsive frontend experiences.",
      typed_label: "Currently working with",
      hero_cta_projects: "View Projects",
      hero_social: "Find me on",
      devcard_title: "Developer Profile",
      devcard_role: "Role",
      devcard_focus: "Focus",
      devcard_focus_1: "Project Manager",
      devcard_focus_2: "Fullstack Web Developer",
      devcard_focus_3: "AI Chatbot Developer",
      devcard_stack: "Stack",
      devcard_location: "Location",
      devcard_location_val: "Malang, Indonesia",
      devcard_status: "Status",
      devcard_available: "Available",
      stat_projects: "Projects",
      stat_tech: "Tech Stack",
      stat_focus: "Focus",
      stat_status: "Status",
      stat_available: "Available",
      about_eyebrow: "About / Profile",
      about_title: "About Me",
      about_sub: "Get to know more about me",
      about_bio:
        "I hold a Bachelor of Applied Business Information Systems degree from Politeknik Negeri Malang, Department of Information Technology. Experienced in Project Management, full-stack web development, and AI chatbot development. Accustomed to designing and building applications from frontend to backend, managing databases, and integrating AI technologies to create interactive and adaptive chatbots. Experienced in leading and managing projects, coordinating teams, preparing work plans, and ensuring projects meet their goals and targets. Able to work independently and in teams, with strong problem-solving skills, and quick to adapt to new technologies and work environments.",
      soft_title: "Soft Skills",
      tech_title: "Tech Stack",
      skill_english: "Speaking English",
      skill_team: "Team Work",
      cv_eyebrow: "CV / Resume",
      cv_title: "My CV",
      cv_sub: "Professional background, skills and experience.",
      cv_open: "Open Document",
      cv_badge: "PDF Document",
      cv_open_mobile: "Open CV",
      pr_eyebrow: "Projects / Work",
      pr_title: "Portfolio & Projects",
      pr_sub: "Selected applications and systems I have built.",
      filter_all: "All",
      badge_academic: "Academic",
      badge_nonacademic: "Non Academic",
      btn_details: "Details",
      coming_soon: "Coming Soon...",
      coming_desc: "More exciting projects on the way!",
      p1_title: "Polinema Customer Satisfaction Survey Web",
      p1_role: "Back-End Developer",
      p1_desc:
        "Polinema Customer Satisfaction Survey Information System website project — HTML, native PHP, JavaScript, MySQL, Figma.",
      p1_category: "Academic",
      p2_title: "Web Point of Sales (POS)",
      p2_role: "Front-End & Back-End Developer",
      p2_desc: "Point of Sales (POS) website project — Figma UI, PHP Laravel 10.3, MySQL.",
      p2_category: "Academic",
      p3_title: "JTI Compensation System Web",
      p3_role: "API Back-End Developer",
      p3_desc:
        "JTI Polinema Compensation System website project — Figma UI, PHP Laravel 10.3, MySQL.",
      p3_category: "Academic",
      p4_title: "E-Kompen Mobile App (Sikomti_app)",
      p4_role: "Front-End & Back-End Developer",
      p4_desc:
        "E-Kompen Mobile Application built with Flutter Dart using the API from the JTI Compensation System website.",
      p4_category: "Academic",
      p5_title: "State University of Malang RAG Chatbot",
      p5_role: "AI Engineer & Full-Stack Developer",
      p5_desc:
        "Retrieval-Augmented Generation (RAG)-based chatbot for academic information using LLM, Vector Database, and Knowledge Base.",
      p5_category: "Non Academic",
      p6_title: "UPDL PLN RAG Chatbot",
      p6_role: "Project Manager & Full-Stack Developer",
      p6_desc:
        "RAG-based chatbot for searching UPDL PLN training document information using LLM, Embedding Model, and Vector Database.",
      p6_category: "Non Academic",
      ct_eyebrow: "Contact / Connect",
      ct_title: "Let's Build Projects Together.",
      ct_sub:
        "Open to opportunities, collaborations, and software development projects.",
      ct_location: "Location",
      ct_location_val: "Malang, East Java, Indonesia",
      ct_phone: "Phone",
      ct_email: "Email",
      ft_tagline: "Full Stack Developer — Building practical software solutions.",
      modal_role: "Role",
    },
    id: {
      nav_home: "Beranda",
      nav_about: "Tentang",
      nav_cv: "CV",
      nav_projects: "Proyek",
      nav_contact: "Kontak",
      hero_status: "Terbuka untuk peluang",
      hero_desc:
        "Membangun aplikasi web yang skalabel, dari sistem backend hingga pengalaman frontend yang responsif.",
      typed_label: "Saat ini bekerja dengan",
      hero_cta_projects: "Lihat Proyek",
      hero_social: "Temukan saya di",
      devcard_title: "Profil Developer",
      devcard_role: "Peran",
      devcard_focus: "Fokus",
      devcard_focus_1: "Project Manager",
      devcard_focus_2: "Fullstack Web Developer",
      devcard_focus_3: "AI Chatbot Developer",
      devcard_stack: "Stack",
      devcard_location: "Lokasi",
      devcard_location_val: "Malang, Indonesia",
      devcard_status: "Status",
      devcard_available: "Tersedia",
      stat_projects: "Proyek",
      stat_tech: "Tech Stack",
      stat_focus: "Fokus",
      stat_status: "Status",
      stat_available: "Tersedia",
      about_eyebrow: "Tentang / Profil",
      about_title: "Tentang Saya",
      about_sub: "Kenali saya lebih dekat",
      about_bio:
        "Saya merupakan lulusan Sarjana Terapan Sistem Informasi Bisnis dari Politeknik Negeri Malang, Jurusan Teknologi Informasi. Memiliki pengalaman dalam Project Management, pengembangan aplikasi web secara fullstack, serta pengembangan AI chatbot. Terbiasa merancang dan mengembangkan aplikasi dari sisi frontend hingga backend, mengelola database, serta mengintegrasikan teknologi AI untuk membangun chatbot yang interaktif dan adaptif. Memiliki pengalaman dalam memimpin dan mengelola proyek, mengoordinasikan tim, menyusun perencanaan kerja, serta memastikan proyek berjalan sesuai tujuan dan target yang ditetapkan. Mampu bekerja secara mandiri maupun dalam tim, memiliki kemampuan problem solving yang baik, dan cepat beradaptasi dengan teknologi serta lingkungan kerja baru.",
      soft_title: "Soft Skills",
      tech_title: "Tech Stack",
      skill_english: "Berbahasa Inggris",
      skill_team: "Kerja Tim",
      cv_eyebrow: "CV / Resume",
      cv_title: "CV Saya",
      cv_sub: "Latar belakang profesional, keahlian, dan pengalaman.",
      cv_open: "Buka Dokumen",
      cv_badge: "Dokumen PDF",
      cv_open_mobile: "Buka CV",
      pr_eyebrow: "Proyek / Karya",
      pr_title: "Portofolio & Proyek",
      pr_sub: "Aplikasi dan sistem pilihan yang telah saya bangun.",
      filter_all: "Semua",
      badge_academic: "Akademik",
      badge_nonacademic: "Non Akademik",
      btn_details: "Detail",
      coming_soon: "Segera Hadir...",
      coming_desc: "Proyek menarik lainnya segera hadir!",
      p1_title: "Web Survey Kepuasan Pelanggan Polinema",
      p1_role: "Back-End Developer",
      p1_desc:
        "Project Website Sistem Informasi Survey Kepuasan Pelanggan Polinema — HTML, PHP native, JavaScript, MySQL, Figma.",
      p1_category: "Akademik",
      p2_title: "Web Point of Sales (POS)",
      p2_role: "Front-End & Back-End Developer",
      p2_desc:
        "Project Website Point of Sales (POS) — Figma UI, PHP Laravel 10.3, MySQL.",
      p2_category: "Akademik",
      p3_title: "Web Sistem Kompensasi JTI",
      p3_role: "API Back-End Developer",
      p3_desc:
        "Project Website Sistem Kompensasi JTI Polinema — Figma UI, PHP Laravel 10.3, MySQL.",
      p3_category: "Akademik",
      p4_title: "Aplikasi Mobile E-Kompen (Sikomti_app)",
      p4_role: "Front-End & Back-End Developer",
      p4_desc:
        "Aplikasi Mobile E-Kompen menggunakan Flutter Dart dengan API dari website Sistem Kompen JTI.",
      p4_category: "Akademik",
      p5_title: "Chatbot RAG Universitas Negeri Malang",
      p5_role: "AI Engineer & Full-Stack Developer",
      p5_desc:
        "Chatbot berbasis Retrieval-Augmented Generation (RAG) untuk informasi akademik menggunakan LLM, Vector Database, dan Knowledge Base.",
      p5_category: "Non Akademik",
      p6_title: "Chatbot RAG UPDL PLN",
      p6_role: "Project Manager & Full-Stack Developer",
      p6_desc:
        "Chatbot berbasis RAG untuk pencarian informasi dokumen pelatihan UPDL PLN menggunakan LLM, Embedding Model, dan Vector Database.",
      p6_category: "Non Akademik",
      ct_eyebrow: "Kontak / Terhubung",
      ct_title: "Mari Bangun Proyek Bersama.",
      ct_sub:
        "Terbuka untuk peluang, kolaborasi, dan proyek pengembangan perangkat lunak.",
      ct_location: "Lokasi",
      ct_location_val: "Malang, Jawa Timur, Indonesia",
      ct_phone: "Telepon",
      ct_email: "Email",
      ft_tagline:
        "Full Stack Developer — Membangun solusi perangkat lunak yang praktis.",
      modal_role: "Peran",
    },
  };

  function getStoredLang() {
    try {
      return localStorage.getItem(LANG_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyLang(lang) {
    currentLang = lang;
    rootEl.setAttribute("lang", lang);
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* storage unavailable */
    }
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = I18N[lang] && I18N[lang][key];
      if (val !== undefined) el.textContent = val;
    });
    if (typeof refreshFocusRotator === "function") refreshFocusRotator();
    const isId = lang === "id";
    const nextLabel = isId ? "EN" : "ID";
    const nextTip = isId ? "Switch to English" : "Ganti ke Bahasa Indonesia";
    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      btn.textContent = nextLabel;
      btn.setAttribute("aria-label", nextTip);
      btn.setAttribute("title", nextTip);
    });
  }

  function toggleLang() {
    applyLang(currentLang === "id" ? "en" : "id");
  }

  document
    .querySelectorAll(".lang-toggle")
    .forEach((btn) => btn.addEventListener("click", toggleLang));

  /**
   * Focus rotator (dev card) — cycles 01 Project Manager →
   * 02 Fullstack Web Developer → 03 AI Chatbot Developer with a slide
   * animation. The hero role stays static (Project Manager only).
   */
  const focusRotator = document.getElementById("focusRotator");
  const FOCUS_ITEMS = [
    { key: "devcard_focus_1" },
    { key: "devcard_focus_2" },
    { key: "devcard_focus_3" },
  ];
  let focusIndex = 0;
  let focusTimer = null;

  function refreshFocusRotator() {
    if (!focusRotator) return;
    const item = FOCUS_ITEMS[focusIndex];
    const textEl = focusRotator.querySelector(".dev-focus-text");
    if (textEl) {
      const val = I18N[currentLang] && I18N[currentLang][item.key];
      if (val !== undefined) textEl.textContent = val;
    }
    focusRotator.querySelectorAll(".focus-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === focusIndex);
    });
  }

  function animateFocusSlide() {
    if (!focusRotator) return;
    const slide = focusRotator.querySelector(".dev-focus-slide");
    if (!slide) return;
    slide.classList.remove("is-swapping");
    void slide.offsetWidth; // restart animation
    slide.classList.add("is-swapping");
  }

  if (focusRotator) {
    refreshFocusRotator();
    if (!reducedMotion) {
      const nextFocus = () => {
        focusIndex = (focusIndex + 1) % FOCUS_ITEMS.length;
        refreshFocusRotator();
        animateFocusSlide();
      };
      focusTimer = setInterval(nextFocus, 3200);
      focusRotator.addEventListener("mouseenter", () => {
        clearInterval(focusTimer);
      });
      focusRotator.addEventListener("mouseleave", () => {
        clearInterval(focusTimer);
        focusTimer = setInterval(nextFocus, 3200);
      });
    }
  }

  // Init language (stored → default Indonesian)
  applyLang(getStoredLang() === "en" || getStoredLang() === "id" ? getStoredLang() : "id");

  /**
   * Project details modal
   */
  const modalEl = document.getElementById("projectModal");
  if (modalEl) {
    modalEl.addEventListener("show.bs.modal", (event) => {
      const trigger = event.relatedTarget;
      const card = trigger && trigger.closest ? trigger.closest(".portfolio-item") : null;
      if (!card) return;
      const d = card.dataset;
      const T = I18N[currentLang] || {};
      const key = d.key || "";
      const getT = (k) => (T[k] !== undefined ? T[k] : "");

      const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      setText("pmTitle", getT(key + "_title") || d.title || "");
      setText("pmCategory", getT(key + "_category") || d.category || "PROJECT");
      setText("pmRole", getT(key + "_role") || d.role || "—");
      setText(
        "pmStack",
        (d.stack || "")
          .split(",")
          .map((s) => s.trim())
          .join(" \u00B7 ")
      );
      setText("pmDesc", getT(key + "_desc") || d.desc || "");

      const img = document.getElementById("pmImage");
      if (img) {
        img.src = d.image || "";
        img.alt = getT(key + "_title") || d.title || "Project screenshot";
      }

      const linkBtn = (id, url) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (url) {
          el.href = url;
          el.style.display = "inline-flex";
        } else {
          el.style.display = "none";
        }
      };
      linkBtn("pmGithub", d.github);
      linkBtn("pmFigma", d.figma);
    });
  }

  /**
   * Developer stats — auto-counted from real data
   */
  const statProjects = document.getElementById("statProjects");
  const projectCount = document.querySelectorAll(".portfolio-item[data-project]").length;
  if (statProjects) statProjects.textContent = String(projectCount).padStart(2, "0") + "+";

  const statTech = document.getElementById("statTech");
  const techCount = document.querySelectorAll("#about .tech-chip").length;
  if (statTech) statTech.textContent = String(techCount).padStart(2, "0") + "+";

  /**
   * Footer year (dynamic)
   */
  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
