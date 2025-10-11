const modelsFunctions = require('../models/adminModel');

async function createEvent(req, res){

    try{
        const {event_name, event_date, event_tickets, event_location } = req.body;
        const newEvent = await modelsFunctions.createEvent(event_name, event_date, event_tickets, event_location);    
        const newTicket = await adminModel.createTicket(newEvent.event_id, event_tickets, ticket_price, ticket_type);
        res.status(201).json({event: newEvent, ticket: newTicket});
    } catch (err) {
        console.error("Failed to create event: ", err.message);
        res.status(500).json({error: "Server error"})
    }
}

module.exports = {createEvent};