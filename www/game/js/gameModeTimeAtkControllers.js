angular.module('timeatk.controllers', [])

    .controller('TimeAtkCtrl', function ($scope,$state,ModalService,$rootScope,$location,$ionicViewService,$localstorage,$http,$ionicHistory, $ionicModal, $timeout, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate,$stateParams,$filter) {

        $scope.mode = [];
        $scope.totalScore = 0 ;
        $scope.slideCount =  $ionicSlideBoxDelegate.slidesCount()  ;
        $scope.counter = 15;
        $scope.hurry = false  ;
        $scope.scorePerSuccess = 10 ;
        $scope.lastSlide = 1 ;
        var HurryAudio = new Audio('game/sound/Hurry.mp3');
        $scope.convertSecondToTime = function(input){
            function z(n) { return (n < 10 ? '0' : '') + n; }
            var seconds = input % 60;
            var minutes = Math.floor(input % 3600 / 60);
            var hours = Math.floor(input / 3600);
            if (input<=10){
                $scope.hurry = true  ;
                HurryAudio.play();
            }else{
                $scope.hurry = false  ;
                HurryAudio.pause();
                HurryAudio.currentTime = 0;
            }
            $scope.clock = (z(hours) + ':' + z(minutes) + ':' + z(seconds));
        };

        $rootScope.mytimeout = null; // the current timeoutID
        $scope.onTimeout = function() {
            if($scope.counter ===  0) {
                $scope.$broadcast('timer-stopped', 0);
                $timeout.cancel($rootScope.mytimeout);
                $scope.selectAnswer(0,0);
                console.log("Time Out!!!") ;
                return;
            }
            //console.log('counter : '+$scope.counter);
            $scope.counter--;
            $scope.convertSecondToTime($scope.counter);
            $rootScope.mytimeout = $timeout($scope.onTimeout, 1000);
        };
        $scope.startTimer = function() {
            $rootScope.mytimeout = $timeout($scope.onTimeout, 1000);
        };
        // stops and resets the current timer
        $scope.stopTimer = function() {
            $scope.$broadcast('timer-stopped', $scope.counter);
            $scope.counter = 0;
            $timeout.cancel($rootScope.mytimeout);
        };

        $scope.$on('timer-stopped', function(event, remaining) {
            if(remaining === 0) {
                console.log('timer-stopped : remaining');
            }
            $timeout.cancel($rootScope.mytimeout);
        });

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
            $timeout.cancel($rootScope.mytimeout);
            $location.path('/game/dash',true);
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
            $http.get(url+'/quiz/timeattack/quiz_'+$stateParams.playId+'.json')
                .success(function (result) {
                    console.log("quiz result", result);
                    //---   use life every play game ;
                    var Life =  parseInt($localstorage.get('Life'));
                    $scope.startTimer();
                    console.log('Life : '+Life);
                    var useLife = Life-1 ;
                    console.log('Life : '+Life+' useLife : '+useLife);
                    $localstorage.set('Life',useLife) ;
                    $rootScope.life = $localstorage.get('Life');
                    //---  end   use life every play game ;
                    $scope.question = result.data;
                    for (var rd in $scope.question) {
                        var item = $scope.question[rd];
                        var choice = item.choice;
                        ModalService.shuffleArray(choice);
                    }
                    ModalService.shuffleArray($scope.question);
                })
                .error(function (e) {
                    console.log("On Error!!!");
                    $scope.NoQuizPopup();

                })
        }


        $scope.selectAnswer = function (qid, aid) {
            console.log("selectAnswer", qid, "select id : " + aid);
            if(qid==0&&aid==0){
                var slideCount = $ionicSlideBoxDelegate.slidesCount()-1 ;
                console.log('slideCount'+slideCount);
                $ionicSlideBoxDelegate.slide(slideCount) ;
                $scope.stopTimer();
                $scope.endGame();
            }else{
                var found = $filter('getById')($scope.question, qid);
                console.log('found',found.answerId);
                if (found.answerId==aid){
                    //$scope.successModal();
                    var clickAudio = new Audio('game/sound/Success.mp3');
                    clickAudio.play();
                    $scope.closeModal();
                    $scope.totalScore ++ ;
                    $scope.counter += 2  ;
                    $scope.convertSecondToTime($scope.counter);
                }else{
                    //$scope.failModal();
                    //$scope.totalScore ++ ;
                    $scope.counter -= 5  ;
                    if ($scope.counter<1){
                        $scope.counter = 0 ;
                    }
                    var clickAudio = new Audio('game/sound/Fail.mp3');
                    clickAudio.play();
                    $scope.closeModal();
                    $scope.convertSecondToTime($scope.counter);
                }
            }

        };



        // Triggered in the login modal to close it
        $scope.closeModal = function () {

            $scope.slideCount =  ($ionicSlideBoxDelegate.slidesCount() ) ;
            var slideCur = $ionicSlideBoxDelegate.currentIndex();
            slideCur++ ;
            console.log('slideCnt : '+$scope.slideCount+' slideCur : '+slideCur);
            var lastSlide = $scope.slideCount-1 ;
            if(slideCur<lastSlide) {
                $ionicSlideBoxDelegate.next();
                $scope.slideCount -- ;
                console.log("Next Move!! total : "+ $scope.totalScore+" slide Count : "+$scope.slideCount );
            }else if((slideCur>1)&&(slideCur==lastSlide)){
                $scope.lastSlide = lastSlide ;
                $ionicSlideBoxDelegate.next();
                $ionicSlideBoxDelegate.stop();
                console.log("Finish !!");
                $scope.stopTimer();
                $scope.endGame();
            }
            //console.log('slideCnt : '+slideCnt+' slideCur : '+slideCur);
        };

        $scope.endGame = function () {
            $scope.stopTimer();
            HurryAudio.pause();
            HurryAudio.currentTime = 0;

            $scope.lastSlide = $ionicSlideBoxDelegate.slidesCount()-1 ;

            $scope.percentCal = Math.floor(($scope.totalScore*100)/$scope.lastSlide) ;
            $scope.percent =   $scope.percentCal+" % " ;
            console.log("End Game : percent "+$scope.percentCal);

            var expPlus =  $scope.totalScore * $scope.scorePerSuccess ;
            var Exp =  parseInt($localstorage.get('Exp'));
            var calExp = Exp + expPlus ;

            $localstorage.set( 'Exp' , calExp ) ;
            $rootScope.exp = calExp ;
            console.log("End Game : calExp "+calExp);

        };



        $scope.NoQuizPopup = function () {
            $scope.data = {};
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                title: 'ไม่พบชุดคำถามนี้ค่ะ',
                subTitle: 'sorry something wrong!',
                scope: $scope,
                buttons: [
                    {
                        text: '<b>OK</b>',
                        type: 'button-positive',
                        onClick: function (e){
                            myPopup.close();
                        },
                        onTap: function (e) {
                            return null;
                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                $scope.backtomain();
            });

        };




    })


;
