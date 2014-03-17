// app.js
// OnlineiTunes
var OI = {
    $app: jQuery('#app'),
    load:
        function($) {
            console.log("Loading app...");
            $app = this.$app;
            var dzone = $.parseHTML(
                '<div id="dzone" class="alert alert-dismissable alert-info">' +
                'Drop Your iTunes XML File Here' +
                '</div>'
            );
            $app.append(dzone);
            var $dzone = $(dzone);
            $dzone.on('dragover', this.FILE.dragEvent);
            $dzone.one('drop', this.FILE.selectEvent);
            this.FILE.setCallback(function(file) {
                $dzone.off('dragover');
                $dzone.text("Loading '" + file.name + "'");
            });
        },
    XML:
        (function($) {
            var obj = {};
            obj.decode = function(xml) {
                if (xml && typeof xml === 'string') {
                    try {
                        return $($.parseXML(xml));
                    } catch (err) {
                        return undefined;
                    }
                }
            };
            obj.XMLS = new XMLSerializer();
            obj.encode = function(jxml) {
                // we assume we were passed the result of decode or something similar
                jxml = jxml[0];
                if (jxml && typeof jxml === 'object') {
                    if (obj.XMLS) {
                        return obj.XMLS.serializeToString(jxml);
                    } else if (xml in jxml) {
                        return jxml.xml;
                    } else {
                        return undefined;
                    }
                }
            }
            return obj;
        })(window.jQuery),
    FILE:
        (function($) {
            var obj = {};
            obj.selectEvent = function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                var files = evt.originalEvent.dataTransfer.files; // FileList object.
                var file = files[0]; // choose the first one
                obj.lastFile = file;
                obj.callback.call(window, obj.lastFile);
            };
            obj.dragEvent = function(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                evt.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
            };
            obj.lastFile = undefined;
            obj.current = function() {
                return obj.lastFile;
            }
            obj.callback = $.noop();
            obj.setCallback = function(callback) {
                if (callback && typeof callback === 'function') {
                    obj.callback = callback;
                }
            }
            return obj;
        })(window.jQuery)
};
jQuery(document).ready(jQuery.proxy(OI.load, OI));
console.log(OI.XML.encode(OI.XML.decode('<xml>LOL_XML</xml>')));
