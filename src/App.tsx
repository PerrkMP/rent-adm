import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Users from './pages/Users';
import {Layout} from "./layout";
import SignIn from "./pages/SignIn";
import Category from "./pages/Category";
import Products from "./pages/Products";
import Teams from "./pages/Teams";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        {(setIsLoading) => (
          <Routes>
            <Route path="/" element={<Home setIsLoading={setIsLoading} />} />
            <Route path="/users" element={<Users setIsLoading={setIsLoading} />} />
            <Route path="/teams" element={<Teams setIsLoading={setIsLoading} />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/category" element={<Category setIsLoading={setIsLoading} />} />
            <Route path="/products" element={<Products setIsLoading={setIsLoading} />} />
            {/*<Route path="*" element={<NotFound />} />*/}
          </Routes>
        )}
      </Layout>
    </Router>
  );
};

export default App;