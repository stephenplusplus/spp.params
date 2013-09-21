angular.module('spp.params', []).
  factory('SessionService',
  ['$location', '$window', '$log',
  function ($location, $window, $log) {
    'use strict';

    var NotifierService = this.NotifierService || $log.error;
    var expectedParameters = this.parameters;
    var localStorageId = this.localStorageId;

    if (!$window.localStorage) {
      return $log.debug('spp.params requires localStorage support.');
    }

    if (!expectedParameters) {
      return $log.debug('spp.params requires a list of properties.');
    }

    if (!localStorageId) {
      return $log.debug('spp.params requires a localStorage id.');
    }

    var properties = $window.localStorage.getItem(localStorageId);
    properties = properties ? JSON.parse(properties) : {};

    var keys = expectedParameters.map(function (property) {
      return property.name.toLowerCase();
    });

    var parameters = {};

    return {
      readParams: readParams,
      set: set,
      get: get
    };


    function buildParameterObject(params) {
      Object.keys(params).forEach(function (key) {
        parameters[key.toLowerCase()] = params[key];
      });
    }

    function readParameter(parameter) {
      var key = parameter.name.toLowerCase();
      var value = parameters[key];

      if (value) {
        set(key, value);
      }

      if (parameter.required && !properties[key]) {
        NotifierService(parameter.name + ' is required.',
          'Missing URL Parameter');
      }
    }

    function readParams() {
      buildParameterObject($location.search() || {});

      angular.forEach(expectedParameters, readParameter);
    }

    function get(property) {
      return properties[property.toLowerCase()];
    }

    function set(key, value) {
      var propertyKey = key.toLowerCase();

      if (keys.indexOf(propertyKey) === -1) {
        return $log.debug(key + ' was not an expected property.');
      }

      // Don't re-save the same value.
      if (properties[propertyKey] !== value) {
        $log.debug('Saving ' + propertyKey + ' to localStorage');

        properties[propertyKey] = value;
        $window.localStorage.setItem(localStorageId,
          JSON.stringify(properties));
      }
    }
}]);
