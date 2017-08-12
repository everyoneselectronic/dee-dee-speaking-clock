// node app.js
// ngrok http 5500
// http://localhost:4040/

var port = process.env.PORT || 8080;
    
var baseUrl = "#href[http://test.everyoneselectronic.co.uk/limmy/";

var responsedata = {
    "Instructions": [],
    "Action": {}
};

var http = require('http')

var server = http.createServer(function (request, response) {
    var data = '';
    
    request.on('data', function (chunk) {
        data += chunk;

    });
    
    request.on('end', function () {
        var requestModel;
        if (data == '')
        {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.end('{"message":"no data posted"}');
            return;
        }
        else
        {
            requestModel = JSON.parse(data);
            response.writeHead(200, { 'Content-Type': 'application/json' });
            tellTime();
            response.end(JSON.stringify(responsedata));
        }
    });

});
server.listen(port);

function makeAudioObject(a) {
    var str = baseUrl + a + ".wav]";
    var ids = [str];

    // console.log(ids);

    var audio = {
        "name" : "PlayFiles",
        "ids" :  ids,
        "locale" : "en-US"
    }
    responsedata['Instructions'].push(audio);
}

function tellTime() {
    responsedata = {
        "Instructions": [],
        "Action": {}
    };
    
    var myDate = new Date();
    var myHour = myDate.getHours();
    var myMinute = myDate.getMinutes();
    var minuteDivBy5 = myMinute / 5;
    var roundMinuteDivBy5 = Math.round(minuteDivBy5);
    myHour = myHour % 12 || 12; // Convert hour to 12 hour day, 1-12

    // Array of speech, starting with intro. Further sounds will be added to the end.
    makeAudioObject("intro");

    // If it's not on the hour...
    if (myMinute > 0) {

        // If not on a 5 min div, say "just left" or "coming up for"
        if (minuteDivBy5 != roundMinuteDivBy5) {
            if (roundMinuteDivBy5 < minuteDivBy5) {
                makeAudioObject("justleft");
                // console.log("justleft")
            } else {
                makeAudioObject("comingupfor");
                // console.log("comingupfor")
            }
        }

        // What minute? Past or from?
        if (roundMinuteDivBy5 == 6) { // if half past
            makeAudioObject("half");
            makeAudioObject("past");
            // console.log("half past");
        } else if (roundMinuteDivBy5 == 3) {
            makeAudioObject("quarter");
            makeAudioObject("past");
            // console.log("quarter past");
        } else if (roundMinuteDivBy5 == 9) {
            makeAudioObject("quarter");
            makeAudioObject("to");
            // console.log("quarter to");
        } else if (roundMinuteDivBy5 > 0 && roundMinuteDivBy5 < 7) {
            makeAudioObject((roundMinuteDivBy5 * 5) + "m");
            makeAudioObject("past");
            // console.log((roundMinuteDivBy5 * 5) + "m past");
        } else if (roundMinuteDivBy5 >= 7 && roundMinuteDivBy5 < 12) {
            makeAudioObject((60 - (roundMinuteDivBy5 * 5)) + "m");
            makeAudioObject("to");
            // console.log("etc");
        }

    }

    // What hour to say? If less than 33 mins, refer to this hour. More, refer to next hour.
    if (myMinute < 33) {
        makeAudioObject(myHour + "h");
        // console.log(myHour + "h");
    } else {
        if (myHour < 12) {
            makeAudioObject(myHour + 1 + "h");
            // console.log(myHour + 1 + "h");
        } else {
            makeAudioObject("1h");
            // console.log("1h");
        }
    }
}