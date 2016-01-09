function getStorageValue(item, default_value){
    var retVal = localStorage.getItem(item);
    //console.log('value' + item + ': ' + String(retVal));
    if (retVal === null || retVal == 'undefined' || retVal == 'null'){
        retVal = default_value;
    }
    return retVal;
}

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 * Similar to ES6 Object.assign() but without side effects and works with older js implementations
 * See
 *    * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 *    * http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
 */
function merge_options(obj1, obj2){
    var obj3 = {};
    var attrname;

    for (attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

Pebble.addEventListener('showConfiguration', function(e) {
    /* DEBUG test old settings are handled and cleaned up */
    /*
            localStorage.setItem('background_color', '0000FF');
            localStorage.setItem('time_color', 'FFFF00');
            localStorage.setItem('vibrate_disconnect', true);
    */
    /* DEBUG */
    var default_dict = {
        version_settings: 0,  // Bump this when ever config storage changes
        // http://developer.getpebble.com/tools/color-picker/
        background_color: '000000',  // GColorBlack
        time_color: 'FFFFFF',  // GColorWhite
        vibrate_disconnect: 0
    };
    var stored_dict_str = getStorageValue('stored_dict', null);
    console.log('stored_dict_str: ' + stored_dict_str);
    var stored_dict;
    if (stored_dict_str === null)
    {
        stored_dict = {};
    }
    else
    {
        stored_dict = JSON.parse(stored_dict_str);
    }
    console.log('stored_dict: ' + JSON.stringify(stored_dict));
    console.log('default_dict: ' + JSON.stringify(default_dict));

    // TODO replace with a loop, remove duplicate code
  var background_color = getStorageValue('background_color', null);
    if (background_color === null)
    {
        // FIXME loose this....
        background_color = default_dict.background_color;
    }
    else
    {
        default_dict.background_color = background_color;
        console.log('about to remove old localStorage item background_color');
        localStorage.removeItem('background_color');
    }

  var time_color = getStorageValue('time_color', null);
    if (time_color === null)
    {
        // FIXME loose this....
        time_color = default_dict.time_color;
    }
    else
    {
        default_dict.time_color = time_color;
        console.log('about to remove old localStorage item time_color');
        localStorage.removeItem('time_color');
    }

  var vibrate_disconnect = getStorageValue('vibrate_disconnect', null);
    if (vibrate_disconnect === null)
    {
        // FIXME loose this....
        vibrate_disconnect = default_dict.vibrate_disconnect;
    }
    else
    {
        default_dict.vibrate_disconnect = vibrate_disconnect;
        console.log('about to remove old localStorage item vibrate_disconnect');
        localStorage.removeItem('vibrate_disconnect');
    }


    var configuration = merge_options(default_dict, stored_dict);
    console.log('configuration: ' + JSON.stringify(configuration));

    var param_array = [];
    var temp_str;
    var config_key;
    for (config_key in configuration)
    {
        console.log('config_key: ' + config_key + '=' + configuration[config_key]);
        temp_str = config_key + '=' + encodeURIComponent(configuration[config_key]);
        param_array.push(temp_str);
    }
    var URL = 'http://clach04.github.io/pebble/watchface_framework/slate/index.html' + '?' + param_array.join('&');
    console.log('Configuration window opened. ' + URL);
    Pebble.openURL(URL);
});

Pebble.addEventListener('webviewclosed',
    function(e) {
        console.log('e.response: ' + e.response);
        console.log('e.response.length: ' + e.response.length);
        try {
            var configuration = JSON.parse(decodeURIComponent(e.response));
            var vibrate_disconnect = 0;

            console.log('dictionary to validate ' + JSON.stringify(configuration));
            /*
            ** configuration can from an external web site, this is not trustworthy
            ** and so needs validation. This avoids needing to add lots of
            ** protection to the C code on the Pebble.
            */
            // TODO as configuration is untrusted and may be missing values, merge in from default_dict

            if ('vibrate_disconnect' in configuration)
            {
                switch (configuration.vibrate_disconnect) {
                    case true:
                    case 'true':
                    case 'True':
                    case 'TRUE':
                    case 1:
                    case '1':
                    case 'on':
                        vibrate_disconnect = 1;
                        break;
                    default:
                        vibrate_disconnect = 0;
                        break;
                }
            }
            var dictionary = {
              "KEY_TIME_COLOR": parseInt(configuration.time_color, 16),
              "KEY_BACKGROUND_COLOR": parseInt(configuration.background_color, 16), // FIXME if mising default value..
              "KEY_VIBRATE_ON_DISCONNECT": vibrate_disconnect
            };
            /* even though we don't realy trust `configuration`, store it in local phone storage */
            // TODO store dictionary instead - which stores number differently
            console.log('store config on phone');
            localStorage.setItem('stored_dict', JSON.stringify(configuration));

            console.log('dictionary to send to Pebble' + JSON.stringify(dictionary));
            // Send to Pebble
            Pebble.sendAppMessage(dictionary,
                function(e) {
                    console.log("Configuration sent to Pebble successfully!");
                },
                function(e) {
                    console.log("Error sending configuration info to Pebble!");
                }
            );
        } catch (ex) {
            // If we have SyntaxError JSON is invalid, anything unknown!?
            if (ex instanceof SyntaxError) {
                console.log('Probably Cancelled');
            } else {
                throw ex;
                // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError
            }
        }
    }
);
