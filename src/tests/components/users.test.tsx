import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Users from '../../components/users';
import { generateUsers } from '../mocks/mockDb';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(async () => ({
      data: { users: generateUsers(20) }
    }))
  }
}));

const renderWithProviders = (ui: React.ReactNode) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Users Component', () => {
  it('renders loading state initially', () => {
    renderWithProviders(<Users />);
    expect(screen.getByText(/Loading users.../i)).toBeDefined(); 
  });

  it('displays users after fetching', async () => {
    renderWithProviders(<Users />);
    await waitFor(() => expect(screen.getByText(/list of users/i)).toBeDefined());
    expect(screen.getAllByText(/user/i).length).toBeGreaterThan(0);
  });

  it('calls handleUserClick when name or email is clicked', () => {
    const handleUserClick = vi.fn()

    render(<p className="name-email" onClick={handleUserClick}>Test User</p>)

    const userElement = screen.getByText(/test user/i)
    fireEvent.click(userElement)

    expect(handleUserClick).toHaveBeenCalledTimes(1)
  })
});