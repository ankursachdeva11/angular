/*==========================================================
   Author      : Ranjithprabhu K
   Date Created: 05 Jan 2016
   Description : To handle the service for Dashboard module
   
   Change Log
   s.no      date    author     description     
===========================================================*/


dashboard.service('dashboardService', ['$http', '$q', 'Flash', 'apiService', function ($http, $q, Flash, apiService) {

    var dashboardService = {};


    //service to communicate with users model to verify login credentials
    var accessLogin = function (parameters) {
        var deferred = $q.defer();
        apiService.get("users", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };


    //service to communicate with users model to verify login credentials
    var getEmps = function (parameters) {
        var deferred = $q.defer();
        apiService.get("getAllEmps.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };
    
    var getStatus = function (parameters) {
        var deferred = $q.defer();
        apiService.get("getStatus.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    //service to communicate with users to include a new user
    var createtask = function (parameters) {
        var deferred = $q.defer();
        apiService.create("task.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

     //service to communicate with users model to verify login credentials
    var getTasks = function (parameters) {
        var deferred = $q.defer();
        apiService.get("get_tasklist.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    var getTaskDetails = function (parameters) {
        var deferred = $q.defer();
        apiService.get("getTaskDetails.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };
	
	var getTaskDashboard = function (parameters) {
        var deferred = $q.defer();
        apiService.get("getTaskCount.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };
    
    
        var getNatureDashboard = function (parameters) {
        var deferred = $q.defer();
        apiService.get("getNatureCount.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    var getgraph = function (parameters) {
        var deferred = $q.defer();
        apiService.get("graphdata.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    var getactivities = function (parameters) {
        var deferred = $q.defer();
        apiService.get("get_activities.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    var getdepts = function (parameters) {
        var deferred = $q.defer();
        apiService.get("getdepts.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    var getNotification = function (parameters) {
        var deferred = $q.defer();
        apiService.get("notification.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };

    var acceptTask = function (parameters) {
        var deferred = $q.defer();
        apiService.get("acceptTask.php", parameters).then(function (response) {
            if (response)
                deferred.resolve(response);
            else
                deferred.reject("Something went wrong while processing your request. Please Contact Administrator.");
        },
            function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    };


    dashboardService.accessLogin = accessLogin;
    dashboardService.createtask = createtask;
    dashboardService.getEmps = getEmps;
    dashboardService.getTasks = getTasks;
    dashboardService.getTaskDetails = getTaskDetails;
    dashboardService.getStatus = getStatus;
    dashboardService.getTaskDashboard = getTaskDashboard;
    dashboardService.getgraph = getgraph;
    dashboardService.getNatureDashboard = getNatureDashboard;
    dashboardService.getactivities = getactivities;
    dashboardService.getdepts = getdepts;
    dashboardService.getNotification = getNotification;
    dashboardService.acceptTask = acceptTask;
    
    return dashboardService;

}]);
