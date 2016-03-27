(function (window) {

    window.viewportSize = {};

    window.viewportSize.getHeight = function () {
        return getSize("Height");
    };

    window.viewportSize.getWidth = function () {
        return getSize("Width");
    };

    var getSize = function (Name) {
        var size;
        var name = Name.toLowerCase();
        var document = window.document;
        var documentElement = document.documentElement;
        if (window["inner" + Name] === undefined) {
            // IE6 & IE7 don't have window.innerWidth or innerHeight
            size = documentElement["client" + Name];
        }
        else if (window["inner" + Name] != documentElement["client" + Name]) {
            // WebKit doesn't include scrollbars while calculating viewport size so we have to get fancy

            // Insert markup to test if a media query will match document.doumentElement["client" + Name]
            var bodyElement = document.createElement("body");
            bodyElement.id = "vpw-test-b";
            bodyElement.style.cssText = "overflow:scroll";
            var divElement = document.createElement("div");
            divElement.id = "vpw-test-d";
            divElement.style.cssText = "position:absolute;top:-1000px";
            // Getting specific on the CSS selector so it won't get overridden easily
            divElement.innerHTML = "<style>@media(" + name + ":" + documentElement["client" + Name] + "px){body#vpw-test-b div#vpw-test-d{" + name + ":7px!important}}</style>";
            bodyElement.appendChild(divElement);
            documentElement.insertBefore(bodyElement, document.head);

            if (divElement["offset" + Name] == 7) {
                // Media query matches document.documentElement["client" + Name]
                size = documentElement["client" + Name];
            }
            else {
                // Media query didn't match, use window["inner" + Name]
                size = window["inner" + Name];
            }
            // Cleanup
            documentElement.removeChild(bodyElement);
        }
        else {
            // Default to use window["inner" + Name]
            size = window["inner" + Name];
        }
        return size;
    };

})(this);

(function (window, document, undefined) {


    var prefixes = ['webkit', 'Moz', 'ms', 'O']; /* Vendor prefixes */
    var animations = {}; /* Animation rules keyed by their name */
    var useCssAnimations;


    function createEl(tag, prop) {
        var el = document.createElement(tag || 'div');
        var n;

        for (n in prop) {
            el[n] = prop[n];
        }
        return el;
    }

    function ins(parent /* child1, child2, ...*/) {
        for (var i = 1, n = arguments.length; i < n; i++) {
            parent.appendChild(arguments[i]);
        }
        return parent;
    }

    /**
     * Insert a new stylesheet to hold the @keyframe or VML rules.
     */
    var sheet = function () {
        var el = createEl('style');
        ins(document.getElementsByTagName('head')[0], el);
        return el.sheet || el.styleSheet;
    }();

    /**
     * Creates an opacity keyframe animation rule and returns its name.
     * Since most mobile Webkits have timing issues with animation-delay,
     * we create separate rules for each line/segment.
     */
    function addAnimation(alpha, trail, i, lines) {
        var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-');
        var start = 0.01 + i / lines * 100;
        var z = Math.max(1 - (1 - alpha) / trail * (100 - start), alpha);
        var prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase();
        var pre = prefix && '-' + prefix + '-' || '';

        if (!animations[name]) {
            sheet.insertRule(
              '@' + pre + 'keyframes ' + name + '{' +
              '0%{opacity:' + z + '}' +
              start + '%{opacity:' + alpha + '}' +
              (start + 0.01) + '%{opacity:1}' +
              (start + trail) % 100 + '%{opacity:' + alpha + '}' +
              '100%{opacity:' + z + '}' +
              '}', 0);
            animations[name] = 1;
        }
        return name;
    }

    /**
     * Tries various vendor prefixes and returns the first supported property.
     **/
    function vendor(el, prop) {
        var s = el.style;
        var pp;
        var i;

        if (s[prop] !== undefined) return prop;
        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        for (i = 0; i < prefixes.length; i++) {
            pp = prefixes[i] + prop;
            if (s[pp] !== undefined) return pp;
        }
    }

    /**
     * Sets multiple style properties at once.
     */
    function css(el, prop) {
        for (var n in prop) {
            el.style[vendor(el, n) || n] = prop[n];
        }
        return el;
    }

    /**
     * Fills in default values.
     */
    function merge(obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i];
            for (var n in def) {
                if (obj[n] === undefined) obj[n] = def[n];
            }
        }
        return obj;
    }

    /**
     * Returns the absolute page-offset of the given element.
     */
    function pos(el) {
        var o = { x: el.offsetLeft, y: el.offsetTop };
        while ((el = el.offsetParent)) {
            o.x += el.offsetLeft;
            o.y += el.offsetTop;
        }
        return o;
    }

    var defaults = {
        lines: 12,            // The number of lines to draw
        length: 7,            // The length of each line
        width: 5,             // The line thickness
        radius: 10,           // The radius of the inner circle
        rotate: 0,            // rotation offset
        color: '#000',        // #rgb or #rrggbb
        speed: 1,             // Rounds per second
        trail: 100,           // Afterglow percentage
        opacity: 1 / 4,         // Opacity of the lines
        fps: 20,              // Frames per second when using setTimeout()
        zIndex: 2e9,          // Use a high z-index by default
        className: 'spinner', // CSS class to assign to the element
        top: 'auto',          // center vertically
        left: 'auto'          // center horizontally
    };

    /** The constructor */
    var Spinner = function Spinner(o) {
        if (!this.spin) return new Spinner(o);
        this.opts = merge(o || {}, Spinner.defaults, defaults);
    };

    Spinner.defaults = {};
    merge(Spinner.prototype, {
        spin: function (target) {
            this.stop();
            var self = this;
            var o = self.opts;
            var el = self.el = css(createEl(0, { className: o.className }), { position: 'relative', zIndex: o.zIndex });
            var mid = o.radius + o.length + o.width;
            var ep; // element position
            var tp; // target position

            if (target) {
                target.insertBefore(el, target.firstChild || null);
                tp = pos(target);
                ep = pos(el);
                css(el, {
                    left: (o.left == 'auto' ? tp.x - ep.x + (target.offsetWidth >> 1) : o.left + mid) + 'px',
                    top: (o.top == 'auto' ? tp.y - ep.y + (target.offsetHeight >> 1) : o.top + mid) + 'px'
                });
            }

            el.setAttribute('aria-role', 'progressbar');
            self.lines(el, self.opts);

            if (!useCssAnimations) {
                // No CSS animation support, use setTimeout() instead
                var i = 0;
                var fps = o.fps;
                var f = fps / o.speed;
                var ostep = (1 - o.opacity) / (f * o.trail / 100);
                var astep = f / o.lines;

                !function anim() {
                    i++;
                    for (var s = o.lines; s; s--) {
                        var alpha = Math.max(1 - (i + s * astep) % f * ostep, o.opacity);
                        self.opacity(el, o.lines - s, alpha, o);
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1000 / fps));
                }();
            }
            return self;
        },
        stop: function () {
            var el = this.el;
            if (el) {
                clearTimeout(this.timeout);
                if (el.parentNode) el.parentNode.removeChild(el);
                this.el = undefined;
            }
            return this;
        },
        lines: function (el, o) {
            var i = 0;
            var seg;

            function fill(color, shadow) {
                return css(createEl(), {
                    position: 'absolute',
                    width: (o.length + o.width) + 'px',
                    height: o.width + 'px',
                    background: color,
                    boxShadow: shadow,
                    transformOrigin: 'left',
                    transform: 'rotate(' + ~~(360 / o.lines * i + o.rotate) + 'deg) translate(' + o.radius + 'px' + ',0)',
                    borderRadius: (o.width >> 1) + 'px'
                });
            }
            for (; i < o.lines; i++) {
                seg = css(createEl(), {
                    position: 'absolute',
                    top: 1 + ~(o.width / 2) + 'px',
                    transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
                    opacity: o.opacity,
                    animation: useCssAnimations && addAnimation(o.opacity, o.trail, i, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
                });
                if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), { top: 2 + 'px' }));
                ins(el, ins(seg, fill(o.color, '0 0 1px rgba(0,0,0,.1)')));
            }
            return el;
        },
        opacity: function (el, i, val) {
            if (i < el.childNodes.length) el.childNodes[i].style.opacity = val;
        }
    });

    /////////////////////////////////////////////////////////////////////////
    // VML rendering for IE
    /////////////////////////////////////////////////////////////////////////

    /**
     * Check and init VML support
     */
    !function () {

        function vml(tag, attr) {
            return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr);
        }

        var s = css(createEl('group'), { behavior: 'url(#default#VML)' });

        if (!vendor(s, 'transform') && s.adj) {

            // VML support detected. Insert CSS rule ...
            sheet.addRule('.spin-vml', 'behavior:url(#default#VML)');

            Spinner.prototype.lines = function (el, o) {
                var r = o.length + o.width;
                var s = 2 * r;

                function grp() {
                    return css(vml('group', { coordsize: s + ' ' + s, coordorigin: -r + ' ' + -r }), { width: s, height: s });
                }

                var margin = -(o.width + o.length) * 2 + 'px';
                var g = css(grp(), { position: 'absolute', top: margin, left: margin });

                var i;

                function seg(i, dx, filter) {
                    ins(g,
                      ins(css(grp(), { rotation: 360 / o.lines * i + 'deg', left: ~~dx }),
                        ins(css(vml('roundrect', { arcsize: 1 }), {
                            width: r,
                            height: o.width,
                            left: o.radius,
                            top: -o.width >> 1,
                            filter: filter
                        }),
                          vml('fill', { color: o.color, opacity: o.opacity }),
                          vml('stroke', { opacity: 0 }) // transparent stroke to fix color bleeding upon opacity change
                        )
                      )
                    );
                }

                if (o.shadow) {
                    for (i = 1; i <= o.lines; i++) {
                        seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)');
                    }
                }
                for (i = 1; i <= o.lines; i++) seg(i);
                return ins(el, g);
            };
            Spinner.prototype.opacity = function (el, i, val, o) {
                var c = el.firstChild;
                o = o.shadow && o.lines || 0;
                if (c && i + o < c.childNodes.length) {
                    c = c.childNodes[i + o]; c = c && c.firstChild; c = c && c.firstChild;
                    if (c) c.opacity = val;
                }
            };
        }
        else {
            useCssAnimations = vendor(s, 'animation');
        }
    }();

    window.Spinner = Spinner;

})(window, document);

(function ($) {
    $.fn.spin = function (opts, color) {
        var presets = {
            "tiny": { lines: 8, length: 2, width: 2, radius: 3 },
            "small": { lines: 8, length: 4, width: 3, radius: 5 },
            "large": { lines: 10, length: 8, width: 4, radius: 8 }
        };
        if (Spinner) {
            return this.each(function () {
                var $this = $(this),
                data = $this.data();

                if (data.spinner) {
                    data.spinner.stop();
                    delete data.spinner;
                }
                if (opts !== false) {
                    if (typeof opts === "string") {
                        if (opts in presets) {
                            opts = presets[opts];
                        } else {
                            opts = {};
                        }
                        if (color) {
                            opts.color = color;
                        }
                    }
                    data.spinner = new Spinner($.extend({ color: $this.css('color') }, opts)).spin(this);
                }
            });
        } else {
            throw "Spinner class not available.";
        }
    };
    $.jNotify = {
        defaults: {
            /** VARS - OPTIONS **/
            autoHide: true,				// Notify box auto-close after 'TimeShown' ms ?
            clickOverlay: false,			// if 'clickOverlay' = false, close the notice box on the overlay click ?
            MinWidth: 200,					// min-width CSS property
            TimeShown: 1500, 				// Box shown during 'TimeShown' ms
            ShowTimeEffect: 200, 			// duration of the Show Effect
            HideTimeEffect: 200, 			// duration of the Hide effect
            LongTrip: 15,					// in pixel, length of the move effect when show and hide
            HorizontalPosition: 'center', 	// left, center, right
            VerticalPosition: 'top',	 // top, center, bottom
            ShowOverlay: true,				// show overlay behind the notice ?
            ColorOverlay: '#000',			// color of the overlay
            OpacityOverlay: 0.3,			// opacity of the overlay

            /** METHODS - OPTIONS **/
            onClosed: null,
            onCompleted: null
        },

        /*****************/
        /** Init Method **/
        /*****************/
        init: function (msg, options, id) {
            opts = $.extend({}, $.jNotify.defaults, options);

            /** Box **/
            if ($("#" + id).length == 0)
                $Div = $.jNotify._construct(id, msg);

            // Width of the Brower
            WidthDoc = parseInt($(window).width());
            HeightDoc = parseInt($(window).height());

            // Scroll Position
            ScrollTop = parseInt($(window).scrollTop());
            ScrollLeft = parseInt($(window).scrollLeft());

            // Position of the jNotify Box
            posTop = $.jNotify.vPos(opts.VerticalPosition);
            posLeft = $.jNotify.hPos(opts.HorizontalPosition);

            // Show the jNotify Box
            if (opts.ShowOverlay && $("#jOverlay").length == 0)
                $.jNotify._showOverlay($Div);

            $.jNotify._show(msg);
        },

        /*******************/
        /** Construct DOM **/
        /*******************/
        _construct: function (id, msg) {
            $Div = $('<div id="' + id + '"/>')
			.css({ opacity: 0, minWidth: opts.MinWidth })
			.html(msg)
			.appendTo('body');
            return $Div;
        },

        /**********************/
        /** Postions Methods **/
        /**********************/
        vPos: function (pos) {
            switch (pos) {
                case 'top':
                    var vPos = ScrollTop + parseInt($Div.outerHeight(true) / 2);
                    break;
                case 'center':
                    var vPos = ScrollTop + (HeightDoc / 2) - (parseInt($Div.outerHeight(true)) / 2);
                    break;
                case 'bottom':
                    var vPos = ScrollTop + HeightDoc - parseInt($Div.outerHeight(true));
                    break;
            }
            return vPos;
        },

        hPos: function (pos) {
            switch (pos) {
                case 'left':
                    var hPos = ScrollLeft;
                    break;
                case 'center':
                    var hPos = ScrollLeft + (WidthDoc / 2) - (parseInt($Div.outerWidth(true)) / 2);
                    break;
                case 'right':
                    var hPos = ScrollLeft + WidthDoc - parseInt($Div.outerWidth(true));
                    break;
            }
            return hPos;
        },

        /*********************/
        /** Show Div Method **/
        /*********************/
        _show: function (msg) {
            $Div
			.css({
			    top: posTop,
			    left: posLeft
			});
            switch (opts.VerticalPosition) {
                case 'top':
                    $Div.animate({
                        top: posTop + opts.LongTrip,
                        opacity: 1
                    }, opts.ShowTimeEffect, function () {
                        if (opts.onCompleted) opts.onCompleted();
                    });
                    if (opts.autoHide)
                        $.jNotify._close();
                    else
                        $Div.css('cursor', 'pointer').click(function (e) {
                            $.jNotify._close();
                        });
                    break;
                case 'center':
                    $Div.animate({
                        opacity: 1
                    }, opts.ShowTimeEffect, function () {
                        if (opts.onCompleted) opts.onCompleted();
                    });
                    if (opts.autoHide)
                        $.jNotify._close();
                    else
                        $Div.css('cursor', 'pointer').click(function (e) {
                            $.jNotify._close();
                        });
                    break;
                case 'bottom':
                    $Div.animate({
                        top: posTop - opts.LongTrip,
                        opacity: 1
                    }, opts.ShowTimeEffect, function () {
                        if (opts.onCompleted) opts.onCompleted();
                    });
                    if (opts.autoHide)
                        $.jNotify._close();
                    else
                        $Div.css('cursor', 'pointer').click(function (e) {
                            $.jNotify._close();
                        });
                    break;
            }
        },

        _showOverlay: function (el) {
            var overlay =
			$('<div id="jOverlay" />')
			.css({
			    backgroundColor: opts.ColorOverlay,
			    opacity: opts.OpacityOverlay
			})
			.appendTo('body')
			.show();

            if (opts.clickOverlay)
                overlay.click(function (e) {
                    e.preventDefault();
                    opts.TimeShown = 0; // Thanks to Guillaume M.
                    $.jNotify._close();
                });
        },


        _close: function () {
            switch (opts.VerticalPosition) {
                case 'top':
                    if (!opts.autoHide)
                        opts.TimeShown = 0;
                    $Div.stop(true, true).delay(opts.TimeShown).animate({ // Tanks to Guillaume M.
                        top: posTop - opts.LongTrip,
                        opacity: 0
                    }, opts.HideTimeEffect, function () {
                        $(this).remove();
                        if (opts.ShowOverlay && $("#jOverlay").length > 0)
                            $("#jOverlay").remove();
                        if (opts.onClosed) opts.onClosed();
                    });
                    break;
                case 'center':
                    if (!opts.autoHide)
                        opts.TimeShown = 0;
                    $Div.stop(true, true).delay(opts.TimeShown).animate({ // Tanks to Guillaume M.
                        opacity: 0
                    }, opts.HideTimeEffect, function () {
                        $(this).remove();
                        if (opts.ShowOverlay && $("#jOverlay").length > 0)
                            $("#jOverlay").remove();
                        if (opts.onClosed) opts.onClosed();
                    });
                    break;
                case 'bottom':
                    if (!opts.autoHide)
                        opts.TimeShown = 0;
                    $Div.stop(true, true).delay(opts.TimeShown).animate({ // Tanks to Guillaume M.
                        top: posTop + opts.LongTrip,
                        opacity: 0
                    }, opts.HideTimeEffect, function () {
                        $(this).remove();
                        if (opts.ShowOverlay && $("#jOverlay").length > 0)
                            $("#jOverlay").remove();
                        if (opts.onClosed) opts.onClosed();
                    });
                    break;
            }
        },

        _isReadable: function (id) {
            if ($('#' + id).length > 0)
                return false;
            else
                return true;
        }
    };

    /** Init method **/
    jNotify = function (msg, options) {
        if ($.jNotify._isReadable('jNotify'))
            $.jNotify.init(msg, options, 'jNotify');
    };

    jSuccess = function (msg, options) {
        if ($.jNotify._isReadable('jSuccess'))
            $.jNotify.init(msg, options, 'jSuccess');
    };

    jError = function (msg, options) {
        if ($.jNotify._isReadable('jError'))
            $.jNotify.init(msg, options, 'jError');
    };
    jNotify_on = function () {
        return !($.jNotify._isReadable('jError'));

    };
    $.ajaxSetup({
        cache: false,
        // dataType: 'html',
        error: function (xhr, status, error) {
            if (xhr.responseText == "") {
                switch (status) {
                    case "error":
                        alertError("Opps, Connection error. Either you are off line or the server is down. Check your connection and try again");
                        break;
                    case "abort":
                        alertError("Opps, Connection Aborted. Please try again");
                        break;
                    case "timeout":
                        alertError("Opps, Connection Time out. Please try again");
                        break;
                    default:
                        alertError("Opps, Something is wrong. Please do try again or contact system admin");
                }
            }
            else { alertError(xhr.responseText); }
            hide_waiting();
        },
        timeout: 60000, // Timeout of 60 seconds
        type: 'POST'

    });



})(jQuery);
(function ($) {

    $.fn.uncheckableRadio = function () {

        return this.each(function () {
            $(this).mousedown(function () {
                $(this).data('wasChecked', this.checked);
            });

            $(this).click(function () {
                if ($(this).data('wasChecked'))
                    this.checked = false;
            });
        });

    };

})(jQuery);
(function ($) {
    $.fn.scrollView = function (margin) {
        return this.each(function () {
            $('html, body').animate({
                scrollTop: $(this).offset().top + margin
            }, 1000);
        });
    }
})(jQuery);

(function ($) {
    $.fn.inView = function (inViewType) {
        var viewport = {};
        viewport.top = $(window).scrollTop();
        viewport.bottom = viewport.top + $(window).height();
        var bounds = {};
        bounds.top = this.offset().top;
        bounds.bottom = bounds.top + this.outerHeight();
        switch (inViewType) {
            case 'bottomOnly':
                return ((bounds.bottom <= viewport.bottom) && (bounds.bottom >= viewport.top));
            case 'topOnly':
                return ((bounds.top <= viewport.bottom) && (bounds.top >= viewport.top));
            case 'both':
                return ((bounds.top >= viewport.top) && (bounds.bottom <= viewport.bottom));
            default:
                return ((bounds.top >= viewport.top) && (bounds.bottom <= viewport.bottom));
        }
    };
})(jQuery);
var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "Other";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
    },

    searchString: function (data) {
        for (var i = 0 ; i < data.length ; i++) {
            var dataString = data[i].string;
            this.versionSearchString = data[i].subString;

            if (dataString.indexOf(data[i].subString) != -1) {
                return data[i].identity;
            }
        }
    },

    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },

    dataBrowser:
    [
        { string: navigator.userAgent, subString: "Chrome", identity: "Chrome" },
        { string: navigator.userAgent, subString: "MSIE", identity: "Explorer" },
        { string: navigator.userAgent, subString: "Firefox", identity: "Firefox" },
        { string: navigator.userAgent, subString: "Safari", identity: "Safari" },
        { string: navigator.userAgent, subString: "Opera", identity: "Opera" }
    ]

};

var wb = null;
var wb_connected = false;
var Web_Socket = {
    func: null,
    socket: null,
    connect: function (host) {
        if ('WebSocket' in window) {
            this.socket = new WebSocket(host);
        } else if ('MozWebSocket' in window) {
            this.socket = new MozWebSocket(host);
        } else {
            alertError('Error: WebSocket is not supported by this browser.');
            return;
        }

        this.socket.onopen = function () {
            wb_connected = true;
            if (Web_Socket.func != null) {
                Web_Socket.func();
                //this.func();
            }
        };

        this.socket.onclose = function () {
            wb_connected = false;
        };

        this.socket.onmessage = function (message) {
            //notify_success(message.data);
            var response = message.data;
            var msg = response.toString().split(";");
            //var span = $("<span></span>");
            if (msg[0] == "OK") {
                //$(span).addClass("msg")
                alertSuccess(msg[1]);
            }
            else {
                //$(span).addClass("error")
                alertError(msg[1]);

            }
            //$(span).html("scheduled message response " + msg[1]);
            //$("div.label_bar").append($(span));

        };


    },
    close: function () {
        this.socket.close();
    },
    initialize: function (cmd) {
        this.func = cmd;
        var paths = window.location.pathname.split('/');
        var url = paths.length == 2 ? (window.location.host + '/ResponseNotification.jsp') : (window.location.host + '/' + paths[1] + '/ResponseNotification.jsp');
        //alert(url);
        if (window.location.protocol == 'http:') {
            this.connect('ws://' + url);
        } else {
            this.connect('wss://' + url);
        }

    }
}
var upload_window = null;

function load_cnt(url, params, callback) {

    if (url == '') return;
    hide_overlay();
    show_waiting();
    var d = new Date();
    if (!params) params = {};
    params.tt = d;
    callback = typeof (callback) == 'undefined' ? set_cnt : callback;
    $.post(url, params, callback, 'html');
}

function change_cnt_view(elem, url, module) {
    hide_com_panel();
    var menu = $(elem).parents('li.main_menu');
    load_cnt(url, {}, function (responseText) {
        try {
            set_cnt(responseText);
        }
        finally {
            menu.siblings('li.main_menu').removeClass("active");
            menu.addClass("active");

        }

    });
}

function load_cnt2(url, fm, callback) {
    var params = $(fm).serialize();
    load_cnt(url, params, callback);
}

function custom_search_rep(elem_id, url, offset, c_param) {
    show_waiting();
    var params = c_param;
    params += "&s_offset=" + offset;
    var elem = $("#" + elem_id);
    $.post(url, params, function (responseText) {
        hide_waiting();
        $(elem).html(responseText).fadeIn("slow");
    }, 'html');
}

function loadContent(elem_id, url, params) {
    if (url == '') return;
    var elem = $("#" + elem_id);
    var d = new Date();
    if (!params) params = {};
    params.tt = d;
    show_waiting();
    $.post(url, params, function (responseText) {
        hide_waiting();
        elem.html(responseText).fadeIn("slow");
        if (!elem.inView("topOnly")) {
            elem.scrollView(-80);
        }
    }, 'html');
}
function set_cnt(text) {
    hide_waiting();
    $("#head-nav").html(text);
}
function load_modal_dialog(elem) {
    var rel = $(elem).attr('rel');
    var overlay = $("<div></div>");
    var modal = $("<div></div>");
    $(overlay).addClass("overlay");
    $(overlay).css("width", $(window).width());
    $(overlay).css("height", $(window).height());
    $(modal).addClass("dialog");
    $(modal).css("width", $("#" + rel).width());
    var m_h = $("#" + rel).height();
    $(modal).html($("#" + rel).html());
    var left = ($(window).width() - $(modal).width()) / 2
    $(modal).css("left", left);
    var top = $(window).height() < m_h ? 10 : ($(window).height() - m_h) / 2;
    var top2 = $(window).height() * 0.2;
    top = top < top2 ? top : top2;
    $(modal).css("top", top);
    $("body").prepend($(overlay));
    $(overlay).show();
    $("body").append($(modal));

}

function load_ajax_modal_dialog(url, params, elem) {
    var modal = $("<div id='modal_sap_dialog'></div>");
    //alert("called");
    show_waiting();
    $.post(url, params, function (responseText, status, xhr) {
        if (xhr.status == 200) {
            hide_waiting();

            $(modal).addClass("modal fade");
            $(modal).html(responseText);

            var left = ($(window).width() - $(modal).width()) / 2

            var top = ($(window).height() - $(modal).height()) / 2
            var top2 = $(window).height() * .2;
            top = top < top2 ? top : top2;

            $(modal).on('hidden.bs.modal', function (e) {
                $("#modal_sap_dialog").remove();
            });
            $("body").append($(modal));
            $(modal).modal();

        }
    });
}

function load_modal_dialog2(responseText) {
    hide_waiting();
    var overlay = $("<div></div>");
    var modal = $("<div></div>");
    $(overlay).addClass("overlay");
    $(overlay).css("width", $(window).width());
    $(overlay).css("height", $(window).height());
    $("body").prepend($(overlay));
    $(overlay).show();
    $(modal).addClass("dialog");
    $(modal).html(responseText);
    $("body").append($(modal));
    var left = ($(window).width() - $(modal).width()) / 2
    $(modal).css("left", left);
    var top = ($(window).height() - $(modal).height()) / 2
    var top2 = $(window).height() * .2;
    top = top < top2 ? top : top2;
    $(modal).css("top", top);

}

function change_page(responseText, query) {

    var d = new Date();
    var url = responseText;
    if (query) { url = responseText + "&t=" + encodeURIComponent(d.toString()); }
    else { url = responseText + "?t=" + encodeURIComponent(d.toString()); }
    show_waiting();
    window.location.replace(url);

}

function show_waiting() {
    if ($("#modal_sap_dialog").length > 0)
        $("#modal_sap_dialog").spin();
    else {
        $("#head-nav").spin();
    }
}

function hide_overlay() {
    $('#modal_sap_dialog').modal('hide');
}
function hide_waiting() {
    if ($("#modal_sap_dialog").length > 0)
        $("#modal_sap_dialog").spin(false);
    else {
        $("#head-nav").spin(false);
    }
}
var notification_handler = {
    msg: ''

}
function ajax_error(responseText) {
    hide_waiting();
    hide_waiting();
    notification_handler.msg = responseText;
    //hide_overlay();
    if (jNotify_on()) $.jNotify._close();
    jError(notification_handler.msg,
            {
                autoHide: false,
                clickOverlay: true,
                MinWidth: 250,
                TimeShown: 3000,
                ShowTimeEffect: 200,
                HideTimeEffect: 200,
                LongTrip: 20,
                HorizontalPosition: 'center',
                VerticalPosition: 'top',
                ShowOverlay: true,
                ColorOverlay: '#000',
                OpacityOverlay: 0.3,
                onClosed: function () { },
                onCompleted: function () { }
            }
);
}
function notify_success(responseText) {
    hide_waiting();
    notification_handler.msg = responseText;
    hide_overlay();
    if (jNotify_on()) $.jNotify._close();
    jSuccess(notification_handler.msg,
            {
                autoHide: false,
                clickOverlay: true,
                MinWidth: 250,
                TimeShown: 3000,
                ShowTimeEffect: 200,
                HideTimeEffect: 200,
                LongTrip: 20,
                HorizontalPosition: 'center',
                VerticalPosition: 'top',
                ShowOverlay: true,
                ColorOverlay: '#000',
                OpacityOverlay: 0.3,
                onClosed: function () { },
                onCompleted: function () { }
            }
);
}

var validateElement = {
    stripWhitespace: function (str, c) { if (typeof (c) == 'undefined') { c = ''; } return str.replace(/\s+/g, c); },
    indicate_error: function (element, message) {

        $(element).removeClass("input_all_normal");
        $(element).addClass("input_all_error");
        $(element).attr("title", message);

    },
    make_normal: function (element) {

        $(element).removeClass("input_all_error");
        $(element).addClass("input_all_normal");
        $(element).attr("title", "");

    },
    isValidName: function (element) {
        $(element).val(this.stripWhitespace($(element).val(), ' '));
        var p = /^(([a-zA-Z]{2,}\.)\s)?([a-zA-Z]{3,})\s(([a-zA-Z]+)?\s)?([a-zA-Z]{3,})\s?$/g;
        var isValid = $(element).val().match(p);
        if (isValid) {

            this.make_normal(element)

        }
        else {

            this.indicate_error(element, "Invalid name format")


        }
        return isValid;

    },
    isValidAddress: function (element) {

        $(element).val(this.stripWhitespace($(element).val(), ' '));
        var p = /^((\w+)\s){5,}$/g;
        var isValid = $(element).val().match(p);
        if (isValid) {

            this.make_normal(element)

        }
        else {

            this.indicate_error(element, "Invalid address, addree too short")


        }
        return isValid;
    },
    isValidEmail: function (element) {
        var p = /^([a-zA-Z0-9_\-\.]+)@((\ [[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}| [0-9]{1,3})(\]?)$/;
        var isValid = p.test($(element).val());
        if (isValid) {

            this.make_normal(element);

        }
        else {

            this.indicate_error(element, "Invalid email address format");


        }
        return isValid;

    },
    isValidMoney: function (element) {
        var p = /^([0-9]+)(\.[0-9]{1,2})?$/;
        var isValid = p.test($(element).val());
        if (isValid) {

            this.make_normal(element);

        }
        else {

            this.indicate_error(element, "Invalid money format");


        }
        return isValid;

    },
    isValidRange: function (element) {
        //var val = parseInt(element.value);
        var isValid = (parseFloat(element.minval) <= parseFloat(element.value)) && (parseFloat(element.value) <= parseFloat(element.maxval));
        //alert(isValid);
        if (isValid) {

            this.make_normal(element);

        }
        else {

            this.indicate_error(element, "The value is out of acceptable range. The value must be between " + element.minval + " and " + element.maxval);


        }
        return isValid;

    },
    isValidPhone: function (element) {
        var p = /^[\(\)\s\-\+\d]{10,17}$/;
        var isValid = p.test($(element).val());
        if (isValid) {

            this.make_normal(element);

        }
        else {

            this.indicate_error(element, "Invalid phone format");


        }
        return isValid;

    },
    isValidTime: function (element) {
        var p = /^(([0-9]|[0][0-9]|[1][0-2]):([0-5][0-9])(:([0-5][0-9]))?\s([Aa][Mm]|[Pp][Mm]))$/;
        var dinput = $(element);
        var isValid = p.test(dinput.val());
        if (isValid) {
            var d = new Date();
            var ds = d.toDateString();
            if (dinput.data("timelt")) {
                var updateval = $("#" + dinput.data("uelem")).val() || dinput.data("uval");
                var udate = new Date(ds + " " + updateval), ddate = new Date(ds + " " + dinput.val());
                isValid = udate >= ddate;
                if (!isValid) this.indicate_error(element, dinput.data("verror"));
                else this.make_normal(element);
            }
            else if (dinput.data("timegt")) {
                var lowdateval = $("#" + dinput.data("lelem")).val() || dinput.data("lval");
                var ldate = new Date(ds + " " + lowdateval), ddate = new Date(ds + " " + dinput.val());
                isValid = ldate <= ddate;
                if (!isValid) this.indicate_error(element, dinput.data("verror"));
                else this.make_normal(element);
            }
            else if (dinput.data("timerange")) {
                var lowdateval = $("#" + dinput.data("lelem")).val() || dinput.data("lval");
                var updateval = $("#" + dinput.data("uelem")).val() || dinput.data("uval");
                var ldate = new Date(ds + " " + lowdateval), udate = new Date(ds + " " + updateval), ddate = new Date(ds + " " + dinput.val());
                isValid = ldate <= ddate || udate >= ddate;
                if (!isValid) this.indicate_error(element, dinput.data("verror"));
                else this.make_normal(element);
            }

            // this.make_normal(element);

        }
        else {

            this.indicate_error(element, "Invalid time format ");


        }
        return isValid;

    },
    isValidDate: function (element) {
        var p = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/;
        var dinput = $(element);
        var isValid = p.test(dinput.val());
        if (isValid) {
            var parts = dinput.val().split("-");

            if ((parts[1] == "02") && (parts[2] == "30" || parts[2] == "31")) {
                this.indicate_error(element, "Invalid date format");
                isValid = false;
            }
            else if ((parts[1] == "04" || parts[1] == "06" || parts[1] == "09" || parts[1] == "11") && (parts[2] == "31")) {
                this.indicate_error(element, "Invalid date format");
                isValid = false;
            }
            else if (dinput.data("datelt")) {
                var updateval = $("#" + dinput.data("uelem")).val() || dinput.data("uval");
                var udate = new Date(updateval), ddate = new Date(dinput.val());
                isValid = udate >= ddate;
                if (!isValid) this.indicate_error(element, dinput.data("verror"));
                else this.make_normal(element);
            }
            else if (dinput.data("dategt")) {
                var lowdateval = $("#" + dinput.data("lelem")).val() || dinput.data("lval");
                var ldate = new Date(lowdateval), ddate = new Date(dinput.val());
                isValid = ldate <= ddate;
                if (!isValid) this.indicate_error(element, dinput.data("verror"));
                else this.make_normal(element);
            }
            else if (dinput.data("daterange")) {
                var lowdateval = $("#" + dinput.data("lelem")).val() || dinput.data("lval");
                var updateval = $("#" + dinput.data("uelem")).val() || dinput.data("uval");
                var ldate = new Date(lowdateval), udate = new Date(updateval), ddate = new Date(dinput.val());
                isValid = ldate <= ddate || udate >= ddate;
                if (!isValid) this.indicate_error(element, dinput.data("verror"));
                else this.make_normal(element);
            }
            else { this.make_normal(element); }

        }
        else {

            this.indicate_error(element, "Invalid date format ");


        }
        return isValid;

    },
    isValid: function (element) {
        var isValid = true;
        var $element = $(element);
        var id = $element.attr('id');
        var name = $element.attr('name');
        var value = $element.val();

        // <input> uses type attribute as written in tag
        // <textarea> has intrinsic type of 'textarea'
        // <select> has intrinsic type of 'select-one' or 'select-multiple'
        var type = $element[0].type.toLowerCase();
        switch (type) {
            case 'text':
            case 'textarea':
            case 'password':
                if (this.stripWhitespace(value, '').length == 0) { isValid = false; }
                break;
            case 'select-one':
            case 'select-multiple':
                if (!value) { isValid = false; }
                break;
            case 'checkbox':
            case 'radio':
                if ($('input[name="' + name + '"]:checked').length == 0) { isValid = false; };
                break;
        } // close switch()
        // instead of $(selector).method we are going to use $(selector)[method]
        // choose the right method, but choose wisely
        if (type == 'checkbox' || type == 'radio') {
            $('input[name="' + name + '"]').each(function () { });
        } else {
            if (isValid) {

                this.make_normal(element)

            }
            else {

                this.indicate_error(element, "This field should not be empty")


            }

        }
        // after initial validation, allow elements to re-validate on change
        $element

        return isValid;
    },
    further_validation: function (element) {

        if (element.isemail) {
            element.valid_input = this.isValidEmail(element);
        }

        if (element.isname) {
            element.valid_input = this.isValidName(element);

        }

        if (element.isadress) {
            element.valid_input = this.isValidAddress(element);

        }
        if (element.ismoney) {
            element.valid_input = this.isValidMoney(element);

        }
        if (element.islimited) {
            element.valid_input = this.isValidRange(element);


        }
        if (element.isphone) {
            element.valid_input = this.isValidPhone(element);

        }
        if (element.istime) {
            element.valid_input = this.isValidTime(element);

        }
        if (element.isdate) {
            element.valid_input = this.isValidDate(element);

        }



    },
    validate: function (element) {

        if (element.not_required) {
            if (this.stripWhitespace($(element).val(), '').length == 0) {;
                element.valid_input = true;
                this.make_normal(element);
            }
            else {
                element.valid_input = true; this.further_validation(element);
            }

        }
        if (element.isrequired) {
            element.valid_input = this.isValid(element)
            if (element.valid_input)
                this.further_validation(element);

        }

        var $element = $(element);
        $element
    .unbind('change.validate')
    .bind('change.validate', function () {
        if (validateElement.validate(this))
            if (this.frm.validated(this.frm))
                $("#error_msg", $(element.frm)).fadeOut("slow");

    }

            );

        if (!element.valid_input)
            $("#error_msg", $(element.frm)).html("Please correct errors in the highlighted boxes<br>Place Mouse over the field to view error description ").fadeIn("slow");

        return element.valid_input;
    }
}

function add_validation(form, cmd, custom_validate, inoverlay) {
    //alert("called");
    var fm = form;
    var fmm = form.get(0);
    //alert(fmm.name);
    $("input[numonly='1']").bind('keydown', function (event) {
        var keyCode = event.which;
        var isStandard = (keyCode > 47 && keyCode < 58);
        var isExtended = (keyCode > 95 && keyCode < 106);
        var validKeyCodes = ',8,37,38,39,40,46,';
        var isOther = (validKeyCodes.indexOf(',' + keyCode + ',') > -1);
        if (isStandard || isExtended || isOther) {
            return true;
        } else {
            return false;
        }
    }).bind('blur', function () {
        var pattern = new RegExp('[^0-9]+', 'g');
        var $input = $(this);
        var value = $input.val();
        value = value.replace(pattern, '');
        $input.val(value)
    });


    $("input[date='1']").datepicker({ dateFormat: 'yy-mm-dd', constrainInput: true, changeMonth: true, changeYear: true, yearRange: "1900:2090" });
    $("input[time='1']").datetimepicker({
        timeOnly: true,
        timeFormat: 'hh:mm tt'
    });
    $("button[name='back']").bind('click', function (event) {

        var url = $("#backurl").val();
        var dataToSend = $(fm).serialize();
        var typeOfDataToReceive = 'html';
        $.post(url, dataToSend, set_cnt, typeOfDataToReceive);
    });
    //$("input[type='file']").bind('click', function (event) {
    //    event.preventDefault();
    //    var cod = $(this).position();
    //    var url = $("#" + $(this).attr('id') + "_link").val();
    //    uploadwindow(url, cod.top, cod.left);
    //});

    $(fm).submit(function (event) {
        event.preventDefault();
        var isErrorFree = true;

        //alert(this.name);
        this.init_elems(this);
        if (this.validated(this) == false) {

            isErrorFree = true;
            $.each(this.elem, function () {

                if (validateElement.validate(this) == false) {
                    isErrorFree = false;
                }

            });
            if (isErrorFree) {

                if (custom_validate) {

                    isErrorFree = custom_validate($(this));
                }

            }
            if (isErrorFree) { this.do_submit(this); }
        }
        else {

            if (custom_validate) {

                isErrorFree = custom_validate($(this));
            }

            if (isErrorFree) { this.do_submit(this); }

        }
        return false;

    });
    fmm.elem = {};

    fmm.clear_init_elems = function (form_this, delete_required) {
        form_this.elem = {};
        if (delete_required) {
            $('input, select, textarea', $(form_this)).each(function () { delete this.isrequired });
        }
        form_this.init_elems(form_this);
    }
    fmm.init_elems = function (form_this) {
        $('input.required, select.required, textarea.required', $(form_this)).each(function () {
            this.isrequired = true;
            this.valid_input = false;
            this.frm = form_this;
            form_this.elem[$(this).attr("name")] = this;

        });
        $("input[email='1']", $(form_this)).each(function () {
            this.isemail = true;
            this.valid_input = false;
            this.frm = form_this;
            form_this.elem[$(this).attr("name")] = this;
        });
        $("input[phone='1']", $(form_this)).each(function () {
            this.isphone = true;
            this.valid_input = false;
            this.frm = form_this;

            form_this.elem[$(this).attr("name")] = this;

        });
        $("input[personname='1']", $(form_this)).each(function () {
            this.isname = true;
            this.valid_input = false;
            this.frm = form_this;

            form_this.elem[$(this).attr("name")] = this;

        });
        $("input[adressbox='1'],texarea[adressbox='1']", $(form_this)).each(function () {
            this.isadress = true;
            this.valid_input = false;
            this.frm = form_this;

            form_this.elem[$(this).attr("name")] = this;

        });
        $("input[money='1']", $(form_this)).each(function () {
            this.ismoney = true;
            this.valid_input = false;
            this.frm = form_this;
            form_this.elem[$(this).attr("name")] = this;

        });
        $("input[limited='1']", $(form_this)).each(function () {
            this.islimited = true;
            this.valid_input = false;
            this.frm = form_this;
            this.maxval = $(this).attr("maxval");
            this.minval = $(this).attr("minval");
            form_this.elem[$(this).attr("name")] = this;

        });
        $("input[time='1']", $(form_this)).each(function () {
            this.istime = true;
            this.valid_input = false;
            this.frm = form_this;

            form_this.elem[$(this).attr("name")] = this;

        });

        $("input[date='1']", $(form_this)).each(function () {
            this.isdate = true;
            this.valid_input = false;
            this.frm = form_this;

            form_this.elem[$(this).attr("name")] = this;

        });
        $("input:not(input[type='hidden'],input[type='file'],input[type='submit'],input[type='reset'],input.required),select:not(select.required),textarea:not(textarea.required)", $(this)).each(function () {
            this.not_required = true;
            this.valid_input = false;
            this.frm = form_this;
            form_this.elem[$(this).attr("name")] = this;

        });
        //$(".required",$(form_this)).prev("label").addClass("required_label");
        $(".required", $(form_this)).each(function (index, element) {
            $('label[for="' + element.id + '"]').addClass("required_label");
        });
    }
    fmm.validated = function (form_this) {
        isErrorFree = true;
        $.each(form_this.elem, function () {
            if (!this.valid_input) {
                isErrorFree = false;
            };
        });
        return isErrorFree;

    };

    fmm.do_submit = function (form_this) {
        $("#error_msg", form_this).fadeOut("slow");
        cmd = typeof (cmd) == 'undefined' ? set_cnt : cmd;
        var $this = $(this);
        var url = $this.attr('action');
        var typeOfDataToReceive = 'html';
        var multiPart = $this.attr("enctype") == "multipart/form-data";
        var success = function (responseText) {
            hide_overlay();
            hide_waiting();
            if (!($this.hasClass("dont_reset"))) {
                $this[0].reset();
                $('input.required, select.required, textarea.required', $this).each(function () {
                    this.valid_input = false;
                });
                isErrorFree = false;
            }
            cmd(responseText);
        }
        show_waiting();
        if (multiPart) {
            var fd = new FormData(this);
            $.ajax({
                url: url,
                type: "POST",
                data: fd,
                processData: false,
                contentType: false,
                success: success,
                error: function (xhr) {
                    alertError(xhr.responseText);
                    hide_waiting();
                }

            });
        }
        else {
            var multiForm = fm.data('includefrom');
            var dataToSend = multiForm ? $('.' + multiForm).serialize() : fm.serialize();
            $.post(url, dataToSend, success, typeOfDataToReceive);
        }


    };
    //notify_success(fmm);

    /* $(".required",fm).prev("label").addClass("required_label"); */
    //$(".required", fm).each(function (index, element) {
    //    $('label[for="' + element.id + '"]').addClass("required_label");

    //});
    //alert(fm);
    $("input, select, textarea", fm).each(function (index, element) {
        $(element).hasClass("required") ? $('label[for="' + element.id + '"]').addClass("required_label") :
        $('label[for="' + element.id + '"]').addClass("empty_label");

    });
}

function logout(url) {

    $.post(url, {}, change_page, 'html');

}

function ajax_success_page_change(responseText) {
    var msg = responseText.toString().split(";");
    if (msg[0] == "OK") {
        var d = new Date();
        var url = msg[1] + "?t=" + encodeURIComponent(d.toString());
        show_waiting();
        window.location.replace(url);

    }
    else {
        alertError(msg[1]);
    }
}


function is_picture_file(name, bt_id) {

    var type = name.slice(name.lastIndexOf('.'));
    if (jQuery.inArray(type, [".jpg", ".png", ".gif"])) {
        alertSuccess("file not image. only .jpg, .png and .gif is allowed");
        $("#" + bt_id).attr("disabled", 1);
    }
    else { $("#" + bt_id).removeAttr("disabled"); }
}


function login_callback(responseText) {
    hide_waiting();
    //alert(responseText);
    var msg = responseText.toString().split(";");
    if (msg[0] == "OK") {
        change_page(msg[1]);
    }
    else { $("#error_msg").html(msg[1]).fadeIn("slow"); }
}

function confirm_password(fm, p1ID, p2ID) {

    var result = false;
    var p1 = $("#" + p1ID).val();
    var p2 = $("#" + p2ID).val();
    if (p1 == '' || p2 == '') return result;
    if (p1 == p2)
        result = true;
    else {
        alertError("Password do not match");
    }
    return result;

}
function change_page(responseText, query) {

    var d = new Date();
    var url = responseText;
    if (query) { url = responseText + "&t=" + encodeURIComponent(d.toString()); }
    else { url = responseText + "?t=" + encodeURIComponent(d.toString()); }
    //show_waiting();
    window.location.replace(url);

}

function indicate_transact(cl, url, param) {
    //notify_success(url);
    //show_waiting();
    var elem_class = cl;
    $.post(url, param, function (responseText) {
        //hide_waiting();        
        var valid = responseText.trim();

        $("a." + elem_class + " span.badge").remove();
        if (0 < parseInt(valid)) {
            var s = $("<span class='badge badge-important animated bounceIn'></span>");
            $(s).html(valid);
            $("a." + elem_class).append($(s));
        }

    }, 'html');
}

function _transact(l, t, u, i, c, msg, get_note) {


    if (confirm(msg + " Press Ok to Continue, Cancel to Stop")) {

        var type = t;
        var vurl = u;
        var cl = c;
        var url = l;
        if (get_note) {
            show_prompt("Reason For Rejection", function (msg) {
                if (msg == "") {
                    alertError("Enter reason for rejection");
                    return;
                }
                msg = msg.replace(/(\r?\n)+/g, '<br />');

                $.post(url, { t_type: type, id: i, note: msg }, function (responseText) {
                    hide_overlay();
                    load_cnt('list_dirty_transacts.jsp', { t_type: type, v_url: vurl });
                    indicate_transact(c + "_dirty_transaction", "load_dirty.jsp", { t_type: type });
                    indicate_transact(c + "_reject_transaction", "load_rejected.jsp", { t_type: type });
                }, 'html');

            });
            return;
        }
        $.post(url, { t_type: type, id: i }, function (responseText) {
            hide_overlay();
            load_cnt('list_dirty_transacts.jsp', { t_type: type, v_url: vurl });
            indicate_transact(c + "_dirty_transaction", "load_dirty.jsp", { t_type: type });

        }, 'html');
    }
    //return false;
}

function show_prompt(text, callback) {
    var modal = $("<div class='modal-dialog'></div>");
    var modal_content = $("<div class='modal-content'> </div>");
    var modal_body = $("<div class='modal-body'></div>");
    var modal_footer = $("<div class='modal-footer'><button type='button' class='btn btn-primary' data-dismiss='modal'>Close</button></div>");
    var ok_button = $("<button type='button' class='btn btn-primary'> <span class='glyphicon glyphicon-ok'> OK</span></button>");
    var row = $("<div class='row'></div>");
    var col = $("<div class='col-md-12'></div>");
    var input = $("<textarea id='input_feild' class='form-control' rows='5' ></textarea>");
    var title = $("<h4 class='modal-title' id='myModalLabel'></h4>");
    var header = $("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button></div>");
    $(title).html(text);
    $(ok_button).bind("click", function (e) {
        var msg = $(input).val().trim();

        callback(msg);
        hide_overlay();


    })
    $(col).append($(input));
    $(row).append($(col));
    $(modal_body).append($(row));
    $(modal_footer).append($(ok_button));
    $(header).append($(title));
    $(modal_content).append($(header));
    $(modal_content).append($(modal_body));
    $(modal_content).append($(modal_footer));
    $(modal).append($(modal_content));
    //notify_success($(modal).html());
    var modal_dalog = $("<div id='modal_sap_dialog' class='modal fade'></div>");
    $(modal_dalog).on('hidden.bs.modal', function (e) {
        $("#modal_sap_dialog").remove();
    });
    $(modal_dalog).append($(modal));
    //notify_success($(modal_dalog).html());
    $("body").append($(modal_dalog));
    $(modal_dalog).modal();

}

function show_modal(tl, text) {
    var modal = $("<div class='modal-dialog'></div>");
    var modal_content = $("<div class='modal-content'> </div>");
    var modal_body = $("<div class='modal-body'></div>");
    var modal_footer = $("<div class='modal-footer'><button type='button' class='btn btn-primary' data-dismiss='modal'>Close</button></div>");
    var ok_button = $("<button type='button' class='btn btn-primary'> <span class='glyphicon glyphicon-ok'> OK</span></button>");
    var row = $("<div class='row'></div>");
    var col = $("<div class='col-md-12'></div>");
    var msg = $("<div></div>");
    var title = $("<h4 class='modal-title' id='myModalLabel'></h4>");
    var header = $("<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button></div>");
    $(title).html(tl);
    $(msg).html(text);
    $(ok_button);
    $(col).append($(msg));
    $(row).append($(col));
    $(modal_body).append($(row));
    //$(modal_footer).append($(ok_button));
    $(header).append($(title));
    $(modal_content).append($(header));
    $(modal_content).append($(modal_body));
    $(modal_content).append($(modal_footer));
    $(modal).append($(modal_content));
    //notify_success($(modal).html());
    var modal_dalog = $("<div id='modal_sap_dialog' class='modal fade'></div>");
    $(modal_dalog).on('hidden.bs.modal', function (e) {
        $("#modal_sap_dialog").remove();
    });
    $(modal_dalog).append($(modal));
    //notify_success($(modal_dalog).html());
    $("body").append($(modal_dalog));
    $(modal_dalog).modal();

}
function register_selectall_action(rel, f1, f2) {

    var $chkbxs = $("input[rel='" + rel + "']");
    var $selectall = $("#" + rel + "_selectall");
    if (typeof ($($selectall).prop("id")) == 'undefined') {
        $selectall = $("input[rel='" + rel + "_selectall']");
    }

    var checked_f = f1;
    var unchecked_f = f2;
    var mem_id = rel;

    $selectall.unbind('change').bind('change', function () {
        if (this.checked) {
            $chkbxs.prop('checked', true);
            if ((typeof (checked_f) != 'undefined') && ($(".com_panel").length == 0)) { checked_f(mem_id); }

        }
        else {
            $chkbxs.prop('checked', false);
            if (typeof (unchecked_f) != 'undefined') { unchecked_f(); }
        }
    });
    //notify_success($chkbxs.length);
    $chkbxs.unbind('change').bind('change', function () {

        if (this.checked) {
            if ((typeof (checked_f) != 'undefined') && ($(".com_panel").length == 0)) { checked_f(mem_id); }
            if ($chkbxs.length == $chkbxs.filter(':checked').length) {
                $selectall.prop('checked', true);
            }
        }
        else {
            $selectall.prop('checked', false);
            if ($chkbxs.filter(':checked').length == 0) {
                if (typeof (unchecked_f) != 'undefined') { unchecked_f(); }
            }
        }
    });

}

function delete_(del_url, params, msg, view_url, view_params, callback, container) {
    /* 	if(confirm("Are you sure you want to delete this " +  msg +" ?\n Pres Ok to delete")){
            var url = view_url;
            var v_param = view_params;
            $.post( del_url,params, function(responseText){			
                if(typeof(container) == "undefined"){callback(url,v_param);}
                else{callback(container,url,v_param);}
            }, 'html' );
        } */
    restore_(del_url, params, "delete this " + msg, view_url, view_params, callback, container);
}
function restore_(del_url, params, msg, view_url, view_params, callback, container) {
    if (confirm("Are you sure you want to " + msg + " ?\nPress Ok to continue")) {
        /* var url = view_url; */
        var v_param = view_params;
        $.post(del_url, params, function (responseText) {
            if (typeof (container) == "undefined") { callback(view_url, v_param, responseText); }
            else { callback(container, view_url, v_param, responseText); }
        }, 'html');
    }

}

function load_list_view(url, param) {
    //notify_success(url);
    show_waiting();
    $.post(url, param, function (responseText) {
        hide_waiting();
        var elem = $(".list_view");
        elem.html(responseText).fadeIn("slow");
        if (!elem.inView("topOnly")) {
            elem.scrollView(-80);
        }
    }, 'html');
}

var validate_value = {
    stripWhitespace: function (str, c) {
        if (typeof (c) == 'undefined') { c = ''; }
        return [(str.replace(/\s+/g, c)), 'Empty Value'];
    },
    isValidName: function (value) {
        $(value).val(this.stripWhitespace(value, ' '));
        var p = /^(([a-zA-Z]{2,}\.)\s)?([a-zA-Z]{3,})\s(([a-zA-Z]+)?\s)?([a-zA-Z]{3,})\s?$/g;
        return [(value.match(p)), 'Invalid Name Format'];


    },
    isValidAddress: function (value) {

        $(value).val(this.stripWhitespace(value, ' '));
        var p = /^((\w+)\s){5,}$/g;
        return [(value.match(p)), 'Invalid Address Format'];

    },
    isValidEmail: function (value) {
        var p = /^([a-zA-Z0-9_\-\.]+)@((\ [[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}| [0-9]{1,3})(\]?)$/;
        return [(value.match(p)), 'Invalid Email Format'];


    },
    isValidMoney: function (value) {
        var p = /^([0-9]+)(\.[0-9]{1,2})?$/;
        return [(value.match(p)), 'Invalid Money Format'];


    },
    isValidPhone: function (value) {
        var p = /^\+?\d+$/;
        return [(value.match(p)), 'Invalid Phone Number Format'];


    },
    isValidTime: function (value) {
        var p = /^(([0-9]|[0][0-9]|[1][0-2]):([0-5][0-9])(:([0-5][0-9]))?\s([Aa][Mm]|[Pp][Mm]))$/;
        return [(value.match(p)), 'Invalid Time Format'];


    },
    isValidDate: function (value) {
        var p = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/;
        var isvalid = p.test(value);
        if (isValid) {
            var parts = value.split("-");

            if ((parts[1] == "02") && (parts[2] == "30" || parts[2] == "31")) {

                isValid = false;
            }
            else if ((parts[1] == "04" || parts[1] == "06" || parts[1] == "09" || parts[1] == "11") && (parts[2] == "31")) {

                isValid = false;
            }


        }

        return [isValid, 'Invalid Date Format'];

    }
}

var grid_pages = {
    max_page_view: 0,
    total_records: 0,
    total_pages: 0,
    records_per_page: 0,
    paginationid: '',
    next_grid_page: function () {
        $('#' + this.paginationid + ' li.active').next(".page_button").find("a").trigger('click');
        //alert($('#'+paginationid+' li.active').next(".page_button").length);
    },
    prev_grid_page: function () {
        $('#' + this.paginationid + ' li.active').prev(".page_button").find("a").trigger('click');
        //alert($('#'+paginationid+' li.active').prev(".page_button").length);
    },
    go_to: function (page_tag) {

        var page_navs = $('#' + this.paginationid + ' li.page_button');
        $(page_navs).removeClass('active');
        $(page_tag).parents('#' + this.paginationid + ' li').addClass("active");
        var start_index = $(page_navs).index($(page_tag).parents('li.active')[0]);
        if (this.total_pages > this.max_page_view) {
            var half_max_view = Math.floor(this.max_page_view / 2)

            if (((start_index + half_max_view) >= this.total_pages)) {

                $(page_navs).slice((this.total_pages - this.max_page_view - 1), this.total_pages).show();
                $(page_navs).slice(0, (this.total_pages - this.max_page_view - 1)).hide();

            }
            else if ((start_index - half_max_view) > 0) {

                $(page_navs).slice((start_index - half_max_view), (start_index + half_max_view)).show();
                $(page_navs).slice(0, (start_index - half_max_view)).hide();
                $(page_navs).slice((start_index + half_max_view)).hide();
            }
            else {
                $(page_navs).slice(0, this.max_page_view).show();

                $(page_navs).slice((this.max_page_view + 1)).hide();
            }


        }
        var n = start_index * this.records_per_page;
        var p_rec_start = n + 1;
        var p_rec_end = (n) + (n + this.records_per_page <= this.total_records ? this.records_per_page : this.total_records - n);
        var records_in_view = "Showing Records " + p_rec_start + " to " + p_rec_end + " of " + this.total_records;
        $("#records_in_view").html(records_in_view);

    },
    initialize_pages_nav: function (page_tag) {
        this.total_pages = Math.ceil(this.total_records / this.records_per_page);
        //alert(this.total_pages);
        if (typeof (page_tag) == 'undefined') {
            $('#' + this.paginationid + ' li.page_button').hide().slice(0, this.max_page_view + 1).show();
        }
        else { this.go_to(page_tag); }
    }
}

function register_character_count(elem, size, notification_label) {

    $(elem).focus(function () {
        var chars = $(elem).val().length;

        //if(chars > size){
        //	$(elem).val($(elem).val().substr(0,size));
        //	chars = size;
        //}
        var msgs = ((chars / size) | 0) + 1;
        $(notification_label).html(chars + " /" + msgs);
    });

    $(elem).keyup(function () {
        var chars = $(elem).val().length;

        //if(chars > size){
        //	$(elem).val($(elem).val().substr(0,size));
        //	chars = size;
        //}
        var msgs = ((chars / size) | 0) + 1;
        $(notification_label).html(chars + " /" + msgs);
    });

}


function update_email_acct_params(etype) {
    if (etype == "smtp.gmail.com") {
        $("form#email_acct_form input[name='e_host']").val("smtp.gmail.com");
        $("form#email_acct_form input[name='e_port']").val("465");
        $("form#email_acct_form input[name='e_secure']").prop('checked', true);
        $("form#email_acct_form input[name='e_ty']").val('1');

    }
    else if (etype == "smtp.mail.yahoo.com") {
        $("form#email_acct_form input[name='e_host']").val("smtp.mail.yahoo.com");
        $("form#email_acct_form input[name='e_port']").val("465");
        $("form#email_acct_form input[name='e_secure']").prop('checked', true);
        $("form#email_acct_form input[name='e_ty']").val('2');

    }
    else if (etype == "plus.smtp.mail.yahoo.com") {
        $("form#email_acct_form input[name='e_host']").val("plus.smtp.mail.yahoo.com");
        $("form#email_acct_form input[name='e_port']").val("465");
        $("form#email_acct_form input[name='e_secure']").prop('checked', true);
        $("form#email_acct_form input[name='e_ty']").val('3');

    }
    else if (etype == "smtp.live.com") {
        $("form#email_acct_form input[name='e_host']").val("smtp.live.com");
        $("form#email_acct_form input[name='e_port']").val("587");
        $("form#email_acct_form input[name='e_secure']").prop('checked', true);
        $("form#email_acct_form input[name='e_ty']").val('4');

    }
    else if (etype == "custom") {
        $("form#email_acct_form input[name='e_host']").val("");
        $("form#email_acct_form input[name='e_port']").val("");
        $("form#email_acct_form input[name='e_secure']").prop('checked', false);
        $("form#email_acct_form input[name='e_ty']").val('5');

    }
    $("form#email_acct_form input[name='e_host']").trigger('change.validate');
    $("form#email_acct_form input[name='e_port']").trigger('change.validate');
    $("form#email_acct_form input[name='e_secure']").trigger('change.validate');

}

function load_gateway_acct(gid) {
    if (gid == 0) { $("#gwt_setup").html(""); return; }
    var g_name = $("select#sms_gateway option#rec_" + gid).attr("rel");
    var url = "gws/" + g_name + "_edit.jsp";
    show_waiting();
    $.post(url, { gwt_id: gid }, function (responseText) {
        hide_waiting();
        $("#gwt_setup").html(responseText).fadeIn("slow");


    }, 'html');
}
function load_message_template(mid) {
    if (mid == 0) {
        arr['msg_body'].set_content("");
        $('input#subject').val("");
        return;
    }
    var m_name = $("select#message_template option#rec_" + mid).text();
    //var m_body = $("select#message_template option#rec_"+mid).attr("rel");
    var m_body = $("span#msg_template" + mid).html();
    //alert(m_body);
    arr['msg_body'].set_content(m_body);
    $('input#subject').val(m_name);
}
function load_message_template2(mid) {
    if (mid == 0) {
        //arr['msg_body'].set_content("");
        $('input#sender').val("");
        $('textarea#msg_body').val("");
        return;
    }
    var m_name = $("select#message_template option#rec_" + mid).text();
    //var m_body = $("select#message_template option#rec_"+mid).attr("rel");
    var m_body = $("span#msg_template" + mid).html();
    //alert(m_body);
    $('textarea#msg_body').val(m_body);
    //$('input#sender').val(m_name);
}

var colors = ["#fff", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"];
var color_depth = [-.1, -.05, 0];
function sunburst(c_id, width, height, data) {
    this.coloralternative = 0;
    this.width = width;
    this.height = this.width;
    this.radius = this.width / 2;
    this.x = d3.scale.linear().range([0, 2 * Math.PI]);
    this.y = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, this.radius]);
    this.padding = 5;
    this.duration = 1000;
    this.data = data;
    var s_instance = this;

    this.colour = function (a) {
        /*if (d.children) {
			// There is a maximum of two children!
			var colours = d.children.map(colour),
			a = d3.hsl(colours[0]),
			b = d3.hsl(colours[1]);
			// L*a*b* might be better here...
			return d3.hsl((a.h + b.h) / 2, a.s * 1.2, a.l / 1.2);
			}
		return d.colour || "#fff";*/


        var e = colors[s_instance.coloralternative % 20];
        a.color = e;

        return s_instance.coloralternative++, e

    }

    this.click = function (d) {
        s_instance.path.transition()
		.duration(s_instance.duration)
		.attrTween("d", s_instance.arcTween(d));

        // Somewhat of a hack as we rely on arcTween updating the scales.
        s_instance.text.style("visibility", function (e) {
            return isParentOf(d, e) ? null : d3.select(this).style("visibility");
        })
		.transition()
        .duration(s_instance.duration)
        .attrTween("text-anchor", function (d) {
            return function () {
                return s_instance.x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
            };
        })
        .attrTween("transform", function (d) {
            var multiline = (d.name || "").split(" ").length > 1;
            return function () {
                var angle = s_instance.x(d.x + d.dx / 2) * 180 / Math.PI - 90,
                rotate = angle + (multiline ? -.5 : 0);
                return "rotate(" + rotate + ")translate(" + (s_instance.y(d.y) + s_instance.padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
            };
        })
        .style("fill-opacity", function (e) { return isParentOf(d, e) ? 1 : 1e-6; })
        .each("end", function (e) {
            d3.select(this).style("visibility", isParentOf(d, e) ? null : "hidden");
        });
    }

    this.arcTween = function (d) {
        var my = maxY(d),
		xd = d3.interpolate(s_instance.x.domain(), [d.x, d.x + d.dx]),
		yd = d3.interpolate(s_instance.y.domain(), [d.y, my]),
		yr = d3.interpolate(s_instance.y.range(), [d.y ? 20 : 0, s_instance.radius]);
        return function (d) {
            return function (t) { s_instance.x.domain(xd(t)); s_instance.y.domain(yd(t)).range(yr(t)); return s_instance.arc(d); };
        };
    }

    this.div = d3.select("#" + c_id);

    this.div.select("img").remove();

    this.vis = this.div.append("svg")
    .attr("width", this.width + this.padding * 2)
    .attr("height", this.height + this.padding * 2)
	.append("g")
    .attr("transform", "translate(" + [this.radius + this.padding, this.radius + this.padding] + ")");

    this.div.append("p")
    .attr("id", "intro")
    .text("Click to zoom!");

    this.partition = d3.layout.partition()
    .sort(null)
    .value(function (d) { return d.depth == 3 ? d.size + 4 : 5 });

    this.arc = d3.svg.arc()
    .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, s_instance.x(d.x))); })
    .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, s_instance.x(d.x + d.dx))); })
    .innerRadius(function (d) { return Math.max(0, d.y ? s_instance.y(d.y) : d.y); })
    .outerRadius(function (d) { return Math.max(0, s_instance.y(d.y + d.dy)); });


    this.nodes = this.partition.nodes({ children: this.data });

    this.path = this.vis.selectAll("path").data(this.nodes);
    this.path.enter().append("path")
       .attr("id", function (d, i) { return "path-" + i; })
       .attr("d", this.arc)
       .attr("fill-rule", "evenodd")
       .style("fill", this.colour)
       .style("stroke", colour_stroke)
       .on("click", this.click);

    this.text = this.vis.selectAll("text").data(this.nodes);
    this.textEnter = this.text.enter().append("text")
       .style("fill-opacity", 1)
       .style("fill", function (d) {
           return brightness(d3.rgb(d.color)) < 125 ? "#eee" : "#000";
       })
       .attr("text-anchor", function (d) {
           return s_instance.x(d.x + d.dx / 2) > Math.PI ? "end" : "start";
       })
       .attr("dy", ".2em")
       .attr("transform", function (d) {
           var multiline = (d.name || "").split(" ").length > 1,
               angle = s_instance.x(d.x + d.dx / 2) * 180 / Math.PI - 90,
               rotate = angle + (multiline ? -.5 : 0);
           //alert(s_instance.y(d.y));
           return "rotate(" + rotate + ")translate(" + (s_instance.y(d.y) + s_instance.padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
       })
       .on("click", this.click);
    this.textEnter.append("tspan")
        .attr("x", 0)
        .text(function (d) { return d.depth ? d.name.split(" ")[0] : ""; });
    this.textEnter.append("tspan")
        .attr("x", 0)
        .attr("dy", "1em")
        .text(function (d) { return d.depth ? d.name.split(" ")[1] || "" : ""; });
    this.textEnter.append("tspan")
        .attr("x", 0)
        .attr("dy", "1em")
        .text(function (d) { return d.depth ? d.size || "" : ""; });



}
function isParentOf(p, c) {
    if (p === c) return true;
    if (p.children) {
        return p.children.some(function (d) {
            return isParentOf(d, c);
        });
    }
    return false;
}


function colour_stroke(d) {
    //return (d.children ? d : d.parent).color

}

// Interpolate the scales!


function maxY(d) {
    return d.children ? Math.max.apply(Math, d.children.map(maxY)) : d.y + d.dy;
}

function brightness(rgb) {
    return rgb.r * .299 + rgb.g * .587 + rgb.b * .114;
}


//function initFullFormAjaxUpload() {

//  var form = document.getElementById('form-id');
//  form.onsubmit = function() {
//    // FormData receives the whole form
//    var formData = new FormData(form);

//    // We send the data where the form wanted
//    var action = form.getAttribute('action');

//    // Code common to both variants
//    sendXHRequest(formData, action);

//    // Avoid normal form submission
//    return false;
//  }
//}

//function image_selected(context,containerID,imageID,base64StoreID) {
//    if (context.files & context.files[0]) {
//        var reader = new FileReader();
//        reader.onload = function (e) {
//            $("#" + containerID).removeClass("hidden");
//            $("#" + imageID).attr("src", e.target.result);
//            $("#" + imagbase64StoreIDeID).val(e.target.result);
//        }
//        reader.readAsDataURL(context.files[0]);
//    }
//}

//// Once the FormData instance is ready and we know
//// where to send the data, the code is the same
//// for both variants of this technique
//function sendXHRequest(formData, uri) {
//  // Get an XMLHttpRequest instance
//    var file = document.getElementById('imgfile');
//  if(""==file.value){
//		alertError("Please Select a file to upload ");
//		return;
//  }
//  if(file.files[0].size > 1024 * 1024){
//		alertError("This file is too large. Maximum size allowed is 1MB ");
//		return;
//  }


//  var xhr = new XMLHttpRequest();

//  // Set up events
//  xhr.upload.addEventListener('loadstart', onloadstartHandler, false);
//  xhr.upload.addEventListener('progress', onprogressHandler, false);
//  xhr.upload.addEventListener('load', onloadHandler, false);
//  xhr.upload.addEventListener('error', onerrorHandler, false);
//  xhr.upload.addEventListener('abort', onabortHandler, false);
//  xhr.addEventListener('readystatechange', onreadystatechangeHandler, false);
//	//alert(uri);
//  // Set up request
//  xhr.open('POST', uri, true);

//  // Fire!
//  xhr.send(formData);
//}

//// Handle the start of the transmission
//function onloadstartHandler(evt) {
//  var div = document.getElementById('upload-status');
//  div.innerHTML = 'Upload started!';
//}

//// Handle the end of the transmission
//function onloadHandler(evt) {
//  var div = document.getElementById('upload-status');
//  div.innerHTML = 'Upload successful!';
//}
//function onabortHandler(evt) {
//  var div = document.getElementById('upload-status');
//  div.innerHTML = 'Upload cancelled!';
//}
//function onerrorHandler(evt) {
//  var div = document.getElementById('upload-status');
//  div.innerHTML = evt.target.responseText;
//}

//// Handle the progress
//function onprogressHandler(evt) {
//  var div = document.getElementById('progress');
//  var percent = evt.loaded/evt.total*100;
//  div.innerHTML = 'Progress: ' + percent + '%';
//}
//function onreadystatechangeHandler(evt) {
//  try {

//	$('#result').html(evt.target.responseText);

//  }
//  catch(e) {
//    return;
//  }
//}
var getUploader = (function () {
    function Uploader(fileId, picId, formId, responPaneID, progressPaneID, thumbnailID, thumbnailViewID, sendToserver, callback) {
        this.picID = picId
        this.formId = formId;
        this.fileId = fileId;
        this.base64Text = "";
        this.responPaneID = responPaneID;
        this.progressPaneID = progressPaneID;
        this.sendToserver = sendToserver || true;
        this.callback = callback;
        var file = document.getElementById(this.fileId), that = this;
        file.addEventListener("change", function (event) { that.image_selected(file, thumbnailViewID, thumbnailID); });
    }
    Uploader.prototype.initFullFormAjaxUpload = function (form) {
        if (form) {
            var formData = new FormData(form);
            var action = form.getAttribute('action');
            this.sendXHRequest(formData, action);
            return;
        }

        form = document.getElementById(this.formId);
        var that = this;
        form.addEventListener("submit", function (event) {

            event.preventDefault();
            var formData = new FormData(form);
            var action = form.getAttribute('action');
            that.sendXHRequest(formData, action);
            return false;
        }, false);
        //alert(form.onsubmit);
    }

    Uploader.prototype.image_selected = function (context, containerID, imageID) {
        // alert(context.files[0]);
        if (context.files && context.files[0]) {
            var reader = new FileReader();
            //  alert("ok");
            reader.onload = (function (e) {
                // alert("ok loaded");
                var thmbview = document.getElementById(containerID), thumb = document.getElementById(imageID);
                // alert(thmbview);
                thmbview.classList.remove("hidden");
                thumb.setAttribute("src", e.target.result);
                this.base64Text = e.target.result;
            }).bind(this);
            reader.readAsDataURL(context.files[0]);
        }
    }

    Uploader.prototype.sendXHRequest = function (formData, uri, file) {
        if (!file) file = document.getElementById(this.fileId);
        if ("" == file.value) {
            alertError("Please Select a file to upload ");
            return;
        }
        //if (file.files[0].size > 65536) {
        //    alertError("This file is too large. Maximum size allowed is 64kb ");
        //    return;
        //}
        if (this.sendToserver) {
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('loadstart', this.onloadstartHandler.bind(this), false);
            xhr.upload.addEventListener('progress', this.onprogressHandler.bind(this), false);
            xhr.upload.addEventListener('load', this.onloadHandler.bind(this), false);
            xhr.upload.addEventListener('error', this.onerrorHandler.bind(this), false);
            xhr.upload.addEventListener('abort', this.onabortHandler.bind(this), false);
            xhr.addEventListener('readystatechange', this.onreadystatechangeHandler.bind(this), false);
            xhr.open('POST', uri, true);
            xhr.send(formData);
            return false;
        }
        else {
            var pic = document.getElementById(this.picID);
            pic.setAttribute("src", this.base64Text);
            pic.style.opacity = 1;
        }


    }

    Uploader.prototype.onloadstartHandler = function (evt) {
        var div = document.getElementById(this.responPaneID);
        div.innerHTML = 'Upload started!';
    }

    Uploader.prototype.onloadHandler = function (evt) {
        var div = document.getElementById(this.responPaneID);
        div.innerHTML = 'Upload successful!';

    }
    Uploader.prototype.onabortHandler = function (evt) {
        var div = document.getElementById(this.responPaneID);
        div.innerHTML = 'Upload cancelled!';
    }
    Uploader.prototype.onerrorHandler = function (evt) {
        var div = document.getElementById(this.responPaneID);
        div.innerHTML = evt.target.responseText;
    }
    Uploader.prototype.onprogressHandler = function (evt) {
        var div = document.getElementById(this.progressPaneID);
        var percent = evt.loaded / evt.total * 100;
        if (div.classList.contains("progress-bar")) {
            div.style.width = percent + '%'
        }
        div.innerHTML = 'Progress: ' + percent + '%';
    }
    Uploader.prototype.onreadystatechangeHandler = function (evt) {

        if (evt.target.readyState == 4 && evt.target.status == 200) {
            if (this.callback) { this.callback(evt.target.responseText); }
            else if (evt.target.responseText == "Ok") {
                if (this.picID) {
                    var pic = document.getElementById(this.picID);
                    pic.setAttribute("src", this.base64Text);
                    pic.style.opacity = 1;
                }
            }
            else (document.getElementById(this.responPaneID)).innerHTML = evt.target.responseText;

        }
        else if (evt.target.readyState == 4) {
            alertError(evt.target.responseText);
        }

    }
    return function (fileId, picId, formId, responPaneID, progressPaneID, thumbnailID, thumbnailViewID, sendToserver, callback) {
        return new Uploader(fileId, picId, formId, responPaneID, progressPaneID, thumbnailID, thumbnailViewID, sendToserver, callback);
    }
})();

function change_picture(url, id) {
    var d = new Date();
    var p = document.getElementById(id);
    var h = document.getElementById("header_logo");
    url = url + "?" + d.getTime();
    p.src = url;
    h.src = url;
    $("#pic_uload").remove();

}

function supportAjaxUploadWithProgress() {
    return supportFileAPI() && supportAjaxUploadProgressEvents() && supportFormData();

    // Is the File API supported?
    function supportFileAPI() {
        var fi = document.createElement('INPUT');
        fi.type = 'file';
        return 'files' in fi;
    };

    // Are progress events supported?
    function supportAjaxUploadProgressEvents() {
        var xhr = new XMLHttpRequest();
        return !!(xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
    };

    // Is FormData supported?
    function supportFormData() {
        return !!window.FormData;
    }
}

var com_seetings = {
    mems: ''
}

function update_com_settings(ids) {
    com_seetings.mems = ids;

}

function schedule_message(phones) {
    if (wb_connected == false) {
        wb = Web_Socket;
        var phns = phones
        wb.initialize(function () {
            schedule_message(phns)
        });

    }
    else {
        var person = 'person';
        if (com_seetings.mems != '') { person = com_seetings.mems }

        var tt = $("#n_type").val();
        if (tt == 'email') { schedule_email('', phones); return; }

        var msg_bd = $("#msg_body").html();
        if (msg_bd == "") { msg_bd = $("#msg_body").val(); }
        if (msg_bd == "" || !(validate_value.stripWhitespace(msg_bd)[0])) {
            alertError("Please provide body of the message");
            return;
        }

        var date = $("input[name='delay_time']").val();
        if (date == "") {
            alertError("Please provide delivery date/time");
            return;
        }

        if (typeof (phones) == 'undefined' || phones == "") {
            phones = "";
            $("[rel='" + person + "']").each(function () {

                if ($(this).prop('checked') & $(this).val() != '') {
                    phones += $(this).val() + ",";
                }
            });
        }
        if (phones == "") {
            alertError("Cannot send message to empty address list");
            return;
        }

        // alert(phones);
        var sender = $("#sender").val();
        show_waiting();


        var url = "ScheduleNotification.jsp";
        $.post(url, { msg: msg_bd, from: sender, to: phones, type: 'sms', s_date: date }, function (response) {
            hide_waiting();
            var ms = response.toString().split(";");
            if (ms[0] == "OK") {
                alertSuccess(ms[1]);
                //close_modal_dialog();
                $("[rel='" + person + "']").prop('checked', false);
                $("#" + person + "_selectall").prop('checked', false);
                $("[rel='" + person + "_selectall']").prop('checked', false);


            }
            else { alertError(ms[1]); }

        }, "html");

    }
}
function schedule_email(message, emails) {
    if (wb_connected == false) {
        wb = Web_Socket;
        var ems = emails;
        var msg = message;
        wb.initialize(function () {
            schedule_email(msg, ems);
        });

    }
    else {
        var person = 'person';
        if (com_seetings.mems != '') { person = com_seetings.mems }
        if (typeof (emails) == 'undefined' || emails == '') {
            emails = "";
            $("[rel='" + person + "']").each(function () {

                if ($(this).prop('checked') & $(this).prop('title') != '') {
                    emails += $(this).prop('title') + ",";
                }
            });
        }
        var msg_tt = $("#subject").val();
        if (typeof (msg_tt) == 'undefined') { msg_tt = $("#msg_title").html(); }
        var msg_bd = message;
        if (typeof (msg_bd) == 'undefined' || msg_bd == "") { msg_bd = $("#msg_body").html(); }
        //alert(msg_bd);		        
        var date = $("input[name='delay_time']").val();
        if (date == "") {
            alertError("Please provide the delivery time/date");
            return;
        }
        if (emails == "") {
            alertError("Cannot send email to empty address list");
            return;
        }
        if (msg_tt == "" || !(validate_value.stripWhitespace(msg_tt)[0])) {
            alertError("Please provide title of the message");
            return;
        }
        if (msg_bd == "" || !(validate_value.stripWhitespace($("<div>" + msg_bd + "</div>").text())[0])) {
            alertError("Please provide body of the message");
            return;
        }
        var formData = new FormData();
        formData.append("msg", msg_bd);
        formData.append("sbj", msg_tt);
        formData.append("to", emails);
        formData.append("type", 'email');
        formData.append("s_date", date);
        $('#form-id input[type=file]').each(function (index) {
            formData.append("attachment" + index, $(this)[0].files[0]);
        })

        show_waiting();
        var url = "ScheduleNotification.jsp";
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {

                hide_waiting();
                var ms = response.toString().split(";");
                if (ms[0] == "OK") {
                    alertSuccess(ms[1]);
                    //close_modal_dialog();
                    $("[rel='" + person + "']").prop('checked', false);
                    $("#" + person + "_selectall").prop('checked', false);
                    $("[rel='" + person + "_selectall']").prop('checked', false);


                }
                else { alertError(ms[1]); }


            }
        })



    }
}

function send_message(phones) {
    var tt = $("#n_type").val();
    if (tt == 'email') { send_email('', phones); return; }

    var person = 'person';
    if (com_seetings.mems != '') { person = com_seetings.mems }

    var msg_bd = $("#msg_body").html();
    if (msg_bd == "") { msg_bd = $("#msg_body").val(); }
    if (msg_bd == "" || !(validate_value.stripWhitespace(msg_bd)[0])) {
        alertError("Please provide body of the message");
        return;
    }

    if (typeof (phones) == 'undefined' || phones == '') {
        phones = "";
        $("[rel='" + person + "']").each(function () {

            if ($(this).prop('checked') & $(this).val() != '') {
                phones += $(this).val() + ",";
            }
        });
    }

    if (phones == "") {
        alertError("Cannot send message to empty address list");
        return;
    }
    var sender = $("#sender").val();
    //alert(phones);
    //var msg_tt = $("#msg_title").html();
    show_waiting();


    var url = "SendNotification.jsp";
    $.post(url, { msg: msg_bd, from: sender, to: phones, type: 'sms' }, function (response) {
        hide_waiting();
        var ms = response.toString().split(";");
        if (ms[0] == "OK") {
            alertSuccess(ms[1]);
            //close_modal_dialog();
            $("[rel='" + person + "']").prop('checked', false);
            $("#" + person + "_selectall").prop('checked', false);
            $("[rel='" + person + "_selectall']").prop('checked', false);


        }
        else { alertError(ms[1]); }

    }, "html");

}
function send_email(msg_bd, emails) {
    var person = 'person';
    if (com_seetings.mems != '') { person = com_seetings.mems }

    var msg_tt = $("#subject").val();
    if (typeof (msg_tt) == 'undefined') { msg_tt = $("#msg_title").html(); }

    if (typeof (msg_bd) == 'undefined' || msg_bd == "") { msg_bd = $("#msg_body").html(); }
    //alert(msg_bd);
    if (msg_tt == "" || !(validate_value.stripWhitespace(msg_tt)[0])) {
        alertError("Please provide title of the message");
        return;
    }
    if (msg_bd == "" || !(validate_value.stripWhitespace($("<div>" + msg_bd + "</div>").text())[0])) {
        alertError("Please provide body of the message");
        return;
    }
    if (typeof (emails) == 'undefined' || emails == '') {
        emails = "";
        $("[rel='" + person + "']").each(function () {

            if ($(this).prop('checked') & $(this).prop('title') != '') {
                emails += $(this).prop('title') + ",";
            }
        });
    }
    if (emails == "") {
        alertError("Cannot send email to empty address list");
        return;
    }

    //alert(emails);
    //alert(msg_tt);
    show_waiting();

    var formData = new FormData();
    formData.append("msg", msg_bd);
    formData.append("sbj", msg_tt);
    formData.append("to", emails);
    formData.append("type", 'email');
    $('#form-id input[type=file]').each(function (index) {
        formData.append("attachment" + index, $(this)[0].files[0]);
    })

    var url = "SendNotification.jsp";
    $.ajax({
        url: url,
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {

            hide_waiting();
            var ms = response.toString().split(";");
            if (ms[0] == "OK") {
                alertSuccess(ms[1]);
                //close_modal_dialog();
                $("[rel='" + person + "']").prop('checked', false);
                $("#" + person + "_selectall").prop('checked', false);
                $("[rel='" + person + "_selectall']").prop('checked', false);


            }
            else { alertError(ms[1]); }

        }
    });



    // $.post(url,{msg:msg_bd,sbj:msg_tt,to:emails,type:'email'},,"html"); 
    return false;

}


function print_section(elem, specified_id) {
    var section_to_print = null;
    if (specified_id) {
        section_to_print = $("#" + elem);
    }
    else {
        section_to_print = $(elem).parents("section");
    }
    var print_block = $("div.print_block");
    var print_header = $("div.print_header");
    print_block.append(print_header.html());
    print_block.append(section_to_print.html());
    $("#main").addClass("no_print");
    $(".print_content", print_block).removeClass("print_only");
    window.print();
    $("#main").removeClass("no_print");
    // $(".print_content",section_to_print).addClass("print_only");
    $("div.print_block").html("");
}

function print_all_of(group_class) {
    var print_block = $("div.print_block");
    var print_header = $("div.print_header");
    $("." + group_class).each(function () {
        var section = $("<section class='print_whole' style='margin-bottom:30px;'></section>");
        section.append(print_header.html());
        section.append($(this).html());
        print_block.append(section);
    })
    $(".print_content", print_block).removeClass("print_only");
    $("#main").addClass("no_print");
    window.print();
    $("#main").removeClass("no_print");
    $("div.print_block").html("");
}


function show_edit_form(link) {
    var tr = $(link).parents("tr");
    tr.addClass("hidden");
    var t_next = tr.next("tr.hidden");
    $(".form-control", t_next).addClass("required");
    t_next.removeClass("hidden").addClass("dirty");
    //edit_count++;
    //alert(tr.siblings(".dirty").length);
    if (tr.siblings(".dirty").length == 1) {
        $("tr.save_bt_row", tr.parents("table")).removeClass("hidden");
        $("tr.total", tr.parents("table")).addClass("hidden");
    }

}
function hide_edit_form(link) {
    var tr = $(link).parents("tr");
    tr.addClass("hidden").removeClass("dirty");;
    t_prev = tr.prev("tr.hidden");
    t_prev.removeClass("hidden");
    $(".form-control", tr).each(function () {
        $(this).removeClass("required");
        //this.value = "";
    });

    //edit_count--;
    if (tr.siblings(".dirty").length == 0) {
        $("tr.total", tr.parents("table")).removeClass("hidden");
        $("tr.save_bt_row", tr.parents("table")).addClass("hidden");
    }
    var fm = tr.parents("form").get(0);
    fm.clear_init_elems(fm, true);
}
function strike_out(link) {
    var tr = $(link).parents("tr");
    var t_next = tr.next("tr.hidden");
    if (tr.hasClass("strikeout")) {
        tr.removeClass("strikeout text-danger");
        $("i[class^='ti-']", $(link).prev("a")).show();
        t_next.data("action", t_next.data("oldAction"));
        //edit_count--;
        //alert(edit_count);
        t_next.removeClass("dirty");
        if (tr.siblings(".dirty").length == 0) {
            $("tr.total", tr.parents("table")).removeClass("hidden");
            $("tr.save_bt_row", tr.parents("table")).addClass("hidden");
        }

    }
    else {
        var warning = $("input[name='strike_out_warning']", $(link).parents("form")).val();
        if (confirm(warning)) {
            tr.addClass("strikeout text-danger");
            $("i", tr.prev("a")).hide();
            $("i[class^='ti-']", $(link).prev("a")).hide();
            //t_next.oldAction = t_next.data("action");
            t_next.data("oldAction", t_next.data("action"));
            t_next.data("action", "remove");
            t_next.addClass("dirty");
            //edit_count++;
            if (tr.siblings(".dirty").length == 1) {

                $("tr.save_bt_row", tr.parents("table")).removeClass("hidden");
                $("tr.total", tr.parents("table")).addClass("hidden");
            }
        }


    }

}

var calendarView = {
    year: 0,
    month_days: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    weekDay: ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"],
    setYear: function (y) {
        this.year = y;
        this.month_days[1] = this.year % 4 == 0 ? 29 : 28;
    },
    leapYear: function (year) {
        if (year % 4 == 0) return true
        return false
    },
    getTime: function () {
        // initialize time-related variables with current time settings
        var now = new Date()
        var hour = now.getHours()
        var minute = now.getMinutes()
        now = null
        var ampm = ""
        // validate hour values and set value of ampm
        if (hour >= 12) {
            hour -= 12
            ampm = "PM"
        } else
            ampm = "AM"
        hour = (hour == 0) ? 12 : hour
        // add zero day to a one day minute
        if (minute < 10)
            minute = "0" + minute // do not parse this number!
        // return time string
        return hour + ":" + minute + " " + ampm
    },
    getDays: function (month, year) {
        return this.month_days[month]
    },
    getMonthName: function (month) {
        return this.month_names[month]
    },
    setCal: function (month, year, marked, hilite, container) {
        //alert(month + " : " + year + " : " + marked + " : " + hilite + " : " + container);
        if (!(marked instanceof Array) || !(hilite instanceof Array)) {
            alert("invalid argument provided, expect an array");
            return;
        }
        var now = new Date();
        if (typeof year == "undefined") {
            this.setYear(now.getYear());
            if (this.year < 1000) this.year += 1900;
        }
        else {
            this.setYear(year);
        }
        if (typeof month == "undefined") {
            month = now.getMonth();
        }
        else {
            month--;
        }
        var monthName = this.month_names[month];
        var date = now.getDate();
        var firstDayInstance = new Date(this.year, month, 1);
        var firstDay = firstDayInstance.getDay();
        var days = this.month_days[month];
        this.drawCal(firstDay + 1, days, date, monthName, this.year, marked, hilite, container);
    },
    drawCal: function (firstDay, lastDate, date, monthName, year, marked, hilite, container_id) {
        var text = "";
        text += '<TABLE class="table table-bordered responsive no-m ">';
        text += '<TH COLSPAN=7 >';
        text += '<span class="text-info">' + monthName + ' ' + year + '</span>';
        text += '</TH>';
        var openCol = '<TD class="text-info">';
        var closeCol = '</TD>';
        text += '<TR>'
        for (var dayNum = 0; dayNum < 7; ++dayNum) {
            text += openCol + this.weekDay[dayNum] + closeCol
        }
        text += '</TR>'
        var day = 1
        var curCell = 1
        var weeks = Math.ceil((lastDate + firstDay - 1) / 7);
        for (var row = 1; row <= weeks; ++row) {
            text += '<TR>'
            for (var col = 1; col <= 7; ++col) {
                if (day > lastDate) {
                    while (col <= 7) {
                        text += '<TD class=""></TD>';
                        ++col
                    }
                    break;
                }
                if (curCell < firstDay) {
                    text += '<TD class=""></TD>';
                    curCell++
                }
                else {
                    if (hilite.indexOf(day) > -1) {
                        text += '<TD class="success"> ' + day + '</TD>';
                    }
                    else if (marked.indexOf(day) > -1) {
                        text += '<TD class="warning"> ' + day + '</TD>';
                    }
                    else {
                        text += '<TD >' + day + '</TD>';
                    }
                    day++;
                }
            }
            text += '</TR>'
        }
        text += '</TABLE>'

        var container = $("#" + container_id), table = $(text);
        container.append(table);
    }
};

var remoteLoader = function remoteLoader() {
    function constructScriptTag(src, func) {
        var script = window.document.createElement('SCRIPT');
        script.src = src;
        if (func) {
            script.onload = func;
        }
        return script;
    }
    return {
        loadJS: function (script_url, f) {
            if (typeof script_url === "object") {
                if (script_url instanceof Array) {
                    var frag = document.createDocumentFragment();
                    for (var ind = 0; ind < script_url.length; ind++) {
                        frag.appendChild(constructScriptTag(script_url[ind]), f);
                    }
                    window.document.getElementsByTagName('HEAD')[0].appendChild(frag.cloneNode(true));
                }
            }
            else if (typeof script_url === "string") {
                window.document.getElementsByTagName('HEAD')[0].appendChild(constructScriptTag(script_url, f))
            }
        }
    }
}();
function legend(parent, data) {
    legend(parent, data, null);
}

function legend(parent, data, chart) {
    parent.className = 'legend';
    var datas = data.hasOwnProperty('datasets') ? data.datasets : data;

    // remove possible children of the parent
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild);
    }

    var show = chart ? showTooltip : noop;
    datas.forEach(function (d, i) {
        //span to div: legend appears to all element (color-sample and text-node)
        var title = document.createElement('div');
        title.className = 'title';
        parent.appendChild(title);

        var colorSample = document.createElement('div');
        colorSample.className = 'color-sample';
        //colorSample.style.backgroundColor = d.hasOwnProperty('strokeColor') ? d.strokeColor : d.color;
        colorSample.style.borderColor = d.hasOwnProperty('fillColor') ? d.fillColor : d.color;
        title.appendChild(colorSample);

        var text = document.createTextNode(d.label);
        text.className = 'text-node';
        title.appendChild(text);

        show(chart, title, i);
    });
}

//add events to legend that show tool tips on chart
function showTooltip(chart, elem, indexChartSegment) {
    var helpers = Chart.helpers;

    var segments = chart.segments;
    //Only chart with segments
    if (typeof segments != 'undefined') {
        helpers.addEvent(elem, 'mouseover', function () {
            var segment = segments[indexChartSegment];
            segment.save();
            segment.fillColor = segment.highlightColor;
            chart.showTooltip([segment]);
            segment.restore();
        });

        helpers.addEvent(elem, 'mouseout', function () {
            chart.draw();
        });
    }
}

function noop() { }
var chartter = {
    color_palette: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"],
    draw_percentage_radar_chart: function (labels, data_sets, canvas_id, legend_id) {

        var radarChartData = {};
        radarChartData.labels = labels;
        radarChartData.datasets = [];

        for (var i = 0; i < data_sets.length; i++) {
            var data_set = {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "#1f78b4",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#1f78b4",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "1f78b4",
                data: data_sets[i]
            }
            radarChartData.datasets.push(data_set);
        }

        var chart = new Chart(document.getElementById(canvas_id).getContext("2d")).Radar(radarChartData,
		{
		    responsive: true,
		    pointLabelFontColor: "#a6cee3",
		    angleLineColor: "rgba(254,254,254,.1)",
		    scaleLineColor: "rgba(254,254,254,.1)",
		    //angleLineWidth: 5,
		    scaleOverride: true,
		    scaleSteps: 10,
		    scaleStepWidth: 10,
		    // Number - The scale starting value
		    scaleStartValue: 0,
		    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%"
		});
        if (legend_id) {
            var legend = chart.generateLegend();
            $('#' + legend_id).append(legend);
        }


    },
    draw_doughnut_chart: function (labels, data_sets, canvas_id, legend_id) {

        var doughnutData = [];
        for (var i = 0; i < data_sets.length; i++) {
            var data_set = {
                value: data_sets[i],
                color: this.color_palette[i],
                label: labels[i]
            }
            doughnutData.push(data_set);
        }

        var chart = new Chart(document.getElementById(canvas_id).getContext("2d")).Doughnut(doughnutData, { responsive: true });
        if (legend_id) {
            // var legend = chart.generateLegend();
            // $('#'+legend_id).append(legend);
            legend(document.getElementById(legend_id), doughnutData, chart);
        }
    },
    draw_doughnut_chart_colored: function (labels, data_sets, colors, canvas_id, legend_id) {

        var doughnutData = [];
        for (var i = 0; i < data_sets.length; i++) {
            var data_set = {
                value: data_sets[i],
                color: this.color_palette[colors[i]],
                label: labels[i]
            }
            doughnutData.push(data_set);
        }

        var chart = new Chart(document.getElementById(canvas_id).getContext("2d")).Doughnut(doughnutData, { responsive: true });
        if (legend_id) {
            // var legend = chart.generateLegend();
            // $('#'+legend_id).append(legend);
            legend(document.getElementById(legend_id), doughnutData, chart);
        }
    },
    draw_polar_area_percentage: function (labels, data_sets, colors, canvas_id, legend_id) {

        var polarData = [];
        for (var i = 0; i < data_sets.length; i++) {
            var data_set = {
                value: data_sets[i],
                color: this.color_palette[colors[i]],
                label: labels[i]
            }
            polarData.push(data_set);
        }

        var chart = new Chart(document.getElementById(canvas_id).getContext("2d")).PolarArea(polarData, {
            responsive: true,
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 10,
            scaleStartValue: 0,
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%"
        });
        if (legend_id) {
            // var legend = chart.generateLegend();
            // $('#'+legend_id).append(legend);
            legend(document.getElementById(legend_id), polarData, chart);
        }
    },
    draw_bar_chart: function (labels, legends, data_sets, canvas_id, depth, legend_id) {
        if (!(data_sets instanceof Array && data_sets.length)) return;
        //alert(data_sets.toSource())
        var barChartData = {};
        barChartData.labels = labels;
        barChartData.datasets = [];
        var len = data_sets.length / depth;
        for (var i = 0; i < depth; i++) {
            var data_set = {
                fillColor: this.color_palette[i],
                data: [],
                label: legends[i]
            }
            for (var x = i, y = 0; y < len; x += depth, y++) {
                data_set.data.push(data_sets[x] /*+ Math.round(Math.random()*50)*/);
            }
            //alert(data_set.data.toSource())
            barChartData.datasets.push(data_set);
        }

        var mybar = new Chart(document.getElementById(canvas_id).getContext("2d")).Bar(barChartData, { responsive: true });
        if (legend_id) {
            // var legend = mybar.generateLegend();
            // $('#'+legend_id).append(legend);
            legend(document.getElementById(legend_id), barChartData);
        }

    },
    draw_percentage_stacked_chart: function (labels, legends, data_sets, colors, canvas_id, legend_id) {

        var stackedChartData = {};
        stackedChartData.labels = labels;
        stackedChartData.datasets = [];

        for (var i = 0; i < data_sets.length; i++) {
            var data_set = {
                fillColor: this.color_palette[colors[i]],
                data: data_sets[i],
                label: legends[i]
            }
            stackedChartData.datasets.push(data_set);
        }
        var chart = new Chart(document.getElementById(canvas_id).getContext("2d")).StackedBar(stackedChartData,
		{
		    responsive: true,
		    scaleOverride: true,
		    scaleSteps: 10,
		    scaleStepWidth: 10,
		    scaleStartValue: 0,
		    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%"
		});
        if (legend_id) {
            legend(document.getElementById(legend_id), stackedChartData);
        }


    }

}

var chartter2 = {
    color_palette: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"],

    draw_doughnut_chart: function (labels, data_sets, canvas_id, title) {
        var doughnutData = [];
        var colors = {};
        for (var i = 0; i < data_sets.length; i++) {
            doughnutData.push([labels[i], data_sets[i]]);
            colors[labels[i]] = this.color_palette[i % this.color_palette.length];
        }
        var chart = c3.generate({
            bindto: document.getElementById(canvas_id),
            data: {
                columns: doughnutData,
                type: 'donut',
                colors: colors,
                labels: false
            },
            donut: {
                title: title,
                label: { show: false }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id, index) { return value; }
                }
            }
        });

    },
    draw_doughnut_chart_colored: function (labels, data_sets, selected_colors, canvas_id, title) {

        var doughnutData = [];
        var colors = {};
        for (var i = 0; i < data_sets.length; i++) {
            doughnutData.push([labels[i], data_sets[i]]);
            colors[labels[i]] = this.color_palette[selected_colors[i]];
        }
        var chart = c3.generate({
            bindto: document.getElementById(canvas_id),
            data: {
                columns: doughnutData,
                type: 'donut',
                colors: colors,
                labels: false
            },
            donut: {
                title: title,
                label: { show: false }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id, index) { return value; }
                }
            }

        });
    },
    draw_bar_chart: function (labels, data_sets, canvas_id, depth, title, unit_symbol) {
        if (!(data_sets instanceof Array && data_sets.length)) return;
        //alert(data_sets.toSource())
        var barChartData = [];
        var len = data_sets.length / depth;
        var colors = {};
        for (var i = 0; i < depth; i++) {
            var data_set = [labels[i]];
            colors[labels[i]] = this.color_palette[i % this.color_palette.length];
            for (var x = i, y = 0; y < len; x += depth, y++) {
                data_set.push(data_sets[x] /*+ Math.round(Math.random()*50)*/);
            }
            //alert(data_set.data.toSource())
            barChartData.push(data_set);
        }
        var chart = c3.generate({
            bindto: document.getElementById(canvas_id),
            data: {
                columns: barChartData,
                type: 'bar',
                colors: colors
            },
            bar: {
                //title: title
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id, index) { return unit_symbol + d3.format(",")(value); }
                }
            },
            axis: {
                y: {
                    tick: {
                        format: function (d) { return decodeHTML(unit_symbol) + d3.format(",")(d); }
                    }
                },
                x: {
                    type: 'category',
                    categories: title
                }
            }
        });

    },
    draw_bar_chart_percent: function (labels, data_sets, canvas_id, depth, title) {
        if (!(data_sets instanceof Array && data_sets.length)) return;
        //alert(data_sets.toSource())
        var barChartData = [];
        var len = data_sets.length / depth;
        var colors = {};
        for (var i = 0; i < depth; i++) {
            var data_set = [labels[i]];
            colors[labels[i]] = this.color_palette[i % this.color_palette.length];
            for (var x = i, y = 0; y < len; x += depth, y++) {
                data_set.push(data_sets[x] /*+ Math.round(Math.random()*50)*/);
            }
            //alert(data_set.data.toSource())
            barChartData.push(data_set);
        }
        var chart = c3.generate({
            bindto: document.getElementById(canvas_id),
            data: {
                columns: barChartData,
                type: 'bar',
                colors: colors
            },
            bar: {
                //title: title
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id, index) { return value + "%"; }
                }
            },
            axis: {
                y: {
                    tick: {
                        values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                        format: function (d) { return d + "%"; }
                    },
                    max: 100
                },
                x: {
                    type: 'category',
                    categories: title
                }
            }
        });

    },
    draw_guage: function (label, data, canvas_id, title) {
        var chart = c3.generate({
            bindto: document.getElementById(canvas_id),
            data: {
                columns: [
                    [label, data]
                ],
                type: 'gauge'

            },
            gauge: {
                title: title
                //        label: {
                //            format: function(value, ratio) {
                //                return value;
                //            },
                //            show: false // to turn off the min/max labels.
                //        },
                //    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                //    max: 100, // 100 is default
                //    units: ' %',
                //    width: 39 // for adjusting arc thickness
            },
            color: {
                pattern: ['#FF0000', '#F97600', "#66bd63", '#1a9850'], // the three color levels for the percentage values.
                threshold: {
                    //            unit: 'value', // percentage is default
                    //            max: 200, // 100 is default
                    values: [30, 51, 80, 100]
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id, index) { return value + "%"; }
                }
            }
        });



    }
}
function decodeHTML(text) {
    var map = { "gt": ">" /* , … */ };
    return text.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function ($0, $1) {
        if ($1[0] === "#") {
            return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16) : parseInt($1.substr(1), 10));
        } else {
            return map.hasOwnProperty($1) ? map[$1] : $0;
        }
    });
}

function loadUploadWindow(url, upload_url, id) {
    var pid = $('#' + id).val();

    load_ajax_modal_dialog(url, { p_id: pid, upload_url: upload_url });
}

function picSelectHandler(context, picID) {
    if (context.files && context.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + picID).attr('src', e.target.result);
        }
        reader.readAsDataURL(context.files[0]);
    }
}
function setImage(picID, source, opacity) {
    var pic = $("#" + picID);
    pic.attr("src", source);
    pic.css("opacity", opacity);
}

function enableDynamicContentTabs(btnselectionRule, tabselectionRule, contentDivID) {
    var tabs = $(btnselectionRule), parents = $(tabselectionRule);
    parents.removeClass("disabled");
    parents.removeAttr("disabled");
    // parents.first().addClass("active");
    tabs.each(function () {
        var tab = $(this);
        if (!this.clickAdded) {
            tab.click(function (e) {
                e.preventDefault();
                if (tab.data("contentlink") && tab.data("contentlink").trim()) {
                    loadContent(contentDivID, tab.data("contentlink"), tab.data("params"))
                    tab.parents("li").siblings("li").removeClass("active"); tab.parents("li").addClass("active");
                    true;
                }
            })
            this.clickAdded = true;
        }
        if (tab.parent("li").hasClass("active")) {
            tab.trigger("click");
        }
    })
}

function updateElementsDatalist(selectionRule, key, value) {
    $(selectionRule).each(function (index) {
        $(this).data(key, value);
    })
}

function updateElementsMultiValueDatalist(selectionRule, key, values) {
    $(selectionRule).each(function (index) {
        $(this).data(key, values[index]);
    })
}

function appendContent(domElement, url, params) {
    $.post(url, params, function (responseText) {
        $(domElement).append(responseText);
    });
}

function load_options(source, datas, targets) {
    datas = datas.split(",");
    targets = targets.split(",");
    for (var i = 0; i < datas.length; i++) {
        var options = $("option:selected", $(source)).data(datas[i]);
        var $select = $('#' + targets[i]);
        $select.find('option').remove();
        $.each(options, function (key, value) {
            $select.append('<option value=' + value + '>' + key + '</option>');
        });
    }
}

function alertResp(cnt, url, param, data) {
    loadContent(cnt, url, param, data);
    dt = JSON.parse(data);
    alertSuccess("Notification!", dt.response);
}


function go_back() {
    var c_tab = $("#wizardPane ul li.active");
    var p_tab = c_tab.prev();
    c_tab.toggleClass("disabled");
    p_tab.toggleClass("disabled");
    $('a', p_tab).tab('show');
    return false;
}


var Wizard = function (wizID) {
    this.wizardID = wizID;
    this.wizardObj = $("#" + this.wizardID);
}

Wizard.prototype.go_next = function () {
    var c_tab = $("ul li.active", this.wizardObj);
    var n_tab = c_tab.next();
    c_tab.toggleClass("disabled");
    n_tab.toggleClass("disabled");
    $('a', n_tab).tab('show');
    return false;
}
Wizard.prototype.go_back = function () {
    var c_tab = $("ul li.active", this.wizardObj);
    var p_tab = c_tab.prev();
    c_tab.toggleClass("disabled");
    p_tab.toggleClass("disabled");
    $('a', p_tab).tab('show');
    return false;
}
Wizard.prototype.init = function () {
    var $wizardTabs = $('ul li a[data-toggle="tab"]', this.wizardObj);
    $wizardTabs.on('shown.bs.tab', function (e) {
        var $total = $wizardTabs.length;
        var $current = $wizardTabs.index(e.target) + 1;
        var $percent = ($current / $total) * 100;
        $('.progress-bar', this.wizardObj).css({ width: $percent + '%' });
    })
    $('.progress-bar', this.wizardObj).css({ width: ((100 / $wizardTabs.length)) + '%' });
    $('ul li a', this.wizardObj).click(function (e) {
        e.preventDefault()
        return false;
    })
}