import {
	CUSTOM_PREFIX_REGEX,
	browserVendors,
	envVariables,
	BrowserType,
	ENVKeys,
} from "./constants.js";

export const transformer = (
	manifest: Record<string, string> | string | number | unknown,
	selectedVendor: BrowserType,
	nodeEnv: "production" | "development" | string,
): any => {
	if (Array.isArray(manifest)) {
		return manifest.map((newManifest) => {
			return transformer(newManifest, selectedVendor, nodeEnv);
		});
	}

	if (typeof manifest === "object" && !!manifest) {
		return Object.entries(manifest).reduce(
			(newManifest: Record<string, string>, [key, value]) => {
				// match with vendors regex
				const vendorMatch: RegExpMatchArray | null =
					key.match(CUSTOM_PREFIX_REGEX);

				if (vendorMatch) {
					// match[1] => 'opera|firefox|dev' => ['opera', 'firefox', 'dev']
					const matches: string[] = vendorMatch[1]?.split("|") || [];
					const isProd: boolean = nodeEnv === "production";

					const hasCurrentVendor = matches.includes(selectedVendor);
					const hasVendorKeys = matches.some((m) =>
						browserVendors.includes(m as never),
					);
					const hasEnvKey = matches.some((m) =>
						envVariables.includes(m as never),
					);

					const hasCurrentEnvKey =
						hasEnvKey &&
						// if production env key is found
						((isProd && matches.includes(ENVKeys.PROD)) ||
							// or if development env key is found
							(!isProd && matches.includes(ENVKeys.DEV)));

					// handles cases like
					// 1. __dev__
					// 2. __chrome__
					// 3. __chrome|dev__

					if (
						// case: __chrome|dev__ (current vendor key and current env key)
						(hasCurrentVendor && hasCurrentEnvKey) ||
						// case: __dev__ (no vendor keys but current env key)
						(!hasVendorKeys && hasCurrentEnvKey) ||
						// case: __chrome__ (no env keys but current vendor key)
						(!hasEnvKey && hasCurrentVendor)
					) {
						// Swap key with non prefixed name
						// match[2] => will be the key
						newManifest[(vendorMatch as RegExpMatchArray)[2] as string] =
							transformer(value, selectedVendor, nodeEnv);
					}
				} else {
					newManifest[key] = transformer(value, selectedVendor, nodeEnv);
				}

				return newManifest;
			},
			{},
		);
	}

	return manifest;
};
