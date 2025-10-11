const createFunction = require('../models/adminModel');

async function createEvent(req, res){

    const {event_name, event_date, event_tickets, event_location } = req.body;

    try{
        const newEvenet = await createFunction.createEvent(event_name, event_date, event_tickets, event_location);
        res.status(201).json(newEvent);    
    } catch (err) {
        console.error("Failed to create event: ", err.message);
        res.status(500).json({error: "Server error"})
    }
}

module.exports = {createEvent};