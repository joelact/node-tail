export type Options = {
    /**
     * Encoding of the file (default: utf8)
     */
    encoding: string;
};

export default class Tail {
    /**
     *
     * @param filename Path to the file to tail
     * @param options Options for reading the file
     */
    constructor(filename: string, options: Options);
    /**
     * Returns n lines from the file passed to the constructor
     *
     * @param n Number of lines to return from the file (default: 10)
     */
    readLines(n?: number): Promise<string[]>;
}
