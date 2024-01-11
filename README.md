# Tech Task

## Technology Stack

RESTful API leverages the following technologies:
- Backend: Nest.js, a powerful and scalable Node.js framework written  
  in TypeScript, provides a solid foundation for building the      
  application's server-side logic.

- Database: MongoDB, a flexible and scalable NoSQL database,   
  efficiently stores and manages the application's data.
# How to run

1. Go to backend folder.
2. Install packages:
```bash
npm install
```
3. Run mongoDB via docker-compose.yml:
```bash
docker-compose up -d
```
4. Run NestJS
```bash
npm run start
```

The API will be up and running, and you can access it at http://localhost:7777/api by default.

# Swagger Documentation

The API is equipped with Swagger documentation, making it easy to explore and test the available endpoints. After running the project, you can access the Swagger UI at http://localhost:7777/api/docs

# API Endpoints

Here is a brief overview of the available API endpoints:
1. **FavourController (api/favour):**
  - `GET /favour/get/:id`: Get favour by ID
  - `GET /favour/get`: Get all favours
  - `POST /favour/create`: Create a new favour
  - `PUT /favour/edit`: Edit favour
  - `DELETE /favour/delete/:id`: Delete favour by ID
  - `DELETE /favour/delete`: Delete all favours

2. **PositionController (api/position):**
  - `GET /position/get/:id`: Get position by ID
  - `GET /position/get`: Get all positions
  - `POST /position/create`: Create a new position
  - `PUT /position/edit`: Edit position
  - `DELETE /position/delete/:id`: Delete position by ID
  - `DELETE /position/delete`: Delete all positions

3. **ProjectController (api/project):**
  - `GET /project/get/:id`: Get project by ID
  - `GET /project/get`: Get all projects
  - `POST /project/create`: Create a new project
  - `PUT /project/edit`: Edit project
  - `DELETE /project/delete/:id`: Delete project by ID
  - `DELETE /project/delete`: Delete all projects

4. **EmployeeController (api/employee):**
  - `GET /employee/get/:id`: Get employee by ID
  - `GET /employee/get`: Get all employees
  - `POST /employee/create`: Create a new employee
  - `PUT /employee/edit`: Edit employee
  - `DELETE /employee/delete/:id`: Delete employee by ID
  - `DELETE /employee/delete`: Delete all employees

5. **ApplicationController (api/application):**
  - `POST /application/create`: Create a new application