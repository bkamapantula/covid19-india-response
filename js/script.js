var misc_categories_uniq
var url = "https://docs.google.com/spreadsheets/d/1_JIaWdsm6fYPStN2fin0wt4ad2JSn8Sqt5bNeBZ4riM/edit?usp=sharing"
var g1_url = g1.url.parse(location.href)

/**
  * hide subset of state cards based on URL param or search param
  * @param {string} val 
*/
function toggle_state_cards(val, param) {
  $(".state-card, h4").hide()
  if(param === 'cat') {
    // partial matches of categories should work
    $(".state-card[data-category*='" + val + "']").show()
    $(".state-card[data-category*='" + val + "']").siblings("h4").show()
    $('.events-counter').html($('.state-card[data-category*="'+ val + '"]').length + ' updates')
  } else {
    $('.events-counter').html($(".state-card[data-labeltarget='" + val + "']").length + ' updates')
    $(".state-card[data-labeltarget='" + val + "']").show()
    $(".state-card[data-labeltarget='" + val + "']").siblings("h4").show()
  }
}

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
      render_subset() // if applicable based on URL param

      misc_categories = _.uniq(_.map(filtered_elements, function(item) { return item.misc }))
      m = _.map(misc_categories, function(item) { return item.split(',') })
      misc_categories_uniq = _.uniq([].concat.apply([], m))
      // trim " PDS" to "PDS" (and others), take a unique set of them
      misc_categories_uniq = _.uniq(_.map(misc_categories_uniq, function(item) { return item.trim() }))
      $('#autocomplete').autocomplete({
        source: misc_categories_uniq,
        minLength: 0,
        select: function(evt, ui) {
          // search by category
          toggle_state_cards(ui.item.value, 'cat')
          g1_url.update({cat: ui.item.value, view: null}, 'cat=toggle&view=del')
          history.pushState({}, '', g1_url.toString())
          $("[data-label]").removeClass('border-selected')
        }
      }).bind('focus', function () {
        // binds focus with autocomplete
        $(this).autocomplete("search")
      })
    },
    simpleSheet: false
  })

  $('body').urlfilter({target: 'pushState'})

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
  // reset
  $(".state-card, h4").show()
  $('.state-card').siblings("h4").show()
  $("#autocomplete").val('')
  $("[data-label]").removeClass('border-selected')
  $('.events-counter').html($('.state-card').length + ' updates')
  g1_url.update({cat: null, view: null}, 'del')
  history.pushState({}, '', g1_url.toString())
}).on('click', '[data-label]', function() {
  // government orders or welfare measures
  var label = $(this).data("label")
  $("[data-label]").removeClass('border-selected')
  $("#autocomplete").val('')
  $(this).addClass('border-selected')
  toggle_state_cards(label, 'view')

  g1_url.update({view: label, cat: null}, 'view=toggle&cat=del')
  history.pushState({}, '', g1_url.toString())
})

// if url has attributes (persistent share) render accordingly
function render_subset() {
  if(Object.keys(g1_url.searchKey).length > 0) {
    if(Object.keys(g1_url.searchKey).indexOf('cat') > -1) {  // ?cat=
      toggle_state_cards(g1_url.searchKey['cat'], 'cat')
    } if(Object.keys(g1_url.searchKey).indexOf('view') > -1) {  // ?view=
      toggle_state_cards(g1_url.searchKey['view'], 'view')
      $("[data-label='" + g1_url.searchKey.view + "']").addClass('border-selected')
    }
  }
}
