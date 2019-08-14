//import('jquery.min.js')

'use strict'

var classes

$(function() {
  var w = $(window),
      d = $(document),

  classes = {
    common: {
        init: function() {
          this.toTop()
        }, // init

        toTop: function() {
          console.log('script ok')
          var $toTop = $('.to-top')
          w.on('scroll', function (e) {
            e.preventDefault()

            if (w.scrollTop() > 500) {
              $toTop.addClass('-show')
            } else {
              $toTop.removeClass('-show')
            }
          })

          $toTop.on('click', function (e) {
            e.preventDefault()

            $('html, body').animate({
              scrollTop: 0
            }, 500)
          })
        }, // to top
    }, // common
  }
  
  classes.common.init();
});