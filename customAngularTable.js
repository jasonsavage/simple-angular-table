mainApp.directive('customAngularTable', function () {
    return {
        restrict : 'E', //this can only be used as a tag <my-custom-table />
        replace  : true, //replace the html tag with out template
        require  : 'ngModel', //this directive has to have the attr ng-modal=""
        scope    : {
            ngModel : '=', //variable name will be the same on our scope object
            columns : '='
        },
        templateUrl : 'customAngularTable.tpl.html',
        controller : 'customAngularTableCtrl'
    };
});