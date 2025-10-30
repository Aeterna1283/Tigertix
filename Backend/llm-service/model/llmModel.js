
// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');

// // Path to shared SQLite database
// const dbPath = path.join(__dirname, '../../shared-db/database.sqlite');
// const db = new sqlite3.Database(dbPath, (err) => {
//     if (err) {
//         console.error('Connection error with database', err.message);
//     } else {
//         console.log('Connected to SQLite database (LLM Model).');
//     }
// });

// /**
//  * Finds an event by name.
//  * @param {string} event_name - The event name to search for
//  * @returns {Promise<Object>} - Resolves with event row or null if not found
//  */
// function getEventByName(event_name) {
//     return new Promise((resolve, reject) => {
//         const sql = `SELECT * FROM Event WHERE event_name = ?`;
//         db.get(sql, [event_name], (err, row) => {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(row || null);
//         });
//     });
// }

// /**
//  * Decrements available tickets for an event.
//  * @param {number} event_id - The ID of the event
//  * @param {number} tickets - The number of tickets to subtract
//  * @returns {Promise<void>} - Resolves when update is done
//  */
// function decrementTickets(event_id, tickets) {
//     return new Promise((resolve, reject) => {
//         const sql = `
//             UPDATE Event 
//             SET event_tickets = event_tickets - ? 
//             WHERE event_id = ? AND event_tickets >= ?;
//         `;
//         db.run(sql, [tickets, event_id, tickets], function (err) {
//             if (err) {
//                 reject(err);
//                 return;
//             }

//             if (this.changes === 0) {
//                 reject(new Error("Not enough tickets available or event not found."));
//                 return;
//             }

//             resolve();
//         });
//     });
// }

// /**
//  * Creates a new booking record (simulated, since you don’t have a Booking table yet).
//  * @param {number} event_id - ID of the event being booked
//  * @param {number} user_id - ID of the user booking the tickets
//  * @param {number} tickets - Number of tickets booked
//  * @returns {Promise<Object>} - Booking confirmation object
//  */
// function createBooking(event_id, tickets) {
//     return new Promise((resolve) => {
//         // This is a simulated booking until you make a Booking table
//         resolve({
//             booking_id: Math.floor(Math.random() * 100000),
//             event_id,
//            // user_id,
//             tickets,
//             status: "confirmed"
//         });
//     });
// }

// module.exports = {
//     getEventByName,
//     decrementTickets,
//     createBooking
// };


// Here is the code with the added function getEventsBydate, Im pretty sure that is all that changed here

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to shared SQLite database
const dbPath = path.join(__dirname, '../../shared-db/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Connection error with database', err.message);
    } else {
        console.log('Connected to SQLite database (LLM Model).');
    }
});

/**
 * Finds an event by name.
 * @param {string} event_name - The event name to search for
 * @returns {Promise<Object>} - Resolves with event row or null if not found
 */
function getEventByName(event_name) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Event WHERE event_name = ?`;
        db.get(sql, [event_name], (err, row) => {
            if (err) return reject(err);
            resolve(row || null);
        });
    });
}

/**
 * Finds all events on a specific date.
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} - Resolves with an array of event objects
 */
function getEventsByDate(date) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM Event WHERE event_date = ?`;
        db.all(sql, [date], (err, rows) => {
            if (err) return reject(err);
            resolve(rows || []);
        });
    });
}

/**
 * Decrements available tickets for an event.
 * @param {number} event_id - The ID of the event
 * @param {number} tickets - The number of tickets to subtract
 * @returns {Promise<void>} - Resolves when update is done
 */
function decrementTickets(event_id, tickets) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE Event 
            SET event_tickets = event_tickets - ? 
            WHERE event_id = ? AND event_tickets >= ?;
        `;
        db.run(sql, [tickets, event_id, tickets], function (err) {
            if (err) return reject(err);
            if (this.changes === 0) {
                return reject(new Error("Not enough tickets available or event not found."));
            }
            resolve();
        });
    });
}

/**
 * Creates a new booking record (simulated, since no Booking table yet).
 * @param {number} event_id - ID of the event being booked
 * @param {number} tickets - Number of tickets booked
 * @returns {Promise<Object>} - Booking confirmation object
 */
function createBooking(event_id, tickets) {
    return new Promise((resolve) => {
        resolve({
            booking_id: Math.floor(Math.random() * 100000),
            event_id,
            tickets,
            status: "confirmed"
        });
    });
}

module.exports = {
    getEventByName,
    getEventsByDate,
    decrementTickets,
    createBooking
};
