angular.module('mainController', ['authServices'])

    .controller('mainCtrl', function (Auth, $timeout, $location, $rootScope, $window) {
        let app = this;

        app.loadme = false;
        $rootScope.$on('$routeChangeStart', function () {
            
            if (Auth.isLoggedIn()) {
                app.isLoggedIn = true;
                Auth.getUser().then(function (data) {
                    app.username = data.data.username;
                    app.useremail = data.data.email;
                    app.loadme = true;
                });
            } else {
                app.isLoggedIn = false;
                app.username = '';
                app.loadme = true;
            }
            if($location.hash() == '_#_') $location.hash(null);
        });

        this.facebook = function(){
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook' ;
        }

        this.doLogin = function (checkUser) {

            //handling front end message showing
            app.errorMsg = false;
            app.loading = true;

            Auth.login(app.checkUser)
                .then(function (data) {
                    console.log(data.data.success);
                    console.log(data.data.message);
                    if (data.data.success) {
                        app.loading = false;
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            $location.path('/home');
                            app.checkUser = '';
                            app.successMsg = false;
                        }, 2000);

                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message
                    }
                });
        }

        this.logout = function () {
            Auth.logout();
            $location.path('/logout');
            $timeout(function () {
                $location.path('/');
            }, 2000);
        };
    });