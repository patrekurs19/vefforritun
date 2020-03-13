//------------- MUNA AÐ HENDA ÚT FYRIR SKIL --------------------------------------------------------------------


//Sample data for Assignment 3

//The following is an example of an array of two events. 
var events = [
    { id: 0, name: "The Whistlers", description: "Romania, 2019, 97 minutes", location: "Bio Paradís, Salur 1", capacity: 40, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate: new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: [0,1,2] },
    { id: 1, name: "HarpFusion: Bach to the Future", description: "Harp ensemble", location: "Harpa, Hörpuhorn", capacity: 100, startDate: new Date(Date.UTC(2020, 02, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 02, 12, 16, 0)), bookings: [] }
];

//The following is an example of an array of three bookings.
var bookings = [
    { id: 0, firstName: "John", lastName: "Doe", tel: "+3541234567", email: "", spots: 3},
    { id: 1, firstName: "Jane", lastName: "Doe", tel: "", email: "jane@doe.doe", spots: 1},
    { id: 2, firstName: "Meðaljón", lastName: "Jónsson", tel: "+3541111111", email: "mj@test.is", spots: 5}
];

//----------------------------------------------------------------------------------------------------------------

//to be able to use express in this project
const express = require('express');

const app = express();

//Our server will lisen to port 3000 and what ever port Heroku will allocate to us with
const port = process.env.PORT || 3000;

//Import a body parser module to be able to access the request body as json
const bodyParser = require('body-parser');
//Tell express to use the body parser module
app.use(bodyParser.json());

let nextEventId = 2;
let nextBookingId = 3;


//---------------- EVENTS ENDPOINTS ---------------------------------------


// NOT INCLUDE DESCRIPTION AND BOOKINGS.
//lists all events
app.get('/api/v1/events', (req, res) => {
    attributes = events.map(function (events) {
        return {
            name: events.name,
            id: events.id,
            capacity: events.capacity,
            startDate: events.startDate,
            endDate: events.endDate
        }
    })
    res.status(200).json(attributes);
});


//lists all attributes for an event with a specific id
app.get('/api/v1/events/:eventId', (req, res) => {
    for (let i=0;i<events.length;i++) {
        if (events[i].id == req.params.eventId) {
            res.status(200).json(events[i]);
            return;
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});


app.post('/api/v1/events', (req, res) => {
    var today = (new Date());
    req.body.startDate = req.body.startDate*1000
    req.body.endDate = req.body.endDate*1000
    if (req.body === undefined) {  
        res.status(400).json({'message': "A request body is needed."});
    } else if (req.body.name === undefined) {
        res.status(400).json({'message': "A name field is required in the request body."});
    } else if (req.body.capacity === undefined || isNaN(Number(req.body.capacity)) || req.body.capacity === "" || req.body.capacity < 0) {
        res.status(400).json({'message': "A capacity field is required and it needs to be a number higher or equal to zero."});
    } else if (req.body.startDate === undefined || isNaN(Number(req.body.startDate))) {
        res.status(400).json({'message': "A startDate field is required and itneeds to be a number."});
    } else if (req.body.endDate === undefined || isNaN(Number(req.body.endDate))) {
        res.status(400).json({'message': "A endDate field is required and it needs to be a number."});
    } else if (req.body.startDate > req.body.endDate) {
        res.status(400).json({'message': "A endDate field needs to be higher than the startDate field."});
    } else if (today > req.body.startDate) {
        res.status(400).json({'message': "An event must be in the future."});
    } else {
        if (req.body.description === undefined) {
            req.body.description = "";
        }
        if (req.body.location === undefined) {
            req.body.location = "";
        }
        var starting = new Date(req.body.startDate);
        var ending = new Date(req.body.endDate);
        let startYear = starting.getFullYear();
        let startMonth = starting.getMonth()+1;
        let startdate = starting.getDate();
        let startHour = starting.getHours();
        let startMinutes = starting.getMinutes();
        let startSeconds = starting.getSeconds();
        let start = startYear+"-"+startMonth+"-"+startdate+"T"+startHour+":"+startMinutes+":"+startSeconds;
        let end = ending.getFullYear()+"-"+(ending.getMonth()+1)+"-"+ending.getDate()+"T"+ending.getHours()+":"+ending.getMinutes()+":"+ending.getSeconds();
        let newEvent = {id: nextEventId, name: req.body.name, description: req.body.description, location: req.body.location, capacity: req.body.capacity, startDate: start, endDate: end, bookings: []};
        events.push(newEvent);
        nextEventId++;
        res.status(201).json(newEvent);
    }
});


app.put('/api/v1/events/:eventId', (req, res) => {
    for (let i=0;i<events.length;i++) {
        if (events[i].id == req.params.eventId) {
            if (events[i].bookings.length === 0) {
                var today = (new Date());
                req.body.startDate = req.body.startDate*1000
                req.body.endDate = req.body.endDate*1000
                if (req.body === undefined) {  
                    res.status(400).json({'message': "A request body is needed."});
                    return;
                } else if (req.body.name === undefined) {
                    res.status(400).json({'message': "A name field is required in the request body."});
                    return;
                } else if (req.body.capacity === undefined || isNaN(Number(req.body.capacity)) || req.body.capacity === "" || req.body.capacity < 0) {
                    res.status(400).json({'message': "A capacity field is required and it needs to be a number higher or equal to zero."});
                    return;
                } else if (req.body.startDate === undefined || isNaN(Number(req.body.startDate))) {
                    res.status(400).json({'message': "A startDate field is required and it needs to be a number."});
                    return;
                } else if (req.body.endDate === undefined || isNaN(Number(req.body.endDate))) {
                    res.status(400).json({'message': "A endDate field is required and it needs to be a number."});
                    return;
                } else if (req.body.startDate > req.body.endDate) {
                    res.status(400).json({'message': "A endDate field needs to be higher than the startDate field."});
                    return;
                } else if (today > req.body.startDate) {
                    res.status(400).json({'message': "An event must be in the future."});
                    return;
                } else {
                    if (req.body.description === undefined) {
                        req.body.description = "";
                    }
                    if (req.body.location === undefined) {
                        req.body.location = "";
                    }
                    var starting = new Date(req.body.startDate);
                    var ending = new Date(req.body.endDate);
                    let startYear = starting.getFullYear();
                    let startMonth = starting.getMonth()+1;
                    let startdate = starting.getDate();
                    let startHour = starting.getHours();
                    let startMinutes = starting.getMinutes();
                    let startSeconds = starting.getSeconds();
                    let start = startYear+"-"+startMonth+"-"+startdate+"T"+startHour+":"+startMinutes+":"+startSeconds;
                    let end = ending.getFullYear()+"-"+(ending.getMonth()+1)+"-"+ending.getDate()+"T"+ending.getHours()+":"+ending.getMinutes()+":"+ending.getSeconds();
                    let updatedEvent = {id: events[i].id, name: req.body.name, description: req.body.description, location: req.body.location, capacity: req.body.capacity, startDate: start, endDate: end, bookings: []};
                    events[i] = updatedEvent;
                    res.status(200).json(events[i]);
                    return;
                }
            } else {
                res.status(400).json({'message': "Event with id " + req.params.eventId + " has a booking."});
                return;
            }
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});


//Deletes an event with a specific id
app.delete('/api/v1/events/:eventId', (req, res) => {
    for (let i=0;i<events.length;i++) {
        if (events[i].id == req.params.eventId) {
            if (events[i].bookings.length === 0) {
                res.status(200).json(events.splice(i, 1));
                return;
            } else {
                res.status(400).json({'message': "Event with id " + req.params.eventId + " has a booking."});
                return;
            }
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});


//Delets all events and all booking relating to that event
app.delete('/api/v1/events', (req, res) => {
    var returnArray = events.slice();
    events = [];
    bookings = []
    res.status(200).json(returnArray);
});


//-------------------------- BOOKINGS ENDPOINTS -------------------------------------------


//lists all bookings attributes for a specific event 
app.get('/api/v1/events/:eventId/bookings', (req, res) => {
    var returnArray = [];
    for (let i=0;i<events.length;i++) {
        if (events[i].id == req.params.eventId) {
            for (let u=0;u<bookings.length;u++){
                if (events[i].bookings.includes(bookings[u].id)) {
                    returnArray.push(bookings[u])
                }
            }
            res.status(200).json(returnArray);
            return;
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + "does not exist."});
});


app.get('/api/v1/events/:eventId/bookings/:bookingId', (req, res) => {
    for (let i=0;i<events.length;i++) {
        if (events[i].id == req.params.eventId) {
            if (events[i].bookings.includes(Number(req.params.bookingId))) {
                for (let u=0;u<bookings.length;u++){
                    if (bookings[u].id == req.params.bookingId) {
                        res.status(200).json(bookings[u]);
                        return;
                    }
                }
            } else {
                res.status(404).json({'message': "Booking with id " + req.params.bookingId + " does not exist for event with id " + req.params.eventId + "."});
                return;
            }
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + "does not exist."});
});


app.post('/api/v1/events/:eventId/bookings', (req, res) => {
    for (let i=0;i<events.length;i++) {
        if (events[i].id == req.params.eventId) {
            let spotsLeft = checkSpots(events[i].capacity, events[i].bookings)
            if (spotsLeft > 0) {
                if (req.body === undefined) {
                    res.status(400).json({'message': "A request body is needed."});
                    return;
                } else if (req.body.firstName === undefined) {
                    res.status(400).json({'message': "A firstName field is required."});
                    return;
                } else if (req.body.lastName === undefined) {
                    res.status(400).json({'message': "A lastName field is required."});
                    return;
                } else if (req.body.spots === undefined || isNaN(Number(req.body.spots)) || req.body.spots > spotsLeft || req.body.spots < 1) {
                    res.status(400).json({'message': "A spots field is required, it needs to be a number less or equal to "+spotsLeft+" and it needs to be larger than 0."});
                    return;
                } else if (req.body.tel === undefined && req.body.email ===undefined) {
                    res.status(400).json({'message': "A tel field or an email field is required."});
                    return;
                } else {
                    if (req.body.tel === undefined) {
                        req.body.tel = "";
                    }
                    if (req.body.email === undefined) {
                        req.body.email = "";
                    }
                    let newBooking = {id: nextBookingId, firstName: req.body.firstName, lastName: req.body.lastName, tel: req.body.tel, email: req.body.email, spots: req.body.spots}
                    bookings.push(newBooking)
                    events[i].bookings.push(newBooking.id)
                    nextBookingId += 1
                    res.status(200).json(newBooking);
                    return;
                }
            } else {
                res.status(400).json({'message': "Event with id " + req.params.eventId + " is fully booked."});
                return;
            }
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});


function checkSpots(capacity, eventBookings) {
    console.log(capacity)
    console.log(bookings)
    for (var i=0; i<eventBookings.length; i++) {
        capacity -= bookings[eventBookings[i]].spots
    }
    return capacity
}


app.delete('/api/v1/events/:eventId/bookings/:bookingId', (req, res) => {
    for (let i=0;i<events.length;i++) {
        if (events[i].id == req.params.eventId) {
            for (let k=0;k<events[i].bookings.length;k++) {
                if (events[i].bookings[k] == req.params.bookingId) {
                    events[i].bookings.splice(k, 1)
                    for (let u=0;u<bookings.length;u++){
                        if (bookings[u].id == req.params.bookingId) {
                            res.status(200).json(bookings.splice(u, 1));
                            return;
                        }
                    }
                }
            }
            res.status(404).json({'message': "Booking with id " + req.params.bookingId + " does not exist for event with id " + req.params.eventId + "."});
            return;
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + " does not exist."});
});


app.delete('/api/v1/events/:eventId/bookings', (req, res) => {
    var returnArray = [];
    for (let i=0;i<events.length;i++) {
        if (events[i].id == req.params.eventId) {
            var eventBookings = events[i].bookings.slice();
            events[i].bookings = []
            for (let u=0;u<bookings.length;u++){
                if (eventBookings.includes(bookings[u].id)) {
                    returnArray.push(bookings[u])
                    bookings.splice(u, 1);
                    u -= 1
                }
            }
            res.status(200).json(returnArray);
            return;
        }
    }
    res.status(404).json({'message': "Event with id " + req.params.eventId + "does not exist."});
});


//Default: Not supported
app.use('*', (req, res) => {
    res.status(405).send('Operation not supported.');
});


app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});