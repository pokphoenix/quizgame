angular.module('app.semi', ['ui.router'])
.config(['$stateProvider', function($stateProvider){
    $stateProvider
        .state('game.category', {
            url: '/category',
            views: {
                'menuContent': {
                    templateUrl: 'templates/category.html',
                    controller: 'CategoryCtrl'
                }
            }
        })
}]);