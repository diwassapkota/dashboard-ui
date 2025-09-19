# Integration Notes

This document provides a brief overview of the integration between the Angular frontend and the Spring Boot backend.

## Session Management

Session management is handled using JSON Web Tokens (JWT).

### Token Storage

The JWT is stored in the browser's `localStorage`. This is a simple and common approach, but it has security implications (e.g., vulnerability to XSS attacks). For a production environment, it is recommended to use `HttpOnly` cookies for storing the token.

### Authentication Flow

1.  The user enters their credentials on the login page.
2.  The `AuthService` sends a POST request to the `/api/auth/login` endpoint.
3.  If the credentials are valid, the backend returns a JWT.
4.  The `AuthService` stores the token in `localStorage`.
5.  The user is redirected to the dashboard.

### Authenticated Requests

For every subsequent request to a protected endpoint, the `TokenInterceptor` adds the JWT to the `Authorization` header.

`Authorization: Bearer <your_jwt_token>`

### Session Expiry

The `TokenInterceptor` also handles session expiry. If the backend returns a 401 Unauthorized response, the interceptor removes the token from `localStorage` and redirects the user to the login page.

## Extending Integration for Future APIs

To integrate a new API, follow these steps:

1.  **Add the API endpoint to the `API_SPECIFICATION.md` file.** This is important for keeping the documentation up-to-date.
2.  **Create a new service or update an existing one.** Create a new method in the service to call the new API endpoint. Use the `ApiService` for making the actual HTTP request.
3.  **Update the component.** Inject the service into the component and call the new method.
4.  **Update the template.** Display the data returned from the API in the template.
5.  **Add a route guard if necessary.** If the new API is for a new page, make sure to protect the route with the `AuthGuard`.
6.  **Add tests.** It is recommended to add unit tests for the new functionality.
