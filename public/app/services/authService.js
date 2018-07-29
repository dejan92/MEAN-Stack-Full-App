angular.module('authServices', [])

.factory('Auth', function($http){
    let authFactory = {};

    // User.create(newUser);
    authFactory.login = function(checkUser){
        return $http.post('/api/authenticate', checkUser);   
    }

    return authFactory;
});