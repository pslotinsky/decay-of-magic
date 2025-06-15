import { Link } from "react-router";

export const HomePage = () => {
  return (
    <div>
      <h1>Home page</h1>
      <ul>
        <li>
          <Link to="/card">Cards</Link>
        </li>
        <li>
          <Link to="/mana">Mana</Link>
        </li>
      </ul>
    </div>
  );
};
