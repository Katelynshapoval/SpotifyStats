import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoggedIn(data.logged_in);
        console.log(data);
      });
  }, []);

  useEffect(() => {
    if (loggedIn === false) {
      navigate("/login");
    }
  }, [loggedIn]);

  if (loggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header className="flex items-center gap-4 bg-surface-base text-white p-3 text-lg">
        <img src="logo.ico" /> Spotify Stats
      </header>
      <main>
        <div className="">Hello, user</div>
      </main>
    </div>
  );
}

export default Home;
