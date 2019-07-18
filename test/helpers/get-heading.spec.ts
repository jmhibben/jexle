import test from 'ava'
import { getHeading } from '../../src/helpers'

const lines = [
  '# A happy little file',
  'I only have a few lines, but that\'s okay. I enjoy having sparse contents.',
  '## I have a few headings, though',
  '### Headings are fun, you see',
  '## But they\'re easy to abuse, too',
  '### And sometimes',
  '#### Just sometimes',
  '##### You might go',
  '###### A little too deep'
]

test('`getHeading` throws an error when `_level` is too high', t => {
  t.throws(() => {
    getHeading(7, lines)
  })
})

test('`getHeading` throws an error when `_level` is too low', t => {
  t.throws(() => {
    getHeading(0, lines)
  })
})

test('`getHeading` returns exactly one first-level heading from `lines`', t => {
  let headings = getHeading(1, lines)
  t.is(headings.length, 1)
})

test('returns exactly two second-level headings from `lines`', t => {
  let headings = getHeading(2, lines)
  t.is(headings.length, 2)
})

test('returns exactly two third-level headings from `lines`', t => {
  let headings = getHeading(3, lines)
  t.is(headings.length, 2)
})

test('returns exactly one fourth-level heading from `lines`', t => {
  let headings = getHeading(4, lines)
  t.is(headings.length, 1)
})

test('returns exactly one fifth-level heading from `lines`', t => {
  let headings = getHeading(5, lines)
  t.is(headings.length, 1)
})

test('returns exactly one sixth-level heading from `lines`', t => {
  let headings = getHeading(6, lines)
  t.is(headings.length, 1)
})