import { render, screen, fireEvent } from '@testing-library/react'
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
  useSearchParams,
} from 'react-router-dom'
import Navbar from '../../components/navbar'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return {
    ...actual,
    useSearchParams: vi.fn(),
  }
})

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), vi.fn()])
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the navbar correctly', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )

    expect(screen.getByText(/userTesting/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search for users/i)).toBeInTheDocument()
  })

  it('renders the navbar correctly with logo and search input', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )
    expect(screen.getByText(/userTesting/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search for users/i)).toBeInTheDocument()
    
    const searchInput = screen.getByPlaceholderText(/Search for users/i)
    expect(searchInput).toBeInTheDocument()
    expect(searchInput).toHaveAttribute('type', 'text')
  })

  it('updates the URL query when input changes and spies on setSearchParams', () => {
    const setSearchParamsMock = vi.fn()
    const mockSearchParams = new URLSearchParams()

    vi.mocked(useSearchParams).mockReturnValue([
      mockSearchParams,
      setSearchParamsMock,
    ])

    const router = createMemoryRouter([{ path: '/', element: <Navbar /> }], {
      initialEntries: ['/'],
    })

    render(<RouterProvider router={router} />)

    const input = screen.getByPlaceholderText(/Search for users/i)
    fireEvent.change(input, { target: { value: 'John' } })

    expect(setSearchParamsMock).toHaveBeenCalledTimes(1)
    expect(setSearchParamsMock).toHaveBeenCalledWith(
      expect.any(URLSearchParams),
    )
  })

  it('clears the search query from the URL when input is empty and spies on setSearchParams', () => {
    const setSearchParamsMock = vi.fn()
    const mockSearchParams = new URLSearchParams('search=John')

    vi.mocked(useSearchParams).mockReturnValue([
      mockSearchParams,
      setSearchParamsMock,
    ])

    const router = createMemoryRouter([{ path: '/', element: <Navbar /> }], {
      initialEntries: ['/?search=John'],
    })

    render(<RouterProvider router={router} />)

    const input = screen.getByPlaceholderText(/Search for users/i)
    fireEvent.change(input, { target: { value: '' } })

    expect(setSearchParamsMock).toHaveBeenCalledTimes(1)
    expect(setSearchParamsMock).toHaveBeenCalledWith(
      expect.any(URLSearchParams),
    )
  })
})
