const clientModel = require('../models/clientModel');

/**
 * Fetches all events from the database.
 * Handles GET /api/events.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} Responds with 200 and array of events on success, or 500 with error message on failure
 * @throws {Error} If the database query fails
 */

async function getEvents(req, res) {
    try {
        const events = await clientModel.getEvents();
        res.status(200).json(events);
    } catch (err) {
        console.error("Failed to get event: ", err.message);
        res.status(500).json({ error: err.message });
    }
}

/**
 * Fetches a single event by ID.
 * Handles GET /api/events/:event_id.
 * @param {Object} req - Express request object
 * @param {number} req.params.event_id - ID of the event to fetch
 * @param {Object} res - Express response object
 * @returns {void} Responds with 200 and event object if found, 404 if not found, or 500 on error
 * @throws {Error} If the database query fails
 */

async function getAnEvent(req, res){
        try{
            const event_id = req.params.event_id;
            const event = await clientModel.getAnEvent(event_id);

            if(!event){
                return res.status(404).json({error: "Event not found"});
            }
            res.status(200).json(event)
        } catch(err){
            console.error("problem getting event:", err.message);
            res.status(500).json({error: "Server error"})
        }
    }

/**
 * Purchases a ticket for a specific event.
 * Handles POST /api/events/:id/purchase.
 * @param {Object} req - Express request object
 * @param {number} req.params.id - ID of the event to purchase a ticket for
 * @param {Object} res - Express response object
 * @returns {void} Responds with 200 and purchase result on success, or 500 on failure
 * @throws {Error} If the database update fails
 */

    async function purchaseTicket(req,res){
        try{
            const event_id = parseInt(req.params.id);
            console.log('Ticket is being purchased for event: ', event_id);
            
            const result = await clientModel.purchaseTicket(event_id);

            console.log('your transaction was successful:', result);

            res.status(200).json(result);

        } catch(err){
            console.error("failed to purchase ticket: ", err.message);
            res.status(500).json({error: "Server error"})
        }
    }

// module.exports = {getEvents, getAnEvent, purchaseTicket};

// const axios = require('axios');
// const llmModel = require('../models/llmModel'); // we’ll create this to handle DB logic like getEventByName and bookTicketsTransaction

// /**
//  * Parses a user's natural-language booking request using Gemini.
//  * Handles POST /api/llm/parse.
//  * @param {Object} req - Express request object
//  * @param {string} req.body.text - User input like "Book 2 tickets for Jazz Night"
//  * @param {Object} res - Express response object
//  */
// async function parseBooking(req, res) {
//     try {
//         const { text } = req.body;
//         if (!text || text.trim() === '') {
//             return res.status(400).json({ error: 'Input text is required' });
//         }

//         // LLM prompt for structured JSON
//         const prompt = `
// You are a ticket-booking assistant.
// A user wants to book tickets.
// Extract only JSON with keys "event" (string) and "tickets" (integer).
// Example: { "event": "Jazz Night", "tickets": 2 }
// User input: "${text}"
// `;

//         // Call Gemini API
//         const response = await axios.post('https://api.gemini.com/v1/generate', {
//             prompt,
//             max_tokens: 100,
//             temperature: 0
//         });

//         const llmOutput = response.data.output_text;

//         let parsed;
//         try {
//             parsed = JSON.parse(llmOutput);
//         } catch (err) {
//             return res.status(400).json({ error: 'Could not parse LLM response' });
//         }

//         const eventRow = await llmModel.getEventByName(parsed.event);
//         if (!eventRow) {
//             return res.status(404).json({ error: `Event "${parsed.event}" not found` });
//         }

//         res.status(200).json({
//             message: `Proposed booking: ${parsed.tickets} ticket(s) for "${parsed.event}"`,
//             booking: parsed
//         });

//     } catch (err) {
//         console.error("Failed to parse booking:", err.message);
//         res.status(500).json({ error: 'Server error' });
//     }
// }

// /**
//  * Confirms a booking after user approval.
//  * Handles POST /api/llm/confirm.
//  * @param {Object} req - Express request object
//  * @param {string} req.body.event - Event name
//  * @param {number} req.body.tickets - Number of tickets to book
//  * @param {Object} res - Express response object
//  */
// async function confirmBooking(req, res) {
//     try {
//         const { event, tickets } = req.body;
//         if (!event || !tickets) {
//             return res.status(400).json({ error: 'Event and tickets are required' });
//         }

//         const result = await llmModel.bookTicketsTransaction(event, tickets);
//         if (!result.success) {
//             return res.status(400).json({ error: result.message });
//         }

//         res.status(200).json({
//             message: `Booking confirmed for ${tickets} ticket(s) to "${event}"`,
//             booking: result.booking
//         });

//     } catch (err) {
//         console.error("Failed to confirm booking:", err.message);
//         res.status(500).json({ error: 'Server error' });
//     }
// }

// module.exports = { parseBooking, confirmBooking };
