/**
 * @alpha
 */
export declare interface ComponentEntryStrategy {
    type: 'component';
    manual?: Record<string, string>;
}

/**
 * @alpha
 */
export declare const createOptimizer: (optimizerOptions?: OptimizerOptions) => Promise<Optimizer>;

/**
 * @alpha
 */
export declare interface Diagnostic {
    scope: string;
    category: DiagnosticCategory;
    code: string | null;
    file: string;
    message: string;
    highlights: SourceLocation[];
    suggestions: string[] | null;
}

/**
 * @alpha
 */
export declare type DiagnosticCategory = 'error' | 'warning' | 'sourceError';

/**
 * @alpha
 */
declare type EmitMode = 'dev' | 'prod' | 'lib';

/**
 * @alpha
 */
export declare type EntryStrategy = InlineEntryStrategy | SingleEntryStrategy | HookEntryStrategy | ComponentEntryStrategy | SmartEntryStrategy;

/**
 * @alpha
 */
export declare interface GlobalInjections {
    tag: string;
    attributes?: {
        [key: string]: string;
    };
    location: 'head' | 'body';
}

/**
 * @alpha
 */
export declare interface HookAnalysis {
    origin: string;
    name: string;
    entry: string | null;
    displayName: string;
    hash: string;
    canonicalFilename: string;
    extension: string;
    parent: string | null;
    ctxKind: 'event' | 'function';
    ctxName: string;
    captures: boolean;
}

/**
 * @alpha
 */
export declare interface HookEntryStrategy {
    type: 'hook';
}

/**
 * @alpha
 */
export declare interface InlineEntryStrategy {
    type: 'inline';
}

/**
 * @alpha
 */
export declare type MinifyMode = 'simplify' | 'none';

declare interface NormalizedQwikPluginOptions extends Required<QwikPluginOptions> {
    input: string[];
}

/**
 * @alpha
 */
export declare interface Optimizer {
    /**
     * Transforms the input code string, does not access the file system.
     */
    transformModules(opts: TransformModulesOptions): Promise<TransformOutput>;
    /**
     * Transforms the input code string, does not access the file system.
     */
    transformModulesSync(opts: TransformModulesOptions): TransformOutput;
    /**
     * Transforms the directory from the file system.
     */
    transformFs(opts: TransformFsOptions): Promise<TransformOutput>;
    /**
     * Transforms the directory from the file system.
     */
    transformFsSync(opts: TransformFsOptions): TransformOutput;
    /**
     * Optimizer system use. This can be updated with a custom file system.
     */
    sys: OptimizerSystem;
}

/**
 * @alpha
 */
export declare interface OptimizerOptions {
    sys?: OptimizerSystem;
    binding?: any;
}

/**
 * @alpha
 */
export declare interface OptimizerSystem {
    cwd: () => string;
    env: SystemEnvironment;
    os: string;
    dynamicImport: (path: string) => Promise<any>;
    strictDynamicImport: (path: string) => Promise<any>;
    getInputFiles?: (rootDir: string) => Promise<TransformModuleInput[]>;
    path: Path;
}

/**
 * @alpha
 */
export declare interface Path {
    resolve(...paths: string[]): string;
    normalize(path: string): string;
    isAbsolute(path: string): boolean;
    join(...paths: string[]): string;
    relative(from: string, to: string): string;
    dirname(path: string): string;
    basename(path: string, ext?: string): string;
    extname(path: string): string;
    format(pathObject: {
        root: string;
        dir: string;
        base: string;
        ext: string;
        name: string;
    }): string;
    parse(path: string): {
        root: string;
        dir: string;
        base: string;
        ext: string;
        name: string;
    };
    readonly sep: string;
    readonly delimiter: string;
    readonly win32: null;
    readonly posix: Path;
}

/**
 * @alpha
 */
export declare type QwikBuildMode = 'production' | 'development';

/**
 * @alpha
 */
export declare type QwikBuildTarget = 'client' | 'ssr' | 'lib' | 'test';

/**
 * @alpha
 */
export declare interface QwikBundle {
    size: number;
    symbols?: string[];
    imports?: string[];
    dynamicImports?: string[];
    origins?: string[];
}

/**
 * @alpha
 */
export declare interface QwikManifest {
    symbols: {
        [symbolName: string]: QwikSymbol;
    };
    mapping: {
        [symbolName: string]: string;
    };
    bundles: {
        [fileName: string]: QwikBundle;
    };
    injections?: GlobalInjections[];
    version: string;
    options?: {
        target?: string;
        buildMode?: string;
        forceFullBuild?: boolean;
        entryStrategy?: {
            [key: string]: any;
        };
    };
    platform?: {
        [name: string]: string;
    };
}

declare interface QwikPluginOptions {
    buildMode?: QwikBuildMode;
    debug?: boolean;
    entryStrategy?: EntryStrategy;
    forceFullBuild?: boolean;
    rootDir?: string;
    vendorRoots?: string[];
    manifestOutput?: ((manifest: QwikManifest) => Promise<void> | void) | null;
    manifestInput?: QwikManifest | null;
    input?: string[] | string | {
        [entry: string]: string;
    };
    outDir?: string;
    srcDir?: string | null;
    scope?: string | null;
    srcInputs?: TransformModuleInput[] | null;
    resolveQwikBuild?: boolean;
    target?: QwikBuildTarget;
    transformedModuleOutput?: ((transformedModules: TransformModule[]) => Promise<void> | void) | null;
    devTools?: {
        clickToSource?: string[] | false;
    };
}

/**
 * @alpha
 */
export declare function qwikRollup(qwikRollupOpts?: QwikRollupPluginOptions): any;

/**
 * @alpha
 */
export declare interface QwikRollupPluginOptions {
    /**
     * Build `production` or `development`.
     * Default `development`
     */
    buildMode?: QwikBuildMode;
    /**
     * Target `client` or `ssr`.
     * Default `client`
     */
    target?: QwikBuildTarget;
    /**
     * Prints verbose Qwik plugin debug logs.
     * Default `false`
     */
    debug?: boolean;
    /**
     * The Qwik entry strategy to use while bunding for production.
     * During development the type is always `hook`.
     * Default `{ type: "smart" }`)
     */
    entryStrategy?: EntryStrategy;
    forceFullBuild?: boolean;
    /**
     * The source directory to find all the Qwik components. Since Qwik
     * does not have a single input, the `srcDir` is use to recursively
     * find Qwik files.
     * Default `src`
     */
    srcDir?: string;
    /**
     * Alternative to `srcDir`, where `srcInputs` is able to provide the
     * files manually. This option is useful for an environment without
     * a file system, such as a webworker.
     * Default: `null`
     */
    srcInputs?: TransformModuleInput[] | null;
    /**
     * The root of the application, which is commonly the same
     * directory as `package.json` and `rollup.config.js`.
     * Default `process.cwd()`
     */
    rootDir?: string;
    /**
     * The client build will create a manifest and this hook
     * is called with the generated build data.
     * Default `undefined`
     */
    manifestOutput?: (manifest: QwikManifest) => Promise<void> | void;
    /**
     * The SSR build requires the manifest generated during the client build.
     * The `manifestInput` option can be used to manually provide a manifest.
     * Default `undefined`
     */
    manifestInput?: QwikManifest;
    optimizerOptions?: OptimizerOptions;
    /**
     * Hook that's called after the build and provides all of the transformed
     * modules that were used before bundling.
     */
    transformedModuleOutput?: ((transformedModules: TransformModule[]) => Promise<void> | void) | null;
}

/**
 * @alpha
 */
export declare interface QwikSymbol {
    origin: string;
    displayName: string;
    hash: string;
    canonicalFilename: string;
    ctxKind: 'function' | 'event';
    ctxName: string;
    captures: boolean;
    parent: string | null;
}

/**
 * @alpha
 */
export declare function qwikVite(qwikViteOpts?: QwikVitePluginOptions): any;

/**
 * @alpha
 */
export declare interface QwikVitePlugin {
    name: 'vite-plugin-qwik';
    api: QwikVitePluginApi;
}

/**
 * @alpha
 */
export declare interface QwikVitePluginApi {
    getOptimizer: () => Optimizer | null;
    getOptions: () => NormalizedQwikPluginOptions;
    getManifest: () => QwikManifest | null;
    getRootDir: () => string | null;
    getClientOutDir: () => string | null;
}

/**
 * @alpha
 */
export declare interface QwikVitePluginOptions {
    /**
     * Prints verbose Qwik plugin debug logs.
     * Default `false`
     */
    debug?: boolean;
    /**
     * The Qwik entry strategy to use while bunding for production.
     * During development the type is always `hook`.
     * Default `{ type: "smart" }`)
     */
    entryStrategy?: EntryStrategy;
    /**
     * The source directory to find all the Qwik components. Since Qwik
     * does not have a single input, the `srcDir` is use to recursively
     * find Qwik files.
     * Default `src`
     */
    srcDir?: string;
    vendorRoots?: string[];
    client?: {
        /**
         * The entry point for the client builds. Typically this would be
         * the application's main component.
         * Default `src/components/app/app.tsx`
         */
        input?: string[] | string;
        /**
         * Entry input for client-side only development with hot-module reloading.
         * This is for Vite development only and does not use SSR.
         * Default `src/entry.dev.tsx`
         */
        devInput?: string;
        /**
         * Output directory for the client build.
         * Default `dist`
         */
        outDir?: string;
        /**
         * The client build will create a manifest and this hook
         * is called with the generated build data.
         * Default `undefined`
         */
        manifestOutput?: (manifest: QwikManifest) => Promise<void> | void;
    };
    ssr?: {
        /**
         * The entry point for the SSR renderer. This file should export
         * a `render()` function. This entry point and `render()` export
         * function is also used for Vite's SSR development and Nodejs
         * debug mode.
         * Default `src/entry.ssr.tsx`
         */
        input?: string;
        /**
         * Output directory for the server build.
         * Default `dist`
         */
        outDir?: string;
        /**
         * The SSR build requires the manifest generated during the client build.
         * By default, this plugin will wire the client manifest to the ssr build.
         * However, the `manifestInput` option can be used to manually provide a manifest.
         * Default `undefined`
         */
        manifestInput?: QwikManifest;
    };
    optimizerOptions?: OptimizerOptions;
    /**
     * Hook that's called after the build and provides all of the transformed
     * modules that were used before bundling.
     */
    transformedModuleOutput?: ((transformedModules: TransformModule[]) => Promise<void> | void) | null;
    devTools?: {
        /**
         * Press-hold the defined keys to enable qwik dev inspector.
         * By default the behavior is activated by pressing the left or right `Alt` key.
         * If set to `false`, qwik dev inspector will be disabled.
         * Valid values are `KeyboardEvent.code` values.
         * Please note that the 'Left' and 'Right' suffixes are ignored.
         */
        clickToSource: string[] | false;
    };
}

/**
 * @alpha
 */
export declare interface SingleEntryStrategy {
    type: 'single';
    manual?: Record<string, string>;
}

/**
 * @alpha
 */
export declare interface SmartEntryStrategy {
    type: 'smart';
    manual?: Record<string, string>;
}

/**
 * @alpha
 */
export declare interface SourceLocation {
    hi: number;
    lo: number;
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
}

/**
 * @alpha
 */
export declare type SourceMapsOption = 'external' | 'inline' | undefined | null;

/**
 * @alpha
 */
export declare type SymbolMapper = Record<string, [symbol: string, chunk: string]>;

/**
 * @alpha
 */
export declare type SymbolMapperFn = (symbolName: string, mapper: SymbolMapper | undefined) => [symbol: string, chunk: string] | undefined;

/**
 * @alpha
 */
export declare type SystemEnvironment = 'node' | 'deno' | 'webworker' | 'browsermain' | 'unknown';

/**
 * @alpha
 */
export declare interface TransformFsOptions extends TransformOptions {
    vendorRoots: string[];
}

/**
 * @alpha
 */
export declare interface TransformModule {
    path: string;
    isEntry: boolean;
    code: string;
    map: string | null;
    hook: HookAnalysis | null;
}

/**
 * @alpha
 */
export declare interface TransformModuleInput {
    path: string;
    code: string;
}

/**
 * @alpha
 */
export declare interface TransformModulesOptions extends TransformOptions {
    input: TransformModuleInput[];
}

/**
 * @alpha
 */
export declare interface TransformOptions {
    srcDir: string;
    entryStrategy?: EntryStrategy;
    minify?: MinifyMode;
    sourceMaps?: boolean;
    transpileTs?: boolean;
    transpileJsx?: boolean;
    preserveFilenames?: boolean;
    explicitExtensions?: boolean;
    mode?: EmitMode;
    scope?: string;
    stripExports?: string[];
    stripCtxName?: string[];
    stripCtxKind?: 'function' | 'event';
    isServer?: boolean;
}

/**
 * @alpha
 */
export declare interface TransformOutput {
    modules: TransformModule[];
    diagnostics: Diagnostic[];
    isTypeScript: boolean;
    isJsx: boolean;
}

/**
 * @alpha
 */
export declare type TranspileOption = boolean | undefined | null;

/**
 * @public
 */
export declare const versions: {
    qwik: string;
};

export { }
