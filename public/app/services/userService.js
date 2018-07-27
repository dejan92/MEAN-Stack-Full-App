angular.module('userServices', [])

.factory('User', function($http){
    let userFactory = {};

    // User.create(newUser);
    userFactory.create = function(newUser){
        return $http.post('/api/users', newUser);   
    }

    return userFactory;
});