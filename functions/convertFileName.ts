export default function convertFileName(name: string): string {
  const fileName = name.split('.').slice(0, -1).join('');
  const fileNameConverted = fileName
    .replace(/[\u0250-\ue007]/g, '')
    .replace(/[^\w ]/g, ' ')
    .trim()
    .replace(/\s+/g, '-');
  const fileExtension = name.split('.').at(-1);
  return (fileNameConverted || new Date().getTime()) + (fileExtension ? `.${fileExtension}` : '');
}
