/*==========================================================
    Author      : Ranjithprabhu K
    Date Created: 24 Dec 2015
    Description : Controller to handle main application
    
    Change Log
    s.no      date    author     description     
 ===========================================================*/

app.controller("appCtrl", ['$modal','$rootScope', '$scope', '$state', '$location', 'Flash','appSettings','$http','$cookieStore', 'toaster', '$timeout',
function ($modal,$rootScope, $scope, $state, $location, Flash,appSettings,$http,$cookieStore,toaster,$timeout) {

    $rootScope.theme = appSettings.theme;
    $rootScope.layout = appSettings.layout;

    var vm = this;


    //avalilable themes
    vm.themes = [
        {
            theme: "black",
            color: "skin-black",
            title: "Dark - Black Skin",
            icon:""
        },
        {
            theme: "black",
            color: "skin-black-light",
            title: "Light - Black Skin",
            icon:"-o"
        },
        {
            theme: "blue",
            color: "skin-blue",
            title: "Dark - Blue Skin",
            icon:""
        },
        {
            theme: "blue",
            color: "skin-blue-light",
            title: "Light - Blue Skin",
            icon:"-o"
        },
        {
            theme: "green",
            color: "skin-green",
            title: "Dark - Green Skin",
            icon:""
        },
        {
            theme: "green",
            color: "skin-green-light",
            title: "Light - Green Skin",
            icon:"-o"
        },
        {
            theme: "yellow",
            color: "skin-yellow",
            title: "Dark - Yellow Skin",
            icon:""
        },
        {
            theme: "yellow",
            color: "skin-yellow-light",
            title: "Light - Yellow Skin",
            icon:"-o"
        },
        {
            theme: "red",
            color: "skin-red",
            title: "Dark - Red Skin",
            icon: ""
        },
        {
            theme: "red",
            color: "skin-red-light",
            title: "Light - Red Skin",
            icon: "-o"
        },
        {
            theme: "purple",
            color: "skin-purple",
            title: "Dark - Purple Skin",
            icon: ""
        },
        {
            theme: "purple",
            color: "skin-purple-light",
            title: "Light - Purple Skin",
            icon: "-o"
        },
    ];

    //available layouts
    vm.layouts = [
        {
            name: "Boxed",
            layout: "layout-boxed"
        },
        {
            name: "Fixed",
            layout: "fixed"
        },
        {
            name: "Sidebar Collapse",
            layout: "sidebar-collapse"
        },
    ];

    vm.links = [
        {
            title: "Dashboard",
            icon: "dashboard",
            state: "dashboard"
        },
        {
            title: "Graphs",
            icon: "gears",
            state: "graph"
        },
    ];


    //Main menu items of the dashboard
    vm.menuItems = [
        {
            title: "Dashboard",
            icon: "dashboard",
            state: "dashboard"
        },
        /*{
            title: "Tasks",
            icon: "gears",
            state: "tasks"
        },
        {
            title: "Task List",
            icon: "suitcase",
            state: "tasklist"
        },
        
        ,
 * 
        {
            title: "Education",
            icon: "graduation-cap",
            state: "education"
        },
        {
            title: "Experience",
            icon: "suitcase",
            state: "experience"
        },
        {
            title: "Recent Projects",
            icon: "file-code-o",
            state: "recent"
        },
        {
            title: "Websites",
            icon: "globe",
            state: "websites"
        },
        {
            title: "Portfolio",
            icon: "anchor",
            state: "portfolio"
        },
        {
            title: "About Me",
            icon: "user-secret",
            state: "about"
        },
        {
            title: "Contact",
            icon: "phone",
            state: "contact"
        }*/
    ];

    //set the theme selected
    vm.setTheme = function (value) {
        $rootScope.theme = value;
    };


    //set the Layout in normal view
    vm.setLayout = function (value) {
        $rootScope.layout = value;
    };


    //controll sidebar open & close in mobile and normal view
    vm.sideBar = function (value) {
        if($(window).width()<=767){
        if ($("body").hasClass('sidebar-open'))
            $("body").removeClass('sidebar-open');
        else
            $("body").addClass('sidebar-open');
        }
        else {
            if(value==1){
            if ($("body").hasClass('sidebar-collapse'))
                $("body").removeClass('sidebar-collapse');
            else
                $("body").addClass('sidebar-collapse');
            }
        }
    };

    $scope.logout = function() {
        $cookieStore.remove('loggedin_Emp_No');
        $cookieStore.remove('loggedin_lev');
        $cookieStore.put('notify_open', 0);
        $state.go('login');
    }

    //navigate to search page
    vm.search = function () {
        $state.go('app.search');
    };

    $scope.responsefornotification = [];

     var apiBase = appSettings.apiBase;
    $scope.loggedEmp = [];

    $http.get(apiBase + 'getLoggedindata.php', { params: {'emp':'loggedin'} }, { headers: { 'Content-Type': 'application/json','Cache-Control' : 'no-cache' } }).success(function (response) {
        console.log(response);
        $scope.loggedEmp = response;
        $cookieStore.put('loggedin_Emp_No', response.Emp_No);
        $cookieStore.put('loggedin_lev', response.lev);
        

        var notify_open = $cookieStore.get('notify_open');
        
        $http.get(apiBase + 'notification.php', { params: {'page' : 'tasks'} }, { headers: { 'Content-Type': 'application/json','Cache-Control' : 'no-cache' } }).success(function (response) {

      

     

        

            if(notify_open != 1 && (response.created_count != 0 || response.assigned_count != 0)) {
                $scope.responsefornotification = response;
             
                var lev = $cookieStore.get('loggedin_lev');
var created_txt = '';
                var assigned_txt = '';
                if(lev != 'DIR' && lev !='shead'){
if(response.created_count !=0) created_txt = 'Task assigned by you : '+response.created_count+'<br>';
                	if(response.assigned_count !=0) assigned_txt = 'Task assigned to you : '+response.assigned_count;
             
            $timeout(function(){ toaster.pop('note', "Notification",  created_txt+assigned_txt, 15000, 'trustedHtml','shownotification'); }, 500);
             }
             else if(lev == 'DIR') {
                $timeout(function(){ toaster.pop('note', "Notification", 'Task assigned by you : '+response.created_count, 15000, 'trustedHtml','shownotification'); }, 500);
             }
             else if(lev =='shead') {
                $timeout(function(){ toaster.pop('note', "Notification", 'Task assigned to you : '+response.assigned_count, 15000, 'trustedHtml','shownotification'); }, 500);
             }

            

                
        
        
                
              }
              $cookieStore.put('notify_open', 1);

        });

    }).catch(function (data, status, headers, config) { // <--- catch instead error
        console.log(data.statusText);
    });

    console.log('getting in to the app controller');

    $scope.shownotification = function(){
        var modalInstance = $modal.open({

                  animation: $scope.animationsEnabled,

                  templateUrl: 'app/modules/dashboard/views/notification.html',

                  controller: 'ModalNotifyCtrl',

                  resolve: {

                     taskdata: function () {

                       return $scope.responsefornotification;

                     }

                   }

                });
    }
    
        
    

}]);
