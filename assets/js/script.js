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
      $iconOpen.removeClass("opacity-100 rotate-0 scale-100").addClass("opacity-0 -rotate-90 scale-75");
      $iconClose.removeClass("opacity-0 rotate-90 scale-75").addClass("opacity-100 rotate-0 scale-100");

    } else {
      $mobileMenu.stop(true, true).slideUp(180, function () {
        $(this).addClass("hidden").css("display", "");
      });
      $menuBtn.attr("aria-expanded", "false");
      $iconOpen.removeClass("opacity-0 -rotate-90 scale-75").addClass("opacity-100 rotate-0 scale-100");
      $iconClose.removeClass("opacity-100 rotate-0 scale-100").addClass("opacity-0 rotate-90 scale-75");
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

  const navbar = document.getElementById("navbar");

  if (navbar) {
    const updateNavbar = function () {
      navbar.classList.toggle("navbar-scrolled", window.scrollY > 24);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
  }

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

  function initScrollReveal() {
    const $items = $(".fade-up-item");
    if (!$items.length) return;

    if (prefersReducedMotion) {
      $items.addClass("is-visible");
      return;
    }

    let isTicking = false;

    function revealVisibleItems() {
      const viewportBottom = $(window).scrollTop() + $(window).height();

      $items.each(function () {
        const $item = $(this);
        if ($item.hasClass("is-visible")) return;

        const itemTop = $item.offset().top;
        if (viewportBottom >= itemTop - 30) {
          const delay = parseInt($item.css("--delay"), 10) || 0;
          $item.css("transition-delay", delay + "ms").addClass("is-visible");
        }
      });

      isTicking = false;
    }

    function requestReveal() {
      if (!isTicking) {
        window.requestAnimationFrame(revealVisibleItems);
        isTicking = true;
      }
    }

    $(window).on("scroll resize", requestReveal);
    requestReveal();
  }

  initScrollReveal();

  function initAssistantChat() {
    const $form = $("#assistantForm");
    const $input = $("#assistantInput");
    const $messages = $("#assistantMessages");
    const $prompts = $("[data-chat-prompt]");

    if (!$form.length || !$input.length || !$messages.length) return;

    function addMessage(message, isUser) {
      const $bubble = $("<div>", {
        class: isUser
          ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-slate-900 text-white p-4 text-sm font-medium leading-relaxed"
          : "max-w-[88%] rounded-2xl rounded-bl-sm border border-orange-200 bg-orange-50 p-4 text-sm leading-relaxed text-slate-800",
      });
      $bubble.text(message);
      $messages.append($bubble);
      $messages.scrollTop($messages[0].scrollHeight);
    }

    function getAssistantReply(question) {
      const normalizedQuestion = question.toLowerCase();

      if (
        normalizedQuestion.includes("bisindo") ||
        normalizedQuestion.includes("sibi")
      ) {
        return "BISINDO adalah bahasa isyarat alami yang berkembang di komunitas Tuli Indonesia. SIBI adalah sistem isyarat baku yang mengikuti struktur bahasa Indonesia. Mulai belajar dari kosakata dasar agar perbedaannya lebih mudah dipahami.";
      }

      if (
        normalizedQuestion.includes("sapa") ||
        normalizedQuestion.includes("panggil") ||
        normalizedQuestion.includes("etika")
      ) {
        return "Untuk menyapa teman Tuli, gunakan lambaian tangan dalam bidang pandang, sentuhan ringan pada bahu bila sudah dekat, atau minta bantuan orang di sekitarnya. Hindari berteriak atau menarik tubuhnya tiba-tiba.";
      }

      if (
        normalizedQuestion.includes("modul") ||
        normalizedQuestion.includes("pemula") ||
        normalizedQuestion.includes("mulai")
      ) {
        return "Untuk pemula, mulai dari Modul Edukasi: alfabet A-Z, angka dasar, lalu ungkapan harian. Setelah itu, gunakan Kamus untuk mengulang gestur dan Quiz untuk menguji pemahaman.";
      }

      return "Aku bisa membantu menjelaskan BISINDO dan SIBI, etika berkomunikasi dengan teman Tuli, atau memilih modul belajar untuk pemula. Coba tanyakan salah satunya, ya.";
    }

    function submitQuestion(question) {
      const cleanQuestion = question.trim();
      if (!cleanQuestion) return;

      addMessage(cleanQuestion, true);
      $input.val("").trigger("focus");

      const $typing = $(
        '<div class="assistant-typing max-w-[88%] rounded-2xl rounded-bl-sm border border-orange-200 bg-orange-50 p-4" aria-label="Asisten sedang mengetik"><span></span><span></span><span></span></div>',
      );
      $messages.append($typing);
      $messages.scrollTop($messages[0].scrollHeight);

      window.setTimeout(function () {
        $typing.remove();
        addMessage(getAssistantReply(cleanQuestion), false);
      }, 650);
    }

    $form.on("submit", function (event) {
      event.preventDefault();
      submitQuestion($input.val());
    });

    $prompts.on("click", function () {
      submitQuestion($(this).attr("data-chat-prompt"));
    });
  }

  initAssistantChat();

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

  /* Scroll-Driven Text Reveal for Cultural Quote */
  function initScrollDrivenQuoteReveal() {
    const quoteEl = document.getElementById("culturalQuoteText");
    const originalQuoteEl = document.getElementById("culturalQuoteOriginal");
    if (!quoteEl) return;

    if (prefersReducedMotion) {
      return;
    }

    const rawText = quoteEl.innerText.trim();
    if (!rawText) return;

    const words = rawText.split(/\s+/);
    quoteEl.innerHTML = "";

    const wordSpans = [];
    words.forEach(function (word, index) {
      const span = document.createElement("span");
      span.className = "scroll-word";
      span.textContent = word;

      quoteEl.appendChild(span);

      // Explicitly append a standard space text node so words never collapse together
      if (index < words.length - 1) {
        quoteEl.appendChild(document.createTextNode(" "));
      }

      wordSpans.push(span);
    });

    const totalWords = wordSpans.length;
    let ticking = false;

    function updateQuoteReveal() {
      const rect = quoteEl.getBoundingClientRect();
      const winHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Start reveal when quote reaches 82% from viewport top
      // Fully revealed when quote reaches 35% from viewport top
      const startY = winHeight * 0.82;
      const endY = winHeight * 0.35;

      let progress = (startY - rect.top) / (startY - endY);
      progress = Math.min(Math.max(progress, 0), 1);

      const overlap = 0.08;

      for (let i = 0; i < totalWords; i++) {
        const wordStart = (i / totalWords) * (1 - overlap);
        const wordEnd = wordStart + overlap + 1 / totalWords;
        const wordProgress = Math.min(
          Math.max((progress - wordStart) / (wordEnd - wordStart), 0),
          1,
        );

        // Smoothly reveal from muted 0.22 opacity to crisp 1.0 white
        const opacity = 0.22 + 0.78 * wordProgress;
        const span = wordSpans[i];

        span.style.opacity = opacity.toFixed(3);
        span.style.color = "#ffffff";
      }

      if (originalQuoteEl) {
        const subProgress = Math.min(Math.max((progress - 0.6) / 0.4, 0), 1);
        originalQuoteEl.style.opacity = (0.3 + 0.7 * subProgress).toFixed(2);
      }

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(updateQuoteReveal);
          ticking = true;
        }
      },
      { passive: true },
    );

    window.addEventListener("resize", function () {
      if (!ticking) {
        requestAnimationFrame(updateQuoteReveal);
        ticking = true;
      }
    });

    updateQuoteReveal();
  }

  /* Cultural Quote Ribbon Slide-In Animation */
  function initCulturalQuoteRibbon() {
    const sectionEl = document.getElementById("cultural-quote");
    const ribbonBg = document.getElementById("culturalQuoteRibbonBg");
    const contentEl = document.getElementById("culturalQuoteContent");
    if (!sectionEl || !ribbonBg) return;

    if (prefersReducedMotion) {
      ribbonBg.classList.remove("-translate-x-full");
      ribbonBg.classList.add("translate-x-0");
      if (contentEl) {
        contentEl.classList.remove("opacity-0", "-translate-x-8");
        contentEl.classList.add("opacity-100", "translate-x-0");
      }
      return;
    }

    let isRevealed = false;
    let ticking = false;

    function checkRibbonState() {
      const rect = sectionEl.getBoundingClientRect();
      const winHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Start when scrolling down and the section reaches 88% of the viewport
      if (rect.top <= winHeight * 0.88 && rect.bottom >= 0) {
        if (!isRevealed) {
          isRevealed = true;
          ribbonBg.classList.remove("-translate-x-full");
          ribbonBg.classList.add("translate-x-0");
          if (contentEl) {
            contentEl.classList.remove("opacity-0", "-translate-x-8");
            contentEl.classList.add("opacity-100", "translate-x-0");
          }
        }
      } else if (rect.top > winHeight * 0.95) {
        // Sebelum masuk / scroll kembali ke atas: twibbon kembali diam di kiri
        if (isRevealed) {
          isRevealed = false;
          ribbonBg.classList.remove("translate-x-0");
          ribbonBg.classList.add("-translate-x-full");
          if (contentEl) {
            contentEl.classList.remove("opacity-100", "translate-x-0");
            contentEl.classList.add("opacity-0", "-translate-x-8");
          }
        }
      }
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(checkRibbonState);
          ticking = true;
        }
      },
      { passive: true },
    );

    window.addEventListener("resize", function () {
      if (!ticking) {
        requestAnimationFrame(checkRibbonState);
        ticking = true;
      }
    });

    checkRibbonState();
  }

  initCulturalQuoteRibbon();
  initScrollDrivenQuoteReveal();
});
