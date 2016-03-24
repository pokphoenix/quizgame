angular.module('gameunlock.controllers', [])


    .controller('GameUnlockCtrl', function ($scope,$state,ModalService,$rootScope,$location,$ionicViewService,$localstorage,$http,$ionicHistory, $ionicModal, $timeout, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate,$stateParams,$filter) {

        $scope.playId = $stateParams.playId ;

        $scope.mode = [];
        $rootScope.money = parseInt($localstorage.get('money')) ;
        $scope.totalScore = 0 ;
        $scope.slideCount =  $ionicSlideBoxDelegate.slidesCount()  ;
        $scope.counter = 5;
        $rootScope.mytimeout = null; // the current timeoutID
        $scope.onTimeout = function() {
            if($scope.counter ===  0) {
                $scope.$broadcast('timer-stopped', 0);
                $timeout.cancel($rootScope.mytimeout);

                $scope.selectAnswer(0,0);
                console.log("Time Out!!!") ;

                return;
            }
            console.log("counter!!! --") ;
            $scope.counter--;
            $rootScope.mytimeout = $timeout($scope.onTimeout, 1000);
        };
        $scope.startTimer = function() {
            $rootScope.mytimeout = $timeout($scope.onTimeout, 1000);
        };
        // stops and resets the current timer
        $scope.stopTimer = function() {
            $scope.$broadcast('timer-stopped', $scope.counter);
            $scope.counter = 5;
            $timeout.cancel($rootScope.mytimeout);
        };

        $scope.$on('timer-stopped', function(event, remaining) {
            if(remaining === 0) {

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
            $http.get(url+'/quiz/unlock/quiz_'+$stateParams.playId+'.json')
                .success(function (result) {
                    console.log("quiz result", result);
                    $scope.question = result.data;
                    //---   use life every play game ;
                    var Life =  parseInt($localstorage.get('Life'));
                    $scope.startTimer();
                    var useLife = Life-1 ;
                    //console.log('Life : '+Life+' useLife : '+useLife);
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
            .error(function (e) {
                console.log("On Error!!!");
                $scope.NoQuizPopup();
            });
            $scope.mode = $localstorage.getObject('gameMode');
        }

        $scope.selectAnswer = function (qid, aid) {
            //console.log("selectAnswer", qid, "select id : " + aid);
            $scope.stopTimer();
            if(qid==0&&aid==0){
                ModalService.timeOut($scope).then(function(modal) { modal.show(); });
            }else{
                var found = $filter('getById')($scope.question, qid);
                console.log('found',found.answerId);
                if (found.answerId==aid){
                    $scope.totalScore ++ ;
                    ModalService.success($scope).then(function(modal) { modal.show(); });
                }else{
                    ModalService.fail($scope).then(function(modal) { modal.show();  });
                }
            }
            $timeout(function () {
                $scope.closeModal();
            }, 2000);
        };

        // Triggered in the login modal to close it
        $scope.closeModal = function () {
            $scope.stopTimer();

            var slideCur = $ionicSlideBoxDelegate.currentIndex();
            slideCur++ ;

            $scope.slideCount =  $ionicSlideBoxDelegate.slidesCount()  ;

            var lastSlide = $scope.slideCount-1 ;
            console.log('Close Modal slideCnt : '+$scope.slideCount+' slideCur : '+slideCur+' lastSlide : '+lastSlide);
            if(slideCur<lastSlide) {
                $ionicSlideBoxDelegate.next();
                $scope.startTimer();
                //console.log("Next Move!! total : "+$scope.totalScore+" slide Count : "+$scope.slideCount );
            }else if(slideCur==lastSlide){
                $scope.lastSlide = lastSlide ;
                $ionicSlideBoxDelegate.next();
                $ionicSlideBoxDelegate.stop();
                $scope.stopTimer();
                $scope.endGame();
            }
        };

        $scope.endGame = function () {
            $scope.stopTimer();
            console.log("End Game");

            var lastslide = $scope.slideCount-1 ;

            console.log('lastslide '+lastslide+' $scope.totalScore '+$scope.totalScore);

            $scope.percentCal = Math.floor(($scope.totalScore*100)/lastslide) ;
            $scope.percent =   $scope.percentCal+" % " ;
            console.log("End Game : percent "+$scope.percentCal);
            var star = 0 ;
            if( $scope.percentCal > 50 ){
                star = 1 ;
                ModalService.star3($scope).then(function(modal) { modal.show(); });
            }else if( $scope.percentCal > 50 && $scope.percentCal < 80 ){
                star = 2 ;
                ModalService.star3($scope).then(function(modal) { modal.show(); });
            }else if( $scope.percentCal > 50 && $scope.percentCal <= 100 ){
                star = 3 ;
                ModalService.star3($scope).then(function(modal) { modal.show(); });
            }
            console.log('star',star);
            //--- คะแนนผ่านครึ่งจึงจะปลดล๊อกด่านได้
            if (star>0){
                var NextIndex = "" ;
                for ( var jk =0 ; jk < $scope.mode.length ; jk++ ){
                    if ($scope.mode[jk].id==$stateParams.playId){
                        $scope.mode[jk].star = star ;
                        NextIndex = jk+1 ;
                        console.log("index [ "+jk+" ] id : "+ $scope.mode[jk].id +"star : "+star+" next id : "+NextIndex ) ;
                    }
                    if (jk==NextIndex){
                        $scope.mode[jk].unlock = 1 ;
                        console.log("NextIndex "+NextIndex+" unlock !!!"+$scope.mode[jk].id) ;
                    }
                }
                $localstorage.setObject('gameMode',$scope.mode );
                //$scope.UnlockPopup() ;

                console.log('$localstorage',$localstorage.getObject('gameMode'));
            }
        };

        //$scope.UnlockPopup = function () {
        //    $scope.data = {};
        //    // An elaborate, custom popup
        //    var myPopup = $ionicPopup.show({
        //        template: ' <div class="cf3"> <img ng-src="game/img/star_empty.png" class="img-choice bottom" > <img ng-src="game/img/star.png" class="img-choice top" > </div>',
        //        title: 'ปลดล๊อกด่านถัดไป',
        //        subTitle: 'You not answer this question!',
        //        scope: $scope,
        //        buttons: [
        //            {
        //                text: '<b>OK</b>',
        //                type: 'button-positive',
        //                onClick: function (e){
        //                    myPopup.close();
        //                },
        //                onTap: function (e) {
        //                    return null;
        //                }
        //            }
        //        ]
        //    });
        //    myPopup.then(function (res) {
        //        $scope.backtomain();
        //    });
        //
        //};

        $scope.NoQuizPopup = function () {
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
