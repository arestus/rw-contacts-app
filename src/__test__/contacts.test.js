import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Contacts } from "../pages/Contacts";
import { rest } from "msw";
import { server } from "../../src/serverTests";
import userEvent from "@testing-library/user-event";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`contacts get data`, () => {
  test(`loading`, async () => {
    render(<Contacts />);
    const loader = screen.getByTestId("contacts-loader");

    expect(loader).toBeInTheDocument();
    await waitForElementToBeRemoved(loader);
  });

  test(`success`, async () => {
    render(<Contacts />);

    const loader = screen.getByTestId("contacts-loader");

    await waitForElementToBeRemoved(loader);

    expect(loader).not.toBeInTheDocument();
    expect(screen.getByTestId("contacts-table-container")).toBeInTheDocument();
  });

  test(`fail`, async () => {
    server.use(
      rest.get("https://randomuser.me/api/?results=10", (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            error: "Internal server error",
          })
        );
      })
    );
    render(<Contacts />);
    const loader = screen.getByTestId("contacts-loader");

    await waitForElementToBeRemoved(loader);

    expect(loader).not.toBeInTheDocument();
    expect(screen.getByTestId("contacts-error")).toBeInTheDocument();
  });
});

describe(`contacts data view mode`, () => {
  test(`should equal table`, async () => {
    render(<Contacts />);

    const loader = screen.getByTestId("contacts-loader");

    await waitForElementToBeRemoved(loader);

    expect(screen.getByTestId("contacts-table-container")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-data-viewmode-table")).toHaveClass(
      "Mui-selected"
    );
    expect(
      screen.queryByTestId("contacts-grid-container")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("toggle-data-viewmode-grid")).not.toHaveClass(
      "Mui-selected"
    );
  });

  test(`should equal grid`, async () => {
    render(<Contacts />);

    const loader = screen.getByTestId("contacts-loader");

    await waitForElementToBeRemoved(loader);

    const toggleGrid = screen.queryByTestId("toggle-data-viewmode-grid");
    userEvent.click(toggleGrid);

    expect(screen.getByTestId("contacts-grid-container")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-data-viewmode-grid")).toHaveClass(
      "Mui-selected"
    );
    expect(
      screen.queryByTestId("contacts-table-container")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("toggle-data-viewmode-table")).not.toHaveClass(
      "Mui-selected"
    );
  });

  test(`should equal grid with reload page`, async () => {
    window.localStorage.setItem("dataViewMode", "grid");

    render(<Contacts />);

    const loader = screen.getByTestId("contacts-loader");

    await waitForElementToBeRemoved(loader);

    expect(screen.getByTestId("contacts-grid-container")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-data-viewmode-grid")).toHaveClass(
      "Mui-selected"
    );
    expect(
      screen.queryByTestId("contacts-table-container")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("toggle-data-viewmode-table")).not.toHaveClass(
      "Mui-selected"
    );
  });
});
