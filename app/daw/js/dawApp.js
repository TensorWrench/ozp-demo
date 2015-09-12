'use strict';


// Declare app level module which depends on filters, and services
var dawModule=angular.module('ozpDemo.DataAugmentationWebtop', [
  'ngRoute',
  'ui.bootstrap',
  'ozpIwc',
  'gridster'
]).run(['gridsterConfig',function(gridster) {
        gridster.width='auto';
        gridster.height='auto';
        gridster.columns=6;
}]);


dawModule.directive('widget', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/widget.html',
      scope: true
//      controller: ['$scope','iwcClient',function(scope,client) {
//      }]
    };
 });

dawModule.directive('contextResource', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/contextResource.html',
      scope: true,
      controller: ['$scope','iwcClient',function(scope,client) {
       client.api("intents.api").list("/"+scope.workContext.contentType+"/view/").then(function(reply){
          console.log("Reply to "+scope.workContext.contentType+"/view/ is ",reply.entity);
          scope.$apply(function(){
            scope.handlers=reply.entity;
          });
        });
      }]
    };
 });
 
dawModule.controller('TileController', [
   '$scope',"iwcClient",function(scope,client) {
      client.api("data.api").watch("/workContext",function(packet) {
        var wc=packet.entity.newValue;
        console.log("workContext changed",wc);
        scope.$apply(function(){scope.workContext=wc;});
      }).then(function(packet) {
        scope.$apply(function(){scope.workContext=packet.entity;});
      });
 }]);