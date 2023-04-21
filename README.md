# Interview Scheduler
Interview Scheduler is a single-page app where users can view a schedule of appointments/interviews, and can add, cancel, or edit them. Interviews can be made between 12-5pm, Mon - Fri.
The front end was built with React and uses the WebSocket API to make persistent real-time updates between multiple users.
This project developed helped develop skills in StoryBook (for building UI components), and integration (Jest) and E2E testing (Cypress).

## Features 
Schedule an Interview

!['Schedule an Interview'](https://github.com/schmmv/scheduler/blob/master/docs/Add_Interview.gif?raw=true)

Edit an Interview

!['Edit an Interview'](https://github.com/schmmv/scheduler/blob/master/docs/Edit_Appointment.gif?raw=true)

Delete an Interview

!['Delete an Interview'](https://github.com/schmmv/scheduler/blob/master/docs/Delete_Appointment.gif?raw=true)

## Setup
Requires the [scheduler api](https://github.com/schmmv/scheduler-api)  backend in order to fetch and store appointment data from a database (*follow its README instructions*)

Install dependencies with `npm install`.

### Dependencies
- Axios
- React Testing Library
- react-test-renderer
- jest-websocket-mock
- prop-types
- StoryBook
- Jest
- Sass

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
