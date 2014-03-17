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
        }
};
jQuery(document).ready(jQuery.proxy(OI.load, OI));
