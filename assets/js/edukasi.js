// Kategori
$(document).ready(function () {
  const $tabButtons = $(".tab-btn");
  const $items = $(".item");

  function setActiveTab(selectedFilter) {
    $tabButtons.each(function () {
      const isActive = $(this).data("filter") === selectedFilter;

      $(this)
        .toggleClass("active", isActive)
        .toggleClass(
          "bg-primary-500 text-white border-primary-500 font-semibold",
          isActive,
        )
        .toggleClass(
          "bg-white text-gray-700 border-gray-200 font-medium",
          !isActive,
        )
        .toggleClass("shadow-sm", isActive);
    });
  }

// Pencarian
  function animateFadeUp($targets) {

    $targets.css({
      display: "block",
      opacity: "0",
      transform: "translateY(20px)"
    });

    $targets.each(function (index) {
      const $el = $(this);
      setTimeout(function () {
        $el.css({
          opacity: "1",
          transform: "translateY(0)"
        });
      }, index * 50);
    });
  }

  function applyFilter(filterValue) {
    $items.css({
      display: "none",
      opacity: "0",
      transform: "translateY(20px)"
    });

    const $targetItems = (filterValue === "semua")
      ? $items
      : $items.filter('[data-category="' + filterValue + '"]');

    animateFadeUp($targetItems);
  }

  applyFilter("semua");

  $tabButtons.on("click", function () {
    const filterValue = $(this).data("filter");
    setActiveTab(filterValue);
    applyFilter(filterValue);
  });
});

$(document).ready(function() {
  var activeCategory = 'all';

  $('.filter-btn').on('click', function() {
    activeCategory = $(this).data('category');
    applyFilters();
  });

  $('#searchInput').on('keyup input', function() {
    applyFilters();
  });

  function applyFilters() {
    var searchValue = $('#searchInput').val().toLowerCase().trim();

    $('#itemList .item').each(function() {
      var itemText = $(this).text().toLowerCase();
      var itemCategory = $(this).attr('data-category');

      var matchesSearch = itemText.indexOf(searchValue) > -1;
      
      var matchesCategory = (activeCategory === 'all' || itemCategory === activeCategory);

      $(this).toggle(matchesSearch && matchesCategory);
    });
  }
});

$(document).ready(function () {
  
  $(document).on("click", ".item", function (e) {
    e.preventDefault();

    const category = $(this).find("span.uppercase").text().trim() || $(this).attr("data-category");
    const title = $(this).find("p").text().trim();
    
    $("#modalCategory").text(category);
    $("#modalTitle").text(title);

    const $template = $(this).find("template.card-details");

    if ($template.length > 0) {
      const $content = $($template.html());
      const mediaHTML = $content.filter(".media-content").html();
      const descHTML = $content.filter(".desc-content").html();

      if (mediaHTML && mediaHTML.trim() !== "") {
        $("#modalMedia").html(mediaHTML).removeClass("hidden");
      } else {
        $("#modalMedia").html("").addClass("hidden");
      }

      $("#modalDescription").html(descHTML);
    } else {

      $("#modalMedia").html("").addClass("hidden");
      $("#modalDescription").html("<p>Penjelasan detail materi belum tersedia.</p>");
    }

    $("#popupModal").removeClass("hidden").addClass("flex");
  });

  function closeModal() {
    $("#popupModal").removeClass("flex").addClass("hidden");
    $("#modalMedia").html("");
  }

  $(document).on("click", "#closeBtn", function () {
    closeModal();
  });

  $(document).on("click", "#popupModal", function (e) {
    if ($(e.target).is("#popupModal")) {
      closeModal();
    }
  });

});


$("#menuBtn").on("click", function () {
  $("#mobileMenu, #iconOpen, #iconClose").toggleClass("hidden grid");
});

$("#mobileMenu a").on("click", function () {
  $("#mobileMenu").addClass("hidden").removeClass("grid");
  $("#iconOpen").addClass("grid").removeClass("hidden");
  $("#iconClose").addClass("hidden").removeClass("grid");
});