mainApp.controller('customAngularTableCtrl', function ($scope) {
    'use strict';

    /**
     * View Variables
     */
    $scope.tableRows = [];
    //- sorting
    $scope.currentSortColumn = null;
    $scope.currentSortOrder = '';
    //- filtering
    $scope.filters = {};
    // - paging
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.rowsTotal = 1;

    /**
     * View Methods
     */
    $scope.applySort = function (columnToSortOn) {
        
        if($scope.currentSortColumn === columnToSortOn) {
            //user has clicked the same column, so we need to change sort order
            //we have 3 sorting states here to step through (asc,desc,'')
            $scope.currentSortOrder = ($scope.currentSortOrder === '') ? 
                'asc' : ($scope.currentSortOrder === 'asc' ? 'desc' : '');
            
            //if the previous operation set currentSortOder to blank, remove currentSortColumn
            if($scope.currentSortOrder === '') {
                $scope.currentSortColumn = null;
            }
        } else {
            //user has clicked a new column
            $scope.currentSortColumn = columnToSortOn;
            //step to first sort state
            $scope.currentSortOrder = 'asc';
        }
        
        //update view
        updateTableData();
        
    };
    
    $scope.applyFilters = function () {
        //reset current page to 1, se we don't filter out all the rows 
        //and display an invalid page
        $scope.currentPage = 1;
        
        //since, updateTableData will apply all the filters for us, 
        //we just need to re-call that method here.
        updateTableData();
    };

    /**
     * Watches 
     */
    //we'll need to setup a watch for ngModel so if it changes we update the view
    $scope.$watch('ngModel', function (newValue, oldValue) {
        //check if the value is defined and not null
        if(angular.isDefined(newValue) && newValue !== null) {
            //since we have a new array, update view
            updateTableData();
        }
    });
    
    //We need to watch currentPage so we can update the view with the current page
    $scope.$watch("currentPage", function (newValue, oldValue) {
        //check if the page really did change
        if(newValue !== oldValue) {
            updateTableData();
        }
    });

    /**
     * Private Methods
     */   

    function updateTableData () {
        //we will create a new array that we will fill with 
        //all the rows that should still bee in the view.
        var viewArray;

        //step 1: apply filtering on all the rows
        viewArray = $scope.ngModel.filter(applyFilters);
        
        //step 2: if the user has clicked a column, apply sorting
        if($scope.currentSortColumn !== null) {
            // using a getSorter function here allows you to use custom sorting if you want
            viewArray = viewArray.sort(getSorter());
        }
        
        //step 3: update pagination and apply
        $scope.rowsTotal = viewArray.length;
        // - current page is 1, based but our array is 0 based so subtract 1
        var pageStartIndex = ($scope.currentPage-1) * $scope.pageSize;
        // - page end index is either page size or whatever is left in the array
        var pageEndIndex = pageStartIndex + Math.min(viewArray.length, $scope.pageSize);
        // - splice view array to page start and end index's, and return the page we want to view
        viewArray = viewArray.splice(pageStartIndex, pageEndIndex);
        
        //pass the ref to the viewArray to $scope and let angular refresh the html table
        $scope.tableRows = viewArray;
    }
    
    function applyFilters (row) {
        var allowed = true;
        
        //since we set ng-model on each input in the 2nd header row to filters[col.property] in the view,
        //angular will auto-create a matching property key on the filters object and set it to
        //whatever the user types into that input.
        
        //So, here we can loop through each property on the $scope.filters property and check
        //if the row should still be displayed.
        Object.keys($scope.filters).forEach(function (key) {
            var rowValue = row[key],
                filterValue = (angular.isDefined($scope.filters[key]) ? $scope.filters[key] : '');
            
            //if this value is still allowed by other columns, test it with this filter value
            if(allowed && filterValue !== null) {
                //here is a good place to add custom filters based on this column. 
                //Ex. var column = lookupColumnFormKey(key);
                //    if(column.type === 'number')  
                //        allowed = numberFilter(rowValue, filterValue); 
    
                allowed = stringSearchFilter(rowValue, filterValue);
            }
        });
        return allowed;
    }
    
    function getSorter () {
        //Here you can return different sort functions based on $scope.currentSortColumn
        //Ex. if($scope.currentSortColumn.type === 'number) 
        //         return numberSorter($scope.currentSortColumn, $scope.currentSortOrder);

        return stringSorter($scope.currentSortColumn, $scope.currentSortOrder);
    }
    
    /**
     * Checks if value contains the chars that are in filterValue.
     */
    function stringSearchFilter (value, filterValue) {
        value = value.toString().toLowerCase(); //toString in case it's a number
        filterValue.toString().trim().toLowerCase();
        return (value.indexOf(filterValue) !== -1);
    }
    
    /**
     * Compares 2 rows as strings based on sortColumn.property.
     */
    function stringSorter (sortColumn, sortOrder) {
        return function (rowA, rowB) {
            var valueA = rowA[sortColumn.property],
                valueB = rowB[sortColumn.property],
                result = valueA.localeCompare(valueB);
            if(sortOrder === 'desc') {
                result *= -1;
            }
            return result;
        };
    }
});
