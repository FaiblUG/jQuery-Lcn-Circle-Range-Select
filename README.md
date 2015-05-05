jQuery-Lcn-Circle-Range-Select
==============================

360 degree circle range select input widget


Demo
----

[demo.html](http://cdn.rawgit.com/FaiblUG/jQuery-Lcn-Circle-Range-Select/master/demo.html)


Usage
-----

### 1. Include jQuery
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>

### 2. Include input form element which should contain your circle range (format "startDegrees;endDegrees")
    
    <input type="text" class="circle-range-select" data-auto-init value="0;360">

### 3. Include Script and Styles
    
    <link rel="stylesheet" href="dist/jquery.lcnCircleRangeSelect.css">
    <script src="dist/jquery.lcnCircleRangeSelect.js"></script>


### Options

#### The initial value can be defined via the value attribute:
    
    value="0;360"
   
#### It is also possible to override the min, max and unit options:
    
    data-min="0"
    data-max="360"
    data-unit="&deg;"
    
#### If you only need a single value instead of a range, you can add the data-single-value attribute.

    data-single-value

The value of the input form field then only consists of a single number and not a number pair.
    
#### You can add a background-image with data-bg-image.

    data-bg-image="http://..."

#### Initialize the widget manually

If you omit the data-auto-init attribute on your input tag or if you create input tags dynamically after the domReady event has fired, you need to initialize the widget manually:
    
    <script>jQuery('input.circle-range-select').lcnCircleRangeSelect();</script>   
