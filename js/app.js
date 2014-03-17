// app.js
// OnlineiTunes
var OI = {
    $app: jQuery('#app'),
    load:
        function($) {
            console.log("Loading app...");
            $app = this.$app;
            $app.append($.parseHTML(
                '<div class="alert alert-dismissable alert-info">' +
                '<button type="button" class="close" data-dismiss="alert">' +
                '&times;' +
                '</button>' +
                'Writing Code...' +
                '</div>'
            ));
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
            var XMLS = new XMLSerializer();
            obj.encode = function(jxml) {
                // we assume we were passed the result of decode or something similar
                jxml = jxml[0];
                if (jxml && typeof jxml === 'object') {
                    if (XMLS) {
                        return XMLS.serializeToString(jxml);
                    } else if (xml in jxml) {
                        return jxml.xml;
                    } else {
                        return undefined;
                    }
                }
            }
            return obj;
        })(window.jQuery)
};
jQuery(document).ready(jQuery.proxy(OI.load, OI));
console.log(OI.XML.encode(OI.XML.decode('<xml>LOL_XML</xml>')));
