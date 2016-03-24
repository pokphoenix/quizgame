// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
  'ionic',
  'starter.controllers',
  'starter.services',
  'ionic.utils',
  'timeatk.controllers',
  'gameunlock.controllers',
  'gamenormal.controllers',
  // load semi module
  'semi',
  'semi.controllers'
])

.run(function($ionicPlatform,$localstorage,$interval,$filter,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var Exp =  parseInt($localstorage.get('Exp'));
    if (Exp==null){
      //console.log("Exp",Exp);
      $localstorage.set('Exp', 0);
    }

    var Coin =  parseInt($localstorage.get('Coin'));
    if (Coin==null){
      //console.log("Coin",Coin);
      $localstorage.set('Coin', 100);
    }

    var Life =  parseInt($localstorage.get('Life'));
    if (Life==null){
      //console.log("Life",Life);
      $localstorage.set('Life', 1);
    }

  //--- ถ้าlogin อยู่จะเช็ค + Life ทุกๆ 5 นาที
    var promise;
    addLife();
    promise = $interval(addLife,300000);

    function addLife() {
      var Life = parseInt($localstorage.get('Life'));

      var CurrentDate = new Date().getTime() ;
      var LastLogin = new Date($localstorage.get('lastLogin')).getTime()  ;
      //console.log( "CurrentDate : "+CurrentDate , "LastLogin : "+LastLogin );
      if(LastLogin!=CurrentDate){
        //var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisecondsPerMin = 1000 * 60 * 5    ;
        var millisBetween = CurrentDate - LastLogin ;
        //console.log("addLife millisBetween : "+millisBetween);

        var min =  Math.floor( millisBetween / millisecondsPerMin ) ;
        //console.log("addLife min : "+min);
        if (min>0){

          var Life = parseInt($localstorage.get('Life'));
          Life++ ;
          $localstorage.set('Life', Life) ;
          $localstorage.set('lastLogin', $filter('date')(new Date(), 'yyyy-MM-dd H:m:s') ) ;
          //console.log('Add Life Every 5 min :'+Life);
          $rootScope.life = Life ;

        }

      }

    }




    //--- เพิ่ม Life ตอน Login
    var CurrentDate = new Date().getTime() ;
    var LastLogin = new Date($localstorage.get('lastLogin')).getTime()  ;
    //console.log( "CurrentDate : "+CurrentDate , "LastLogin : "+LastLogin );
    if(LastLogin!=CurrentDate){
      //var millisecondsPerDay = 1000 * 60 * 60 * 24;
      var millisecondsPerMin = 1000 * 60 * 5  ;
      var millisBetween = CurrentDate - LastLogin ;
      //console.log("millisBetween : "+millisBetween);


      var min =  Math.floor( millisBetween / millisecondsPerMin ) ;
      //console.log("min : "+min);
      if (min>0){

        var Life = parseInt($localstorage.get('Life'));


        if (min<1){
          min = 1 ;
        }


        Life = Life*min ;

        $localstorage.set('Life', Life ) ;
        //console.log('Add Life when Login :'+Life);

      }

    }



  });
})


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('game', {
        url: '/game',
        abstract: true,
        templateUrl: 'templates/game.html',
        controller: 'GameCtrl'

      })

      .state('game.category', {
        url: '/category',
        views: {
          'menuContent': {
            templateUrl: 'templates/category.html',
            controller: 'CategoryCtrl'
          }
        }

      })

      .state('game.mode', {
        url: '/mode',
        views: {
          'menuContent': {
            templateUrl: 'templates/mode.html',
            controller: 'ModeCtrl'
          }
        }

      })

      .state('game.unlock', {
        url: '/unlock/:playId',
        views: {
          'menuContent': {
            templateUrl: 'templates/game/mode_unlock.html',
            controller: 'GameUnlockCtrl'
          }
        }

      })

      .state('game.time', {
        url: '/time',
        views: {
          'menuContent': {
            templateUrl: 'templates/time.html',
            controller: 'CategoryCtrl'
          }
        }

      })

      .state('game.attack', {
        url: '/timeattack/:playId',
        views: {
          'menuContent': {
            templateUrl: 'templates/game/time_attack.html',
            controller: 'TimeAtkCtrl'
          }
        }

      })

      .state('game.play', {
        url: '/play/:playId',
        views: {
          'menuContent': {
            templateUrl: 'templates/game/normal.html',
            controller: 'GameNormalCtrl'
          }
        }

      })

      .state('game.plays', {
        url: '/plays',
        views: {
          'menuContent': {
            templateUrl: 'templates/plays.html',
            controller: 'PlaysCtrl'
          }
        }

      })




      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
          }
        }
      })
      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:


  .state('game.dash', {
    url: '/dash',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

      //.state('tab.dash', {
      //  url: '/dash',
      //  views: {
      //    'tab-dash': {
      //      templateUrl: 'templates/tab-dash.html',
      //      controller: 'DashCtrl'
      //    }
      //  }
      //})

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/game/dash');

});
