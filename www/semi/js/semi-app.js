angular.module('semi', ['ui.router'])
.config(['$stateProvider', function($stateProvider){
    $stateProvider
        .state('semi.games', {
            url: '/semi/games',
            views: {
                'menuContent': {
                    templateUrl: 'semi/templates/air-hockey.html',
                    controller: 'AirHockeyCtrl'
                }
            }
        })
        .state('semi.games.airHockey', {
            url: '/semi/games/air-hockey',
            views: {
                'menuContent': {
                    templateUrl: 'semi/templates/air-hockey.html',
                    controller: 'AirHockeyCtrl'
                }
            }
        })
}]);