import { createServerFn } from '@tanstack/react-start'
import { picard } from './picard.server'
import { componentMarkup, type ComponentRef } from './markup'

const names = /^[\w@./-]+$/

/**
 * Renders a component of a micro frontend on the server. Server functions are
 * public endpoints, so only a component reference is accepted - never markup,
 * which could make the server load code from any URL.
 */
export const renderComponent = createServerFn({ method: 'GET' })
  .validator((ref: ComponentRef) => {
    if (!names.test(ref.name) || !names.test(ref.source) || ref.source.includes('//')) {
      throw new Error('Invalid component reference.')
    }

    return ref
  })
  .handler(({ data }) => picard.decorate(componentMarkup(data)))

/**
 * Renders a part of Picard.js: the styles or the state with the islands script.
 */
export const renderPart = createServerFn({ method: 'GET' })
  .validator((name: 'style' | 'script') => {
    if (name !== 'style' && name !== 'script') {
      throw new Error('Invalid part.')
    }

    return name
  })
  .handler(({ data: name }) => picard.decorate(`<pi-part name="${name}"></pi-part>`))
