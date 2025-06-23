import {transformer} from './transform';

export default transformer;

// For CommonJS default export support
module.exports = transformer;
module.exports.default = transformer;
