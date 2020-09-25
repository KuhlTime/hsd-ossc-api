# Resources

- **[Using ESLint and Prettier in a TypeScript Project](https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project)**:

  Here are some core takeaways from this article.
  He has used the `.js` config files in order to add comments.

  **ESLint**:<br>
  A linter checks the code for any errors or missformated code.

  - `eslint`: The core ESLint linting library

  **TypeScript**:

  - `@typescript-eslint/parser`: The parser that will allow ESLint to lint TypeScript code.
  - `@typescript-eslint/eslint-plugin`: A plugin that contains a nunch of ESLint rules that are TypeScript specific.

  **Prettier**:<br>
  Prettier does not check the code for errors but forces a particular code style.

  - `prettier`: The core prettier library.
  - `eslint-config-prettier`: Disables ESLint rules that would otherwise interfear with prettier.
  - `eslint-plugin-prettier`: Runs prettier as an ESLint rule.

  **Husky**:<br>
  To prevent files from being commited that don't follow the ESLint conventions Husky can be used to lint before commiting any changes.
  [GitHub](https://github.com/typicode/husky)

- **[Get Started with Typescript in 2019](https://www.robertcooper.me/get-started-with-typescript-in-2019)**:

  - `tsconfig.json`: Used to configure the typescript compiler

- [CLI apps in TypeScript via ts-node](https://www.geekytidbits.com/cli-apps-in-typescript-via-ts-node/)

  - `ts-node`: The ts-node executable allows you to run your typescript code directly from within your terminal, without the need to use the typescript compiler `tsc`.

- [TypeScript-Node-Starter](https://github.com/microsoft/TypeScript-Node-Starter)
  - I have used this boilerplate to setup all the scripts necessary to run the server.
