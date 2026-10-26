import type { Author } from '../authors/authors.models.ts'
import type { Category } from '../categories/categories.model.ts'

export interface Book {
  id: number,
  title: string,
  authors?: Author[],
  categories?: Category[],
  publisherId: number,
  publishDate: Date,
  isbn: string,
  numPages: number,
  description: string
}