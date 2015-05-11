require('angular-resource');
var mongochemServices = angular.module('mongochemServices', ['ngResource']);

mongochemServices.factory('Molecule', ['$resource',
  function($resource){
    return $resource('api/v1/molecules/inchi/:moleculeId', {}, {
      query: {method:'GET', params:{moleculeId:'molecules'}, isArray:true}
  });
}]);