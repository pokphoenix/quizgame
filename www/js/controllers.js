angular.module('starter.controllers', [])


    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
    })


    .controller('GameCtrl', function ($rootScope,$scope,$localstorage, $ionicHistory,$timeout) {

        $rootScope.coin = $localstorage.get('Coin');
        $rootScope.life = $localstorage.get('Life');
        $rootScope.exp = $localstorage.get('Exp');

        $scope.myGoBack = function () {
            $ionicHistory.goBack();
            $timeout.cancel($rootScope.mytimeout);
        };


        if ($rootScope.life<1){
            return false;
        }



        // console.log("UserName : "+$rootScope.UserName+" Money : [ "+$rootScope.UserMoney+" ] LastLogin : ( "+$rootScope.UserLastLogin+" )" );
    })



    .controller('DashCtrl', function ($rootScope,$scope,$localstorage,$filter,$ionicPopup,$timeout) {
        $rootScope.UserLastLogin = $localstorage.get('lastLogin');
        $rootScope.UserName = $localstorage.get('name');
        $rootScope.UserMoney = $localstorage.get('Coin');

        $scope.showPopup = function () {
            $scope.data = {};
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({

                title: 'Login Dialy!!!',
                subTitle: 'You receive 25 Coin',
                scope: $scope,
                buttons: [

                    {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onClick: function (e){
                            myPopup.close();
                        },
                        onTap: function (e) {
                            //if (!$scope.data.wifi) {
                            //    //don't allow the user to close unless he enters wifi password
                            //    e.preventDefault();
                            //} else {
                            //    return $scope.data.wifi;
                            //}
                            return null;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            //$timeout(function () {
            //    myPopup.close(); //close the popup after 3 seconds for some reason
            //}, 3000);
        };

        console.log("UserName : "+$rootScope.UserName+" Coin : [ "+$rootScope.UserMoney+" ] LastLogin : ( "+$rootScope.UserLastLogin+" )" );

        var CurrentDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        var LastLogin = $filter('date')( new Date($localstorage.get('lastLogin'))  , 'yyyy-MM-dd') ;


        console.log('CurrentDate : '+CurrentDate+' LastLogin : '+LastLogin);

        if(LastLogin!=CurrentDate){
            console.log("Login!!! Get 25 Coin");
            $localstorage.set('lastLogin', $filter('date')(new Date(), 'yyyy-MM-dd H:m:s') ) ;
            var UserMoney = parseInt($localstorage.get('Coin'));
            UserMoney += 25 ;
            $localstorage.set('Coin', UserMoney) ;
            $scope.showPopup();
        }

        // Triggered on a button click, or some other target


    })



    .controller('SearchCtrl', function ($scope,$http,$localstorage) {

        $localstorage.set('lastLogin', '100');
        $localstorage.set('Life', 100 ) ;
        $localstorage.set('Exp', 100 ) ;
        $localstorage.set('Coin', 100 ) ;

        var url = "";
        if(ionic.Platform.isAndroid()){
            url = "file:///android_asset/www";
        }

        $http.get(url+'/res/mode.json')
            .success(function (result) {
                console.log("mode result", result);
                $localstorage.setObject('gameMode',result.data);

            });




        console.log('name : Pok | money : 100 | lastLogin : 100');

        //$scope.data = {};
        //$scope.$watch('data.slider', function(nv, ov) {
        //    $scope.slider = $scope.data.slider;
        //})
    })


    .controller('CategoryCtrl', function ($scope,$rootScope,$ionicHistory,$localstorage, $http, $timeout) {


        //$ionicHistory.clearHistory();
        //$ionicHistory.clearCache();

        var currentStart = 0;
        $scope.MoreDataCanBeLoad = true;
        $scope.items = [];

        $scope.loadMoreData = function () {
            //$http.get('/more-items').success(function(items) {
            //    useItems(items);
            //    $scope.$broadcast('scroll.infiniteScrollComplete');
            //});
            $timeout(function () {
                if ($scope.items.length < 50) {
                    console.log("loop 50");
                    for (var i = currentStart; i < currentStart + 20; i++) {
                        $scope.items.push({
                            id: i,
                            album: 'Gotta Be Somebody',
                            artist: 'Nickelback',
                            image: '/img/nockelback.jpg'
                        })
                    }

                    currentStart += 20;
                    $scope.$broadcast('scroll.infiniteScrollComplete')
                } else {
                    $scope.MoreDataCanBeLoad = false;
                    console.log("loop timeout");
                    $scope.$broadcast('scroll.infiniteScrollComplete')
                }
            }, 3000);


        };

        //$scope.$on('$stateChangeSuccess', function() {
        //    $scope.loadMoreData();
        //});


        var url = "";
        if(ionic.Platform.isAndroid()){
            url = "file:///android_asset/www";
        }

        $scope.loadData = function () {



            var Life = $localstorage.get('Life') ;
            if (Life<1){
                $location.path('/game/dash',true);
            }



            //console.log("in loadData");
            //var serviceUrl = 'file:///android_asset/www';

            $http.get(url+'/res/category.json')
                .success(function (newItems) {

                    console.log("newItems", newItems);

                    $scope.items = newItems.data;
                })
                .finally(function () {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        $scope.doRefresh = function () {


            $timeout(function () {
                $http.get(url+'/res/category.json')
                    .success(function (newItems) {

                        console.log("newItems", newItems);

                        $scope.items = newItems.data;
                    })
                    .finally(function () {
                        // Stop the ion-refresher from spinning
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }, 3000);


        };

    })

    .controller('ModeCtrl', function ($scope,$rootScope,$ionicHistory,$localstorage, $http, $timeout) {




        var currentStart = 0;
        $scope.MoreDataCanBeLoad = true;
        $scope.items = [];

        var url = "";
        if(ionic.Platform.isAndroid()){
            url = "file:///android_asset/www";
        }

        $scope.loadData = function () {


            $scope.items = $localstorage.getObject('gameMode');


            //$http.get(url+'/res/mode.json')
            //    .success(function (result) {
            //        console.log("load Data : result", result);
            //        $scope.items = result.data;
            //
            //
            //        console.log($scope.items[0].image[$scope.items[0].star].img, $scope.items[0].unlock );
            //
            //    })
            //    .finally(function () {
            //        // Stop the ion-refresher from spinning
            //        $scope.$broadcast('scroll.refreshComplete');
            //    });
        };


    })

    .filter('getById', function() {
        return function(input, id) {
            var i=0, len=input.length;
            for (; i<len; i++) {
                if (+input[i].id == +id) {
                    return input[i];
                }
            }
            return null;
        }
    })


    .controller('PlaysCtrl', function ($scope, $state, $ionicSlideBoxDelegate) {

        // Called to navigate to the main app
        $scope.startApp = function () {
            $state.go('main');
        };
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };
    })


    .controller('ChatsCtrl', function ($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});


        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })




    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            {title: 'Reggae', id: 1},
            {title: 'Chill', id: 2},
            {title: 'Dubstep', id: 3},
            {title: 'Indie', id: 4},
            {title: 'Rap', id: 5},
            {title: 'Cowbell', id: 6}
        ];
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    })
;
