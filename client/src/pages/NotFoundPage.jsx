// client/src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return(
        <div className="min-h-screen flex items-center justify-center bg-white text-center p-6"> 
            <div> 
                <h1 className="text-4xl font-bold text-red-500">404</h1> 
                <p className="text-gray-600 mb-4">Page not found</p> 
                <Link to="/" className="text-blue-600 hover:underline">Go to Home</Link> 
            </div> 
        </div> 
    );
};
export default NotFound;