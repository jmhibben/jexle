export interface HeadingData {
    level: number
    line: number
    text: string
    parent?: HeadingData
    children?: HeadingData[] 
}
