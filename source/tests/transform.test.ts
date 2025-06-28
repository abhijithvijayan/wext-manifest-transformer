import manifest from "./manifest.json";
import chromeOutput from "./chrome.json";
import firefoxOutput from "./firefox.json";
import { transformer } from "../transform.js";
import { Browser } from "../constants.js";

describe("transformer tests", () => {
	it("should return empty object", () => {
		expect(transformer({}, "chrome", "development")).toEqual({});
	});

	it("should return correct JSON for JSON without vendor prefixes", () => {
		expect(
			transformer(
				JSON.parse(`
			{
			  "name": "test",
			  "manifest_version": 2
			}
        `),
				Browser.CHROME,
				"development",
			),
		).toEqual(
			JSON.parse(`
			{
			  "name": "test",
			  "manifest_version": 2
			}
      `),
		);
	});
});

describe("ENV Tests", () => {
	it("should return correct JSON for development", () => {
		expect(
			transformer(
				JSON.parse(`
			{
			  "__dev__content_security_policy": "script-src 'self' http://localhost:8097; object-src 'self'",
			  "__prod__content_security_policy": "script-src 'self'; object-src 'self'"
			}
        `),
				Browser.CHROME,
				"development",
			),
		).toEqual(
			JSON.parse(`
			{
			  "content_security_policy": "script-src 'self' http://localhost:8097; object-src 'self'"
			}
      `),
		);
	});

	it("should return correct JSON for production", () => {
		expect(
			transformer(
				JSON.parse(`
			{
			  "__dev__content_security_policy": "script-src 'self' http://localhost:8097; object-src 'self'",
			  "__prod__content_security_policy": "script-src 'self'; object-src 'self'"
			}
        `),
				Browser.CHROME,
				"production",
			),
		).toEqual(
			JSON.parse(`
			{
			  "content_security_policy": "script-src 'self'; object-src 'self'"
			}
      `),
		);
	});
});

describe("chrome tests", () => {
	it("should return correct JSON for chrome", () => {
		expect(
			transformer(
				JSON.parse(`
			{
			  "__chrome|opera|edge__manifest_version": 3,
			  "__firefox__manifest_version": 2
			}
        `),
				Browser.CHROME,
				"development",
			),
		).toEqual(
			JSON.parse(`
			{
			  "manifest_version": 3
			}
      `),
		);
	});

	it("nested vendor keys", () => {
		expect(
			transformer(
				JSON.parse(`
			{
			 "options_ui": {
				"page": "options.html",
				"open_in_tab": true,
				"__chrome__chrome_style": false,
				"__firefox|opera__browser_style": false
			  }
			}
        `),
				Browser.CHROME,
				"development",
			),
		).toEqual(
			JSON.parse(`
			{
			 "options_ui": {
				"page": "options.html",
				"open_in_tab": true,
				"chrome_style": false
			  }
			}
      `),
		);
	});

	it("should transform whole JSON", () => {
		expect(
			transformer(manifest as never, Browser.CHROME, "development"),
		).toEqual(chromeOutput);
	});
});

describe("firefox tests", () => {
	it("should return correct JSON for firefox", () => {
		expect(
			transformer(
				JSON.parse(`
			{
			  "__chrome|opera|edge__manifest_version": 3,
			  "__firefox__manifest_version": 2
			}
        `),
				Browser.FIREFOX,
				"development",
			),
		).toEqual(
			JSON.parse(`
			{
			  "manifest_version": 2
			}
      `),
		);
	});

	it("nested vendor keys", () => {
		expect(
			transformer(
				JSON.parse(`
			{
			 "options_ui": {
				"page": "options.html",
				"open_in_tab": true,
				"__chrome__chrome_style": false,
				"__firefox|opera__browser_style": false
			  }
			}
        `),
				Browser.FIREFOX,
				"development",
			),
		).toEqual(
			JSON.parse(`
			{
			 "options_ui": {
				"page": "options.html",
				"open_in_tab": true,
				"browser_style": false
			  }
			}
      `),
		);
	});

	it("should transform whole JSON", () => {
		expect(
			transformer(manifest as never, Browser.FIREFOX, "development"),
		).toEqual(firefoxOutput);
	});
});
