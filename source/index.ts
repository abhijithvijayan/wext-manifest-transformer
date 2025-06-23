import { transformer } from "./transform";

export {
	browserVendors,
	envVariables,
	Browser,
	CUSTOM_PREFIX_REGEX,
	ENVKeys,
} from "./constants";
export type { BrowserType } from "./constants";
export default transformer;

// For CommonJS default export support
module.exports = transformer;
module.exports.default = transformer;
