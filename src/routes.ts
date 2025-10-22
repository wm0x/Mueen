//export mean we can invoke this method from any ware in my app

/**
 * An array of routes that are accessible to the public
 * These route do not require authentication
 * @type {string[]}
 */

export const publicRoutes = ["/" , "/auth/login"];

/**
 * An array of routes that are use for authentication
 * These route will redirect logged in users to / setting
 * @type {string[]}
 */

export const authRoutes = ["/auth/login"];

/**
 * This prefix for API authentication route
 * Routes that start with this prefix are used for API authentication
 * @type {string}
 */

export const apiAuthPrefix = ["/api/auth"];

/**
 * The default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/dashboard/main"; // you can change it to dashboard or any thing else settings 