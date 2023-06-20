# Library Management System

The Library Management System is a web application designed to efficiently manage the operations of a library.

## Features

- Secure authentication and session management to ensure the privacy and security of user data.
- Admin Dashboard: Allows administrators to add books, manage book requests, and handle new admin requests.
- User Dashboard: Enables users to search for books, request books, return books, and manage their requests.

## Tech Stack

**Client:** EJS

**Server:** Node.js, Express, MySQL

## Installation

1. Clone the repository: `git clone https://github.com/lakshyashishir/Library-Management-System.git`.
2. Install dependencies: `npm install`.
3. Create a `.env` file using the provided `env.example` as a guide, and add the required environment variables.
4. Create a MySQL database using the `check.sql` file.
5. Run the development server: `node app.js` or `nodemon app.js`.

## Environment Variables

To run this project, you will need to set the following environment variables in your `.env` file. Refer to the `env.example` file for guidance.

- `mysqlUsername`: MySQL database username
- `mysqlPassword`: MySQL database password
- `MYSQL_HOST`: MySQL host address
- `MYSQL_PORT`: MySQL port number

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Create an account and log in to the system.
3. Once an admin has signed up, all other admins must request admin access from existing admins.
4. Users and admins have separate dashboards with different functionalities.
5. Users can search for books, request books, and return books. They can also view the status of their requests.
6. Admins can approve or reject book requests from users and handle admin signup requests. They can also view the list of issued books and add new books to the system.

## Feedback

If you have any feedback or suggestions, please reach out to me at lakshyashishir1@gmail.com. 
