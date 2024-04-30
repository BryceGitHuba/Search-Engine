import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql', // Replace with your actual GraphQL API URI
});

// Middleware for inserting the token in the request headers
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the token from local storage
  const token = localStorage.getItem('id_token');

  // Use the setContext method to set the HTTP headers
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  // Call the next link in the middleware chain
  return forward(operation);
});

// Set up the Apollo Client with the authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Create a router for the React Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <SearchBooks />,
      },
      {
        path: '/saved',
        element: <SavedBooks />,
      },
    ],
  },
]);

// Wrap the application with the ApolloProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>,
);