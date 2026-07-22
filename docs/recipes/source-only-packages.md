# Recipe: source-only workspace packages

**Situational, opt-in.** Only relevant once a project becomes a pnpm workspace sharing code across several apps. A single-app project should ignore this entirely.

The model: workspace packages ship **raw TypeScript**, not a build output. `exports` points at `src/`, consumers transpile. No build step, no `dist/`, types flow natively, iteration stays instant. A package earns a real build pipeline (tsup or equivalent) only when it goes public on npm, which is a deliberate graduation, not a default.

Field-proven in the Bobi Labs suite (`@bobilabs/offline`), including the ways it bites.

## Consumer requirements (non-negotiable, and they fail badly)

A source-only package cannot be consumed by a Next app without both of these. Both fail silently or with a misleading error, so they belong in every package README:

1. **`transpilePackages: ['@scope/name']`** in `next.config.mjs`. Next does not transpile `node_modules`, and nothing inside a workspace resolves through `node_modules`. Without it, the import fails at build time in a way that reads like a module-resolution bug.
2. **A Tailwind `@source` directive** pointing at the package, if the package ships UI. Tailwind scans the consumer's own tree only; class names living in the package are invisible to it, so styles silently do not exist.

## Third-party CSS inside a source-only package

When a package wraps a library that brings its own stylesheet (driver.js, for example):

- Take the library as a **peer dependency**, never a direct dependency. Under pnpm a direct dependency nests inside the package, while the consumer's `globals.css` resolves `@import` from *their* root, where it would not exist.
- Document a consumer-side `@import '<lib>/dist/<lib>.css' layer(base);`.
- **Never vendor the stylesheet** into the package, and never inject it at runtime. A forked copy of someone else's CSS rots silently on every upgrade.

`layer(base)` is not decoration. Unlayered CSS beats layered CSS regardless of source order, so without it the library's rules win against every Tailwind utility and the consumer is pushed into `!important` overrides. With it, layer order resolves as `properties, theme, base, utilities`, the library lands in `base`, and ordinary utilities override it cleanly.

## The smoke-build rule

**A package is not done until a throwaway consumer app has built against it.**

This is not belt-and-braces. `@bobilabs/offline` passed typecheck, 95 unit tests, and a four-lens adversarial review while being **impossible for any consumer to import** (the `transpilePackages` requirement above). No amount of in-workspace verification could see it, because in-workspace resolution never exercises the consumer's module path. A throwaway app found it in seconds.

Create a scratch app outside the workspace, install the package, import it, build. Delete it afterward. The whole exercise costs minutes and is the only check that tests the thing consumers actually do.

## A rule stated in a README needs a test that fails when it is broken

Every package here will be extended by a session that reads the README and trusts it. That trust is only warranted if the rule is enforced by something that runs.

The case that produced this: a package shipped a violation of its own stated convention and documented itself as compliant in the same commit. README said one thing, the code comment said the same thing, the ruling said the same thing, and all three were wrong about the same file. Only an adversarial review caught it. A three-line test would have caught it at commit time, forever, for free.

So: when a package states a convention (escaping by default, no runtime CSS injection, required constructor arguments), add the test that fails when a future session forgets. Prose is a request; a failing test is the rule.

## Structured output guarantees well-formed results, not truthful ones

When fanning work out to parallel agents with a response schema, the schema validates *shape*. It does not validate that the agent did the work. A lens in a multi-agent audit returned `{"summary":"test","detail":"d"}` and the synthesis step consumed it as real analysis, because it was perfectly well-formed.

Nothing downstream checks this by default. If a workflow's output feeds a decision, add a plausibility gate before synthesis: minimum lengths, required specifics (file paths, line numbers, quoted evidence), or a cross-check that the claimed artifact exists. Cheap to write, and the failure mode it prevents is a confident-sounding conclusion built on a placeholder.

## The general lesson

Verify, do not reason. In that same extraction, an adversarial review surfaced 20 candidate findings and 3 survived refutation; two of those three would have broken every consumer who followed the README. The refutation step is what made the review worth running, and compiling is what made the refutation trustworthy.
