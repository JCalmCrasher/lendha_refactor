<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!--SEO tag -->
    <meta name="keywords" content="Lendha: Loans and Spend Management for African Small Businesses">
    <meta name="description"
        content="Lendha's instant business loan and spend management solutions are built for small businesses like yours to grow and scale.">
    <meta property="og:site_name" content="Lendha Technology Limited" />
    <meta property="og:type" content="website" />

    <!-- twitter card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@LendhaLoan" />
    <meta name="twitter:title" content="Lendha" />
    <meta name="twitter:description"
        content="Lendha's instant business loan and spend management solutions are built for small businesses like yours to grow and scale." />
    <meta name="twitter:image"
        content="https://res.cloudinary.com/thelendha/image/upload/v1659522824/upload/lendha-img-card_q1zyr4.jpg" />

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="icon" href="images/lendha-icon.png" />

    <!-- Styles -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css?family=Nunito&display=swap" fetchpriority="low" rel="preload"
        as="style" onload="this.onload=null;this.rel='stylesheet'">

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        fetchpriority="low" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">

    <link href="https://fonts.googleapis.com/css2?family=Enriqueta:wght@400;500;600;700&display=swap"
        fetchpriority="low" rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'">


    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
        integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous" />
    <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.min.js"></script>

    <!-- JSON-LD markup generated by Google Structured Data Markup Helper. -->
    <script type="application/ld+json">
    [{
        "@context": "http://schema.org",
        "@type": "Article",
        "name": "Lendha: Loans and Spend Management for African Small Businesses",
        "articleBody": "<p>Lendha's instant business loan and spend management solutions are built for small businesses like yours to grow and scale.</p>",
        "url": "https://lendha.com/",
        "publisher": {
          "@type": "Organization",
          "name": "Lendha"
        }
      },
      {
        "@context": "http://schema.org",
        "@type": "Article",
        "name": "Loans",
        "image": "https://res.cloudinary.com/thelendha/image/upload/v1650456178/upload/banner_len_dqom03.jpg",
        "articleBody": "<p>Get instant loans to grow your business. Lendha offers a stress-free application process.</p>",
        "url": "https://lendha.com/loans",
        "publisher": {
          "@type": "Organization",
          "name": "Lendha"
        }
      },
      {
        "@context": "http://schema.org",
        "@type": "Article",
        "name": "Spend Management - Lendha",
        "image": "https://res.cloudinary.com/thelendha/image/upload/v1650456178/upload/banner_len_dqom03.jpg",
        "articleBody": "<p>Open a Business Bank Account in few minutes, Automate payment, invoice generation and analyze cash flow with our all in one spend management tool.</p>",
        "url": "https://lendha.com/business-management",
        "publisher": {
          "@type": "Organization",
          "name": "Lendha"
        }
      },
      {
        "@context": "http://schema.org",
        "@type": "Article",
        "name": "FAQS - Lendha",
        "image": "https://res.cloudinary.com/thelendha/image/upload/v1650456178/upload/banner_len_dqom03.jpg",
        "articleBody": "<p>How can I get a loan?</p> <p> Create an account on www.lendha.com and complete your profile to apply for loans.</p>",
        "url": "https://lendha.com/faq",
        "publisher": {
          "@type": "Organization",
          "name": "Lendha"
        }
      }
    ]
  </script>
    {{ vite_assets() }}
    {{-- @viteReactRefresh --}}
</head>

<body>
    <div id="root">
    </div>

    <!-- Start of Async Zoho Sales IQ Chat Code -->
    {{-- <script type="text/javascript" defer>
        var $zoho=$zoho || {};$zoho.salesiq = $zoho.salesiq || 
        {widgetcode:"8f435efed5caeaf49dda5ceb5149e21a33bf6434fa37b932188a42c2a0acf829", values:{},ready:function(){}};
  var d=document;s=d.createElement("script");s.type="text/javascript";s.id="zsiqscript";s.defer=true;
  s.src="https://salesiq.zoho.com/widget";t=d.getElementsByTagName("script")[0];t.parentNode.insertBefore(s,t);d.write("<div id='zsiqwidget'></div>");
  </script> --}}
    <!-- End of Async Zoho Sales IQ Chat Code -->

    <!--Start of Tawk.to Script-->
    <script type="text/javascript" defer>
        var Tawk_API = Tawk_API || {},
            Tawk_LoadStart = new Date();
        (function() {
            var s1 = document.createElement("script"),
                s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/607d7194f7ce1827093bcf42/1f3l07b7v';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        })();
    </script>
    <!--End of Tawk.to Script-->

    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js" defer></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
        https://firebase.google.com/docs/web/setup#available-libraries -->
    <script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-analytics.js" defer></script>
    <script src="https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js" defer></script>

    <script defer>
        // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyASZiOjmwET2ttUW7TEgsVH2krm8YTXUXQ",
            authDomain: "lendha-6ab79.firebaseapp.com",
            projectId: "lendha-6ab79",
            storageBucket: "lendha-6ab79.appspot.com",
            messagingSenderId: "894955674939",
            appId: "1:894955674939:web:74e9c27f76da28f8912b1e",
            measurementId: "G-3QDHKT2DJJ"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();

        // FCM specific
        const messaging = firebase.messaging();

        messaging
            .requestPermission()
            .then(function() {
                return messaging.getToken()
            })
            .then(function(response) {
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    url: '{{ route('store.token') }}',
                    type: 'POST',
                    data: {
                        token: response
                    },
                    dataType: 'JSON',
                    success: function(response) {
                        console.log('Notification activated.');
                    },
                    error: function(error) {
                        console.error('an error occured');
                    },
                });

            }).catch(function(error) {
                console.error('an error occured');
            });

        messaging.onMessage(function(payload) {
            const title = payload.notification.title;
            const options = {
                body: payload.notification.body,
                icon: payload.notification.icon,
            };
            new Notification(title, options);
        });
    </script>
</body>

</html>