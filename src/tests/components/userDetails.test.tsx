import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import UserDetails from '../../components/user-details';
import {vi, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { db } from '../mocks/mockDb';
import '@testing-library/jest-dom';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

describe('UserDetails Component', () => {
  it('renders user details when user data is available', () => {
    const user = db.user.create({});

    (useLocation as jest.Mock).mockReturnValue({
      state: { user },
    });

    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/User Details/i)).toBeDefined();
    expect(screen.getByText(new RegExp(`Full name: ${user.firstName} ${user.lastName}`, 'i'))).toBeDefined();
    expect(screen.getByText(new RegExp(`Email: ${user.email}`, 'i'))).toBeDefined();
    expect(screen.getByText(new RegExp(`Gender: ${user.gender}`, 'i'))).toBeDefined();
    expect(screen.getByText(new RegExp(`Age: ${user.age}`, 'i'))).toBeDefined();
    expect(screen.getByText(new RegExp(`Phone number: ${user.phone}`, 'i'))).toBeDefined();
    expect(screen.getByAltText(/User Avatar/i)).toHaveAttribute('src', user.image);
  });

  it('renders "No user data found" when user data is not available', () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: null,
    });

    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/No user data found./i)).toBeDefined();
  });

  it('renders "No user data found" when location.state is undefined', () => {
    (useLocation as jest.Mock).mockReturnValue({});

    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/No user data found./i)).toBeDefined();
  });

  it('renders "No user data found" when location.state.user is undefined', () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: {},
    });

    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/No user data found./i)).toBeDefined();
  });

  it('renders the correct image source', () => {
    const user = db.user.create({});

    (useLocation as jest.Mock).mockReturnValue({
      state: { user },
    });

    render(
      <MemoryRouter>
        <UserDetails />
      </MemoryRouter>
    );

    const imageElement = screen.getByAltText(/User Avatar/i);
    expect(imageElement).toHaveAttribute('src', user.image);
  });
});
