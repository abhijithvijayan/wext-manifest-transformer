<h1 align="center">wext-manifest-transformer</h1>
<p align="center">Transformer module for Webextension manifest.json</p>
<div align="center">
  <a href="https://www.npmjs.com/package/wext-manifest-transformer">
    <img src="https://img.shields.io/npm/v/wext-manifest-transformer" alt="NPM" />
  </a>
  <a href="https://github.com/abhijithvijayan/wext-manifest-transformer/blob/main/license">
    <img src="https://img.shields.io/github/license/abhijithvijayan/wext-manifest-transformer.svg" alt="LICENSE" />
  </a>
  <a href="https://twitter.com/intent/tweet?text=Check%20out%20wext-manifest-transformer%21%20by%20%40_abhijithv%0A%0ATransformer%20module%20for%20Webextension%20manifest.json%0Ahttps%3A%2F%2Fgithub.com%2Fabhijithvijayan%2Fwext-manifest-transformer%0A%0A%23transformer%20%23manifest%20%23javascript%20%23webextensions">
     <img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social" alt="TWEET" />
  </a>
</div>
<h3 align="center">🙋‍♂️ Made by <a href="https://twitter.com/_abhijithv">@abhijithvijayan</a></h3>
<p align="center">
  Donate:
  <a href="https://www.paypal.me/iamabhijithvijayan" target='_blank'><i><b>PayPal</b></i></a>,
  <a href="https://www.patreon.com/abhijithvijayan" target='_blank'><i><b>Patreon</b></i></a>
</p>
<p align="center">
  <a href='https://www.buymeacoffee.com/abhijithvijayan' target='_blank'>
    <img height='36' style='border:0px;height:36px;' src='https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png' border='0' alt='Buy Me a Coffee' />
  </a>
</p>
<hr />

Generate browser tailored `manifest.json` content for Web Extensions that you specify properties to appear only in specific browsers.

❤️ it? ⭐️ it on [GitHub](https://github.com/abhijithvijayan/wext-manifest-transformer/stargazers) or [Tweet](https://twitter.com/intent/tweet?text=Check%20out%20wext-manifest-transformer%21%20by%20%40_abhijithv%0A%0ATransformer%20module%20for%20Webextension%20manifest.json%0Ahttps%3A%2F%2Fgithub.com%2Fabhijithvijayan%2Fwext-manifest-transformer%0A%0A%23transformer%20%23manifest%20%23javascript%20%23webextensions) about it.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [FAQs](#faqs)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
- [LICENSE](#license)

This loader will take a definition input for the manifest, and return you content for the specified browser.

### Looking for Web Extension starter

Checkout [web-extension-starter](https://github.com/abhijithvijayan/web-extension-starter) that uses this package with the help of [vite-plugin-wext-manifest](https://github.com/abhijithvijayan/vite-plugin-wext-manifest) plugin.

## Installation

Ensure you have [Node.js](https://nodejs.org) 18 or later installed. Then run the following:

```sh
# via npm
npm install wext-manifest-transformer

# or yarn
yarn add wext-manifest-transformer
```

## Usage

You can easily use this module together with the [`vite-plugin-wext-manifest`](https://www.npmjs.com/package/vite-plugin-wext-manifest) to output the `manifest.json` as part of your build process with auto rebundling on file change.
This also lets you build v2 manifest & v3 manifest for different browsers from the same `manifest.json`.

#### Sample manifest with vendor prefixed keys

<https://github.com/abhijithvijayan/web-extension-starter/blob/react-typescript/source/manifest.json>

```js
import { transformer } from 'wext-manifest-transformer';
// Or using CommonJS
// const { transformer } = require('wext-manifest-transformer');

// 1. Define your manifest with vendor-prefixed keys
const manifest = {
	"name": "My Awesome Extension",
	"version": "1.0",
	"__chrome|opera__manifest_version": 3,
	"__firefox__manifest_version": 2,
	"__dev__name": "My Awesome Extension (Dev)",
	"options_ui": {
		"page": "options.html",
		"__chrome__open_in_tab": true,
		"__firefox__browser_style": true
	},
	"__chrome|prod__host_permissions": [
		"https://*.google.com/"
	],
	"__firefox|prod__host_permissions": [
		"https://*.mozilla.org/"
	]
};

// 2. Transform the manifest for a specific target

// Example for Chrome in a development environment
const chromeDevManifest = transformer(manifest, 'chrome', 'development');
console.log(chromeDevManifest);
/*
Output:
{
  "name": "My Awesome Extension (Dev)",
  "version": "1.0",
  "manifest_version": 3,
  "options_ui": {
    "page": "options.html",
    "open_in_tab": true
  }
}
*/

// Example for Firefox in a production environment
const firefoxProdManifest = transformer(manifest, 'firefox', 'production');
console.log(firefoxProdManifest);
/*
Output:
{
  "name": "My Awesome Extension",
  "version": "1.0",
  "manifest_version": 2,
  "options_ui": {
    "page": "options.html",
    "browser_style": true
  },
  "host_permissions": [
    "https://*.mozilla.org/"
  ]
}
*/
```

<hr />

## FAQs

### 1.What are vendor prefixed manifest keys

Vendor prefixed manifest keys allow you to write one `manifest.json` for multiple vendors.

```js
{
  "__chrome__name": "AwesomeChrome",
  "__firefox__name": "AwesomeFirefox",
  "__edge__name": "AwesomeEdge",
  "__opera__name": "AwesomeOpera"
}
```

if the **TARGET_BROWSER** is `chrome` this compiles to:

```js
{
  "name": "AwesomeChrome",
}
```

---

Add keys to multiple vendors by seperating them with `|` in the prefix

```
{
  __chrome|opera__name: "AwesomeExtension"
}
```

if the vendor is `chrome` or `opera`, this compiles to:

```
{
  "name": "AwesomeExtension"
}
```

### 2. How can I conditionally set keys based on environment

```js
{
  "__dev__name": "NameInDevelopment",
  "__prod__name": "NameInProduction",
  "__chrome|firefox|dev__description": "DescriptionInDevelopmentForSetOfBrowsers",
  "__chrome|firefox|prod__description": "DescriptionInProductionForSetOfBrowsers"
}
```

if the **NODE_ENV** is `production` and the **TARGET_BROWSER** is `chrome` this compiles to:

```js
{
  "name": "NameInProduction",
  "description": "DescriptionInProductionForSetOfBrowsers"
}
```

else

```js
{
  "name": "NameInDevelopment",
  "description": "DescriptionInDevelopmentForSetOfBrowsers"
}
```

## Issues

_Looking to contribute? Look for the [Good First Issue](https://github.com/abhijithvijayan/wext-manifest-transformer/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22good+first+issue%22)
label._

### 🐛 Bugs

Please file an issue [here](https://github.com/abhijithvijayan/wext-manifest-transformer/issues/new) for bugs, missing documentation, or unexpected behavior.

[**See Bugs**](https://github.com/abhijithvijayan/wext-manifest-transformer/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22type%3A+bug%22)

### Linting & TypeScript Config

- Shared Eslint & Prettier Configuration - [`@abhijithvijayan/eslint-config`](https://www.npmjs.com/package/@abhijithvijayan/eslint-config)
- Shared TypeScript Configuration - [`@abhijithvijayan/tsconfig`](https://www.npmjs.com/package/@abhijithvijayan/tsconfig)

## License

MIT © [Abhijith Vijayan](https://abhijithvijayan.in)
