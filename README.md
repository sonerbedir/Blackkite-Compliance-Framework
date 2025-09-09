# BlackKite Compliance Framework

This project is a web application developed for the BlackKite compliance framework.

## Requirements

- Node.js version 20 or higher is required.

## Installation and Running

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Fake Database

Before running the project, navigate to the project's root directory and start the fake database:

```bash
json-server src/data/db.json
```

### 3. Run the Project

Open a new terminal window and start the project:

```bash
npm run dev
```

### 4. Access the Application

After the project runs successfully, you can access the application at the following address:

```
http://localhost:4000
```

## Notes

- Both the fake database (json-server) and the application must run simultaneously
- Database runs on port 3000 by default
- Application runs on port 4000
