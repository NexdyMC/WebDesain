$(function () {
  "use strict";

  const $menuBtn = $("#menuBtn");
  const $mobileMenu = $("#mobileMenu");
  const $iconOpen = $("#iconOpen");
  const $iconClose = $("#iconClose");

  function toggleMobileMenu(isOpen) {
    const isCurrentlyOpen =
      $mobileMenu.is(":visible") && !$mobileMenu.hasClass("hidden");
    const openState = typeof isOpen === "boolean" ? isOpen : !isCurrentlyOpen;

    if (openState) {
      $mobileMenu
        .removeClass("hidden")
        .hide()
        .stop(true, true)
        .slideDown(220, function () {
          $(this).css("display", "");
        });
      $menuBtn.attr("aria-expanded", "true");
      $iconOpen.addClass("hidden");
      $iconClose.removeClass("hidden");
    } else {
      $mobileMenu.stop(true, true).slideUp(180, function () {
        $(this).addClass("hidden").css("display", "");
      });
      $menuBtn.attr("aria-expanded", "false");
      $iconOpen.removeClass("hidden");
      $iconClose.addClass("hidden");
    }
  }

  $menuBtn.on("click", function (e) {
    e.stopPropagation();
    toggleMobileMenu();
  });

  $("#mobileMenu a").on("click", function () {
    toggleMobileMenu(false);
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest("header").length) {
      toggleMobileMenu(false);
    }
  });

  $(document).on("keydown", function (e) {
    if (
      e.key === "Escape" &&
      $mobileMenu.is(":visible") &&
      !$mobileMenu.hasClass("hidden")
    ) {
      toggleMobileMenu(false);
      $menuBtn.trigger("focus");
    }
  });

  function initScrollProgress() {
    const progressBar = document.getElementById("scrollProgressBar");
    if (!progressBar) return;

    const updateScrollProgress = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = Math.min(Math.max(progress, 0), 100) + "%";
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
  }

  initScrollProgress();

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function initScrollCue() {
    const scrollCue = document.getElementById("scrollCue");
    const heroSection = document.getElementById("hero");

    if (!scrollCue || !heroSection || !("IntersectionObserver" in window)) {
      return;
    }

    const cueObserver = new IntersectionObserver(
      function (entries) {
        const isHeroVisible = entries[0].isIntersecting;

        scrollCue.classList.toggle("opacity-0", !isHeroVisible);
        scrollCue.classList.toggle("pointer-events-none", !isHeroVisible);
        scrollCue.classList.toggle("translate-y-2", !isHeroVisible);
      },
      { threshold: 0.05 },
    );

    cueObserver.observe(heroSection);
  }

  initScrollCue();

  function animateRandomNumber($element) {
    if ($element.data("animated-done")) return;
    $element.data("animated-done", true);

    const targetValue = String(
      $element.attr("data-target") || $element.data("value") || "100",
    ).replace(/[^0-9]/g, "");
    const targetNum = parseInt(targetValue, 10) || 0;
    const prefix = $element.attr("data-prefix") || "";
    const suffix =
      $element.attr("data-suffix") ||
      ($element.text().includes("+") ? "+" : "");
    const duration = parseInt($element.attr("data-duration"), 10) || 1500; // ms

    if (prefersReducedMotion) {
      $element.text(prefix + targetNum.toLocaleString("id-ID") + suffix);
      return;
    }

    const startTime = performance.now();
    const targetDigitsCount = String(targetNum).length;

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      if (progress < 1) {
        const lockedCount = Math.floor(easedProgress * targetDigitsCount);
        const targetStr = String(targetNum);

        let displayStr = "";
        for (let i = 0; i < targetDigitsCount; i++) {
          if (i < lockedCount) {
            displayStr += targetStr[i];
          } else {
            displayStr += Math.floor(Math.random() * 10);
          }
        }

        $element.html(
          `<span class="tracking-tight">${prefix}${displayStr}${suffix}</span>`,
        );

        requestAnimationFrame(updateCounter);
      } else {
        $element.html(
          `<span class="tracking-tight">${prefix}${targetNum.toLocaleString("id-ID")}${suffix}</span>`,
        );
        $element.addClass("number-locked");
      }
    }

    requestAnimationFrame(updateCounter);
  }

  function initRandomNumberSection() {
    const $statNumbers = $(".stat-number, .animated-random-number");

    if (!$statNumbers.length) return;

    if ("IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const $el = $(entry.target);
              const delay = parseInt($el.attr("data-delay"), 10) || 0;

              setTimeout(function () {
                animateRandomNumber($el);
              }, delay);

              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -40px 0px",
          threshold: 0.15,
        },
      );

      $statNumbers.each(function () {
        statsObserver.observe(this);
      });
    } else {
      let isTicking = false;
      function checkStatsScroll() {
        if (!isTicking) {
          requestAnimationFrame(function () {
            const windowBottom = $(window).scrollTop() + $(window).height();

            $statNumbers.each(function () {
              const $el = $(this);
              if (!$el.data("animated-done")) {
                const elTop = $el.offset().top;
                if (windowBottom > elTop + 40) {
                  const delay = parseInt($el.attr("data-delay"), 10) || 0;
                  setTimeout(function () {
                    animateRandomNumber($el);
                  }, delay);
                }
              }
            });
            isTicking = false;
          });
          isTicking = true;
        }
      }

      $(window).on("scroll resize", checkStatsScroll);
      checkStatsScroll();
    }
  }

  initRandomNumberSection();

  document.querySelectorAll(".stat-flip-card").forEach(function (card) {
    function toggleFlip() {
      const isFlipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-pressed", String(isFlipped));
    }

    card.addEventListener("click", toggleFlip);
    card.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleFlip();
      }
    });
  });
});
