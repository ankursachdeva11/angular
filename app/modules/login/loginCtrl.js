/*==========================================================
    Author      : Ranjithprabhu K
    Date Created: 24 Dec 2015
    Description : Controller to handle Login module
    Change Log
    s.no      date    author     description     


 ===========================================================*/

login.controller("loginCtrl", ['$rootScope', '$scope', '$state', '$location', 'loginService', 'Flash','apiService',
function ($rootScope, $scope, $state, $location, loginService, Flash, apiService) {
        var vm = this;

        vm.getUser = {};
        vm.setUser = {};
        vm.signIn = true;

        //access login
        vm.login = function (data) {
            loginService.accessLogin(data).then(function (response) {            
            if(response.message != ""){
                if (response.message == "success") {
                    
                        $state.go('app.dashboard');
                    
                }
                else
                    Flash.create('danger', response.message, 'large-text');
            }
            });
        };

        //get registration details
        vm.register = function () {
            if (vm.setUser.confirmPassword == vm.setUser.Password){
                loginService.registerUser(vm.setUser).then(function (response) {
                    console.log('after post>>',response.message);
                    console.log(response.length);
                
                    
                    if (response.message == 'success'){
                        Flash.create('success', 'User Registed Successfully', 'large-text');
                       vm.signIn=true;
                    }
                    else{
                       Flash.create('danger', 'User Already Exists', 'large-text');
                    }
                
            });
            }
        };

    }]);

