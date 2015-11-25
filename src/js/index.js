(function(angular, $, undefined) {

  var app = angular.module('somai', [
    'ui.router'
  ]);

  app.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

      $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
      });
      $locationProvider.hashPrefix('!');

      $stateProvider
      .state('home', {
        url: '/'
      });

      /*
      * Trailing slash rule
      */
      $urlRouterProvider.rule(function($injector, $location) {
      	var path = $location.path(),
      	search = $location.search(),
      	params;

      	// check to see if the path already ends in '/'
      	if (path[path.length - 1] === '/') {
      		return;
      	}

      	// If there was no search string / query params, return with a `/`
      	if (Object.keys(search).length === 0) {
      		return path + '/';
      	}

      	// Otherwise build the search string and return a `/?` prefix
      	params = [];
      	angular.forEach(search, function(v, k){
      		params.push(k + '=' + v);
      	});

      	return path + '/?' + params.join('&');
      });

    }
  ]);

  app.directive('scrollClass', [
    function() {
      return {
        restrict: 'A',
        scope: {
          'scrollClass': '@',
          'offset': '@'
        },
        link: function(scope, element, attrs) {

          if(scope.offset) {

            $(window).bind('scroll', function() {
              if($(window).scrollTop() >= parseInt(scope.offset)) {
                $(element[0]).addClass(scope.scrollClass);
              } else {
                $(element[0]).removeClass(scope.scrollClass);
              }
            });

          }

        }
      }
    }
  ]);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['somai']);
  });

})(window.angular, window.jQuery);
