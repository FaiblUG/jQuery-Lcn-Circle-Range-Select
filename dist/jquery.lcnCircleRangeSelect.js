(function (root, factory) {
  var $ = root.jQuery;

  if (typeof define === 'function' && define.amd) {
    // AMD
    if ($) {
      define([], factory.bind(null, $));
    }
    else {
      define(['jquery'], factory);
    }
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    if ($) {
      module.exports = factory($);
    }
    else {
      module.exports = factory(require('jquery'));
    }
  } else {
    // Browser globals (root is window)
    if ($) {
      factory($); // no global needed as we store it as a jQuery plugin on jQuery.fn
    }
    else {
      throw 'Missing required jQuery dependency';
    }
  }
}(this, function ($) {
  var isDragging = false;
  var $currentHandle = null;

  function drawCircle($container, degreeStart, degreeEnd) {
    var
      $canvas = $container.find('canvas'),
      canvas = $canvas[0]
    ;

    var outerWidth = $container.outerWidth();
    var innerWidth = $container.innerWidth();
    var borderWidth = outerWidth - innerWidth;
    $canvas.css('left', borderWidth*-1);
    $canvas.css('top', borderWidth*-1);


    var radius = (outerWidth - borderWidth / 2) / 2;
    canvas.width = outerWidth + borderWidth;
    canvas.height = canvas.width;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();



    context.arc(canvas.width / 2, canvas.width / 2,radius, degreesToRadians(degreeStart)-Math.PI/2, degreesToRadians(degreeEnd)-Math.PI/2, false);
    context.lineWidth = borderWidth/2;
    context.strokeStyle = $canvas.css('color');
    context.stroke();
  }

  function degreesToRadians (degrees) {
    return degrees * (Math.PI/180);
  }

  function updateWidget($container) {
    var $input = $container.find('input');
    var isSingleValue = _isSingleValue($input);
    if (isSingleValue) {
      var $handles = $container.find('.handle1');
      var $handle1 = $handles;
    }
    else {
      var $handles = $container.find('.handle');
      var $handle1 = $container.find('.handle1');
      var $handle2 = $container.find('.handle2');
    }

    var outerWidth = $container.outerWidth();
    var innerWidth = $container.innerWidth();
    var borderWidth = (outerWidth - innerWidth) / 2;
    var handleWidth = $handles.outerWidth();

    var radius = (outerWidth - borderWidth) / 2;


    var minValue = parseFloat($input.attr('data-min')) || 0;
    var maxValue = parseFloat($input.attr('data-max')) || 360;
    var unit = $input.attr('data-unit') === undefined ? '&deg;' : $input.attr('data-unit');
    var steps = maxValue - minValue;
    var stepSizeInDegrees = 360/steps;

    $handles.each(function(idx, handle) {
      var $handle = $(handle);
      var value = parseFloat($handle.attr('data-value'));
      var deg = (value - minValue)*stepSizeInDegrees;

      var X = Math.round(radius + radius * Math.sin(deg*Math.PI/180));
      var Y = Math.round(radius + radius * -Math.cos(deg*Math.PI/180));
      $handle.css({ left: X, top: Y });
      $container.find($handle.attr('data-value-target')).html($handle.attr('data-value') + unit);
    });

    value1 = $handle1.attr('data-value');
    if (isSingleValue) {
      $input.val(value1).trigger('change');
    }
    else {
      value2 = $handle2.attr('data-value');
      drawCircle($container, (value1 - minValue) * stepSizeInDegrees, (value2 - minValue) * stepSizeInDegrees);
      $input.val(value1 + ';' + value2).trigger('change');
    }
  }

  function init($input) {
    var isSingleValue = _isSingleValue($input);
    if (isSingleValue) {
      var value1 = parseFloat($input.val() || 0);
    }
    else {
      var values = $input.val() || '0;0';
      values = values.split(';');
      var value1 = parseFloat(values[0], 10);
      var value2 = parseFloat(values[1], 10);
    }


    $container = $('<div class="circle-range-select-wrapper"></div>');

    var backgroundImage = $input.attr('data-bg-image');
    if (backgroundImage) {
      $container.css({
        'background-image': 'url("' + backgroundImage + '")',
        'background-size': 'contain'
      });
    }

    $input.wrap($container);
    $container = $input.parent();

    $container.append('<div class="handle handle1" data-value="' + value1 + '" data-value-target=".value1"></div>');
    if (isSingleValue) {
      $container.append('<div class="values"><span class="value1"></span></div>');
    }
    else {
      $container.append('<div class="handle handle2" data-value="' + value2 + '" data-value-target=".value2"></div>');
      $container.append('<div class="values"><span class="value1"></span> - <span class="value2"></span></div>');
    }

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


  function _isSingleValue($input) {
    return $input.attr('data-single-value') !== undefined && $input.attr('data-single-value') !== 'false';
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

      var $input = $container.find('input');
      var minValue = parseFloat($input.attr('data-min')) || 0;
      var maxValue = parseFloat($input.attr('data-max')) || 360;
      var steps = maxValue - minValue;
      var stepSize = 360/steps;

      var value = minValue + Math.round(deg/stepSize);
      //if (value == maxValue) {
      //  value = minValue;
      //}


      $currentHandle.attr('data-value', value);

      updateWidget($container);
    }
  });


  $.fn.lcnCircleRangeSelect = function() {
    return this.each(function() {
      init($(this));
    });

  };

}));