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
            $dzone.on('drop', this.FILE.selectEvent);
            this.FILE.setCallback(function(file) {
                if (file.type !== 'text/xml') {
                    // not XML, don't do anything
                    $dzone.text("File '" + file.name + "' is not an XML file. Try again.");
                    return;
                }
                $dzone.off('dragover');
                $dzone.off('drop');
                $dzone.text("Loading '" + file.name + "'...");
                
                // loading file here
                OI.FILE.reader(file, function(data) {
                    console.log(data);
                    var $xml = OI.XML.decode(data);
                    $dzone.text("Loaded '" + file.name + "'.");
                });
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
            };
            obj.textNodes = function($xml) {
                var textList = $xml.contents().filter(function() { return this.nodeType == 3; });
                return textList;
            };
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
            };
            obj.callback = $.noop();
            obj.setCallback = function(callback) {
                if (callback && typeof callback === 'function') {
                    obj.callback = callback;
                }
            };
            // TODO: write a file reader object that automatically loads as needed.
            // and then discards.
            // this one just wraps weirdly around FileReader
            function InlineReader(file, callback) {
                var fin = new FileReader();
                fin.onload = function(e) {
                    callback(e.target.result);
                };
                fin.readAsText(file);
            }
            obj.reader = function(file, callback) {
                return new InlineReader(file, callback);
            };
            return obj;
        })(window.jQuery)
};
jQuery(document).ready(jQuery.proxy(OI.load, OI));
console.log(OI.XML.encode(OI.XML.textNodes(OI.XML.decode('<xml>LOL_XML</xml>').find('xml')));
