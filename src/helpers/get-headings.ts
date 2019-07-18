import { getHeading } from '.'
import { HeadingsObject } from '../interfaces'

export function getHeadings(_lines: string[]): HeadingsObject {
    const lines = _lines
    let headings = {}
    for(let i = 1; i <= 6; ++i) {
      const level = `h${i}`
      headings[level] = getHeading(i, lines)
    }
    return headings
  }