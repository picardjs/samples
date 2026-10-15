export interface ComponentRef {
  /**
   * The name of the component.
   */
  name: string
  /**
   * The name of the micro frontend (in the feed) exposing the component.
   */
  source: string
  /**
   * The data to pass to the component.
   */
  data?: Record<string, unknown>
}

function escapeAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/**
 * Creates the markup of a pi-component element.
 */
export function componentMarkup({ name, source, data }: ComponentRef, server?: 'none') {
  const attributes = [
    `name="${escapeAttribute(name)}"`,
    `source="${escapeAttribute(source)}"`,
    data !== undefined && `data="${escapeAttribute(JSON.stringify(data))}"`,
    server && `server="${server}"`,
  ].filter(Boolean)
  return `<pi-component ${attributes.join(' ')}></pi-component>`
}
