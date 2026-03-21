import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoggedIn(data.logged_in);
        if (!data.logged_in) {
          navigate("/login");
        }
      });
  }, []);
  return (
    <div>
      <p>home</p>
    </div>
  );
}

export default Home;
