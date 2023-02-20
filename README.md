# Book My Seat LLD (Partially)

LIVE - https://book-my-seat-lld.vercel.app/login

This projects is just for practice purpose therefore there is not a lot of features that a usual book shows app has.

### Functional Requirements

- Multiple Seat Booking
- Seat Cancelling

### Non Functionali Requirements

- Responsive seats selection UI
- Implement measures to ensure that the same seat cannot be booked twice

### Solution

- To solve the problem of duplicate booking I am blocking the seat when the user is going to checkout page and resetting the seat to available if user dont pay for the seat (obviously we could reduce the time to 5 mins or something)
- I am rendering the seats UI on the basis of movie configurations dynamically

### Technologies Used

Next.js
Typescript
Tailwindcss
Prisma
Postgresql
