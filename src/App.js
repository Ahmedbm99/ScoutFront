import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { routes } from './routes';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // ou autre thème
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
const App = () => (
  <PrimeReactProvider>
  <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
            exact={route.exact || false}
          />
        ))}
      </Routes>
    </Router>
    </PrimeReactProvider>
);

export default App;