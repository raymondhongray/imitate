function genDuck() {

    var duck_id = 'duck_id_' + Date.now();
    var left_offset = Math.floor((Math.random() * 100) + 1);

    $('.ducky').clone().addClass(duck_id).css('left', left_offset + '%').appendTo('body');

    setTimeout(function() {

        $('.' + duck_id).remove();
    }, 5000);
}

function checkCoordinatorExisted() {

    firebase.database().ref('/coordinator').once('value').then(function(snapshot) {
        isActive = snapshot.val().isActive;
        console.log(isActive);

        if (isActive == 1) {

            addNewUser();
        } else {
            window.location.href = 'coordinator.html';
        }
    });
}

function addNewUser() {
    // A post entry.
    var postData = {
        action: 'default',
        isActive: 1,
        status: 0
    };

    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('users').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/users/' + newPostKey] = postData;

    firebase.database().ref().update(updates);

    firebase.database().ref('users/' + newPostKey + '/status').on('value', function(snapshot) {

        var status = snapshot.val();

        if (status == 1) {
            $('.sake').click();
        } else {
            $('.sake').removeClass(current_action);
        }
    });

    $(window).on('beforeunload', function(e) {

        firebase.database().ref('users/' + newPostKey).remove();
    });
}

$(document).ready(function() {

    checkCoordinatorExisted();

    setTimeout(function() {
        $('.sake').removeClass('blink');
    }, 2800);

    action = ['blink', 'play', 'spin', 'grow', 'shake'];
    current_action = '';

    $('.sake').click(function(e) {

        e.preventDefault();

        $('.sake').removeClass(current_action);

        var rIndex = Math.floor((Math.random() * 10) + 1) % action.length;

        if (action[rIndex] == current_action) {
            rIndex = (rIndex + 1) % action.length;
        }

        $('.sake').addClass(action[rIndex]);

        current_action = action[rIndex];
    });
});
