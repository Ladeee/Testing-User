import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Users from '../../components/users';
import { generateUsers } from '../mocks/mockDb';
import axios from 'axios';

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
    expect(screen.getByText(/loading users/i)).toBeDefined(); 
  });

  it('displays users after fetching', async () => {
    renderWithProviders(<Users />);
    await waitFor(() => expect(screen.getByText(/list of users/i)).toBeDefined());
    expect(screen.getAllByText(/user/i).length).toBeGreaterThan(0);
  });

  it('renders error state if API request fails', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    renderWithProviders(<Users />);
    
    await waitFor(() => expect(screen.getByText(/error loading users/i)).toBeDefined());
  });
});