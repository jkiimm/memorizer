'use strict';

angular.module('memorizerApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    $scope.openedIndex = null;

    // Fisher–Yates shuffle algorithm
    var shuffleArray = function(array) {
      var tmp, i;

      for(var m = array.length - 1; m > 0; m--) {
        i = Math.floor(Math.random() * m);

        tmp = array[m];
        array[m] = array[i];
        array[i] = tmp;
      }

      return array;
    }

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = shuffleArray(awesomeThings);
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.showAnswer = function(i) {
      if($scope.openedIndex === i) {
        $scope.openedIndex = null;
        return;
      }
      $scope.openedIndex = i;
    };

    $scope.addThing = function() {
      if($scope.question === '' || $scope.answer === '') { return; }
      $http.post('/api/things', {
        name: $scope.question,
        info: $scope.answer,
      });
      $scope.question = $scope.answer = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
