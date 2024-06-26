var request = require('request');
module.exports = function(RED) {
    "use strict";
    function addEventToCalendar(n) {
        RED.nodes.createNode(this,n);            
        this.google = RED.nodes.getNode(n.google);        
        if (!this.google || !this.google.credentials.accessToken) {
            this.warn(RED._("calendar.warn.no-credentials"));
            return;
        }
        var calendarId = n.calendarId2 || ""
        var node = this;

        node.on('input', function(msg) {
            calendarId = msg.calendarId? msg.calendarId : calendarId
            n.tittle = msg.tittle ? msg.tittle : n.tittle
            n.description = msg.description ? msg.description : n.description
            n.location = msg.location ? msg.location : n.location
            n.arrAttend = msg.arrAttend ? msg.arrAttend : n.arrAttend ? n.arrAttend : []
            n.conference = msg.conference ? msg.conference : n.conference
            var timeStart; 
            var timeEnd;
            let timezone = msg.timezone ? msg.timezone : n.timezone
                timeStart= msg.start ? msg.start : n.time.split(" - ")[0];
                timeEnd= msg.end ? msg.end : n.time.split(" - ")[1];
             timeStart += `${timezone}`;
             timeEnd += `${timezone}`;

            var arrAttend = [];     
            if (n.arrAttend.length===0){   
            if (n.attend > 0) {
                for (let index = 1; index < parseInt(n.attend) + 1; index++) {
                    if(n["email" + index] || n["name" + index]) {
                        if (validateEmail(n["email" + index])) {
                            arrAttend.push({
                                email: n["email" + index] || '',
                                displayName: n["name" + index] || ''
                            })             
                        }
                    }
                }            
            }         
        }        else { arrAttend = n.arrAttend}
        
        const conferenceData = {
            createRequest: {requestId: requestIdGenerator()}
          }
          
        var api = 'https://www.googleapis.com/calendar/v3/calendars/'        
            var newObj = {
                summary: n.tittle,
                description: n.description,
                location: n.location,
                start: {dateTime: new Date(timeStart)},
                end: {dateTime: new Date(timeEnd)},
                attendees: arrAttend,
            }

            if (n.conference){
                newObj.conferenceData = conferenceData;
            }
            var linkUrl = api + encodeURIComponent(calendarId) + '/events?conferenceDataVersion=1'
            var opts = {
                method: "POST",
                url: linkUrl,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + node.google.credentials.accessToken
                },
                body: JSON.stringify(newObj)
            };
            request(opts, function (error, response, body) {
                if (error) {
                    node.error(error,{});
                    node.status({fill:"red",shape:"ring",text:"calendar.status.failed"});
                    return;
                }       
                if (JSON.parse(body).kind == "calendar#event") {
                    msg.payload = `Successfully add event to ${calendarId}. ${JSON.parse(body).hangoutLink ? `Link for Meet: ${JSON.parse(body).hangoutLink}`: ""}`
                    msg.meetLink = JSON.parse(body).hangoutLink ? JSON.parse(body).hangoutLink : null;
                    msg.eventId = JSON.parse(body).id
                    node.status({ fill: "green", shape: "ring", text: "Added successfully" });
                } else {
                    msg.payload = "Fail"
                    node.status({ fill: "red", shape: "ring", text: "Fail to add" });
                }
                node.send(msg);
            })        
        });
    }
    RED.nodes.registerType("addEventToCalendar", addEventToCalendar);

    function validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    function requestIdGenerator(){
        return (Math.random() + 1).toString(36);
    }

    RED.httpAdmin.get('/cal', function(req, res) {              
        var googleId = res.socket.parser.incoming._parsedUrl.path.split("id=")[1];        
        RED.nodes.getNode(googleId).request('https://www.googleapis.com/calendar/v3/users/me/calendarList', function(err, data) {
            if(err) return;

            var primary = "";
            var arrCalendar = [];

            for (var i = 0; i < data.items.length; i++) {
                var cal = data.items[i];
                if (cal.primary) {
                    primary = cal.id;                    
                } else {
                    arrCalendar.push(cal.id)
                }
            }

            var arrData = [];
            arrData.push(primary);              
            arrCalendar.sort();
            arrCalendar.forEach(function(element) {
                arrData.push(element)
            })           
            res.json(arrData)            
        })
    })
};
