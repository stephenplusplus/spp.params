angular.module('spp.params', []).
  factory('SessionService',
  ['$location', '$window', '$log',
  function ($location, $window, $log) {
    'use strict';

    var NotifierService = this.NotifierService || $log.error;
    var allProperties = this.parameters;
    var localStorageId = this.localStorageId;

    if (!$window.localStorage) {
      return $log.debug('spp.params requires localStorage support.');
    }

    if (!allProperties) {
      return $log.debug('spp.params requires a list of properties.');
    }

    if (!localStorageId) {
      return $log.debug('spp.params requires a localStorage id.');
    }

    var api = {
      detect: detect,
      set: set,
      get: get
    };

    var properties = $window.localStorage.getItem(localStorageId);
    properties = properties ? JSON.parse(properties) : {};

    var keys = allProperties.map(function (property) {
      return property.parameter.toLowerCase();
    });

    var parameters = {};

    return api;


    function buildParameterObject(params) {
      Object.keys(params).forEach(function (key) {
        parameters[key.toLowerCase()] = params[key];
      });
    }

    function detectProperty(property) {
      var key = property.parameter.toLowerCase();
      var value = parameters[key];

      if (value) {
        api.set(key, value);
      }

      if (property.required && !properties[key]) {
        NotifierService(property.parameter + ' is required.',
          'Missing URL Parameter');
      }
    }

    function detect() {
      buildParameterObject($location.search() || {});

      angular.forEach(allProperties, detectProperty);
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
