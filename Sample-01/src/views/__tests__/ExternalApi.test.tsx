import React from 'react'
import { ExternalApiComponent } from '../ExternalApi'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
//import '@testing-library/jest-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { getConfig } from '../../config'

import createFetchMock from 'vitest-fetch-mock'

const fetchMocker = createFetchMock(vi)
fetchMocker.enableMocks()

//vi.mock("../../config");
//vi.mock("@auth0/auth0-react");

describe('The ExternalApi component', () => {
  beforeEach(() => {
    fetchMocker.resetMocks()

    vi.mock('../../config', () => {
      return {
        domain: 'test-domain.com',
        clientId: '123',
        apiOrigin: 'http://localhost:3001',
        audience: 'test-audience',
      }
    })
    getConfig.mockReturnValue({
      domain: 'test-domain.com',
      clientId: '123',
      apiOrigin: 'http://localhost:3001',
      audience: 'test-audience',
    })

    vi.mock('@auth0/auth0-react', () => ({
      isLoading: false,
      isAuthenticated: true,
      getAccessTokenSilently: vi.fn(() => Promise.resolve('access-token')),
      withAuthenticationRequired: vi.fn(),
    }))
    // useAuth0.mockReturnValue({
    //   isLoading: false,
    //   isAuthenticated: true,
    //   getAccessTokenSilently: vi.fn(() => Promise.resolve("access-token")),
    //   withAuthenticationRequired: vi.fn(),
    // });
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders', () => {
    render(<ExternalApiComponent />)
  })

  it('makes a call to the API when the button is clicked', async () => {
    fetchMocker.mockResponseOnce(JSON.stringify({ msg: 'This is the API result' }))

    render(<ExternalApiComponent />)
    fireEvent.click(screen.getByText('Ping API'))

    await waitFor(() => screen.getByTestId('api-result'))

    expect(await screen.findByText(/This is the API result/)).toBeInTheDocument()
  })

  it('shows the warning content when there is no audience', async () => {
    vi.mock('../../config', () => {
      return {
        domain: 'test-domain.com',
        clientId: '123',
        apiOrigin: 'http://localhost:3001',
      }
    })

    render(<ExternalApiComponent />)

    expect(await screen.findByText(/You can't call the API at the moment/)).toBeInTheDocument()
  })
})
