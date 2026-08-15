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