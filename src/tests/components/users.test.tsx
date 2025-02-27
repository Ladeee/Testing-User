import axios from 'axios';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { generateUsers } from '../mocks/mockDb';
import Users from '../../components/users';

vi.mock('axios');
const axiosGetSpy = vi.spyOn(axios, 'get');

const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Users Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('initially renders loading state', () => {
    renderWithProviders(<Users />);
    expect(screen.getByText(/Loading users.../i)).toBeInTheDocument();
  });

  it('displays users after fetching sucessfully', async () => {
    axiosGetSpy.mockResolvedValueOnce({
      data: { users: generateUsers(20) }
    });

    renderWithProviders(<Users />);

    await waitFor(() => expect(screen.getByText(/list of users/i)).toBeInTheDocument());
    expect(screen.getAllByText(/user/i).length).toBeGreaterThan(0);

    // Spy
    expect(axiosGetSpy).toHaveBeenCalledTimes(1);
    expect(axiosGetSpy).toHaveBeenCalledWith(expect.any(String));
  });

  it('calls handleUserClick when name or email is clicked', () => {
    const handleUserClick = vi.fn();

    render(<p className="name-email" onClick={handleUserClick}>Test User</p>);

    const userElement = screen.getByText(/test user/i);
    fireEvent.click(userElement);

    expect(handleUserClick).toHaveBeenCalledTimes(1);
  });
});
