import { readFile } from 'fs'
import { promisify } from 'util'

const load = promisify(readFile)

const location = '../../static/chars/'
const data = {
  jexle: `${location}/jexle`
}

export async function character(_name) {
  let char = await load(data[_name])
  return char
}

export function characters() {
  let names = Object.keys(data)
  return names
}