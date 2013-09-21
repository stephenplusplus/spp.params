# spp.params

> An easy way to save URL parameters to localStorage in your Angular application.


## Demo

Check out a really awesome sample application [here](http://embed.plnkr.co/FivsKkrRbIkuhfNqTHdG/preview).


## Using spp.params

Using [Bower](http://bower.io), head to your nearest terminal and tap:

```bash
$ bower install spp.params --save
```

- Include `spp.params/SessionService.js` in your HTML.

- Add `spp.params` as a dependency of your Angular module.


## Sample Usage
Follow along with the sample application below to see how to use `spp.params`.

```js
angular.module('yourApp', ['spp.params']).
  config(['SessionServiceProvider', function (SessionServiceProvider) {

    // You must define a key where the parameters will be saved into
    // localStorage.
    SessionServiceProvider.localStorageId = 'url-parameters';

    // SessionService allows you to customize the way warning messages are
    // displayed. Here, we just have a simple wrapper around the function that
    // will be called, `NotifierService`.
    SessionServiceProvider.NotifierService = function (message) {
      console.log('This is a custom warning message!', message);
    };

    // You must specify `parameters` as an array of object in the following
    // format...
    //
    // parameter {string}  The case-insensitive url parameter you want to cache.
    // required  {boolean} Should your application display a warning if this
    //                     parameter isn't specified?
    SessionServiceProvider.parameters = [
      {
        name: 'userId',
        required: true
      }, {
        name: 'unicornId',
        required: false
      }
    ];
  }]).
  run(['$rootScope', 'SessionService', '$window', function ($rootScope, SessionService, $window) {

    // You can choose when to run `SessionService.detect()`.
    //
    // Here, we're running it as soon as the application runs...
    SessionService.readParams();

    // ...as well as every time the route changes.
    $rootScope.$on('$routeChangeSuccess', SessionService.detect);
  }]);
```
