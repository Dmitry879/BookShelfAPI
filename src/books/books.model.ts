import type { Author } from '../authors/authors.models.ts'

export interface Book {
  id: number,
  title: string,
  authors?: Author[],
  publisherId: number,
  publishDate: Date,
  isbn: string,
  numPages: number,
  description: string
}