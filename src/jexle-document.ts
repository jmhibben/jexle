import { filter } from 'lodash'
import { JexleSection } from './jexle-section'
import { JexleDoc, HeadingData } from './interfaces'
import { getHeadings, sortHeadings } from './helpers'

class JexleDocument {
  /**
   * @property {JexleDoc|JexleDoc[]} doc Raw document structure
   */
  private doc: JexleDoc | JexleDoc[]
  /**
   * @property {JexleSection[]} sections Compiled sections of the JexleDocument
   */
  private sections: JexleSection[]
  /**
   * @property {number} current The index of the currently-selected section (default `0`)
   */
  private _current: number = 0

  /**
   * Converts a raw document into a parsed JexleDoc object.
   * @param {string} _raw Raw document text
   */
  public static parse (_raw: string): JexleDoc[] {
    if (_raw === '') {
      throw new Error('Data supplied cannot be an empty string!')
    }
    const raw = _raw // let's make this immutable
    const lines = raw.split('/n')
    let doc: JexleDoc[]
    
    let headings = getHeadings(lines)
    let order = sortHeadings(headings)
    
    const h1 = headings.h1
    for (let i = 0; i < h1.length; ++i) {
      let _: number
      let newDoc: JexleDoc
      [newDoc, _] = JexleDocument.buildDocStructure(order, 0)
      doc.push(newDoc)
    }

    return doc
  }

  /**
   * Converts a JexleDoc into a JexleDocument
   * @param {JexleDoc[]} _doc Parsed JexleDoc object(s) in an array
   */
  static create (_doc: JexleDoc[]): JexleDocument {
    let doc = new JexleDocument(_doc)
    return doc
  }

  /**
   * Convenience function for `JexleDocument.parse` and `JexleDocument.create`.
   * Good if you don't want (or need) to do any extra parsing on the document beforehand.
   * @param {string} _raw Raw document text to convert into a JexleDocument
   * @returns A fully-constructed `JexleDocument`
   */
  static createFromRaw (_raw: string): JexleDocument {
    let doc: JexleDoc[] = JexleDocument.parse(_raw)
    let document: JexleDocument = JexleDocument.create(doc)
    return document
  }

  /**
  * Strips a markdown header line to text-only
  * @param {string} _line The full line that the title is located on
  * @returns Heading text, excluding heading character(s)
  */
  private static getTitle (_line: string): string {
    let words = _line.split(' ')
    let title = words.slice(1).join(' ')
    return title
  }

  /**
   * Takes a sorted array of heading metadata and builds a (content-free) JexleDoc.
   * @param _headings Sorted array of {HeadingData} to convert into a preliminary JexleDoc
   * @param _index Index at which to start building the JexleDoc from
   */
  private static buildDocStructure (_headings: HeadingData[], _index: number): [JexleDoc, number] {
    // get start heading
    const headings: HeadingData[] = _headings
    let current: HeadingData = headings[_index]
    let startLevel: number = current.level
    let length: number = headings.length
    // set scoped index to provided index
    let index: number = _index
    let prev: number = index
    let doc: JexleDoc
    // strip out the hashes from the start of the line
    doc.title = JexleDocument.getTitle(current.text)
    doc.meta.start = current.line
    // Scan headings for any subsections to the present section
    for (let i = index+1; i < length; ++i) {
      current = headings[i]
      if (current.level === startLevel + 1) {
        // build a new JexleDoc
        let newDoc: JexleDoc
        let j: number
        // get the subdoc and new index
        [newDoc, j] = JexleDocument.buildDocStructure(headings, i)
        // set current index to new value
        i = j
        // push JexleDoc as a new subsection
        doc.subsections.push(newDoc)
      } else if (current.level <= startLevel) {
        // No more to add to this section -- get section end line
        doc.meta.end = current.line - 1
        // set scoped index to return the previous index
        index = prev
        break
      }
      // update prev to current index
      prev = i
    }
    // return the compiled document and new index
    return [doc, index]
  }

  /**
   * Slices the given array from `start` to `end` and turns it into a single string.
   * @param _lines Where the text is being gathered from
   * @param _start Starting index in `_lines`
   * @param _end Ending index in `_lines`
   * @returns Full string from `_lines`
   */
  private static getContent (_lines: string[], _start: number, _end: number): string {
    let lines = _lines.slice(_start, _end)
    return lines.join('/n')
  }

  private static fillDocContent (_doc: JexleDoc, _lines: string[]): JexleDoc {
    let doc = _doc
    const lines = _lines
    let {start, end} = doc.meta
    // get the content from the document's lines
    let content: string = JexleDocument.getContent(lines, start, end)
    // set the document's contents
    doc.content = content
    let subsections = doc.subsections
    // create new JexleDocs of the subsections from `lines`
    for (let section of subsections) {
      let newSection: JexleDoc = JexleDocument.fillDocContent(section, lines)
      section = newSection
    }
    // set the doc's subsections to the new, content-full version
    doc.subsections = subsections
    // return the document
    return doc
  }

  private constructor (_doc: JexleDoc[]) {
    this.doc = _doc
    for (let section of this.doc) {
      let jexleSection: JexleSection = new JexleSection(section)
      this.sections.push(jexleSection)
    }
  }

  /**
   * Gets the current section of the document.
   */
  get current (): JexleSection {
    return this.sections[this._current]
  }

  /**
   * If there is more than one section, this returns the next section in sequence, wrapping if necessary;
   *  otherwise, it returns the current section.
   */
  get next (): JexleSection {
    let section: JexleSection 
    if (this.sections.length > 1 && ++this._current >= this.sections.length) {
      this._current = 0
    }
    return this.current
  }

  // keeping this private until they're ready
  // parses the document structure into a linear array of objects for parsing into HTML elements
  private view () {}

  // parses the document structure into a linear array of objects for parsing into an HTML form,
  //  then saves changes back to the document structure
  private edit () {}
}
  
export { JexleDocument }
