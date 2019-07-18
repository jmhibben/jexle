import { JexleDoc } from './interfaces'

class JexleSection {
  protected _doc: any
  protected _title: string
  protected _content: string
  protected _subsections: JexleSection[]

  constructor (_doc: JexleDoc) {
    this._doc = _doc
    this._title = this._doc.title
    this._content = this._doc.content
    for (let section of this._doc.subsections) {
      let subsection = new JexleSection(section)
      this._subsections.push(subsection)
    }
  }

  get title () {
    return this._title
  }

  get content () {
    return this._content
  }

  get subsections () {
    return this._subsections
  }
}

export { JexleSection }
