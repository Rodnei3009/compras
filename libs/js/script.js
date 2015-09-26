// Code goes here
var app = angular.module('myapp1', ['angularSpinner']);
app.controller('MyController', ['$scope', 'usSpinnerService', '$rootScope',
  function($scope, usSpinnerService, $rootScope) {
    $scope.startcounter = 0;
    $scope.startSpin = function() {
      if (!$scope.spinneractive) {
        usSpinnerService.spin('spinner-1');
        $scope.startcounter++;
      }
    };

    $scope.stopSpin = function() {
      if ($scope.spinneractive) {
        usSpinnerService.stop('spinner-1');
      }
    };
    $scope.spinneractive = false;

    $rootScope.$on('us-spinner:spin', function(event, key) {
      $scope.spinneractive = true;
    });

    $rootScope.$on('us-spinner:stop', function(event, key) {
      $scope.spinneractive = false;
    });
  }
]);