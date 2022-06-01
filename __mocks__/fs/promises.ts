import mapToMap from 'map-to-map';

let files: Map<string, Buffer> = new Map();

function _setFiles(newFiles: {[path: string]: Buffer}): void {
  files = mapToMap(newFiles);
}

const readFile = jest.fn(async (path: string, encoding: BufferEncoding) => {
  const file = files.get(path);
  if (file && Buffer.isBuffer(file)) {
    return file.toString(encoding);
  }
  throw new Error('File not found.');
});

module.exports = {
  _setFiles,
  readFile,
};
