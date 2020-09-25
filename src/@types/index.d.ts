// Guide: https://duncanleung.com/typescript-module-declearation-svg-img-assets/
// https://www.typescriptlang.org/docs/handbook/modules.html#wildcard-module-declarations

declare module '*.!{yml,yaml}' {
	const content: string
	export = content
}

declare module '*.json' {
	const content: string
	export = content
}
