# TypeScript Configuration for Mobiquity

This is a collection of configurations for working with TypeScript at Mobiquity.

This includes the `tsconfig` and `tslint` configurations as well as any other
baseline configurations that may be useful in the future.

This is a [monorepo](https://github.com/lerna/lerna) that manages several
packages for TypeScript configuration defaults for Mobiquity projects and
includes documentation on how to use and apply these configurations.

Currently supported:

* server - TypeScript for a node.js environment including servers and CLI tools
* angular - Configurations for Angular projects including Ionic
* react-native - Configurations for React Native (no pure React yet)

## Installation
All packages are prefixed with `ts-config-mobiquity-`. Determine the platform
you are working on and install:

```
yarn add --dev ts-config-mobiquity-server
# or
yarn add --dev ts-config-mobiquity-angular
# or
yarn add --dev ts-config-mobiquity-react-native
```

## Setup
Once you're ready to start your project and you've installed the configuration
corresponding to your platform, create `tsconfig.json`, `tslint.json`, and
potentially `tsconfig.build.json` files. This section will explain how to set
these files up and the [Usage section](#usage) will go into more detail about
what you can do to customize for your project's needs.

1. Keep all of the source code / TypeScript files under the `src/` directory
 at the root of your project.
2. All tests should be under `__tests__` directories located within `src/`.

**Note:** convention is favored over configuration. *Avoid overriding provided
default configuration at all costs.* If you need to make a change, consider
submitting a pull request to this repo instead. There are certain configurations
that *must* be project-specific and will be detailed below.

You can make use of the default configuration and linting rules using the
`extends` property for `tsconfig.json` and `tslint.json`. For example, your
React Native project may have a `tsconfig.json` like:

```json
{
  "extends": "ts-config-mobiquity-react-native",
  "compilerOptions": {
    "target": "es5",
    "baseUrl": "."
  },
  "excludes": ["src/**/__tests__/*"]
}
```

...and a tslint such as:

```json
{
  "extends": "ts-config-mobiquity-react-native",
  "rules": {
    "jsx-use-translation-function": true
  }
}
```

#### Directory Rules
Most rules relating to directories do not work properly when using imported
configurations because the directories are relative to the location from
where the configuration was imported. For this reason, you have to manage rules
such as `compilerOptions.rootDir`, `compilerOptions.outDir`,
`compilerOptions.baseUrl`, `include`, and `exclude` on your own. Typically you
can use a configuration like this:

```json
{
  "extends": "ts-config-mobiquity-server",
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "lib"
  },
  "include": ["src/**/*"],
  "exclude": ["src/**/__tests__/*"]
}
```

**Note:** At this time it's not fully clear to me under what circumstances
`rootDir` is needed or whether `node_modules` needs to be `exclude`d. In my
experience, you can omit `rootDir` and leave `node_modules` out of `exclude`.

### Configuration for Tests
Test files should be excluded from TypeScript build configuration via
`"exclude": ["src/**/__tests__/*"]`. However, tests still need to conform to
formatting and code standards.

Many editors including the standard VS Code use ts-server which does not allow
configuration of the `tsconfig.json` path. This means that we still need to use
`tsconfig.json` for test files. **Thus the `tsconfig.json` file is used for
development and tests.** If a separate build configuration is required, it
is recommended that you use `tsconfig.build.json`. This will be used by any
compatible Mobiquity boilerplates/toolkits.

For consistency's sake, the test/dev files in this library are named
`tsconfig.json`. Those intended for building are `tsconfig.build.json`.
**The exception is that the core package uses `tsconfig.test.json` for test/dev
and `tsconfig.json` for its base.** However, you should generally not need to
import the core package.

```
{
  "extends": "ts-config-mobiquity-react-native",
  "include": ["src/**/*"]
}
```

Do not exclude the tests from this configuration.

The testing configuration is not set up to emit so you can use it purely for
type checking and linting.

```
npx tsc --project tsconfig.test.json
npx tslint --project tsconfig.test.json
```

### Confirming Setup
Once you've completed your setup, you can confirm that things are working
properly using the TypeScript compiler and linter. If you're using a framework
boilerplate, there should already be base files. Otherwise, you can create a
simple file such as `src/index.ts` as a sanity check.

```
npx tsc
npx tslint --project tsconfig.json
```

These should run without any errors.

## Usage
**Note:** convention is favored over configuration. *Avoid overriding provided
default configuration at all costs.* If you need to make a change, consider
submitting a pull request.

### Project Structure and Directory Configuration
Following convention, all TypeScript files are located under `src/` in the root
of the project. All test files are located under `src/**/__tests__`. Tests
should be placed alongside their corresponding components.

An example project structure would look like:

```sh
├── README.md
├── assets
│   └── intro.gif
├── package.json
├── src
│   ├── App.ts
│   ├── __tests__
│   │   └── App.test.ts
│   ├── command
│   │   ├── Block.ts
│   │   ├── Command.ts
│   │   ├── Navigator.ts
│   │   ├── Program.ts
│   │   ├── __tests__
│   │   │   ├── Block.test.ts
│   │   │   ├── Command.test.ts
│   │   │   ├── Navigator.test.ts
│   │   │   └── Program.test.ts
│   │   ├── log
│   │   │   ├── LogCommand.ts
│   │   │   └── __tests__
│   │   │       └── LogCommand.test.ts
│   │   └── status
│   │       ├── StatusCommand.ts
│   │       └── __tests__
│   │           └── StatusCommand.test.ts
│   ├── index.ts
│   └── util
│       ├── __tests__
│       │   └── util.test.ts
│       ├── guess-command.ts
│       ├── parsing.ts
│       └── passthrough-commands.ts
├── tsconfig.build.json
├── tsconfig.json
├── tslint.json
└── yarn.lock
```

For your `tsconfig.json` files you will need to add `include` and `exclude`:

```json
{
  "extends": "ts-config-mobiquity-server/tsconfig.build.json",
  "include": ["src/**/*"],
  "exclude": ["src/**/__tests__/*"],
}
```

This tells TypeScript to compile the files it finds under `src`, but skip the
tests.

The test/dev files use `tsconfig.json`. The build file uses
`tsconfig.build.json`.

### Additional Compiler Options
You may often update `tsconfig.build.json` with the following `compilerOptions`:

```json
{
  "extends": "ts-config-mobiquity-server/tsconfig.build.json",
  "include": ["src/**/*"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "lib",
    "declaration": true
  }
}
```

* `baseUrl` - helps to resolve non-relative module names. For example, if you
 have `import { API_HOST } from 'src/Config';`, `baseUrl` will help to resolve
 `Config.ts` relative to your project's `src/` directory rather than attempting
 to look at `node_modules/src`. For browser applications, `"."` will be a
 common value.
* `outDir` - use this when creating a build to run as JS on another platform.
 For libraries to be used by other applications, use `"lib"`. For browser and
 server applications, use `"dist"`.
* `declaration` - set to `true` when you are creating a library to be used by
 other TypeScript applications. This will create the declaration `.d.ts` files
 as part of the build.

### `tslint.fix.json`
A `tslint.fix.json` is also exported for each library. This includes linter
rules that have fixes that can update TypeScript files according to our
preferred style that are not handled by `prettier`. These are kept in a separate
file since they do not have an impact on development and do not need to be fixed
by developers since they have a fixer. Thus, they are in a separate file that
extends from the base linter rules.

This avoids distracting developers with style issues that will be fixed
automatically by hooks.

You can extend from the core linter rules as well as your own configuration in
case you have any custom rules (*try to avoid adding custom rules, though*).

```
{
  "extends": ["ts-config-mobuquity-angular/tslint.fix.json", "./tslint.json"]
}
```

You can use this for commit hooks running `tslint --fix`.

### Linting Rules
The core lint configuration extends [`tslint-config-airbnb`](https://github.com/progre/tslint-config-airbnb)
which itself inherits from tslint consistent code style rules, Microsoft's own
tslint rules, and includes the tslint-eslint-rules (tslint rules based on rules
created for eslint / JavaScript). [`tslint-sonarts`](https://github.com/SonarSource/SonarTS)
is also extended per our standards and consistency with Sonar. Finally,
[`tslint-config-prettier`](https://github.com/prettier/tslint-config-prettier)
is used to disable all style rules that are handled by prettier. Prettier should
be used as a commit hook for all Mobiquity projects.

You have access to any of the rules created in these libraries. **Note** that as
stated in past sections, you should avoid having to modify the linter rules at
all. If you have a strong reason to update default rules you should consider
creating a pull request.

#### Justification for Core Changes
Core has a few differences from the Airbnb base. Below are my personal
justifications for the changes:

* `curly` - omitting braces around statements can cause unexpected behavior if
 another expression needs to be added to the block later.
* `no-angle-bracket-type-assertion` - forces casting to be written more
 explicitly and differently than type declarations for clarity.
* `prefer-template` - template strings are much clearer and more semantic. A
 single concatenation for a single value is common and clear enough to warrant
 an exception. Also syncs with `prettier`.
* `no-console` - production applications should not log.
* `no-debugger` - see above.
* `no-else-after-return` - return statements from branches should be consistent
 and explicit
* `no-default-export` - justification is offered by the rule itself:
 https://palantir.github.io/tslint/rules/no-default-export/
* `no-inferrable-types` - unnecessary typings are noise

#### Angular
The Angular configuration also includes the [codelyzer](https://github.com/mgechev/codelyzer)
ruleset with suggested defaults.

You must change some of the rules for your project:

* `component-selector`
* `directive-selector`
* `component-class-suffix`
* `directive-class-suffix`

The selector rules are set up without a specific prefix:

```
"component-selector": [true, "element", null, "kebab-case"],
```

This will enforce a prefix, but you should use a specific prefix (or prefixes)
for your project.

For example, for Wawa you may use the rules:

```
"component-selector": [true, "element", "wawa", "kebab-case"],
"directive-selector": [true, "attribute", "wawa", "camelCase"],
```

You may also provide additional suffixes for the suffix rules if it makes
sense for the standards of your specific project.

You may also want to use the experimental codelyzer `i18n` rule if your project
requires i18n.

Remember that `tsconfig.build.json` is for building and `tsconfig.json` is
for testing / development.

### React Native
The React Native configuration includes the [tslint-react](https://github.com/palantir/tslint-react)
ruleset with suggested defaults.

You may also want to use `jsx-use-translation-function` for projects requiring
i18n, but this won't be necessary for all projects so it was excluded as a
default.

React Native supports TypeScript building through Metro, so a
`tsconfig.build.json` is currently not needed or included. Instead, you should
set up a `tsconfig.json` file for testing / development. This can extend
the `tsconfig.json` for `ts-config-mobiquity-react-native`.
