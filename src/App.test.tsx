import React from "react";
import '@testing-library/jest-dom/extend-expect';
import { v4 as uuid } from "uuid";
import { render, fireEvent } from '@testing-library/react';
import { Todo } from "./interface";
import { TodoItem } from "./components/TodoItem";
import App from "./App";

// initialData
const todoListItem: Todo = {
  id: uuid(),
  label: "Test todo item",
  checked: false // false by defaultgit push -u origin main
};

describe("App", () => {
  describe("Toggle Checked State", () => {
    it("should toggle checked state when a todo item is clicked on checkbox", () => {

      // render todo list
      let { container } = render(<TodoItem {...todoListItem} index={0} onChange={() => { }} />);

      // find checkbox
      const itemCheckbox: HTMLInputElement = container.querySelector(`#todo-item-0 > input`);
      const itemLabel: HTMLSpanElement = container.querySelector(`#todo-item-0`);

      // check todo item
      fireEvent.click(itemLabel);
      expect(itemCheckbox).toBeChecked();

      // uncheck todo item
      fireEvent.click(itemLabel);
      expect(itemCheckbox).not.toBeChecked();

    });
  });

  describe("Persist State", () => {
    it("should save todo list state to local storage", () => {
      const { container } = render(<App />);

      const todoInput: HTMLInputElement = container.querySelector("#todo-input");
      fireEvent.change(todoInput, { value: todoListItem.label });

      fireEvent.keyPress(todoInput, { key: "Enter", code: 13, charCode: 13 })

      // check todo-list in local storage
      let listFromLocalStorage = localStorage.getItem('todo-list');

      // If no list is found, initialize it as an empty array
      if (!listFromLocalStorage) {
        listFromLocalStorage = JSON.stringify([]);
        localStorage.setItem('todo-list', listFromLocalStorage);
      }

      // Parse the list
      const parsedList = JSON.parse(listFromLocalStorage);

      // Ensure the list is defined and an array
      expect(Array.isArray(parsedList)).toBe(true);

      // Check that the parsed list contains the expected object
      expect(parsedList).toContainEqual(
        expect.objectContaining({ label: todoListItem.label })
      );
    });

    it("should load todo list state from local storage", () => {

      localStorage.removeItem('todo-list');

      localStorage.setItem('todo-list', JSON.stringify([{ ...todoListItem }]));

      const { container } = render(<App />);

      const checkBoxItem = container.querySelectorAll(`label > span`);

      checkBoxItem.forEach((item) => {
        expect(item).toHaveTextContent(todoListItem.label);
      });

    });
  });

  describe("Auto-Sink Checked Items", () => {
    it("should move checked items to the bottom of the list", () => {
      const { container } = render(<App />);

      const todoInput: HTMLInputElement = container.querySelector("#todo-input");

      fireEvent.change(todoInput, { value: todoListItem.label });
      fireEvent.keyPress(todoInput, { key: "Enter", code: 13, charCode: 13 });

      // find added todo item and clicked it
      // find checkbox
      const testTodoItem = container.querySelectorAll(`ul > label > input[type="checkbox"]`);
      fireEvent.click(testTodoItem[0]);

      // get all list items
      const listItems = container.querySelectorAll(`label > span`);

      let lastItemOnList = listItems[listItems.length - 1];

      expect(lastItemOnList).toHaveTextContent(todoListItem.label);

    });
  });
});
