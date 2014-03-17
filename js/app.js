// app.js
// OnlineiTunes
var OI = {
    $app: jQuery('#app'),
    load:
        function($) {
            console.log("Loading app...");
            this.$app.append($.parseHTML('<p>Loaded!</p>'));
        }
};
jQuery(document).ready(jQuery.proxy(OI.load, OI));
