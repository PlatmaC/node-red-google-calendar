Fork of the node-red-contrib-google-calendar package.
[node-red-contrib-google-calendar repository](https://github.com/taminhhienmor/node-red-contrib-google-calendar.git)

## Features
Add new, update and retrieve list of events on google-calendar

## Use Cases
**1. Automated Meeting Reminders**

**Description:** Automatically send reminders for upcoming meetings or events from Google Calendar.

**Steps:**

* Use the @platmac/node-red-google-calendar node to retrieve events.

* Filter events occurring within a specified time frame (e.g., 30 minutes).

* Send a reminder via email or messaging service using appropriate nodes.

**2. Room Booking System**

**Description:** Create a room booking system that updates a Google Calendar to show room availability and bookings.

**Steps:**

* Create an interface for users to book a room.

* Use the @platmac/node-red-google-calendar node to check room availability.

* If available, add the booking to the Google Calendar.

* Notify users of successful bookings.

**3. Daily Agenda Notifications**
**Description:** Send daily agendas to users at the start of each day.

**Steps:**

* Use the @platmac/node-red-google-calendar node to retrieve events for the day.

* Format the events into a readable agenda.

* Send the agenda via email or messaging service using appropriate nodes.

**4. Event-Driven Automation**
**Description:** Trigger home automation actions based on calendar events.

**Steps:**

* Use the @platmac/node-red-google-calendar node to monitor for specific events (e.g., “Meeting with client”).

* When such an event is detected, trigger actions like turning on lights or adjusting the thermostat.

* Integrate with home automation nodes to perform these actions.

**5. Travel Time Notifications**
**Description:** Notify users of the best departure time based on calendar events and real-time traffic conditions.

**Steps:**

* Use the @platmac/node-red-google-calendar node to retrieve the next event location.

* Use a traffic information service to calculate travel time.

* Send a notification with the best departure time considering current traffic.

**6. Task Management Integration**
**Description:** Synchronize tasks from a task management system to Google Calendar.

**Steps:**

* Retrieve tasks from the task management system.

* Use the @platmac/node-red-google-calendar node to create calendar events based on tasks.

* Update tasks in the task management system as events are marked as completed.

**7. Public Event Announcements**
**Description:** Automatically post public events from Google Calendar to social media.

**Steps:**

* Use the @platmac/node-red-google-calendar node to retrieve public events.

* Format event details for social media.

* Use social media nodes to post event details to platforms like Twitter or Facebook.

These use cases demonstrate the versatility of integrating Google Calendar with Node-RED, allowing for automation and improved efficiency in various scenarios.


## Install
@platmac/node-red-google-calendar can be install using the node-red editor's pallete or by running npm in the console:

``` bash
npm install @platmac/node-red-google-calendar
```

## Setup Google Calendar API connection

**1.** Add one of the nodes you want to use to your flow.

**2.** Press "Edit" button near the Google Account field. You will see the page with two fields: **Client Id** and **Secret**. At the hint above you will see the URL, that you have to use later in Google Developer Console.

**3.** Go to **Google Developer Consol**e select (or create) your project.

**4.** Go to Library and add the **Google Calendar API**.

**5.** Then go to **"Credentials"** and add a new **OAuth Client-ID**.

**6.** In creation page select **Web application**

**5.** In the **"Authorized redirect URIs"** field you have to add URL from the hint in your node (**item number 2 on this list**). 

**6.** In the **"Authorized JavaScript origins"** field you have to add URL from the hint in your node shortened until first "/" (**item number 2 on this list**). 

**7.** After creation you can see your **Client-ID** and **Client-Key**. You can copy those or hit OK.

**8.** Open the page with your node and enter **Client Id** and **Secret** strings into fields.

**9.** Now press the "**Authenticate with Google"** button and a new window of your browser will open. Follow the instructions and grant access to your project.

**12.** At the end of the authentication process, there will be page with message "Authorised - you can close this window and return to Node-RED". Close the page and go back to your node.

**13.** Press the **"Add"** button and you will finish the authorization process.

**14.** Press the **"Deploy"** button and calendar list will fill up with available calendars.

## List nodes
**Get Event**

Return the event in range time from Google Calendar.

The incoming message can provide the following properties:

* **msg.payload.timemin** - a text search string used to select relevant events

* **msg.payload.timemax** - a text search string used to select relevant events

**Notice: time should be entered in timezone that is used in Google Calendar**

example: msg.payload = { timemin:"Feb 12, 2020 00:15:15", timemax:"Feb 13, 2020 00:15:15"

* **msg.calendarId** - a text search string used to select relevant events. Example: msg.calendarId = "abc@gmail.com"

The message sent from the node will have properties:

* **msg.payload** - an array of objects (events) each of which containing:

* **msg.calendarId** - the id of the calendar where event is created

* **msg.eventId** - the id of the exact event 

* **start** - Date of start time - midnight for all day event

* **end** - Date of end time - midnight for all day event

**Notice: time will be displayed in timezone that is used in Google Calendar**

* **title** - the summary string from the calendar entry

* **attendees** - list of objects containing name and email properties

**Add Event**

Send a message every time an event occurs in a Google Calendar.

The incoming message can provide the following properties:

* **msg.calendarId** - the id of the calendar you want to create event for

* **msg.title** - the summary string from the calendar entry

* **msg.description** - the description from the calendar entry

* **msg.location** - the location string from the calendar entry

* **msg.conference** - the flag to create Google Meet conference for this event

* **msg.timezone** - timezone for entered date.

* **msg.start** - date of start time

* **msg.end** - date of end time

The message sent from the node will have properties:

* **payload** - Success/Error

* **meetLink** - link for Google Meet event if created


**Update Event**

Update an event occurs in a Google Calendar.

The incoming message can provide the following properties:

* **msg.calendarId** - the id of the calendar you want to create event for

* **msg.eventId** - the id of the event you want to update

* **msg.title** - the summary string from the calendar entry

* **msg.description** - the description from the calendar entry

* **msg.conference** - the flag to create Google Meet conference for this event

* **msg.emailNotify** - the flag to notify event participants about changes

* **msg.location** - the location string from the calendar entry

You can notify all attendees about event changes using the checkbox "Email notify"

The message sent from the node will have properties:

* **payload** - Success/Error

* **meetLink** - link for Google Meet event if created

## Example node

Get event from google calendar...<br>
![get-event](/examples/get_flow.png)
![get-calendar-success](/examples/get.png)

``` node
[ { "id": "275b61dfe7c4f106", "type": "tab", "label": "Flow 1", "disabled": false, "info": "", "env": [] }, { "id": "10024703.ece9d9", "type": "inject", "z": "275b61dfe7c4f106", "name": "", "props": [ { "p": "payload" }, { "p": "topic", "vt": "str" } ], "repeat": "", "crontab": "", "once": false, "onceDelay": 0.1, "topic": "", "payload": "", "payloadType": "date", "x": 610, "y": 400, "wires": [ [ "df05d057.adc84" ] ] }, { "id": "e4c18a06.b32d68", "type": "debug", "z": "275b61dfe7c4f106", "name": "", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "false", "x": 1010, "y": 400, "wires": [] }, { "id": "df05d057.adc84", "type": "getEventFromCalendar", "z": "275b61dfe7c4f106", "google": "", "calendarId": "", "time": "06/18/2024 12:00 AM - 06/30/2024 11:59 PM", "x": 810, "y": 400, "wires": [ [ "e4c18a06.b32d68" ] ] } ]
```

Add event to google calendar...<br>
![add-event](/examples/add_flow.png)
![add-event-calendar-success](/examples/add.png)

``` node
[ { "id": "a65b6e9c6cc0690b", "type": "tab", "label": "Flow 2", "disabled": false, "info": "", "env": [] }, { "id": "1b7a6e62.038442", "type": "inject", "z": "a65b6e9c6cc0690b", "name": "", "repeat": "", "crontab": "", "once": false, "onceDelay": 0.1, "topic": "", "payload": "", "payloadType": "date", "x": 580, "y": 380, "wires": [ [ "2d095a31.3d2dc6" ] ] }, { "id": "fda646ee.5e2fa8", "type": "debug", "z": "a65b6e9c6cc0690b", "name": "", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "false", "x": 970, "y": 380, "wires": [] }, { "id": "2d095a31.3d2dc6", "type": "addEventToCalendar", "z": "a65b6e9c6cc0690b", "google": "", "calendarId2": "", "timezone": "+3", "conference": true, "tittle": "Test title", "description": "This is description", "location": "Ukraine", "time": "06/25/2024 12:00 AM - 06/26/2024 11:59 PM", "attend": "1", "email1": "test@example.com", "name1": "Test User", "email2": "", "name2": "", "email3": "", "name3": "", "email4": "", "name4": "", "email5": "", "name5": "", "x": 770, "y": 380, "wires": [ [ "fda646ee.5e2fa8" ] ] } ]
```

Update event from google calendar...<br>
![update-event](/examples/udp_flow.png)
![update-event-calendar-success](/examples/upd.png)

``` node
[ { "id": "1b7a6e62.038442", "type": "inject", "z": "275b61dfe7c4f106", "name": "", "repeat": "", "crontab": "", "once": false, "onceDelay": 0.1, "topic": "", "payload": "", "payloadType": "date", "x": 620, "y": 760, "wires": [ [ "ebc0922737875a6c" ] ] }, { "id": "fda646ee.5e2fa8", "type": "debug", "z": "275b61dfe7c4f106", "name": "", "active": true, "tosidebar": true, "console": false, "tostatus": false, "complete": "false", "x": 1010, "y": 760, "wires": [] }, { "id": "ebc0922737875a6c", "type": "updateEventAtCalendar", "z": "275b61dfe7c4f106", "google": "", "calendarId": "", "eventId": "qjpupj9nfsv22e24a0qn010q0o", "title": "New Title", "description": "", "location": "", "emailNotify": true, "conference": false, "x": 820, "y": 760, "wires": [ [ "fda646ee.5e2fa8" ] ] } ]
```