angular.module('mainController', ['authServices'])

    .controller('mainCtrl', function (Auth, $timeout, $location) {
        let app = this;

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
                        }, 2000);

                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message
                    }
                });
        }
    })