// @flow
import mapToMap from 'map-to-map';

let files: Map<string, Buffer> = new Map();

function __setFiles(newFiles: {[path: string]: Buffer}) {
  files = mapToMap(newFiles);
}

// $FlowFixMe
const readFile = jest.fn(
  (
    path: string,
    encoding: buffer$Encoding,
    callback: (error: ?Error, value: ?string) => void,
  ) => {
    const file = files.get(path);
    if (file && Buffer.isBuffer(file)) {
      const decodedFile = file.toString(encoding);
      callback(null, decodedFile);
    } else {
      const error = new Error();
      callback(error, null);
    }
  },
);

// $FlowFixMe
const readFileSync = jest.fn((path: string, encoding: buffer$Encoding) => {
  const file = files.get(path);
  if (file && Buffer.isBuffer(file)) {
    return file.toString(encoding);
  }
  throw new Error();
});

module.exports = {
  __setFiles,
  readFile,
  readFileSync,
};
