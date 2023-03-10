/// <reference path="./server-modules.d.ts" />

import type { QwikManifest } from './core/optimizer';
import type { SnapshotResult } from './core';
import type { StreamWriter } from './core';
import type { SymbolMapper } from './core/optimizer';
import type { SymbolMapperFn } from './core/optimizer';

/**
 * `link-prefetch-html`: Render link rel=prefetch within the html
 *
 * `link-prefetch`: Use JS to add link rel=prefetch, add worker-fetch if not supported
 *
 * `link-preload-html`: Render link rel=preload within the html
 *
 * `link-preload`: Use JS to add link rel=preload, add worker-fetch if not supported
 *
 * `link-modulepreload-html`: Render link rel=modulepreload within the html
 *
 * `link-modulepreload`: Use JS to add link rel=modulepreload, add worker-fetch if not supported
 *
 * `worker-fetch`: Add worker-fetch JS
 *
 * `none`: Do not add any prefetch links
 *
 * @deprecated Use the `PrefetchImplementation` object options instead.
 * @alpha
 */
declare type DeprecatedPrefetchImplementation = 'link-prefetch-html' | 'link-prefetch' | 'link-preload-html' | 'link-preload' | 'link-modulepreload-html' | 'link-modulepreload' | 'worker-fetch' | 'none';

/**
 * Provides the qwikloader.js file as a string. Useful for tooling to inline the qwikloader
 * script into HTML.
 * @alpha
 */
export declare function getQwikLoaderScript(opts?: {
    events?: string[];
    debug?: boolean;
}): string;

/**
 * @alpha
 */
export declare interface InOrderAuto {
    strategy: 'auto';
    maximunInitialChunk?: number;
    maximunChunk?: number;
}

/**
 * @alpha
 */
declare interface InOrderDirect {
    strategy: 'direct';
}

/**
 * @alpha
 */
export declare interface InOrderDisabled {
    strategy: 'disabled';
}

/**
 * @alpha
 */
export declare type InOrderStreaming = InOrderAuto | InOrderDisabled | InOrderDirect;

/**
 * @alpha
 */
export declare interface PrefetchImplementation {
    /**
     * `js-append`: Use JS runtime to create each `<link>` and append to the body.
     *
     * `html-append`: Render each `<link>` within html, appended at the end of the body.
     */
    linkInsert?: 'js-append' | 'html-append' | null;
    /**
     * Value of the `<link rel="...">` attribute when link is used.
     * Defaults to `prefetch` if links are inserted.
     */
    linkRel?: 'prefetch' | 'preload' | 'modulepreload' | null;
    /**
     * `always`: Always include the worker fetch JS runtime.
     *
     * `no-link-support`: Only include the worker fetch JS runtime when the browser doesn't support `<link>` prefetch/preload/modulepreload.
     */
    workerFetchInsert?: 'always' | 'no-link-support' | null;
    /**
     * Dispatch a `qprefetch` event with detail data containing the bundles that should be prefetched.
     * The event dispatch script will be inlined into the document's HTML so any listeners of this
     * event should already be ready to handle the event.
     *
     * This implementation will inject a script similar to:
     *
     * ```
     * <script type="module">
     *   document.dispatchEvent(new CustomEvent("qprefetch", { detail:{ "bundles": [...] } }))
     * </script>
     * ```
     *
     * By default, the `prefetchEvent` implementation will be set to `always`.
     */
    prefetchEvent?: 'always' | null;
}

/**
 * @alpha
 */
export declare interface PrefetchResource {
    url: string;
    imports: PrefetchResource[];
}

/**
 * @alpha
 */
export declare interface PrefetchStrategy {
    implementation?: PrefetchImplementation | DeprecatedPrefetchImplementation;
    symbolsToPrefetch?: SymbolsToPrefetch;
}

/**
 * @alpha
 */
export declare interface QwikLoaderOptions {
    events?: string[];
    include?: 'always' | 'never' | 'auto';
    position?: 'top' | 'bottom';
}

/**
 * @alpha
 */
export declare type Render = RenderToString | RenderToStream;

/**
 * @alpha
 */
export declare interface RenderOptions extends SerializeDocumentOptions {
    /**
     * Defaults to `true`
     */
    snapshot?: boolean;
    /**
     * Specifies the root of the JS files of the client build.
     * Setting a base, will cause the render of the `q:base` attribute in the `q:container` element.
     */
    base?: string | ((options: RenderOptions) => string);
    /**
     * Language to use when rendering the document.
     */
    locale?: string | ((options: RenderOptions) => string);
    /**
     * Specifies if the Qwik Loader script is added to the document or not. Defaults to `{ include: true }`.
     */
    qwikLoader?: QwikLoaderOptions;
    prefetchStrategy?: PrefetchStrategy | null;
    /**
     * When set, the app is serialized into a fragment. And the returned html is not a complete document.
     * Defaults to `html`
     */
    containerTagName?: string;
    containerAttributes?: Record<string, string>;
    envData?: Record<string, any>;
}

/**
 * @alpha
 */
export declare interface RenderResult {
    prefetchResources: PrefetchResource[];
    snapshotResult: SnapshotResult | undefined;
    isStatic: boolean;
    manifest?: QwikManifest;
    /** @internal TODO: Move to snapshotResult */
    _symbols?: string[];
}

/**
 * @alpha
 */
export declare type RenderToStream = (opts: RenderToStreamOptions) => Promise<RenderToStreamResult>;

/**
 * Creates a server-side `document`, renders to root node to the document,
 * then serializes the document to a string.
 *
 * @alpha
 *
 */
export declare function renderToStream(rootNode: any, opts: RenderToStreamOptions): Promise<RenderToStreamResult>;

/**
 * @alpha
 */
export declare interface RenderToStreamOptions extends RenderOptions {
    stream: StreamWriter;
    streaming?: StreamingOptions;
}

/**
 * @alpha
 */
export declare interface RenderToStreamResult extends RenderResult {
    flushes: number;
    size: number;
    timing: {
        firstFlush: number;
        render: number;
        snapshot: number;
    };
}

/**
 * @alpha
 */
export declare type RenderToString = (opts: RenderToStringOptions) => Promise<RenderToStringResult>;

/**
 * Creates a server-side `document`, renders to root node to the document,
 * then serializes the document to a string.
 *
 * @alpha
 *
 */
export declare function renderToString(rootNode: any, opts?: RenderToStringOptions): Promise<RenderToStringResult>;

/**
 * @alpha
 */
export declare interface RenderToStringOptions extends RenderOptions {
}

/**
 * @alpha
 */
export declare interface RenderToStringResult extends RenderResult {
    html: string;
    timing: {
        render: number;
        snapshot: number;
    };
}

declare interface ResolvedManifest {
    mapper: SymbolMapper;
    manifest: QwikManifest;
}

/**
 * @alpha
 */
export declare function resolveManifest(manifest: QwikManifest | ResolvedManifest | undefined): ResolvedManifest | undefined;

/**
 * @alpha
 */
export declare interface SerializeDocumentOptions {
    manifest?: QwikManifest | ResolvedManifest;
    symbolMapper?: SymbolMapperFn;
    debug?: boolean;
}

/**
 * @alpha
 */
export declare interface StreamingOptions {
    inOrder?: InOrderStreaming;
}

/**
 * auto: Prefetch all possible QRLs used by the document. Default
 *
 * @alpha
 */
export declare type SymbolsToPrefetch = 'auto' | ((opts: {
    manifest: QwikManifest;
}) => PrefetchResource[]);

/**
 * @public
 */
export declare const versions: {
    readonly qwik: string;
    readonly qwikDom: string;
};

export { }
