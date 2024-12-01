import React, { useEffect, useState } from "react";
import axios from "axios";

const HelloWorld = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error fetching the message!", error);
      });
  }, []);

  return (
    <div>
      <h1>{message || "Loading..."}</h1>
    </div>
  );
};

export default HelloWorld;
