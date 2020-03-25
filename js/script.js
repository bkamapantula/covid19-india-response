var misc_categories_uniq
var url = "https://docs.google.com/spreadsheets/d/1_JIaWdsm6fYPStN2fin0wt4ad2JSn8Sqt5bNeBZ4riM/edit?usp=sharing"

/**
  * fetch data from google spreadsheet, prepare for the page
*/
function init() {
  Tabletop.init({
    key: url,
    callback: function(sheets_data, tabletop) {
      // data in events sheet
      filtered_elements = _.filter(sheets_data.events.elements, function(each_row) {
        return each_row['status'] != "0";
      })
      $('.events-counter').html(filtered_elements.length + ' updates')
      g = _.groupBy(filtered_elements,
          "location")
      g_sorted = _(g).toPairs().sortBy(0).fromPairs().value()
      data = {data: g_sorted}
      var tmpl = _.template($("#item-template").html())
      $('#updates').html(tmpl(data))

      misc_categories = _.uniq(_.map(filtered_elements, function(item) { return item.misc }))
      m = _.map(misc_categories, function(item) { return item.split(',') })
      misc_categories_uniq = _.uniq([].concat.apply([], m))
      // trim " PDS" to "PDS" (and others), take a unique set of them
      misc_categories_uniq = _.uniq(_.map(misc_categories_uniq, function(item) { return item.trim() }))
      // console.log(misc_categories_uniq)
      $('#autocomplete').autocomplete({
        source: misc_categories_uniq,
        minLength: 0,
        select: function(evt, ui) {
          $(".state-card, h4").hide()
          $('span[data-category*="'+ ui.item.value + '"]').closest('.state-card').show()
          $('span[data-category*="'+ ui.item.value + '"]').closest('.state-card').siblings("h4").show()
          $('.events-counter').html($('span[data-category*="'+ ui.item.value + '"]').closest('.state-card').length + ' updates')
        }
      }).bind('focus', function () {
        // binds focus with autocomplete
        $(this).autocomplete("search")
      })
    },
    simpleSheet: false
  })
  $('body').urlfilter({target: '#'})
  var elems = document.querySelectorAll('.sidenav')
  var instances = M.Sidenav.init(elems)
}
window.addEventListener('DOMContentLoaded', init)

// brand font on mobile overflows, this is a hack to identify that and reset the font-size
if (typeof window.orientation !== 'undefined') {
  $('.brand-logo').css('font-size', '4vw')
} else {
  $('.brand-logo').css('font-size', '2.1rem')
}

$('body').on('click', 'a.btn', function() {
  $(".state-card, h4").show()
  $('.state-card').siblings("h4").show()
  $("#autocomplete").val('')
  $("[data-label]").removeClass('border-relief')
  $('.events-counter').html($('.state-card').length + ' updates')
}).on('click', '[data-label]', function() {
  var label = $(this).data("label")
  $("[data-label]").removeClass('border-relief')
  $("#autocomplete").val('')
  $(this).addClass('border-relief')
  $(".state-card, h4").hide()
  $('.events-counter').html($(".state-card[data-labeltarget='" + label + "']").length + ' updates')
  $(".state-card[data-labeltarget='" + label + "']").show()
  $(".state-card[data-labeltarget='" + label + "']").siblings("h4").show()
})
