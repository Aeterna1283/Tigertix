const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Get event details by name
function getEventByName(eventName) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM events WHERE event_name = ?',
            [eventName],
            (err, row) => {
                if (err) return reject(err);
                resolve(row); // null if not found
            }
        );
    });
}

// Book tickets safely using a transaction
function bookTicketsTransaction(eventName, tickets) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            db.get(
                'SELECT tickets_available FROM events WHERE event_name = ?',
                [eventName],
                (err, row) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return reject(err);
                    }

                    if (!row) {
                        db.run('ROLLBACK');
                        return resolve({ success: false, message: `Event "${eventName}" not found` });
                    }

                    if (row.tickets_available < tickets) {
                        db.run('ROLLBACK');
                        return resolve({ success: false, message: `Not enough tickets available` });
                    }

                    const newTickets = row.tickets_available - tickets;

                    db.run(
                        'UPDATE events SET tickets_available = ? WHERE event_name = ?',
                        [newTickets, eventName],
                        function(err) {
                            if (err) {
                                db.run('ROLLBACK');
                                return reject(err);
                            }

                            db.run('COMMIT');
                            resolve({ 
                                success: true, 
                                booking: { event: eventName, tickets } 
                            });
                        }
                    );
                }
            );
        });
    });
}

module.exports = { getEventByName, bookTicketsTransaction };
