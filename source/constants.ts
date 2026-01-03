export const ENVKeys = {
	DEV: "dev",
	PROD: "prod",
} as const;

export const Browser = {
	CHROME: "chrome",
	FIREFOX: "firefox",
	EDGE: "edge",
	BRAVE: "brave",
	OPERA: "opera",
	VIVALDI: "vivaldi",
	ARC: "arc",
	YANDEX: "yandex",
} as const;

export type BrowserType = (typeof Browser)[keyof typeof Browser];

export const browserVendors: BrowserType[] = Object.values(Browser);
export const envVariables: string[] = [ENVKeys.DEV, ENVKeys.PROD];

// Refer: https://regex101.com/r/ddSEHh/1
export const CUSTOM_PREFIX_REGEX = new RegExp(
	`^__((?:(?:${[...browserVendors, ...envVariables].join("|")})\\|?)+)__(.*)`,
);
