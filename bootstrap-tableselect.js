/**
 * Table row selection for Twitter Bootstrap
 * 
 * @author Birkir Gudjonsson (birkir.gudjonsson@gmail.com)
 * @copyright (c) 2013
 * @licence http://www.apache.org/licenses/LICENSE-2.0
 * @modified Joel Garcia - 2013/11/01
 * @modified Alex Fedorov - 2014/02/12
 * @modified Andrey F. Kupreychik - 2014/02/12
 */
(function ($) {

    'use strict';

    var old,
        TableSelect = function (element, options) {
            this.$element = $(element);
            this.options = $.extend({}, $.fn.tableselect.defaults, options);
            this.rows = [];
            this.lastSelected = null;
            this.listen();
        };

    /* TABLESELECT CLASS DEFINITION
     * ============================ */
    TableSelect.prototype = {

        constructor: TableSelect,

        click: function (e) {

            var row = $(e.currentTarget),
                els = this.$element.children('tbody').children('tr');

            if (this.keyCtrl !== true && this.keyShift !== true) {
                this.clear();
            }

            if (this.keyShift === true && this.lastSelected !== null) {
                if (this.lastSelected > row.index()) {
                    this.select(els.filter(':lt(' + this.lastSelected + '):gt(' + row.index() + ')'));
                } else {
                    this.select(els.filter(':lt(' + row.index() + '):gt(' + this.lastSelected + ')'));
                }
            }

            if (this.keyCtrl == true && row.hasClass(this.options.activeClass)){
                row.removeClass(this.options.activeClass);
            } else {
                this.select(row);
                // set last selected
                this.lastSelected = row.index();
            }

        },

        dblclick: function (e) {
            // event handler placeholder
        },

        clear: function () {
            this.$element.children('tbody').children('tr').removeClass(this.options.activeClass);
            this.rows = [];
        },

        select: function (elm) {
            var that = this,
                e = $.Event('select');
            elm.each(function () {
                if($(this).css('display') != 'none') {
                    $(this).addClass(that.options.activeClass);
                }
                that.rows.push($(this).index());
            });
            this.$element.trigger(e, [this.rows]);
        },

        listen: function () {
            var that = this;

            this.$element.delegate('tbody > tr', 'click.tableselect', $.proxy(this.click, this));
            this.$element.delegate('tbody > tr', 'dblclick.tableselect', $.proxy(this.dblclick, this));

            $(document).on('keydown.tableselect keyup.tableselect', function (e) {
                if (e.type === 'keydown') {
                    that.$element
                        .attr('unselectable', 'on')
                        .css({
                            '-moz-user-select'   : 'none',
                            '-webkit-user-select': 'none',
                            'user-select'        : 'none'
                        })
                        .on('selectstart', false);
                }

                if (e.type === 'keyup') {
                    that.$element
                        .attr('unselectable', 'off')
                        .css({
                            '-moz-user-select'   : '',
                            '-webkit-user-select': '',
                            'user-select'        : ''
                        })
                        .off('selectstart');
                }

                if (e.keyCode === 16) {
                    that.keyShift = (e.type === 'keydown');
                }

                if (e.keyCode === 17) {
                    that.keyCtrl = (e.type === 'keydown');
                }

                if (e.type === 'keydown' && e.keyCode === 65 && that.keyCtrl == true) {
                    that.select(that.$element.children('tbody').children('tr'));
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
            });
        },

        remove: function() {
            this.$element.undelegate('.tableselect');
            $('document').off('.tableselect');
            delete this.$element.data().tableselect;
        }
    };

    /* TABLESELECT PLUGIN DEFINITION
     * ============================= */

    old = $.fn.tableselect;

    $.fn.tableselect = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('tableselect'),
                options = $.extend({}, $.fn.tableselect.defaults, $this.data(), typeof option === 'object' && option);

            if (!data) {
                $this.data('tableselect', (data = new TableSelect(this, options)));
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.tableselect.defaults = {
        multiple: true,
        activeClass: 'highlighted' // success, error, warning, info
    };

    /* TABLESELECT NO CONFLICT
     * ======================= */

    $.fn.tableselect.Constructor = TableSelect;

    $.fn.tableselect.noConflict = function () {
        $.fn.tableselect = old;
        return this;
    };

}(window.jQuery));
