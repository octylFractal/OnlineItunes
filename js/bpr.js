! function($) {

    var ProgressBar = function(element, options) {
        this.element = $(element);
        this.position = 0;
        this.percent = 0;

        var hasOptions = typeof options == 'object';

        this.mark2 = $.fn.progressbar.defaults.mark2;
        if (hasOptions && typeof options.mark2 == 'number') {
            this.setMark2(options.mark2);
        }

        this.mark3 = $.fn.progressbar.defaults.mark3;
        if (hasOptions && typeof options.mark3 == 'number') {
            this.setMark3(options.mark3);
        }

        this.maximum = $.fn.progressbar.defaults.maximum;
        if (hasOptions && typeof options.maximum == 'number') {
            this.setMaximum(options.maximum);
        }

        this.step = $.fn.progressbar.defaults.step;
        if (hasOptions && typeof options.step == 'number') {
            this.setStep(options.step);
        }

        this.element.html($(DRPGlobal.template));
    };

    ProgressBar.prototype = {
        constructor: ProgressBar,

        stepIt: function() {
            if (this.position < this.maximum)
                this.position += this.step;

            this.setPosition(this.position);
        },

        setMark2: function(marker) {
            marker = parseInt(marker);
            if (marker > this.mark3) {
                this.mark2 = this.mark3;
                return;
            }

            this.mark2 = marker;
        },

        setMark3: function(marker) {
            this.mark3 = parseInt(marker);
        },

        setMaximum: function(maximum) {
            this.maximum = parseInt(maximum);
        },

        setStep: function(step) {
            step = parseInt(step);
            if (step <= 0)
                step = 1;

            this.step = parseInt(step);
        },

        setPosition: function(position) {
            position = parseInt(position);
            if (position < 0)
                position = 0;
            if (position > this.maximum)
                position = this.maximum;

            this.position = position;
            this.percent = Math.ceil((this.position / this.maximum) * 100);

            try {
                if (this.percent <= this.mark2) {
                    this.element.find('.bar-danger').css('width', this.percent + "%");
                    this.element.find('.bar-warning').css('width', "0%");
                    this.element.find('.bar-success').css('width', "0%");
                    return;
                }

                this.element.find('.bar-danger').css('width', this.mark2 + "%");
                if (this.percent > this.mark2 && this.percent <= this.mark3) {
                    this.element.find('.bar-warning').css('width', (this.percent - this.mark2) + "%");
                    this.element.find('.bar-success').css('width', "0%");
                    return;
                }

                this.element.find('.bar-warning').css('width', (this.mark3 - this.mark2) + "%");
                this.element.find('.bar-success').css('width', (this.percent - this.mark3) + "%");

            } finally {
                this._triggerPositionChanged();
            }
        },

        reset: function() {
            this.position = 0;
            this.percent = 0;
            this._triggerPositionChanged();
            this.element.find('.bar-success').css('width', "0%");
            this.element.find('.bar-warning').css('width', "0%");
            this.element.find('.bar-danger').css('width', "0%");
        },

        _triggerPositionChanged: function() {
            this.element.trigger({
                type: "positionChanged",
                position: this.position,
                percent: this.percent
            });
        }
    };

    $.fn.progressbar = function(option) {
        var args = Array.apply(null, arguments);
        args.shift();
        return this.each(function() {
            var $this = $(this),
                data = $this.data('progressbar'),
                options = typeof option == 'object' && option;

            if (!data) {
                $this.data('progressbar', new ProgressBar(this, $.extend({}, $.fn.progressbar().defaults, options)));
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                data[option].apply(data, args);
            }
        });
    };

    $.fn.progressbar.defaults = {
        mark3: 50,
        mark2: 90,
        maximum: 100,
        step: 1
    };

    $.fn.progressbar.Constructor = ProgressBar;

    var DRPGlobal = {};

    DRPGlobal.template = '<span class="sr-only">Sorry, but this app is not avaliabel on screen readers.</span>' +
        '<div class="progress progress-striped">' +
        '<div class="bar bar-danger progress-bar progress-bar-danger" style="width: 0%;"></div>' +
        '<div class="bar bar-warning progress-bar progress-bar-warning" style="width: 0%;"></div>' +
        '<div class="bar bar-success progress-bar progress-bar-success" style="width: 0%;"></div>' +
        '</div>';

}(window.jQuery);
