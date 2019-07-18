import { HeadingData, HeadingsObject } from '../interfaces'

export function getHeading(_level: number, _lines: string[]) {
  if (_level <= 0 || _level >= 6) {
    throw new Error('Heading level must be between 1 and 6')
  }
  let result: HeadingData[] = []
  const lines: string[] = _lines
  let query: RegExp = new RegExp(`^#{${_level}}\s.+`)

  for(let l = 0; l < lines.length; ++l) {
    const line: string = lines[l]
    let queryReturn: RegExpExecArray = query.exec(line)
    const isHeaderLine: boolean = queryReturn !== null
    // if line matches heading query, create a new HeadingData object and push it to the return array
    if (isHeaderLine) {
      let heading: HeadingData = {
        text: line,
        level: _level,
        line: l
      }
      result.push(heading)
    }
  }

  return result
}

export function getHeadings(_lines: string[]): HeadingsObject {
  const lines = _lines
  let headings = {}
  for(let i = 1; i <= 6; ++i) {
    const level = `h${i}`
    headings[level] = getHeading(i, lines)
  }
  return headings
}