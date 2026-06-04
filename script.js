/* =====================================================================
   Dr Quéval — Médecine du sommeil à Calais
   Script principal : menu mobile, animations au scroll, FAQ exclusive
   JavaScript pur, sans dépendance.
   ===================================================================== */

(function () {
  "use strict";

  /* ---------- 1. Menu mobile (hamburger) ---------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var ouvert = navMenu.classList.toggle("is-open");
      // Synchronise l'état ARIA pour les lecteurs d'écran
      navToggle.setAttribute("aria-expanded", ouvert ? "true" : "false");
      navToggle.setAttribute(
        "aria-label",
        ouvert ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"
      );
    });

    // Referme le menu après un clic sur un lien (navigation par ancre)
    navMenu.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Ouvrir le menu de navigation");
      }
    });

    // Referme le menu avec la touche Échap (accessibilité clavier)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---------- 2. Apparition au scroll (IntersectionObserver) ---------- */
  var elements = document.querySelectorAll(".reveal");

  // Repli si l'API n'existe pas ou si l'utilisateur préfère réduire les animations
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!("IntersectionObserver" in window) || reduceMotion) {
    elements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // une seule fois
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- 3. FAQ : ouverture exclusive (un seul panneau à la fois) ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (autre) {
          if (autre !== item) {
            autre.open = false;
          }
        });
      }
    });
  });
})();
