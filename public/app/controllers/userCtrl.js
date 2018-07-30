angular.module('userControllers', ['userServices'])

    .controller('regCtrl', function ($http, $location, $timeout, User) {

        let app = this;

        this.registerUser = function (newUser) {

            //handling front end message showing
            app.errorMsg = false;
            app.loading = true;

            User.create(app.newUser)
                .then(function (data) {
                    console.log(data.data.success);
                    console.log(data.data.message);
                    if (data.data.success) {
                        app.loading = false;
                        app.successMsg = data.data.message;
                        $timeout(function () {
                            $location.path('/home');
                        }, 2000);

                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message
                    }
                });
        }
    })

    .controller('facebookCtrl', function($routeParams, Auth, $location, $window){
        let app = this;

        if ($window.location.pathname == '/facebookerror') {
            app.errorMsg = 'Facebook email not found in database'            
        } else {
            Auth.facebook($routeParams.token);
            $location.path('/');
        }
        
    });