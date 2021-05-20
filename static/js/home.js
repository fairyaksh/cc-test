/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/users',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(fname, lname) {
            let ajax_options = {
                type: 'POST',
                url: 'api/users',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'username': username,
                    'strategy': strategy,
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $username = $('#username'),
        $strategy = $('#strategy');

    // return the API
    return {
        reset: function() {
            $strategy.val('');
            $username.val('').focus();
        },
        update_editor: function(fname, lname) {
            $username.val(username);
            $strategy.val(strategy).focus();
        },
        build_table: function(users) {
            let rows = ''

            // clear the table
            $('.users table > tbody').empty();

            // did we get a people array?
            if (users) {
                for (let i=0, l=users.length; i < l; i++) {
                    rows += `<tr><td class="username">${users[i].username}</td><td class="strategy">${users[i].strategy}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $username = $('#username'),
        $strategy = $('#strategy');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(fname, lname) {
        return username !== "" && strategy !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let username = $username.val(),
            strategy = $strategy.val();

        e.preventDefault();

        if (validate(username, strategy)) {
            model.create(username, strategy)
        } else {
            alert('Problem with username or strategy input');
        }
    });

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            username,
            strategy;

        username = $target
            .parent()
            .find('td.username')
            .text();

        strategy = $target
            .parent()
            .find('td.strategy')
            .text();

        view.update_editor(username, strategy);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));