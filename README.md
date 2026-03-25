# Asknbn UI Demo

This project is a full-stack LLM chatbot management studio built with React (Vite) and Node.js. It features a dual-mode interface (User and Studio), a chatbot catalog, and an agent builder.

## Prerequisites

- Node.js installed on your machine

## Project Structure

- `frontend/`: React application using Vite.
- `backend/`: Node.js Express server.

## Getting Started Locally

To run this project locally, you will need to start both the backend server and the frontend development server.

### 1. Start the Backend Server

Open a terminal and run the following commands:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the Node.js server
npm start
```
The backend server will typically run on `http://localhost:5000` (or another port defined in your environment/server.js).

### 2. Start the Frontend Development Server

Open a separate terminal window and run the following commands:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend application will be accessible at the URL provided in the terminal output (usually `http://localhost:5173`).

## Usage

Once both servers are running, open your browser and navigate to the frontend URL to access the LLM Chatbot Studio interface.
