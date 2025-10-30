// import React, { useState } from 'react';
// import './llm.css';

// function LLMBooking() {
//   const [inputText, setInputText] = useState('');
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [confirming, setConfirming] = useState(false);

//   const handleInputChange = (e) => {
//     setInputText(e.target.value);
//   };

//   const handleParseBooking = async () => {
//     setLoading(true);
//     setError('');
//     setResponse(null);

//     try {
//       const res = await fetch('http://localhost:7001/api/llm/parse', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: inputText }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.error || 'Something went wrong');
//       } else {
//         setResponse(data);
//       }
//     } catch (err) {
//       setError('Server error: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmBooking = async () => {
//     if (!response || !response.event || !response.tickets) return;

//     setLoading(true);
//     setError('');
//     setConfirming(true);

//     try {
//       const res = await fetch('http://localhost:7001/api/llm/confirm', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ event: response.event, tickets: response.tickets }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setError(data.error || 'Booking failed');
//       } else {
//         setResponse({ ...response, bookingConfirmed: true, booking: data.booking });
//       }
//     } catch (err) {
//       setError('Server error: ' + err.message);
//     } finally {
//       setLoading(false);
//       setConfirming(false);
//     }
//   };

//   return (
//     <div className="llm-container">
//       <h2>LLM Ticket Assistant</h2>
//       <textarea
//         aria-label="Enter your ticket request"
//         placeholder='e.g., "Book 2 tickets for Jazz Night" or "Show events on 2025-11-01"'
//         value={inputText}
//         onChange={handleInputChange}
//       />

//       <button
//         onClick={handleParseBooking}
//         disabled={loading}
//         aria-disabled={loading}
//         aria-label="Parse booking request"
//       >
//         {loading ? 'Processing...' : 'Ask AI'}
//       </button>

//       {error && <div className="llm-error" role="alert">{error}</div>}

//       {response && !response.bookingConfirmed && (
//         <div className="llm-response">
//           <p>{response.message || `Proposed booking: ${response.tickets} ticket(s) for "${response.event}"`}</p>
//           <button
//             onClick={handleConfirmBooking}
//             disabled={confirming}
//             aria-disabled={confirming}
//             aria-label="Confirm booking"
//           >
//             {confirming ? 'Confirming...' : 'Confirm Booking'}
//           </button>
//         </div>
//       )}

//       {response && response.bookingConfirmed && (
//         <div className="llm-confirmation">
//           <p>Booking confirmed! 🎉</p>
//           <p>Booking ID: {response.booking.booking_id}</p>
//           <p>Event: {response.booking.event_id}</p>
//           <p>Tickets: {response.booking.tickets}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default LLMBooking;
