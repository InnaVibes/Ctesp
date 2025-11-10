import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/PWA/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders login and register navigation links', () => {
  render(<App />);
  // ✅ Usa 'link' para diferenciar do botão
  expect(screen.getByRole('link', { name: /Login/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Register/i })).toBeInTheDocument();
});

test('renders QR login button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /Login with Qr Code/i })).toBeInTheDocument();
});