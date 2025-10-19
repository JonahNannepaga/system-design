# Username Availability System

This project is a frontend application that interacts with an API Gateway to check the availability of usernames and display the health status of the API. It is built using React and TypeScript.

## Project Structure

- **public/**: Contains static files.

  - **index.html**: The main HTML file that serves as the entry point for the application.
  - **favicon.ico**: The favicon for the application.

- **src/**: Contains the source code for the application.
  - **components/**: Contains React components.
    - **UsernameChecker.tsx**: A component for checking username availability.
    - **HealthStatus.tsx**: A component for displaying the health status of the API.
    - **LoadingSpinner.tsx**: A component for showing a loading animation.
  - **services/**: Contains API service functions.
    - **api.ts**: Functions for making API calls to the backend.
  - **types/**: Contains TypeScript interfaces.
    - **index.ts**: Interfaces defining the shape of data used in the application.
  - **styles/**: Contains CSS styles.
    - **App.css**: CSS styles for the application.
  - **App.tsx**: The main React component that sets up the application layout.
  - **index.tsx**: The entry point for the React application.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Running the Application

To start the development server, run:

```
npm start
```

The application will be available at `http://localhost:3005`.

## API Endpoints

- **GET /health**: Returns the health status of the API.
- **POST /username/check**: Checks the availability of a username.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
