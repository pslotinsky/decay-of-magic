import { Link } from "react-router";

import { Page } from "../../components/Page";

export const HomePage = () => {
  return (
    <Page>
      <h1>Home page</h1>
      <ul>
        <li>
          <Link to="/card">Cards</Link>
        </li>
        <li>
          <Link to="/mana">Mana</Link>
        </li>
      </ul>
    </Page>
  );
};
