var url = "https://docs.google.com/spreadsheets/d/14t01Pia4A6KoyVZx38M7j9T0z9jFnohSCrnT8uOm4EE/edit#gid=0"
var g1_url = g1.url.parse(location.href)
var sheets_global, names
var names_g = []

// var sentences = [
//   "<p class='my-0'>After the first lockdown on 25th May, Indian economy came to a standstill</p><p class='my-0'> `Lakhs of people started going back to their home towns/villages/cities` </p><p class='my-0'> `Many lost their lives from exhaustion while traveling... starvation... denial of medical care... suicide from financial distress...` </p><p class='my-0'> `These lives are not collateral damage` </p><p class='my-0'> `Remember them as we aim to build a better future`</p>"
// ]
// new Typed('.intro', {
//   strings: sentences,
//   typeSpeed: 30,
//   showCursor: false,
//   contentType: 'html'
// })

/*
  typed.js doesn't `type` sentences after the first one.
  So a simple declaration becomes nested pool of declarations.
*/

var s1 = ["After the first lockdown on 25th March, Indian economy came to a standstill"]
var s2 = ["Lakhs of people started going back to their home towns/villages/cities"]
var s3 = ["Hundreds lost their lives from exhaustion while traveling, starvation, denial of medical care, suicide from financial distress..."]
var s4 = ["These lives are not collateral damage"]
var s5 = ["Remember them as we aim to build a better future"]
new Typed('.s1', {
  strings: s1,
  typeSpeed: 30,
  showCursor: false,
  contentType: 'html',
  onComplete: function() {
    new Typed('.s2', {
      strings: s2,
      typeSpeed: 30,
      showCursor: false,
      contentType: 'html',
      onComplete: function() {
        new Typed('.s3', {
          strings: s3,
          typeSpeed: 30,
          showCursor: false,
          contentType: 'html',
          onComplete: function() {
            new Typed('.s4', {
              strings: s4,
              typeSpeed: 30,
              showCursor: false,
              contentType: 'html',
              onComplete: function() {
                new Typed('.s5', {
                  strings: s5,
                  typeSpeed: 30,
                  showCursor: false,
                  contentType: 'html',
                  onComplete: function() {
                    $('.names-container').removeClass('d-none')
                    $('footer').removeClass('d-none')
                  }
                })
              } // s4 oncomplete
            }) // typed s4
          } // s3 oncomplete
        }) // typed s3
      } // s2 oncomplete
    }) // typed s2
  } // s1 on complete
})

/**
  * fetch data from google spreadsheet
*/
function init() {
  Tabletop.init({
    key: url,
    callback: function(sheets_data, tabletop) {
      // data in Sheet1 sheet
      // console.log(sheets_data)
      sheets_global = _.filter(sheets_data.Sheet1.elements, function(each_row) {
        return each_row['status'] != "0";
      })
      names = _.map(sheets_global, 'value__name_age')

      _.each(names, function(name) {
        if(name.indexOf(';') > 0)
          names_g.push(_.map(name.split(';'), function(item) {
            return item.trim()
          }))
        else if(name.indexOf(',') > 0)
          names_g.push(_.map(name.split(','), function(item) {
            return item.trim()
          }))
        else if(name.indexOf(' and ') > 0)
          names_g.push(_.map(name.split(' and '), function(item) {
            return item.trim()
          }))
        else
          names_g.push(name.trim())
      })

      // 7 to 14 names in https://mobile.twitter.com/rachelchitra/status/1246960136947630086 thread
      var truck_collision_deaths = ['Rangappa (27)', 'Sharanappa (25)', 'Amaresh (18)', 'Kolappa (25)', 'Subash Patanshetty', 'Sridevi', 'Basamma (25)', 'Hanumantha (3)', "Basamma's Child (1)"]
      names_g.push(truck_collision_deaths)

      names_g = [].concat(...names_g)

      var s = 'his brother Jeetendra (30) and uncle Mohan Nishad (40)'
      var replace_strs = _.filter(names_g, function(item) { return item == s })[0].split('and')
      names_g.push(replace_strs[0].replace("his brother", "").trim())
      names_g.push(replace_strs[1].replace("uncle", "").trim())
      var ind = names_g.indexOf(s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      s = 'Ashfaq (75), Rajkumar Yadav (52), [both of whom died on April 11]'
      replace_strs = _.filter(names_g, function(item) { return item == s })[0].split(', [')
      replace_strs = replace_strs[0].split(',')
      names_g.push(replace_strs[0].trim())
      names_g.push(replace_strs[1].trim())
      ind = names_g.indexOf(s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      s = 'his wife Bhooli (60)'
      names_g.push('Bhooli (60)')
      ind = _.indexOf(names_g, s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      s = 'his wife Gurjinder Kaur (55)'
      names_g.push("Gurjinder Kaur (55)")
      ind = names_g.indexOf(s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      s = 'his wife Tulasi (60)'
      names_g.push("Tulasi (60)")
      ind = names_g.indexOf(s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      s = '12'
      ind = names_g.indexOf(s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      s = '5)'
      ind = names_g.indexOf(s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      s = 'Imran Khan (42) who passed away on 12'
      var replace_strs = _.filter(names_g, function(item) { return item == s })[0]
      names_g.push(replace_strs[0].replace("who passed away on 12", "").trim())
      ind = names_g.indexOf(s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      s = 'Jagarmath Maithil (80 - who passed away on April 8)'
      var replace_strs = _.filter(names_g, function(item) { return item == s })[0]
      names_g.push(replace_strs.replace(" - who passed away on April 8", "").trim())
      ind = names_g.indexOf(s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      s = 'Riyazuddin (72) [passed away on April 17]'
      var replace_strs = _.filter(names_g, function(item) { return item == s })[0]
      names_g.push(replace_strs.replace("[passed away on April 17]", "").trim())
      ind = names_g.indexOf(s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      s = 'Yunus (60) [passed  away on April 13]'
      var replace_strs = _.filter(names_g, function(item) { return item == s })[0]
      names_g.push(replace_strs.replace("[passed  away on April 13]", "").trim())
      ind = names_g.indexOf(s)
      if(ind != -1) {
        names_g.splice(ind, 1)
      }

      names_final = _.sortBy(
        _.filter(_.map(names_g, function(item){
          return _.capitalize(item)
        }), function(item) {
          return item != '' && item.indexOf('See 7 to 14') < 0 && item !== 'i' && item !== 'I' && item !== 'Other details'
        })
      )

      // render template
      $('.names').template({
        names: names_final
      })
    },
    simpleSheet: false
  })
}
window.addEventListener('DOMContentLoaded', init)

/*
Kalu Ram (55); X(70); Naresh Kartik (55)
Ayesha(63); Madhava (50)
Abdulghani Shiledar (65), Haseena Shiledar (60)
new born girl; 8 month old baby
Punit (20), Dharambir (21) and Jogender (20)
Ramesh Bhatt (55), Nikhil Pandya (32), Naresh Kalasuva (18) and Kaluram Bhagora (18)
Gopal Pandey,\n Usha Devi,\n Gunjan, Sunil
Krishna Sahu,\nPramila
Faisal abbas (38)Suraj Kumar (32)
Bijender, 25, and Harsh, 20, others
Ram Sakhi (33), daughters (14, 5), relative kailash (20), Shivaran (17), Ruchi (8), Madan Mohan
Kiruthika (1), Vijayamani (45), Maheswari (36), and Manjula (38)

1. remove \n characters - in column W, Sheet1
2. replace ', and ' with ', ' - in column W, Sheet1
   replace ' and ' with ', ' - in column W, Sheet1
  replace empty entries with Unspecified (38, 41 rows)
3. split by ;
4. split by ,
5. replace the following
  - "his brother Jeetendra" with "Jeetendra"
  - "uncle Mohan Nishad" with "Nishad"
6. split "Ashfaq (75), Rajkumar Yadav (52), [both of whom died on April 11]" by "," and remove "[both of whom died on April 11]"
*/
