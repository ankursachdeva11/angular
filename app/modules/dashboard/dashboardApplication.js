/*==========================================================
    Author      : Ranjithprabhu K
    Date Created: 24 Dec 2015
    Description : Base for Dashboard Application module
    
    Change Log
    s.no      date    author     description     
    

 ===========================================================*/

var dashboard = angular.module('dashboard', ['ui.router', 'ngAnimate','ngMaterial','ui.bootstrap','angular.morris-chart','googlechart','ngCookies']);


dashboard.config(["$stateProvider", function ($stateProvider) {

    //dashboard home page state
    $stateProvider.state('app.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/modules/dashboard/views/home.html',
        controller: 'HomeController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Home'
        }
    });

    $stateProvider.state('app.tasks', {
        url: '/tasks',
        templateUrl: 'app/modules/dashboard/views/tasks.html',
        controller: 'TasksController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Task Manager'
        }
    });

    $stateProvider.state('app.tasklist', {
        url: '/tasklist',
        templateUrl: 'app/modules/dashboard/views/tasklist.html',
        controller: 'TasklistController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Task Manager'
        }
    });

    //Search page state
    $stateProvider.state('app.search', {
        url: '/search',
        templateUrl: 'app/modules/dashboard/views/search.html',
        controller: 'appCtrl',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Search'
        }
    });

    $stateProvider.state('app.graph', {
        url: '/graph',
        templateUrl: 'app/modules/dashboard/views/graph.html',
        controller: 'GraphController',
        controllerAs: 'vm',
        data: {
            pageTitle: 'Search'
        }
    });

}]);

