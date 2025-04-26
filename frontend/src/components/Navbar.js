// src/components/Navbar.js
import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Menu pointing secondary style={{ justifyContent: "flex-end" }}>
      <Menu.Item as={Link} to="/" name="Home" />
      <Menu.Item as={Link} to="/analyze" name="Analyze" />
      <Menu.Item as={Link} to="/info" name="Info" />
      <Menu.Item as={Link} to="/contact" name="Contact Us" />
    </Menu>
  );
};

export default Navbar;
