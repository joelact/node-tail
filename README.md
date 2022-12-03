# node-tail

Simple implementation of tail command. Only option available for now is reading n lines from a file.

### Example

````javascript
const Tail = require('@joelact/node-tail');

const tail = new Tail('/tmp/file.log', { encoding: 'utf8' });
const lines = await tail.readLines(10);

console.log(lines);
````
