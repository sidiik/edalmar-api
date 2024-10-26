import slugify from 'slugify';

export const genSlug = (text: string): string => {
  return slugify(text, {
    replacement: '-',
    lower: true,
    strict: true,
    locale: 'en',
    trim: true,
  });
};
