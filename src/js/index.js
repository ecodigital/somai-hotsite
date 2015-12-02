require('./static');

(function(angular, $, _, undefined) {

  var app = angular.module('somai', [
    'ui.router',
    'duScroll',
    'localytics.directives',
    'angularLazyImg'
  ]);

  app.value('duScrollOffset', 190).run([
    'duScrollOffset',
    function(duScrollOffset) {
      // $(window).on('resize', function() {
      //   if($(window).width() <= 770) {
      //     duScrollOffset = 50;
      //   } else {
      //     duScrollOffset = 190;
      //   }
      // });
      // $(window).resize();
    }
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
      })
      .state('glossario', {
        url: '/glossario/',
        templateUrl: 'views/glossario.html',
        controller: 'GlossarioCtrl',
        params: {
          inner: true
        },
        resolve: {
          Data: [
            '$http',
            function($http) {
              return $http.get('data/glossario.json');
            }
          ]
        }
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
      })
      .state('ameacas.mapas', {
        url: 'mapas/'
      })
      .state('ameacas.clima', {
        url: 'clima/'
      })
      .state('ameacas.antropica', {
        url: 'antropica/'
      })
      .state('ameacas.calc', {
        url: 'calculadora/'
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

  app.directive('expand', [
    function() {
      return {
        restrict: 'A',
        scope: {
          'expand': '@'
        },
        link: function(scope, element, attrs) {
          if(scope.expand == 'right') {

            function doExpand() {
              var wWidth = $(window).width();
              var elWidth = $(element).offset().left;

              var width = wWidth - elWidth;

              $(element).css({
                width: width,
                height: 'auto'
              });
            }

            doExpand();
            $(window).bind('resize', doExpand);

          }
        }
      }
    }
  ]);

  app.directive('imageGallery', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var el = $(element);
          var btns = el.find('.gallery-nav > button');
          var label = el.find('.current');
          var imgs = el.find('.gallery-content > img');

          function showImg(selector) {
            imgs.removeClass('active').filter(selector).addClass('active');
            label.text(imgs.filter(selector).attr('alt'));
            $(window).resize();
          }

          function getActiveIdx() {
            return imgs.filter('.active').index()+1;
          }

          showImg(':nth-child(1)');

          if(!imgs.length || imgs.length == 1)
            btns.hide();
          else {

            btns.on('click', function() {

              btn = $(this);
              var selector;

              if(btn.hasClass('left')) {
                selector = ':nth-child(' + (getActiveIdx()-1) + ')';
                if(imgs.filter(selector).length)
                  showImg(selector);
                else
                  showImg(':nth-child(' + imgs.length + ')');
              } else if(btn.hasClass('right')) {
                selector = ':nth-child(' + (getActiveIdx()+1) + ')';
                if(imgs.filter(selector).length) {
                  console.log(imgs.filter(selector));
                  showImg(selector);
                } else
                  showImg(':nth-child(1)');
              }
            });

          }
        }
      }
    }
  ]);

  app.controller('SiteCtrl', [
    '$scope',
    '$state',
    '$document',
    '$timeout',
    '$http',
    function($scope, $state, $document, $timeout, $http) {

      /*
       * Navigation
       */
      $scope.showNav = false;
      $scope.toggleNav = function() {
        if($scope.showNav)
          $scope.showNav = false;
        else
          $scope.showNav = true;
      }

      $scope.isHome = true;

      $scope.$on('$stateChangeSuccess', function(ev, toState, toParams, fromState, fromParams) {

          if(toParams.inner) {
            $document.scrollTop(0);
          }

        $timeout(function() {

          if(!fromState.name || fromParams.inner) {
            var el = angular.element(document.getElementById(toState.name.replace('.', '_')));
            if(el.length) {
              $document.scrollToElementAnimated(el);
            }
          }
        }, 450);

        if(toState.name.indexOf('home') == -1)
          $scope.isHome = false;
        else
          $scope.isHome = true;

        if(toState.params && toState.params.inner) {
          $scope.isInner = true;
        } else {
          $scope.isInner = false;
        }

      });

      $scope.stateSpy = true;
      $scope.$on('$stateChangeStart', function(ev, toState, toParams) {

        $scope.showNav = false;

        if(toParams.inner) {
          $scope.stateSpy = false;
        } else {
          $scope.stateSpy = true;
        }
      });
      $scope.$on('duScrollspy:becameActive', function($ev, $element, $target) {
        if($scope.stateSpy)
          $state.go($target.attr('id').replace('_', '.'));
      });
      $scope.$on('duScrollspy:becameInactive', function() {
        if($scope.stateSpy)
          $state.go('home');
      });


      /*
       * Relatorio
       */
      $http.get('data/tis.json').success(function(data) {
        $scope.tis = _.sortBy(data, function(item) {
          return item.nome || item.nome_ti;
        });
      });

    }
  ]);

  app.controller('GlossarioCtrl', [
    '$scope',
    'Data',
    function($scope, Data) {
      $scope.items = Data.data;
    }
  ]);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['somai']);
  });

})(window.angular, window.jQuery, window._);
