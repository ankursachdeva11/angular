

dashboard.controller("HomeController", ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', '$modal','$cookieStore',

function ($rootScope, $scope, $state, $location, dashboardService, Flash, $modal,$cookieStore) {

    var vm = this;



    vm.showDetails = true;

    vm.home = {};

    data = {'task' : 'all'}; 

   

    $scope.tasks = [];

    

    $scope.graphshow = true;

    $scope.tableshow = false;

    $scope.nostatus = false;
    $scope.nonature = false;
    $scope.nolegal = false;
    $scope.noprice = false;




    $scope.printDiv = function(divName) {
      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open('', '_blank', 'width=300,height=300');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/home.css" /><link rel="stylesheet" type="text/css" href="css/bootstrap.css" /><link rel="stylesheet" type="text/css" href="css/dashboard.css" /></head><body onload="setTimeout(function () { window.print(); },500); window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }">' + printContents + '</body></html>');
      popupWin.document.close();
    } 

    $scope.pdfDiv = function(divName){
      html2canvas(document.getElementById(divName), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 'auto',
                        pageOrientation: 'landscape',
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Tasks.pdf");
            }
        });
    };
    $scope.backtograph = function() {

      $scope.graphshow = true;

      $scope.tableshow = false; 

    };

    $scope.resetfilter = function() {

      $scope.search = {};
      $scope.from_due_date = '';
      $scope.to_due_date = '';
       $scope.from_create_date = '';
        $scope.to_create_date = '';
      $scope.search_task_amount = {};

      $scope.amountchange = function(item){
        return true;
      };
      $scope.datechange = function(item){
            return true;
        };
        $scope.createchange = function(item){
            return true;
        };

    };

    $scope.reset_task_amount = function() {
        $scope.search_task_amount = {};

      $scope.amountchange = function(item){
        return true;
      };
    };


    $scope.resetsubdeptmain = function(){
      var assign_to = $scope.assign_to;
      $scope.getTaskPerId(assign_to); 
      $scope.getchildemps(assign_to);
      $scope.assignee_child = '';
    };





    $scope.changeAmount = function(range) {

      range = range.split('-');

      console.log(range.length);

      if(range.length === 1) {

        var min = parseInt(range[0]);

        var max = 0;

        

      } else {

        var min = parseInt(range[0]);

        var max = parseInt(range[1]);

      }
     
      $scope.amountchange = function(item){
        var flag = false;
          
              if(max!== 0 && item.task_amount >= min && item.task_amount < max) flag = true;
              else if(max === 0 && item.task_amount >= min) flag = true;
          
          return flag;
      };

    };


    $scope.changeDate = function(item) {
      var from  = $scope.from_due_date;
      var to  = $scope.to_due_date;
       //var d = new Date(from);
     /* var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var from_date = curr_year + "-" + curr_month + "-" + curr_date;
*/
      var d = new Date(to);
      var curr_date = d.getDate()+1;
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var to_date = curr_year + "-" + curr_month + "-" + curr_date;


      var dfrom = new Date(from);
        




      var dto = new Date(to_date);
      if(from !== undefined && to !== undefined && from !== '' && to !== ''){
       // console.log(dfrom);
        //      console.log(dto);
        $scope.datechange = function(item){
          var flag = false;
              
              var d2 = new Date(item.task_due_date);
          /*    console.log('from');
              console.log(dfrom);
              console.log('item');
              console.log(d2);
              console.log('to');
              console.log(dto);
              */
                if(+d2 < +dto && +d2 > +dfrom) flag = true;
               
            
            return flag;
        };

      } else {
        $scope.datechange = function(item){
            return true;
        };
      }
    };


    $scope.changecreateDate = function(item) {
      var from  = $scope.from_create_date;
      var to  = $scope.to_create_date;
       //var d = new Date(from);
     /* var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var from_date = curr_year + "-" + curr_month + "-" + curr_date;
*/
      var d = new Date(to);
      var curr_date = d.getDate()+1;
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var to_date = curr_year + "-" + curr_month + "-" + curr_date;


      var dfrom = new Date(from);
        




      var dto = new Date(to_date);
      if(from !== undefined && to !== undefined && from !== '' && to !== ''){
       // console.log(dfrom);
        //      console.log(dto);
        $scope.createchange = function(item){
          var flag = false;
              
              var d2 = new Date(item.create_date);
          /*    console.log('from');
              console.log(dfrom);
              console.log('item');
              console.log(d2);
              console.log('to');
              console.log(dto);
              */
                if(+d2 < +dto && +d2 > +dfrom) flag = true;
               
            
            return flag;
        };

      } else {
        $scope.createchange = function(item){
            return true;
        };
      }
    };

    







$scope.myChartObject = {};

$scope.myNatureObject = {};

$scope.myLegalObject = {};

$scope.myPriceObject = {};

    $scope.newtask = {};

    

    $scope.search = {};

    $scope.myChartObject.type = "PieChart";

    $scope.myNatureObject.type = "PieChart";

    $scope.myLegalObject.type = "PieChart";

    $scope.myPriceObject.type = "PieChart";

    

    $scope.myChartObject.options = {

        'title': 'Status',

        'colors': ['red', 'green', 'orange', 'yellow']

    };

     $scope.myNatureObject.options = {

        'title': 'Nature',

        'colors': ['red', 'orange', 'green']

    };

     $scope.myLegalObject.options = {

        'title': 'Legal Violation',

        'colors': ['green', 'red']

    };

     $scope.myPriceObject.options = {

        'title': 'Amount in lacs',

        'colors': ['Orange', 'green','red']

    };





    $scope.animationsEnabled = true;

    $scope.activities = function(task_id) {

      console.log(task_id);

      var modalInstance = $modal.open({

        animation: $scope.animationsEnabled,

        templateUrl: 'app/modules/dashboard/views/activities.html',

        controller: 'ModalActivitiesCtrl',

        resolve: {

         taskid: function () {

           return task_id;

         }

       }

      });



      modalInstance.result.then(function (selectedItem) {

        $scope.selected = selectedItem;

      }, function () {

       // $log.info('Modal dismissed at: ' + new Date());

      });



    };







$scope.animationsEnabled = true;

      $scope.addpopup = function() {

      

      var modalInstance = $modal.open({

        animation: $scope.animationsEnabled,

        templateUrl: 'app/modules/dashboard/views/addtaskpopup.html',

        controller: 'ModalNewAddCtrl'

        

       

      });



      modalInstance.result.then(function (selectedItem) {

        $scope.selected = selectedItem;

      }, function () {

       // $log.info('Modal dismissed at: ' + new Date());

      });



    };

    

     $scope.animationsEnabled = true;

    $scope.openviewpopup = function(task_id) {

      var modalInstance = $modal.open({

        animation: $scope.animationsEnabled,

        templateUrl: 'app/modules/dashboard/views/viewtaskpopup.html',

        controller: 'ModalViewCtrl',

        resolve: {

         taskid: function () {

           return task_id;

         }

       }

      });



      modalInstance.result.then(function (selectedItem) {

        $scope.selected = selectedItem;

      }, function () {

       // $log.info('Modal dismissed at: ' + new Date());

      });



    };

    

    

    $scope.Tnature = ["Critical","Legal","Routine"];

    $scope.legalvales = ["Y", "N"];

    

        data = {'status' : 'all'}; 

    $scope.status = [];

    dashboardService.getStatus(data).then(function (response) {  

      $scope.status = response;

        //$('.selectpicker').selectpicker();

    });



    // initialize filter object

    /*$scope.changeFilter = function(expr) {

      $scope.search = expr;

    };*/



    $scope.statusSelect=function(selection){

        if(selection) {

          if($scope.assign_to === 'undefined') assign_to = '';

          else assign_to = $scope.assign_to;

          if(selection['row'] === 0) selected = 'Pending';

          else if(selection['row'] === 1) selected = 'Completed';

          else if(selection['row'] === 2) selected = 'InProgress';

          else if(selection['row'] === 3) selected = 'Waiting';

      

            

            $scope.search = {"task_status" : selected};

            

            $scope.graphshow = false;

            $scope.tableshow = true; 

      

        } else {

            if($scope.assign_to === 'undefined') assign_to = '';

            else assign_to = $scope.assign_to;

            $scope.getTaskPerId(assign_to);

        }

    };



    $scope.natureSelect=function(selection){

        if(selection) {

          if($scope.assign_to === 'undefined') assign_to = '';

          else assign_to = $scope.assign_to;

          if(selection['row'] === 0) selected = 'Critical';

          else if(selection['row'] === 1) selected = 'Legal';

          else if(selection['row'] === 2) selected = 'Routine';

          

          $scope.search = {"task_nature" : selected};

          $scope.graphshow = false;

            $scope.tableshow = true; 



        } else {

            if($scope.assign_to === 'undefined') assign_to = '';

            else assign_to = $scope.assign_to;

            $scope.getTaskPerId(assign_to);

        }

    };

    

    $scope.legalSelect=function(selection){

        if(selection) {

          if($scope.assign_to === 'undefined') assign_to = '';

          else assign_to = $scope.assign_to;

          if(selection['row'] === 0) selected = 'Y';

          else if(selection['row'] === 1) selected = 'N';

         

          $scope.search = {"legal" : selected};

          $scope.graphshow = false;

            $scope.tableshow = true; 

        } else {

            if($scope.assign_to === 'undefined') assign_to = '';

            else assign_to = $scope.assign_to;

            $scope.getTaskPerId(assign_to);

        }

    };

    

         $scope.PriceSelect=function(selection){

        if(selection) {

          if($scope.assign_to === 'undefined') assign_to = '';

          else assign_to = $scope.assign_to;

         /* if(selection['row'] === 0) selected = 'p1count';

          else if(selection['row'] === 1) selected = 'p2count';

          else if(selection['row'] === 2) selected = 'p3count';
*/
if(selection['row'] === 0) {
            selected = 'p1count';
            $scope.search_task_amount = '5-25';
          }

          else if(selection['row'] === 1) {
            selected = 'p2count';
            $scope.search_task_amount = '25-200';
          }

          else if(selection['row'] === 2) {
            selected = 'p3count';
            $scope.search_task_amount = '200';
          }

         

          data = {'assign_to' : assign_to, 'task_amount' : selected}; 

            dashboardService.getTaskDashboard(data).then(function (response) {

              

            $scope.tasks = response.tasks;

            $scope.graphshow = false;

            $scope.tableshow = true; 

});

        } else {

            if($scope.assign_to === 'undefined') assign_to = '';

            else assign_to = $scope.assign_to;

            $scope.getTaskPerId(assign_to);

        }

    };



    $scope.getTaskPerId = function(assign_to) {

      $scope.nostatus = false;
    $scope.nonature = false;
    $scope.nolegal = false;
    $scope.noprice = false;

      if($scope.show_assignee_parent === false)

        data = {'assign_to' : assign_to}; 
      else
        data = {'assign_to' : assign_to,'sub' :'emp'}; 

      dashboardService.getTaskDashboard(data).then(function (response) {

      $scope.myChartObject.data = {"cols": [

              {id: "t", label: "Tasks", type: "string"},

              {id: "s", label: "count", type: "number"}

              

          ], "rows": [

              {c: [

                  {v: "Pending"},

                  {v: response.pending_count},

                  {color: "red"}

              ]},

              

              {c: [

                  {v: "Completed"},

                  {v: response.completed_count},

                  {color: "green"}

              ]},

              {c: [

                  {v: "InProgress"},

                  {v: response.inprogress_count},

                  {color: "orange"}

              ]},

              {c: [

                  {v: "Waiting"},

                  {v: response.waiting_count},

                  {color: "yellow"}

              ]}

          ]};

          if(response.pending_count === 0 && response.completed_count === 0 && response.waiting_count === 0 && response.inprogress_count === 0){
            $scope.nostatus = true;
          }



           $scope.myNatureObject.data = {"cols": [

              {id: "t", label: "Nature", type: "string"},

              {id: "s", label: "count", type: "number"}

          ], "rows": [

              {c: [

                  {v: "Critical"},

                  {v: response.critical_count},

                  {color: "red"}

                  

              ]},

              

              {c: [

                  {v: "Legal"},

                  {v: response.legal_count},

                  {color: "orange"}

              ]},

              {c: [

                  {v: "Routine"},

                  {v: response.routine_count},

                  {color: "green"}

              ]}

          ]};

          if(response.critical_count === 0 && response.legal_count === 0 && response.routine_count === 0){
            $scope.nonature = true;
          }
      

          $scope.myLegalObject.data = {"cols": [

              {id: "t", label: "Legal", type: "string"},

              {id: "s", label: "count", type: "number"}

          ], "rows": [

              {c: [

                  {v: "Yes"},

                  {v: response.legaly_count},

                  {color: "green"}

                  

              ]},

              

              {c: [

                  {v: "No"},

                  {v: response.legaln_count},

                  {color: "red"}

              ]}

              

          ]};

          if(response.legaly_count === 0 && response.legaln_count === 0 ){
            $scope.nolegal = true;
          }

      

          $scope.myPriceObject.data = {"cols": [

              {id: "t", label: "Price", type: "string"},

              {id: "s", label: "count", type: "number"}

          ], "rows": [

              {c: [

                  {v: "5-25 Lacs"},

                  {v: response.p1count},

                  {color: "orange"}

                  

              ]},

              

              {c: [

                  {v: "25-200 Lacs"},

                  {v: response.p2count},

                  {color: "green"}

              ]},

              

              {c: [

                  {v: "Above 200 Lacs"},

                  {v: response.p3count},

                  {color: "red"}

              ]}

              

          ]};
if(response.p3count === 0 && response.p2count === 0 && response.p1count === 0){
            $scope.noprice = true;
          }
      

      $scope.tasks = response.tasks;

      

    });

      

    };

    

    

    

    data = {'page' : 'home'}; 

dashboardService.getTaskDashboard(data).then(function (response) {  

$scope.tasks = response.tasks;

    



    $scope.myChartObject.data = {"cols": [

              {id: "t", label: "Tasks", type: "string"},

              {id: "s", label: "count", type: "number"}

          ], "rows": [

              {c: [

                  {v: "Pending"},

                  {v: response.pending_count},

                  {color: "red"}
              ]},

              

              {c: [

                  {v: "Completed"},

                  {v: response.completed_count},

                  {color: "green"}

              ]},

              {c: [

                  {v: "InProgress"},

                  {v: response.inprogress_count},

                  {color: "orange"}

              ]},

              {c: [

                  {v: "Waiting"},

                  {v: response.waiting_count},

                  {color: "yellow"}

              ]}

          ]};
          if(response.pending_count === 0 && response.completed_count === 0 && response.waiting_count === 0 && response.inprogress_count === 0){
            $scope.nostatus = true;
          }

       $scope.myNatureObject.data = {"cols": [

              {id: "t", label: "Nature", type: "string"},

              {id: "s", label: "count", type: "number"}

          ], "rows": [

              {c: [

                  {v: "Critical"},

                  {v: response.critical_count},

                  {color: "red"}

              ]},

              

              {c: [

                  {v: "Legal"},

                  {v: response.legal_count},

                  {color: "orange"}

              ]},

              {c: [

                  {v: "Routine"},

                  {v: response.routine_count},

                  {color: "green"}

              ]}

          ]};
          if(response.critical_count === 0 && response.legal_count === 0 && response.routine_count === 0){
            $scope.nonature = true;
          }

       $scope.myLegalObject.data = {"cols": [

              {id: "t", label: "Legal", type: "string"},

              {id: "s", label: "count", type: "number"}

          ], "rows": [

              {c: [

                  {v: "Yes"},

                  {v: response.legaly_count},

                   {color: "red"}

              ]},

              

              {c: [

                  {v: "No"},

                  {v: response.legaln_count},

                   {color: "green"}

              ]}

          ]};
           if(response.legaly_count === 0 && response.legaln_count === 0 ){
            $scope.nolegal = true;
          }


           $scope.myPriceObject.data = {"cols": [

              {id: "t", label: "Price", type: "string"},

              {id: "s", label: "count", type: "number"}

          ], "rows": [

              {c: [

                  {v: "5-25 Lacs"},

                  {v: response.p1count},

                   {color: "orange"}

              ]},

              

              {c: [

                  {v: "25-200 Lacs"},

                  {v: response.p2count},

                   {color: "green"}

              ]},

           

              {c: [

                  {v: "Above 200 Lacs"},

                  {v: response.p3count},

                   {color: "red"}

              ]}

          ]};
          if(response.p3count === 0 && response.p2count === 0 && response.p1count === 0){
            $scope.noprice = true;
          }


});









    $scope.pendingshowall = function() {

      $state.go('app.tasklist');

    };



    $scope.completedshowall = function() {

      $state.go('app.tasklist');

    };





    data = {'page' : 'home'}; 

    $scope.emps = [];

    $scope.show = true;
$scope.show_assignee_child = false;
    $scope.show_assignee_parent = false;
    dashboardService.getEmps(data).then(function (response) {  

      $scope.emps = response.data;

      var loggedin_data = $cookieStore.get('loggedin_Emp_No');

      $scope.assign_to = loggedin_data;

      if(response.show === true){

        $scope.show =  true;    

      } else $scope.show =  false;



      var lev = $cookieStore.get('loggedin_lev');

      if(lev === 'DIR') {

        $scope.deptshow = true;

        $scope.subdeptshow = true;

        $scope.show_assignee_parent = true;

         // $scope.show_assignee_child = true;

      }

      else if(lev === 'hod'){

        $scope.deptshow = false;

        $scope.subdeptshow = true;
        $scope.show_assignee_parent = true;

         // $scope.show_assignee_child = false;

      } else{

        $scope.deptshow = false;

        $scope.subdeptshow = false;
        $scope.show_assignee_parent = false;

       // $scope.show_assignee_child = false;

      }

      

    });
    $scope.emps2 = [];

    $scope.getchildemps = function(emp_no) {

    data = {'page' : 'home', 'emp' : 'sub','emp_no' : emp_no}; 

      dashboardService.getEmps(data).then(function (response) {  

        $scope.emps2 = response.data;

        

        var lev = $cookieStore.get('loggedin_lev');

        if(lev === 'DIR') {

          $scope.show_assignee_parent = true;

          $scope.show_assignee_child = true;

        }

        else if(lev === 'hod'){

          $scope.show_assignee_parent = true;

          $scope.show_assignee_child = false;

        } else{

          $scope.show_assignee_parent = false;

          $scope.show_assignee_child = false;

        }

          //$('.selectpicker').selectpicker();

      });

    } ;



    data = {'page' : 'home'}; 

    $scope.dept = [];

    $scope.subdept = [];

    

    dashboardService.getdepts(data).then(function (response) {  

      $scope.dept = response.dept;

      $scope.subdept = response.subdept;

      

      

    });



    //skills progress bar

    vm.home.skills = [

        {

            title: "Design & Development",

            theme: "aqua",

            percentage:80

        },

        {

            title: "Communication",

            theme: "red",

            percentage: 83

        },

        {

            title: "Planning & Progressing",

            theme: "green",

            percentage: 75

        },

        {

            title: "Problem Solving & Decision Making",

            theme: "yellow",

            percentage: 85

        },

        {

            title: "Loyal & Dedication",

            theme: "aqua",

            percentage: 100

        },

        {

            title: "Fun & Friendly",

            theme: "green",

            percentage: 95

        },

        {

            title: "Lazy & Sleepy",

            theme: "red",

            percentage: 40

        }

    ];



    vm.home.tools = [

       {

           Software: "Mongo DB",

           Percentage: "80",

           theme: "yellow",

           image: "mongodb"

       },

       {

           Software: "Express JS",

           Percentage: "75",

           theme: "aqua",

           image: "express",

           progressbar: "blue"

       },

       {

           Software: "Angular JS",

           Percentage: "85",

           theme: "green",

           image: "angular",

           progressbar: "blue"

       },

       {

           Software: "Node JS",

           Percentage: "83",

           theme: "lime",

           image: "node",

           progressbar: "blue"

       },

       {

           Software: "Javascript",

           Percentage: "80",

           theme: "maroon",

           image: "javascript",

           progressbar: "blue"

       },

       {

           Software: "Type Script",

           Percentage: "70",

           theme: "Gray",

           image: "typescript",

           progressbar: "blue"

       },

       {

           Software: "jQuery & AJAX",

           Percentage: "80",

           theme: "yellow",

           image: "jquery",

           progressbar: "blue"

       },

       {

           Software: "Joomla",

           Percentage: "85",

           theme: "red",

           image: "joomla",

           progressbar: "blue"

       },

        {

            Software: "HTML 5",

            Percentage: "90",

            theme: "yellow",

            image: "html5"

        },

        {

            Software: "CSS 3",

            Percentage: "83",

            theme: "aqua",

            image: "css3",

            progressbar: "blue"

        },

        {

            Software: "SAAS",

            Percentage: "72",

            theme: "green",

            image: "saas-css",

            progressbar: "blue"

        },

        {

            Software: "Bootstrap",

            Percentage: "85",

            theme: "lime",

            image: "bootstrap",

            progressbar: "blue"

        },

        {

            Software: "Photo Shop",

            Percentage: "90",

            theme: "maroon",

            image: "photoshop",

            progressbar: "blue"

        },

        {

            Software: "Corel Draw",

            Percentage: "95",

            theme: "Gray",

            image: "coreldraw",

            progressbar: "blue"

        },

        {

            Software: "Flash",

            Percentage: "65",

            theme: "yellow",

            image: "flash",

            progressbar: "blue"

        }

    ];



    //Tools I use Carousel

    $("#owl-demo").owlCarousel({





        items: 8, //10 items above 1000px browser width

        itemsDesktop: [1000, 5], //5 items between 1000px and 901px

        itemsDesktopSmall: [900, 3], // betweem 900px and 601px

        itemsTablet: [600, 2], //2 items between 600 and 0

        itemsMobile: false // itemsMobile disabled - inherit from itemsTablet option

    });

    $("#owl-demo").trigger('owl.play', 2000);



    // Custom Navigation Events

    $(".next").click(function () {

        $("#owl-demo").trigger('owl.next');

    });

    $(".prev").click(function () {

        $("#owl-demo").trigger('owl.prev');

    });

    $(".play").click(function () {

        $("#owl-demo").trigger('owl.play', 1000); //owl.play event accept autoPlay speed as second parameter

    });

    $(".stop").click(function () {

        $("#owl-demo").trigger('owl.stop');

    });



    //cartoon photo slider carosusel

    $("#owl-single").owlCarousel({

        navigation: true, // Show next and prev buttons

        slideSpeed: 300,

        paginationSpeed: 400,

        singleItem: true,

        autoPlay: 5000//Set AutoPlay to 3 seconds

    });

}]);



dashboard.controller("ModalNotifyCtrl",  ['$rootScope', '$scope', '$state', '$location', '$cookieStore', 'dashboardService', 'Flash', '$timeout', '$modal','$modalInstance', 'taskdata',

function ($rootScope, $scope, $state, $location, $cookieStore, dashboardService, Flash, $timeout , $modal,$modalInstance,taskdata) {

var lev = $cookieStore.get('loggedin_lev');
$scope.notdir = false;
$scope.notshead = false;
if(lev !== 'DIR'){
  $scope.notdir = true;
}
if(lev !== 'shead'){
  $scope.notshead = true;
}
$scope.closeModal = function()

    {

        $modalInstance.close('this is result for close');

    };


    $scope.assigned = [];
    $scope.created = [];
    data = {'page' : 'tasks'}; 

   

      $scope.assigned = taskdata.assigned;
      $scope.created = taskdata.created;

     

   
    
    $scope.accept_task = function(task_id) {
      data = {'page' : 'tasks','task_id' :task_id}; 

      dashboardService.acceptTask(data).then(function (response) {  

        if(response.msg === 'success'){
          $("#accepted_"+task_id).show();
          $("#accept_"+task_id).hide();
          
        }

       

      });
    };


}]);




dashboard.controller("ModalViewCtrl",  ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', 'taskid', '$timeout', '$modal','$modalInstance',

function ($rootScope, $scope, $state, $location, dashboardService, Flash, taskid, $timeout , $modal,$modalInstance) {

$scope.cancelMeView = function()

    {

        $modalInstance.close('this is result for close');

    };


$scope.task_id = taskid;

$scope.taskalldetails = [];

$scope.taskheaddetails = [];

data = {'task_id' : taskid, 'include' : 'archive', 'popup' : 'view'}; 

  

    dashboardService.getTaskDetails(data).then(function (response) { 

      $scope.taskalldetails = response.resp;

      $scope.taskheaddetails = response.subdata;







    });





$scope.animationsEnabled = true;

    $scope.edithomepopup = function(task_id) {

      var modalInstance = $modal.open({

        animation: $scope.animationsEnabled,

        templateUrl: 'app/modules/dashboard/views/edittaskpopup.html',

        controller: 'ModalInstanceCtrl',

        resolve: {

         taskid: function () {

           return task_id;

         }

       }

      });



      modalInstance.result.then(function (selectedItem) {

        $scope.selected = selectedItem;

      }, function () {

       // $log.info('Modal dismissed at: ' + new Date());

      });



    };



}]);



dashboard.controller("ModalActivitiesCtrl",  ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', 'taskid', '$timeout',

function ($rootScope, $scope, $state, $location, dashboardService, Flash, taskid, $timeout ) {

  var vm = this;

  console.log(taskid);

  data = {'task_id' : taskid}; 

  $scope.activities = {};

  dashboardService.getactivities(data).then(function (response) { 

    $scope.activities = response;

  }); 



}]);



dashboard.controller("ModalNewAddCtrl",  ['$cookieStore','$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', '$timeout', '$modalInstance',

function ($cookieStore,$rootScope, $scope, $state, $location, dashboardService, Flash, $timeout,$modalInstance ) {

  var vm = this;
//$scope.newtask = [];

   $scope.cancelMe = function()

    {

        $modalInstance.close('this is result for close');

    };


    data = {'page' : 'tasks'}; 

    $scope.emps = [];

    $scope.emps2 = [];

    $scope.show_assignee_child = false;

    $scope.show =  true;    

    dashboardService.getEmps(data).then(function (response) {  

      $scope.emps = response.data;

      if(response.show === true){

        $scope.show =  true;    

      } else $scope.show =  false;

        //$('.selectpicker').selectpicker();

    });





    data = {'status' : 'all'}; 

    $scope.status = [];

    dashboardService.getStatus(data).then(function (response) {  

      $scope.status = response;

        //$('.selectpicker').selectpicker();

    });
/*    var d = new Date();
      var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var to_date = curr_month + "/" + curr_date + "/" +  curr_year;
      $scope.newtask.task_duedate = to_date;

  */

  $scope.loader = false;

  $scope.submittask = function() {

      $scope.loader = true;

   // if($scope.newtask.task_amount > 99999) {

    dashboardService.createtask($scope.newtask).then(function (response) {

      if(response.message === 'success'){

        Flash.create('success', 'Task Created Successfully', 'large-text');

        $scope.newtask= [];

        $timeout(function(){ location.reload() }, 500);

      } else Flash.create('danger', 'Problem in Task creation', 'large-text');

        $scope.loader = false;

      

    });

 // } else {

  //  alert("Please enter amount in lacs.");

 // }







    

    

    

    /*$http.post("task.php",{'subject':$scope.task_subject,'description':$scope.task_description,'status':$scope.task_status,'assignTo':$scope.assign_to})

    .success(function(data,status,headers,config){

      console.log("Inserted Successfully!");

 

      

    });*/

    

 

    

  };


  

  $scope.getchildemps = function(emp_no) {

    data = {'page' : 'tasks','emp_no' : emp_no}; 

      dashboardService.getEmps(data).then(function (response) {  

        $scope.emps2 = response.data;
        var lev = $cookieStore.get('loggedin_lev');
        console.log(lev);
        if(lev !== 'hod')
        $scope.show_assignee_child = true;

          //$('.selectpicker').selectpicker();

      });

    }; 

  



}]);









dashboard.controller("ModalInstanceCtrl",  ['$cookieStore','$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', 'taskid', '$timeout','$modalInstance',

function ($cookieStore,$rootScope, $scope, $state, $location, dashboardService, Flash, taskid, $timeout,$modalInstance ) {

  var vm = this;
  
   $scope.cancelMeEdit = function()

    {

        $modalInstance.close('this is result for close');

    };

  console.log(taskid);

    $scope.taskdetails = [];

    data = {'task_id' : taskid}; 

    $scope.status = [];

    $scope.show_assignee_child = false;

    $scope.response = [];

    dashboardService.getTaskDetails(data).then(function (response) {  

      

      $scope.getchildemps(response.assign_to);

      

      $scope.response = response;

      

      //$('#datepicker').datepicker("setValue", '01/10/2014' );

        //$('.selectpicker').selectpicker();

        data1 = {'status' : 'all', 'show_complete' : response.show_complete}; 

        $scope.status = [];

        dashboardService.getStatus(data1).then(function (response) {  

          $scope.status = response;

            //$('.selectpicker').selectpicker();

        });


        var lev = $cookieStore.get('loggedin_lev');
        
        if(lev === 'shead')
          data = {'page' : 'edit', 'emp_no' : response.assignee_parent}; 
        else
          data = {'page' : 'tasks'}; 

        $scope.emps = [];

        $scope.show =  true;    

        dashboardService.getEmps(data).then(function (response) {  

          $scope.emps = response.data;

          if(response.show === true){

            $scope.show =  true;    

          } else $scope.show =  false;

            //$('.selectpicker').selectpicker();

        });

    });

$scope.closeModal = function() {console.log('click');

      $('.modal.fade.ng-isolate-scope.in').trigger('click');

    };

$scope.cancel = function() {

    $modalInstance.dismiss('cancel');

  };
$scope.loader = false;
    $scope.submittask = function() {
$scope.loader = true;
$scope.taskdetails.legal = jQuery("#legal").is(":checked");

   //   if($scope.taskdetails.task_amount > 99999) {

      dashboardService.createtask($scope.taskdetails).then(function (response) {
$scope.loader = false;
        if(response.message === 'success'){

          Flash.create('success', 'Task Updated Successfully', 'large-text');

          location.reload();

        } else Flash.create('danger', 'Problem in Task updation', 'large-text');



        

      });

 // } else {

//alert("Please enter amount in lacs.");

 // }

    };





    



    $scope.getchildemps = function(emp_no) {

    data = {'page' : 'tasks','emp_no' : emp_no}; 

      dashboardService.getEmps(data).then(function (response) {  

        $scope.emps2 = response.data;

        var lev = $cookieStore.get('loggedin_lev');
        console.log(lev);
        if(lev !== 'hod')
        $scope.show_assignee_child = true;

        

        $timeout(function(){ $scope.taskdetails = $scope.response; }, 500);

          //$('.selectpicker').selectpicker();

      });

    } ;





    

  

}]);





dashboard.controller("GraphController",  ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', '$modal',

function ($rootScope, $scope, $state, $location, dashboardService, Flash, $modal ) {

  

  $scope.graphdata = [];

  $scope.graphdatam = [];

  $scope.graphdatay = [];

  data = {'task' : 'all'}; 

  dashboardService.getgraph(data).then(function (response) {  

      $scope.graphdata = response.data;

      $scope.graphdatam = response.datam;

        $scope.graphdatay = response.datay;

    });







}]);



dashboard.controller("TasklistController",  ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash', '$modal',

function ($rootScope, $scope, $state, $location, dashboardService, Flash, $modal ) {



data = {'task' : 'all'}; 

$scope.tasks = [];

    dashboardService.getTasks(data).then(function (response) {  

      $scope.tasks = response;

        //$('.selectpicker').selectpicker();

    });



/*data = {'emp' : 'all'}; 

    $scope.emps = [];

    dashboardService.getEmps(data).then(function (response) {  

      $scope.emps = response;

        

    });*/

  $scope.animationsEnabled = true;

    $scope.editpopup = function(task_id) {

      var modalInstance = $modal.open({

        animation: $scope.animationsEnabled,

        templateUrl: 'app/modules/dashboard/views/edittaskpopup.html',

        controller: 'ModalInstanceCtrl',

        resolve: {

         taskid: function () {

           return task_id;

         }

       }

      });



      modalInstance.result.then(function (selectedItem) {

        $scope.selected = selectedItem;

      }, function () {

       // $log.info('Modal dismissed at: ' + new Date());

      });



    };

        

      

    // define list of items

    $scope.Tnature = ["Critical","Legal","Routine"];



    data = {'status' : 'all'}; 

    $scope.status = [];

    dashboardService.getStatus(data).then(function (response) {  

      $scope.status = response;

        //$('.selectpicker').selectpicker();

    });



    // initialize filter object

    $scope.search = {};





}]);



dashboard.controller("TasksController",  ['$rootScope', '$scope', '$state', '$location', 'dashboardService', 'Flash',

function ($rootScope, $scope, $state, $location, dashboardService, Flash) {

    var vm = this;

    data = {'page' : 'tasks'}; 

    $scope.emps = [];

    $scope.emps2 = [];

    $scope.show_assignee_child = false;

    $scope.show =  true;    

    dashboardService.getEmps(data).then(function (response) {  

      $scope.emps = response.data;

      if(response.show === true){

        $scope.show =  true;    

      } else $scope.show =  false;

        //$('.selectpicker').selectpicker();

    });





    data = {'status' : 'all'}; 

    $scope.status = [];

    dashboardService.getStatus(data).then(function (response) {  

      $scope.status = response;

        //$('.selectpicker').selectpicker();

    });

  

  

  $scope.submittask = function() {

    

    if(vm.task.task_amount > 99999) {

    dashboardService.createtask(vm.task).then(function (response) {

      if(response.message === 'success'){

        Flash.create('success', 'Task Created Successfully', 'large-text');

        vm.task = [];

      } else Flash.create('danger', 'Problem in Task creation', 'large-text');



      

    });

  } else {

    alert("Please enter amount in lacs.");

  }







    

    

    

    /*$http.post("task.php",{'subject':$scope.task_subject,'description':$scope.task_description,'status':$scope.task_status,'assignTo':$scope.assign_to})

    .success(function(data,status,headers,config){

      console.log("Inserted Successfully!");

 

      

    });*/

    

 

    

  };

  $scope.getchildemps = function(emp_no) {

    data = {'page' : 'tasks','emp_no' : emp_no}; 

      dashboardService.getEmps(data).then(function (response) {  

        $scope.emps2 = response.data;

        $scope.show_assignee_child = true;

          //$('.selectpicker').selectpicker();

      });

    } 

    //$scope.emps = [{'id' : '1', 'name' : 'asd'},{'id' : '2', 'name' : 'asd'}];



    }]);

