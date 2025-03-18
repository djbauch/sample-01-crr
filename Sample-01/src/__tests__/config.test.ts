import { describe, afterEach, it, expect, vi } from 'vitest'
//import { useAuth0 } from '@auth0/auth0-react'
import { getConfig } from '../config'

import createFetchMock from 'vitest-fetch-mock'
const fetchMocker = createFetchMock(vi)

// Set globalThis.fetch and globalThis.fetchMock to our mocked version
fetchMocker.enableMocks()

const mockConfig = (config?: Partial<unknown> | undefined) => {
  // doMock is not hoisted to the top, which means we can mock the module
  // on a per-test basis. Jest does not return mock objects
  // for these types of static file modules.
  vi.doMock('../auth_config.json', () => ({
    domain: 'test-domain.com',
    clientId: '123',
    ...config,
  }))
}

describe.skip('The config module', () => {
  afterEach(() => {
    vi.resetModules()
  })

  it('should omit the audience if not in the config json', () => {
    mockConfig()

    expect(getConfig().audience).not.toBeDefined()
  })

  it('should omit the audience if left at a default value', () => {
    mockConfig({ audience: '{yourApiIdentifier}' })

    expect(getConfig().audience).not.toBeDefined()
  })

  it('should return the audience if specified', () => {
    mockConfig({ audience: 'test-api' })

    expect(getConfig().audience).toEqual('test-api')
  })
})
