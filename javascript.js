angular.module('portalApp')

.controller('reflectCtrl', ['$scope', 'reflectFactory', function ($scope, reflectFactory) {
    console.log('ctrl!');
    
    // Import variables and functions from service
    $scope.insertValue = reflectFactory.insertValue;
    $scope.loading = reflectFactory.loading;
    $scope.dbData = reflectFactory.dbData;
    
    // initialize the service
    reflectFactory.init($scope);
    
    // watch for changes in the loading variable
    $scope.$watch('loading.value', function () {
        // if loading
        if ($scope.loading.value) {
            // show loading screen in the first column, and don't append it to browser history
            $scope.portalHelpers.showView('loading.html', 1, false);
            // show loading animation in place of menu button
            $scope.portalHelpers.toggleLoading(true);
        } else {
            console.log('showing main');
            $scope.portalHelpers.showView('reflectMain.html', 1);
            $scope.portalHelpers.toggleLoading(false);
        }
    });

    // Create table, invoked by a button press from database test example
    $scope.createTable = function () {
        $scope.portalHelpers.invokeServerFunction('createTable').then(function (result) {
            $scope.dbData.value = [];
        });
    };

    // Handle form submit in the database test example
    $scope.insertData = function () {
        console.log ("insert data");
        if ($scope.insertValue.value.length > 50)
            alert('value should be less than 50 characters');
        else {
            $scope.portalHelpers.invokeServerFunction('insert', {
                value: $scope.insertValue.value
            }).then(function (result) {
                $scope.dbData.value = result;
                console.log ("End insert data");
            });
            $scope.insertValue.value = "";
        }
    };
    
    $scope.addLike = function (id) {
        console.log ("Add likes");
        console.log ("passed in id: " + id);
     	$scope.portalHelpers.invokeServerFunction('addLike', {
            userId : id
        }).then (function (result) {
			$scope.dbData.value = result;
        });
    };

}])
    // Factory maintains the state of the widget
    .factory('reflectFactory', [ function () {
        var initialized = {
            value: false
        };

        // Your variable declarations
        var loading = {
            value: true
        };
        var insertValue = {
            value: null
        };

        var dbData = {
            value: null
        };

        var sourcesLoaded = 0;

        var init = function ($scope) {
            if (initialized.value)
                return;
            initialized.value = true;

            console.log('getting data.. ', $scope.portalHelpers,  $scope.portalHelpers.invokeServerFunction);
            // Place your init code here:
            $scope.portalHelpers.invokeServerFunction('getData').then(function (result) {
                console.log('got data: ', result);
                dbData.value = result;
                sourceLoaded();
            });
        }

        function sourceLoaded() {
            sourcesLoaded++;
            if (sourcesLoaded > 0)
                loading.value = false;
        }

        return {
            init: init,
            loading: loading,
            insertValue: insertValue,
            dbData: dbData
        };

    }]);
