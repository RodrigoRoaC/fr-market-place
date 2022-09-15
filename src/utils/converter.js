export function fileToBuffer(file) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => resolve(reader.result);
  });
}
