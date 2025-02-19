import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Navbar from '../../components/navbar';
import { useUserContext } from '../../components/userContent';

vi.mock('../../components/userContent', () => ({
  useUserContext: vi.fn(),
}));

describe('Navbar Component', () => {
  it('renders the navbar correctly', () => {
    const mockDispatch = vi.fn();
(useUserContext as jest.MockedFunction<typeof useUserContext>).mockReturnValue({
  state: { 
    searchQuery: '',
    users: [],
  },
  dispatch: mockDispatch,
});

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/userTesting/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Search for users/i)).toBeDefined();
  });

  it('updates the search query when input changes', () => {
    const mockDispatch = vi.fn();
    (useUserContext as jest.MockedFunction<typeof useUserContext>).mockReturnValue({
      state: { 
        searchQuery: '',
        users: [],
      },
      dispatch: mockDispatch,
    });
    

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search for users/i);
    fireEvent.change(input, { target: { value: 'John' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_SEARCH_QUERY',
      payload: 'John',
    });
  });
});
