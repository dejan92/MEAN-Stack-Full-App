angular.module('authServices', [])

    .factory('Auth', function ($http, AuthToken) {
        let authFactory = {};

        // User.create(newUser);
        authFactory.login = function (checkUser) {
            return $http.post('/api/authenticate', checkUser).then(function(data){
                AuthToken.setToken(data.data.token);
                return data;
            });
        };

        authFactory.isLoggedIn = function(){
            if (AuthToken.getToken()) {
                return true;
            } else {
                return false;
            }
        };

        authFactory.facebook = function(token){
            AuthToken.setToken(token);
        }

        authFactory.getUser = function(){
            if (Auth.getToken()) {
                return $http.post('/currentuser');
            } else {
                $q.reject({ message: 'User has no token' });
            }
        }

        authFactory.logout = function(){
            //because we don't provide the token inside the fn it's going to remove it
            AuthToken.setToken();
        }

        return authFactory;
    })

    .factory('AuthToken', function ($window) {
        let authTokenFactory = {};

        authTokenFactory.setToken = function (token) {
            if (condition) {
                $window.localStorage.setItem('token', token);                
            } else {
                $window.localStorage.removeItem('token');
            }
        }

        authTokenFactory.getToken = function(){
            return $window.localStorage.getItem('token');
        }

        return authTokenFactory;
    })

    .factory('AuthInterceptors', function(AuthToken){
        let authInterceptorsFactory = {};

        authInterceptorsFactory.request = function(config){

            let token = AuthToken.getToken();

            if (token) config.headers['x-access-token'] = token;

            return config;
        }

        return authInterceptorsFactory;
    });