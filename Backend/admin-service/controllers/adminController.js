const adminModel = require('../models/adminModel');

async function createEvent(req, res){

    try{
        const {event_name, event_date, event_tickets, event_location } = req.body;

        //validation to make sure each field is inserted
        if(!event_name || !event_date || !event_tickets || !event_location)
        {
            return res.status(400).json({error: 'You have a missing field that is required'});

        }

        //correct types
        if(typeof event_name != 'string')
        {
            return res.status(400).json({error: 'event_name must be a string'});
        }

        if(typeof event_location != 'string')
        {
            return res.status(400).json({error: 'event_location must be a string'});
        }

        //empty string checks
        if(event_name.trim() === '')
        {
            return res.status(400).json({error: 'event_name cannot be empty'});
        }

        if(event_location.trim() === '')
        {
            return res.status(400).json({error: 'event_location cannot be empty'});
        }

        //tickets must be greater than 0
        if(event_tickets <= 0)
        {
            return res.status(400).json({error: "event_tickets must be greater than 0"});
        }

        //check the format of the date
        const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateFormat.test(event_date))
        {
            return res.status(400).json({error: "event_date must be in a YYYY-MM-DD format like 2025-12-31"});
        }

        //check for a valid date
        const parsedDate = new Date(event_date);
        if(isNaN(parsedDate.getTime()))
        {
            return res.status(400).json({error: "event_date is not a valid date"});
        }

        const newEvent = await adminModel.createEvent(event_name, event_date, event_tickets, event_location);    
        //const newTicket = await adminModel.createTicket(newEvent.event_id, true, ticket_price, ticket_type);
        res.status(201).json(newEvent);
    } catch (err) {
        console.error("Failed to create event: ", err.message);
        res.status(500).json({error: "Server error"})
    }
}

module.exports = {createEvent};