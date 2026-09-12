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
      $mobileMenu.removeClass("hidden").addClass("flex flex-col").hide();
      $mobileMenu.stop(true, true).slideDown(260, function () {
        $(this).css("display", "");
      });
      $menuBtn.attr("aria-expanded", "true");
      $iconOpen.addClass("hidden");
      $iconClose.removeClass("hidden");
    } else {
      $mobileMenu.stop(true, true).slideUp(220, function () {
        $(this)
          .addClass("hidden")
          .removeClass("flex flex-col")
          .css("display", "");
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

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function initFadeUpAnimation() {
    const $fadeElements = $(".fade-in, .fade-up-item");

    if (prefersReducedMotion) {
      $fadeElements
        .addClass("is-visible")
        .css({ opacity: 1, transform: "none", "transition-delay": "0s" });
      return;
    }

    if ("IntersectionObserver" in window) {
      const observerOptions = {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.1,
      };

      const fadeObserver = new IntersectionObserver(function (
        entries,
        observer,
      ) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const $el = $(entry.target);
            $el.addClass("is-visible");

            const delay = parseFloat($el.css("transition-delay")) * 1000 || 0;
            const duration =
              parseFloat($el.css("transition-duration")) * 1000 || 500;
            setTimeout(function () {
              $el.css("transition-delay", "0s");
            }, delay + duration);

            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      $fadeElements.each(function () {
        fadeObserver.observe(this);
      });
    } else {
      function checkFadeUpScroll() {
        const windowBottom = $(window).scrollTop() + $(window).height();

        $fadeElements.each(function () {
          const $el = $(this);
          if (!$el.hasClass("is-visible")) {
            const elTop = $el.offset().top;
            if (windowBottom > elTop + 40) {
              $el.addClass("is-visible");
              setTimeout(function () {
                $el.css("transition-delay", "0s");
              }, 600);
            }
          }
        });
      }

      $(window).on("scroll resize", checkFadeUpScroll);
      checkFadeUpScroll();
    }
  }

  initFadeUpAnimation();

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
      function checkStatsScroll() {
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
      }

      $(window).on("scroll resize", checkStatsScroll);
      checkStatsScroll();
    }
  }

  initRandomNumberSection();
  $(".gesture-card").on("click", function () {
    $(this).addClass("scale-95");
    setTimeout(() => {
      $(this).removeClass("scale-95");
    }, 120);
  });
});
