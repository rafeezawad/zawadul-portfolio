
/* ==========================================
   ZAWADUL PORTFOLIO
   COMPLETE JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const scrollBehavior = reduceMotion ? "auto" : "smooth";


  /* ==========================================
     1. MOBILE NAVIGATION
  ========================================== */

  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {

    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-controls", "navLinks");

    function closeMenu() {
      navLinks.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute(
        "aria-label",
        "Open navigation menu"
      );
    }

    menuBtn.addEventListener("click", function () {

      const isOpen = navLinks.classList.toggle("active");

      menuBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuBtn.setAttribute(
        "aria-label",
        isOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );

    });

    navLinks.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", closeMenu);

    });

    document.addEventListener("click", function (event) {

      if (
        !navLinks.contains(event.target) &&
        !menuBtn.contains(event.target)
      ) {
        closeMenu();
      }

    });

    document.addEventListener("keydown", function (event) {

      if (event.key === "Escape") {
        closeMenu();
      }

    });

    window.addEventListener("resize", function () {

      if (window.innerWidth > 760) {
        closeMenu();
      }

    });

  }


  /* ==========================================
     2. ACTIVE NAVIGATION
  ========================================== */

  const navigationLinks = Array.from(
    document.querySelectorAll(
      ".nav-links a[href^='#']"
    )
  );

  const observedSections = navigationLinks
    .map(function (link) {

      const target = link.getAttribute("href");

      return document.querySelector(target);

    })
    .filter(Boolean);

  function updateActiveNavigation(sectionId) {

    navigationLinks.forEach(function (link) {

      const isActive =
        link.getAttribute("href") === "#" + sectionId;

      link.classList.toggle("active", isActive);

      if (isActive) {

        link.setAttribute(
          "aria-current",
          "location"
        );

      } else {

        link.removeAttribute("aria-current");

      }

    });

  }

  if (observedSections.length > 0) {

    let scrollTicking = false;

    function detectActiveSection() {

      const position = window.scrollY + 160;

      let activeSection = observedSections[0];

      observedSections.forEach(function (section) {

        if (section.offsetTop <= position) {
          activeSection = section;
        }

      });

      if (activeSection) {
        updateActiveNavigation(activeSection.id);
      }

      scrollTicking = false;

    }

    window.addEventListener(
      "scroll",
      function () {

        if (!scrollTicking) {

          window.requestAnimationFrame(
            detectActiveSection
          );

          scrollTicking = true;

        }

      },
      { passive: true }
    );

    window.addEventListener(
      "resize",
      detectActiveSection
    );

    detectActiveSection();

  }


  /* ==========================================
     3. VIEW ALL 9 PROJECTS / SHOW LESS
  ========================================== */

  const toggleProjectsBtn =
    document.getElementById("toggleProjects");

  const projectsGrid =
    document.getElementById("projectsGrid");

  const extraProjects = Array.from(
    document.querySelectorAll(
      "#projectsGrid .extra-project"
    )
  );

  if (
    toggleProjectsBtn &&
    projectsGrid &&
    extraProjects.length > 0
  ) {

    const buttonLabel =
      toggleProjectsBtn.querySelector(
        ".projects-more-label"
      );

    let projectsExpanded = false;

    function setProjectsExpanded(expanded) {

      projectsExpanded = expanded;

      extraProjects.forEach(function (project) {

        project.hidden = !expanded;

        if (expanded) {
          project.classList.add("visible");
        }

      });

      toggleProjectsBtn.setAttribute(
        "aria-expanded",
        String(expanded)
      );

      if (buttonLabel) {

        buttonLabel.textContent = expanded
          ? "Show Less"
          : "View All 9 Projects";

      }

    }

    setProjectsExpanded(false);

    toggleProjectsBtn.addEventListener(
      "click",
      function () {

        setProjectsExpanded(!projectsExpanded);

        if (!projectsExpanded) {

          const projectsSection =
            document.getElementById("projects");

          if (projectsSection) {

            projectsSection.scrollIntoView({
              behavior: scrollBehavior,
              block: "start"
            });

          }

        }

      }
    );

  }


  /* ==========================================
     4. SUBTLE SCROLL REVEAL ANIMATIONS
  ========================================== */

  const revealItems = document.querySelectorAll(
    ".section-intro, " +
    ".experience-item, " +
    ".featured-project-card, " +
    ".capability-card, " +
    ".education-item, " +
    ".recognition-card"
  );

  if (
    !reduceMotion &&
    "IntersectionObserver" in window
  ) {

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px 30px 0px"
      }
    );

    revealItems.forEach(function (item) {

      item.classList.add("reveal");

      if (
        item.getBoundingClientRect().top <
        window.innerHeight
      ) {

        item.classList.add("visible");

      } else {

        revealObserver.observe(item);

      }

    });

    document.documentElement.classList.add(
      "js-reveal-ready"
    );

  } else {

    revealItems.forEach(function (item) {

      item.classList.add("visible");

    });

  }


  /* ==========================================
     5. PROJECT IMAGE LIGHTBOX
  ========================================== */

  const lightbox =
    document.getElementById("imageLightbox");

  const lightboxImage =
    document.getElementById("lightboxImage");

  const lightboxCaption =
    document.getElementById("lightboxCaption");

  const lightboxClose =
    document.getElementById("lightboxClose");

  let lastFocusedElement = null;

  function closeLightbox() {

    if (!lightbox) return;

    lightbox.hidden = true;

    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "lightbox-open"
    );

    if (lightboxImage) {
      lightboxImage.removeAttribute("src");
    }

    if (
      lastFocusedElement &&
      document.contains(lastFocusedElement)
    ) {

      lastFocusedElement.focus();

    }

  }

  if (
    lightbox &&
    lightboxImage &&
    lightboxClose
  ) {

    const projectImages =
      document.querySelectorAll(
        ".featured-project-image img"
      );

    projectImages.forEach(function (img) {

      const wrapper = img.closest(
        ".featured-project-image"
      );

      if (!wrapper) return;

      wrapper.setAttribute("role", "button");

      wrapper.setAttribute("tabindex", "0");

      wrapper.setAttribute(
        "aria-label",
        "Enlarge " + (img.alt || "project image")
      );

      function openImage() {

        if (
          !img.complete ||
          img.naturalWidth === 0
        ) {
          return;
        }

        lastFocusedElement =
          document.activeElement;

        lightboxImage.src =
          img.currentSrc || img.src;

        lightboxImage.alt =
          img.alt || "Project image";

        if (lightboxCaption) {

          lightboxCaption.textContent =
            img.alt || "";

        }

        lightbox.hidden = false;

        lightbox.setAttribute(
          "aria-hidden",
          "false"
        );

        document.body.classList.add(
          "lightbox-open"
        );

        lightboxClose.focus();

      }

      wrapper.addEventListener(
        "click",
        openImage
      );

      wrapper.addEventListener(
        "keydown",
        function (event) {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            openImage();

          }

        }
      );

    });

    lightboxClose.addEventListener(
      "click",
      closeLightbox
    );

    lightbox.addEventListener(
      "click",
      function (event) {

        if (event.target === lightbox) {
          closeLightbox();
        }

      }
    );

    document.addEventListener(
      "keydown",
      function (event) {

        if (lightbox.hidden) return;

        if (event.key === "Escape") {

          closeLightbox();

        }

        if (event.key === "Tab") {

          // Keep keyboard focus inside the lightbox.
          event.preventDefault();

          lightboxClose.focus();

        }

      }
    );

  }


  /* ==========================================
     6. COPY EMAIL ADDRESS
  ========================================== */

  const copyEmailBtn =
    document.getElementById("copyEmailBtn");

  const copyEmailStatus =
    document.getElementById("copyEmailStatus");

  if (copyEmailBtn) {

    copyEmailBtn.addEventListener(
      "click",
      async function () {

        const email =
          copyEmailBtn.dataset.email;

        if (!email) return;

        try {

          await navigator.clipboard.writeText(email);

          if (copyEmailStatus) {

            copyEmailStatus.textContent =
              "Email address copied.";

          }

        } catch (error) {

          if (copyEmailStatus) {

            copyEmailStatus.textContent =
              "Copy unavailable. Email: " + email;

          }

        }

      }
    );

  }


  /* ==========================================
     7. BACK TO TOP BUTTON
  ========================================== */

  const backToTop =
    document.getElementById("backToTop");

  if (backToTop) {

    let backToTopTicking = false;

    function updateBackToTop() {

      const shouldShow =
        window.scrollY > 500;

      backToTop.classList.toggle(
        "show",
        shouldShow
      );

      backToTopTicking = false;

    }

    window.addEventListener(
      "scroll",
      function () {

        if (!backToTopTicking) {

          window.requestAnimationFrame(
            updateBackToTop
          );

          backToTopTicking = true;

        }

      },
      { passive: true }
    );

    updateBackToTop();

    backToTop.addEventListener(
      "click",
      function () {

        window.scrollTo({
          top: 0,
          behavior: scrollBehavior
        });

      }
    );

  }


  /* ==========================================
     8. EXTERNAL LINK SECURITY
  ========================================== */

  document.querySelectorAll(
    'a[target="_blank"]'
  ).forEach(function (link) {

    const existingRel =
      link.getAttribute("rel") || "";

    const relValues = new Set(
      existingRel.split(/\s+/).filter(Boolean)
    );

    relValues.add("noopener");
    relValues.add("noreferrer");

    link.setAttribute(
      "rel",
      Array.from(relValues).join(" ")
    );

  });

});
