import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { faker } from '@faker-js/faker'
import UserDetails from '../../components/user-details'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useParams: vi.fn(() => ({ id: '1' })) }
})

const queryClient = new QueryClient()

const generateMockUser = () => ({
  id: faker.number.int(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  image: faker.image.avatar(),
  gender: faker.person.sex(),
  age: faker.number.int({ min: 18, max: 80 }),
  phone: faker.phone.number(),
})

describe('UserDetails Component', () => {
  it('renders loading state initially', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UserDetails />
        </MemoryRouter>
      </QueryClientProvider>
    )
    expect(screen.getByText('Loading user details...')).toBeInTheDocument()
  })

  it('renders user details on successful loading', async () => {
    const mockUser = generateMockUser()
    mockedAxios.get.mockResolvedValueOnce({ data: mockUser })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UserDetails />
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(`${mockUser.firstName} ${mockUser.lastName}`)).toBeInTheDocument()
      expect(screen.getByText(mockUser.email)).toBeInTheDocument()
      expect(screen.getByText(mockUser.gender)).toBeInTheDocument()
      expect(screen.getByText(mockUser.age.toString())).toBeInTheDocument()
      expect(screen.getByText(mockUser.phone)).toBeInTheDocument()
      expect(screen.getByAltText('User Avatar')).toHaveAttribute('src', mockUser.image)
    })
  })

  it('renders error message when API call fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'))

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UserDetails />
        </MemoryRouter>
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Error loading user details.')).toBeInTheDocument()
    })
  })
})
