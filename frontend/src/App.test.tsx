import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders film chronicle header', () => {
  render(<App />);
  const headerElement = screen.getByText(/The Film Chronicle/i);
  expect(headerElement).toBeInTheDocument();
});
