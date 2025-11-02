import { render, screen } from '@testing-library/react';
import App from './App';

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('An update to')) {
      return;
    }
    if (typeof args[0] === 'string' && args[0].includes('inside a test was not wrapped in act')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

test('renders header text', () => {
  render(<App />);
  const headerElement = screen.getByText(/TigerTix Event Tickets/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders AI toggle button', () => {
  render(<App />);
  const toggleButton = screen.getByRole('button', { name: /toggle AI assistant/i });
  expect(toggleButton).toBeInTheDocument();
});

