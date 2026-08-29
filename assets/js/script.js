$(function () {
  $("#menuBtn").on("click", function () {
    $("#mobileMenu").toggleClass("hidden grid");
  });

  $("#mobileMenu a").on("click", function () {
    $("#mobileMenu").addClass("hidden").removeClass("grid");
  });

  function isVisibleOnScroll($el) {
    const rect = $el[0].getBoundingClientRect();
    return rect.top < window.innerHeight * 0.9;
  }

  function revealFadeUp() {
    $(".fade-in, .fade-up-item").each(function () {
      const $el = $(this);

      if (isVisibleOnScroll($el) && !$el.hasClass("is-visible")) {
        $el.addClass("is-visible");
      }
    });
  }

  $(window).on("scroll resize load", revealFadeUp);
  revealFadeUp();

  function animateRandomLetterReveal($el, finalText) {
    const chars = Array.from(finalText);
    const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-";
    const $charNodes = [];

    $el.empty();

    chars.forEach(function (char) {
      const randomChar = pool[Math.floor(Math.random() * pool.length)];
      const $char = $("<span>")
        .addClass("reveal-char")
        .text(randomChar === " " ? "\u00A0" : randomChar);

      $el.append($char);
      $charNodes.push($char);
    });

    let revealedCount = 0;

    const interval = setInterval(function () {
      $charNodes.forEach(function ($char, index) {
        if (index < revealedCount) {
          const targetChar = chars[index] === " " ? "\u00A0" : chars[index];
          $char.text(targetChar).addClass("done");
        } else {
          const randomChar = pool[Math.floor(Math.random() * pool.length)];
          $char.text(randomChar === " " ? "\u00A0" : randomChar);
        }
      });

      revealedCount += 1;

      if (revealedCount > chars.length) {
        clearInterval(interval);
        $charNodes.forEach(function ($char, index) {
          const targetChar = chars[index] === " " ? "\u00A0" : chars[index];
          $char.text(targetChar).addClass("done");
        });
      }
    }, 150);
  }

  $(".stat-number").each(function () {
    const $el = $(this);
    const finalText = $el.data("value") || $el.text();
    const delay = Number($el.data("delay")) || 0;

    setTimeout(function () {
      animateRandomLetterReveal($el, finalText);
    }, delay);
  });
});
