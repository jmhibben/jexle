import { concat, sortBy } from 'lodash'
import { HeadingsObject, HeadingData } from '../interfaces'

export function sortHeadings(_headings: HeadingsObject): HeadingData[] {
  // sort headings by line number, and return an ordered array of all headings
  const _h: HeadingsObject = _headings
  let headings: HeadingData[] = concat(_h['h1'], _h['h2'], _h['h3'], _h['h4'], _h['h5'], _h['h6'])

  let r: HeadingData[] = sortBy(headings, (l) => { return l.line })

  return r
}