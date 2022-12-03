const fs = require('fs');
const os = require('os');

const open = (filename) => {
    return new Promise((resolve, reject) => {
        fs.open(filename, (err, fd) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(fd);
        });
    });
};

const stat = (filename) => {
    return new Promise((resolve, reject) => {
        fs.stat(filename, (err, stats) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(stats);
        });
    });
};

const read = (fd, fileSize, lastPosition = -1, bufferSize = 4096) => {
    return new Promise((resolve, reject) => {
        let position = 0;

        if (lastPosition !== -1) {
            position = lastPosition - bufferSize;
        } else {
            position = fileSize - bufferSize;
        }

        if (position < 0) {
            bufferSize = bufferSize - Math.abs(position);
            position = 0;
        }

        fs.read(fd, Buffer.alloc(bufferSize), 0, bufferSize, position, (err, _, buffer) => {
            if (err) {
                reject(err);
                return;
            }

            resolve({ position, buffer });
        });
    });
};

class Tail {
    constructor(filename, options = {}) {
        this.filename = filename;
        this.encoding = options.encoding ?? 'utf8';
    }

    async readLines(n = 10) {
        const fd = await open(this.filename);
        const stats = await stat(this.filename);

        let finalBuffer = Buffer.alloc(0);
        let lastPosition = -1;
        let lines = [];

        do {
            const obj = await read(fd, stats.size, lastPosition);
            lastPosition = obj.position;
            const buffer = obj.buffer;

            finalBuffer = Buffer.concat([buffer, finalBuffer], buffer.length + finalBuffer.length);
            lines = finalBuffer.toString(this.encoding).split(os.EOL);
        } while (lines.length < n + 2);

        return lines.slice(-(n + 1));
    }
}

module.exports = Tail;
