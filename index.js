/* jshint node: true */
'use strict';

module.exports = {

    name: 'sq-ember-tracker',

    contentFor: function(type, config) {

        if ( type === 'head-footer' ) {

            var analytics = "\n<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g; m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga');</script>";
            var facebook = "\n<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','//connect.facebook.net/en_US/fbevents.js');</script>";

            var result = [];

            if ( config.GOOGLE_ANALYTICS ) {
                if ( config.GOOGLE_ANALYTICS.tracking_id ) {
                    result.push(analytics);
                }
            }

            if ( config.FACEBOOK ) {
                if ( config.FACEBOOK.pixel_id ) {
                    result.push(facebook);
                }
            }

            if ( result.length !== 0 ) {
                return result.join('');
            }

        }

    },

    isDevelopingAddon: function() {
        return true;
    },

};
