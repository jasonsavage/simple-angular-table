'use strict';

/* Controllers */

var mainApp = angular.module('mainApp', []);

mainApp.controller('AngularTableTestCtrl', function($scope) {
    $scope.rows = [
        { first : 'Sue', last : 'Davis', title : 'Web Developer', company : 'Infusion' },
        { first : 'David', last : 'Marks', title : 'Sales Rep', company : 'Infusion' },
        { first : 'Jake', last : 'Richards', title : 'Customer Service', company : 'Infusion' }
    ];
    $scope.columns = [
        { label : 'First Name', property : 'first' },
        { label : 'Last Name', property : 'last' },
        { label : 'Occupation', property : 'title' },
        { label : 'Company', property : 'company' }
    ];
});


