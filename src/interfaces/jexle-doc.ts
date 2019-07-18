export interface JexleDoc {
  title: string
  content?: string
  subsections?: JexleDoc[]
  meta: {
    start: number,
    end?: number
  }
}