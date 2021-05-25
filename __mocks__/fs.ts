import mapToMap from 'map-to-map';

let files: Map<string, Buffer> = new Map();

function _setFiles(newFiles: {[path: string]: Buffer}): void {
  files = mapToMap(newFiles);
}

const readFile = jest.fn(
  (
    path: string,
    encoding: BufferEncoding,
    // eslint-disable-next-line @rushstack/no-new-null
    callback: (error: Error | null, value?: string) => void,
  ) => {
    const file = files.get(path);
    if (file && Buffer.isBuffer(file)) {
      const decodedFile = file.toString(encoding);
      // eslint-disable-next-line unicorn/no-null
      callback(null, decodedFile);
    } else {
      const error = new Error('File not found.');
      callback(error);
    }
  },
);

const readFileSync = jest.fn((path: string, encoding: BufferEncoding) => {
  const file = files.get(path);
  if (file && Buffer.isBuffer(file)) {
    return file.toString(encoding);
  }
  throw new Error('File not found.');
});

module.exports = {
  _setFiles,
  readFile,
  readFileSync,
};
