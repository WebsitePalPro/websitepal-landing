    const gallery = document.querySelector("[data-example-gallery]");
    const previousButton = document.querySelector("[data-gallery-prev]");
    const nextButton = document.querySelector("[data-gallery-next]");
    const progressBar = document.querySelector("[data-gallery-progress]");

    if (gallery) {
      let isDown = false;
      let startX = 0;
      let startScrollLeft = 0;

      const updateProgress = () => {
        if (!progressBar) return;
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;
        const progress = maxScroll > 0 ? gallery.scrollLeft / maxScroll : 0;
        progressBar.style.width = `${Math.max(16, progress * 100)}%`;
      };

      gallery.addEventListener("pointerdown", (event) => {
        isDown = true;
        startX = event.clientX;
        startScrollLeft = gallery.scrollLeft;
        gallery.classList.add("dragging");
        gallery.setPointerCapture(event.pointerId);
      });

      gallery.addEventListener("pointermove", (event) => {
        if (!isDown) return;
        const distance = event.clientX - startX;
        gallery.scrollLeft = startScrollLeft - distance;
      });

      const stopDrag = () => {
        isDown = false;
        gallery.classList.remove("dragging");
      };

      gallery.addEventListener("pointerup", stopDrag);
      gallery.addEventListener("pointercancel", stopDrag);
      gallery.addEventListener("pointerleave", stopDrag);
      gallery.addEventListener("scroll", updateProgress, { passive: true });

      previousButton?.addEventListener("click", () => {
        gallery.scrollBy({ left: -gallery.clientWidth * 0.72, behavior: "smooth" });
      });

      nextButton?.addEventListener("click", () => {
        gallery.scrollBy({ left: gallery.clientWidth * 0.72, behavior: "smooth" });
      });

      updateProgress();
    }

    const processCards = document.querySelectorAll("[data-process-step]");
    const processTrack = document.querySelector("[data-process-track]");
    const processDetail = document.querySelector(".process-detail");
    const processTitle = document.querySelector("[data-process-title]");
    const processDescription = document.querySelector("[data-process-description]");
    const processPointOne = document.querySelector("[data-process-point-one]");
    const processPointTwo = document.querySelector("[data-process-point-two]");
    const processStatusPill = document.querySelector("[data-process-status-pill]");

    const processContent = {
      details: {
        title: "Give us your details",
        description: "Tell us what you do, where you work and some general details on your services, philosophy and team.",
        points: ["Basic company info", "Services and areas covered"],
        status: "Brief status: Ready",
        image: "assets/step-1.webp"
      },
      images: {
        title: "Upload your images",
        description: "Send us what you have: logo, project photos, team images, service images and anything that you want to promote on your new webpage.",
        points: ["Logo and site photos", "Project image upload"],
        status: "Image library: Uploading",
        image: "assets/step-2.webp"
      },
      build: {
        title: "We build it",
        description: "One of our dedicated developers with experience building websites for companies like yours gets your build going, with as much input from yourselves as you want.",
        points: ["Developer-led build", "Account manager support"],
        status: "Build progress: In motion",
        image: "assets/step-3.webp"
      },
      launch: {
        title: "Review & launch",
        description: "You check the draft, send any changes, and once you are happy we launch it properly so it is ready to get you some inbound leads.",
        points: ["Review the draft", "Launch when approved"],
        status: "Website status: Live",
        image: "assets/step-4.webp"
      }
    };

    const setProcessStep = (step) => {
      const content = processContent[step];
      if (!content) return;

      processCards.forEach((card, index) => {
        const isActive = card.dataset.processStep === step;
        card.classList.toggle("is-active", isActive);
        card.setAttribute("aria-pressed", isActive ? "true" : "false");
        if (isActive && processTrack) {
          processTrack.style.setProperty("--process-progress", `${((index + 0.5) / processCards.length) * 100}%`);
        }
      });

      if (processTitle) processTitle.textContent = content.title;
      if (processDescription) processDescription.textContent = content.description;
      if (processPointOne) processPointOne.textContent = content.points[0];
      if (processPointTwo) processPointTwo.textContent = content.points[1];
      if (processStatusPill) processStatusPill.textContent = content.status;
      if (processDetail) processDetail.style.setProperty("--process-bg", `url("${content.image}")`);
    };

    processCards.forEach((card) => {
      const step = card.dataset.processStep;
      card.addEventListener("mouseenter", () => setProcessStep(step));
      card.addEventListener("focus", () => setProcessStep(step));
      card.addEventListener("click", () => setProcessStep(step));
    });

    const revealSelectors = [
      ".hero-copy",
      ".hero-visual-space",
      ".strip-label",
      ".trade-item",
      ".examples-copy",
      ".gallery-controls",
      ".gallery-hint",
      ".feature-card",
      ".why-copy",
      ".keyword-stage",
      ".comparison-panel",
      ".process-header > *",
      ".process-card",
      ".process-detail",
      ".pricing-card",
      ".value-header",
      ".value-item",
      ".extras-header",
      ".help-item"
    ];

    const revealElements = Array.from(document.querySelectorAll(revealSelectors.join(",")));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const completeReveal = (element) => {
      element.classList.add("reveal-complete");
      element.style.removeProperty("--reveal-delay");
    };

    revealElements.forEach((element, index) => {
      element.classList.add("reveal-on-scroll");
      element.style.setProperty("--reveal-delay", `${(index % 6) * 65}ms`);
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
        completeReveal(element);
      });
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          entry.target.addEventListener("transitionend", () => completeReveal(entry.target), { once: true });
          observer.unobserve(entry.target);
        });
      }, {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12
      });

      revealElements.forEach((element) => revealObserver.observe(element));
    }

    const siteHeader = document.querySelector("[data-site-header]");
    const stickyCta = document.querySelector("[data-sticky-cta]");

    const updateSiteHeader = () => {
      if (!siteHeader) return;
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    const updateStickyCta = () => {
      if (!stickyCta) return;
      const viewportBottom = window.scrollY + window.innerHeight;
      const footerTrigger = stickyCta.offsetTop - 90;
      stickyCta.classList.toggle("is-expanded", viewportBottom >= footerTrigger);
    };

    let scrollTicking = false;
    const updateScrollState = () => {
      updateSiteHeader();
      updateStickyCta();
      scrollTicking = false;
    };
    const requestScrollUpdate = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(updateScrollState);
    };

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    updateSiteHeader();
    updateStickyCta();
