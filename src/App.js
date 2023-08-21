import React from "react";
import ReactDOM from "react-dom/client";

const Home = () => {
    return (
        <div className="text-oceanic-blue">LJ Connect frontend.</div>
    )
}

// Defining the root of the document
const root = ReactDOM.createRoot(document.getElementById("root"));

// Adding container element to the root, all the content inside the root will be replaced
root.render(<Home />);