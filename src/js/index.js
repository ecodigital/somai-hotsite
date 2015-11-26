(function(angular, $, undefined) {

  var app = angular.module('somai', [
    'ui.router',
    'duScroll'
  ]);

  app.value('duScrollOffset', 170);

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
      })
      .state('sobre', {
        url: '/sobre/'
      })
      .state('sobre.objetivos', {
        url: 'objetivos/'
      })
      .state('sobre.dados', {
        url: 'dados/'
      })
      .state('sobre.parceiros', {
        url: 'parceiros/'
      })
      .state('terras-indigenas', {
        url: '/terras-indigenas/'
      })
      .state('terras-indigenas.mapa', {
        url: 'mapa/'
      })
      .state('terras-indigenas.relatorio', {
        url: 'relatorio/'
      })
      .state('ameacas', {
        url: '/ameacas/'
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

          function doClass() {
            if($(window).scrollTop() >= parseInt(scope.offset)) {
              $(element[0]).addClass(scope.scrollClass);
            } else {
              $(element[0]).removeClass(scope.scrollClass);
            }
          }

          if(scope.offset) {
            doClass();
            $(window).bind('scroll', doClass);
          }

        }
      }
    }
  ]);

  app.controller('SiteCtrl', [
    '$scope',
    '$state',
    '$document',
    function($scope, $state, $document) {

      $scope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState) {
        if(!fromState.name) {
          var el = angular.element(document.getElementById(toState.name.replace('.', '_')));
          if(el.length) {
            $document.scrollToElementAnimated(el);
          }
        }
      });

      $scope.$on('duScrollspy:becameActive', function($ev, $element, $target) {
        $state.go($target.attr('id').replace('_', '.'));
      });
      $scope.$on('duScrollspy:becameInactive', function() {
        $state.go('home');
      });
    }
  ]);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['somai']);
  });

})(window.angular, window.jQuery);
