/**
 * Portfolio 3 — Main JS
 * Native smooth scroll + GSAP ScrollTrigger + Interactive 3D + Cursor
 */

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  initSmoothAnchor();
  initCustomCursor();
  initNavbarEffect();
  initHeroAnimations();
  initScrollReveal();
  init3DTiltCards();
  initMagneticButtons();
  initMobileMenu();

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });
});

// ─── 1. Smooth anchor scroll with navbar offset ───────────────────────────────
function initSmoothAnchor() {
  const NAV_HEIGHT = 80;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

// ─── 2. Custom cursor ─────────────────────────────────────────────────────────
function initCustomCursor() {
  const dot  = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  // Centre both elements via GSAP (avoids CSS transform conflict)
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my;

  // Dot: snaps instantly
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.06, ease: "none", overwrite: true });
  });

  // Ring: smooth lag follow
  function tickRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(tickRing);
  }
  tickRing();

  // Hover states
  document.querySelectorAll("a, button, .work-card, .skill-card, .contact-link-item").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(ring, { scale: 1.7, borderColor: "rgba(37,215,255,0.9)", duration: 0.3 });
      gsap.to(dot,  { scale: 2.2, backgroundColor: "#25d7ff", duration: 0.3 });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(ring, { scale: 1, borderColor: "rgba(255,255,255,0.45)", duration: 0.3 });
      gsap.to(dot,  { scale: 1, backgroundColor: "#ffffff", duration: 0.3 });
    });
  });
}

// ─── 3. Navbar — glass on scroll ─────────────────────────────────────────────
function initNavbarEffect() {
  const nav = document.querySelector(".luxury-navbar");
  if (!nav) return;

  const toggle = () => nav.classList.toggle("scrolled", window.scrollY > 60);
  window.addEventListener("scroll", toggle, { passive: true });
}

// ─── 4. Hero entrance ────────────────────────────────────────────────────────
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.from(".logo-img",   { opacity: 0, x: -20, duration: 0.9, delay: 0.2 })
    .from(".nav-item",   { opacity: 0, y: -10, stagger: 0.07, duration: 0.7 }, "-=0.5")
    .from(".btn-minimal",{ opacity: 0, y: -10, duration: 0.7 }, "-=0.5")
    .from(".label-text", { opacity: 0, y: 14, duration: 0.8 }, "-=0.3")
    .from(".main-title", { opacity: 0, y: 55, rotateX: -10, duration: 1.3, clearProps: "all" }, "-=0.4")
    .from(".hero-bio",   { opacity: 0, y: 24, duration: 0.9, clearProps: "all" }, "-=0.8")
    .from(".hero-actions",{ opacity: 0, y: 18, duration: 0.8, clearProps: "all" }, "-=0.7")
    .from(".hero-photo-module", { opacity: 0, scale: 0.9, rotateY: -14, duration: 1.2, clearProps: "all" }, "-=0.9");
}

// ─── 5. Scroll-triggered reveals ─────────────────────────────────────────────
function initScrollReveal() {
  // Generic reveals
  document.querySelectorAll(
    ".section-title, .line-reveal, .section-subtitle, .exp-item, .connect-wrapper, .profile-image-minimal, .exp-bio"
  ).forEach((el) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power2.out",
      clearProps: "opacity,transform",
    });
  });

  // Skill cards — staggered
  gsap.from(".skills-grid-lux .skill-card", {
    scrollTrigger: { trigger: ".skills-grid-lux", start: "top 85%", once: true },
    opacity: 0,
    y: 48,
    rotateX: -6,
    stagger: { amount: 0.5 },
    duration: 0.85,
    ease: "power2.out",
    clearProps: "all",
  });

  // Work cards — staggered
  gsap.from(".work-grid .work-card", {
    scrollTrigger: { trigger: ".work-grid", start: "top 85%", once: true },
    opacity: 0,
    y: 55,
    stagger: 0.15,
    duration: 0.9,
    ease: "power2.out",
    clearProps: "all",
  });

  // Hero orb parallax
  gsap.to(".hero-gradient-orb", {
    scrollTrigger: {
      trigger: ".luxury-hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
    y: 200,
    opacity: 0,
  });
}

// ─── 6. 3D mouse-follow tilt ─────────────────────────────────────────────────
function init3DTiltCards() {
  document.querySelectorAll(".work-card, .skill-card, .hero-photo-module").forEach((card) => {
    const isPhoto = card.classList.contains("hero-photo-module");

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);

      gsap.to(card, {
        rotateY: dx * (isPhoto ? 12 : 8),
        rotateX: -dy * (isPhoto ? 7 : 5),
        transformPerspective: 900,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });

      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width)  * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top)  / r.height) * 100}%`);
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "elastic.out(1,0.4)", overwrite: "auto" });
    });
  });
}

// ─── 7. Magnetic buttons ─────────────────────────────────────────────────────
function initMagneticButtons() {
  document.querySelectorAll(".btn-minimal, .btn-primary-luxury, .btn-secondary-luxury").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      gsap.to(btn, { x, y, duration: 0.35, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,0.3)" });
    });
  });
}

// ─── 8. Mobile menu ──────────────────────────────────────────────────────────
function initMobileMenu() {
  const toggle   = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("nav-open");
    toggle.classList.toggle("active", open);
  });

  navLinks.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("nav-open");
      toggle.classList.remove("active");
    });
  });
}
