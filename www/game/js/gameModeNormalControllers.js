angular.module('gamenormal.controllers', [])


    .controller('GameNormalCtrl', function ($scope,$state,ModalService,$rootScope,$location,$ionicViewService,$localstorage,$http,$ionicHistory, $ionicModal, $timeout, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate,$stateParams,$filter) {
        //
        //$rootScope.UserLastLogin = $localstorage.get('lastLogin');
        //$rootScope.UserName = $localstorage.get('name');
        //$rootScope.UserMoney = ;

        $scope.playId = $stateParams.playId ;

        $scope.mode = [];
        $scope.totalScore = 0 ;
        $scope.slideCount =  $ionicSlideBoxDelegate.slidesCount()  ;

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


        $scope.backtomain = function () {
            $location.path('/tab/dash',true);
        };



        loadData();


        function loadData(){
            var Life = $localstorage.get('Life') ;
            if (Life<1){
                $location.path('/game/dash',true);
            }


            var url = "";
            if(ionic.Platform.isAndroid()){
                url = "file:///android_asset/www";
            }
            //console.log("in loadData");
            //var serviceUrl = 'file:///android_asset/www';



            $http.get(url+'/quiz/quiz_'+$stateParams.playId+'.json')
                .success(function (result) {
                    console.log("quiz result", result);
                    $scope.question = result.data;
                    //---   use life every play game ;
                    var Life =  parseInt($localstorage.get('Life'));
                    console.log('Life : '+Life);
                    var useLife = Life-1 ;
                    console.log('Life : '+Life+' useLife : '+useLife);
                    $localstorage.set('Life',useLife) ;
                    $rootScope.life = $localstorage.get('Life');
                    //---  end   use life every play game ;
                    for (var rd in $scope.question) {
                        var item = $scope.question[rd];
                        var choice = item.choice;
                        ModalService.shuffleArray(choice);
                    }
                    ModalService.shuffleArray($scope.question);
                })
            .error(function () {
                console.log("On Error!!!");
                $scope.NoQuizPopup();
            });

            //$http.get(url+'/res/mode.json')
            //    .success(function (result) {
            //        console.log("mode result", result);
            //        $scope.mode = result.data;
            //    });

            $scope.mode = $localstorage.getObject('gameMode');

        }

        $scope.selectAnswer = function (qid, aid) {
            //console.log("selectAnswer", qid, "select id : " + aid);
            if(qid==0&&aid==0){
                var myPopup = ModalService.timeOut($scope);
                myPopup.then(function () {
                    $scope.closeModal();
                });
            }else{
                var found = $filter('getById')($scope.question, qid);
                console.log('found',found.answerId);

                if (found.answerId==aid){
                    $scope.totalScore ++ ;
                    ModalService.success($scope).then(function(modal) { modal.show(); });
                }else{
                    ModalService.fail($scope).then(function(modal) { modal.show();  });
                }

                $timeout(function () {
                    $scope.closeModal();
                }, 1000);

            }



        };


        // Triggered in the login modal to close it
        $scope.closeModal = function () {
            var slideCur = $ionicSlideBoxDelegate.currentIndex();
            slideCur++ ;
            var lastSlide = $ionicSlideBoxDelegate.slidesCount()-1 ;
            console.log('Close Modal slideCnt : '+lastSlide+' slideCur : '+slideCur);
            if(slideCur<lastSlide) {
                $ionicSlideBoxDelegate.next();
                console.log("Next Move!! total : "+ $scope.totalScore+" slide Count : "+lastSlide );
            }else if(slideCur==lastSlide){
                $ionicSlideBoxDelegate.next();
                $ionicSlideBoxDelegate.stop();
                console.log("Finish !!");
                $scope.endGame();
            }
            //console.log('slideCnt : '+slideCnt+' slideCur : '+slideCur);
        };



        $scope.endGame = function () {
            $scope.lastSlide = $ionicSlideBoxDelegate.slidesCount()-1 ;
            console.log("End Game");
            $scope.percentCal = Math.floor(($scope.totalScore*100)/$scope.lastSlide) ;
            $scope.percent =   $scope.percentCal+" % " ;
            console.log("End Game : percent "+$scope.percentCal);
        };



        $scope.NoQuizPopup = function () {
            var myPopup = $ionicPopup.show({
                title: 'ไม่พบชุดคำถามนี้ค่ะ',
                subTitle: 'sorry something wrong!',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onClick: function (){
                            myPopup.close();
                        },
                        onTap: function () {
                            return null;
                        }
                    }
                ]
            });
            myPopup.then(function () {
                $scope.backtomain();
            });
        };

    })


;
