/*
 * FuelUX Spinner
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

define(function(require) {

    var $ = require('jquery');


    // PILLBOX CONSTRUCTOR AND PROTOTYPE

    var Spinner = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn.spinner.defaults, options);
        this.$element.on('keyup', '.spinner-input', $.proxy(this.change, this));

        if(this.options.holdSpin){
            this.$element.on('mousedown', '.spinner-up', $.proxy(function(){this.startSpin(true);}, this));
            this.$element.on('mouseup', '.spinner-up', $.proxy(this.stopSpin, this));
            this.$element.on('mouseout', '.spinner-up', $.proxy(this.stopSpin, this));
            this.$element.on('mousedown', '.spinner-down', $.proxy(function(){this.startSpin(false);}, this));
            this.$element.on('mouseup', '.spinner-down', $.proxy(this.stopSpin, this));
            this.$element.on('mouseout', '.spinner-down', $.proxy(this.stopSpin, this));
        }else{
            this.$element.on('click', '.spinner-up', $.proxy(this.increment, this));
            this.$element.on('click', '.spinner-down', $.proxy(this.decrement, this));
        }

        this.switches = {
            count: 1,
            enabled: true
        };

        this.render();
    };

    Spinner.prototype = {
        constructor: Spinner,

        render: function(){
            this.$element.find('.spinner-input').val(this.options.value)
                                                .attr('maxlength',(this.options.maxValue + '').split('').length)
                                                ;
        },

        change: function(){
            this.options.value = this.$element.find('.spinner-input').val()/1;
            this.options.onChange();
        },

        stopSpin: function(){
            clearTimeout(this.switches.timeout);
            this.switches.count = 1;
            this.options.onChange();
        },

        startSpin: function(type){

            if(!this.options.disabled){
                var divisor = this.switches.count;

                if(divisor === 1){
                    this.increment(type);
                    divisor = 1;
                }else if(divisor < 3){
                    divisor = 1.5;
                }else if(divisor < 8){
                    divisor = 2.5;
                }else{
                    divisor = 4;
                }

                this.switches.timeout = setTimeout($.proxy(function(){this.iterator(type);},this),300/divisor);
                this.switches.count++;
            }
        },

        iterator: function(type){
            this.increment(type);
            this.startSpin(type);
        },

        increment: function(dir){
            var curValue = this.options.value,
                limValue = dir ? this.options.maxValue : this.options.minValue
                ;

            if((dir ? curValue < limValue : curValue > limValue)){
                var newVal = curValue + (dir ? 1 : -1)*this.options.increment;

                if(dir ? newVal > limValue : newVal < limValue){
                    this.setValue(limValue);
                }else{
                    this.setValue(newVal);
                }
            }
        },

        getValue: function(){
            return this.options.value;
        },

        setValue: function (value) {
            this.options.value = value;
            this.$element.find('.spinner-input').val(value);
        },

        disable: function() {
            this.options.disabled = true;
            this.$element.find('.spinner-input').attr('disabled','');
            this.$element.find('button').addClass('disabled');
        },

        enable: function() {
            this.options.disabled = false;
            this.$element.find('.spinner-input').removeAttr("disabled");
            this.$element.find('button').removeClass('disabled');
        },

        destroy: function() {
            this.$element.remove();
        }
    };


    // PILLBOX PLUGIN DEFINITION

    $.fn.spinner = function (option,value) {
        var methodReturn;

        var $set = this.each(function () {
            var $this = $(this);
            var data = $this.data('spinner');
            var options = typeof option === 'object' && option;

            if (!data) $this.data('spinner', (data = new Spinner(this, options)));
            if (typeof option === 'string') methodReturn = data[option](value);
        });

        return (methodReturn === undefined) ? $set : methodReturn;
    };

    $.fn.spinner.defaults = {
        value: 1,
        minValue: 1,
        maxValue: 999,
        increment: 1,
        onChange: $.noop,
        holdSpin: true,
        disabled: false
    };

    $.fn.spinner.Constructor = Spinner;


    // SPINNER DATA-API

    $(function () {
        $('body').on('mousedown.spinner.data-api', '.spinner', function (e) {
            var $this = $(this);
            if ($this.data('.spinner')) return;
            $this.spinner($this.data());
        });
    });

});