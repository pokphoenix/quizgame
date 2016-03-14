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


    .controller('GameCtrl', function ($rootScope,$scope, $ionicHistory,$localstorage) {
        $scope.myGoBack = function () {
            $ionicHistory.goBack();
        };






       // console.log("UserName : "+$rootScope.UserName+" Money : [ "+$rootScope.UserMoney+" ] LastLogin : ( "+$rootScope.UserLastLogin+" )" );



    })



    .controller('DashCtrl', function ($rootScope,$scope,$localstorage,$filter,$ionicPopup,$timeout) {
        $rootScope.UserLastLogin = $localstorage.get('lastLogin');
        $rootScope.UserName = $localstorage.get('name');
        $rootScope.UserMoney = $localstorage.get('money');

        $scope.showPopup = function () {
            $scope.data = {};
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({

                title: 'Login Dialy!!!',
                subTitle: 'You receipt 25 Money',
                scope: $scope,
                buttons: [

                    {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.wifi) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data.wifi;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };

        console.log("UserName : "+$rootScope.UserName+" Money : [ "+$rootScope.UserMoney+" ] LastLogin : ( "+$rootScope.UserLastLogin+" )" );

        var CurrentDate = $filter('date')(new Date(), 'yyyy-MM-dd');


        var LastLogin = $localstorage.get('lastLogin');

        if(LastLogin!=CurrentDate){

            console.log("Login!!! Get 25 Money");
            $localstorage.set('lastLogin', CurrentDate) ;
            var UserMoney = parseInt($localstorage.get('money'));
            UserMoney += 25 ;
            $localstorage.set('money', UserMoney) ;

            $scope.showPopup();

        }

        // Triggered on a button click, or some other target


    })



    .controller('SearchCtrl', function ($scope,$localstorage) {


        $localstorage.set('name', 'Pok');
        $localstorage.set('money', '100');
        $localstorage.set('lastLogin', '100');

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
        $rootScope.money = parseInt($localstorage.get('money')) ;

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

    .controller('PlayCtrl', function ($scope,$rootScope,$localstorage,$http, $ionicModal, $timeout, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate,$stateParams,$filter) {
        //
        //$rootScope.UserLastLogin = $localstorage.get('lastLogin');
        //$rootScope.UserName = $localstorage.get('name');
        //$rootScope.UserMoney = ;

        $rootScope.money = parseInt($localstorage.get('money')) ;


        $scope.options = {
            loop: false,
            speed: 500
        };

        $scope.repeatDone = function (choice) {
            shuffleArray(choice);
            $ionicSlideBoxDelegate.update();
            //$ionicSlideBoxDelegate.slide($scope.week.length - 1, 1);
        };

        $scope.disableSwipe = function () {
            $ionicSlideBoxDelegate.enableSlide(false);
        };

        $scope.onLoadGame = function () {


            $scope.disableSwipe();
        };

        //$ionicSlideBoxDelegate.stop();
        //$ionicSlideBoxDelegate.enableSlide(false);

        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };


        // Triggered on a button click, or some other target
        $scope.showPopup = function () {
            $scope.data = {};
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="data.wifi">',
                title: 'Enter Wi-Fi Password',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.data.wifi) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                return $scope.data.wifi;
                            }
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 3000);
        };

        // A confirm dialog
        $scope.showConfirm = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Consume Ice Cream',
                template: 'Are you sure you want to eat this ice cream?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        };

        // An alert dialog
        $scope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Don\'t eat that!',
                template: 'It might taste good'
            });

            alertPopup.then(function (res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

        loadData();


        function loadData(){
            var url = "";
            if(ionic.Platform.isAndroid()){
                url = "file:///android_asset/www";
            }
            //console.log("in loadData");
            //var serviceUrl = 'file:///android_asset/www';

            $http.get(url+'/quiz/quiz_'+$stateParams.playId+'.json')
                .success(function (result) {

                    console.log("result", result);

                    $scope.question = result.data;


                    for (var rd in $scope.question) {
                        var item = $scope.question[rd];
                        var choice = item.choice;
                        shuffleArray(choice);
                    }
                    shuffleArray($scope.question);

                });
        }



        //$scope.question = [
        //    {
        //        title: 'Who is Aum Patcharapa?',
        //        id: 5,
        //        img: "",
        //        choice: [{
        //            id: 1,
        //            name: "pat",
        //            img: "http://dodeden.com/2013/wp-content/uploads/2015/02/p61-600x600.jpg"
        //        }, {id: 2, name: "aum ", img: "http://f.ptcdn.info/238/009/000/1378204583-image-o.jpg"}, {
        //            id: 3,
        //            name: "min",
        //            img: "http://100sexiest.fhm.in.th/2014/images/winner022/thumb-03.jpg"
        //        }, {id: 4, name: "atom", img: "http://f.ptcdn.info/466/036/000/nwbhsncudZGneFFo9Ja-o.jpg"}]
        //    },
        //    {
        //        title: 'What is color',
        //        id: 1,
        //        answerId: 4,
        //        img: "http://www.thescreenmachineco.net/inks_&_process/screen_macine-CAD_cut_vinyl-color-Athletic_Gold-PMS_1235.png",
        //        choice: [{id: 1, name: "Red"}, {id: 2, name: "Blue"}, {id: 3, name: "Green"}, {id: 4, name: "Gold"}]
        //    },
        //    {
        //        title: '13 + 5 = ?',
        //        id: 2,
        //        img: "",
        //        choice: [{id: 1, name: "17"}, {id: 2, name: "18"}, {id: 3, name: "19"}, {id: 4, name: "20"}]
        //    },
        //    {title: 'ng-if is a boolean', id: 3, img: "", choice: [{id: 1, name: "Yes"}, {id: 2, name: "No"}]},
        //    {
        //        title: 'What isn\'t Mobile Platform',
        //        id: 4,
        //        img: "",
        //        choice: [{id: 1, name: "Android"}, {id: 2, name: "iPhone"}, {id: 3, name: "Alabar"}]
        //    }
        //
        //
        //];


        var shuffleArray = function (array) {
            var m = array.length, t, i;

            // While there remain elements to shuffle
            while (m) {
                // Pick a remaining element…
                i = Math.floor(Math.random() * m--);

                // And swap it with the current element.
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }

            return array;
        };


        $scope.selectAnswer = function (qid, aid) {

            console.log("selectAnswer", qid, "select id : " + aid);


            var found = $filter('getById')($scope.question, qid);
            console.log('found',found.answerId);

            if (found.answerId==aid){
                $scope.successModal();
            }else{
                $scope.failModal();
            }



           // $scope.selected = JSON.stringify(found);



            //if (qid == 2 && aid == 2) {
            //    $scope.successModal();
            //
            //} else if (qid == 1 && aid == 1) {
            //    $scope.showConfirm();
            //
            //
            //} else if (qid == 3 && aid == 1) {
            //    $scope.showAlert();
            //
            //
            //} else if (qid == 4 && aid == 1) {
            //    $scope.showPopup();
            //
            //} else {
            //    $scope.failModal();
            //}

            //console.log("selectAnswer",$scope.q.id) ;
            //console.log("selectAnswer",$scope.q.id) ;

        };


        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/success.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.success = modal;
        });

        $ionicModal.fromTemplateUrl('templates/fail.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.fail = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeModal = function () {
            $scope.fail.hide();
            $scope.success.hide();
            $ionicSlideBoxDelegate.next();
        };


        $scope.failModal = function () {
            $rootScope.money -= 5;
            $localstorage.set('money', $rootScope.money);
            $scope.fail.show();
            $timeout(function () {
                $scope.closeModal();
            }, 1000);
        };

        $scope.successModal = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-energized"></ion-spinner>Loading...'
            });



            $rootScope.money += 5;
            $localstorage.set('money', $rootScope.money);
            $scope.success.show();
            $timeout(function () {
                $scope.closeModal();
                $ionicLoading.hide();
            }, 1000);
        };


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
