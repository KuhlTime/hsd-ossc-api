// Guide: https://duncanleung.com/typescript-module-declearation-svg-img-assets/
// https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations
// https://medium.com/@sampsonjoliver/importing-html-files-from-typescript-bd1c50909992

declare module '*.yml'

declare module '*.json'

declare module 'txt!*' {
	const value: string
	export = value
}
