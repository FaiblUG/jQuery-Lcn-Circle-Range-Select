(function($) {
  var isDragging = false;
  var $currentHandle = null;

  function drawCircle($container, degreeStart, degreeEnd) {
    var
      $canvas = $container.find('canvas'),
      canvas = $canvas[0]
    ;
    canvas.width = $container.width()+10;
    canvas.height = $container.height()+10;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();

    var radius = $container.width() / 2;

    context.arc(canvas.width / 2, canvas.height / 2 , radius, degreesToRadians(degreeStart)-Math.PI/2, degreesToRadians(degreeEnd)-Math.PI/2, false);
    context.lineWidth = 8;
    context.strokeStyle = $canvas.css('color');
    context.stroke();
  }

  function degreesToRadians (degrees) {
    return degrees * (Math.PI/180);
  }

  function updateWidget($container) {
    var $handles = $container.find('.handle');
    var $handle1 = $container.find('.handle1');
    var $handle2 = $container.find('.handle2');
    var width = $container.width();
    $container.height(width);
    var radius = width / 2;
    var sliderWidth = $handles.width();
    var sliderHeight = $handles.height();

    $handles.each(function(idx, handle) {
      var $handle = $(handle);
      var deg = $handle.attr('data-value');
      var X = Math.round(radius * Math.sin(deg*Math.PI/180));
      var Y = Math.round(radius * -Math.cos(deg*Math.PI/180));
      $handle.css({ left: X+radius-sliderWidth/2, top: Y+radius-sliderHeight/2 });
      $container.find($handle.attr('data-value-target')).html($handle.attr('data-value') + '&deg;');
    });

    value1 = $handle1.attr('data-value');
    value2 = $handle2.attr('data-value');
    drawCircle($container, value1, value2);
    $container.find('input').val(value1+';'+value2).trigger('change');
  }

  function init($input) {
    var values = $input.val() || '0;0';
    values = values.split(';');
    var value1 = parseInt(values[0], 10);
    var value2 = parseInt(values[1], 10);

    $container = $('<div class="circle-range-select-wrapper"></div>');
    $input.wrap($container);
    $container = $input.parent();

    $container.append('<div class="handle handle1" data-value="' + value1 + '" data-value-target=".value1"></div>');
    $container.append('<div class="handle handle2" data-value="' + value2 + '" data-value-target=".value2"></div>');
    $container.append('<div class="values"><span class="value1"></span> - <span class="value2"></span></div>');
    $container.append('<canvas class="selected-range"></canvas>');

    updateWidget($container);

    $container.on('mousedown touchstart', '.handle', function(e) {
      isDragging = true;
      e.preventDefault();
      $currentHandle = $(e.target);
      $(document).one('mouseup touchend', function() {
        isDragging = false;
        $currentHandle = null;
      });
    });

    $(window).on('resize', updateWidget.bind(null, $container));
  }

  $(document).on('mousemove touchmove', function (e) {
    if (isDragging) {
      var $container = $currentHandle.closest('.circle-range-select-wrapper');
      var radius = $container.width() / 2;

      if (!e.offsetX && e.originalEvent.touches) {
        // touch events
        var targetOffset = $(e.target).offset();
        e.offsetX = e.originalEvent.touches[0].pageX - targetOffset.left;
        e.offsetY = e.originalEvent.touches[0].pageY - targetOffset.top;
      }
      else if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
        // firefox compatibility
        var targetOffset = $(e.target).offset();
        e.offsetX = e.pageX - targetOffset.left;
        e.offsetY = e.pageY - targetOffset.top;
      }

      var mPos = {
        x: e.target.offsetLeft + e.offsetX,
        y: e.target.offsetTop + e.offsetY
      };

      var atan = Math.atan2(mPos.x - radius, mPos.y - radius);
      var deg = -atan / (Math.PI / 180) + 180; // final (0-360 positive) degrees from mouse position


      // for attraction to multiple of 90 degrees
      var distance = Math.abs( deg - ( Math.round(deg / 90) * 90 ) );

      if ( distance <= 5 ) {
        deg = Math.round(deg / 90) * 90;
      }

      if (deg == 360) {
        deg = 0;
      }

      var roundDeg = Math.round(deg);

      $currentHandle.attr('data-value', roundDeg);

      updateWidget($container);
    }
  });


  $.fn.lcnCircleRangeSelect = function() {
    return this.each(function() {
      init($(this));
    });

  };

})(jQuery);