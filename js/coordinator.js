$(document).ready(function() {

    firebase.database().ref('/coordinator').once('value').then(function(snapshot) {

        var isCoordinator = snapshot.val().isActive;

        console.log(isCoordinator);

        if (!isCoordinator) {

            var updates = {};
            updates['/coordinator/isActive'] = 1;
            firebase.database().ref().update(updates);

            console.log('be a Coordinator');
        }
    });

    $('.trigger-btn').click(function() {

        if ($('.trigger-btn').hasClass('able')) {

            $('.progress_window').css('visibility', 'visible');

            $('.trigger-btn').addClass('disable');
            $('.trigger-btn').removeClass('able');
            $('.trigger-btn').text('STOP');

            firebase.database().ref('/users').once('value').then(function(snapshot) {
                var users = snapshot.val();
                console.log(users);

                $.each(users, function(key, value) {
                    console.log(value.isActive);
                    if (value.isActive) {
                        var updates = {};
                        updates['/users/' + key + '/status'] = 1;
                        firebase.database().ref().update(updates);
                    }
                });

                $('.inner_bar').addClass('loading');

                setTimeout(function() {

                    firebase.database().ref('/users').once('value').then(function(snapshot) {
                        var users = snapshot.val();

                        $.each(users, function(key, value) {
                            console.log(value.isActive);
                            if (value.isActive) {
                                var updates = {};
                                updates['/users/' + key + '/status'] = 0;
                                firebase.database().ref().update(updates);
                            }
                        });
                    });
                    $('.progress_window').css('visibility', 'hidden');
                    $('.inner_bar').removeClass('loading');
                    $('.trigger-btn').addClass('able');
                    $('.trigger-btn').removeClass('disable');
                }, 2000);
            });
        } else {

            $('.trigger-btn').addClass('able');
            $('.trigger-btn').removeClass('disable');
            $('.trigger-btn').text('START');

            firebase.database().ref('/users').once('value').then(function(snapshot) {
                var users = snapshot.val();

                $.each(users, function(key, value) {
                    console.log(value.isActive);
                    if (value.isActive) {
                        var updates = {};
                        updates['/users/' + key + '/status'] = 0;
                        firebase.database().ref().update(updates);
                    }
                });
            });
        }
    });

    // firebase.database().ref('/users').once('value').then(function(snapshot) {
    //     var users = snapshot.val();
    //     $.each(users, function(key, value) {
    //         console.log(value.isActive);
    //         if (!value.isActive) {
    //             firebase.database().ref('/users/' + 　key).remove();
    //         }
    //     });
    // });
});
