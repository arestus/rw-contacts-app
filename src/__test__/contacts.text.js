import React from "react";
import { render, screen } from "@testing-library/react";
import { Contacts } from "../pages/Contacts";

test("contacts get data success", () => {
  render(<Contacts />);
  screen.debug();
});
