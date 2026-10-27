export interface CreateBookRequest {
  title: string,
  authors: { name: string }[],
  categories: { name: string }[],
  publisher: string,
  publishDate: string,
  isbn: string,
  numPages: number,
  description: string
}

export const validateCreateBookRequest = (request: CreateBookRequest): void => {

  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    throw new BookValidationError('Invalid book request.');
  }

  if (typeof request.title !== 'string' || !request.title.trim()) {
    throw new BookValidationError('Book title is required.')
  }

  if (typeof request.publisher !== 'string' || !request.publisher.trim()) {
    throw new BookValidationError('Publisher name is required.');
  }

  if (!Array.isArray(request.authors) ||
    request.authors.length === 0 ||
    request.authors.some(author => typeof author?.name !== 'string' || !author.name.trim())) {
      throw new BookValidationError('At least one valid author is required');
  }

  if (!Array.isArray(request.categories) ||
    request.categories.length === 0 ||
    request.categories.some(category => typeof category?.name !== 'string' || !category.name.trim())) {
      throw new BookValidationError('At least one valid category is required');
  }

  if (typeof request.isbn !== 'string' ||
    !/^(?:\d{10}|\d{13})$/.test(request.isbn)) {
      throw new BookValidationError('ISBN must contain exactly 10 or 13 digits');
  }

  if (typeof request.publishDate !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(request.publishDate) ||
    Number.isNaN(Date.parse(request.publishDate))) {
      throw new BookValidationError('A valid publication date is required.');
  }

  if (!Number.isInteger(request.numPages) || request.numPages <= 0) {
    throw new BookValidationError('Number of pages must be a positive integer.');
  }

  if (typeof request.description !== 'string' || !request.description.trim()) {
    throw new BookValidationError('Book description is required.');
  }

}

export class BookValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookValidationError';
  }
}