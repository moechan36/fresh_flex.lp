(() => {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("#site-nav");
  const faqItems = document.querySelectorAll(".faq-item");
  const revealItems = document.querySelectorAll("[data-reveal]");
  const sliders = document.querySelectorAll("[data-sns-slider]");
  const videos = document.querySelectorAll(".video-link video");
  const phoneLinks = document.querySelectorAll("[data-tel-link]");
  const directLinks = document.querySelectorAll(".header-official, .footer-official, .map-link, .video-link, .sns-more-account");

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "メニューを開く");
    }
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "メニューを閉じる" : "メニューを開く");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      closeMenu();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "smooth"
      });
    });
  });

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const shouldOpen = button.getAttribute("aria-expanded") !== "true";

      faqItems.forEach((otherItem) => {
        const otherButton = otherItem.querySelector(".faq-question");
        const otherAnswer = otherItem.querySelector(".faq-answer");

        if (!otherButton || !otherAnswer || otherItem === item) return;
        otherButton.setAttribute("aria-expanded", "false");
        otherAnswer.style.maxHeight = "0px";
      });

      button.setAttribute("aria-expanded", String(shouldOpen));
      answer.style.maxHeight = shouldOpen ? `${answer.scrollHeight}px` : "0px";
    });
  });

  const refreshFaqHeight = () => {
    faqItems.forEach((item) => {
      const button = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      if (!button || !answer) return;
      if (button.getAttribute("aria-expanded") === "true") {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  sliders.forEach((slider) => {
    const track = slider.querySelector("[data-slider-track]");
    const prev = slider.querySelector("[data-slider-prev]");
    const next = slider.querySelector("[data-slider-next]");

    if (!track || !prev || !next) return;

    const slideByCard = (direction) => {
      const card = track.querySelector(".sns-card");
      const gap = 20;
      const amount = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.85;

      track.scrollBy({
        left: amount * direction,
        behavior: "smooth"
      });
    };

    prev.addEventListener("click", () => slideByCard(-1));
    next.addEventListener("click", () => slideByCard(1));
  });

  videos.forEach((video) => {
    video.muted = true;
    video.playsInline = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  });

  phoneLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const originalText = link.textContent;
      link.textContent = "080-1418-7209";
      window.location.href = "tel:080-1418-7209";
      window.setTimeout(() => {
        link.textContent = originalText;
      }, 2200);
    });
  });

  directLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href) return;
      event.preventDefault();
      window.location.href = href;
    });
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  window.addEventListener("resize", refreshFaqHeight);
  setHeaderState();
})();
