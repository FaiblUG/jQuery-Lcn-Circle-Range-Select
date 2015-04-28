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
    
    <input type="text" class="circle-range-select" value="0;360">
    
The initial value can be defined via the value attribute:
    
    value="0;360"
   
It is also possible to override the min, max and unit options:
    
    data-min="0"
    data-max="360"
    data-unit="&deg;"
    
If you only need a single value instead of a range, you can add the data-single-value attribute.

    data-single-value
    
The value of the input form field then only consists of a single number and not a number pair.
    
### 3. Include Script and Styles
    
    <link rel="stylesheet" href="dist/jquery.lcnCircleRangeSelect.css">
    <script src="dist/jquery.lcnCircleRangeSelect.js"></script>
    
### 4. Initialize Widget
    
    <script>jQuery('input.circle-range-select').lcnCircleRangeSelect();</script>   
