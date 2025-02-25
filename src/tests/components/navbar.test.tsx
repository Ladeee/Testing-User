import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, createMemoryRouter, RouterProvider } from 'react-router-dom';
import Navbar from '../../components/navbar';

describe('Navbar Component', () => {
  it('renders the navbar correctly', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/userTesting/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Search for users/i)).toBeDefined();
  });

  it('updates the URL query when input changes', () => {
    const router = createMemoryRouter(
      [{ path: '/', element: <Navbar /> }],
      { initialEntries: ['/'] }
    );

    render(<RouterProvider router={router} />);

    const input = screen.getByPlaceholderText(/Search for users/i);
    
    fireEvent.change(input, { target: { value: 'John' } });

    expect(router.state.location.search).toBe('?search=John');
  });

  it('clears the search query from the URL when input is empty', () => {
    const router = createMemoryRouter(
      [{ path: '/', element: <Navbar /> }],
      { initialEntries: ['/?search=John'] } // Start with a search query
    );

    render(<RouterProvider router={router} />);

    const input = screen.getByPlaceholderText(/Search for users/i);
    
    fireEvent.change(input, { target: { value: '' } });

    expect(router.state.location.search).toBe('');
  });
});
