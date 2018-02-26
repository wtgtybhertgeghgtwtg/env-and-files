// @flow
let files: Map<string, Buffer> = new Map();

// eslint-disable-next-line require-jsdoc
function __setFiles(newFiles: {[path: string]: string}) {
  const entries = Object.entries(newFiles);
  // $FlowFixMe
  files = new Map(entries);
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

module.exports = {
  __setFiles,
  readFile,
};
