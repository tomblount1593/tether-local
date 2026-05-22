import fs from "node:fs";

const interestedPath = "src/pages/InterestedInYou.jsx";
const bookingPath = "src/pages/DateBooking.jsx";
const helperPath = "src/data/demo/demoDateBookingState.js";

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  }
}

const interested = read(interestedPath);
const booking = read(bookingPath);
const helper = read(helperPath);

assert(/data-testid="interested-date-modal"/.test(interested), "modal test id missing");
assert(/data-testid="interested-date-modal-click-to-book"/.test(interested), "book CTA test id missing");
assert(/Click to Book Date/.test(interested), "CTA label must be exact");
assert(/data-testid="interested-date-modal-user-photo"/.test(interested), "user photo test id missing");
assert(/data-testid="interested-date-modal-match-photo"/.test(interested), "match photo test id missing");
assert(/role="dialog"/.test(interested) && /aria-modal="true"/.test(interested), "dialog a11y attributes missing");
assert(/navigate\(`\/book-date\/\$\{selectedInterestedMatch\.id\}\?source=interested-in-you`/.test(interested), "book route navigation missing");
assert(/setPendingDateBooking\(/.test(interested), "pending booking state not persisted");
assert(!/Apto/i.test(interested), "Apto reference found in interested modal source");

assert(/data-testid="date-booking-page"/.test(booking), "date booking page test id missing");
assert(/data-testid="date-booking-selected-match"/.test(booking), "selected match test id missing");
assert(/data-testid="date-booking-time-options"/.test(booking), "time options test id missing");
assert(/data-testid="date-booking-location-options"/.test(booking), "location options test id missing");

assert(/setPendingDateBooking/.test(helper), "helper missing setPendingDateBooking");
assert(/getPendingDateBooking/.test(helper), "helper missing getPendingDateBooking");
assert(/clearPendingDateBooking/.test(helper), "helper missing clearPendingDateBooking");

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("qa-interested-date-modal: pass");
