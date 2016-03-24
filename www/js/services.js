angular.module('starter.services', [])

    .factory('Chats', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'img/ben.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'img/max.png'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'img/adam.jpg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'img/perry.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'img/mike.png'
        }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    })


    .factory('ModalService', function($ionicModal,$ionicPopup,$timeout, $rootScope) {
        var fac = {};


        fac.shuffleArray = function(array) {

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

        fac.success = function($scope) {

            var promise;
            $scope = $scope || $rootScope.$new();

            promise = $ionicModal.fromTemplateUrl('templates/modal/success.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                return modal;
            });

            //$scope.openModal = function() {
            //    $scope.modal.show();
            //};
            $scope.close = function() {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });

            $timeout(function () {
                $scope.modal.hide();
            }, 1000);

            var clickAudio = new Audio('game/sound/Success.mp3');
            clickAudio.play();

            return promise;
        };

        fac.fail = function($scope) {

            var promise;
            $scope = $scope || $rootScope.$new();

            promise = $ionicModal.fromTemplateUrl('templates/modal/fail.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                return modal;
            });

            //$scope.openModal = function() {
            //    $scope.modal.show();
            //};
            $scope.close = function() {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });

            $timeout(function () {
                $scope.modal.hide();
            }, 1000);

            var clickAudio = new Audio('game/sound/Fail.mp3');
            clickAudio.play();

            return promise;
        };


        fac.timeOut = function($scope) {


            var promise;
            $scope = $scope || $rootScope.$new();

            promise = $ionicModal.fromTemplateUrl('templates/modal/timeup.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                return modal;
            });
            $scope.close = function() {
                $scope.modal.hide();
            };
            $timeout(function () {
                $scope.modal.hide();
            }, 2000);
            //var myPopup = $ionicPopup.show({
            //    title: 'Time Out!!!',
            //    subTitle: 'You not answer this question!',
            //    scope: $scope,
            //    buttons: [
            //        {
            //            text: '<b>OK</b>',
            //            type: 'button-positive',
            //            onClick: function (e){
            //                myPopup.close();
            //            },
            //            onTap: function (e) {
            //                return null;
            //            }
            //        }
            //    ]
            //}).then(function (modal) {
            //
            //    $scope.modal = modal;
            //    return modal;
            //
            //});


            var clickAudio = new Audio('game/sound/OutOfTime.mp3');
            clickAudio.play();

            return promise;
        };


        fac.star3 = function($scope) {

            var promise;
            $scope = $scope || $rootScope.$new();

            promise = $ionicModal.fromTemplateUrl('templates/modal/star3.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                return modal;
            });

            //$scope.openModal = function() {
            //    $scope.modal.show();
            //};
            $scope.close = function() {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });


            var clickAudio = new Audio('game/sound/Success.mp3');
            clickAudio.play();

            return promise;
        };


        return fac ;

    });


    //.factory('GameSound', function ($ionicModal,$timeout, $rootScope,$q,$ionicModal, $ionicPlatform, $window) {
    //    var fac = {};
    //
    //    fac.success = function($scope) {
    //
    //        var clickAudio = new Audio('game/sound/Success.mp3');
    //        return clickAudio.play();
    //    };
    //
    //    fac.fail = function() {
    //        var clickAudio = new Audio('game/sound/Fail.mp3');
    //        return clickAudio.play();
    //    };
    //
    //    return fac;
    //});
