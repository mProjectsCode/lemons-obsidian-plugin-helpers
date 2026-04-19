/// <reference types="node" />
import { d as FileSystem, r as RepoAutomationConfig } from "../../../release-DrUYdBXo.mjs";
import * as fs from "node:fs";
import * as http from "node:http";
import { Agent, ClientRequest, ClientRequestArgs, OutgoingHttpHeaders } from "node:http";
import { Http2SecureServer } from "node:http2";
import { EventEmitter } from "node:events";
import { Server as Server$1, ServerOptions as ServerOptions$1 } from "node:https";
import * as net from "node:net";
import { Duplex, DuplexOptions, Stream } from "node:stream";
import { SecureContextOptions } from "node:tls";
import { URL as URL$1 } from "node:url";
import { ZlibOptions } from "node:zlib";
import * as Terser from "terser";
import DartSass from "sass";
import SassEmbedded from "sass-embedded";
import Less from "less";
import Stylus from "stylus";

//#region node_modules/vite/types/hmrPayload.d.ts
type HotPayload = ConnectedPayload | PingPayload | UpdatePayload | FullReloadPayload | CustomPayload | ErrorPayload | PrunePayload;
interface ConnectedPayload {
  type: 'connected';
}
interface PingPayload {
  type: 'ping';
}
interface UpdatePayload {
  type: 'update';
  updates: Update[];
}
interface Update {
  type: 'js-update' | 'css-update';
  /**
   * URL of HMR patch chunk
   *
   * This only exists when full-bundle mode is enabled.
   */
  url?: string;
  path: string;
  acceptedPath: string;
  timestamp: number;
  /** @internal */
  explicitImportRequired?: boolean;
  /** @internal */
  isWithinCircularImport?: boolean;
  /** @internal */
  firstInvalidatedBy?: string;
  /** @internal */
  invalidates?: string[];
}
interface PrunePayload {
  type: 'prune';
  paths: string[];
}
interface FullReloadPayload {
  type: 'full-reload';
  path?: string;
  /** @internal */
  triggeredBy?: string;
}
interface CustomPayload {
  type: 'custom';
  event: string;
  data?: any;
}
interface ErrorPayload {
  type: 'error';
  err: {
    [name: string]: any;
    message: string;
    stack: string;
    id?: string;
    frame?: string;
    plugin?: string;
    pluginCode?: string;
    loc?: {
      file?: string;
      line: number;
      column: number;
    };
  };
}
//#endregion
//#region node_modules/vite/dist/node/chunks/moduleRunnerTransport.d.ts
//#region src/shared/invokeMethods.d.ts
interface FetchFunctionOptions {
  cached?: boolean;
  startOffset?: number;
}
type FetchResult = CachedFetchResult | ExternalFetchResult | ViteFetchResult;
interface CachedFetchResult {
  /**
  * If the module is cached in the runner, this confirms
  * it was not invalidated on the server side.
  */
  cache: true;
}
interface ExternalFetchResult {
  /**
  * The path to the externalized module starting with file://.
  * By default this will be imported via a dynamic "import"
  * instead of being transformed by Vite and loaded with the Vite runner.
  */
  externalize: string;
  /**
  * Type of the module. Used to determine if the import statement is correct.
  * For example, if Vite needs to throw an error if a variable is not actually exported.
  */
  type: "module" | "commonjs" | "builtin" | "network";
}
interface ViteFetchResult {
  /**
  * Code that will be evaluated by the Vite runner.
  * By default this will be wrapped in an async function.
  */
  code: string;
  /**
  * File path of the module on disk.
  * This will be resolved as import.meta.url/filename.
  * Will be `null` for virtual modules.
  */
  file: string | null;
  /**
  * Module ID in the server module graph.
  */
  id: string;
  /**
  * Module URL used in the import.
  */
  url: string;
  /**
  * Invalidate module on the client side.
  */
  invalidate: boolean;
}
//#endregion
//#region node_modules/vite/types/customEvent.d.ts
interface CustomEventMap {
  // client events
  'vite:beforeUpdate': UpdatePayload;
  'vite:afterUpdate': UpdatePayload;
  'vite:beforePrune': PrunePayload;
  'vite:beforeFullReload': FullReloadPayload;
  'vite:error': ErrorPayload;
  'vite:invalidate': InvalidatePayload;
  'vite:ws:connect': WebSocketConnectionPayload;
  'vite:ws:disconnect': WebSocketConnectionPayload;
  /** @internal */
  'vite:forward-console': ForwardConsolePayload;
  /** @internal */
  'vite:module-loaded': {
    modules: string[];
  }; // server events
  'vite:client:connect': undefined;
  'vite:client:disconnect': undefined;
}
interface WebSocketConnectionPayload {
  /**
   * @experimental
   * We expose this instance experimentally to see potential usage.
   * This might be removed in the future if we didn't find reasonable use cases.
   * If you find this useful, please open an issue with details so we can discuss and make it stable API.
   */
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  webSocket: WebSocket;
}
interface InvalidatePayload {
  path: string;
  message: string | undefined;
  firstInvalidatedBy: string;
}
type ForwardConsolePayload = {
  type: 'error';
  data: {
    name: string;
    message: string;
    stack?: string;
  };
} | {
  type: 'unhandled-rejection';
  data: {
    name: string;
    message: string;
    stack?: string;
  };
} | {
  type: 'log';
  data: {
    level: string;
    message: string;
  };
};
/**
 * provides types for payloads of built-in Vite events
 */
type InferCustomEventPayload<T extends string> = T extends keyof CustomEventMap ? CustomEventMap[T] : any;
//#endregion
//#region node_modules/vite/node_modules/rolldown/dist/shared/logging-C6h4g8dA.d.mts
//#region src/log/logging.d.ts
/** @inline */
type LogLevel$1 = "info" | "debug" | "warn";
/** @inline */
type LogLevelOption = LogLevel$1 | "silent";
/** @inline */
type LogLevelWithError = LogLevel$1 | "error";
interface RolldownLog {
  binding?: string;
  cause?: unknown;
  /**
  * The log code for this log object.
  * @example 'PLUGIN_ERROR'
  */
  code?: string;
  exporter?: string;
  frame?: string;
  hook?: string;
  id?: string;
  ids?: string[];
  loc?: {
    column: number;
    file?: string;
    line: number;
  };
  /**
  * The message for this log object.
  * @example 'The "transform" hook used by the output plugin "rolldown-plugin-foo" is a build time hook and will not be run for that plugin. Either this plugin cannot be used as an output plugin, or it should have an option to configure it as an output plugin.'
  */
  message: string;
  meta?: any;
  names?: string[];
  plugin?: string;
  pluginCode?: unknown;
  pos?: number;
  reexporter?: string;
  stack?: string;
  url?: string;
}
/** @inline */
type RolldownLogWithString = RolldownLog | string;
/** @category Plugin APIs */
interface RolldownError extends RolldownLog {
  name?: string;
  stack?: string;
  watchFiles?: string[];
}
type LogOrStringHandler = (level: LogLevelWithError, log: RolldownLogWithString) => void; //#endregion
//#endregion
//#region node_modules/vite/node_modules/rolldown/node_modules/@oxc-project/types/types.d.ts
// Auto-generated code, DO NOT EDIT DIRECTLY!
// To edit this generated file you have to edit `tasks/ast_tools/src/generators/typescript.rs`.
interface Program extends Span {
  type: "Program";
  body: Array<Directive | Statement>;
  sourceType: ModuleKind;
  hashbang: Hashbang | null;
  parent?: null;
}
type Expression = BooleanLiteral | NullLiteral | NumericLiteral | BigIntLiteral | RegExpLiteral | StringLiteral | TemplateLiteral | IdentifierReference | MetaProperty | Super | ArrayExpression | ArrowFunctionExpression | AssignmentExpression | AwaitExpression | BinaryExpression | CallExpression | ChainExpression | Class | ConditionalExpression | Function$1 | ImportExpression | LogicalExpression | NewExpression | ObjectExpression | ParenthesizedExpression | SequenceExpression | TaggedTemplateExpression | ThisExpression | UnaryExpression | UpdateExpression | YieldExpression | PrivateInExpression | JSXElement | JSXFragment | TSAsExpression | TSSatisfiesExpression | TSTypeAssertion | TSNonNullExpression | TSInstantiationExpression | V8IntrinsicExpression | MemberExpression;
interface IdentifierName extends Span {
  type: "Identifier";
  decorators?: [];
  name: string;
  optional?: false;
  typeAnnotation?: null;
  parent?: Node$1;
}
interface IdentifierReference extends Span {
  type: "Identifier";
  decorators?: [];
  name: string;
  optional?: false;
  typeAnnotation?: null;
  parent?: Node$1;
}
interface BindingIdentifier extends Span {
  type: "Identifier";
  decorators?: [];
  name: string;
  optional?: false;
  typeAnnotation?: null;
  parent?: Node$1;
}
interface LabelIdentifier extends Span {
  type: "Identifier";
  decorators?: [];
  name: string;
  optional?: false;
  typeAnnotation?: null;
  parent?: Node$1;
}
interface ThisExpression extends Span {
  type: "ThisExpression";
  parent?: Node$1;
}
interface ArrayExpression extends Span {
  type: "ArrayExpression";
  elements: Array<ArrayExpressionElement>;
  parent?: Node$1;
}
type ArrayExpressionElement = SpreadElement | null | Expression;
interface ObjectExpression extends Span {
  type: "ObjectExpression";
  properties: Array<ObjectPropertyKind>;
  parent?: Node$1;
}
type ObjectPropertyKind = ObjectProperty | SpreadElement;
interface ObjectProperty extends Span {
  type: "Property";
  kind: PropertyKind;
  key: PropertyKey;
  value: Expression;
  method: boolean;
  shorthand: boolean;
  computed: boolean;
  optional?: false;
  parent?: Node$1;
}
type PropertyKey = IdentifierName | PrivateIdentifier | Expression;
type PropertyKind = "init" | "get" | "set";
interface TemplateLiteral extends Span {
  type: "TemplateLiteral";
  quasis: Array<TemplateElement>;
  expressions: Array<Expression>;
  parent?: Node$1;
}
interface TaggedTemplateExpression extends Span {
  type: "TaggedTemplateExpression";
  tag: Expression;
  typeArguments?: TSTypeParameterInstantiation | null;
  quasi: TemplateLiteral;
  parent?: Node$1;
}
interface TemplateElement extends Span {
  type: "TemplateElement";
  value: TemplateElementValue;
  tail: boolean;
  parent?: Node$1;
}
interface TemplateElementValue {
  raw: string;
  cooked: string | null;
}
type MemberExpression = ComputedMemberExpression | StaticMemberExpression | PrivateFieldExpression;
interface ComputedMemberExpression extends Span {
  type: "MemberExpression";
  object: Expression;
  property: Expression;
  optional: boolean;
  computed: true;
  parent?: Node$1;
}
interface StaticMemberExpression extends Span {
  type: "MemberExpression";
  object: Expression;
  property: IdentifierName;
  optional: boolean;
  computed: false;
  parent?: Node$1;
}
interface PrivateFieldExpression extends Span {
  type: "MemberExpression";
  object: Expression;
  property: PrivateIdentifier;
  optional: boolean;
  computed: false;
  parent?: Node$1;
}
interface CallExpression extends Span {
  type: "CallExpression";
  callee: Expression;
  typeArguments?: TSTypeParameterInstantiation | null;
  arguments: Array<Argument>;
  optional: boolean;
  parent?: Node$1;
}
interface NewExpression extends Span {
  type: "NewExpression";
  callee: Expression;
  typeArguments?: TSTypeParameterInstantiation | null;
  arguments: Array<Argument>;
  parent?: Node$1;
}
interface MetaProperty extends Span {
  type: "MetaProperty";
  meta: IdentifierName;
  property: IdentifierName;
  parent?: Node$1;
}
interface SpreadElement extends Span {
  type: "SpreadElement";
  argument: Expression;
  parent?: Node$1;
}
type Argument = SpreadElement | Expression;
interface UpdateExpression extends Span {
  type: "UpdateExpression";
  operator: UpdateOperator;
  prefix: boolean;
  argument: SimpleAssignmentTarget;
  parent?: Node$1;
}
interface UnaryExpression extends Span {
  type: "UnaryExpression";
  operator: UnaryOperator;
  argument: Expression;
  prefix: true;
  parent?: Node$1;
}
interface BinaryExpression extends Span {
  type: "BinaryExpression";
  left: Expression;
  operator: BinaryOperator;
  right: Expression;
  parent?: Node$1;
}
interface PrivateInExpression extends Span {
  type: "BinaryExpression";
  left: PrivateIdentifier;
  operator: "in";
  right: Expression;
  parent?: Node$1;
}
interface LogicalExpression extends Span {
  type: "LogicalExpression";
  left: Expression;
  operator: LogicalOperator;
  right: Expression;
  parent?: Node$1;
}
interface ConditionalExpression extends Span {
  type: "ConditionalExpression";
  test: Expression;
  consequent: Expression;
  alternate: Expression;
  parent?: Node$1;
}
interface AssignmentExpression extends Span {
  type: "AssignmentExpression";
  operator: AssignmentOperator;
  left: AssignmentTarget;
  right: Expression;
  parent?: Node$1;
}
type AssignmentTarget = SimpleAssignmentTarget | AssignmentTargetPattern;
type SimpleAssignmentTarget = IdentifierReference | TSAsExpression | TSSatisfiesExpression | TSNonNullExpression | TSTypeAssertion | MemberExpression;
type AssignmentTargetPattern = ArrayAssignmentTarget | ObjectAssignmentTarget;
interface ArrayAssignmentTarget extends Span {
  type: "ArrayPattern";
  decorators?: [];
  elements: Array<AssignmentTargetMaybeDefault | AssignmentTargetRest | null>;
  optional?: false;
  typeAnnotation?: null;
  parent?: Node$1;
}
interface ObjectAssignmentTarget extends Span {
  type: "ObjectPattern";
  decorators?: [];
  properties: Array<AssignmentTargetProperty | AssignmentTargetRest>;
  optional?: false;
  typeAnnotation?: null;
  parent?: Node$1;
}
interface AssignmentTargetRest extends Span {
  type: "RestElement";
  decorators?: [];
  argument: AssignmentTarget;
  optional?: false;
  typeAnnotation?: null;
  value?: null;
  parent?: Node$1;
}
type AssignmentTargetMaybeDefault = AssignmentTargetWithDefault | AssignmentTarget;
interface AssignmentTargetWithDefault extends Span {
  type: "AssignmentPattern";
  decorators?: [];
  left: AssignmentTarget;
  right: Expression;
  optional?: false;
  typeAnnotation?: null;
  parent?: Node$1;
}
type AssignmentTargetProperty = AssignmentTargetPropertyIdentifier | AssignmentTargetPropertyProperty;
interface AssignmentTargetPropertyIdentifier extends Span {
  type: "Property";
  kind: "init";
  key: IdentifierReference;
  value: IdentifierReference | AssignmentTargetWithDefault;
  method: false;
  shorthand: true;
  computed: false;
  optional?: false;
  parent?: Node$1;
}
interface AssignmentTargetPropertyProperty extends Span {
  type: "Property";
  kind: "init";
  key: PropertyKey;
  value: AssignmentTargetMaybeDefault;
  method: false;
  shorthand: false;
  computed: boolean;
  optional?: false;
  parent?: Node$1;
}
interface SequenceExpression extends Span {
  type: "SequenceExpression";
  expressions: Array<Expression>;
  parent?: Node$1;
}
interface Super extends Span {
  type: "Super";
  parent?: Node$1;
}
interface AwaitExpression extends Span {
  type: "AwaitExpression";
  argument: Expression;
  parent?: Node$1;
}
interface ChainExpression extends Span {
  type: "ChainExpression";
  expression: ChainElement;
  parent?: Node$1;
}
type ChainElement = CallExpression | TSNonNullExpression | MemberExpression;
interface ParenthesizedExpression extends Span {
  type: "ParenthesizedExpression";
  expression: Expression;
  parent?: Node$1;
}
type Statement = BlockStatement | BreakStatement | ContinueStatement | DebuggerStatement | DoWhileStatement | EmptyStatement | ExpressionStatement | ForInStatement | ForOfStatement | ForStatement | IfStatement | LabeledStatement | ReturnStatement | SwitchStatement | ThrowStatement | TryStatement | WhileStatement | WithStatement | Declaration$1 | ModuleDeclaration;
interface Directive extends Span {
  type: "ExpressionStatement";
  expression: StringLiteral;
  directive: string;
  parent?: Node$1;
}
interface Hashbang extends Span {
  type: "Hashbang";
  value: string;
  parent?: Node$1;
}
interface BlockStatement extends Span {
  type: "BlockStatement";
  body: Array<Statement>;
  parent?: Node$1;
}
type Declaration$1 = VariableDeclaration | Function$1 | Class | TSTypeAliasDeclaration | TSInterfaceDeclaration | TSEnumDeclaration | TSModuleDeclaration | TSGlobalDeclaration | TSImportEqualsDeclaration;
interface VariableDeclaration extends Span {
  type: "VariableDeclaration";
  kind: VariableDeclarationKind;
  declarations: Array<VariableDeclarator>;
  declare?: boolean;
  parent?: Node$1;
}
type VariableDeclarationKind = "var" | "let" | "const" | "using" | "await using";
interface VariableDeclarator extends Span {
  type: "VariableDeclarator";
  id: BindingPattern;
  init: Expression | null;
  definite?: boolean;
  parent?: Node$1;
}
interface EmptyStatement extends Span {
  type: "EmptyStatement";
  parent?: Node$1;
}
interface ExpressionStatement extends Span {
  type: "ExpressionStatement";
  expression: Expression;
  directive?: string | null;
  parent?: Node$1;
}
interface IfStatement extends Span {
  type: "IfStatement";
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
  parent?: Node$1;
}
interface DoWhileStatement extends Span {
  type: "DoWhileStatement";
  body: Statement;
  test: Expression;
  parent?: Node$1;
}
interface WhileStatement extends Span {
  type: "WhileStatement";
  test: Expression;
  body: Statement;
  parent?: Node$1;
}
interface ForStatement extends Span {
  type: "ForStatement";
  init: ForStatementInit | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
  parent?: Node$1;
}
type ForStatementInit = VariableDeclaration | Expression;
interface ForInStatement extends Span {
  type: "ForInStatement";
  left: ForStatementLeft;
  right: Expression;
  body: Statement;
  parent?: Node$1;
}
type ForStatementLeft = VariableDeclaration | AssignmentTarget;
interface ForOfStatement extends Span {
  type: "ForOfStatement";
  await: boolean;
  left: ForStatementLeft;
  right: Expression;
  body: Statement;
  parent?: Node$1;
}
interface ContinueStatement extends Span {
  type: "ContinueStatement";
  label: LabelIdentifier | null;
  parent?: Node$1;
}
interface BreakStatement extends Span {
  type: "BreakStatement";
  label: LabelIdentifier | null;
  parent?: Node$1;
}
interface ReturnStatement extends Span {
  type: "ReturnStatement";
  argument: Expression | null;
  parent?: Node$1;
}
interface WithStatement extends Span {
  type: "WithStatement";
  object: Expression;
  body: Statement;
  parent?: Node$1;
}
interface SwitchStatement extends Span {
  type: "SwitchStatement";
  discriminant: Expression;
  cases: Array<SwitchCase>;
  parent?: Node$1;
}
interface SwitchCase extends Span {
  type: "SwitchCase";
  test: Expression | null;
  consequent: Array<Statement>;
  parent?: Node$1;
}
interface LabeledStatement extends Span {
  type: "LabeledStatement";
  label: LabelIdentifier;
  body: Statement;
  parent?: Node$1;
}
interface ThrowStatement extends Span {
  type: "ThrowStatement";
  argument: Expression;
  parent?: Node$1;
}
interface TryStatement extends Span {
  type: "TryStatement";
  block: BlockStatement;
  handler: CatchClause | null;
  finalizer: BlockStatement | null;
  parent?: Node$1;
}
interface CatchClause extends Span {
  type: "CatchClause";
  param: BindingPattern | null;
  body: BlockStatement;
  parent?: Node$1;
}
interface DebuggerStatement extends Span {
  type: "DebuggerStatement";
  parent?: Node$1;
}
type BindingPattern = BindingIdentifier | ObjectPattern | ArrayPattern | AssignmentPattern;
interface AssignmentPattern extends Span {
  type: "AssignmentPattern";
  decorators?: [];
  left: BindingPattern;
  right: Expression;
  optional?: false;
  typeAnnotation?: null;
  parent?: Node$1;
}
interface ObjectPattern extends Span {
  type: "ObjectPattern";
  decorators?: [];
  properties: Array<BindingProperty | BindingRestElement>;
  optional?: false;
  typeAnnotation?: null;
  parent?: Node$1;
}
interface BindingProperty extends Span {
  type: "Property";
  kind: "init";
  key: PropertyKey;
  value: BindingPattern;
  method: false;
  shorthand: boolean;
  computed: boolean;
  optional?: false;
  parent?: Node$1;
}
interface ArrayPattern extends Span {
  type: "ArrayPattern";
  decorators?: [];
  elements: Array<BindingPattern | BindingRestElement | null>;
  optional?: false;
  typeAnnotation?: null;
  parent?: Node$1;
}
interface BindingRestElement extends Span {
  type: "RestElement";
  decorators?: [];
  argument: BindingPattern;
  optional?: false;
  typeAnnotation?: null;
  value?: null;
  parent?: Node$1;
}
interface Function$1 extends Span {
  type: FunctionType;
  id: BindingIdentifier | null;
  generator: boolean;
  async: boolean;
  declare?: boolean;
  typeParameters?: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType?: TSTypeAnnotation | null;
  body: FunctionBody | null;
  expression: false;
  parent?: Node$1;
}
type ParamPattern = FormalParameter | TSParameterProperty | FormalParameterRest;
type FunctionType = "FunctionDeclaration" | "FunctionExpression" | "TSDeclareFunction" | "TSEmptyBodyFunctionExpression";
interface FormalParameterRest extends Span {
  type: "RestElement";
  argument: BindingPattern;
  decorators?: [];
  optional?: boolean;
  typeAnnotation?: TSTypeAnnotation | null;
  value?: null;
  parent?: Node$1;
}
type FormalParameter = {
  decorators?: Array<Decorator>;
} & BindingPattern;
interface TSParameterProperty extends Span {
  type: "TSParameterProperty";
  accessibility: TSAccessibility | null;
  decorators: Array<Decorator>;
  override: boolean;
  parameter: FormalParameter;
  readonly: boolean;
  static: boolean;
  parent?: Node$1;
}
interface FunctionBody extends Span {
  type: "BlockStatement";
  body: Array<Directive | Statement>;
  parent?: Node$1;
}
interface ArrowFunctionExpression extends Span {
  type: "ArrowFunctionExpression";
  expression: boolean;
  async: boolean;
  typeParameters?: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType?: TSTypeAnnotation | null;
  body: FunctionBody | Expression;
  id: null;
  generator: false;
  parent?: Node$1;
}
interface YieldExpression extends Span {
  type: "YieldExpression";
  delegate: boolean;
  argument: Expression | null;
  parent?: Node$1;
}
interface Class extends Span {
  type: ClassType;
  decorators: Array<Decorator>;
  id: BindingIdentifier | null;
  typeParameters?: TSTypeParameterDeclaration | null;
  superClass: Expression | null;
  superTypeArguments?: TSTypeParameterInstantiation | null;
  implements?: Array<TSClassImplements>;
  body: ClassBody;
  abstract?: boolean;
  declare?: boolean;
  parent?: Node$1;
}
type ClassType = "ClassDeclaration" | "ClassExpression";
interface ClassBody extends Span {
  type: "ClassBody";
  body: Array<ClassElement>;
  parent?: Node$1;
}
type ClassElement = StaticBlock | MethodDefinition | PropertyDefinition | AccessorProperty | TSIndexSignature;
interface MethodDefinition extends Span {
  type: MethodDefinitionType;
  decorators: Array<Decorator>;
  key: PropertyKey;
  value: Function$1;
  kind: MethodDefinitionKind;
  computed: boolean;
  static: boolean;
  override?: boolean;
  optional?: boolean;
  accessibility?: TSAccessibility | null;
  parent?: Node$1;
}
type MethodDefinitionType = "MethodDefinition" | "TSAbstractMethodDefinition";
interface PropertyDefinition extends Span {
  type: PropertyDefinitionType;
  decorators: Array<Decorator>;
  key: PropertyKey;
  typeAnnotation?: TSTypeAnnotation | null;
  value: Expression | null;
  computed: boolean;
  static: boolean;
  declare?: boolean;
  override?: boolean;
  optional?: boolean;
  definite?: boolean;
  readonly?: boolean;
  accessibility?: TSAccessibility | null;
  parent?: Node$1;
}
type PropertyDefinitionType = "PropertyDefinition" | "TSAbstractPropertyDefinition";
type MethodDefinitionKind = "constructor" | "method" | "get" | "set";
interface PrivateIdentifier extends Span {
  type: "PrivateIdentifier";
  name: string;
  parent?: Node$1;
}
interface StaticBlock extends Span {
  type: "StaticBlock";
  body: Array<Statement>;
  parent?: Node$1;
}
type ModuleDeclaration = ImportDeclaration | ExportAllDeclaration | ExportDefaultDeclaration | ExportNamedDeclaration | TSExportAssignment | TSNamespaceExportDeclaration;
type AccessorPropertyType = "AccessorProperty" | "TSAbstractAccessorProperty";
interface AccessorProperty extends Span {
  type: AccessorPropertyType;
  decorators: Array<Decorator>;
  key: PropertyKey;
  typeAnnotation?: TSTypeAnnotation | null;
  value: Expression | null;
  computed: boolean;
  static: boolean;
  override?: boolean;
  definite?: boolean;
  accessibility?: TSAccessibility | null;
  declare?: false;
  optional?: false;
  readonly?: false;
  parent?: Node$1;
}
interface ImportExpression extends Span {
  type: "ImportExpression";
  source: Expression;
  options: Expression | null;
  phase: ImportPhase | null;
  parent?: Node$1;
}
interface ImportDeclaration extends Span {
  type: "ImportDeclaration";
  specifiers: Array<ImportDeclarationSpecifier>;
  source: StringLiteral;
  phase: ImportPhase | null;
  attributes: Array<ImportAttribute>;
  importKind?: ImportOrExportKind;
  parent?: Node$1;
}
type ImportPhase = "source" | "defer";
type ImportDeclarationSpecifier = ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier;
interface ImportSpecifier extends Span {
  type: "ImportSpecifier";
  imported: ModuleExportName;
  local: BindingIdentifier;
  importKind?: ImportOrExportKind;
  parent?: Node$1;
}
interface ImportDefaultSpecifier extends Span {
  type: "ImportDefaultSpecifier";
  local: BindingIdentifier;
  parent?: Node$1;
}
interface ImportNamespaceSpecifier extends Span {
  type: "ImportNamespaceSpecifier";
  local: BindingIdentifier;
  parent?: Node$1;
}
interface ImportAttribute extends Span {
  type: "ImportAttribute";
  key: ImportAttributeKey;
  value: StringLiteral;
  parent?: Node$1;
}
type ImportAttributeKey = IdentifierName | StringLiteral;
interface ExportNamedDeclaration extends Span {
  type: "ExportNamedDeclaration";
  declaration: Declaration$1 | null;
  specifiers: Array<ExportSpecifier>;
  source: StringLiteral | null;
  exportKind?: ImportOrExportKind;
  attributes: Array<ImportAttribute>;
  parent?: Node$1;
}
interface ExportDefaultDeclaration extends Span {
  type: "ExportDefaultDeclaration";
  declaration: ExportDefaultDeclarationKind;
  exportKind?: "value";
  parent?: Node$1;
}
interface ExportAllDeclaration extends Span {
  type: "ExportAllDeclaration";
  exported: ModuleExportName | null;
  source: StringLiteral;
  attributes: Array<ImportAttribute>;
  exportKind?: ImportOrExportKind;
  parent?: Node$1;
}
interface ExportSpecifier extends Span {
  type: "ExportSpecifier";
  local: ModuleExportName;
  exported: ModuleExportName;
  exportKind?: ImportOrExportKind;
  parent?: Node$1;
}
type ExportDefaultDeclarationKind = Function$1 | Class | TSInterfaceDeclaration | Expression;
type ModuleExportName = IdentifierName | IdentifierReference | StringLiteral;
interface V8IntrinsicExpression extends Span {
  type: "V8IntrinsicExpression";
  name: IdentifierName;
  arguments: Array<Argument>;
  parent?: Node$1;
}
interface BooleanLiteral extends Span {
  type: "Literal";
  value: boolean;
  raw: string | null;
  parent?: Node$1;
}
interface NullLiteral extends Span {
  type: "Literal";
  value: null;
  raw: "null" | null;
  parent?: Node$1;
}
interface NumericLiteral extends Span {
  type: "Literal";
  value: number;
  raw: string | null;
  parent?: Node$1;
}
interface StringLiteral extends Span {
  type: "Literal";
  value: string;
  raw: string | null;
  parent?: Node$1;
}
interface BigIntLiteral extends Span {
  type: "Literal";
  value: bigint;
  raw: string | null;
  bigint: string;
  parent?: Node$1;
}
interface RegExpLiteral extends Span {
  type: "Literal";
  value: RegExp | null;
  raw: string | null;
  regex: {
    pattern: string;
    flags: string;
  };
  parent?: Node$1;
}
interface JSXElement extends Span {
  type: "JSXElement";
  openingElement: JSXOpeningElement;
  children: Array<JSXChild>;
  closingElement: JSXClosingElement | null;
  parent?: Node$1;
}
interface JSXOpeningElement extends Span {
  type: "JSXOpeningElement";
  name: JSXElementName;
  typeArguments?: TSTypeParameterInstantiation | null;
  attributes: Array<JSXAttributeItem>;
  selfClosing: boolean;
  parent?: Node$1;
}
interface JSXClosingElement extends Span {
  type: "JSXClosingElement";
  name: JSXElementName;
  parent?: Node$1;
}
interface JSXFragment extends Span {
  type: "JSXFragment";
  openingFragment: JSXOpeningFragment;
  children: Array<JSXChild>;
  closingFragment: JSXClosingFragment;
  parent?: Node$1;
}
interface JSXOpeningFragment extends Span {
  type: "JSXOpeningFragment";
  attributes?: [];
  selfClosing?: false;
  parent?: Node$1;
}
interface JSXClosingFragment extends Span {
  type: "JSXClosingFragment";
  parent?: Node$1;
}
type JSXElementName = JSXIdentifier | JSXNamespacedName | JSXMemberExpression;
interface JSXNamespacedName extends Span {
  type: "JSXNamespacedName";
  namespace: JSXIdentifier;
  name: JSXIdentifier;
  parent?: Node$1;
}
interface JSXMemberExpression extends Span {
  type: "JSXMemberExpression";
  object: JSXMemberExpressionObject;
  property: JSXIdentifier;
  parent?: Node$1;
}
type JSXMemberExpressionObject = JSXIdentifier | JSXMemberExpression;
interface JSXExpressionContainer extends Span {
  type: "JSXExpressionContainer";
  expression: JSXExpression;
  parent?: Node$1;
}
type JSXExpression = JSXEmptyExpression | Expression;
interface JSXEmptyExpression extends Span {
  type: "JSXEmptyExpression";
  parent?: Node$1;
}
type JSXAttributeItem = JSXAttribute | JSXSpreadAttribute;
interface JSXAttribute extends Span {
  type: "JSXAttribute";
  name: JSXAttributeName;
  value: JSXAttributeValue | null;
  parent?: Node$1;
}
interface JSXSpreadAttribute extends Span {
  type: "JSXSpreadAttribute";
  argument: Expression;
  parent?: Node$1;
}
type JSXAttributeName = JSXIdentifier | JSXNamespacedName;
type JSXAttributeValue = StringLiteral | JSXExpressionContainer | JSXElement | JSXFragment;
interface JSXIdentifier extends Span {
  type: "JSXIdentifier";
  name: string;
  parent?: Node$1;
}
type JSXChild = JSXText | JSXElement | JSXFragment | JSXExpressionContainer | JSXSpreadChild;
interface JSXSpreadChild extends Span {
  type: "JSXSpreadChild";
  expression: Expression;
  parent?: Node$1;
}
interface JSXText extends Span {
  type: "JSXText";
  value: string;
  raw: string | null;
  parent?: Node$1;
}
interface TSThisParameter extends Span {
  type: "Identifier";
  decorators: [];
  name: "this";
  optional: false;
  typeAnnotation: TSTypeAnnotation | null;
  parent?: Node$1;
}
interface TSEnumDeclaration extends Span {
  type: "TSEnumDeclaration";
  id: BindingIdentifier;
  body: TSEnumBody;
  const: boolean;
  declare: boolean;
  parent?: Node$1;
}
interface TSEnumBody extends Span {
  type: "TSEnumBody";
  members: Array<TSEnumMember>;
  parent?: Node$1;
}
interface TSEnumMember extends Span {
  type: "TSEnumMember";
  id: TSEnumMemberName;
  initializer: Expression | null;
  computed: boolean;
  parent?: Node$1;
}
type TSEnumMemberName = IdentifierName | StringLiteral | TemplateLiteral;
interface TSTypeAnnotation extends Span {
  type: "TSTypeAnnotation";
  typeAnnotation: TSType;
  parent?: Node$1;
}
interface TSLiteralType extends Span {
  type: "TSLiteralType";
  literal: TSLiteral;
  parent?: Node$1;
}
type TSLiteral = BooleanLiteral | NumericLiteral | BigIntLiteral | StringLiteral | TemplateLiteral | UnaryExpression;
type TSType = TSAnyKeyword | TSBigIntKeyword | TSBooleanKeyword | TSIntrinsicKeyword | TSNeverKeyword | TSNullKeyword | TSNumberKeyword | TSObjectKeyword | TSStringKeyword | TSSymbolKeyword | TSUndefinedKeyword | TSUnknownKeyword | TSVoidKeyword | TSArrayType | TSConditionalType | TSConstructorType | TSFunctionType | TSImportType | TSIndexedAccessType | TSInferType | TSIntersectionType | TSLiteralType | TSMappedType | TSNamedTupleMember | TSTemplateLiteralType | TSThisType | TSTupleType | TSTypeLiteral | TSTypeOperator | TSTypePredicate | TSTypeQuery | TSTypeReference | TSUnionType | TSParenthesizedType | JSDocNullableType | JSDocNonNullableType | JSDocUnknownType;
interface TSConditionalType extends Span {
  type: "TSConditionalType";
  checkType: TSType;
  extendsType: TSType;
  trueType: TSType;
  falseType: TSType;
  parent?: Node$1;
}
interface TSUnionType extends Span {
  type: "TSUnionType";
  types: Array<TSType>;
  parent?: Node$1;
}
interface TSIntersectionType extends Span {
  type: "TSIntersectionType";
  types: Array<TSType>;
  parent?: Node$1;
}
interface TSParenthesizedType extends Span {
  type: "TSParenthesizedType";
  typeAnnotation: TSType;
  parent?: Node$1;
}
interface TSTypeOperator extends Span {
  type: "TSTypeOperator";
  operator: TSTypeOperatorOperator;
  typeAnnotation: TSType;
  parent?: Node$1;
}
type TSTypeOperatorOperator = "keyof" | "unique" | "readonly";
interface TSArrayType extends Span {
  type: "TSArrayType";
  elementType: TSType;
  parent?: Node$1;
}
interface TSIndexedAccessType extends Span {
  type: "TSIndexedAccessType";
  objectType: TSType;
  indexType: TSType;
  parent?: Node$1;
}
interface TSTupleType extends Span {
  type: "TSTupleType";
  elementTypes: Array<TSTupleElement>;
  parent?: Node$1;
}
interface TSNamedTupleMember extends Span {
  type: "TSNamedTupleMember";
  label: IdentifierName;
  elementType: TSTupleElement;
  optional: boolean;
  parent?: Node$1;
}
interface TSOptionalType extends Span {
  type: "TSOptionalType";
  typeAnnotation: TSType;
  parent?: Node$1;
}
interface TSRestType extends Span {
  type: "TSRestType";
  typeAnnotation: TSType;
  parent?: Node$1;
}
type TSTupleElement = TSOptionalType | TSRestType | TSType;
interface TSAnyKeyword extends Span {
  type: "TSAnyKeyword";
  parent?: Node$1;
}
interface TSStringKeyword extends Span {
  type: "TSStringKeyword";
  parent?: Node$1;
}
interface TSBooleanKeyword extends Span {
  type: "TSBooleanKeyword";
  parent?: Node$1;
}
interface TSNumberKeyword extends Span {
  type: "TSNumberKeyword";
  parent?: Node$1;
}
interface TSNeverKeyword extends Span {
  type: "TSNeverKeyword";
  parent?: Node$1;
}
interface TSIntrinsicKeyword extends Span {
  type: "TSIntrinsicKeyword";
  parent?: Node$1;
}
interface TSUnknownKeyword extends Span {
  type: "TSUnknownKeyword";
  parent?: Node$1;
}
interface TSNullKeyword extends Span {
  type: "TSNullKeyword";
  parent?: Node$1;
}
interface TSUndefinedKeyword extends Span {
  type: "TSUndefinedKeyword";
  parent?: Node$1;
}
interface TSVoidKeyword extends Span {
  type: "TSVoidKeyword";
  parent?: Node$1;
}
interface TSSymbolKeyword extends Span {
  type: "TSSymbolKeyword";
  parent?: Node$1;
}
interface TSThisType extends Span {
  type: "TSThisType";
  parent?: Node$1;
}
interface TSObjectKeyword extends Span {
  type: "TSObjectKeyword";
  parent?: Node$1;
}
interface TSBigIntKeyword extends Span {
  type: "TSBigIntKeyword";
  parent?: Node$1;
}
interface TSTypeReference extends Span {
  type: "TSTypeReference";
  typeName: TSTypeName;
  typeArguments: TSTypeParameterInstantiation | null;
  parent?: Node$1;
}
type TSTypeName = IdentifierReference | TSQualifiedName | ThisExpression;
interface TSQualifiedName extends Span {
  type: "TSQualifiedName";
  left: TSTypeName;
  right: IdentifierName;
  parent?: Node$1;
}
interface TSTypeParameterInstantiation extends Span {
  type: "TSTypeParameterInstantiation";
  params: Array<TSType>;
  parent?: Node$1;
}
interface TSTypeParameter extends Span {
  type: "TSTypeParameter";
  name: BindingIdentifier;
  constraint: TSType | null;
  default: TSType | null;
  in: boolean;
  out: boolean;
  const: boolean;
  parent?: Node$1;
}
interface TSTypeParameterDeclaration extends Span {
  type: "TSTypeParameterDeclaration";
  params: Array<TSTypeParameter>;
  parent?: Node$1;
}
interface TSTypeAliasDeclaration extends Span {
  type: "TSTypeAliasDeclaration";
  id: BindingIdentifier;
  typeParameters: TSTypeParameterDeclaration | null;
  typeAnnotation: TSType;
  declare: boolean;
  parent?: Node$1;
}
type TSAccessibility = "private" | "protected" | "public";
interface TSClassImplements extends Span {
  type: "TSClassImplements";
  expression: IdentifierReference | ThisExpression | MemberExpression;
  typeArguments: TSTypeParameterInstantiation | null;
  parent?: Node$1;
}
interface TSInterfaceDeclaration extends Span {
  type: "TSInterfaceDeclaration";
  id: BindingIdentifier;
  typeParameters: TSTypeParameterDeclaration | null;
  extends: Array<TSInterfaceHeritage>;
  body: TSInterfaceBody;
  declare: boolean;
  parent?: Node$1;
}
interface TSInterfaceBody extends Span {
  type: "TSInterfaceBody";
  body: Array<TSSignature>;
  parent?: Node$1;
}
interface TSPropertySignature extends Span {
  type: "TSPropertySignature";
  computed: boolean;
  optional: boolean;
  readonly: boolean;
  key: PropertyKey;
  typeAnnotation: TSTypeAnnotation | null;
  accessibility: null;
  static: false;
  parent?: Node$1;
}
type TSSignature = TSIndexSignature | TSPropertySignature | TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSMethodSignature;
interface TSIndexSignature extends Span {
  type: "TSIndexSignature";
  parameters: Array<TSIndexSignatureName>;
  typeAnnotation: TSTypeAnnotation;
  readonly: boolean;
  static: boolean;
  accessibility: null;
  parent?: Node$1;
}
interface TSCallSignatureDeclaration extends Span {
  type: "TSCallSignatureDeclaration";
  typeParameters: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType: TSTypeAnnotation | null;
  parent?: Node$1;
}
type TSMethodSignatureKind = "method" | "get" | "set";
interface TSMethodSignature extends Span {
  type: "TSMethodSignature";
  key: PropertyKey;
  computed: boolean;
  optional: boolean;
  kind: TSMethodSignatureKind;
  typeParameters: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType: TSTypeAnnotation | null;
  accessibility: null;
  readonly: false;
  static: false;
  parent?: Node$1;
}
interface TSConstructSignatureDeclaration extends Span {
  type: "TSConstructSignatureDeclaration";
  typeParameters: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType: TSTypeAnnotation | null;
  parent?: Node$1;
}
interface TSIndexSignatureName extends Span {
  type: "Identifier";
  decorators: [];
  name: string;
  optional: false;
  typeAnnotation: TSTypeAnnotation;
  parent?: Node$1;
}
interface TSInterfaceHeritage extends Span {
  type: "TSInterfaceHeritage";
  expression: Expression;
  typeArguments: TSTypeParameterInstantiation | null;
  parent?: Node$1;
}
interface TSTypePredicate extends Span {
  type: "TSTypePredicate";
  parameterName: TSTypePredicateName;
  asserts: boolean;
  typeAnnotation: TSTypeAnnotation | null;
  parent?: Node$1;
}
type TSTypePredicateName = IdentifierName | TSThisType;
interface TSModuleDeclaration extends Span {
  type: "TSModuleDeclaration";
  id: BindingIdentifier | StringLiteral | TSQualifiedName;
  body: TSModuleBlock | null;
  kind: TSModuleDeclarationKind;
  declare: boolean;
  global: false;
  parent?: Node$1;
}
type TSModuleDeclarationKind = "module" | "namespace";
interface TSGlobalDeclaration extends Span {
  type: "TSModuleDeclaration";
  id: IdentifierName;
  body: TSModuleBlock;
  kind: "global";
  declare: boolean;
  global: true;
  parent?: Node$1;
}
interface TSModuleBlock extends Span {
  type: "TSModuleBlock";
  body: Array<Directive | Statement>;
  parent?: Node$1;
}
interface TSTypeLiteral extends Span {
  type: "TSTypeLiteral";
  members: Array<TSSignature>;
  parent?: Node$1;
}
interface TSInferType extends Span {
  type: "TSInferType";
  typeParameter: TSTypeParameter;
  parent?: Node$1;
}
interface TSTypeQuery extends Span {
  type: "TSTypeQuery";
  exprName: TSTypeQueryExprName;
  typeArguments: TSTypeParameterInstantiation | null;
  parent?: Node$1;
}
type TSTypeQueryExprName = TSImportType | TSTypeName;
interface TSImportType extends Span {
  type: "TSImportType";
  source: StringLiteral;
  options: ObjectExpression | null;
  qualifier: TSImportTypeQualifier | null;
  typeArguments: TSTypeParameterInstantiation | null;
  parent?: Node$1;
}
type TSImportTypeQualifier = IdentifierName | TSImportTypeQualifiedName;
interface TSImportTypeQualifiedName extends Span {
  type: "TSQualifiedName";
  left: TSImportTypeQualifier;
  right: IdentifierName;
  parent?: Node$1;
}
interface TSFunctionType extends Span {
  type: "TSFunctionType";
  typeParameters: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType: TSTypeAnnotation;
  parent?: Node$1;
}
interface TSConstructorType extends Span {
  type: "TSConstructorType";
  abstract: boolean;
  typeParameters: TSTypeParameterDeclaration | null;
  params: ParamPattern[];
  returnType: TSTypeAnnotation;
  parent?: Node$1;
}
interface TSMappedType extends Span {
  type: "TSMappedType";
  key: BindingIdentifier;
  constraint: TSType;
  nameType: TSType | null;
  typeAnnotation: TSType | null;
  optional: TSMappedTypeModifierOperator | false;
  readonly: TSMappedTypeModifierOperator | null;
  parent?: Node$1;
}
type TSMappedTypeModifierOperator = true | "+" | "-";
interface TSTemplateLiteralType extends Span {
  type: "TSTemplateLiteralType";
  quasis: Array<TemplateElement>;
  types: Array<TSType>;
  parent?: Node$1;
}
interface TSAsExpression extends Span {
  type: "TSAsExpression";
  expression: Expression;
  typeAnnotation: TSType;
  parent?: Node$1;
}
interface TSSatisfiesExpression extends Span {
  type: "TSSatisfiesExpression";
  expression: Expression;
  typeAnnotation: TSType;
  parent?: Node$1;
}
interface TSTypeAssertion extends Span {
  type: "TSTypeAssertion";
  typeAnnotation: TSType;
  expression: Expression;
  parent?: Node$1;
}
interface TSImportEqualsDeclaration extends Span {
  type: "TSImportEqualsDeclaration";
  id: BindingIdentifier;
  moduleReference: TSModuleReference;
  importKind: ImportOrExportKind;
  parent?: Node$1;
}
type TSModuleReference = TSExternalModuleReference | IdentifierReference | TSQualifiedName;
interface TSExternalModuleReference extends Span {
  type: "TSExternalModuleReference";
  expression: StringLiteral;
  parent?: Node$1;
}
interface TSNonNullExpression extends Span {
  type: "TSNonNullExpression";
  expression: Expression;
  parent?: Node$1;
}
interface Decorator extends Span {
  type: "Decorator";
  expression: Expression;
  parent?: Node$1;
}
interface TSExportAssignment extends Span {
  type: "TSExportAssignment";
  expression: Expression;
  parent?: Node$1;
}
interface TSNamespaceExportDeclaration extends Span {
  type: "TSNamespaceExportDeclaration";
  id: IdentifierName;
  parent?: Node$1;
}
interface TSInstantiationExpression extends Span {
  type: "TSInstantiationExpression";
  expression: Expression;
  typeArguments: TSTypeParameterInstantiation;
  parent?: Node$1;
}
type ImportOrExportKind = "value" | "type";
interface JSDocNullableType extends Span {
  type: "TSJSDocNullableType";
  typeAnnotation: TSType;
  postfix: boolean;
  parent?: Node$1;
}
interface JSDocNonNullableType extends Span {
  type: "TSJSDocNonNullableType";
  typeAnnotation: TSType;
  postfix: boolean;
  parent?: Node$1;
}
interface JSDocUnknownType extends Span {
  type: "TSJSDocUnknownType";
  parent?: Node$1;
}
type ModuleKind = "script" | "module" | "commonjs";
interface Span {
  start: number;
  end: number;
  range?: [number, number];
}
type AssignmentOperator = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "**=" | "<<=" | ">>=" | ">>>=" | "|=" | "^=" | "&=" | "||=" | "&&=" | "??=";
type BinaryOperator = "==" | "!=" | "===" | "!==" | "<" | "<=" | ">" | ">=" | "+" | "-" | "*" | "/" | "%" | "**" | "<<" | ">>" | ">>>" | "|" | "^" | "&" | "in" | "instanceof";
type LogicalOperator = "||" | "&&" | "??";
type UnaryOperator = "+" | "-" | "!" | "~" | "typeof" | "void" | "delete";
type UpdateOperator = "++" | "--";
type Node$1 = Program | IdentifierName | IdentifierReference | BindingIdentifier | LabelIdentifier | ThisExpression | ArrayExpression | ObjectExpression | ObjectProperty | TemplateLiteral | TaggedTemplateExpression | TemplateElement | ComputedMemberExpression | StaticMemberExpression | PrivateFieldExpression | CallExpression | NewExpression | MetaProperty | SpreadElement | UpdateExpression | UnaryExpression | BinaryExpression | PrivateInExpression | LogicalExpression | ConditionalExpression | AssignmentExpression | ArrayAssignmentTarget | ObjectAssignmentTarget | AssignmentTargetRest | AssignmentTargetWithDefault | AssignmentTargetPropertyIdentifier | AssignmentTargetPropertyProperty | SequenceExpression | Super | AwaitExpression | ChainExpression | ParenthesizedExpression | Directive | Hashbang | BlockStatement | VariableDeclaration | VariableDeclarator | EmptyStatement | ExpressionStatement | IfStatement | DoWhileStatement | WhileStatement | ForStatement | ForInStatement | ForOfStatement | ContinueStatement | BreakStatement | ReturnStatement | WithStatement | SwitchStatement | SwitchCase | LabeledStatement | ThrowStatement | TryStatement | CatchClause | DebuggerStatement | AssignmentPattern | ObjectPattern | BindingProperty | ArrayPattern | BindingRestElement | Function$1 | FunctionBody | ArrowFunctionExpression | YieldExpression | Class | ClassBody | MethodDefinition | PropertyDefinition | PrivateIdentifier | StaticBlock | AccessorProperty | ImportExpression | ImportDeclaration | ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportAttribute | ExportNamedDeclaration | ExportDefaultDeclaration | ExportAllDeclaration | ExportSpecifier | V8IntrinsicExpression | BooleanLiteral | NullLiteral | NumericLiteral | StringLiteral | BigIntLiteral | RegExpLiteral | JSXElement | JSXOpeningElement | JSXClosingElement | JSXFragment | JSXOpeningFragment | JSXClosingFragment | JSXNamespacedName | JSXMemberExpression | JSXExpressionContainer | JSXEmptyExpression | JSXAttribute | JSXSpreadAttribute | JSXIdentifier | JSXSpreadChild | JSXText | TSThisParameter | TSEnumDeclaration | TSEnumBody | TSEnumMember | TSTypeAnnotation | TSLiteralType | TSConditionalType | TSUnionType | TSIntersectionType | TSParenthesizedType | TSTypeOperator | TSArrayType | TSIndexedAccessType | TSTupleType | TSNamedTupleMember | TSOptionalType | TSRestType | TSAnyKeyword | TSStringKeyword | TSBooleanKeyword | TSNumberKeyword | TSNeverKeyword | TSIntrinsicKeyword | TSUnknownKeyword | TSNullKeyword | TSUndefinedKeyword | TSVoidKeyword | TSSymbolKeyword | TSThisType | TSObjectKeyword | TSBigIntKeyword | TSTypeReference | TSQualifiedName | TSTypeParameterInstantiation | TSTypeParameter | TSTypeParameterDeclaration | TSTypeAliasDeclaration | TSClassImplements | TSInterfaceDeclaration | TSInterfaceBody | TSPropertySignature | TSIndexSignature | TSCallSignatureDeclaration | TSMethodSignature | TSConstructSignatureDeclaration | TSIndexSignatureName | TSInterfaceHeritage | TSTypePredicate | TSModuleDeclaration | TSGlobalDeclaration | TSModuleBlock | TSTypeLiteral | TSInferType | TSTypeQuery | TSImportType | TSImportTypeQualifiedName | TSFunctionType | TSConstructorType | TSMappedType | TSTemplateLiteralType | TSAsExpression | TSSatisfiesExpression | TSTypeAssertion | TSImportEqualsDeclaration | TSExternalModuleReference | TSNonNullExpression | Decorator | TSExportAssignment | TSNamespaceExportDeclaration | TSInstantiationExpression | JSDocNullableType | JSDocNonNullableType | JSDocUnknownType | ParamPattern;
//#endregion
//#region node_modules/vite/node_modules/rolldown/dist/shared/binding-DUEnSb0A.d.mts
interface CodegenOptions {
  /**
   * Remove whitespace.
   *
   * @default true
   */
  removeWhitespace?: boolean;
}
interface CompressOptions {
  /**
   * Set desired EcmaScript standard version for output.
   *
   * Set `esnext` to enable all target highering.
   *
   * Example:
   *
   * * `'es2015'`
   * * `['es2020', 'chrome58', 'edge16', 'firefox57', 'node12', 'safari11']`
   *
   * @default 'esnext'
   *
   * @see [esbuild#target](https://esbuild.github.io/api/#target)
   */
  target?: string | Array<string>;
  /**
   * Pass true to discard calls to `console.*`.
   *
   * @default false
   */
  dropConsole?: boolean;
  /**
   * Remove `debugger;` statements.
   *
   * @default true
   */
  dropDebugger?: boolean;
  /**
   * Pass `true` to drop unreferenced functions and variables.
   *
   * Simple direct variable assignments do not count as references unless set to `keep_assign`.
   * @default true
   */
  unused?: boolean | 'keep_assign';
  /** Keep function / class names. */
  keepNames?: CompressOptionsKeepNames;
  /**
   * Join consecutive var, let and const statements.
   *
   * @default true
   */
  joinVars?: boolean;
  /**
   * Join consecutive simple statements using the comma operator.
   *
   * `a; b` -> `a, b`
   *
   * @default true
   */
  sequences?: boolean;
  /**
   * Set of label names to drop from the code.
   *
   * Labeled statements matching these names will be removed during minification.
   *
   * @default []
   */
  dropLabels?: Array<string>;
  /** Limit the maximum number of iterations for debugging purpose. */
  maxIterations?: number;
  /** Treeshake options. */
  treeshake?: TreeShakeOptions;
}
interface CompressOptionsKeepNames {
  /**
   * Keep function names so that `Function.prototype.name` is preserved.
   *
   * This does not guarantee that the `undefined` name is preserved.
   *
   * @default false
   */
  function: boolean;
  /**
   * Keep class names so that `Class.prototype.name` is preserved.
   *
   * This does not guarantee that the `undefined` name is preserved.
   *
   * @default false
   */
  class: boolean;
}
interface MangleOptions {
  /**
   * Pass `true` to mangle names declared in the top level scope.
   *
   * @default true for modules and commonjs, otherwise false
   */
  toplevel?: boolean;
  /**
   * Preserve `name` property for functions and classes.
   *
   * @default false
   */
  keepNames?: boolean | MangleOptionsKeepNames;
  /** Debug mangled names. */
  debug?: boolean;
}
interface MangleOptionsKeepNames {
  /**
   * Preserve `name` property for functions.
   *
   * @default false
   */
  function: boolean;
  /**
   * Preserve `name` property for classes.
   *
   * @default false
   */
  class: boolean;
}
interface MinifyOptions$1 {
  /** Use when minifying an ES module. */
  module?: boolean;
  compress?: boolean | CompressOptions;
  mangle?: boolean | MangleOptions;
  codegen?: boolean | CodegenOptions;
  sourcemap?: boolean;
}
interface TreeShakeOptions {
  /**
   * Whether to respect the pure annotations.
   *
   * Pure annotations are comments that mark an expression as pure.
   * For example: @__PURE__ or #__NO_SIDE_EFFECTS__.
   *
   * @default true
   */
  annotations?: boolean;
  /**
   * Whether to treat this function call as pure.
   *
   * This function is called for normal function calls, new calls, and
   * tagged template calls.
   */
  manualPureFunctions?: Array<string>;
  /**
   * Whether property read accesses have side effects.
   *
   * @default 'always'
   */
  propertyReadSideEffects?: boolean | 'always';
  /**
   * Whether accessing a global variable has side effects.
   *
   * Accessing a non-existing global variable will throw an error.
   * Global variable may be a getter that has side effects.
   *
   * @default true
   */
  unknownGlobalSideEffects?: boolean;
  /**
   * Whether invalid import statements have side effects.
   *
   * Accessing a non-existing import name will throw an error.
   * Also import statements that cannot be resolved will throw an error.
   *
   * @default true
   */
  invalidImportSideEffects?: boolean;
}
interface ParserOptions {
  /** Treat the source text as `js`, `jsx`, `ts`, `tsx` or `dts`. */
  lang?: 'js' | 'jsx' | 'ts' | 'tsx' | 'dts';
  /** Treat the source text as `script` or `module` code. */
  sourceType?: 'script' | 'module' | 'commonjs' | 'unambiguous' | undefined;
  /**
   * Return an AST which includes TypeScript-related properties, or excludes them.
   *
   * `'js'` is default for JS / JSX files.
   * `'ts'` is default for TS / TSX files.
   * The type of the file is determined from `lang` option, or extension of provided `filename`.
   */
  astType?: 'js' | 'ts';
  /**
   * Controls whether the `range` property is included on AST nodes.
   * The `range` property is a `[number, number]` which indicates the start/end offsets
   * of the node in the file contents.
   *
   * @default false
   */
  range?: boolean;
  /**
   * Emit `ParenthesizedExpression` and `TSParenthesizedType` in AST.
   *
   * If this option is true, parenthesized expressions are represented by
   * (non-standard) `ParenthesizedExpression` and `TSParenthesizedType` nodes that
   * have a single `expression` property containing the expression inside parentheses.
   *
   * @default true
   */
  preserveParens?: boolean;
  /**
   * Produce semantic errors with an additional AST pass.
   * Semantic errors depend on symbols and scopes, where the parser does not construct.
   * This adds a small performance overhead.
   *
   * @default false
   */
  showSemanticErrors?: boolean;
}
interface SourceMap$2 {
  file?: string;
  mappings: string;
  names: Array<string>;
  sourceRoot?: string;
  sources: Array<string>;
  sourcesContent?: Array<string>;
  version: number;
  x_google_ignoreList?: Array<number>;
}
interface CompilerAssumptions {
  ignoreFunctionLength?: boolean;
  noDocumentAll?: boolean;
  objectRestNoSymbols?: boolean;
  pureGetters?: boolean;
  /**
   * When using public class fields, assume that they don't shadow any getter in the current class,
   * in its subclasses or in its superclass. Thus, it's safe to assign them rather than using
   * `Object.defineProperty`.
   *
   * For example:
   *
   * Input:
   * ```js
   * class Test {
   *  field = 2;
   *
   *  static staticField = 3;
   * }
   * ```
   *
   * When `set_public_class_fields` is `true`, the output will be:
   * ```js
   * class Test {
   *  constructor() {
   *    this.field = 2;
   *  }
   * }
   * Test.staticField = 3;
   * ```
   *
   * Otherwise, the output will be:
   * ```js
   * import _defineProperty from "@oxc-project/runtime/helpers/defineProperty";
   * class Test {
   *   constructor() {
   *     _defineProperty(this, "field", 2);
   *   }
   * }
   * _defineProperty(Test, "staticField", 3);
   * ```
   *
   * NOTE: For TypeScript, if you wanted behavior is equivalent to `useDefineForClassFields: false`, you should
   * set both `set_public_class_fields` and [`crate::TypeScriptOptions::remove_class_fields_without_initializer`]
   * to `true`.
   */
  setPublicClassFields?: boolean;
}
interface DecoratorOptions {
  /**
   * Enables experimental support for decorators, which is a version of decorators that predates the TC39 standardization process.
   *
   * Decorators are a language feature which hasn’t yet been fully ratified into the JavaScript specification.
   * This means that the implementation version in TypeScript may differ from the implementation in JavaScript when it it decided by TC39.
   *
   * @see https://www.typescriptlang.org/tsconfig/#experimentalDecorators
   * @default false
   */
  legacy?: boolean;
  /**
   * Enables emitting decorator metadata.
   *
   * This option the same as [emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata)
   * in TypeScript, and it only works when `legacy` is true.
   *
   * @see https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata
   * @default false
   */
  emitDecoratorMetadata?: boolean;
}
type HelperMode =
/**
* Runtime mode (default): Helper functions are imported from a runtime package.
*
* Example:
*
* ```js
* import helperName from "@oxc-project/runtime/helpers/helperName";
* helperName(...arguments);
* ```
*/
'Runtime' |
/**
 * External mode: Helper functions are accessed from a global `babelHelpers` object.
 *
 * Example:
 *
 * ```js
 * babelHelpers.helperName(...arguments);
 * ```
 */
'External';
interface Helpers$1 {
  mode?: HelperMode;
}
/**
 * TypeScript Isolated Declarations for Standalone DTS Emit (async)
 *
 * Note: This function can be slower than `isolatedDeclarationSync` due to the overhead of spawning a thread.
 */
interface IsolatedDeclarationsOptions {
  /**
   * Do not emit declarations for code that has an @internal annotation in its JSDoc comment.
   * This is an internal compiler option; use at your own risk, because the compiler does not check that the result is valid.
   *
   * Default: `false`
   *
   * See <https://www.typescriptlang.org/tsconfig/#stripInternal>
   */
  stripInternal?: boolean;
  sourcemap?: boolean;
}
/**
 * Configure how TSX and JSX are transformed.
 *
 * @see {@link https://oxc.rs/docs/guide/usage/transformer/jsx}
 */
interface JsxOptions {
  /**
   * Decides which runtime to use.
   *
   * - 'automatic' - auto-import the correct JSX factories
   * - 'classic' - no auto-import
   *
   * @default 'automatic'
   */
  runtime?: 'classic' | 'automatic';
  /**
   * Emit development-specific information, such as `__source` and `__self`.
   *
   * @default false
   */
  development?: boolean;
  /**
   * Toggles whether or not to throw an error if an XML namespaced tag name
   * is used.
   *
   * Though the JSX spec allows this, it is disabled by default since React's
   * JSX does not currently have support for it.
   *
   * @default true
   */
  throwIfNamespace?: boolean;
  /**
   * Mark JSX elements and top-level React method calls as pure for tree shaking.
   *
   * @default true
   */
  pure?: boolean;
  /**
   * Replaces the import source when importing functions.
   *
   * @default 'react'
   */
  importSource?: string;
  /**
   * Replace the function used when compiling JSX expressions. It should be a
   * qualified name (e.g. `React.createElement`) or an identifier (e.g.
   * `createElement`).
   *
   * Only used for `classic` {@link runtime}.
   *
   * @default 'React.createElement'
   */
  pragma?: string;
  /**
   * Replace the component used when compiling JSX fragments. It should be a
   * valid JSX tag name.
   *
   * Only used for `classic` {@link runtime}.
   *
   * @default 'React.Fragment'
   */
  pragmaFrag?: string;
  /**
   * Enable React Fast Refresh .
   *
   * Conforms to the implementation in {@link https://github.com/facebook/react/tree/v18.3.1/packages/react-refresh}
   *
   * @default false
   */
  refresh?: boolean | ReactRefreshOptions;
}
/**
 * Transform JavaScript code to a Vite Node runnable module.
 *
 * @param filename The name of the file being transformed.
 * @param sourceText the source code itself
 * @param options The options for the transformation. See {@link
 * ModuleRunnerTransformOptions} for more information.
 *
 * @returns an object containing the transformed code, source maps, and any
 * errors that occurred during parsing or transformation.
 *
 * Note: This function can be slower than `moduleRunnerTransformSync` due to the overhead of spawning a thread.
 *
 * @deprecated Only works for Vite.
 */
interface PluginsOptions {
  styledComponents?: StyledComponentsOptions;
  taggedTemplateEscape?: boolean;
}
interface ReactRefreshOptions {
  /**
   * Specify the identifier of the refresh registration variable.
   *
   * @default `$RefreshReg$`.
   */
  refreshReg?: string;
  /**
   * Specify the identifier of the refresh signature variable.
   *
   * @default `$RefreshSig$`.
   */
  refreshSig?: string;
  emitFullSignatures?: boolean;
}
/**
 * Configure how styled-components are transformed.
 *
 * @see {@link https://oxc.rs/docs/guide/usage/transformer/plugins#styled-components}
 */
interface StyledComponentsOptions {
  /**
   * Enhances the attached CSS class name on each component with richer output to help
   * identify your components in the DOM without React DevTools.
   *
   * @default true
   */
  displayName?: boolean;
  /**
   * Controls whether the `displayName` of a component will be prefixed with the filename
   * to make the component name as unique as possible.
   *
   * @default true
   */
  fileName?: boolean;
  /**
   * Adds a unique identifier to every styled component to avoid checksum mismatches
   * due to different class generation on the client and server during server-side rendering.
   *
   * @default true
   */
  ssr?: boolean;
  /**
   * Transpiles styled-components tagged template literals to a smaller representation
   * than what Babel normally creates, helping to reduce bundle size.
   *
   * @default true
   */
  transpileTemplateLiterals?: boolean;
  /**
   * Minifies CSS content by removing all whitespace and comments from your CSS,
   * keeping valuable bytes out of your bundles.
   *
   * @default true
   */
  minify?: boolean;
  /**
   * Enables transformation of JSX `css` prop when using styled-components.
   *
   * **Note: This feature is not yet implemented in oxc.**
   *
   * @default true
   */
  cssProp?: boolean;
  /**
   * Enables "pure annotation" to aid dead code elimination by bundlers.
   *
   * @default false
   */
  pure?: boolean;
  /**
   * Adds a namespace prefix to component identifiers to ensure class names are unique.
   *
   * Example: With `namespace: "my-app"`, generates `componentId: "my-app__sc-3rfj0a-1"`
   */
  namespace?: string;
  /**
   * List of file names that are considered meaningless for component naming purposes.
   *
   * When the `fileName` option is enabled and a component is in a file with a name
   * from this list, the directory name will be used instead of the file name for
   * the component's display name.
   *
   * @default `["index"]`
   */
  meaninglessFileNames?: Array<string>;
  /**
   * Import paths to be considered as styled-components imports at the top level.
   *
   * **Note: This feature is not yet implemented in oxc.**
   */
  topLevelImportPaths?: Array<string>;
}
/**
 * Options for transforming a JavaScript or TypeScript file.
 *
 * @see {@link transform}
 */
interface TransformOptions$3 {
  /** Treat the source text as `js`, `jsx`, `ts`, `tsx`, or `dts`. */
  lang?: 'js' | 'jsx' | 'ts' | 'tsx' | 'dts';
  /** Treat the source text as `script` or `module` code. */
  sourceType?: 'script' | 'module' | 'commonjs' | 'unambiguous' | undefined;
  /**
   * The current working directory. Used to resolve relative paths in other
   * options.
   */
  cwd?: string;
  /**
   * Enable source map generation.
   *
   * When `true`, the `sourceMap` field of transform result objects will be populated.
   *
   * @default false
   *
   * @see {@link SourceMap}
   */
  sourcemap?: boolean;
  /** Set assumptions in order to produce smaller output. */
  assumptions?: CompilerAssumptions;
  /**
   * Configure how TypeScript is transformed.
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/typescript}
   */
  typescript?: TypeScriptOptions;
  /**
   * Configure how TSX and JSX are transformed.
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/jsx}
   */
  jsx?: 'preserve' | JsxOptions;
  /**
   * Sets the target environment for the generated JavaScript.
   *
   * The lowest target is `es2015`.
   *
   * Example:
   *
   * * `'es2015'`
   * * `['es2020', 'chrome58', 'edge16', 'firefox57', 'node12', 'safari11']`
   *
   * @default `esnext` (No transformation)
   *
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/lowering#target}
   */
  target?: string | Array<string>;
  /** Behaviour for runtime helpers. */
  helpers?: Helpers$1;
  /**
   * Define Plugin
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define}
   */
  define?: Record<string, string>;
  /**
   * Inject Plugin
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#inject}
   */
  inject?: Record<string, string | [string, string]>;
  /** Decorator plugin */
  decorator?: DecoratorOptions;
  /**
   * Third-party plugins to use.
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/plugins}
   */
  plugins?: PluginsOptions;
}
interface TypeScriptOptions {
  jsxPragma?: string;
  jsxPragmaFrag?: string;
  onlyRemoveTypeImports?: boolean;
  allowNamespaces?: boolean;
  /**
   * When enabled, type-only class fields are only removed if they are prefixed with the declare modifier:
   *
   * @deprecated
   *
   * Allowing `declare` fields is built-in support in Oxc without any option. If you want to remove class fields
   * without initializer, you can use `remove_class_fields_without_initializer: true` instead.
   */
  allowDeclareFields?: boolean;
  /**
   * When enabled, class fields without initializers are removed.
   *
   * For example:
   * ```ts
   * class Foo {
   *    x: number;
   *    y: number = 0;
   * }
   * ```
   * // transform into
   * ```js
   * class Foo {
   *    x: number;
   * }
   * ```
   *
   * The option is used to align with the behavior of TypeScript's `useDefineForClassFields: false` option.
   * When you want to enable this, you also need to set [`crate::CompilerAssumptions::set_public_class_fields`]
   * to `true`. The `set_public_class_fields: true` + `remove_class_fields_without_initializer: true` is
   * equivalent to `useDefineForClassFields: false` in TypeScript.
   *
   * When `set_public_class_fields` is true and class-properties plugin is enabled, the above example transforms into:
   *
   * ```js
   * class Foo {
   *   constructor() {
   *     this.y = 0;
   *   }
   * }
   * ```
   *
   * Defaults to `false`.
   */
  removeClassFieldsWithoutInitializer?: boolean;
  /**
   * Also generate a `.d.ts` declaration file for TypeScript files.
   *
   * The source file must be compliant with all
   * [`isolatedDeclarations`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#isolated-declarations)
   * requirements.
   *
   * @default false
   */
  declaration?: IsolatedDeclarationsOptions;
  /**
   * Rewrite or remove TypeScript import/export declaration extensions.
   *
   * - When set to `rewrite`, it will change `.ts`, `.mts`, `.cts` extensions to `.js`, `.mjs`, `.cjs` respectively.
   * - When set to `remove`, it will remove `.ts`/`.mts`/`.cts`/`.tsx` extension entirely.
   * - When set to `true`, it's equivalent to `rewrite`.
   * - When set to `false` or omitted, no changes will be made to the extensions.
   *
   * @default false
   */
  rewriteImportExtensions?: 'rewrite' | 'remove' | boolean;
}
/** A decoded source map with mappings as an array of arrays instead of VLQ-encoded string. */
declare class BindingDecodedMap {
  /** The source map version (always 3). */
  get version(): number;
  /** The generated file name. */
  get file(): string | null;
  /** The list of original source files. */
  get sources(): Array<string>;
  /** The original source contents (if `includeContent` was true). */
  get sourcesContent(): Array<string | undefined | null>;
  /** The list of symbol names used in mappings. */
  get names(): Array<string>;
  /**
   * The decoded mappings as an array of line arrays.
   * Each line is an array of segments, where each segment is [generatedColumn, sourceIndex, originalLine, originalColumn, nameIndex?].
   */
  get mappings(): Array<Array<Array<number>>>;
  /** The list of source indices that should be excluded from debugging. */
  get x_google_ignoreList(): Array<number> | null;
}
declare class BindingMagicString {
  constructor(source: string, options?: BindingMagicStringOptions | undefined | null);
  get original(): string;
  get filename(): string | null;
  get indentExclusionRanges(): Array<Array<number>> | Array<number> | null;
  get ignoreList(): boolean;
  get offset(): number;
  set offset(offset: number);
  replace(from: string, to: string): this;
  replaceAll(from: string, to: string): this;
  /**
   * Returns the UTF-16 offset past the last match, or -1 if no match was found.
   * The JS wrapper uses this to update `lastIndex` on the caller's RegExp.
   * Global/sticky behavior is derived from the regex's own flags.
   */
  replaceRegex(from: RegExp, to: string): number;
  prepend(content: string): this;
  append(content: string): this;
  prependLeft(index: number, content: string): this;
  prependRight(index: number, content: string): this;
  appendLeft(index: number, content: string): this;
  appendRight(index: number, content: string): this;
  overwrite(start: number, end: number, content: string, options?: BindingOverwriteOptions | undefined | null): this;
  toString(): string;
  hasChanged(): boolean;
  length(): number;
  isEmpty(): boolean;
  remove(start: number, end: number): this;
  update(start: number, end: number, content: string, options?: BindingUpdateOptions | undefined | null): this;
  relocate(start: number, end: number, to: number): this;
  /**
   * Alias for `relocate` to match the original magic-string API.
   * Moves the characters from `start` to `end` to `index`.
   * Returns `this` for method chaining.
   */
  move(start: number, end: number, index: number): this;
  indent(indentor?: string | undefined | null, options?: BindingIndentOptions | undefined | null): this;
  /** Trims whitespace or specified characters from the start and end. */
  trim(charType?: string | undefined | null): this;
  /** Trims whitespace or specified characters from the start. */
  trimStart(charType?: string | undefined | null): this;
  /** Trims whitespace or specified characters from the end. */
  trimEnd(charType?: string | undefined | null): this;
  /** Trims newlines from the start and end. */
  trimLines(): this;
  /**
   * Deprecated method that throws an error directing users to use prependRight or appendLeft.
   * This matches the original magic-string API which deprecated this method.
   */
  insert(index: number, content: string): void;
  /** Returns a clone of the MagicString instance. */
  clone(): BindingMagicString;
  /** Returns the last character of the generated string, or an empty string if empty. */
  lastChar(): string;
  /** Returns the content after the last newline in the generated string. */
  lastLine(): string;
  /** Returns the guessed indentation string, or `\t` if none is found. */
  getIndentString(): string;
  /** Returns a clone with content outside the specified range removed. */
  snip(start: number, end: number): BindingMagicString;
  /**
   * Resets the portion of the string from `start` to `end` to its original content.
   * This undoes any modifications made to that range.
   * Supports negative indices (counting from the end).
   */
  reset(start: number, end: number): this;
  /**
   * Returns the content between the specified UTF-16 code unit positions (JS string indices).
   * Supports negative indices (counting from the end).
   *
   * When an index falls in the middle of a surrogate pair, the lone surrogate is
   * included in the result (matching the original magic-string / JS behavior).
   * This is done by returning a UTF-16 encoded JS string via `napi_create_string_utf16`.
   */
  slice(start?: number | undefined | null, end?: number | undefined | null): string;
  /**
   * Generates a source map for the transformations applied to this MagicString.
   * Returns a BindingSourceMap object with version, file, sources, sourcesContent, names, mappings.
   */
  generateMap(options?: BindingSourceMapOptions | undefined | null): BindingSourceMap;
  /**
   * Generates a decoded source map for the transformations applied to this MagicString.
   * Returns a BindingDecodedMap object with mappings as an array of arrays.
   */
  generateDecodedMap(options?: BindingSourceMapOptions | undefined | null): BindingDecodedMap;
}
declare class BindingRenderedChunk {
  get name(): string;
  get isEntry(): boolean;
  get isDynamicEntry(): boolean;
  get facadeModuleId(): string | null;
  get moduleIds(): Array<string>;
  get exports(): Array<string>;
  get fileName(): string;
  get modules(): BindingModules;
  get imports(): Array<string>;
  get dynamicImports(): Array<string>;
}
declare class BindingRenderedModule {
  get code(): string | null;
  get renderedExports(): Array<string>;
}
/** A source map object with properties matching the SourceMap V3 specification. */
declare class BindingSourceMap {
  /** The source map version (always 3). */
  get version(): number;
  /** The generated file name. */
  get file(): string | null;
  /** The list of original source files. */
  get sources(): Array<string>;
  /** The original source contents (if `includeContent` was true). */
  get sourcesContent(): Array<string | undefined | null>;
  /** The list of symbol names used in mappings. */
  get names(): Array<string>;
  /** The VLQ-encoded mappings string. */
  get mappings(): string;
  /** The list of source indices that should be excluded from debugging. */
  get x_google_ignoreList(): Array<number> | null;
  /** Returns the source map as a JSON string. */
  toString(): string;
  /** Returns the source map as a base64-encoded data URL. */
  toUrl(): string;
}
/**
 * Minimal wrapper around a `BundleHandle` for watcher events.
 * This is returned from watcher event data to allow calling `result.close()`.
 */
declare class BindingWatcherBundler {
  close(): Promise<void>;
}
type BindingBuiltinPluginName = 'builtin:bundle-analyzer' | 'builtin:esm-external-require' | 'builtin:isolated-declaration' | 'builtin:replace' | 'builtin:vite-alias' | 'builtin:vite-build-import-analysis' | 'builtin:vite-dynamic-import-vars' | 'builtin:vite-import-glob' | 'builtin:vite-json' | 'builtin:vite-load-fallback' | 'builtin:vite-manifest' | 'builtin:vite-module-preload-polyfill' | 'builtin:vite-react-refresh-wrapper' | 'builtin:vite-reporter' | 'builtin:vite-resolve' | 'builtin:vite-transform' | 'builtin:vite-wasm-fallback' | 'builtin:vite-web-worker-post' | 'builtin:oxc-runtime';
/** Enhanced transform options with tsconfig and inputMap support. */
interface BindingEnhancedTransformOptions {
  /** Treat the source text as 'js', 'jsx', 'ts', 'tsx', or 'dts'. */
  lang?: 'js' | 'jsx' | 'ts' | 'tsx' | 'dts';
  /** Treat the source text as 'script', 'module', 'commonjs', or 'unambiguous'. */
  sourceType?: 'script' | 'module' | 'commonjs' | 'unambiguous' | undefined;
  /**
   * The current working directory. Used to resolve relative paths in other
   * options.
   */
  cwd?: string;
  /**
   * Enable source map generation.
   *
   * When `true`, the `sourceMap` field of transform result objects will be populated.
   *
   * @default false
   */
  sourcemap?: boolean;
  /** Set assumptions in order to produce smaller output. */
  assumptions?: CompilerAssumptions;
  /**
   * Configure how TypeScript is transformed.
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/typescript}
   */
  typescript?: TypeScriptOptions;
  /**
   * Configure how TSX and JSX are transformed.
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/jsx}
   */
  jsx?: 'preserve' | JsxOptions;
  /**
   * Sets the target environment for the generated JavaScript.
   *
   * The lowest target is `es2015`.
   *
   * Example:
   *
   * * `'es2015'`
   * * `['es2020', 'chrome58', 'edge16', 'firefox57', 'node12', 'safari11']`
   *
   * @default `esnext` (No transformation)
   *
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/lowering#target}
   */
  target?: string | Array<string>;
  /** Behaviour for runtime helpers. */
  helpers?: Helpers$1;
  /**
   * Define Plugin
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define}
   */
  define?: Record<string, string>;
  /**
   * Inject Plugin
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#inject}
   */
  inject?: Record<string, string | [string, string]>;
  /** Decorator plugin */
  decorator?: DecoratorOptions;
  /**
   * Third-party plugins to use.
   * @see {@link https://oxc.rs/docs/guide/usage/transformer/plugins}
   */
  plugins?: PluginsOptions;
  /**
   * Configure tsconfig handling.
   * - true: Auto-discover and load the nearest tsconfig.json
   * - TsconfigRawOptions: Use the provided inline tsconfig options
   */
  tsconfig?: boolean | BindingTsconfigRawOptions;
  /** An input source map to collapse with the output source map. */
  inputMap?: SourceMap$2;
}
/** Result of the enhanced transform API. */
interface BindingHookResolveIdExtraArgs {
  custom?: number;
  isEntry: boolean;
  /**
   * - `import-statement`: `import { foo } from './lib.js';`
   * - `dynamic-import`: `import('./lib.js')`
   * - `require-call`: `require('./lib.js')`
   * - `import-rule`: `@import 'bg-color.css'`
   * - `url-token`: `url('./icon.png')`
   * - `new-url`: `new URL('./worker.js', import.meta.url)`
   * - `hot-accept`: `import.meta.hot.accept('./lib.js', () => {})`
   */
  kind: 'import-statement' | 'dynamic-import' | 'require-call' | 'import-rule' | 'url-token' | 'new-url' | 'hot-accept';
}
interface BindingIndentOptions {
  exclude?: Array<Array<number>> | Array<number>;
}
interface BindingMagicStringOptions {
  filename?: string;
  offset?: number;
  indentExclusionRanges?: Array<Array<number>> | Array<number>;
  ignoreList?: boolean;
}
interface BindingModules {
  values: Array<BindingRenderedModule>;
  keys: Array<string>;
}
interface BindingOverwriteOptions {
  contentOnly?: boolean;
}
interface BindingPluginContextResolveOptions {
  /**
   * - `import-statement`: `import { foo } from './lib.js';`
   * - `dynamic-import`: `import('./lib.js')`
   * - `require-call`: `require('./lib.js')`
   * - `import-rule`: `@import 'bg-color.css'`
   * - `url-token`: `url('./icon.png')`
   * - `new-url`: `new URL('./worker.js', import.meta.url)`
   * - `hot-accept`: `import.meta.hot.accept('./lib.js', () => {})`
   */
  importKind?: 'import-statement' | 'dynamic-import' | 'require-call' | 'import-rule' | 'url-token' | 'new-url' | 'hot-accept';
  isEntry?: boolean;
  skipSelf?: boolean;
  custom?: number;
  vitePluginCustom?: BindingVitePluginCustom;
}
interface BindingSourceMapOptions {
  /** The filename for the generated file (goes into `map.file`) */
  file?: string;
  /** The filename of the original source (goes into `map.sources`) */
  source?: string;
  includeContent?: boolean;
  /**
   * Accepts boolean or string: true, false, "boundary"
   * - true: high-resolution sourcemaps (character-level)
   * - false: low-resolution sourcemaps (line-level) - default
   * - "boundary": high-resolution only at word boundaries
   */
  hires?: boolean | string;
}
interface BindingTransformHookExtraArgs {
  moduleType: string;
}
/**
 * TypeScript compiler options for inline tsconfig configuration.
 *
 * @category Utilities
 */
interface BindingTsconfigCompilerOptions {
  /** Specifies the JSX factory function to use. */
  jsx?: 'react' | 'react-jsx' | 'react-jsxdev' | 'preserve' | 'react-native';
  /** Specifies the JSX factory function. */
  jsxFactory?: string;
  /** Specifies the JSX fragment factory function. */
  jsxFragmentFactory?: string;
  /** Specifies the module specifier for JSX imports. */
  jsxImportSource?: string;
  /** Enables experimental decorators. */
  experimentalDecorators?: boolean;
  /** Enables decorator metadata emission. */
  emitDecoratorMetadata?: boolean;
  /** Preserves module structure of imports/exports. */
  verbatimModuleSyntax?: boolean;
  /** Configures how class fields are emitted. */
  useDefineForClassFields?: boolean;
  /** The ECMAScript target version. */
  target?: string;
  /** @deprecated Use verbatimModuleSyntax instead. */
  preserveValueImports?: boolean;
  /** @deprecated Use verbatimModuleSyntax instead. */
  importsNotUsedAsValues?: 'remove' | 'preserve' | 'error';
}
/**
 * Raw tsconfig options for inline configuration.
 *
 * @category Utilities
 */
interface BindingTsconfigRawOptions {
  /** TypeScript compiler options. */
  compilerOptions?: BindingTsconfigCompilerOptions;
}
interface BindingUpdateOptions {
  overwrite?: boolean;
}
interface BindingVitePluginCustom {
  'vite:import-glob'?: ViteImportGlobMeta;
}
interface ExternalMemoryStatus {
  freed: boolean;
  reason?: string;
}
/** Error emitted from native side, it only contains kind and message, no stack trace. */
interface PreRenderedChunk {
  /** The name of this chunk, which is used in naming patterns. */
  name: string;
  /** Whether this chunk is a static entry point. */
  isEntry: boolean;
  /** Whether this chunk is a dynamic entry point. */
  isDynamicEntry: boolean;
  /** The id of a module that this chunk corresponds to. */
  facadeModuleId?: string;
  /** The list of ids of modules included in this chunk. */
  moduleIds: Array<string>;
  /** Exported variable names from this chunk. */
  exports: Array<string>;
}
interface ViteImportGlobMeta {
  isSubImportsPattern?: boolean;
} //#endregion
//#endregion
//#region node_modules/vite/node_modules/rolldown/node_modules/@rolldown/pluginutils/dist/filter/composable-filters.d.ts
type StringOrRegExp$1 = string | RegExp;
type PluginModuleType = 'js' | 'jsx' | 'ts' | 'tsx' | 'json' | 'text' | 'base64' | 'dataurl' | 'binary' | 'empty' | (string & {});
type FilterExpression = And | Or | Not | Id | ImporterId | ModuleType$1 | Code | Query;
type TopLevelFilterExpression = Include | Exclude$1;
declare class And {
  kind: 'and';
  args: FilterExpression[];
  constructor(...args: FilterExpression[]);
}
declare class Or {
  kind: 'or';
  args: FilterExpression[];
  constructor(...args: FilterExpression[]);
}
declare class Not {
  kind: 'not';
  expr: FilterExpression;
  constructor(expr: FilterExpression);
}
interface IdParams {
  cleanUrl?: boolean;
}
declare class Id {
  kind: 'id';
  pattern: StringOrRegExp$1;
  params: IdParams;
  constructor(pattern: StringOrRegExp$1, params?: IdParams);
}
declare class ImporterId {
  kind: 'importerId';
  pattern: StringOrRegExp$1;
  params: IdParams;
  constructor(pattern: StringOrRegExp$1, params?: IdParams);
}
declare class ModuleType$1 {
  kind: 'moduleType';
  pattern: PluginModuleType;
  constructor(pattern: PluginModuleType);
}
declare class Code {
  kind: 'code';
  pattern: StringOrRegExp$1;
  constructor(expr: StringOrRegExp$1);
}
declare class Query {
  kind: 'query';
  key: string;
  pattern: StringOrRegExp$1 | boolean;
  constructor(key: string, pattern: StringOrRegExp$1 | boolean);
}
declare class Include {
  kind: 'include';
  expr: FilterExpression;
  constructor(expr: FilterExpression);
}
declare class Exclude$1 {
  kind: 'exclude';
  expr: FilterExpression;
  constructor(expr: FilterExpression);
}
//#endregion
//#region node_modules/vite/node_modules/rolldown/dist/shared/define-config-DhJZwTRw.d.mts
//#region src/types/misc.d.ts
/** @inline */
type SourcemapPathTransformOption = (relativeSourcePath: string, sourcemapPath: string) => string;
/** @inline */
type SourcemapIgnoreListOption = (relativeSourcePath: string, sourcemapPath: string) => boolean; //#endregion
//#region src/types/module-info.d.ts
/** @category Plugin APIs */
interface ModuleInfo extends ModuleOptions {
  /**
  * @hidden Not supported by Rolldown
  */
  ast: any;
  /**
  * The source code of the module.
  *
  * `null` if external or not yet available.
  */
  code: string | null;
  /**
  * The id of the module for convenience
  */
  id: string;
  /**
  * The ids of all modules that statically import this module.
  */
  importers: string[];
  /**
  * The ids of all modules that dynamically import this module.
  */
  dynamicImporters: string[];
  /**
  * The module ids statically imported by this module.
  */
  importedIds: string[];
  /**
  * The module ids dynamically imported by this module.
  */
  dynamicallyImportedIds: string[];
  /**
  * All exported variables
  */
  exports: string[];
  /**
  * Whether this module is a user- or plugin-defined entry point.
  */
  isEntry: boolean;
  /**
  * The detected format of the module, based on both its syntax and module definition
  * metadata (such as `package.json` `type` and file extensions like `.mjs`/`.cjs`/`.mts`/`.cts`).
  * - "esm" for ES modules (has `import`/`export` statements or is defined as ESM by module metadata)
  * - "cjs" for CommonJS modules (uses `module.exports`, `exports`, top-level `return`, or is defined as CommonJS by module metadata)
  * - "unknown" when the format could not be determined from either syntax or module definition metadata
  *
  * @experimental
  */
  inputFormat: "es" | "cjs" | "unknown";
} //#endregion
//#region src/utils/asset-source.d.ts
/** @inline */
type AssetSource = string | Uint8Array; //#endregion
//#region src/types/external-memory-handle.d.ts
declare const symbolForExternalMemoryHandle: "__rolldown_external_memory_handle__";
/**
* Interface for objects that hold external memory that can be explicitly freed.
*/
interface ExternalMemoryHandle {
  /**
  * Frees the external memory held by this object.
  * @param keepDataAlive - If true, evaluates all lazy fields before freeing memory.
  *   This will take time but prevents errors when accessing properties after freeing.
  * @returns Status object with `freed` boolean and optional `reason` string.
  * @internal
  */
  [symbolForExternalMemoryHandle]: (keepDataAlive?: boolean) => ExternalMemoryStatus;
}
/**
* Frees the external memory held by the given handle.
*
* This is useful when you want to manually release memory held by Rust objects
* (like `OutputChunk` or `OutputAsset`) before they are garbage collected.
*
* @param handle - The object with external memory to free
* @param keepDataAlive - If true, evaluates all lazy fields before freeing memory (default: false).
*   This will take time to copy data from Rust to JavaScript, but prevents errors
*   when accessing properties after the memory is freed.
* @returns Status object with `freed` boolean and optional `reason` string.
*   - `{ freed: true }` if memory was successfully freed
*   - `{ freed: false, reason: "..." }` if memory couldn't be freed (e.g., already freed or other references exist)
*
* @example
* ```typescript
* import { freeExternalMemory } from 'rolldown/experimental';
*
* const output = await bundle.generate();
* const chunk = output.output[0];
*
* // Use the chunk...
*
* // Manually free the memory (fast, but accessing properties after will throw)
* const status = freeExternalMemory(chunk); // { freed: true }
* const statusAgain = freeExternalMemory(chunk); // { freed: false, reason: "Memory has already been freed" }
*
* // Keep data alive before freeing (slower, but data remains accessible)
* freeExternalMemory(chunk, true); // Evaluates all lazy fields first
* console.log(chunk.code); // OK - data was copied to JavaScript before freeing
*
* // Without keepDataAlive, accessing chunk properties after freeing will throw an error
* ```
*/
//#endregion
//#region src/types/rolldown-output.d.ts
/**
* The information about an asset in the generated bundle.
*
* @category Plugin APIs
*/
interface OutputAsset extends ExternalMemoryHandle {
  type: "asset";
  /** The file name of this asset. */
  fileName: string;
  /** @deprecated Use {@linkcode originalFileNames} instead. */
  originalFileName: string | null;
  /** The list of the absolute paths to the original file of this asset. */
  originalFileNames: string[];
  /** The content of this asset. */
  source: AssetSource;
  /** @deprecated Use {@linkcode names} instead. */
  name: string | undefined;
  names: string[];
}
/** @category Plugin APIs */
interface SourceMap$1 {
  file: string;
  mappings: string;
  names: string[];
  sources: string[];
  sourcesContent: string[];
  version: number;
  debugId?: string;
  x_google_ignoreList?: number[];
  toString(): string;
  toUrl(): string;
}
/** @category Plugin APIs */
interface RenderedModule {
  readonly code: string | null;
  renderedLength: number;
  renderedExports: string[];
}
/**
* The information about the chunk being rendered.
*
* Unlike {@link OutputChunk}, `code` and `map` are not set as the chunk has not been rendered yet.
* All referenced chunk file names in each property that would contain hashes will contain hash placeholders instead.
*
* @category Plugin APIs
*/
interface RenderedChunk extends Omit<BindingRenderedChunk, "modules"> {
  type: "chunk";
  /** Information about the modules included in this chunk. */
  modules: {
    [id: string]: RenderedModule;
  };
  /** The name of this chunk, which is used in naming patterns. */
  name: string;
  /** Whether this chunk is a static entry point. */
  isEntry: boolean;
  /** Whether this chunk is a dynamic entry point. */
  isDynamicEntry: boolean;
  /** The id of a module that this chunk corresponds to. */
  facadeModuleId: string | null;
  /** The list of ids of modules included in this chunk. */
  moduleIds: Array<string>;
  /** Exported variable names from this chunk. */
  exports: Array<string>;
  /** The preliminary file name of this chunk with hash placeholders. */
  fileName: string;
  /** External modules imported statically by this chunk. */
  imports: Array<string>;
  /** External modules imported dynamically by this chunk. */
  dynamicImports: Array<string>;
}
/**
* The information about a chunk in the generated bundle.
*
* @category Plugin APIs
*/
interface OutputChunk extends ExternalMemoryHandle {
  type: "chunk";
  /** The generated code of this chunk. */
  code: string;
  /** The name of this chunk, which is used in naming patterns. */
  name: string;
  /** Whether this chunk is a static entry point. */
  isEntry: boolean;
  /** Exported variable names from this chunk. */
  exports: string[];
  /** The file name of this chunk. */
  fileName: string;
  /** Information about the modules included in this chunk. */
  modules: {
    [id: string]: RenderedModule;
  };
  /** External modules imported statically by this chunk. */
  imports: string[];
  /** External modules imported dynamically by this chunk. */
  dynamicImports: string[];
  /** The id of a module that this chunk corresponds to. */
  facadeModuleId: string | null;
  /** Whether this chunk is a dynamic entry point. */
  isDynamicEntry: boolean;
  moduleIds: string[];
  /** The source map of this chunk if present. */
  map: SourceMap$1 | null;
  sourcemapFileName: string | null;
  /** The preliminary file name of this chunk with hash placeholders. */
  preliminaryFileName: string;
}
/**
* The generated bundle output.
*
* @category Programmatic APIs
*/
interface RolldownOutput extends ExternalMemoryHandle {
  /**
  * The list of chunks and assets in the generated bundle.
  *
  * This includes at least one {@linkcode OutputChunk}. It may also include more
  * {@linkcode OutputChunk} and/or {@linkcode OutputAsset}s.
  */
  output: [OutputChunk, ...(OutputChunk | OutputAsset)[]];
} //#endregion
//#region src/types/utils.d.ts
type MaybePromise<T> = T | Promise<T>;
/** @inline */
type NullValue<T = void> = T | undefined | null | void;
type PartialNull<T> = { [P in keyof T]: T[P] | null };
type MakeAsync<Function_> = Function_ extends ((this: infer This, ...parameters: infer Arguments) => infer Return) ? (this: This, ...parameters: Arguments) => Return | Promise<Return> : never;
type MaybeArray<T> = T | T[];
/** @inline */
type StringOrRegExp = string | RegExp; //#endregion
//#region src/options/output-options.d.ts
type GeneratedCodePreset = "es5" | "es2015";
interface GeneratedCodeOptions {
  /**
  * Whether to use Symbol.toStringTag for namespace objects.
  * @default false
  */
  symbols?: boolean;
  /**
  * Allows choosing one of the presets listed above while overriding some options.
  *
  * ```js
  * export default {
  *   output: {
  *     generatedCode: {
  *       preset: 'es2015',
  *       symbols: false
  *     }
  *   }
  * };
  * ```
  *
  * @default 'es2015'
  */
  preset?: GeneratedCodePreset;
  /**
  * Whether to add readable names to internal variables for profiling purposes.
  *
  * When enabled, generated code will use descriptive variable names that correspond
  * to the original module names, making it easier to profile and debug the bundled code.
  *
  * @default false
  *
  *
  */
  profilerNames?: boolean;
}
/** @inline */
type ModuleFormat = "es" | "cjs" | "esm" | "module" | "commonjs" | "iife" | "umd";
/** @inline */
type AddonFunction = (chunk: RenderedChunk) => string | Promise<string>;
/** @inline */
type ChunkFileNamesFunction = (chunkInfo: PreRenderedChunk) => string;
/** @inline */
type SanitizeFileNameFunction = (name: string) => string;
/** @category Plugin APIs */
interface PreRenderedAsset {
  type: "asset";
  /** @deprecated Use {@linkcode names} instead. */
  name?: string;
  names: string[];
  /** @deprecated Use {@linkcode originalFileNames} instead. */
  originalFileName?: string;
  /** The list of the absolute paths to the original file of this asset. */
  originalFileNames: string[];
  /** The content of this asset. */
  source: AssetSource;
}
/** @inline */
type AssetFileNamesFunction = (chunkInfo: PreRenderedAsset) => string;
/** @inline */
type PathsFunction$1 = (id: string) => string;
/** @inline */
type ManualChunksFunction = (moduleId: string, meta: {
  getModuleInfo: (moduleId: string) => ModuleInfo | null;
}) => string | NullValue;
/** @inline */
type GlobalsFunction = (name: string) => string;
/** @category Plugin APIs */
type CodeSplittingNameFunction = (moduleId: string, ctx: ChunkingContext) => string | NullValue;
/** @inline */
type CodeSplittingTestFunction = (id: string) => boolean | undefined | void;
type MinifyOptions = Omit<MinifyOptions$1, "module" | "sourcemap">;
interface CommentsOptions {
  /**
  * Comments that contain `@license`, `@preserve` or start with `//!` or `/*!`
  */
  legal?: boolean;
  /**
  * Comments that contain `@__PURE__`, `@__NO_SIDE_EFFECTS__` or `@vite-ignore`
  */
  annotation?: boolean;
  /**
  * JSDoc comments
  */
  jsdoc?: boolean;
}
/** @inline */
interface ChunkingContext {
  getModuleInfo(moduleId: string): ModuleInfo | null;
}
interface OutputOptions {
  /**
  * The directory in which all generated chunks are placed.
  *
  * The {@linkcode file | output.file} option can be used instead if only a single chunk is generated.
  *
  *
  *
  * @default 'dist'
  */
  dir?: string;
  /**
  * The file path for the single generated chunk.
  *
  * The {@linkcode dir | output.dir} option should be used instead if multiple chunks are generated.
  */
  file?: string;
  /**
  * Which exports mode to use.
  *
  *
  *
  * @default 'auto'
  */
  exports?: "auto" | "named" | "default" | "none";
  /**
  * Specify the character set that Rolldown is allowed to use in file hashes.
  *
  * - `'base64'`: Uses url-safe base64 characters (0-9, a-z, A-Z, -, _). This will produce the shortest hashes.
  * - `'base36'`: Uses alphanumeric characters (0-9, a-z)
  * - `'hex'`: Uses hexadecimal characters (0-9, a-f)
  *
  * @default 'base64'
  */
  hashCharacters?: "base64" | "base36" | "hex";
  /**
  * Expected format of generated code.
  *
  * - `'es'`, `'esm'` and `'module'` are the same format, all stand for ES module.
  * - `'cjs'` and `'commonjs'` are the same format, all stand for CommonJS module.
  * - `'iife'` stands for [Immediately Invoked Function Expression](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).
  * - `'umd'` stands for [Universal Module Definition](https://github.com/umdjs/umd).
  *
  * @default 'es'
  *
  *
  */
  format?: ModuleFormat;
  /**
  * Whether to generate sourcemaps.
  *
  * - `false`: No sourcemap will be generated.
  * - `true`: A separate sourcemap file will be generated.
  * - `'inline'`: The sourcemap will be appended to the output file as a data URL.
  * - `'hidden'`: A separate sourcemap file will be generated, but the link to the sourcemap (`//# sourceMappingURL` comment) will not be included in the output file.
  *
  * @default false
  */
  sourcemap?: boolean | "inline" | "hidden";
  /**
  * The base URL for the links to the sourcemap file in the output file.
  *
  * By default, relative URLs are generated. If this option is set, an absolute URL with that base URL will be generated. This is useful when deploying source maps to a different location than your code, such as a CDN or separate debugging server.
  */
  sourcemapBaseUrl?: string;
  /**
  * Whether to include [debug IDs](https://github.com/tc39/ecma426/blob/main/proposals/debug-id.md) in the sourcemap.
  *
  * When `true`, a unique debug ID will be emitted in source and sourcemaps which streamlines identifying sourcemaps across different builds.
  *
  * @default false
  */
  sourcemapDebugIds?: boolean;
  /**
  * Control which source files are included in the sourcemap ignore list.
  *
  * Files in the ignore list are excluded from debugger stepping and error stack traces.
  *
  * - `false`: Include no source files in the ignore list
  * - `true`: Include all source files in the ignore list
  * - `string`: Files containing this string in their path will be included in the ignore list
  * - `RegExp`: Files matching this regular expression will be included in the ignore list
  * - `function`: Custom function to determine if a source should be ignored
  *
  * :::tip Performance
  * Using static values (`boolean`, `string`, or `RegExp`) is significantly more performant than functions.
  * Calling JavaScript functions from Rust has extremely high overhead, so prefer static patterns when possible.
  * :::
  *
  * @example
  * ```js
  * // ✅ Preferred: Use RegExp for better performance
  * sourcemapIgnoreList: /node_modules/
  *
  * // ✅ Preferred: Use string pattern for better performance
  * sourcemapIgnoreList: "vendor"
  *
  * // ! Use sparingly: Function calls have high overhead
  * sourcemapIgnoreList: (source, sourcemapPath) => {
  *   return source.includes('node_modules') || source.includes('.min.');
  * }
  * ```
  *
  * @default /node_modules/
  */
  sourcemapIgnoreList?: boolean | SourcemapIgnoreListOption | StringOrRegExp;
  /**
  * A transformation to apply to each path in a sourcemap.
  *
  * @example
  * ```js
  * export default defineConfig({
  *   output: {
  *     sourcemap: true,
  *     sourcemapPathTransform: (source, sourcemapPath) => {
  *       // Remove 'src/' prefix from all source paths
  *       return source.replace(/^src\//, '');
  *     },
  *   },
  * });
  * ```
  */
  sourcemapPathTransform?: SourcemapPathTransformOption;
  /**
  * Whether to exclude the original source code from sourcemaps.
  *
  * When `true`, the `sourcesContent` field is omitted from the generated sourcemap,
  * reducing the sourcemap file size. The sourcemap will still contain source file paths
  * and mappings, so debugging works if the original files are available.
  *
  * @default false
  */
  sourcemapExcludeSources?: boolean;
  /**
  * A string to prepend to the bundle before {@linkcode Plugin.renderChunk | renderChunk} hook.
  *
  * See {@linkcode intro | output.intro}, {@linkcode postBanner | output.postBanner} as well.
  *
  *
  */
  banner?: string | AddonFunction;
  /**
  * A string to append to the bundle before {@linkcode Plugin.renderChunk | renderChunk} hook.
  *
  * See {@linkcode outro | output.outro}, {@linkcode postFooter | output.postFooter} as well.
  *
  *
  */
  footer?: string | AddonFunction;
  /**
  * A string to prepend to the bundle after {@linkcode Plugin.renderChunk | renderChunk} hook and minification.
  *
  * See {@linkcode banner | output.banner}, {@linkcode intro | output.intro} as well.
  *
  *
  */
  postBanner?: string | AddonFunction;
  /**
  * A string to append to the bundle after {@linkcode Plugin.renderChunk | renderChunk} hook and minification.
  *
  * See {@linkcode footer | output.footer}, {@linkcode outro | output.outro} as well.
  *
  *
  */
  postFooter?: string | AddonFunction;
  /**
  * A string to prepend inside any {@link OutputOptions.format | format}-specific wrapper.
  *
  * See {@linkcode banner | output.banner}, {@linkcode postBanner | output.postBanner} as well.
  *
  *
  */
  intro?: string | AddonFunction;
  /**
  * A string to append inside any {@link OutputOptions.format | format}-specific wrapper.
  *
  * See {@linkcode footer | output.footer}, {@linkcode postFooter | output.postFooter} as well.
  *
  *
  */
  outro?: string | AddonFunction;
  /**
  * Whether to extend the global variable defined by the {@linkcode OutputOptions.name | name} option in `umd` or `iife` {@link OutputOptions.format | formats}.
  *
  * When `true`, the global variable will be defined as `global.name = global.name || {}`.
  * When `false`, the global defined by name will be overwritten like `global.name = {}`.
  *
  * @default false
  */
  extend?: boolean;
  /**
  * Whether to add a `__esModule: true` property when generating exports for non-ES {@link OutputOptions.format | formats}.
  *
  * This property signifies that the exported value is the namespace of an ES module and that the default export of this module corresponds to the `.default` property of the exported object.
  *
  * - `true`: Always add the property when using {@link OutputOptions.exports | named exports mode}, which is similar to what other tools do.
  * - `"if-default-prop"`: Only add the property when using {@link OutputOptions.exports | named exports mode} and there also is a default export. The subtle difference is that if there is no default export, consumers of the CommonJS version of your library will get all named exports as default export instead of an error or `undefined`.
  * - `false`: Never add the property even if the default export would become a property `.default`.
  *
  * @default 'if-default-prop'
  *
  *
  */
  esModule?: boolean | "if-default-prop";
  /**
  * The pattern to use for naming custom emitted assets to include in the build output, or a function that is called per asset with {@linkcode PreRenderedAsset} to return such a pattern.
  *
  * Patterns support the following placeholders:
  * - `[extname]`: The file extension of the asset including a leading dot, e.g. `.css`.
  * - `[ext]`: The file extension without a leading dot, e.g. css.
  * - `[hash]`: A hash based on the content of the asset. You can also set a specific hash length via e.g. `[hash:10]`. By default, it will create a base-64 hash. If you need a reduced character set, see {@linkcode hashCharacters | output.hashCharacters}.
  * - `[name]`: The file name of the asset excluding any extension.
  *
  * Forward slashes (`/`) can be used to place files in sub-directories.
  *
  * See also {@linkcode chunkFileNames | output.chunkFileNames}, {@linkcode entryFileNames | output.entryFileNames}.
  *
  * @default 'assets/[name]-[hash][extname]'
  */
  assetFileNames?: string | AssetFileNamesFunction;
  /**
  * The pattern to use for chunks created from entry points, or a function that is called per entry chunk with {@linkcode PreRenderedChunk} to return such a pattern.
  *
  * Patterns support the following placeholders:
  * - `[format]`: The rendering format defined in the output options. The value is any of {@linkcode InternalModuleFormat}.
  * - `[hash]`: A hash based only on the content of the final generated chunk, including transformations in `renderChunk` and any referenced file hashes. You can also set a specific hash length via e.g. `[hash:10]`. By default, it will create a base-64 hash. If you need a reduced character set, see {@linkcode hashCharacters | output.hashCharacters}.
  * - `[name]`: The file name (without extension) of the entry point, unless the object form of input was used to define a different name.
  *
  * Forward slashes (`/`) can be used to place files in sub-directories. This pattern will also be used for every file when setting the {@linkcode preserveModules | output.preserveModules} option.
  *
  * See also {@linkcode assetFileNames | output.assetFileNames}, {@linkcode chunkFileNames | output.chunkFileNames}.
  *
  * @default '[name].js'
  */
  entryFileNames?: string | ChunkFileNamesFunction;
  /**
  * The pattern to use for naming shared chunks created when code-splitting, or a function that is called per chunk with {@linkcode PreRenderedChunk} to return such a pattern.
  *
  * Patterns support the following placeholders:
  * - `[format]`: The rendering format defined in the output options. The value is any of {@linkcode InternalModuleFormat}.
  * - `[hash]`: A hash based only on the content of the final generated chunk, including transformations in `renderChunk` and any referenced file hashes. You can also set a specific hash length via e.g. `[hash:10]`. By default, it will create a base-64 hash. If you need a reduced character set, see {@linkcode hashCharacters | output.hashCharacters}.
  * - `[name]`: The name of the chunk. This can be explicitly set via the {@linkcode codeSplitting | output.codeSplitting} option or when the chunk is created by a plugin via `this.emitFile`. Otherwise, it will be derived from the chunk contents.
  *
  * Forward slashes (`/`) can be used to place files in sub-directories.
  *
  * See also {@linkcode assetFileNames | output.assetFileNames}, {@linkcode entryFileNames | output.entryFileNames}.
  *
  * @default '[name]-[hash].js'
  */
  chunkFileNames?: string | ChunkFileNamesFunction;
  /**
  * Whether to enable chunk name sanitization (removal of non-URL-safe characters like `\0`, `?` and `*`).
  *
  * Set `false` to disable the sanitization. You can also provide a custom sanitization function.
  *
  * @default true
  */
  sanitizeFileName?: boolean | SanitizeFileNameFunction;
  /**
  * Control code minification
  *
  * Rolldown uses Oxc Minifier under the hood. See Oxc's [minification documentation](https://oxc.rs/docs/guide/usage/minifier#features) for more details.
  *
  * - `true`: Enable full minification including code compression and dead code elimination
  * - `false`: Disable minification
  * - `'dce-only'`: Only perform dead code elimination without code compression (default)
  * - `MinifyOptions`: Fine-grained control over minification settings
  *
  * @default 'dce-only'
  */
  minify?: boolean | "dce-only" | MinifyOptions;
  /**
  * Specifies the global variable name that contains the exports of `umd` / `iife` {@link OutputOptions.format | formats}.
  *
  * @example
  * ```js
  * export default defineConfig({
  *   output: {
  *     format: 'iife',
  *     name: 'MyBundle',
  *   }
  * });
  * ```
  * ```js
  * // output
  * var MyBundle = (function () {
  *   // ...
  * })();
  * ```
  *
  *
  */
  name?: string;
  /**
  * Specifies `id: variableName` pairs necessary for {@link InputOptions.external | external} imports in `umd` / `iife` {@link OutputOptions.format | formats}.
  *
  * @example
  * ```js
  * export default defineConfig({
  *   external: ['jquery'],
  *   output: {
  *     format: 'iife',
  *     name: 'MyBundle',
  *     globals: {
  *       jquery: '$',
  *     }
  *   }
  * });
  * ```
  * ```js
  * // input
  * import $ from 'jquery';
  * ```
  * ```js
  * // output
  * var MyBundle = (function ($) {
  *   // ...
  * })($);
  * ```
  */
  globals?: Record<string, string> | GlobalsFunction;
  /**
  * Maps {@link InputOptions.external | external} module IDs to paths.
  *
  * Allows customizing the path used when importing external dependencies.
  * This is particularly useful for loading dependencies from CDNs or custom locations.
  *
  * - Object form: Maps module IDs to their replacement paths
  * - Function form: Takes a module ID and returns its replacement path
  *
  * @example
  * ```js
  * {
  *   paths: {
  *     'd3': 'https://cdn.jsdelivr.net/npm/d3@7'
  *   }
  * }
  * ```
  *
  * @example
  * ```js
  * {
  *   paths: (id) => {
  *     if (id.startsWith('lodash')) {
  *       return `https://cdn.jsdelivr.net/npm/${id}`
  *     }
  *     return id
  *   }
  * }
  * ```
  */
  paths?: Record<string, string> | PathsFunction$1;
  /**
  * Which language features Rolldown can safely use in generated code.
  *
  * This will not transpile any user code but only change the code Rolldown uses in wrappers and helpers.
  */
  generatedCode?: Partial<GeneratedCodeOptions>;
  /**
  * Whether to generate code to support live bindings for {@link InputOptions.external | external} imports.
  *
  * With the default value of `true`, Rolldown will generate code to support live bindings for external imports.
  *
  * When set to `false`, Rolldown will assume that exports from external modules do not change. This will allow Rolldown to generate smaller code. Note that this can cause issues when there are circular dependencies involving an external dependency.
  *
  * @default true
  *
  *
  */
  externalLiveBindings?: boolean;
  /**
  * @deprecated Please use `codeSplitting: false` instead.
  *
  * Whether to inline dynamic imports instead of creating new chunks to create a single bundle.
  *
  * This option can be used only when a single input is provided.
  *
  * @default false
  */
  inlineDynamicImports?: boolean;
  /**
  * Whether to keep external dynamic imports as `import(...)` expressions in CommonJS output.
  *
  * If set to `false`, external dynamic imports will be rewritten to use `require(...)` calls.
  * This may be necessary to support environments that do not support dynamic `import()` in CommonJS modules like old Node.js versions.
  *
  * @default true
  */
  dynamicImportInCjs?: boolean;
  /**
  * Allows you to do manual chunking. Provided for Rollup compatibility.
  *
  * You could use this option for migration purpose. Under the hood,
  *
  * ```js
  * {
  *   manualChunks: (moduleId, meta) => {
  *     if (moduleId.includes('node_modules')) {
  *       return 'vendor';
  *     }
  *     return null;
  *   }
  * }
  * ```
  *
  * will be transformed to
  *
  * ```js
  * {
  *   codeSplitting: {
  *     groups: [
  *       {
  *         name(moduleId) {
  *           if (moduleId.includes('node_modules')) {
  *             return 'vendor';
  *           }
  *           return null;
  *         },
  *       },
  *     ],
  *   }
  * }
  *
  * ```
  *
  * Note that unlike Rollup, object form is not supported.
  *
  * @deprecated
  * Please use {@linkcode codeSplitting | output.codeSplitting} instead.
  *
  * :::warning
  * If `manualChunks` and `codeSplitting` are both specified, `manualChunks` option will be ignored.
  * :::
  */
  manualChunks?: ManualChunksFunction;
  /**
  * Controls how code splitting is performed.
  *
  * - `true`: Default behavior, automatic code splitting. **(default)**
  * - `false`: Inline all dynamic imports into a single bundle (equivalent to deprecated `inlineDynamicImports: true`).
  * - `object`: Advanced manual code splitting configuration.
  *
  * For deeper understanding, please refer to the in-depth [documentation](https://rolldown.rs/in-depth/manual-code-splitting).
  *
  *
  *
  * @example
  * **Basic vendor chunk**
  * ```js
  * export default defineConfig({
  *   output: {
  *     codeSplitting: {
  *       minSize: 20000,
  *       groups: [
  *         {
  *           name: 'vendor',
  *           test: /node_modules/,
  *         },
  *       ],
  *     },
  *   },
  * });
  * ```
  *
  *
  * @default true
  */
  codeSplitting?: boolean | CodeSplittingOptions;
  /**
  * @deprecated Please use {@linkcode codeSplitting | output.codeSplitting} instead.
  *
  * Allows you to do manual chunking.
  *
  * :::warning
  * If `advancedChunks` and `codeSplitting` are both specified, `advancedChunks` option will be ignored.
  * :::
  */
  advancedChunks?: {
    includeDependenciesRecursively?: boolean;
    minSize?: number;
    maxSize?: number;
    maxModuleSize?: number;
    minModuleSize?: number;
    minShareCount?: number;
    groups?: CodeSplittingGroup[];
  };
  /**
  * Controls how legal comments are preserved in the output.
  *
  * - `none`: no legal comments
  * - `inline`: preserve legal comments that contain `@license`, `@preserve` or starts with `//!` `/*!`
  *
  * @deprecated Use `comments.legal` instead. When both `legalComments` and `comments.legal` are set, `comments.legal` takes priority.
  */
  legalComments?: "none" | "inline";
  /**
  * Control which comments are preserved in the output.
  *
  * - `true`: Preserve legal, annotation, and JSDoc comments (default)
  * - `false`: Strip all comments
  * - Object: Granular control over comment categories
  *
  * Note: Regular line and block comments without these markers
  * are always removed regardless of this option.
  *
  * When both `legalComments` and `comments.legal` are set, `comments.legal` takes priority.
  *
  *
  *
  * @default true
  */
  comments?: boolean | CommentsOptions;
  /**
  * The list of plugins to use only for this output.
  *
  * @see {@linkcode InputOptions.plugins | plugins}
  */
  plugins?: RolldownOutputPluginOption;
  /**
  * Whether to add a polyfill for `require()` function in non-CommonJS formats.
  *
  * This option is useful when you want to inject your own `require` implementation.
  *
  * @default true
  */
  polyfillRequire?: boolean;
  /**
  * This option is not implemented yet.
  * @hidden
  */
  hoistTransitiveImports?: false;
  /**
  * Whether to use preserve modules mode.
  *
  *
  *
  * @default false
  */
  preserveModules?: boolean;
  /**
  * Specifies the directory name for "virtual" files that might be emitted by plugins when using {@link OutputOptions.preserveModules | preserve modules mode}.
  *
  * @default '_virtual'
  */
  virtualDirname?: string;
  /**
  * A directory path to input modules that should be stripped away from {@linkcode dir | output.dir} when using {@link OutputOptions.preserveModules | preserve modules mode}.
  *
  *
  */
  preserveModulesRoot?: string;
  /**
  * Whether to use `var` declarations at the top level scope instead of function / class / let / const expressions.
  *
  * Enabling this option can improve runtime performance of the generated code in certain environments.
  *
  * @default false
  *
  *
  */
  topLevelVar?: boolean;
  /**
  * Whether to minify internal exports as single letter variables to allow for better minification.
  *
  * @default
  * `true` for format `es` or if `output.minify` is `true` or object, `false` otherwise
  *
  *
  */
  minifyInternalExports?: boolean;
  /**
  * Clean output directory ({@linkcode dir | output.dir}) before emitting output.
  *
  * @default false
  *
  *
  */
  cleanDir?: boolean;
  /**
  * Keep `name` property of functions and classes after bundling.
  *
  * When enabled, the bundler will preserve the original `name` property value of functions and
  * classes in the output. This is useful for debugging and some frameworks that rely on it for
  * registration and binding purposes.
  *
  *
  *
  * @default false
  */
  keepNames?: boolean;
  /**
  * Lets modules be executed in the order they are declared.
  *
  * This is done by injecting runtime helpers to ensure that modules are executed in the order they are imported. External modules won't be affected.
  *
  * > [!WARNING]
  * > Enabling this option may negatively increase bundle size. It is recommended to use this option only when absolutely necessary.
  * @default false
  */
  strictExecutionOrder?: boolean;
  /**
  * Whether to always output `"use strict"` directive in non-ES module outputs.
  *
  * - `true` - Always emit `"use strict"` at the top of the output (not applicable for ESM format since ESM is always strict).
  * - `false` - Never emit `"use strict"` in the output.
  * - `'auto'` - Respect the `"use strict"` directives from the source code.
  *
  * See [In-depth directive guide](https://rolldown.rs/in-depth/directives) for more details.
  *
  * @default 'auto'
  */
  strict?: boolean | "auto";
}
type CodeSplittingGroup = {
  /**
  * Name of the group. It will be also used as the name of the chunk and replace the `[name]` placeholder in the {@linkcode OutputOptions.chunkFileNames | output.chunkFileNames} option.
  *
  * For example,
  *
  * ```js
  * import { defineConfig } from 'rolldown';
  *
  * export default defineConfig({
  *   output: {
  *     codeSplitting: {
  *       groups: [
  *         {
  *           name: 'libs',
  *           test: /node_modules/,
  *         },
  *       ],
  *     },
  *   },
  * });
  * ```
  * will create a chunk named `libs-[hash].js` in the end.
  *
  * It's ok to have the same name for different groups. Rolldown will deduplicate the chunk names if necessary.
  *
  * #### Dynamic `name()`
  *
  * If `name` is a function, it will be called with the module id as the argument. The function should return a string or `null`. If it returns `null`, the module will be ignored by this group.
  *
  * Notice, each returned new name will be treated as a separate group.
  *
  * For example,
  *
  * ```js
  * import { defineConfig } from 'rolldown';
  *
  * export default defineConfig({
  *   output: {
  *     codeSplitting: {
  *       groups: [
  *         {
  *           name: (moduleId) => moduleId.includes('node_modules') ? 'libs' : 'app',
  *           minSize: 100 * 1024,
  *         },
  *       ],
  *     },
  *   },
  * });
  * ```
  *
  * :::warning
  * Constraints like `minSize`, `maxSize`, etc. are applied separately for different names returned by the function.
  * :::
  */
  name: string | CodeSplittingNameFunction;
  /**
  * Controls which modules are captured in this group.
  *
  * - If `test` is a string, the module whose id contains the string will be captured.
  * - If `test` is a regular expression, the module whose id matches the regular expression will be captured.
  * - If `test` is a function, modules for which `test(id)` returns `true` will be captured.
  * - If `test` is empty, any module will be considered as matched.
  *
  * :::warning
  * When using regular expression, it's recommended to use `[\\/]` to match the path separator instead of `/` to avoid potential issues on Windows.
  * - ✅ Recommended: `/node_modules[\\/]react/`
  * - ❌ Not recommended: `/node_modules/react/`
  * :::
  */
  test?: StringOrRegExp | CodeSplittingTestFunction;
  /**
  * Priority of the group. Group with higher priority will be chosen first to match modules and create chunks. When converting the group to a chunk, modules of that group will be removed from other groups.
  *
  * If two groups have the same priority, the group whose index is smaller will be chosen.
  *
  * @example
  * ```js
  * import { defineConfig } from 'rolldown';
  *
  * export default defineConfig({
  *   output: {
  *     codeSplitting: {
  *       groups: [
  *         {
  *           name: 'react',
  *           test: /node_modules[\\/]react/,
  *           priority: 2,
  *         },
  *         {
  *           name: 'other-libs',
  *           test: /node_modules/,
  *           priority: 1,
  *         },
  *       ],
  *     },
  *   },
  * });
  * ```
  *
  * @default 0
  */
  priority?: number;
  /**
  * Minimum size in bytes of the desired chunk. If the accumulated size of the captured modules by this group is smaller than this value, it will be ignored. Modules in this group will fall back to the `automatic chunking` if they are not captured by any other group.
  *
  * @default 0
  */
  minSize?: number;
  /**
  * Controls if a module should be captured based on how many entry chunks reference it.
  *
  * @default 1
  */
  minShareCount?: number;
  /**
  * If the accumulated size in bytes of the captured modules by this group is larger than this value, this group will be split into multiple groups that each has size close to this value.
  *
  * @default Infinity
  */
  maxSize?: number;
  /**
  * Controls whether a module can only be captured if its size in bytes is smaller than or equal to this value.
  *
  * @default Infinity
  */
  maxModuleSize?: number;
  /**
  * Controls whether a module can only be captured if its size in bytes is larger than or equal to this value.
  *
  * @default 0
  */
  minModuleSize?: number;
  /**
  * When `false` (default), all matching modules are merged into a single chunk.
  * Every entry that uses any of these modules must load the entire chunk — even
  * modules it doesn't need.
  *
  * When `true`, matching modules are grouped by which entries actually import them.
  * Modules shared by the same set of entries go into the same chunk, while modules
  * shared by a different set go into a separate chunk. This way, each entry only
  * loads the code it actually uses.
  *
  * Example: entries A, B, C all match a `"vendor"` group.
  * - `moduleX` is used by A, B, C
  * - `moduleY` is used by A, B only
  *
  * With `entriesAware: false` → one `vendor.js` chunk with both modules; C loads `moduleY` unnecessarily.
  * With `entriesAware: true`  → `vendor.js` (moduleX, loaded by all) + `vendor2.js` (moduleY, loaded by A and B only).
  *
  * @default false
  */
  entriesAware?: boolean;
  /**
  * Size threshold in bytes for merging small `entriesAware` subgroups into the
  * closest neighboring subgroup.
  *
  * This option only works when {@linkcode CodeSplittingGroup.entriesAware | entriesAware}
  * is `true`. Set to `0` to disable subgroup merging.
  *
  * @default 0
  */
  entriesAwareMergeThreshold?: number;
};
/**
* Alias for {@linkcode CodeSplittingGroup}. Use this type for the `codeSplitting.groups` option.
*
* @deprecated Please use {@linkcode CodeSplittingGroup} instead.
*/
/**
* Configuration options for advanced code splitting.
*/
type CodeSplittingOptions = {
  /**
  * By default, each group will also include captured modules' dependencies. This reduces the chance of generating circular chunks.
  *
  * If you want to disable this behavior, it's recommended to both set
  * - {@linkcode InputOptions.preserveEntrySignatures | preserveEntrySignatures}: `false | 'allow-extension'`
  * - {@linkcode OutputOptions.strictExecutionOrder | strictExecutionOrder}: `true`
  *
  * to avoid generating invalid chunks.
  *
  * @default true
  */
  includeDependenciesRecursively?: boolean;
  /**
  * Global fallback of {@linkcode CodeSplittingGroup.minSize | group.minSize}, if it's not specified in the group.
  */
  minSize?: number;
  /**
  * Global fallback of {@linkcode CodeSplittingGroup.maxSize | group.maxSize}, if it's not specified in the group.
  */
  maxSize?: number;
  /**
  * Global fallback of {@linkcode CodeSplittingGroup.maxModuleSize | group.maxModuleSize}, if it's not specified in the group.
  */
  maxModuleSize?: number;
  /**
  * Global fallback of {@linkcode CodeSplittingGroup.minModuleSize | group.minModuleSize}, if it's not specified in the group.
  */
  minModuleSize?: number;
  /**
  * Global fallback of {@linkcode CodeSplittingGroup.minShareCount | group.minShareCount}, if it's not specified in the group.
  */
  minShareCount?: number;
  /**
  * Groups to be used for code splitting.
  */
  groups?: CodeSplittingGroup[];
};
/**
* Alias for {@linkcode CodeSplittingOptions}. Use this type for the `codeSplitting` option.
*
* @deprecated Please use {@linkcode CodeSplittingOptions} instead.
*/
//#endregion
//#region src/api/watch/watch-emitter.d.ts
type ChangeEvent$1 = "create" | "update" | "delete";
type RolldownWatchBuild = BindingWatcherBundler;
/**
* - `START`: the watcher is (re)starting
* - `BUNDLE_START`: building an individual bundle
* - `BUNDLE_END`: finished building a bundle
*   - `duration`: the build duration in milliseconds
*   - `output`: an array of the {@linkcode OutputOptions.file | file} or {@linkcode OutputOptions.dir | dir} option values of the generated outputs
*   - `result`: the bundle object that can be used to generate additional outputs. This is especially important when the watch.skipWrite option is used. You should call `event.result.close()` once you are done generating outputs, or if you do not generate outputs. This will allow plugins to clean up resources via the `closeBundle` hook.
* - `END`: finished building all bundles
* - `ERROR`: encountered an error while bundling
*   - `error`: the error that was thrown
*   - `result`: the bundle object
*
* @category Programmatic APIs
*/
type RolldownWatcherEvent = {
  code: "START";
} | {
  code: "BUNDLE_START";
} | {
  code: "BUNDLE_END";
  duration: number;
  output: readonly string[];
  result: RolldownWatchBuild;
} | {
  code: "END";
} | {
  code: "ERROR";
  error: Error;
  result: RolldownWatchBuild;
};
/**
*
* @category Programmatic APIs
*/
type RolldownWatcherWatcherEventMap = {
  event: [data: RolldownWatcherEvent]; /** a file was modified */
  change: [id: string, change: {
    event: ChangeEvent$1;
  }]; /** a new run was triggered */
  restart: []; /** the watcher was closed */
  close: [];
};
/**
* @category Programmatic APIs
*/
interface RolldownWatcher {
  /**
  * Register a listener for events defined in {@linkcode RolldownWatcherWatcherEventMap}.
  */
  on<E extends keyof RolldownWatcherWatcherEventMap>(event: E, listener: (...args: RolldownWatcherWatcherEventMap[E]) => MaybePromise<void>): this;
  /**
  * Unregister a listener for events defined in {@linkcode RolldownWatcherWatcherEventMap}.
  */
  off<E extends keyof RolldownWatcherWatcherEventMap>(event: E, listener: (...args: RolldownWatcherWatcherEventMap[E]) => MaybePromise<void>): this;
  /**
  * Unregister all listeners for a specific event defined in {@linkcode RolldownWatcherWatcherEventMap}.
  */
  clear<E extends keyof RolldownWatcherWatcherEventMap>(event: E): void;
  /**
  * Close the watcher and stop listening for file changes.
  */
  close(): Promise<void>;
} //#endregion
//#region src/api/watch/index.d.ts
/**
* The API compatible with Rollup's `watch` function.
*
* This function will rebuild the bundle when it detects that the individual modules have changed on disk.
*
* Note that when using this function, it is your responsibility to call `event.result.close()` in response to the `BUNDLE_END` event to avoid resource leaks.
*
* @param input The watch options object or the list of them.
* @returns A watcher object.
*
* @example
* ```js
* import { watch } from 'rolldown';
*
* const watcher = watch({ /* ... *\/ });
* watcher.on('event', (event) => {
*   if (event.code === 'BUNDLE_END') {
*     console.log(event.duration);
*     event.result.close();
*   }
* });
*
* // Stop watching
* watcher.close();
* ```
*
* @experimental
* @category Programmatic APIs
*/
//#endregion
//#region src/binding-magic-string.d.ts
interface RolldownMagicString extends BindingMagicString {
  readonly isRolldownMagicString: true;
  /** Accepts a string or RegExp pattern. RegExp supports `$&`, `$$`, and `$N` substitutions. */
  replace(from: string | RegExp, to: string): this;
  /** Accepts a string or RegExp pattern. RegExp must have the global (`g`) flag. */
  replaceAll(from: string | RegExp, to: string): this;
}
type RolldownMagicStringConstructor = Omit<typeof BindingMagicString, "prototype"> & {
  new (...args: ConstructorParameters<typeof BindingMagicString>): RolldownMagicString;
  prototype: RolldownMagicString;
};
/**
* A native MagicString implementation powered by Rust.
*
* @experimental
*/
declare const RolldownMagicString: RolldownMagicStringConstructor; //#endregion
//#region src/log/log-handler.d.ts
type LoggingFunction = (log: RolldownLog | string | (() => RolldownLog | string)) => void;
type LoggingFunctionWithPosition = (log: RolldownLog | string | (() => RolldownLog | string), pos?: number | {
  column: number;
  line: number;
}) => void;
//#endregion
//#region src/options/generated/checks-options.d.ts
interface ChecksOptions {
  /**
  * Whether to emit warnings when detecting circular dependency.
  *
  * Circular dependencies lead to a bigger bundle size and sometimes cause execution order issues and are better to avoid.
  *
  *
  * @default false
  * */
  circularDependency?: boolean;
  /**
  * Whether to emit warnings when detecting uses of direct `eval`s.
  *
  * See [Avoiding Direct `eval` in Troubleshooting page](https://rolldown.rs/guide/troubleshooting#avoiding-direct-eval) for more details.
  * @default true
  * */
  eval?: boolean;
  /**
  * Whether to emit warnings when the `output.globals` option is missing when needed.
  *
  * See [`output.globals`](https://rolldown.rs/reference/OutputOptions.globals).
  * @default true
  * */
  missingGlobalName?: boolean;
  /**
  * Whether to emit warnings when the `output.name` option is missing when needed.
  *
  * See [`output.name`](https://rolldown.rs/reference/OutputOptions.name).
  * @default true
  * */
  missingNameOptionForIifeExport?: boolean;
  /**
  * Whether to emit warnings when the way to export values is ambiguous.
  *
  * See [`output.exports`](https://rolldown.rs/reference/OutputOptions.exports).
  * @default true
  * */
  mixedExports?: boolean;
  /**
  * Whether to emit warnings when an entrypoint cannot be resolved.
  * @default true
  * */
  unresolvedEntry?: boolean;
  /**
  * Whether to emit warnings when an import cannot be resolved.
  * @default true
  * */
  unresolvedImport?: boolean;
  /**
  * Whether to emit warnings when files generated have the same name with different contents.
  *
  *
  * @default true
  * */
  filenameConflict?: boolean;
  /**
  * Whether to emit warnings when a CommonJS variable is used in an ES module.
  *
  * CommonJS variables like `module` and `exports` are treated as global variables in ES modules and may not work as expected.
  *
  *
  * @default true
  * */
  commonJsVariableInEsm?: boolean;
  /**
  * Whether to emit warnings when an imported variable is not exported.
  *
  * If the code is importing a variable that is not exported by the imported module, the value will always be `undefined`. This might be a mistake in the code.
  *
  *
  * @default true
  * */
  importIsUndefined?: boolean;
  /**
  * Whether to emit warnings when `import.meta` is not supported with the output format and is replaced with an empty object (`{}`).
  *
  * See [`import.meta` in Non-ESM Output Formats page](https://rolldown.rs/in-depth/non-esm-output-formats#import-meta) for more details.
  * @default true
  * */
  emptyImportMeta?: boolean;
  /**
  * Whether to emit warnings when detecting tolerated transform.
  * @default true
  * */
  toleratedTransform?: boolean;
  /**
  * Whether to emit warnings when a namespace is called as a function.
  *
  * A module namespace object is an object and not a function. Calling it as a function will cause a runtime error.
  *
  *
  * @default true
  * */
  cannotCallNamespace?: boolean;
  /**
  * Whether to emit warnings when a config value is overridden by another config value with a higher priority.
  *
  *
  * @default true
  * */
  configurationFieldConflict?: boolean;
  /**
  * Whether to emit warnings when a plugin that is covered by a built-in feature is used.
  *
  * Using built-in features is generally more performant than using plugins.
  * @default true
  * */
  preferBuiltinFeature?: boolean;
  /**
  * Whether to emit warnings when Rolldown could not clean the output directory.
  *
  * See [`output.cleanDir`](https://rolldown.rs/reference/OutputOptions.cleanDir).
  * @default true
  * */
  couldNotCleanDirectory?: boolean;
  /**
  * Whether to emit warnings when plugins take significant time during the build process.
  *
  *
  * @default true
  * */
  pluginTimings?: boolean;
  /**
  * Whether to emit warnings when both the code and postBanner contain shebang
  *
  * Having multiple shebangs in a file is a syntax error.
  * @default true
  * */
  duplicateShebang?: boolean;
  /**
  * Whether to emit warnings when a tsconfig option or combination of options is not supported.
  * @default true
  * */
  unsupportedTsconfigOption?: boolean;
  /**
  * Whether to emit warnings when a module is dynamically imported but also statically imported, making the dynamic import ineffective for code splitting.
  * @default true
  * */
  ineffectiveDynamicImport?: boolean;
} //#endregion
//#region src/options/transform-options.d.ts
interface TransformOptions$2 extends Omit<TransformOptions$3, "sourceType" | "lang" | "cwd" | "sourcemap" | "define" | "inject" | "jsx"> {
  /**
  * Replace global variables or [property accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) with the provided values.
  *
  * See Oxc's [`define` option](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement.html#define) for more details.
  *
  * @example
  * **Replace the global variable `IS_PROD` with `true`**
  * ```js [rolldown.config.js]
  * export default defineConfig({
  *   transform: { define: { IS_PROD: 'true' } }
  * })
  * ```
  * Result:
  * ```js
  * // Input
  * if (IS_PROD) {
  *   console.log('Production mode')
  * }
  *
  * // After bundling
  * if (true) {
  *   console.log('Production mode')
  * }
  * ```
  *
  * **Replace the property accessor `process.env.NODE_ENV` with `'production'`**
  * ```js [rolldown.config.js]
  * export default defineConfig({
  *   transform: { define: { 'process.env.NODE_ENV': "'production'" } }
  * })
  * ```
  * Result:
  * ```js
  * // Input
  * if (process.env.NODE_ENV === 'production') {
  *   console.log('Production mode')
  * }
  *
  * // After bundling
  * if ('production' === 'production') {
  *   console.log('Production mode')
  * }
  * ```
  */
  define?: Record<string, string>;
  /**
  * Inject import statements on demand.
  *
  * The API is aligned with `@rollup/plugin-inject`.
  *
  * See Oxc's [`inject` option](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement.html#inject) for more details.
  *
  * #### Supported patterns
  * ```js
  * {
  *   // import { Promise } from 'es6-promise'
  *   Promise: ['es6-promise', 'Promise'],
  *
  *   // import { Promise as P } from 'es6-promise'
  *   P: ['es6-promise', 'Promise'],
  *
  *   // import $ from 'jquery'
  *   $: 'jquery',
  *
  *   // import * as fs from 'node:fs'
  *   fs: ['node:fs', '*'],
  *
  *   // Inject shims for property access pattern
  *   'Object.assign': path.resolve( 'src/helpers/object-assign.js' ),
  * }
  * ```
  */
  inject?: Record<string, string | [string, string]>;
  /**
  * Remove labeled statements with these label names.
  *
  * Labeled statements are JavaScript statements prefixed with a label identifier.
  * This option allows you to strip specific labeled statements from the output,
  * which is useful for removing debug-only code in production builds.
  *
  * @example
  * ```js rolldown.config.js
  * export default defineConfig({
  *   transform: { dropLabels: ['DEBUG', 'DEV'] }
  * })
  * ```
  * Result:
  * ```js
  * // Input
  * DEBUG: console.log('Debug info');
  * DEV: {
  *   console.log('Development mode');
  * }
  * console.log('Production code');
  *
  * // After bundling
  * console.log('Production code');
  * ```
  */
  dropLabels?: string[];
  /**
  * Controls how JSX syntax is transformed.
  *
  * - If set to `false`, an error will be thrown if JSX syntax is encountered.
  * - If set to `'react'`, JSX syntax will be transformed to classic runtime React code.
  * - If set to `'react-jsx'`, JSX syntax will be transformed to automatic runtime React code.
  * - If set to `'preserve'`, JSX syntax will be preserved as-is.
  */
  jsx?: false | "react" | "react-jsx" | "preserve" | JsxOptions;
} //#endregion
//#region src/options/normalized-input-options.d.ts
/** @category Plugin APIs */
interface NormalizedInputOptions {
  /** @see {@linkcode InputOptions.input | input} */
  input: string[] | Record<string, string>;
  /** @see {@linkcode InputOptions.cwd | cwd} */
  cwd: string;
  /** @see {@linkcode InputOptions.platform | platform} */
  platform: InputOptions["platform"];
  /** @see {@linkcode InputOptions.shimMissingExports | shimMissingExports} */
  shimMissingExports: boolean;
  /** @see {@linkcode InputOptions.context | context} */
  context: string;
  /** @see {@linkcode InputOptions.plugins | plugins} */
  plugins: RolldownPlugin[];
} //#endregion
//#region src/options/normalized-output-options.d.ts
type PathsFunction = (id: string) => string;
/**
* A normalized version of {@linkcode ModuleFormat}.
* @category Plugin APIs
*/
type InternalModuleFormat = "es" | "cjs" | "iife" | "umd";
/** @category Plugin APIs */
interface NormalizedOutputOptions {
  /** @see {@linkcode OutputOptions.name | name} */
  name: string | undefined;
  /** @see {@linkcode OutputOptions.file | file} */
  file: string | undefined;
  /** @see {@linkcode OutputOptions.dir | dir} */
  dir: string | undefined;
  /** @see {@linkcode OutputOptions.entryFileNames | entryFileNames} */
  entryFileNames: string | ChunkFileNamesFunction;
  /** @see {@linkcode OutputOptions.chunkFileNames | chunkFileNames} */
  chunkFileNames: string | ChunkFileNamesFunction;
  /** @see {@linkcode OutputOptions.assetFileNames | assetFileNames} */
  assetFileNames: string | AssetFileNamesFunction;
  /** @see {@linkcode OutputOptions.format | format} */
  format: InternalModuleFormat;
  /** @see {@linkcode OutputOptions.exports | exports} */
  exports: NonNullable<OutputOptions["exports"]>;
  /** @see {@linkcode OutputOptions.sourcemap | sourcemap} */
  sourcemap: boolean | "inline" | "hidden";
  /** @see {@linkcode OutputOptions.sourcemapBaseUrl | sourcemapBaseUrl} */
  sourcemapBaseUrl: string | undefined;
  /** @see {@linkcode OutputOptions.codeSplitting | codeSplitting} */
  codeSplitting: boolean;
  /** @deprecated Use `codeSplitting` instead. */
  inlineDynamicImports: boolean;
  /** @see {@linkcode OutputOptions.dynamicImportInCjs | dynamicImportInCjs} */
  dynamicImportInCjs: boolean;
  /** @see {@linkcode OutputOptions.externalLiveBindings | externalLiveBindings} */
  externalLiveBindings: boolean;
  /** @see {@linkcode OutputOptions.banner | banner} */
  banner: AddonFunction;
  /** @see {@linkcode OutputOptions.footer | footer} */
  footer: AddonFunction;
  /** @see {@linkcode OutputOptions.postBanner | postBanner} */
  postBanner: AddonFunction;
  /** @see {@linkcode OutputOptions.postFooter | postFooter} */
  postFooter: AddonFunction;
  /** @see {@linkcode OutputOptions.intro | intro} */
  intro: AddonFunction;
  /** @see {@linkcode OutputOptions.outro | outro} */
  outro: AddonFunction;
  /** @see {@linkcode OutputOptions.esModule | esModule} */
  esModule: boolean | "if-default-prop";
  /** @see {@linkcode OutputOptions.extend | extend} */
  extend: boolean;
  /** @see {@linkcode OutputOptions.globals | globals} */
  globals: Record<string, string> | GlobalsFunction;
  /** @see {@linkcode OutputOptions.paths | paths} */
  paths: Record<string, string> | PathsFunction | undefined;
  /** @see {@linkcode OutputOptions.hashCharacters | hashCharacters} */
  hashCharacters: "base64" | "base36" | "hex";
  /** @see {@linkcode OutputOptions.sourcemapDebugIds | sourcemapDebugIds} */
  sourcemapDebugIds: boolean;
  /** @see {@linkcode OutputOptions.sourcemapExcludeSources | sourcemapExcludeSources} */
  sourcemapExcludeSources: boolean;
  /** @see {@linkcode OutputOptions.sourcemapIgnoreList | sourcemapIgnoreList} */
  sourcemapIgnoreList: boolean | SourcemapIgnoreListOption | StringOrRegExp | undefined;
  /** @see {@linkcode OutputOptions.sourcemapPathTransform | sourcemapPathTransform} */
  sourcemapPathTransform: SourcemapPathTransformOption | undefined;
  /** @see {@linkcode OutputOptions.minify | minify} */
  minify: false | MinifyOptions | "dce-only";
  /**
  * @deprecated Use `comments.legal` instead.
  * @see {@linkcode OutputOptions.legalComments | legalComments}
  */
  legalComments: "none" | "inline";
  /** @see {@linkcode OutputOptions.comments | comments} */
  comments: Required<CommentsOptions>;
  /** @see {@linkcode OutputOptions.polyfillRequire | polyfillRequire} */
  polyfillRequire: boolean;
  /** @see {@linkcode OutputOptions.plugins | plugins} */
  plugins: RolldownPlugin[];
  /** @see {@linkcode OutputOptions.preserveModules | preserveModules} */
  preserveModules: boolean;
  /** @see {@linkcode OutputOptions.virtualDirname | virtualDirname} */
  virtualDirname: string;
  /** @see {@linkcode OutputOptions.preserveModulesRoot | preserveModulesRoot} */
  preserveModulesRoot?: string;
  /** @see {@linkcode OutputOptions.topLevelVar | topLevelVar} */
  topLevelVar?: boolean;
  /** @see {@linkcode OutputOptions.minifyInternalExports | minifyInternalExports} */
  minifyInternalExports?: boolean;
} //#endregion
//#region src/plugin/fs.d.ts
/** @category Plugin APIs */
interface RolldownFsModule {
  appendFile(path: string, data: string | Uint8Array, options?: {
    encoding?: BufferEncoding | null;
    mode?: string | number;
    flag?: string | number;
  }): Promise<void>;
  copyFile(source: string, destination: string, mode?: string | number): Promise<void>;
  mkdir(path: string, options?: {
    recursive?: boolean;
    mode?: string | number;
  }): Promise<void>;
  mkdtemp(prefix: string): Promise<string>;
  readdir(path: string, options?: {
    withFileTypes?: false;
  }): Promise<string[]>;
  readdir(path: string, options?: {
    withFileTypes: true;
  }): Promise<RolldownDirectoryEntry[]>;
  readFile(path: string, options?: {
    encoding?: null;
    flag?: string | number;
    signal?: AbortSignal;
  }): Promise<Uint8Array>;
  readFile(path: string, options?: {
    encoding: BufferEncoding;
    flag?: string | number;
    signal?: AbortSignal;
  }): Promise<string>;
  realpath(path: string): Promise<string>;
  rename(oldPath: string, newPath: string): Promise<void>;
  rmdir(path: string, options?: {
    recursive?: boolean;
  }): Promise<void>;
  stat(path: string): Promise<RolldownFileStats>;
  lstat(path: string): Promise<RolldownFileStats>;
  unlink(path: string): Promise<void>;
  writeFile(path: string, data: string | Uint8Array, options?: {
    encoding?: BufferEncoding | null;
    mode?: string | number;
    flag?: string | number;
  }): Promise<void>;
}
/** @category Plugin APIs */
type BufferEncoding = "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "base64url" | "latin1" | "binary" | "hex";
/** @category Plugin APIs */
interface RolldownDirectoryEntry {
  isFile(): boolean;
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
  name: string;
}
/** @category Plugin APIs */
interface RolldownFileStats {
  isFile(): boolean;
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
  size: number;
  mtime: Date;
  ctime: Date;
  atime: Date;
  birthtime: Date;
} //#endregion
//#region src/plugin/hook-filter.d.ts
/** @category Plugin APIs */
type GeneralHookFilter<Value = StringOrRegExp> = MaybeArray<Value> | {
  include?: MaybeArray<Value>;
  exclude?: MaybeArray<Value>;
};
interface FormalModuleTypeFilter {
  include?: ModuleType[];
}
/** @category Plugin APIs */
type ModuleTypeFilter = ModuleType[] | FormalModuleTypeFilter;
/**
* A filter to be used to do a pre-test to determine whether the hook should be called.
*
* See [Plugin Hook Filters page](https://rolldown.rs/apis/plugin-api/hook-filters) for more details.
*
* @category Plugin APIs
*/
interface HookFilter {
  /**
  * A filter based on the module `id`.
  *
  * If the value is a string, it is treated as a glob pattern.
  * The string type is not available for {@linkcode Plugin.resolveId | resolveId} hook.
  *
  * @example
  * Include all `id`s that contain `node_modules` in the path.
  * ```js
  * { id: '**'+'/node_modules/**' }
  * ```
  * @example
  * Include all `id`s that contain `node_modules` or `src` in the path.
  * ```js
  * { id: ['**'+'/node_modules/**', '**'+'/src/**'] }
  * ```
  * @example
  * Include all `id`s that start with `http`
  * ```js
  * { id: /^http/ }
  * ```
  * @example
  * Exclude all `id`s that contain `node_modules` in the path.
  * ```js
  * { id: { exclude: '**'+'/node_modules/**' } }
  * ```
  * @example
  * Formal pattern to define includes and excludes.
  * ```js
  * { id : {
  *   include: ['**'+'/foo/**', /bar/],
  *   exclude: ['**'+'/baz/**', /qux/]
  * }}
  * ```
  */
  id?: GeneralHookFilter;
  /**
  * A filter based on the module's `moduleType`.
  *
  * Only available for {@linkcode Plugin.transform | transform} hook.
  */
  moduleType?: ModuleTypeFilter;
  /**
  * A filter based on the module's code.
  *
  * Only available for {@linkcode Plugin.transform | transform} hook.
  */
  code?: GeneralHookFilter;
} //#endregion
//#region src/plugin/minimal-plugin-context.d.ts
/** @category Plugin APIs */
interface PluginContextMeta {
  /**
  * A property for Rollup compatibility. A dummy value is set by Rolldown.
  * @example `'4.23.0'`
  */
  rollupVersion: string;
  /**
  * The currently running version of Rolldown.
  * @example `'1.0.0'`
  */
  rolldownVersion: string;
  /**
  * Whether Rolldown was started via {@linkcode watch | rolldown.watch()} or
  * from the command line with `--watch`.
  */
  watchMode: boolean;
}
/** @category Plugin APIs */
interface MinimalPluginContext {
  /**
  * Similar to {@linkcode warn | this.warn}, except that it will also abort
  * the bundling process with an error.
  *
  * If an Error instance is passed, it will be used as-is, otherwise a new Error
  * instance will be created with the given error message and all additional
  * provided properties.
  *
  * In all hooks except the {@linkcode Plugin.onLog | onLog} hook, the error will
  * be augmented with {@linkcode RolldownLog.code | code: "PLUGIN_ERROR"} and
  * {@linkcode RolldownLog.plugin | plugin: plugin.name} properties.
  * If a `code` property already exists and the code does not start with `PLUGIN_`,
  * it will be renamed to {@linkcode RolldownLog.pluginCode | pluginCode}.
  *
  * @group Logging Methods
  */
  error: (e: RolldownError | string) => never;
  /**
  * Generate a `"info"` level log.
  *
  * {@linkcode RolldownLog.code | code} will be set to `"PLUGIN_LOG"` by Rolldown.
  * As these logs are displayed by default, use them for information that is not a warning
  * but makes sense to display to all users on every build.
  *
  *
  *
  * @inlineType LoggingFunction
  * @group Logging Methods
  */
  info: LoggingFunction;
  /**
  * Generate a `"warn"` level log.
  *
  * Just like internally generated warnings, these logs will be first passed to and
  * filtered by plugin {@linkcode Plugin.onLog | onLog} hooks before they are forwarded
  * to custom {@linkcode InputOptions.onLog | onLog} or
  * {@linkcode InputOptions.onwarn | onwarn} handlers or printed to the console.
  *
  * We encourage you to use objects with a {@linkcode RolldownLog.pluginCode | pluginCode}
  * property as that will allow users to easily filter for those logs in an `onLog` handler.
  *
  *
  *
  * @inlineType LoggingFunction
  * @group Logging Methods
  */
  warn: LoggingFunction;
  /**
  * Generate a `"debug"` level log.
  *
  * {@linkcode RolldownLog.code | code} will be set to `"PLUGIN_LOG"` by Rolldown.
  * Make sure to add a distinctive {@linkcode RolldownLog.pluginCode | pluginCode} to
  * those logs for easy filtering.
  *
  *
  *
  * @inlineType LoggingFunction
  * @group Logging Methods
  */
  debug: LoggingFunction;
  /** An object containing potentially useful metadata. */
  meta: PluginContextMeta;
} //#endregion
//#region src/plugin/parallel-plugin.d.ts
type ParallelPlugin = {
  _parallel: {
    fileUrl: string;
    options: unknown;
  };
};
/** @internal */
//#endregion
//#region src/plugin/plugin-context.d.ts
/**
* Either a {@linkcode name} or a {@linkcode fileName} can be supplied.
* If a {@linkcode fileName} is provided, it will be used unmodified as the name
* of the generated file, throwing an error if this causes a conflict.
* Otherwise, if a {@linkcode name} is supplied, this will be used as substitution
* for `[name]` in the corresponding
* {@linkcode OutputOptions.assetFileNames | output.assetFileNames} pattern, possibly
* adding a unique number to the end of the file name to avoid conflicts.
* If neither a {@linkcode name} nor {@linkcode fileName} is supplied, a default name will be used.
*
* @category Plugin APIs
*/
interface EmittedAsset {
  type: "asset";
  name?: string;
  fileName?: string;
  /**
  * An absolute path to the original file if this asset corresponds to a file on disk.
  *
  * This property will be passed on to subsequent plugin hooks that receive a
  * {@linkcode PreRenderedAsset} or an {@linkcode OutputAsset} like
  * {@linkcode Plugin.generateBundle | generateBundle}.
  * In watch mode, Rolldown will also automatically watch this file for changes and
  * trigger a rebuild if it changes. Therefore, it is not necessary to call
  * {@linkcode PluginContext.addWatchFile | this.addWatchFile} for this file.
  */
  originalFileName?: string;
  source: AssetSource;
}
/**
* Either a {@linkcode name} or a {@linkcode fileName} can be supplied.
* If a {@linkcode fileName} is provided, it will be used unmodified as the name
* of the generated file, throwing an error if this causes a conflict.
* Otherwise, if a {@linkcode name} is supplied, this will be used as substitution
* for `[name]` in the corresponding
* {@linkcode OutputOptions.chunkFileNames | output.chunkFileNames} pattern, possibly
* adding a unique number to the end of the file name to avoid conflicts.
* If neither a {@linkcode name} nor {@linkcode fileName} is supplied, a default name will be used.
*
* @category Plugin APIs
*/
interface EmittedChunk {
  type: "chunk";
  name?: string;
  fileName?: string;
  /**
  * When provided, this will override
  * {@linkcode InputOptions.preserveEntrySignatures | preserveEntrySignatures} for this particular
  * chunk.
  */
  preserveSignature?: "strict" | "allow-extension" | "exports-only" | false;
  /**
  * The module id of the entry point of the chunk.
  *
  * It will be passed through build hooks just like regular entry points,
  * starting with {@linkcode Plugin.resolveId | resolveId}.
  */
  id: string;
  /**
  * The value to be passed to {@linkcode Plugin.resolveId | resolveId}'s {@linkcode importer} parameter when resolving the entry point.
  * This is important to properly resolve relative paths. If it is not provided,
  * paths will be resolved relative to the current working directory.
  */
  importer?: string;
}
/** @category Plugin APIs */
interface EmittedPrebuiltChunk {
  type: "prebuilt-chunk";
  fileName: string;
  /**
  * A semantic name for the chunk. If not provided, `fileName` will be used.
  */
  name?: string;
  /**
  * The code of this chunk.
  */
  code: string;
  /**
  * The list of exported variable names from this chunk.
  *
  * This should be provided if the chunk exports any variables.
  */
  exports?: string[];
  /**
  * The corresponding source map for this chunk.
  */
  map?: SourceMap$1;
  sourcemapFileName?: string;
  /**
  * The module id of the facade module for this chunk, if any.
  */
  facadeModuleId?: string;
  /**
  * Whether this chunk corresponds to an entry point.
  */
  isEntry?: boolean;
  /**
  * Whether this chunk corresponds to a dynamic entry point.
  */
  isDynamicEntry?: boolean;
}
/** @inline @category Plugin APIs */
type EmittedFile = EmittedAsset | EmittedChunk | EmittedPrebuiltChunk;
/** @category Plugin APIs */
interface PluginContextResolveOptions {
  /**
  * The value for {@linkcode ResolveIdExtraOptions.kind | kind} passed to
  * {@linkcode Plugin.resolveId | resolveId} hooks.
  */
  kind?: BindingPluginContextResolveOptions["importKind"];
  /**
  * The value for {@linkcode ResolveIdExtraOptions.isEntry | isEntry} passed to
  * {@linkcode Plugin.resolveId | resolveId} hooks.
  *
  * @default `false` if there's an importer, `true` otherwise.
  */
  isEntry?: boolean;
  /**
  * Whether the {@linkcode Plugin.resolveId | resolveId} hook of the plugin from
  * which {@linkcode PluginContext.resolve | this.resolve} is called will be skipped
  * when resolving.
  *
  *
  *
  * @default true
  */
  skipSelf?: boolean;
  /**
  * Plugin-specific options.
  *
  * See [Custom resolver options section](https://rolldown.rs/apis/plugin-api/inter-plugin-communication#custom-resolver-options) for more details.
  */
  custom?: CustomPluginOptions;
}
/** @inline */
type GetModuleInfo = (moduleId: string) => ModuleInfo | null;
/** @category Plugin APIs */
interface PluginContext extends MinimalPluginContext {
  /**
  * Provides abstract access to the file system.
  */
  fs: RolldownFsModule;
  /**
  * Emits a new file that is included in the build output.
  * You can emit chunks, prebuilt chunks or assets.
  *
  *
  *
  * @returns A `referenceId` for the emitted file that can be used in various places to reference the emitted file.
  */
  emitFile(file: EmittedFile): string;
  /**
  * Get the file name of a chunk or asset that has been emitted via
  * {@linkcode emitFile | this.emitFile}.
  *
  * @returns The file name of the emitted file. Relative to {@linkcode OutputOptions.dir | output.dir}.
  */
  getFileName(referenceId: string): string;
  /**
  * Get all module ids in the current module graph.
  *
  * @returns
  * An iterator of module ids. It can be iterated via
  * ```js
  * for (const moduleId of this.getModuleIds()) {
  *   // ...
  * }
  * ```
  * or converted into an array via `Array.from(this.getModuleIds())`.
  */
  getModuleIds(): IterableIterator<string>;
  /**
  * Get additional information about the module in question.
  *
  *
  *
  * @returns Module information for that module. `null` if the module could not be found.
  * @group Methods
  */
  getModuleInfo: GetModuleInfo;
  /**
  * Adds additional files to be monitored in watch mode so that changes to these files will trigger rebuilds.
  *
  *
  */
  addWatchFile(id: string): void;
  /**
  * Loads and parses the module corresponding to the given id, attaching additional
  * meta information to the module if provided. This will trigger the same
  * {@linkcode Plugin.load | load}, {@linkcode Plugin.transform | transform} and
  * {@linkcode Plugin.moduleParsed | moduleParsed} hooks as if the module was imported
  * by another module.
  *
  *
  */
  load(options: {
    id: string;
    resolveDependencies?: boolean;
  } & Partial<PartialNull<ModuleOptions>>): Promise<ModuleInfo>;
  /**
  * Use Rolldown's internal parser to parse code to an [ESTree-compatible](https://github.com/estree/estree) AST.
  */
  parse(input: string, options?: ParserOptions | null): Program;
  /**
  * Resolve imports to module ids (i.e. file names) using the same plugins that Rolldown uses,
  * and determine if an import should be external.
  *
  * When calling this function from a {@linkcode Plugin.resolveId | resolveId} hook, you should
  * always check if it makes sense for you to pass along the
  * {@link PluginContextResolveOptions | options}.
  *
  * @returns
  * If `Promise<null>` is returned, the import could not be resolved by Rolldown or any plugin
  * but was not explicitly marked as external by the user.
  * If an absolute external id is returned that should remain absolute in the output either
  * via the
  * {@linkcode InputOptions.makeAbsoluteExternalsRelative | makeAbsoluteExternalsRelative}
  * option or by explicit plugin choice in the {@linkcode Plugin.resolveId | resolveId} hook,
  * `external` will be `"absolute"` instead of `true`.
  */
  resolve(source: string, importer?: string, options?: PluginContextResolveOptions): Promise<ResolvedId | null>;
} //#endregion
//#region src/plugin/transform-plugin-context.d.ts
/** @category Plugin APIs */
interface TransformPluginContext extends PluginContext {
  /**
  * Same as {@linkcode PluginContext.debug}, but a `position` param can be supplied.
  *
  * @inlineType LoggingFunctionWithPosition
  * @group Logging Methods
  */
  debug: LoggingFunctionWithPosition;
  /**
  * Same as {@linkcode PluginContext.info}, but a `position` param can be supplied.
  *
  * @inlineType LoggingFunctionWithPosition
  * @group Logging Methods
  */
  info: LoggingFunctionWithPosition;
  /**
  * Same as {@linkcode PluginContext.warn}, but a `position` param can be supplied.
  *
  * @inlineType LoggingFunctionWithPosition
  * @group Logging Methods
  */
  warn: LoggingFunctionWithPosition;
  /**
  * Same as {@linkcode PluginContext.error}, but the `id` of the current module will
  * also be added and a `position` param can be supplied.
  */
  error(e: RolldownError | string, pos?: number | {
    column: number;
    line: number;
  }): never;
  /**
  * Get the combined source maps of all previous plugins.
  */
  getCombinedSourcemap(): SourceMap$1;
} //#endregion
//#region src/types/module-side-effects.d.ts
interface ModuleSideEffectsRule {
  test?: RegExp;
  external?: boolean;
  sideEffects: boolean;
}
type ModuleSideEffectsOption = boolean | readonly string[] | ModuleSideEffectsRule[] | ((id: string, external: boolean) => boolean | undefined) | "no-external";
/**
* When passing an object, you can fine-tune the tree-shaking behavior.
*/
type TreeshakingOptions = {
  /**
  * **Values:**
  *
  * - **`true`**: All modules are assumed to have side effects and will be included in the bundle even if none of their exports are used.
  * - **`false`**: No modules have side effects. This enables aggressive tree-shaking, removing any modules whose exports are not used.
  * - **`string[]`**: Array of module IDs that have side effects. Only modules in this list will be preserved if unused; all others can be tree-shaken when their exports are unused.
  * - **`'no-external'`**: Assumes no external modules have side effects while preserving the default behavior for local modules.
  * - **`ModuleSideEffectsRule[]`**: Array of rules with `test`, `external`, and `sideEffects` properties for fine-grained control.
  * - **`function`**: Function that receives `(id, external)` and returns whether the module has side effects.
  *
  * **Important:** Setting this to `false` or using an array/string assumes that your modules and their dependencies have no side effects other than their exports. Only use this if you're certain that removing unused modules won't break your application.
  *
  * > [!NOTE]
  * > **Performance: Prefer `ModuleSideEffectsRule[]` over functions**
  * >
  * > When possible, use rule-based configuration instead of functions. Rules are processed entirely in Rust, while JavaScript functions require runtime calls between Rust and JavaScript, which can hurt CPU utilization during builds.
  * >
  * > **Functions should be a last resort**: Only use the function signature when your logic cannot be expressed with patterns or simple string matching.
  * >
  * > **Rule advantages**: `ModuleSideEffectsRule[]` provides better performance by avoiding Rust-JavaScript runtime calls, clearer intent, and easier maintenance.
  *
  * @example
  * ```js
  * // Assume no modules have side effects (aggressive tree-shaking)
  * treeshake: {
  *   moduleSideEffects: false
  * }
  *
  * // Only specific modules have side effects (string array)
  * treeshake: {
  *   moduleSideEffects: [
  *     'lodash',
  *     'react-dom',
  *   ]
  * }
  *
  * // Use rules for pattern matching and granular control
  * treeshake: {
  *   moduleSideEffects: [
  *     { test: /^node:/, sideEffects: true },
  *     { test: /\.css$/, sideEffects: true },
  *     { test: /some-package/, sideEffects: false, external: false },
  *   ]
  * }
  *
  * // Custom function to determine side effects
  * treeshake: {
  *   moduleSideEffects: (id, external) => {
  *     if (external) return false; // external modules have no side effects
  *     return id.includes('/side-effects/') || id.endsWith('.css');
  *   }
  * }
  *
  * // Assume no external modules have side effects
  * treeshake: {
  *   moduleSideEffects: 'no-external',
  * }
  * ```
  *
  * **Common Use Cases:**
  * - **CSS files**: `{ test: /\.css$/, sideEffects: true }` - preserve CSS imports
  * - **Polyfills**: Add specific polyfill modules to the array
  * - **Plugins**: Modules that register themselves globally on import
  * - **Library development**: Set to `false` for libraries where unused exports should be removed
  *
  * @default true
  */
  moduleSideEffects?: ModuleSideEffectsOption;
  /**
  * Whether to respect `/*@__PURE__*\/` annotations and other tree-shaking hints in the code.
  *
  * See [related Oxc documentation](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination#pure-annotations) for more details.
  *
  * @default true
  */
  annotations?: boolean;
  /**
  * Array of function names that should be considered pure (no side effects) even if they can't be automatically detected as pure.
  *
  * See [related Oxc documentation](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination#define-pure-functions) for more details.
  *
  * @example
  * ```js
  * treeshake: {
  *   manualPureFunctions: ['console.log', 'debug.trace']
  * }
  * ```
  * @default []
  */
  manualPureFunctions?: readonly string[];
  /**
  * Whether to assume that accessing unknown global properties might have side effects.
  *
  * See [related Oxc documentation](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination#ignoring-global-variable-access-side-effects) for more details.
  *
  * @default true
  */
  unknownGlobalSideEffects?: boolean;
  /**
  * Whether to assume that invalid import statements might have side effects.
  *
  * See [related Oxc documentation](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination#ignoring-invalid-import-statement-side-effects) for more details.
  *
  * @default false
  */
  invalidImportSideEffects?: boolean;
  /**
  * Whether to enable tree-shaking for CommonJS modules. When `true`, unused exports from CommonJS modules can be eliminated from the bundle, similar to ES modules. When disabled, CommonJS modules will always be included in their entirety.
  *
  * This option allows rolldown to analyze `exports.property` assignments in CommonJS modules and remove unused exports while preserving the module's side effects.
  *
  * @example
  * ```js
  * // source.js (CommonJS)
  * exports.used = 'This will be kept';
  * exports.unused = 'This will be tree-shaken away';
  *
  * // main.js
  * import { used } from './source.js';
  * // With commonjs: true, only the 'used' export is included in the bundle
  * // With commonjs: false, both exports are included
  * ```
  * @default true
  */
  commonjs?: boolean;
  /**
  * Controls whether reading properties from objects is considered to have side effects.
  *
  * Set to `false` for more aggressive tree-shaking behavior.
  *
  * See [related Oxc documentation](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination#ignoring-property-read-side-effects) for more details.
  *
  * @default 'always'
  */
  propertyReadSideEffects?: false | "always";
  /**
  * Controls whether writing properties to objects is considered to have side effects.
  *
  * Set to `false` for more aggressive behavior.
  *
  * @default 'always'
  */
  propertyWriteSideEffects?: false | "always";
}; //#endregion
//#region src/types/output-bundle.d.ts
/** @category Plugin APIs */
interface OutputBundle {
  [fileName: string]: OutputAsset | OutputChunk;
} //#endregion
//#region src/types/sourcemap.d.ts
/** @category Plugin APIs */
interface ExistingRawSourceMap {
  file?: string | null;
  mappings: string;
  names?: string[];
  sources?: (string | null)[];
  sourcesContent?: (string | null)[];
  sourceRoot?: string;
  version?: number;
  x_google_ignoreList?: number[];
}
/** @inline @category Plugin APIs */
type SourceMapInput = ExistingRawSourceMap | string | null; //#endregion
//#region src/utils/error.d.ts
/**
* The error type that is thrown by Rolldown for the whole build.
*/
//#endregion
//#region src/builtin-plugin/utils.d.ts
declare class BuiltinPlugin {
  name: BindingBuiltinPluginName;
  _options?: unknown;
  /** Vite-specific option to control plugin ordering */
  enforce?: "pre" | "post";
  constructor(name: BindingBuiltinPluginName, _options?: unknown);
} //#endregion
//#region src/constants/plugin.d.ts
declare const ENUMERATED_INPUT_PLUGIN_HOOK_NAMES: readonly ["options", "buildStart", "resolveId", "load", "transform", "moduleParsed", "buildEnd", "onLog", "resolveDynamicImport", "closeBundle", "closeWatcher", "watchChange"];
declare const ENUMERATED_OUTPUT_PLUGIN_HOOK_NAMES: readonly ["augmentChunkHash", "outputOptions", "renderChunk", "renderStart", "renderError", "writeBundle", "generateBundle"];
declare const ENUMERATED_PLUGIN_HOOK_NAMES: [...typeof ENUMERATED_INPUT_PLUGIN_HOOK_NAMES, ...typeof ENUMERATED_OUTPUT_PLUGIN_HOOK_NAMES, "footer", "banner", "intro", "outro"];
/**
* Names of all defined hooks. It's like
* ```ts
* type DefinedHookNames = {
*   options: 'options',
*   buildStart: 'buildStart',
*   ...
* }
* ```
*/
type DefinedHookNames = { readonly [K in (typeof ENUMERATED_PLUGIN_HOOK_NAMES)[number]]: K };
/**
* Names of all defined hooks. It's like
* ```js
* const DEFINED_HOOK_NAMES ={
*   options: 'options',
*   buildStart: 'buildStart',
*   ...
* }
* ```
*/
declare const DEFINED_HOOK_NAMES: DefinedHookNames; //#endregion
//#region src/plugin/with-filter.d.ts
//#endregion
//#region src/plugin/index.d.ts
type ModuleSideEffects = boolean | "no-treeshake" | null;
/** @category Plugin APIs */
type ModuleType = "js" | "jsx" | "ts" | "tsx" | "json" | "text" | "base64" | "dataurl" | "binary" | "empty" | (string & {});
/** @category Plugin APIs */
type ImportKind = BindingHookResolveIdExtraArgs["kind"];
/** @category Plugin APIs */
interface CustomPluginOptions {
  [plugin: string]: any;
}
/** @category Plugin APIs */
interface ModuleOptions {
  moduleSideEffects: ModuleSideEffects;
  /** See [Custom module meta-data section](https://rolldown.rs/apis/plugin-api/inter-plugin-communication#custom-module-meta-data) for more details. */
  meta: CustomPluginOptions;
  invalidate?: boolean;
  packageJsonPath?: string;
}
/** @category Plugin APIs */
interface ResolvedId extends ModuleOptions {
  external: boolean | "absolute";
  id: string;
}
interface SpecifiedModuleOptions {
  /**
  * Indicates whether the module has side effects to Rolldown.
  *
  * - If `false` is set and no other module imports anything from this module, then this module will not be included in the bundle even if the module would have side effects.
  * - If `true` is set, Rolldown will use its default algorithm to include all statements in the module that has side effects.
  * - If `"no-treeshake"` is set, treeshaking will be disabled for this module, and this module will be included in one of the chunks even if it is empty.
  *
  * The precedence of this option is as follows (highest to lowest):
  * 1. {@linkcode Plugin.transform | transform} hook's returned `moduleSideEffects` option
  * 2. {@linkcode Plugin.load | load} hook's returned `moduleSideEffects` option
  * 3. {@linkcode Plugin.resolveId | resolveId} hook's returned `moduleSideEffects` option
  * 4. {@linkcode TreeshakingOptions.moduleSideEffects | treeshake.moduleSideEffects} option
  * 5. `sideEffects` field in the `package.json` file
  * 6. `true` (default)
  */
  moduleSideEffects?: ModuleSideEffects | null;
}
/** @category Plugin APIs */
interface PartialResolvedId extends SpecifiedModuleOptions, Partial<PartialNull<ModuleOptions>> {
  /**
  * Whether this id should be treated as external.
  *
  * Relative external ids, i.e. ids starting with `./` or `../`, will not be internally
  * converted to an absolute id and converted back to a relative id in the output,
  * but are instead included in the output unchanged.
  * If you want relative ids to be re-normalized and deduplicated instead, return
  * an absolute file system location as id and choose `external: "relative"`.
  *
  * - If `true`, absolute ids will be converted to relative ids based on the user's choice for the {@linkcode InputOptions.makeAbsoluteExternalsRelative | makeAbsoluteExternalsRelative} option.
  * - If `'relative'`, absolute ids will always be converted to relative ids.
  * - If `'absolute'`, absolute ids will always be kept as absolute ids.
  */
  external?: boolean | "absolute" | "relative";
  id: string;
}
/** @category Plugin APIs */
interface SourceDescription extends SpecifiedModuleOptions, Partial<PartialNull<ModuleOptions>> {
  code: string;
  /**
  * The source map for the transformation.
  *
  * If the transformation does not move code, you can preserve existing sourcemaps by setting this to `null`.
  *
  * See [Source Code Transformations section](https://rolldown.rs/apis/plugin-api/transformations#source-code-transformations) for more details.
  */
  map?: SourceMapInput;
  moduleType?: ModuleType;
}
/** @inline */
interface ResolveIdExtraOptions {
  /**
  * Plugin-specific options.
  *
  * See [Custom resolver options section](https://rolldown.rs/apis/plugin-api/inter-plugin-communication#custom-resolver-options) for more details.
  */
  custom?: CustomPluginOptions;
  /**
  * Whether this is resolution for an entry point.
  *
  *
  */
  isEntry: boolean;
  /**
  * The kind of import being resolved.
  *
  * - `import-statement`: `import { foo } from './lib.js';`
  * - `dynamic-import`: `import('./lib.js')`
  * - `require-call`: `require('./lib.js')`
  * - `import-rule`: `@import 'bg-color.css'` (experimental)
  * - `url-token`: `url('./icon.png')` (experimental)
  * - `new-url`: `new URL('./worker.js', import.meta.url)` (experimental)
  * - `hot-accept`: `import.meta.hot.accept('./lib.js', () => {})` (experimental)
  */
  kind: BindingHookResolveIdExtraArgs["kind"];
}
/** @inline @category Plugin APIs */
type ResolveIdResult = string | NullValue | false | PartialResolvedId;
/** @inline @category Plugin APIs */
type LoadResult = NullValue | string | SourceDescription;
/** @inline @category Plugin APIs */
type TransformResult$1 = NullValue | string | (Omit<SourceDescription, "code"> & {
  code?: string | RolldownMagicString;
});
type RenderedChunkMeta = {
  /**
  * Contains information about all chunks that are being rendered.
  * This is useful to explore the entire chunk graph.
  */
  chunks: Record<string, RenderedChunk>;
  /**
  * A lazily-created MagicString instance for the chunk's code.
  * Use this to perform string transformations with automatic source map support.
  * This is only available when `experimental.nativeMagicString` is enabled.
  */
  magicString?: RolldownMagicString;
};
/** @category Plugin APIs */
interface FunctionPluginHooks {
  /**
  * A function that receives and filters logs and warnings generated by Rolldown and
  * plugins before they are passed to the {@linkcode InputOptions.onLog | onLog} option
  * or printed to the console.
  *
  * If `false` is returned, the log will be filtered out.
  * Otherwise, the log will be handed to the `onLog` hook of the next plugin,
  * the {@linkcode InputOptions.onLog | onLog} option, or printed to the console.
  * Plugins can also change the log level of a log or turn a log into an error by passing
  * the `log` object to {@linkcode MinimalPluginContext.error | this.error},
  * {@linkcode MinimalPluginContext.warn | this.warn},
  * {@linkcode MinimalPluginContext.info | this.info} or
  * {@linkcode MinimalPluginContext.debug | this.debug} and returning `false`.
  *
  *
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.onLog]: (this: MinimalPluginContext, level: LogLevel$1, log: RolldownLog) => NullValue | boolean;
  /**
  * Replaces or manipulates the options object passed to {@linkcode rolldown | rolldown()}.
  *
  * Returning `null` does not replace anything.
  *
  * If you just need to read the options, it is recommended to use
  * the {@linkcode buildStart} hook as that hook has access to the options
  * after the transformations from all `options` hooks have been taken into account.
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.options]: (this: MinimalPluginContext, options: InputOptions) => NullValue | InputOptions;
  /**
  * Replaces or manipulates the output options object passed to
  * {@linkcode RolldownBuild.generate | bundle.generate()} or
  * {@linkcode RolldownBuild.write | bundle.write()}.
  *
  * Returning null does not replace anything.
  *
  * If you just need to read the output options, it is recommended to use
  * the {@linkcode renderStart} hook as this hook has access to the output options
  * after the transformations from all `outputOptions` hooks have been taken into account.
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.outputOptions]: (this: MinimalPluginContext, options: OutputOptions) => NullValue | OutputOptions;
  /**
  * Called on each {@linkcode rolldown | rolldown()} build.
  *
  * This is the recommended hook to use when you need access to the options passed to {@linkcode rolldown | rolldown()} as it takes the transformations by all options hooks into account and also contains the right default values for unset options.
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.buildStart]: (this: PluginContext, options: NormalizedInputOptions) => void;
  /**
  * Defines a custom resolver.
  *
  * A resolver can be useful for e.g. locating third-party dependencies.
  *
  * Returning `null` defers to other `resolveId` hooks and eventually the default resolution behavior.
  * Returning `false` signals that `source` should be treated as an external module and not included in the bundle. If this happens for a relative import, the id will be renormalized the same way as when the {@linkcode InputOptions.external} option is used.
  * If you return an object, then it is possible to resolve an import to a different id while excluding it from the bundle at the same time.
  *
  * Note that while `resolveId` will be called for each import of a module and can therefore
  * resolve to the same `id` many times, values for `external`, `meta` or `moduleSideEffects`
  * can only be set once before the module is loaded. The reason is that after this call,
  * Rolldown will continue with the {@linkcode load} and {@linkcode transform} hooks for that
  * module that may override these values and should take precedence if they do so.
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.resolveId]: (this: PluginContext, source: string, importer: string | undefined, extraOptions: ResolveIdExtraOptions) => ResolveIdResult;
  /**
  * Defines a custom resolver for dynamic imports.
  *
  * @deprecated
  * This hook exists only for Rollup compatibility. Please use {@linkcode resolveId} instead.
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.resolveDynamicImport]: (this: PluginContext, source: string, importer: string | undefined) => ResolveIdResult;
  /**
  * Defines a custom loader.
  *
  * Returning `null` defers to other `load` hooks or the built-in loading mechanism.
  *
  * You can use {@linkcode PluginContext.getModuleInfo | this.getModuleInfo()} to find out the previous values of `meta`, `moduleSideEffects` inside this hook.
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.load]: (this: PluginContext, id: string) => MaybePromise<LoadResult>;
  /**
  * Can be used to transform individual modules.
  *
  * Note that it's possible to return only properties and no code transformations.
  *
  * You can use {@linkcode PluginContext.getModuleInfo | this.getModuleInfo()} to find out the previous values of `meta`, `moduleSideEffects` inside this hook.
  *
  *
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.transform]: (this: TransformPluginContext, code: string, id: string, meta: BindingTransformHookExtraArgs & {
    moduleType: ModuleType;
    magicString?: RolldownMagicString;
    ast?: Program;
  }) => TransformResult$1;
  /**
  * This hook is called each time a module has been fully parsed by Rolldown.
  *
  * This hook will wait until all imports are resolved so that the information in
  * {@linkcode ModuleInfo.importedIds | moduleInfo.importedIds},
  * {@linkcode ModuleInfo.dynamicallyImportedIds | moduleInfo.dynamicallyImportedIds}
  * are complete and accurate. Note however that information about importing modules
  * may be incomplete as additional importers could be discovered later.
  * If you need this information, use the {@linkcode buildEnd} hook.
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.moduleParsed]: (this: PluginContext, moduleInfo: ModuleInfo) => void;
  /**
  * Called when Rolldown has finished bundling, but before Output Generation Hooks.
  * If an error occurred during the build, it is passed on to this hook.
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.buildEnd]: (this: PluginContext, err?: Error) => void;
  /**
  * Called initially each time {@linkcode RolldownBuild.generate | bundle.generate()} or
  * {@linkcode RolldownBuild.write | bundle.write()} is called.
  *
  * To get notified when generation has completed, use the {@linkcode generateBundle} and
  * {@linkcode renderError} hooks.
  *
  * This is the recommended hook to use when you need access to the output options passed to
  * {@linkcode RolldownBuild.generate | bundle.generate()} or
  * {@linkcode RolldownBuild.write | bundle.write()} as it takes the transformations by all outputOptions hooks into account and also contains the right default values for unset options.
  *
  * It also receives the input options passed to {@linkcode rolldown | rolldown()} so that
  * plugins that can be used as output plugins, i.e. plugins that only use generate phase hooks,
  * can get access to them.
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.renderStart]: (this: PluginContext, outputOptions: NormalizedOutputOptions, inputOptions: NormalizedInputOptions) => void;
  /**
  * Can be used to transform individual chunks. Called for each Rolldown output chunk file.
  *
  * Returning null will apply no transformations. If you change code in this hook and want to support source maps, you need to return a map describing your changes, see [Source Code Transformations section](https://rolldown.rs/apis/plugin-api/transformations#source-code-transformations).
  *
  * `chunk` is mutable and changes applied in this hook will propagate to other plugins and
  * to the generated bundle.
  * That means if you add or remove imports or exports in this hook, you should update
  * {@linkcode RenderedChunk.imports | imports}, {@linkcode RenderedChunk.importedBindings | importedBindings} and/or {@linkcode RenderedChunk.exports | exports} accordingly.
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.renderChunk]: (this: PluginContext, code: string, chunk: RenderedChunk, outputOptions: NormalizedOutputOptions, meta: RenderedChunkMeta) => NullValue | string | RolldownMagicString | {
    code: string | RolldownMagicString;
    map?: SourceMapInput;
  };
  /**
  * Can be used to augment the hash of individual chunks. Called for each Rolldown output chunk.
  *
  * Returning a falsy value will not modify the hash.
  * Truthy values will be used as an additional source for hash calculation.
  *
  *
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.augmentChunkHash]: (this: PluginContext, chunk: RenderedChunk) => string | void;
  /**
  * Called when Rolldown encounters an error during
  * {@linkcode RolldownBuild.generate | bundle.generate()} or
  * {@linkcode RolldownBuild.write | bundle.write()}.
  *
  * To get notified when generation completes successfully, use the
  * {@linkcode generateBundle} hook.
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.renderError]: (this: PluginContext, error: Error) => void;
  /**
  * Called at the end of {@linkcode RolldownBuild.generate | bundle.generate()} or
  * immediately before the files are written in
  * {@linkcode RolldownBuild.write | bundle.write()}.
  *
  * To modify the files after they have been written, use the {@linkcode writeBundle} hook.
  *
  *
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.generateBundle]: (this: PluginContext, outputOptions: NormalizedOutputOptions, bundle: OutputBundle, isWrite: boolean) => void;
  /**
  * Called only at the end of {@linkcode RolldownBuild.write | bundle.write()} once
  * all files have been written.
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.writeBundle]: (this: PluginContext, outputOptions: NormalizedOutputOptions, bundle: OutputBundle) => void;
  /**
  * Can be used to clean up any external service that may be running.
  *
  * Rolldown's CLI will make sure this hook is called after each run, but it is the responsibility
  * of users of the JavaScript API to manually call
  * {@linkcode RolldownBuild.close | bundle.close()} once they are done generating bundles.
  * For that reason, any plugin relying on this feature should carefully mention this in
  * its documentation.
  *
  * If a plugin wants to retain resources across builds in watch mode, they can check for
  * {@linkcode PluginContextMeta.watchMode | this.meta.watchMode} in this hook and perform
  * the necessary cleanup for watch mode in closeWatcher.
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.closeBundle]: (this: PluginContext, error?: Error) => void;
  /**
  * Notifies a plugin whenever Rolldown has detected a change to a monitored file in watch mode.
  *
  * If a build is currently running, this hook is called once the build finished.
  * It will be called once for every file that changed.
  *
  * This hook cannot be used by output plugins.
  *
  * If you need to be notified immediately when a file changed, you can use the {@linkcode WatcherOptions.onInvalidate | watch.onInvalidate} option.
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.watchChange]: (this: PluginContext, id: string, event: {
    event: ChangeEvent;
  }) => void;
  /**
  * Notifies a plugin when the watcher process will close so that all open resources can be closed too.
  *
  * This hook cannot be used by output plugins.
  *
  * @group Build Hooks
  */
  [DEFINED_HOOK_NAMES.closeWatcher]: (this: PluginContext) => void;
}
type ChangeEvent = "create" | "update" | "delete";
type PluginOrder = "pre" | "post" | null;
/** @inline */
type ObjectHookMeta = {
  order?: PluginOrder;
};
/**
* A hook in a function or an object form with additional properties.
*
* @typeParam T - The type of the hook function.
* @typeParam O - Additional properties that are specific to some hooks.
*
*
*
* @category Plugin APIs
*/
type ObjectHook<T, O = {}> = T | ({
  handler: T;
} & ObjectHookMeta & O);
type SyncPluginHooks = DefinedHookNames["augmentChunkHash" | "onLog" | "outputOptions"];
/** @category Plugin APIs */
type AsyncPluginHooks = Exclude<keyof FunctionPluginHooks, SyncPluginHooks>;
type FirstPluginHooks = DefinedHookNames["load" | "resolveDynamicImport" | "resolveId"];
type SequentialPluginHooks = DefinedHookNames["augmentChunkHash" | "generateBundle" | "onLog" | "options" | "outputOptions" | "renderChunk" | "transform"];
interface AddonHooks {
  /**
  * A hook equivalent to {@linkcode OutputOptions.banner | output.banner} option.
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.banner]: AddonHook;
  /**
  * A hook equivalent to {@linkcode OutputOptions.footer | output.footer} option.
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.footer]: AddonHook;
  /**
  * A hook equivalent to {@linkcode OutputOptions.intro | output.intro} option.
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.intro]: AddonHook;
  /**
  * A hook equivalent to {@linkcode OutputOptions.outro | output.outro} option.
  *
  * @group Output Generation Hooks
  */
  [DEFINED_HOOK_NAMES.outro]: AddonHook;
}
type OutputPluginHooks = DefinedHookNames["augmentChunkHash" | "generateBundle" | "outputOptions" | "renderChunk" | "renderError" | "renderStart" | "writeBundle"];
/** @internal */
type ParallelPluginHooks = Exclude<keyof FunctionPluginHooks | keyof AddonHooks, FirstPluginHooks | SequentialPluginHooks>;
/** @category Plugin APIs */
type HookFilterExtension<K extends keyof FunctionPluginHooks> = K extends "transform" ? {
  filter?: HookFilter | TopLevelFilterExpression[];
} : K extends "load" ? {
  filter?: Pick<HookFilter, "id"> | TopLevelFilterExpression[];
} : K extends "resolveId" ? {
  filter?: {
    id?: GeneralHookFilter<RegExp>;
  } | TopLevelFilterExpression[];
} : K extends "renderChunk" ? {
  filter?: Pick<HookFilter, "code"> | TopLevelFilterExpression[];
} : {};
type PluginHooks = { [K in keyof FunctionPluginHooks]: ObjectHook<K extends AsyncPluginHooks ? MakeAsync<FunctionPluginHooks[K]> : FunctionPluginHooks[K], HookFilterExtension<K> & (K extends ParallelPluginHooks ? {
  /**
  * @deprecated
  * this is only for rollup Plugin type compatibility.
  * hooks always work as `sequential: true`.
  */
  sequential?: boolean;
} : {})> };
type AddonHookFunction = (this: PluginContext, chunk: RenderedChunk) => string | Promise<string>;
type AddonHook = string | AddonHookFunction;
interface OutputPlugin extends Partial<{ [K in keyof PluginHooks as K & OutputPluginHooks]: PluginHooks[K] }>, Partial<{ [K in keyof AddonHooks]: ObjectHook<AddonHook> }> {
  /** The name of the plugin, for use in error messages and logs. */
  name: string;
  /** The version of the plugin, for use in inter-plugin communication scenarios. */
  version?: string;
}
/**
* The Plugin interface.
*
* See [Plugin API document](https://rolldown.rs/apis/plugin-api) for details.
*
* @typeParam A - The type of the {@link Plugin.api | api} property.
*
* @category Plugin APIs
*/
interface Plugin$2<A = any> extends OutputPlugin, Partial<PluginHooks> {
  /**
  * Used for inter-plugin communication.
  */
  api?: A;
}
type RolldownPlugin<A = any> = Plugin$2<A> | BuiltinPlugin | ParallelPlugin;
type RolldownPluginOption<A = any> = MaybePromise<NullValue<RolldownPlugin<A>> | {
  name: string;
} | false | RolldownPluginOption[]>;
type RolldownOutputPlugin = OutputPlugin | BuiltinPlugin;
type RolldownOutputPluginOption = MaybePromise<NullValue<RolldownOutputPlugin> | {
  name: string;
} | false | RolldownOutputPluginOption[]>; //#endregion
//#region src/options/input-options.d.ts
/**
* @inline
*/
type InputOption = string | string[] | Record<string, string>;
/**
* @param id The id of the module being checked.
* @param parentId The id of the module importing the id being checked.
* @param isResolved Whether the id has been resolved.
* @returns Whether the module should be treated as external.
*/
type ExternalOptionFunction = (id: string, parentId: string | undefined, isResolved: boolean) => NullValue<boolean>;
/** @inline */
type ExternalOption = StringOrRegExp | StringOrRegExp[] | ExternalOptionFunction;
type ModuleTypes = Record<string, "js" | "jsx" | "ts" | "tsx" | "json" | "text" | "base64" | "dataurl" | "binary" | "empty" | "css" | "asset" | "copy">;
interface WatcherFileWatcherOptions {
  /**
  * Whether to use polling-based file watching instead of native OS events.
  *
  * Polling is useful for environments where native FS events are unreliable,
  * such as network mounts, Docker volumes, or WSL2.
  *
  * @default false
  */
  usePolling?: boolean;
  /**
  * Interval between each poll in milliseconds.
  *
  * This option is only used when {@linkcode usePolling} is `true`.
  *
  * @default 100
  */
  pollInterval?: number;
  /**
  * Whether to compare file contents for poll-based watchers.
  * When enabled, poll watchers will check file contents to determine if they actually changed.
  *
  * This option is only used when {@linkcode usePolling} is `true`.
  *
  * @default false
  */
  compareContentsForPolling?: boolean;
  /**
  * Whether to use debounced event delivery at the filesystem level.
  * This coalesces rapid filesystem events before they reach the build coordinator.
  * @default false
  */
  useDebounce?: boolean;
  /**
  * Debounce delay in milliseconds for fs-level debounced watchers.
  * Only used when {@linkcode useDebounce} is `true`.
  * @default 10
  */
  debounceDelay?: number;
  /**
  * Tick rate in milliseconds for the debouncer's internal polling.
  * Only used when {@linkcode useDebounce} is `true`.
  * When undefined, auto-selects 1/4 of debounceDelay.
  */
  debounceTickRate?: number;
}
interface WatcherOptions {
  /**
  * Whether to skip the {@linkcode RolldownBuild.write | bundle.write()} step when a rebuild is triggered.
  * @default false
  */
  skipWrite?: boolean;
  /**
  * Configures how long Rolldown will wait for further changes until it triggers
  * a rebuild in milliseconds.
  *
  * Even if this value is set to 0, there's a small debounce timeout configured
  * in the file system watcher. Setting this to a value greater than 0 will mean
  * that Rolldown will only trigger a rebuild if there was no change for the
  * configured number of milliseconds. If several configurations are watched,
  * Rolldown will use the largest configured build delay.
  *
  * This option is useful if you use a tool that regenerates multiple source files
  * very slowly. Rebuilding immediately after the first change could cause Rolldown
  * to generate a broken intermediate build before generating a successful final
  * build, which can be confusing and distracting.
  *
  * @default 0
  */
  buildDelay?: number;
  /**
  * File watcher options for configuring how file changes are detected.
  */
  watcher?: WatcherFileWatcherOptions;
  /**
  * @deprecated Use {@linkcode watcher} instead.
  */
  notify?: WatcherFileWatcherOptions;
  /**
  * Filter to limit the file-watching to certain files.
  *
  * Strings are treated as glob patterns.
  * Note that this only filters the module graph but does not allow adding
  * additional watch files.
  *
  * @example
  * ```js
  * export default defineConfig({
  *   watch: {
  *     include: 'src/**',
  *   },
  * })
  * ```
  * @default []
  */
  include?: StringOrRegExp | StringOrRegExp[];
  /**
  * Filter to prevent files from being watched.
  *
  * Strings are treated as glob patterns.
  *
  * @example
  * ```js
  * export default defineConfig({
  *   watch: {
  *     exclude: 'node_modules/**',
  *   },
  * })
  * ```
  * @default []
  */
  exclude?: StringOrRegExp | StringOrRegExp[];
  /**
  * An optional function that will be called immediately every time
  * a module changes that is part of the build.
  *
  * This is different from the {@linkcode Plugin.watchChange | watchChange} plugin hook, which is
  * only called once the running build has finished. This may for
  * instance be used to prevent additional steps from being performed
  * if we know another build will be started anyway once the current
  * build finished. This callback may be called multiple times per
  * build as it tracks every change.
  *
  * @param id The id of the changed module.
  */
  onInvalidate?: (id: string) => void;
  /**
  * Whether to clear the screen when a rebuild is triggered.
  * @default true
  */
  clearScreen?: boolean;
}
/** @inline */
type MakeAbsoluteExternalsRelative = boolean | "ifRelativeSource";
type DevModeOptions = boolean | {
  host?: string;
  port?: number;
  implement?: string;
  lazy?: boolean;
};
type OptimizationOptions = {
  /**
  * Inline imported constant values during bundling instead of preserving variable references.
  *
  * When enabled, constant values from imported modules will be inlined at their usage sites,
  * potentially reducing bundle size and improving runtime performance by eliminating variable lookups.
  *
  * **Options:**
  * - `true`: equivalent to `{ mode: 'all', pass: 1 }`, enabling constant inlining for all eligible constants with a single pass.
  * - `false`: Disable constant inlining
  * - `{ mode: 'smart' | 'all', pass?: number }`:
  *   - `mode: 'smart'`: Only inline constants in specific scenarios where it is likely to reduce bundle size and improve performance.
  *     Smart mode inlines constants in these specific scenarios:
  *     1. `if (test) {} else {}` - condition expressions in if statements
  *     2. `test ? a : b` - condition expressions in ternary operators
  *     3. `test1 || test2` - logical OR expressions
  *     4. `test1 && test2` - logical AND expressions
  *     5. `test1 ?? test2` - nullish coalescing expressions
  *  - `mode: 'all'`: Inline all imported constants wherever they are used.
  *  - `pass`: Number of passes to perform for inlining constants.
  *
  * @example
  * ```js
  * // Input files:
  * // constants.js
  * export const API_URL = 'https://api.example.com';
  *
  * // main.js
  * import { API_URL } from './constants.js';
  * console.log(API_URL);
  *
  * // With inlineConst: true, the bundled output becomes:
  * console.log('https://api.example.com');
  *
  * // Instead of:
  * const API_URL = 'https://api.example.com';
  * console.log(API_URL);
  * ```
  *
  * @default { mode: 'smart', pass: 1 }
  */
  inlineConst?: boolean | {
    mode?: "all" | "smart";
    pass?: number;
  };
  /**
  * Use PIFE pattern for module wrappers.
  *
  * Enabling this option improves the start up performance of the generated bundle with the cost of a slight increase in bundle size.
  *
  *
  *
  * @default true
  */
  pifeForModuleWrappers?: boolean;
};
/** @inline */
type AttachDebugOptions = "none" | "simple" | "full";
/** @inline */
type ChunkModulesOrder = "exec-order" | "module-id";
/** @inline */
type OnLogFunction = (level: LogLevel$1, log: RolldownLog, defaultHandler: LogOrStringHandler) => void;
/** @inline */
type OnwarnFunction = (warning: RolldownLog, defaultHandler: (warning: RolldownLogWithString | (() => RolldownLogWithString)) => void) => void;
interface InputOptions {
  /**
  * Defines entries and location(s) of entry modules for the bundle. Relative paths are resolved based on the {@linkcode cwd} option.
  *
  */
  input?: InputOption;
  /**
  * The list of plugins to use.
  *
  * Falsy plugins will be ignored, which can be used to easily activate or deactivate plugins. Nested plugins will be flattened. Async plugins will be awaited and resolved.
  *
  * See [Plugin API document](https://rolldown.rs/apis/plugin-api) for more details about creating plugins.
  *
  * @example
  * ```js
  * import { defineConfig } from 'rolldown'
  *
  * export default defineConfig({
  *   plugins: [
  *     examplePlugin1(),
  *     // Conditional plugins
  *     process.env.ENV1 && examplePlugin2(),
  *     // Nested plugins arrays are flattened
  *     [examplePlugin3(), examplePlugin4()],
  *   ]
  * })
  * ```
  */
  plugins?: RolldownPluginOption;
  /**
  * Specifies which modules should be treated as external and not bundled. External modules will be left as import statements in the output.
  *
  */
  external?: ExternalOption;
  /**
  * Options for built-in module resolution feature.
  */
  resolve?: {
    /**
    * Substitute one package for another.
    *
    * One use case for this feature is replacing a node-only package with a browser-friendly package in third-party code that you don't control.
    *
    * @example
    * ```js
    * resolve: {
    *   alias: {
    *     '@': '/src',
    *     'utils': './src/utils',
    *   }
    * }
    * ```
    * > [!WARNING]
    * > `resolve.alias` will not call [`resolveId`](/reference/Interface.Plugin#resolveid) hooks of other plugin.
    * > If you want to call `resolveId` hooks of other plugin, use `viteAliasPlugin` from `rolldown/experimental` instead.
    * > You could find more discussion in [this issue](https://github.com/rolldown/rolldown/issues/3615)
    */
    alias?: Record<string, string[] | string | false>;
    /**
    * Fields in package.json to check for aliased paths.
    *
    * This option is expected to be used for `browser` field support.
    *
    * @default
    * - `[['browser']]` for `browser` platform
    * - `[]` for other platforms
    */
    aliasFields?: string[][];
    /**
    * Condition names to use when resolving exports in package.json.
    *
    * @default
    * Defaults based on platform and import kind:
    * - `browser` platform
    *   - `["import", "browser", "default"]` for import statements
    *   - `["require", "browser", "default"]` for require() calls
    * - `node` platform
    *   - `["import", "node", "default"]` for import statements
    *   - `["require", "node", "default"]` for require() calls
    * - `neutral` platform
    *   - `["import", "default"]` for import statements
    *   - `["require", "default"]` for require() calls
    */
    conditionNames?: string[];
    /**
    * Map of extensions to alternative extensions.
    *
    * With writing `import './foo.js'` in a file, you want to resolve it to `foo.ts` instead of `foo.js`.
    * You can achieve this by setting: `extensionAlias: { '.js': ['.ts', '.js'] }`.
    */
    extensionAlias?: Record<string, string[]>;
    /**
    * Fields in package.json to check for exports.
    *
    * @default `[['exports']]`
    */
    exportsFields?: string[][];
    /**
    * Extensions to try when resolving files. These are tried in order from first to last.
    *
    * @default `['.tsx', '.ts', '.jsx', '.js', '.json']`
    */
    extensions?: string[];
    /**
    * Fields in package.json to check for entry points.
    *
    * @default
    * Defaults based on platform:
    * - `node` platform: `['main', 'module']`
    * - `browser` platform: `['browser', 'module', 'main']`
    * - `neutral` platform: `[]`
    */
    mainFields?: string[];
    /**
    * Filenames to try when resolving directories.
    * @default ['index']
    */
    mainFiles?: string[];
    /**
    * Directories to search for modules.
    * @default ['node_modules']
    */
    modules?: string[];
    /**
    * Whether to follow symlinks when resolving modules.
    * @default true
    */
    symlinks?: boolean;
    /**
    * @deprecated Use the top-level {@linkcode tsconfig} option instead.
    */
    tsconfigFilename?: string;
  };
  /**
  * The working directory to use when resolving relative paths in the configuration.
  * @default process.cwd()
  */
  cwd?: string;
  /**
  * Expected platform where the code run.
  *
  *  When the platform is set to neutral:
  *    - When bundling is enabled the default output format is set to esm, which uses the export syntax introduced with ECMAScript 2015 (i.e. ES6). You can change the output format if this default is not appropriate.
  *    - The main fields setting is empty by default. If you want to use npm-style packages, you will likely have to configure this to be something else such as main for the standard main field used by node.
  *    - The conditions setting does not automatically include any platform-specific values.
  *
  * @default
  * - `'node'` if the format is `'cjs'`
  * - `'browser'` for other formats
  *
  */
  platform?: "node" | "browser" | "neutral";
  /**
  * When `true`, creates shim variables for missing exports instead of throwing an error.
  * @default false
  *
  */
  shimMissingExports?: boolean;
  /**
  * Controls tree-shaking (dead code elimination).
  *
  * See the [In-depth Dead Code Elimination Guide](https://rolldown.rs/in-depth/dead-code-elimination) for more details.
  *
  * When `false`, tree-shaking will be disabled.
  * When `true`, it is equivalent to setting each options to the default value.
  *
  * @default true
  */
  treeshake?: boolean | TreeshakingOptions;
  /**
  * Controls the verbosity of console logging during the build.
  *
  *
  *
  * @default 'info'
  */
  logLevel?: LogLevelOption;
  /**
  * A function that intercepts log messages. If not supplied, logs are printed to the console.
  *
  *
  *
  * @example
  * ```js
  * export default defineConfig({
  *   onLog(level, log, defaultHandler) {
  *     if (log.code === 'CIRCULAR_DEPENDENCY') {
  *       return; // Ignore circular dependency warnings
  *     }
  *     if (level === 'warn') {
  *       defaultHandler('error', log); // turn other warnings into errors
  *     } else {
  *       defaultHandler(level, log); // otherwise, just print the log
  *     }
  *   }
  * })
  * ```
  */
  onLog?: OnLogFunction;
  /**
  * A function that will intercept warning messages.
  *
  *
  *
  * @deprecated
  * This is a legacy API. Consider using {@linkcode onLog} instead for better control over all log types.
  *
  *
  */
  onwarn?: OnwarnFunction;
  /**
  * Maps file patterns to module types, controlling how files are processed.
  *
  * This is conceptually similar to [esbuild's `loader`](https://esbuild.github.io/api/#loader) option, allowing you to specify how each file extensions should be handled.
  *
  * See [the In-Depth Guide](https://rolldown.rs/in-depth/module-types) for more details.
  *
  * @example
  * ```js
  * import { defineConfig } from 'rolldown'
  *
  * export default defineConfig({
  *   moduleTypes: {
  *     '.frag': 'text',
  *   }
  * })
  * ```
  */
  moduleTypes?: ModuleTypes;
  /**
  * Experimental features that may change in future releases and can introduce behavior change without a major version bump.
  * @experimental
  */
  experimental?: {
    /**
    * Enable Vite compatible mode.
    * @default false
    * @hidden This option is only meant to be used by Vite. It is not recommended to use this option directly.
    */
    viteMode?: boolean;
    /**
    * When enabled, `new URL()` calls will be transformed to a stable asset URL which includes the updated name and content hash.
    * It is necessary to pass `import.meta.url` as the second argument to the
    * `new URL` constructor, otherwise no transform will be applied.
    * :::warning
    * JavaScript and TypeScript files referenced via `new URL('./file.js', import.meta.url)` or `new URL('./file.ts', import.meta.url)` will **not** be transformed or bundled. The file will be copied as-is, meaning TypeScript files remain untransformed and dependencies are not resolved.
    *
    * The expected behavior for JS/TS files is still being discussed and may
    * change in future releases. See [#7258](https://github.com/rolldown/rolldown/issues/7258) for more context.
    * :::
    * @example
    * ```js
    * // main.js
    * const url = new URL('./styles.css', import.meta.url);
    * console.log(url);
    *
    * // Example output after bundling WITHOUT the option (default)
    * const url = new URL('./styles.css', import.meta.url);
    * console.log(url);
    *
    * // Example output after bundling WITH `experimental.resolveNewUrlToAsset` set to `true`
    * const url = new URL('assets/styles-CjdrdY7X.css', import.meta.url);
    * console.log(url);
    * ```
    * @default false
    */
    resolveNewUrlToAsset?: boolean;
    /**
    * Dev mode related options.
    * @hidden not ready for public usage yet
    */
    devMode?: DevModeOptions;
    /**
    * Control which order should be used when rendering modules in a chunk.
    *
    * Available options:
    * - `exec-order`: Almost equivalent to the topological order of the module graph, but specially handling when module graph has cycle.
    * - `module-id`: This is more friendly for gzip compression, especially for some javascript static asset lib (e.g. icon library)
    *
    * > [!NOTE]
    * > Try to sort the modules by their module id if possible (Since rolldown scope hoist all modules in the chunk, we only try to sort those modules by module id if we could ensure runtime behavior is correct after sorting).
    *
    * @default 'exec-order'
    */
    chunkModulesOrder?: ChunkModulesOrder;
    /**
    * Attach debug information to the output bundle.
    *
    * Available modes:
    * - `none`: No debug information is attached.
    * - `simple`: Attach comments indicating which files the bundled code comes from. These comments could be removed by the minifier.
    * - `full`: Attach detailed debug information to the output bundle. These comments are using legal comment syntax, so they won't be removed by the minifier.
    *
    * @default 'simple'
    *
    *
    */
    attachDebugInfo?: AttachDebugOptions;
    /**
    * Enables automatic generation of a chunk import map asset during build.
    *
    * This map only includes chunks with hashed filenames, where keys are derived from the facade module
    * name or primary chunk name. It produces stable and unique hash-based filenames, effectively preventing
    * cascading cache invalidation caused by content hashes and maximizing browser cache reuse.
    *
    * The output defaults to `importmap.json` unless overridden via `fileName`. A base URL prefix
    * (default `"/"`) can be applied to all paths. The resulting JSON is a valid import map and can be
    * directly injected into HTML via `<script type="importmap">`.
    *
    * @example
    * ```js
    * {
    *   experimental: {
    *     chunkImportMap: {
    *       baseUrl: '/',
    *       fileName: 'importmap.json'
    *     }
    *   },
    *   plugins: [
    *     {
    *       name: 'inject-import-map',
    *       generateBundle(_, bundle) {
    *         const chunkImportMap = bundle['importmap.json'];
    *         if (chunkImportMap?.type === 'asset') {
    *           const htmlPath = path.resolve('index.html');
    *           let html = fs.readFileSync(htmlPath, 'utf-8');
    *
    *           html = html.replace(
    *             /<script\s+type="importmap"[^>]*>[\s\S]*?<\/script>/i,
    *             `<script type="importmap">${chunkImportMap.source}<\/script>`
    *           );
    *
    *           fs.writeFileSync(htmlPath, html);
    *           delete bundle['importmap.json'];
    *         }
    *       }
    *     }
    *   ]
    * }
    * ```
    *
    * > [!TIP]
    * > If you want to learn more, you can check out the example here: [examples/chunk-import-map](https://github.com/rolldown/rolldown/tree/main/examples/chunk-import-map)
    *
    * @default false
    */
    chunkImportMap?: boolean | {
      baseUrl?: string;
      fileName?: string;
    };
    /**
    * Enable on-demand wrapping of modules.
    * @default false
    * @hidden not ready for public usage yet
    */
    onDemandWrapping?: boolean;
    /**
    * Enable incremental build support. Required to be used with `watch` mode.
    * @default false
    */
    incrementalBuild?: boolean;
    /**
    * Use native Rust implementation of MagicString for source map generation.
    *
    * [MagicString](https://github.com/rich-harris/magic-string) is a JavaScript library commonly used by bundlers
    * for string manipulation and source map generation. When enabled, rolldown will use a native Rust
    * implementation of MagicString instead of the JavaScript version, providing significantly better performance
    * during source map generation and code transformation.
    *
    * **Benefits**
    *
    * - **Improved Performance**: The native Rust implementation is typically faster than the JavaScript version,
    *   especially for large codebases with extensive source maps.
    * - **Background Processing**: Source map generation is performed asynchronously in a background thread,
    *   allowing the main bundling process to continue without blocking. This parallel processing can significantly
    *   reduce overall build times when working with JavaScript transform hooks.
    * - **Better Integration**: Seamless integration with rolldown's native Rust architecture.
    *
    * @example
    * ```js
    * export default {
    *   experimental: {
    *     nativeMagicString: true
    *   },
    *   output: {
    *     sourcemap: true
    *   }
    * }
    * ```
    *
    * > [!NOTE]
    * > This is an experimental feature. While it aims to provide identical behavior to the JavaScript
    * > implementation, there may be edge cases. Please report any discrepancies you encounter.
    * > For a complete working example, see [examples/native-magic-string](https://github.com/rolldown/rolldown/tree/main/examples/native-magic-string)
    * @default false
    */
    nativeMagicString?: boolean;
    /**
    * Control whether to optimize chunks by allowing entry chunks to have different exports than the underlying entry module.
    * This optimization can reduce the number of generated chunks.
    *
    * When enabled, rolldown will try to insert common modules directly into existing chunks rather than creating
    * separate chunks for them, which can result in fewer output files and better performance.
    *
    * This optimization is automatically disabled when any module uses top-level await (TLA) or contains TLA dependencies,
    * as it could affect execution order guarantees.
    *
    * @default true
    */
    chunkOptimization?: boolean;
    /**
    * Control whether to enable lazy barrel optimization.
    *
    * Lazy barrel optimization avoids compiling unused re-export modules in side-effect-free barrel modules,
    * significantly improving build performance for large codebases with many barrel modules.
    *
    * @see {@link https://rolldown.rs/in-depth/lazy-barrel-optimization | Lazy Barrel Documentation}
    * @default false
    */
    lazyBarrel?: boolean;
  };
  /**
  * Configure how the code is transformed. This process happens after the `transform` hook.
  *
  * @example
  * **Enable legacy decorators**
  * ```js
  * export default defineConfig({
  *   transform: {
  *     decorator: {
  *       legacy: true,
  *     },
  *   },
  * })
  * ```
  * Note that if you have correct `tsconfig.json` file, Rolldown will automatically detect and enable legacy decorators support.
  *
  *
  */
  transform?: TransformOptions$2;
  /**
  * Watch mode related options.
  *
  * These options only take effect when running with the [`--watch`](/apis/cli#w-watch) flag, or using {@linkcode watch | watch()} API.
  *
  *
  *
  * @experimental
  */
  watch?: WatcherOptions | false;
  /**
  * Controls which warnings are emitted during the build process. Each option can be set to `true` (emit warning) or `false` (suppress warning).
  */
  checks?: ChecksOptions;
  /**
  * Determines if absolute external paths should be converted to relative paths in the output.
  *
  * This does not only apply to paths that are absolute in the source but also to paths that are resolved to an absolute path by either a plugin or Rolldown core.
  *
  *
  */
  makeAbsoluteExternalsRelative?: MakeAbsoluteExternalsRelative;
  /**
  * Devtools integration options.
  * @experimental
  */
  devtools?: {
    sessionId?: string;
  };
  /**
  * Controls how entry chunk exports are preserved.
  *
  * This determines whether Rolldown needs to create facade chunks (additional wrapper chunks) to maintain the exact export signatures of entry modules, or whether it can combine entry modules with other chunks for optimization.
  *
  * @default `'exports-only'`
  *
  */
  preserveEntrySignatures?: false | "strict" | "allow-extension" | "exports-only";
  /**
  * Configure optimization features for the bundler.
  */
  optimization?: OptimizationOptions;
  /**
  * The value of `this` at the top level of each module. **Normally, you don't need to set this option.**
  * @default undefined
  * @example
  * **Set custom context**
  * ```js
  * export default {
  *   context: 'globalThis',
  *   output: {
  *     format: 'iife',
  *   },
  * };
  * ```
  *
  */
  context?: string;
  /**
  * Configures TypeScript configuration file resolution and usage.
  *
  * @default true
  */
  tsconfig?: boolean | string;
} //#endregion
//#region src/types/rolldown-options.d.ts
interface RolldownOptions extends InputOptions {
  output?: OutputOptions | OutputOptions[];
} //#endregion
//#region src/utils/define-config.d.ts
/**
* Type for `default export` of `rolldown.config.js` file.
* @category Config
*/
//#endregion
//#region node_modules/vite/node_modules/rolldown/dist/shared/transform-Kz3D2LbX.d.mts
//#endregion
//#region src/utils/transform.d.ts
/**
* Options for transforming a code.
*
* @category Utilities
*/
interface TransformOptions$1 extends BindingEnhancedTransformOptions {}
/**
* Result of transforming a code.
*
* @category Utilities
*/
//#endregion
//#region node_modules/esbuild/lib/main.d.ts
// Note: These declarations exist to avoid type errors when you omit "dom" from
// "lib" in your "tsconfig.json" file. TypeScript confusingly declares the
// global "WebAssembly" type in "lib.dom.d.ts" even though it has nothing to do
// with the browser DOM and is present in many non-browser JavaScript runtimes
// (e.g. node and deno). Declaring it here allows esbuild's API to be used in
// these scenarios.
//
// There's an open issue about getting this problem corrected (although these
// declarations will need to remain even if this is fixed for backward
// compatibility with older TypeScript versions):
//
//   https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/826
//
declare global {
  namespace WebAssembly {
    interface Module {}
  }
  interface URL {}
}
//#endregion
//#region node_modules/vite/types/internal/esbuildOptions.d.ts
/* eslint-enable @typescript-eslint/ban-ts-comment */
type EsbuildTarget = string | string[];
type EsbuildTransformOptions = esbuild.TransformOptions;
type DepsOptimizerEsbuildOptions = Omit<esbuild.BuildOptions, 'bundle' | 'entryPoints' | 'external' | 'write' | 'watch' | 'outdir' | 'outfile' | 'outbase' | 'outExtension' | 'metafile'>;
//#endregion
//#region node_modules/vite/types/metadata.d.ts
interface AssetMetadata {
  importedAssets: Set<string>;
  importedCss: Set<string>;
}
interface ChunkMetadata {
  importedAssets: Set<string>;
  importedCss: Set<string>;
  /** @internal */
  __modules: any;
}
interface CustomPluginOptionsVite {
  /**
   * If this is a CSS Rollup module, you can scope to its importer's exports
   * so that if those exports are treeshaken away, the CSS module will also
   * be treeshaken.
   *
   * The "importerId" must import the CSS Rollup module statically.
   *
   * Example config if the CSS id is `/src/App.vue?vue&type=style&lang.css`:
   * ```js
   * cssScopeTo: ['/src/App.vue', 'default']
   * ```
   */
  cssScopeTo?: readonly [importerId: string, exportName: string | undefined];
  /** @deprecated no-op since Vite 6.1 */
  lang?: string;
}
declare module 'rolldown' {
  export interface OutputAsset {
    viteMetadata?: AssetMetadata;
  }
  export interface RenderedChunk {
    viteMetadata?: ChunkMetadata;
  }
  export interface OutputChunk {
    viteMetadata?: ChunkMetadata;
  }
  export interface CustomPluginOptions {
    vite?: CustomPluginOptionsVite;
  }
}
//#endregion
//#region node_modules/vite/types/internal/terserOptions.d.ts
/* eslint-enable @typescript-eslint/ban-ts-comment */
type TerserMinifyOptions = Terser.MinifyOptions;
//#endregion
//#region node_modules/vite/types/internal/lightningcssOptions.d.ts
/* eslint-enable @typescript-eslint/ban-ts-comment */
type LightningCSSOptions = Omit<Lightningcss.BundleAsyncOptions<Lightningcss.CustomAtRules>, 'filename' | 'resolver' | 'minify' | 'sourceMap' | 'analyzeDependencies' // properties not overridden by Vite, but does not make sense to set by end users
| 'inputSourceMap' | 'projectRoot'>;
//#endregion
//#region node_modules/vite/types/internal/cssPreprocessorOptions.d.ts
/* eslint-enable @typescript-eslint/ban-ts-comment */
// https://github.com/type-challenges/type-challenges/issues/29285
type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false;
type DartSassStringOptionsAsync = DartSass.StringOptions<'async'>;
type SassEmbeddedStringOptionsAsync = SassEmbedded.StringOptions<'async'>;
type SassStringOptionsAsync = IsAny<SassEmbeddedStringOptionsAsync> extends false ? SassEmbeddedStringOptionsAsync : DartSassStringOptionsAsync;
type SassModernPreprocessBaseOptions = Omit<SassStringOptionsAsync, 'url' | 'sourceMap'>;
type LessPreprocessorBaseOptions = Omit<Less.Options, 'sourceMap' | 'filename'>;
type StylusPreprocessorBaseOptions = Omit<Stylus.RenderOptions, 'filename'> & {
  define?: Record<string, any>;
};
declare global {
  // LESS' types somewhat references this which doesn't make sense in Node,
  // so we have to shim it
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface HTMLLinkElement {}
}
//#endregion
//#region node_modules/vite/types/importGlob.d.ts
/**
 * Declare Worker in case DOM is not added to the tsconfig lib causing
 * Worker interface is not defined. For developers with DOM lib added,
 * the Worker interface will be merged correctly.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Worker {}
}
//#endregion
//#region node_modules/vite/dist/node/index.d.ts
//#region \0rolldown/runtime.js
//#endregion
//#region ../../node_modules/.pnpm/@vitejs+devtools@0.1.13_typescript@6.0.2_vite@packages+vite/node_modules/@vitejs/devtools/dist/cli-commands.d.ts
//#region src/node/cli-commands.d.ts
interface StartOptions {
  root?: string;
  config?: string;
  host: string;
  port?: string | number;
  open?: boolean;
} //#endregion
//#region ../../node_modules/.pnpm/@vitejs+devtools@0.1.13_typescript@6.0.2_vite@packages+vite/node_modules/@vitejs/devtools/dist/config.d.ts
//#region src/node/config.d.ts
interface DevToolsConfig extends Partial<StartOptions> {
  enabled: boolean;
  /**
   * Disable client authentication.
   *
   * Beware that if you disable client authentication,
   * any browsers can connect to the devtools and access to your server and filesystem.
   * (including other devices, if you open server `host` option to LAN or WAN)
   *
   * @default true
   */
  clientAuth?: boolean;
  /**
   * Pre-configured auth tokens that are automatically trusted.
   *
   * Clients connecting with an auth token matching one of these
   * will be auto-approved without a terminal prompt.
   */
  clientAuthTokens?: string[];
}
interface ResolvedDevToolsConfig {
  config: Omit<DevToolsConfig, 'enabled'> & {
    host: string;
  };
  enabled: boolean;
} //#endregion
//#region src/types/alias.d.ts
interface Alias {
  find: string | RegExp;
  replacement: string;
  /**
   * Instructs the plugin to use an alternative resolving algorithm,
   * rather than the Rollup's resolver.
   * @default null
   * @deprecated Use a custom plugin with resolveId hook and `enforce: 'pre'` instead
   */
  customResolver?: ResolverFunction | ResolverObject | null;
}
type MapToFunction<T> = T extends Function ? T : never;
type ResolverFunction = MapToFunction<FunctionPluginHooks['resolveId']>;
interface ResolverObject {
  buildStart?: FunctionPluginHooks['buildStart'];
  resolveId: ResolverFunction;
}
/**
 * Specifies an `Object`, or an `Array` of `Object`,
 * which defines aliases used to replace values in `import` or `require` statements.
 * With either format, the order of the entries is important,
 * in that the first defined rules are applied first.
 *
 * This is passed to \@rollup/plugin-alias as the "entries" field
 * https://github.com/rollup/plugins/tree/master/packages/alias#entries
 */
type AliasOptions = readonly Alias[] | {
  [find: string]: string;
}; //#endregion
//#region src/types/anymatch.d.ts
type AnymatchFn = (testString: string) => boolean;
type AnymatchPattern = string | RegExp | AnymatchFn;
type AnymatchMatcher = AnymatchPattern | AnymatchPattern[]; //#endregion
//#region src/types/chokidar.d.ts
declare class FSWatcher extends EventEmitter implements fs.FSWatcher {
  options: WatchOptions;
  /**
   * Constructs a new FSWatcher instance with optional WatchOptions parameter.
   */
  constructor(options?: WatchOptions);
  /**
   * When called, requests that the Node.js event loop not exit so long as the fs.FSWatcher is active.
   * Calling watcher.ref() multiple times will have no effect.
   */
  ref(): this;
  /**
   * When called, the active fs.FSWatcher object will not require the Node.js event loop to remain active.
   * If there is no other activity keeping the event loop running, the process may exit before the fs.FSWatcher object's callback is invoked.
   * Calling watcher.unref() multiple times will have no effect.
   */
  unref(): this;
  /**
   * Add files, directories, or glob patterns for tracking. Takes an array of strings or just one
   * string.
   */
  add(paths: string | ReadonlyArray<string>): this;
  /**
   * Stop watching files, directories, or glob patterns. Takes an array of strings or just one
   * string.
   */
  unwatch(paths: string | ReadonlyArray<string>): this;
  /**
   * Returns an object representing all the paths on the file system being watched by this
   * `FSWatcher` instance. The object's keys are all the directories (using absolute paths unless
   * the `cwd` option was used), and the values are arrays of the names of the items contained in
   * each directory.
   */
  getWatched(): {
    [directory: string]: string[];
  };
  /**
   * Removes all listeners from watched files.
   */
  close(): Promise<void>;
  on(event: 'add' | 'addDir' | 'change', listener: (path: string, stats?: fs.Stats) => void): this;
  on(event: 'all', listener: (eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir', path: string, stats?: fs.Stats) => void): this;
  /**
   * Error occurred
   */
  on(event: 'error', listener: (error: Error) => void): this;
  /**
   * Exposes the native Node `fs.FSWatcher events`
   */
  on(event: 'raw', listener: (eventName: string, path: string, details: any) => void): this;
  /**
   * Fires when the initial scan is complete
   */
  on(event: 'ready', listener: () => void): this;
  on(event: 'unlink' | 'unlinkDir', listener: (path: string) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
}
interface WatchOptions {
  /**
   * Indicates whether the process should continue to run as long as files are being watched. If
   * set to `false` when using `fsevents` to watch, no more events will be emitted after `ready`,
   * even if the process continues to run.
   */
  persistent?: boolean;
  /**
   * ([anymatch](https://github.com/micromatch/anymatch)-compatible definition) Defines files/paths to
   * be ignored. The whole relative or absolute path is tested, not just filename. If a function
   * with two arguments is provided, it gets called twice per path - once with a single argument
   * (the path), second time with two arguments (the path and the
   * [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object of that path).
   */
  ignored?: AnymatchMatcher;
  /**
   * If set to `false` then `add`/`addDir` events are also emitted for matching paths while
   * instantiating the watching as chokidar discovers these file paths (before the `ready` event).
   */
  ignoreInitial?: boolean;
  /**
   * When `false`, only the symlinks themselves will be watched for changes instead of following
   * the link references and bubbling events through the link's path.
   */
  followSymlinks?: boolean;
  /**
   * The base directory from which watch `paths` are to be derived. Paths emitted with events will
   * be relative to this.
   */
  cwd?: string;
  /**
   * If set to true then the strings passed to .watch() and .add() are treated as literal path
   * names, even if they look like globs.
   *
   * @default false
   */
  disableGlobbing?: boolean;
  /**
   * Whether to use fs.watchFile (backed by polling), or fs.watch. If polling leads to high CPU
   * utilization, consider setting this to `false`. It is typically necessary to **set this to
   * `true` to successfully watch files over a network**, and it may be necessary to successfully
   * watch files in other non-standard situations. Setting to `true` explicitly on OS X overrides
   * the `useFsEvents` default.
   */
  usePolling?: boolean;
  /**
   * Whether to use the `fsevents` watching interface if available. When set to `true` explicitly
   * and `fsevents` is available this supersedes the `usePolling` setting. When set to `false` on
   * OS X, `usePolling: true` becomes the default.
   */
  useFsEvents?: boolean;
  /**
   * If relying upon the [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object that
   * may get passed with `add`, `addDir`, and `change` events, set this to `true` to ensure it is
   * provided even in cases where it wasn't already available from the underlying watch events.
   */
  alwaysStat?: boolean;
  /**
   * If set, limits how many levels of subdirectories will be traversed.
   */
  depth?: number;
  /**
   * Interval of file system polling.
   */
  interval?: number;
  /**
   * Interval of file system polling for binary files. ([see list of binary extensions](https://gi
   * thub.com/sindresorhus/binary-extensions/blob/master/binary-extensions.json))
   */
  binaryInterval?: number;
  /**
   *  Indicates whether to watch files that don't have read permissions if possible. If watching
   *  fails due to `EPERM` or `EACCES` with this set to `true`, the errors will be suppressed
   *  silently.
   */
  ignorePermissionErrors?: boolean;
  /**
   * `true` if `useFsEvents` and `usePolling` are `false`. Automatically filters out artifacts
   * that occur when using editors that use "atomic writes" instead of writing directly to the
   * source file. If a file is re-added within 100 ms of being deleted, Chokidar emits a `change`
   * event rather than `unlink` then `add`. If the default of 100 ms does not work well for you,
   * you can override it by setting `atomic` to a custom value, in milliseconds.
   */
  atomic?: boolean | number;
  /**
   * can be set to an object in order to adjust timing params:
   */
  awaitWriteFinish?: AwaitWriteFinishOptions | boolean;
}
interface AwaitWriteFinishOptions {
  /**
   * Amount of time in milliseconds for a file size to remain constant before emitting its event.
   */
  stabilityThreshold?: number;
  /**
   * File size polling interval.
   */
  pollInterval?: number;
} //#endregion
//#region src/types/connect.d.ts
declare namespace Connect {
  export type ServerHandle = HandleFunction | http.Server;
  export class IncomingMessage extends http.IncomingMessage {
    originalUrl?: http.IncomingMessage['url'] | undefined;
  }
  export type NextFunction = (err?: any) => void;
  export type SimpleHandleFunction = (req: IncomingMessage, res: http.ServerResponse) => void;
  export type NextHandleFunction = (req: IncomingMessage, res: http.ServerResponse, next: NextFunction) => void;
  export type ErrorHandleFunction = (err: any, req: IncomingMessage, res: http.ServerResponse, next: NextFunction) => void;
  export type HandleFunction = SimpleHandleFunction | NextHandleFunction | ErrorHandleFunction;
  export interface ServerStackItem {
    route: string;
    handle: ServerHandle;
  }
  export interface Server extends NodeJS.EventEmitter {
    (req: http.IncomingMessage, res: http.ServerResponse, next?: Function): void;
    route: string;
    stack: ServerStackItem[];
    /**
     * Utilize the given middleware `handle` to the given `route`,
     * defaulting to _/_. This "route" is the mount-point for the
     * middleware, when given a value other than _/_ the middleware
     * is only effective when that segment is present in the request's
     * pathname.
     *
     * For example if we were to mount a function at _/admin_, it would
     * be invoked on _/admin_, and _/admin/settings_, however it would
     * not be invoked for _/_, or _/posts_.
     */
    use(fn: NextHandleFunction): Server;
    use(fn: HandleFunction): Server;
    use(route: string, fn: NextHandleFunction): Server;
    use(route: string, fn: HandleFunction): Server;
    /**
     * Handle server requests, punting them down
     * the middleware stack.
     */
    handle(req: http.IncomingMessage, res: http.ServerResponse, next: Function): void;
    /**
     * Listen for connections.
     *
     * This method takes the same arguments
     * as node's `http.Server#listen()`.
     *
     * HTTP and HTTPS:
     *
     * If you run your application both as HTTP
     * and HTTPS you may wrap them individually,
     * since your Connect "server" is really just
     * a JavaScript `Function`.
     *
     *      var connect = require('connect')
     *        , http = require('http')
     *        , https = require('https');
     *
     *      var app = connect();
     *
     *      http.createServer(app).listen(80);
     *      https.createServer(options, app).listen(443);
     */
    listen(port: number, hostname?: string, backlog?: number, callback?: Function): http.Server;
    listen(port: number, hostname?: string, callback?: Function): http.Server;
    listen(path: string, callback?: Function): http.Server;
    listen(handle: any, listeningListener?: Function): http.Server;
  }
} //#endregion
//#region ../../node_modules/.pnpm/http-proxy-3@1.23.2_ms@2.1.3/node_modules/http-proxy-3/dist/lib/http-proxy/index.d.ts
interface ProxyTargetDetailed {
  host: string;
  port: number;
  protocol?: string;
  hostname?: string;
  socketPath?: string;
  key?: string;
  passphrase?: string;
  pfx?: Buffer | string;
  cert?: string;
  ca?: string;
  ciphers?: string;
  secureProtocol?: string;
}
type ProxyType = "ws" | "web";
type ProxyTarget = ProxyTargetUrl | ProxyTargetDetailed;
type ProxyTargetUrl = URL | string | {
  port: number;
  host: string;
  protocol?: string;
};
type NormalizeProxyTarget<T extends ProxyTargetUrl> = Exclude<T, string> | URL;
interface ServerOptions$3 {
  /** URL string to be parsed with the url module. */
  target?: ProxyTarget;
  /** URL string to be parsed with the url module or a URL object. */
  forward?: ProxyTargetUrl;
  /** Object to be passed to http(s).request. */
  agent?: any;
  /** Object to be passed to https.createServer(). */
  ssl?: any;
  /** If you want to proxy websockets. */
  ws?: boolean;
  /** Adds x- forward headers. */
  xfwd?: boolean;
  /** Verify SSL certificate. */
  secure?: boolean;
  /** Explicitly specify if we are proxying to another proxy. */
  toProxy?: boolean;
  /** Specify whether you want to prepend the target's path to the proxy path. */
  prependPath?: boolean;
  /** Specify whether you want to ignore the proxy path of the incoming request. */
  ignorePath?: boolean;
  /** Local interface string to bind for outgoing connections. */
  localAddress?: string;
  /** Changes the origin of the host header to the target URL. */
  changeOrigin?: boolean;
  /** specify whether you want to keep letter case of response header key */
  preserveHeaderKeyCase?: boolean;
  /** Basic authentication i.e. 'user:password' to compute an Authorization header. */
  auth?: string;
  /** Rewrites the location hostname on (301 / 302 / 307 / 308) redirects, Default: null. */
  hostRewrite?: string;
  /** Rewrites the location host/ port on (301 / 302 / 307 / 308) redirects based on requested host/ port.Default: false. */
  autoRewrite?: boolean;
  /** Rewrites the location protocol on (301 / 302 / 307 / 308) redirects to 'http' or 'https'.Default: null. */
  protocolRewrite?: string;
  /** rewrites domain of set-cookie headers. */
  cookieDomainRewrite?: false | string | {
    [oldDomain: string]: string;
  };
  /** rewrites path of set-cookie headers. Default: false */
  cookiePathRewrite?: false | string | {
    [oldPath: string]: string;
  };
  /** object with extra headers to be added to target requests. */
  headers?: {
    [header: string]: string | string[] | undefined;
  };
  /** Timeout (in milliseconds) when proxy receives no response from target. Default: 120000 (2 minutes) */
  proxyTimeout?: number;
  /** Timeout (in milliseconds) for incoming requests */
  timeout?: number;
  /** Specify whether you want to follow redirects. Default: false */
  followRedirects?: boolean;
  /** If set to true, none of the webOutgoing passes are called and it's your responsibility to appropriately return the response by listening and acting on the proxyRes event */
  selfHandleResponse?: boolean;
  /** Buffer */
  buffer?: Stream;
  /** Explicitly set the method type of the ProxyReq */
  method?: string;
  /**
   * Optionally override the trusted CA certificates.
   * This is passed to https.request.
   */
  ca?: string;
  /** Optional fetch implementation to use instead of global fetch, use this to activate fetch-based proxying,
   * for example to proxy HTTP/2 requests
  */
  fetch?: typeof fetch;
  /** Optional configuration object for fetch-based proxy requests.
   * Use this to customize fetch request and response handling.
   * For custom fetch implementations, use the `fetch` property.*/
  fetchOptions?: FetchOptions;
}
interface FetchOptions {
  /** Fetch request options */
  requestOptions?: RequestInit;
  /** Called before making the fetch request */
  onBeforeRequest?: (requestOptions: RequestInit, req: http.IncomingMessage, res: http.ServerResponse, options: NormalizedServerOptions) => void | Promise<void>;
  /** Called after receiving the fetch response */
  onAfterResponse?: (response: Response, req: http.IncomingMessage, res: http.ServerResponse, options: NormalizedServerOptions) => void | Promise<void>;
}
interface NormalizedServerOptions extends ServerOptions$3 {
  target?: NormalizeProxyTarget<ProxyTarget>;
  forward?: NormalizeProxyTarget<ProxyTargetUrl>;
}
type ErrorCallback<TIncomingMessage extends typeof http.IncomingMessage = typeof http.IncomingMessage, TServerResponse extends typeof http.ServerResponse = typeof http.ServerResponse, TError = Error> = (err: TError, req: InstanceType<TIncomingMessage>, res: InstanceType<TServerResponse> | net.Socket, target?: ProxyTargetUrl) => void;
type ProxyServerEventMap<TIncomingMessage extends typeof http.IncomingMessage = typeof http.IncomingMessage, TServerResponse extends typeof http.ServerResponse = typeof http.ServerResponse, TError = Error> = {
  error: Parameters<ErrorCallback<TIncomingMessage, TServerResponse, TError>>;
  start: [req: InstanceType<TIncomingMessage>, res: InstanceType<TServerResponse>, target: ProxyTargetUrl];
  open: [socket: net.Socket];
  proxyReq: [proxyReq: http.ClientRequest, req: InstanceType<TIncomingMessage>, res: InstanceType<TServerResponse>, options: ServerOptions$3, socket: net.Socket];
  proxyRes: [proxyRes: InstanceType<TIncomingMessage>, req: InstanceType<TIncomingMessage>, res: InstanceType<TServerResponse>];
  proxyReqWs: [proxyReq: http.ClientRequest, req: InstanceType<TIncomingMessage>, socket: net.Socket, options: ServerOptions$3, head: any];
  econnreset: [err: Error, req: InstanceType<TIncomingMessage>, res: InstanceType<TServerResponse>, target: ProxyTargetUrl];
  end: [req: InstanceType<TIncomingMessage>, res: InstanceType<TServerResponse>, proxyRes: InstanceType<TIncomingMessage>];
  close: [proxyRes: InstanceType<TIncomingMessage>, proxySocket: net.Socket, proxyHead: any];
};
type ProxyMethodArgs<TIncomingMessage extends typeof http.IncomingMessage = typeof http.IncomingMessage, TServerResponse extends typeof http.ServerResponse = typeof http.ServerResponse, TError = Error> = {
  ws: [req: InstanceType<TIncomingMessage>, socket: any, head: any, ...args: [options?: ServerOptions$3, callback?: ErrorCallback<TIncomingMessage, TServerResponse, TError>] | [callback?: ErrorCallback<TIncomingMessage, TServerResponse, TError>]];
  web: [req: InstanceType<TIncomingMessage>, res: InstanceType<TServerResponse>, ...args: [options: ServerOptions$3, callback?: ErrorCallback<TIncomingMessage, TServerResponse, TError>] | [callback?: ErrorCallback<TIncomingMessage, TServerResponse, TError>]];
};
type PassFunctions<TIncomingMessage extends typeof http.IncomingMessage = typeof http.IncomingMessage, TServerResponse extends typeof http.ServerResponse = typeof http.ServerResponse, TError = Error> = {
  ws: (req: InstanceType<TIncomingMessage>, socket: net.Socket, options: NormalizedServerOptions, head: Buffer | undefined, server: ProxyServer<TIncomingMessage, TServerResponse, TError>, cb?: ErrorCallback<TIncomingMessage, TServerResponse, TError>) => unknown;
  web: (req: InstanceType<TIncomingMessage>, res: InstanceType<TServerResponse>, options: NormalizedServerOptions, head: Buffer | undefined, server: ProxyServer<TIncomingMessage, TServerResponse, TError>, cb?: ErrorCallback<TIncomingMessage, TServerResponse, TError>) => unknown;
};
declare class ProxyServer<TIncomingMessage extends typeof http.IncomingMessage = typeof http.IncomingMessage, TServerResponse extends typeof http.ServerResponse = typeof http.ServerResponse, TError = Error> extends EventEmitter<ProxyServerEventMap<TIncomingMessage, TServerResponse, TError>> {
  /**
   * Used for proxying WS(S) requests
   * @param req - Client request.
   * @param socket - Client socket.
   * @param head - Client head.
   * @param options - Additional options.
   */
  readonly ws: (...args: ProxyMethodArgs<TIncomingMessage, TServerResponse, TError>["ws"]) => void;
  /**
   * Used for proxying regular HTTP(S) requests
   * @param req - Client request.
   * @param res - Client response.
   * @param options - Additional options.
   */
  readonly web: (...args: ProxyMethodArgs<TIncomingMessage, TServerResponse, TError>["web"]) => void;
  private options;
  private webPasses;
  private wsPasses;
  private _server?;
  /**
   * Creates the proxy server with specified options.
   * @param options - Config object passed to the proxy
   */
  constructor(options?: ServerOptions$3);
  /**
   * Creates the proxy server with specified options.
   * @param options Config object passed to the proxy
   * @returns Proxy object with handlers for `ws` and `web` requests
   */
  static createProxyServer<TIncomingMessage extends typeof http.IncomingMessage, TServerResponse extends typeof http.ServerResponse, TError = Error>(options?: ServerOptions$3): ProxyServer<TIncomingMessage, TServerResponse, TError>;
  /**
   * Creates the proxy server with specified options.
   * @param options Config object passed to the proxy
   * @returns Proxy object with handlers for `ws` and `web` requests
   */
  static createServer<TIncomingMessage extends typeof http.IncomingMessage, TServerResponse extends typeof http.ServerResponse, TError = Error>(options?: ServerOptions$3): ProxyServer<TIncomingMessage, TServerResponse, TError>;
  /**
   * Creates the proxy server with specified options.
   * @param options Config object passed to the proxy
   * @returns Proxy object with handlers for `ws` and `web` requests
   */
  static createProxy<TIncomingMessage extends typeof http.IncomingMessage, TServerResponse extends typeof http.ServerResponse, TError = Error>(options?: ServerOptions$3): ProxyServer<TIncomingMessage, TServerResponse, TError>;
  createRightProxy: <PT extends ProxyType>(type: PT) => Function;
  onError: (err: TError) => void;
  /**
   * A function that wraps the object in a webserver, for your convenience
   * @param port - Port to listen on
   * @param hostname - The hostname to listen on
   */
  listen: (port: number, hostname?: string) => this;
  address: () => string | net.AddressInfo | null | undefined;
  /**
   * A function that closes the inner webserver and stops listening on given port
   */
  close: (cb?: Function) => void;
  before: <PT extends ProxyType>(type: PT, passName: string, cb: PassFunctions<TIncomingMessage, TServerResponse, TError>[PT]) => void;
  after: <PT extends ProxyType>(type: PT, passName: string, cb: PassFunctions<TIncomingMessage, TServerResponse, TError>[PT]) => void;
} //#endregion
//#region ../../node_modules/.pnpm/http-proxy-3@1.23.2_ms@2.1.3/node_modules/http-proxy-3/dist/lib/http-proxy/passes/ws-incoming.d.ts
//#endregion
//#region src/node/server/middlewares/proxy.d.ts
interface ProxyOptions extends ServerOptions$3 {
  /**
  * rewrite path
  */
  rewrite?: (path: string) => string;
  /**
  * configure the proxy server (e.g. listen to events)
  */
  configure?: (proxy: ProxyServer, options: ProxyOptions) => void;
  /**
  * webpack-dev-server style bypass function
  */
  bypass?: (req: http.IncomingMessage, res: http.ServerResponse | undefined, options: ProxyOptions) => void | null | undefined | false | string | Promise<void | null | undefined | boolean | string>;
  /**
  * rewrite the Origin header of a WebSocket request to match the target
  *
  * **Exercise caution as rewriting the Origin can leave the proxying open to [CSRF attacks](https://owasp.org/www-community/attacks/csrf).**
  */
  rewriteWsOrigin?: boolean | undefined;
} //#endregion
//#region src/node/logger.d.ts
type LogType = "error" | "warn" | "info";
type LogLevel = LogType | "silent";
interface Logger {
  info(msg: string, options?: LogOptions): void;
  warn(msg: string, options?: LogOptions): void;
  warnOnce(msg: string, options?: LogOptions): void;
  error(msg: string, options?: LogErrorOptions): void;
  clearScreen(type: LogType): void;
  hasErrorLogged(error: Error | RolldownError): boolean;
  hasWarned: boolean;
}
interface LogOptions {
  clear?: boolean;
  timestamp?: boolean;
  environment?: string;
}
interface LogErrorOptions extends LogOptions {
  error?: Error | RolldownError | null;
}
//#endregion
//#region src/node/http.d.ts
interface CommonServerOptions {
  /**
  * Specify server port. Note if the port is already being used, Vite will
  * automatically try the next available port so this may not be the actual
  * port the server ends up listening on.
  */
  port?: number;
  /**
  * If enabled, vite will exit if specified port is already in use
  */
  strictPort?: boolean;
  /**
  * Specify which IP addresses the server should listen on.
  * Set to 0.0.0.0 to listen on all addresses, including LAN and public addresses.
  */
  host?: string | boolean;
  /**
  * The hostnames that Vite is allowed to respond to.
  * `localhost` and subdomains under `.localhost` and all IP addresses are allowed by default.
  * When using HTTPS, this check is skipped.
  *
  * If a string starts with `.`, it will allow that hostname without the `.` and all subdomains under the hostname.
  * For example, `.example.com` will allow `example.com`, `foo.example.com`, and `foo.bar.example.com`.
  *
  * If set to `true`, the server is allowed to respond to requests for any hosts.
  * This is not recommended as it will be vulnerable to DNS rebinding attacks.
  */
  allowedHosts?: string[] | true;
  /**
  * Enable TLS + HTTP/2.
  * Note: this downgrades to TLS only when the proxy option is also used.
  */
  https?: ServerOptions$1;
  /**
  * Open browser window on startup
  */
  open?: boolean | string;
  /**
  * Configure custom proxy rules for the dev server. Expects an object
  * of `{ key: options }` pairs.
  * Uses [`http-proxy-3`](https://github.com/sagemathinc/http-proxy-3).
  * Full options [here](https://github.com/sagemathinc/http-proxy-3#options).
  *
  * Example `vite.config.js`:
  * ``` js
  * module.exports = {
  *   proxy: {
  *     // string shorthand: /foo -> http://localhost:4567/foo
  *     '/foo': 'http://localhost:4567',
  *     // with options
  *     '/api': {
  *       target: 'http://jsonplaceholder.typicode.com',
  *       changeOrigin: true,
  *       rewrite: path => path.replace(/^\/api/, '')
  *     }
  *   }
  * }
  * ```
  */
  proxy?: Record<string, string | ProxyOptions>;
  /**
  * Configure CORS for the dev server.
  * Uses https://github.com/expressjs/cors.
  *
  * When enabling this option, **we recommend setting a specific value
  * rather than `true`** to avoid exposing the source code to untrusted origins.
  *
  * Set to `true` to allow all methods from any origin, or configure separately
  * using an object.
  *
  * @default false
  */
  cors?: CorsOptions | boolean;
  /**
  * Specify server response headers.
  */
  headers?: OutgoingHttpHeaders;
}
/**
* https://github.com/expressjs/cors#configuration-options
*/
interface CorsOptions {
  /**
  * Configures the Access-Control-Allow-Origin CORS header.
  *
  * **We recommend setting a specific value rather than
  * `true`** to avoid exposing the source code to untrusted origins.
  */
  origin?: CorsOrigin | ((origin: string | undefined, cb: (err: Error, origins: CorsOrigin) => void) => void);
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
  preflightContinue?: boolean;
  optionsSuccessStatus?: number;
}
type CorsOrigin = boolean | string | RegExp | (string | RegExp)[]; //#endregion
//#region src/shared/forwardConsole.d.ts
type ForwardConsoleLogLevel = "error" | "warn" | "info" | "log" | "debug" | (string & {});
interface ForwardConsoleOptions {
  unhandledErrors?: boolean;
  logLevels?: ForwardConsoleLogLevel[];
}
interface ResolvedForwardConsoleOptions {
  enabled: boolean;
  unhandledErrors: boolean;
  logLevels: ForwardConsoleLogLevel[];
} //#endregion
//#region src/node/typeUtils.d.ts
type RequiredExceptFor<T, K extends keyof T> = Pick<T, K> & Required<Omit<T, K>>; //#endregion
//#region src/node/preview.d.ts
interface PreviewOptions extends CommonServerOptions {}
interface ResolvedPreviewOptions extends RequiredExceptFor<PreviewOptions, "host" | "https" | "proxy"> {}
interface PreviewServer {
  /**
  * The resolved vite config object
  */
  config: ResolvedConfig;
  /**
  * Stop the server.
  */
  close(): Promise<void>;
  /**
  * A connect app instance.
  * - Can be used to attach custom middlewares to the preview server.
  * - Can also be used as the handler function of a custom http server
  *   or as a middleware in any connect-style Node.js frameworks
  *
  * https://github.com/senchalabs/connect#use-middleware
  */
  middlewares: Connect.Server;
  /**
  * native Node http server instance
  */
  httpServer: HttpServer;
  /**
  * The resolved urls Vite prints on the CLI (URL-encoded). Returns `null`
  * if the server is not listening on any port.
  */
  resolvedUrls: ResolvedServerUrls | null;
  /**
  * Print server urls
  */
  printUrls(): void;
  /**
  * Bind CLI shortcuts
  */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void;
}
type PreviewServerHook = (this: MinimalPluginContextWithoutEnvironment, server: PreviewServer) => (() => void) | void | Promise<(() => void) | void>;
/**
* Starts the Vite server in preview mode, to simulate a production deployment
*/
//#endregion
//#region src/node/shortcuts.d.ts
type BindCLIShortcutsOptions<Server = ViteDevServer | PreviewServer> = {
  /**
  * Print a one-line shortcuts "help" hint to the terminal
  */
  print?: boolean;
  /**
  * Custom shortcuts to run when a key is pressed. These shortcuts take priority
  * over the default shortcuts if they have the same keys (except the `h` key).
  * To disable a default shortcut, define the same key but with `action: undefined`.
  */
  customShortcuts?: CLIShortcut<Server>[];
};
type CLIShortcut<Server = ViteDevServer | PreviewServer> = {
  key: string;
  description: string;
  action?(server: Server): void | Promise<void>;
}; //#endregion
//#region src/node/baseEnvironment.d.ts
declare class PartialEnvironment {
  name: string;
  getTopLevelConfig(): ResolvedConfig;
  config: ResolvedConfig & ResolvedEnvironmentOptions;
  logger: Logger;
  constructor(name: string, topLevelConfig: ResolvedConfig, options?: ResolvedEnvironmentOptions);
}
declare class BaseEnvironment extends PartialEnvironment {
  get plugins(): readonly Plugin[];
  constructor(name: string, config: ResolvedConfig, options?: ResolvedEnvironmentOptions);
}
/**
* This class discourages users from inversely checking the `mode`
* to determine the type of environment, e.g.
*
* ```js
* const isDev = environment.mode !== 'build' // bad
* const isDev = environment.mode === 'dev'   // good
* ```
*
* You should also not check against `"unknown"` specifically. It's
* a placeholder for more possible environment types.
*/
declare class UnknownEnvironment extends BaseEnvironment {
  mode: "unknown";
} //#endregion
//#region src/node/optimizer/scan.d.ts
declare class ScanEnvironment extends BaseEnvironment {
  mode: "scan";
  get pluginContainer(): EnvironmentPluginContainer;
  init(): Promise<void>;
} //#endregion
//#region src/node/optimizer/index.d.ts
type ExportsData = {
  hasModuleSyntax: boolean;
  exports: readonly string[];
  jsxLoader?: boolean;
};
interface DepsOptimizer {
  init: () => Promise<void>;
  metadata: DepOptimizationMetadata;
  scanProcessing?: Promise<void>;
  registerMissingImport: (id: string, resolved: string) => OptimizedDepInfo;
  run: () => void;
  isOptimizedDepFile: (id: string) => boolean;
  isOptimizedDepUrl: (url: string) => boolean;
  getOptimizedDepId: (depInfo: OptimizedDepInfo) => string;
  close: () => Promise<void>;
  options: DepOptimizationOptions;
}
interface DepOptimizationConfig {
  /**
  * Force optimize listed dependencies (must be resolvable import paths,
  * cannot be globs).
  */
  include?: string[];
  /**
  * Do not optimize these dependencies (must be resolvable import paths,
  * cannot be globs).
  */
  exclude?: string[];
  /**
  * Forces ESM interop when importing these dependencies. Some legacy
  * packages advertise themselves as ESM but use `require` internally
  * @experimental
  */
  needsInterop?: string[];
  /**
  * Options to pass to esbuild during the dep scanning and optimization
  *
  * Certain options are omitted since changing them would not be compatible
  * with Vite's dep optimization.
  *
  * - `external` is also omitted, use Vite's `optimizeDeps.exclude` option
  * - `plugins` are merged with Vite's dep plugin
  *
  * https://esbuild.github.io/api
  *
  * @deprecated Use `rolldownOptions` instead.
  */
  esbuildOptions?: DepsOptimizerEsbuildOptions;
  /**
  * @deprecated Use `rolldownOptions` instead.
  */
  rollupOptions?: Omit<RolldownOptions, "input" | "logLevel" | "output"> & {
    output?: Omit<OutputOptions, "format" | "sourcemap" | "dir" | "banner">;
  };
  /**
  * Options to pass to rolldown during the dep scanning and optimization
  *
  * Certain options are omitted since changing them would not be compatible
  * with Vite's dep optimization.
  *
  * - `plugins` are merged with Vite's dep plugin
  */
  rolldownOptions?: Omit<RolldownOptions, "input" | "logLevel" | "output"> & {
    output?: Omit<OutputOptions, "format" | "sourcemap" | "dir" | "banner">;
  };
  /**
  * List of file extensions that can be optimized. A corresponding esbuild
  * plugin must exist to handle the specific extension.
  *
  * By default, Vite can optimize `.mjs`, `.js`, `.ts`, and `.mts` files. This option
  * allows specifying additional extensions.
  *
  * @experimental
  */
  extensions?: string[];
  /**
  * Deps optimization during build was removed in Vite 5.1. This option is
  * now redundant and will be removed in a future version. Switch to using
  * `optimizeDeps.noDiscovery` and an empty or undefined `optimizeDeps.include`.
  * true or 'dev' disables the optimizer, false or 'build' leaves it enabled.
  * @default 'build'
  * @deprecated
  * @experimental
  */
  disabled?: boolean | "build" | "dev";
  /**
  * Automatic dependency discovery. When `noDiscovery` is true, only dependencies
  * listed in `include` will be optimized. The scanner isn't run for cold start
  * in this case. CJS-only dependencies must be present in `include` during dev.
  * @default false
  */
  noDiscovery?: boolean;
  /**
  * When enabled, it will hold the first optimized deps results until all static
  * imports are crawled on cold start. This avoids the need for full-page reloads
  * when new dependencies are discovered and they trigger the generation of new
  * common chunks. If all dependencies are found by the scanner plus the explicitly
  * defined ones in `include`, it is better to disable this option to let the
  * browser process more requests in parallel.
  * @default true
  * @experimental
  */
  holdUntilCrawlEnd?: boolean;
  /**
  * When enabled, Vite will not throw an error when an outdated optimized
  * dependency is requested. Enabling this option may cause a single module
  * to have a multiple reference.
  * @default false
  * @experimental
  */
  ignoreOutdatedRequests?: boolean;
}
type DepOptimizationOptions = DepOptimizationConfig & {
  /**
  * By default, Vite will crawl your `index.html` to detect dependencies that
  * need to be pre-bundled. If `build.rollupOptions.input` is specified, Vite
  * will crawl those entry points instead.
  *
  * If neither of these fit your needs, you can specify custom entries using
  * this option - the value should be a tinyglobby pattern or array of patterns
  * (https://github.com/SuperchupuDev/tinyglobby) that are relative from
  * vite project root. This will overwrite default entries inference.
  */
  entries?: string | string[];
  /**
  * Force dep pre-optimization regardless of whether deps have changed.
  * @experimental
  */
  force?: boolean;
};
interface OptimizedDepInfo {
  id: string;
  file: string;
  src?: string;
  needsInterop?: boolean;
  browserHash?: string;
  fileHash?: string;
  /**
  * During optimization, ids can still be resolved to their final location
  * but the bundles may not yet be saved to disk
  */
  processing?: Promise<void>;
  /**
  * ExportData cache, discovered deps will parse the src entry to get exports
  * data used both to define if interop is needed and when pre-bundling
  */
  exportsData?: Promise<ExportsData>;
  isDynamicEntry?: boolean;
}
interface DepOptimizationMetadata {
  /**
  * The main hash is determined by user config and dependency lockfiles.
  * This is checked on server startup to avoid unnecessary re-bundles.
  */
  hash: string;
  /**
  * This hash is determined by dependency lockfiles.
  * This is checked on server startup to avoid unnecessary re-bundles.
  */
  lockfileHash: string;
  /**
  * This hash is determined by user config.
  * This is checked on server startup to avoid unnecessary re-bundles.
  */
  configHash: string;
  /**
  * The browser hash is determined by the main hash plus additional dependencies
  * discovered at runtime. This is used to invalidate browser requests to
  * optimized deps.
  */
  browserHash: string;
  /**
  * Metadata for each already optimized dependency
  */
  optimized: Record<string, OptimizedDepInfo>;
  /**
  * Metadata for non-entry optimized chunks and dynamic imports
  */
  chunks: Record<string, OptimizedDepInfo>;
  /**
  * Metadata for each newly discovered dependency after processing
  */
  discovered: Record<string, OptimizedDepInfo>;
  /**
  * OptimizedDepInfo list
  */
  depInfoList: OptimizedDepInfo[];
}
/**
* Scan and optimize dependencies within a project.
* Used by Vite CLI when running `vite optimize`.
*
* @deprecated the optimization process runs automatically and does not need to be called
*/
//#endregion
//#region src/node/server/transformRequest.d.ts
interface TransformResult {
  code: string;
  map: SourceMap$1 | {
    mappings: "";
  } | null;
  ssr?: boolean;
  etag?: string;
  deps?: string[];
  dynamicDeps?: string[];
}
interface TransformOptions {
  /**
  * @deprecated inferred from environment
  */
  ssr?: boolean;
} //#endregion
//#region src/node/server/moduleGraph.d.ts
declare class EnvironmentModuleNode {
  environment: string;
  /**
  * Public served url path, starts with /
  */
  url: string;
  /**
  * Resolved file system path + query
  */
  id: string | null;
  file: string | null;
  type: "js" | "css" | "asset";
  info?: ModuleInfo;
  meta?: Record<string, any>;
  importers: Set<EnvironmentModuleNode>;
  importedModules: Set<EnvironmentModuleNode>;
  acceptedHmrDeps: Set<EnvironmentModuleNode>;
  acceptedHmrExports: Set<string> | null;
  importedBindings: Map<string, Set<string>> | null;
  isSelfAccepting?: boolean;
  transformResult: TransformResult | null;
  ssrModule: Record<string, any> | null;
  ssrError: Error | null;
  lastHMRTimestamp: number;
  lastInvalidationTimestamp: number;
  /**
  * @param setIsSelfAccepting - set `false` to set `isSelfAccepting` later. e.g. #7870
  */
  constructor(url: string, environment: string, setIsSelfAccepting?: boolean);
}
type ResolvedUrl = [url: string, resolvedId: string, meta: object | null | undefined];
declare class EnvironmentModuleGraph {
  environment: string;
  urlToModuleMap: Map<string, EnvironmentModuleNode>;
  idToModuleMap: Map<string, EnvironmentModuleNode>;
  etagToModuleMap: Map<string, EnvironmentModuleNode>;
  fileToModulesMap: Map<string, Set<EnvironmentModuleNode>>;
  constructor(environment: string, resolveId: (url: string) => Promise<PartialResolvedId | null>);
  getModuleByUrl(rawUrl: string): Promise<EnvironmentModuleNode | undefined>;
  getModuleById(id: string): EnvironmentModuleNode | undefined;
  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined;
  onFileChange(file: string): void;
  onFileDelete(file: string): void;
  invalidateModule(mod: EnvironmentModuleNode, seen?: Set<EnvironmentModuleNode>, timestamp?: number, isHmr?: boolean, softInvalidate?: boolean): void;
  invalidateAll(): void;
  /**
  * Update the module graph based on a module's updated imports information
  * If there are dependencies that no longer have any importers, they are
  * returned as a Set.
  *
  * @param staticImportedUrls Subset of `importedModules` where they're statically imported in code.
  *   This is only used for soft invalidations so `undefined` is fine but may cause more runtime processing.
  */
  updateModuleInfo(mod: EnvironmentModuleNode, importedModules: Set<string | EnvironmentModuleNode>, importedBindings: Map<string, Set<string>> | null, acceptedModules: Set<string | EnvironmentModuleNode>, acceptedExports: Set<string> | null, isSelfAccepting: boolean, staticImportedUrls?: Set<string>): Promise<Set<EnvironmentModuleNode> | undefined>;
  ensureEntryFromUrl(rawUrl: string, setIsSelfAccepting?: boolean): Promise<EnvironmentModuleNode>;
  createFileOnlyEntry(file: string): EnvironmentModuleNode;
  resolveUrl(url: string): Promise<ResolvedUrl>;
  updateModuleTransformResult(mod: EnvironmentModuleNode, result: TransformResult | null): void;
  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined;
} //#endregion
//#region src/node/server/mixedModuleGraph.d.ts
declare class ModuleNode {
  _moduleGraph: ModuleGraph;
  _clientModule: EnvironmentModuleNode | undefined;
  _ssrModule: EnvironmentModuleNode | undefined;
  constructor(moduleGraph: ModuleGraph, clientModule?: EnvironmentModuleNode, ssrModule?: EnvironmentModuleNode);
  _get<T extends keyof EnvironmentModuleNode>(prop: T): EnvironmentModuleNode[T];
  _set<T extends keyof EnvironmentModuleNode>(prop: T, value: EnvironmentModuleNode[T]): void;
  _wrapModuleSet(prop: ModuleSetNames, module: EnvironmentModuleNode | undefined): Set<ModuleNode>;
  _getModuleSetUnion(prop: "importedModules" | "importers"): Set<ModuleNode>;
  _getModuleInfoUnion(prop: "info"): ModuleInfo | undefined;
  _getModuleObjectUnion(prop: "meta"): Record<string, any> | undefined;
  get url(): string;
  set url(value: string);
  get id(): string | null;
  set id(value: string | null);
  get file(): string | null;
  set file(value: string | null);
  get type(): "js" | "css" | "asset";
  get info(): ModuleInfo | undefined;
  get meta(): Record<string, any> | undefined;
  get importers(): Set<ModuleNode>;
  get clientImportedModules(): Set<ModuleNode>;
  get ssrImportedModules(): Set<ModuleNode>;
  get importedModules(): Set<ModuleNode>;
  get acceptedHmrDeps(): Set<ModuleNode>;
  get acceptedHmrExports(): Set<string> | null;
  get importedBindings(): Map<string, Set<string>> | null;
  get isSelfAccepting(): boolean | undefined;
  get transformResult(): TransformResult | null;
  set transformResult(value: TransformResult | null);
  get ssrTransformResult(): TransformResult | null;
  set ssrTransformResult(value: TransformResult | null);
  get ssrModule(): Record<string, any> | null;
  get ssrError(): Error | null;
  get lastHMRTimestamp(): number;
  set lastHMRTimestamp(value: number);
  get lastInvalidationTimestamp(): number;
  get invalidationState(): TransformResult | "HARD_INVALIDATED" | undefined;
  get ssrInvalidationState(): TransformResult | "HARD_INVALIDATED" | undefined;
}
declare class ModuleGraph {
  urlToModuleMap: Map<string, ModuleNode>;
  idToModuleMap: Map<string, ModuleNode>;
  etagToModuleMap: Map<string, ModuleNode>;
  fileToModulesMap: Map<string, Set<ModuleNode>>;
  private moduleNodeCache;
  constructor(moduleGraphs: {
    client: () => EnvironmentModuleGraph;
    ssr: () => EnvironmentModuleGraph;
  });
  getModuleById(id: string): ModuleNode | undefined;
  getModuleByUrl(url: string, _ssr?: boolean): Promise<ModuleNode | undefined>;
  getModulesByFile(file: string): Set<ModuleNode> | undefined;
  onFileChange(file: string): void;
  onFileDelete(file: string): void;
  invalidateModule(mod: ModuleNode, seen?: Set<ModuleNode>, timestamp?: number, isHmr?: boolean, softInvalidate?: boolean): void;
  invalidateAll(): void;
  ensureEntryFromUrl(rawUrl: string, ssr?: boolean, setIsSelfAccepting?: boolean): Promise<ModuleNode>;
  createFileOnlyEntry(file: string): ModuleNode;
  resolveUrl(url: string, ssr?: boolean): Promise<ResolvedUrl>;
  updateModuleTransformResult(mod: ModuleNode, result: TransformResult | null, ssr?: boolean): void;
  getModuleByEtag(etag: string): ModuleNode | undefined;
  getBackwardCompatibleBrowserModuleNode(clientModule: EnvironmentModuleNode): ModuleNode;
  getBackwardCompatibleServerModuleNode(ssrModule: EnvironmentModuleNode): ModuleNode;
  getBackwardCompatibleModuleNode(mod: EnvironmentModuleNode): ModuleNode;
  getBackwardCompatibleModuleNodeDual(clientModule?: EnvironmentModuleNode, ssrModule?: EnvironmentModuleNode): ModuleNode;
}
type ModuleSetNames = "acceptedHmrDeps" | "importedModules"; //#endregion
//#region src/node/server/hmr.d.ts
interface HmrOptions {
  protocol?: string;
  host?: string;
  port?: number;
  clientPort?: number;
  path?: string;
  timeout?: number;
  overlay?: boolean;
  server?: HttpServer;
}
interface HotUpdateOptions {
  type: "create" | "update" | "delete";
  file: string;
  timestamp: number;
  modules: Array<EnvironmentModuleNode>;
  read: () => string | Promise<string>;
  server: ViteDevServer;
}
interface HmrContext {
  file: string;
  timestamp: number;
  modules: Array<ModuleNode>;
  read: () => string | Promise<string>;
  server: ViteDevServer;
}
interface HotChannelClient {
  send(payload: HotPayload): void;
}
type HotChannelListener<T extends string = string> = (data: InferCustomEventPayload<T>, client: HotChannelClient) => void;
interface HotChannel<Api = any> {
  /**
  * When true, the fs access check is skipped in fetchModule.
  * Set this for transports that is not exposed over the network.
  */
  skipFsCheck?: boolean;
  /**
  * Broadcast events to all clients
  */
  send?(payload: HotPayload): void;
  /**
  * Handle custom event emitted by `import.meta.hot.send`
  */
  on?<T extends string>(event: T, listener: HotChannelListener<T>): void;
  on?(event: "connection", listener: () => void): void;
  /**
  * Unregister event listener
  */
  off?(event: string, listener: Function): void;
  /**
  * Start listening for messages
  */
  listen?(): void;
  /**
  * Disconnect all clients, called when server is closed or restarted.
  */
  close?(): Promise<unknown> | void;
  api?: Api;
}
interface NormalizedHotChannelClient {
  /**
  * Send event to the client
  */
  send(payload: HotPayload): void;
  /**
  * Send custom event
  */
  send(event: string, payload?: CustomPayload["data"]): void;
}
interface NormalizedHotChannel<Api = any> {
  /**
  * Broadcast events to all clients
  */
  send(payload: HotPayload): void;
  /**
  * Send custom event
  */
  send<T extends string>(event: T, payload?: InferCustomEventPayload<T>): void;
  /**
  * Handle custom event emitted by `import.meta.hot.send`
  */
  on<T extends string>(event: T, listener: (data: InferCustomEventPayload<T>, client: NormalizedHotChannelClient) => void): void;
  /**
  * @deprecated use `vite:client:connect` event instead
  */
  on(event: "connection", listener: () => void): void;
  /**
  * Unregister event listener
  */
  off(event: string, listener: Function): void;
  handleInvoke(payload: HotPayload): Promise<{
    result: any;
  } | {
    error: any;
  }>;
  /**
  * Start listening for messages
  */
  listen(): void;
  /**
  * Disconnect all clients, called when server is closed or restarted.
  */
  close(): Promise<unknown> | void;
  api?: Api;
}
//#endregion
//#region src/types/ws.d.ts
// WebSocket socket.
declare class WebSocket$1 extends EventEmitter {
  /** The connection is not yet open. */
  static readonly CONNECTING: 0;
  /** The connection is open and ready to communicate. */
  static readonly OPEN: 1;
  /** The connection is in the process of closing. */
  static readonly CLOSING: 2;
  /** The connection is closed. */
  static readonly CLOSED: 3;
  binaryType: 'nodebuffer' | 'arraybuffer' | 'fragments';
  readonly bufferedAmount: number;
  readonly extensions: string;
  /** Indicates whether the websocket is paused */
  readonly isPaused: boolean;
  readonly protocol: string;
  /** The current state of the connection */
  readonly readyState: typeof WebSocket$1.CONNECTING | typeof WebSocket$1.OPEN | typeof WebSocket$1.CLOSING | typeof WebSocket$1.CLOSED;
  readonly url: string;
  /** The connection is not yet open. */
  readonly CONNECTING: 0;
  /** The connection is open and ready to communicate. */
  readonly OPEN: 1;
  /** The connection is in the process of closing. */
  readonly CLOSING: 2;
  /** The connection is closed. */
  readonly CLOSED: 3;
  onopen: ((event: WebSocket$1.Event) => void) | null;
  onerror: ((event: WebSocket$1.ErrorEvent) => void) | null;
  onclose: ((event: WebSocket$1.CloseEvent) => void) | null;
  onmessage: ((event: WebSocket$1.MessageEvent) => void) | null;
  constructor(address: null);
  constructor(address: string | URL$1, options?: WebSocket$1.ClientOptions | ClientRequestArgs);
  constructor(address: string | URL$1, protocols?: string | string[], options?: WebSocket$1.ClientOptions | ClientRequestArgs);
  close(code?: number, data?: string | Buffer): void;
  ping(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
  pong(data?: any, mask?: boolean, cb?: (err: Error) => void): void;
  send(data: any, cb?: (err?: Error) => void): void;
  send(data: any, options: {
    mask?: boolean | undefined;
    binary?: boolean | undefined;
    compress?: boolean | undefined;
    fin?: boolean | undefined;
  }, cb?: (err?: Error) => void): void;
  terminate(): void;
  /**
   * Pause the websocket causing it to stop emitting events. Some events can still be
   * emitted after this is called, until all buffered data is consumed. This method
   * is a noop if the ready state is `CONNECTING` or `CLOSED`.
   */
  pause(): void;
  /**
   * Make a paused socket resume emitting events. This method is a noop if the ready
   * state is `CONNECTING` or `CLOSED`.
   */
  resume(): void; // HTML5 WebSocket events
  addEventListener(method: 'message', cb: (event: WebSocket$1.MessageEvent) => void, options?: WebSocket$1.EventListenerOptions): void;
  addEventListener(method: 'close', cb: (event: WebSocket$1.CloseEvent) => void, options?: WebSocket$1.EventListenerOptions): void;
  addEventListener(method: 'error', cb: (event: WebSocket$1.ErrorEvent) => void, options?: WebSocket$1.EventListenerOptions): void;
  addEventListener(method: 'open', cb: (event: WebSocket$1.Event) => void, options?: WebSocket$1.EventListenerOptions): void;
  removeEventListener(method: 'message', cb: (event: WebSocket$1.MessageEvent) => void): void;
  removeEventListener(method: 'close', cb: (event: WebSocket$1.CloseEvent) => void): void;
  removeEventListener(method: 'error', cb: (event: WebSocket$1.ErrorEvent) => void): void;
  removeEventListener(method: 'open', cb: (event: WebSocket$1.Event) => void): void; // Events
  on(event: 'close', listener: (this: WebSocket$1, code: number, reason: Buffer) => void): this;
  on(event: 'error', listener: (this: WebSocket$1, err: Error) => void): this;
  on(event: 'upgrade', listener: (this: WebSocket$1, request: http.IncomingMessage) => void): this;
  on(event: 'message', listener: (this: WebSocket$1, data: WebSocket$1.RawData, isBinary: boolean) => void): this;
  on(event: 'open', listener: (this: WebSocket$1) => void): this;
  on(event: 'ping' | 'pong', listener: (this: WebSocket$1, data: Buffer) => void): this;
  on(event: 'unexpected-response', listener: (this: WebSocket$1, request: ClientRequest, response: http.IncomingMessage) => void): this;
  on(event: string | symbol, listener: (this: WebSocket$1, ...args: any[]) => void): this;
  once(event: 'close', listener: (this: WebSocket$1, code: number, reason: Buffer) => void): this;
  once(event: 'error', listener: (this: WebSocket$1, err: Error) => void): this;
  once(event: 'upgrade', listener: (this: WebSocket$1, request: http.IncomingMessage) => void): this;
  once(event: 'message', listener: (this: WebSocket$1, data: WebSocket$1.RawData, isBinary: boolean) => void): this;
  once(event: 'open', listener: (this: WebSocket$1) => void): this;
  once(event: 'ping' | 'pong', listener: (this: WebSocket$1, data: Buffer) => void): this;
  once(event: 'unexpected-response', listener: (this: WebSocket$1, request: ClientRequest, response: http.IncomingMessage) => void): this;
  once(event: string | symbol, listener: (this: WebSocket$1, ...args: any[]) => void): this;
  off(event: 'close', listener: (this: WebSocket$1, code: number, reason: Buffer) => void): this;
  off(event: 'error', listener: (this: WebSocket$1, err: Error) => void): this;
  off(event: 'upgrade', listener: (this: WebSocket$1, request: http.IncomingMessage) => void): this;
  off(event: 'message', listener: (this: WebSocket$1, data: WebSocket$1.RawData, isBinary: boolean) => void): this;
  off(event: 'open', listener: (this: WebSocket$1) => void): this;
  off(event: 'ping' | 'pong', listener: (this: WebSocket$1, data: Buffer) => void): this;
  off(event: 'unexpected-response', listener: (this: WebSocket$1, request: ClientRequest, response: http.IncomingMessage) => void): this;
  off(event: string | symbol, listener: (this: WebSocket$1, ...args: any[]) => void): this;
  addListener(event: 'close', listener: (code: number, reason: Buffer) => void): this;
  addListener(event: 'error', listener: (err: Error) => void): this;
  addListener(event: 'upgrade', listener: (request: http.IncomingMessage) => void): this;
  addListener(event: 'message', listener: (data: WebSocket$1.RawData, isBinary: boolean) => void): this;
  addListener(event: 'open', listener: () => void): this;
  addListener(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
  addListener(event: 'unexpected-response', listener: (request: ClientRequest, response: http.IncomingMessage) => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(event: 'close', listener: (code: number, reason: Buffer) => void): this;
  removeListener(event: 'error', listener: (err: Error) => void): this;
  removeListener(event: 'upgrade', listener: (request: http.IncomingMessage) => void): this;
  removeListener(event: 'message', listener: (data: WebSocket$1.RawData, isBinary: boolean) => void): this;
  removeListener(event: 'open', listener: () => void): this;
  removeListener(event: 'ping' | 'pong', listener: (data: Buffer) => void): this;
  removeListener(event: 'unexpected-response', listener: (request: ClientRequest, response: http.IncomingMessage) => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
}
declare const WebSocketAlias: typeof WebSocket$1;
interface WebSocketAlias extends WebSocket$1 {}
declare namespace WebSocket$1 {
  /**
   * Data represents the raw message payload received over the WebSocket.
   */
  type RawData = Buffer | ArrayBuffer | Buffer[];
  /**
   * Data represents the message payload received over the WebSocket.
   */
  type Data = string | Buffer | ArrayBuffer | Buffer[];
  /**
   * CertMeta represents the accepted types for certificate & key data.
   */
  type CertMeta = string | string[] | Buffer | Buffer[];
  /**
   * VerifyClientCallbackSync is a synchronous callback used to inspect the
   * incoming message. The return value (boolean) of the function determines
   * whether or not to accept the handshake.
   */
  type VerifyClientCallbackSync = (info: {
    origin: string;
    secure: boolean;
    req: http.IncomingMessage;
  }) => boolean;
  /**
   * VerifyClientCallbackAsync is an asynchronous callback used to inspect the
   * incoming message. The return value (boolean) of the function determines
   * whether or not to accept the handshake.
   */
  type VerifyClientCallbackAsync = (info: {
    origin: string;
    secure: boolean;
    req: http.IncomingMessage;
  }, callback: (res: boolean, code?: number, message?: string, headers?: OutgoingHttpHeaders) => void) => void;
  interface ClientOptions extends SecureContextOptions {
    protocol?: string | undefined;
    followRedirects?: boolean | undefined;
    generateMask?(mask: Buffer): void;
    handshakeTimeout?: number | undefined;
    maxRedirects?: number | undefined;
    perMessageDeflate?: boolean | PerMessageDeflateOptions | undefined;
    localAddress?: string | undefined;
    protocolVersion?: number | undefined;
    headers?: {
      [key: string]: string;
    } | undefined;
    origin?: string | undefined;
    agent?: Agent | undefined;
    host?: string | undefined;
    family?: number | undefined;
    checkServerIdentity?(servername: string, cert: CertMeta): boolean;
    rejectUnauthorized?: boolean | undefined;
    maxPayload?: number | undefined;
    skipUTF8Validation?: boolean | undefined;
  }
  interface PerMessageDeflateOptions {
    serverNoContextTakeover?: boolean | undefined;
    clientNoContextTakeover?: boolean | undefined;
    serverMaxWindowBits?: number | undefined;
    clientMaxWindowBits?: number | undefined;
    zlibDeflateOptions?: {
      flush?: number | undefined;
      finishFlush?: number | undefined;
      chunkSize?: number | undefined;
      windowBits?: number | undefined;
      level?: number | undefined;
      memLevel?: number | undefined;
      strategy?: number | undefined;
      dictionary?: Buffer | Buffer[] | DataView | undefined;
      info?: boolean | undefined;
    } | undefined;
    zlibInflateOptions?: ZlibOptions | undefined;
    threshold?: number | undefined;
    concurrencyLimit?: number | undefined;
  }
  interface Event {
    type: string;
    target: WebSocket$1;
  }
  interface ErrorEvent {
    error: any;
    message: string;
    type: string;
    target: WebSocket$1;
  }
  interface CloseEvent {
    wasClean: boolean;
    code: number;
    reason: string;
    type: string;
    target: WebSocket$1;
  }
  interface MessageEvent {
    data: Data;
    type: string;
    target: WebSocket$1;
  }
  interface EventListenerOptions {
    once?: boolean | undefined;
  }
  interface ServerOptions {
    host?: string | undefined;
    port?: number | undefined;
    backlog?: number | undefined;
    server?: http.Server | Server$1 | undefined;
    verifyClient?: VerifyClientCallbackAsync | VerifyClientCallbackSync | undefined;
    handleProtocols?: (protocols: Set<string>, request: http.IncomingMessage) => string | false;
    path?: string | undefined;
    noServer?: boolean | undefined;
    clientTracking?: boolean | undefined;
    perMessageDeflate?: boolean | PerMessageDeflateOptions | undefined;
    maxPayload?: number | undefined;
    skipUTF8Validation?: boolean | undefined;
    WebSocket?: typeof WebSocket$1.WebSocket | undefined;
  }
  interface AddressInfo {
    address: string;
    family: string;
    port: number;
  } // WebSocket Server
  class Server<T extends WebSocket$1 = WebSocket$1> extends EventEmitter {
    options: ServerOptions;
    path: string;
    clients: Set<T>;
    constructor(options?: ServerOptions, callback?: () => void);
    address(): AddressInfo | string;
    close(cb?: (err?: Error) => void): void;
    handleUpgrade(request: http.IncomingMessage, socket: Duplex, upgradeHead: Buffer, callback: (client: T, request: http.IncomingMessage) => void): void;
    shouldHandle(request: http.IncomingMessage): boolean | Promise<boolean>; // Events
    on(event: 'connection', cb: (this: Server<T>, socket: T, request: http.IncomingMessage) => void): this;
    on(event: 'error', cb: (this: Server<T>, error: Error) => void): this;
    on(event: 'headers', cb: (this: Server<T>, headers: string[], request: http.IncomingMessage) => void): this;
    on(event: 'close' | 'listening', cb: (this: Server<T>) => void): this;
    on(event: string | symbol, listener: (this: Server<T>, ...args: any[]) => void): this;
    once(event: 'connection', cb: (this: Server<T>, socket: T, request: http.IncomingMessage) => void): this;
    once(event: 'error', cb: (this: Server<T>, error: Error) => void): this;
    once(event: 'headers', cb: (this: Server<T>, headers: string[], request: http.IncomingMessage) => void): this;
    once(event: 'close' | 'listening', cb: (this: Server<T>) => void): this;
    once(event: string | symbol, listener: (this: Server<T>, ...args: any[]) => void): this;
    off(event: 'connection', cb: (this: Server<T>, socket: T, request: http.IncomingMessage) => void): this;
    off(event: 'error', cb: (this: Server<T>, error: Error) => void): this;
    off(event: 'headers', cb: (this: Server<T>, headers: string[], request: http.IncomingMessage) => void): this;
    off(event: 'close' | 'listening', cb: (this: Server<T>) => void): this;
    off(event: string | symbol, listener: (this: Server<T>, ...args: any[]) => void): this;
    addListener(event: 'connection', cb: (client: T, request: http.IncomingMessage) => void): this;
    addListener(event: 'error', cb: (err: Error) => void): this;
    addListener(event: 'headers', cb: (headers: string[], request: http.IncomingMessage) => void): this;
    addListener(event: 'close' | 'listening', cb: () => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: 'connection', cb: (client: T) => void): this;
    removeListener(event: 'error', cb: (err: Error) => void): this;
    removeListener(event: 'headers', cb: (headers: string[], request: http.IncomingMessage) => void): this;
    removeListener(event: 'close' | 'listening', cb: () => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
  }
  const WebSocketServer: typeof Server;
  interface WebSocketServer extends Server {}
  const WebSocket: typeof WebSocketAlias;
  interface WebSocket extends WebSocketAlias {} // WebSocket stream
  function createWebSocketStream(websocket: WebSocket$1, options?: DuplexOptions): Duplex;
} // export = WebSocket
//#endregion
//#region src/node/server/ws.d.ts
type WebSocketCustomListener<T> = (data: T, client: WebSocketClient) => void;
declare const isWebSocketServer: unique symbol;
interface WebSocketServer extends NormalizedHotChannel {
  /**
  * Handle custom event emitted by `import.meta.hot.send`
  */
  on: WebSocket$1.Server["on"] & {
    <T extends string>(event: T, listener: WebSocketCustomListener<InferCustomEventPayload<T>>): void;
  };
  /**
  * Unregister event listener.
  */
  off: WebSocket$1.Server["off"] & {
    (event: string, listener: Function): void;
  };
  /**
  * Listen on port and host
  */
  listen(): void;
  /**
  * Disconnect all clients and terminate the server.
  */
  close(): Promise<void>;
  [isWebSocketServer]: true;
  /**
  * Get all connected clients.
  */
  clients: Set<WebSocketClient>;
}
interface WebSocketClient extends NormalizedHotChannelClient {
  /**
  * The raw WebSocket instance
  * @advanced
  */
  socket: WebSocket$1;
} //#endregion
//#region src/node/server/environment.d.ts
interface DevEnvironmentContext {
  hot: boolean;
  transport?: HotChannel | WebSocketServer;
  options?: EnvironmentOptions;
  remoteRunner?: {
    inlineSourceMap?: boolean;
  };
  depsOptimizer?: DepsOptimizer;
}
declare class DevEnvironment extends BaseEnvironment {
  mode: "dev";
  moduleGraph: EnvironmentModuleGraph;
  depsOptimizer?: DepsOptimizer;
  get pluginContainer(): EnvironmentPluginContainer<DevEnvironment>;
  /**
  * Hot channel for this environment. If not provided or disabled,
  * it will be a noop channel that does nothing.
  *
  * @example
  * environment.hot.send({ type: 'full-reload' })
  */
  hot: NormalizedHotChannel;
  constructor(name: string, config: ResolvedConfig, context: DevEnvironmentContext);
  init(options?: {
    watcher?: FSWatcher;
    /**
    * the previous instance used for the environment with the same name
    *
    * when using, the consumer should check if it's an instance generated from the same class or factory function
    */
    previousInstance?: DevEnvironment;
  }): Promise<void>;
  /**
  * When the dev server is restarted, the methods are called in the following order:
  * - new instance `init`
  * - previous instance `close`
  * - new instance `listen`
  */
  listen(server: ViteDevServer): Promise<void>;
  /**
  * Called by the module runner to retrieve information about the specified
  * module. Internally calls `transformRequest` and wraps the result in the
  * format that the module runner understands.
  * This method is not meant to be called manually.
  */
  fetchModule(id: string, importer?: string, options?: FetchFunctionOptions): Promise<FetchResult>;
  reloadModule(module: EnvironmentModuleNode): Promise<void>;
  transformRequest(url: string): Promise<TransformResult | null>;
  warmupRequest(url: string): Promise<void>;
  protected invalidateModule(m: {
    path: string;
    message?: string;
    firstInvalidatedBy: string;
  }, _client: NormalizedHotChannelClient): void;
  close(): Promise<void>;
  /**
  * Calling `await environment.waitForRequestsIdle(id)` will wait until all static imports
  * are processed after the first transformRequest call. If called from a load or transform
  * plugin hook, the id needs to be passed as a parameter to avoid deadlocks.
  * Calling this function after the first static imports section of the module graph has been
  * processed will resolve immediately.
  * @experimental
  */
  waitForRequestsIdle(ignoredId?: string): Promise<void>;
} //#endregion
//#region src/types/commonjs.d.ts
interface RollupCommonJSOptions {
  /**
   * A minimatch pattern, or array of patterns, which specifies the files in
   * the build the plugin should operate on. By default, all files with
   * extension `".cjs"` or those in `extensions` are included, but you can
   * narrow this list by only including specific files. These files will be
   * analyzed and transpiled if either the analysis does not find ES module
   * specific statements or `transformMixedEsModules` is `true`.
   * @default undefined
   */
  include?: string | RegExp | readonly (string | RegExp)[];
  /**
   * A minimatch pattern, or array of patterns, which specifies the files in
   * the build the plugin should _ignore_. By default, all files with
   * extensions other than those in `extensions` or `".cjs"` are ignored, but you
   * can exclude additional files. See also the `include` option.
   * @default undefined
   */
  exclude?: string | RegExp | readonly (string | RegExp)[];
  /**
   * For extensionless imports, search for extensions other than .js in the
   * order specified. Note that you need to make sure that non-JavaScript files
   * are transpiled by another plugin first.
   * @default [ '.js' ]
   */
  extensions?: ReadonlyArray<string>;
  /**
   * If true then uses of `global` won't be dealt with by this plugin
   * @default false
   */
  ignoreGlobal?: boolean;
  /**
   * If false, skips source map generation for CommonJS modules. This will
   * improve performance.
   * @default true
   */
  sourceMap?: boolean;
  /**
   * Some `require` calls cannot be resolved statically to be translated to
   * imports.
   * When this option is set to `false`, the generated code will either
   * directly throw an error when such a call is encountered or, when
   * `dynamicRequireTargets` is used, when such a call cannot be resolved with a
   * configured dynamic require target.
   * Setting this option to `true` will instead leave the `require` call in the
   * code or use it as a fallback for `dynamicRequireTargets`.
   * @default false
   */
  ignoreDynamicRequires?: boolean;
  /**
   * Instructs the plugin whether to enable mixed module transformations. This
   * is useful in scenarios with modules that contain a mix of ES `import`
   * statements and CommonJS `require` expressions. Set to `true` if `require`
   * calls should be transformed to imports in mixed modules, or `false` if the
   * `require` expressions should survive the transformation. The latter can be
   * important if the code contains environment detection, or you are coding
   * for an environment with special treatment for `require` calls such as
   * ElectronJS. See also the `ignore` option.
   * @default false
   */
  transformMixedEsModules?: boolean;
  /**
   * By default, this plugin will try to hoist `require` statements as imports
   * to the top of each file. While this works well for many code bases and
   * allows for very efficient ESM output, it does not perfectly capture
   * CommonJS semantics as the order of side effects like log statements may
   * change. But it is especially problematic when there are circular `require`
   * calls between CommonJS modules as those often rely on the lazy execution of
   * nested `require` calls.
   *
   * Setting this option to `true` will wrap all CommonJS files in functions
   * which are executed when they are required for the first time, preserving
   * NodeJS semantics. Note that this can have an impact on the size and
   * performance of the generated code.
   *
   * The default value of `"auto"` will only wrap CommonJS files when they are
   * part of a CommonJS dependency cycle, e.g. an index file that is required by
   * many of its dependencies. All other CommonJS files are hoisted. This is the
   * recommended setting for most code bases.
   *
   * `false` will entirely prevent wrapping and hoist all files. This may still
   * work depending on the nature of cyclic dependencies but will often cause
   * problems.
   *
   * You can also provide a minimatch pattern, or array of patterns, to only
   * specify a subset of files which should be wrapped in functions for proper
   * `require` semantics.
   *
   * `"debug"` works like `"auto"` but after bundling, it will display a warning
   * containing a list of ids that have been wrapped which can be used as
   * minimatch pattern for fine-tuning.
   * @default "auto"
   */
  strictRequires?: boolean | string | RegExp | readonly (string | RegExp)[];
  /**
   * Sometimes you have to leave require statements unconverted. Pass an array
   * containing the IDs or a `id => boolean` function.
   * @default []
   */
  ignore?: ReadonlyArray<string> | ((id: string) => boolean);
  /**
   * In most cases, where `require` calls are inside a `try-catch` clause,
   * they should be left unconverted as it requires an optional dependency
   * that may or may not be installed beside the rolled up package.
   * Due to the conversion of `require` to a static `import` - the call is
   * hoisted to the top of the file, outside the `try-catch` clause.
   *
   * - `true`: Default. All `require` calls inside a `try` will be left unconverted.
   * - `false`: All `require` calls inside a `try` will be converted as if the
   *   `try-catch` clause is not there.
   * - `remove`: Remove all `require` calls from inside any `try` block.
   * - `string[]`: Pass an array containing the IDs to left unconverted.
   * - `((id: string) => boolean|'remove')`: Pass a function that controls
   *   individual IDs.
   *
   * @default true
   */
  ignoreTryCatch?: boolean | 'remove' | ReadonlyArray<string> | ((id: string) => boolean | 'remove');
  /**
   * Controls how to render imports from external dependencies. By default,
   * this plugin assumes that all external dependencies are CommonJS. This
   * means they are rendered as default imports to be compatible with e.g.
   * NodeJS where ES modules can only import a default export from a CommonJS
   * dependency.
   *
   * If you set `esmExternals` to `true`, this plugin assumes that all
   * external dependencies are ES modules and respect the
   * `requireReturnsDefault` option. If that option is not set, they will be
   * rendered as namespace imports.
   *
   * You can also supply an array of ids to be treated as ES modules, or a
   * function that will be passed each external id to determine whether it is
   * an ES module.
   * @default false
   */
  esmExternals?: boolean | ReadonlyArray<string> | ((id: string) => boolean);
  /**
   * Controls what is returned when requiring an ES module from a CommonJS file.
   * When using the `esmExternals` option, this will also apply to external
   * modules. By default, this plugin will render those imports as namespace
   * imports i.e.
   *
   * ```js
   * // input
   * const foo = require('foo');
   *
   * // output
   * import * as foo from 'foo';
   * ```
   *
   * However, there are some situations where this may not be desired.
   * For these situations, you can change Rollup's behaviour either globally or
   * per module. To change it globally, set the `requireReturnsDefault` option
   * to one of the following values:
   *
   * - `false`: This is the default, requiring an ES module returns its
   *   namespace. This is the only option that will also add a marker
   *   `__esModule: true` to the namespace to support interop patterns in
   *   CommonJS modules that are transpiled ES modules.
   * - `"namespace"`: Like `false`, requiring an ES module returns its
   *   namespace, but the plugin does not add the `__esModule` marker and thus
   *   creates more efficient code. For external dependencies when using
   *   `esmExternals: true`, no additional interop code is generated.
   * - `"auto"`: This is complementary to how `output.exports: "auto"` works in
   *   Rollup: If a module has a default export and no named exports, requiring
   *   that module returns the default export. In all other cases, the namespace
   *   is returned. For external dependencies when using `esmExternals: true`, a
   *   corresponding interop helper is added.
   * - `"preferred"`: If a module has a default export, requiring that module
   *   always returns the default export, no matter whether additional named
   *   exports exist. This is similar to how previous versions of this plugin
   *   worked. Again for external dependencies when using `esmExternals: true`,
   *   an interop helper is added.
   * - `true`: This will always try to return the default export on require
   *   without checking if it actually exists. This can throw at build time if
   *   there is no default export. This is how external dependencies are handled
   *   when `esmExternals` is not used. The advantage over the other options is
   *   that, like `false`, this does not add an interop helper for external
   *   dependencies, keeping the code lean.
   *
   * To change this for individual modules, you can supply a function for
   * `requireReturnsDefault` instead. This function will then be called once for
   * each required ES module or external dependency with the corresponding id
   * and allows you to return different values for different modules.
   * @default false
   */
  requireReturnsDefault?: boolean | 'auto' | 'preferred' | 'namespace' | ((id: string) => boolean | 'auto' | 'preferred' | 'namespace');
  /**
   * @default "auto"
   */
  defaultIsModuleExports?: boolean | 'auto' | ((id: string) => boolean | 'auto');
  /**
   * Some modules contain dynamic `require` calls, or require modules that
   * contain circular dependencies, which are not handled well by static
   * imports. Including those modules as `dynamicRequireTargets` will simulate a
   * CommonJS (NodeJS-like) environment for them with support for dynamic
   * dependencies. It also enables `strictRequires` for those modules.
   *
   * Note: In extreme cases, this feature may result in some paths being
   * rendered as absolute in the final bundle. The plugin tries to avoid
   * exposing paths from the local machine, but if you are `dynamicRequirePaths`
   * with paths that are far away from your project's folder, that may require
   * replacing strings like `"/Users/John/Desktop/foo-project/"` -\> `"/"`.
   */
  dynamicRequireTargets?: string | ReadonlyArray<string>;
  /**
   * To avoid long paths when using the `dynamicRequireTargets` option, you can use this option to specify a directory
   * that is a common parent for all files that use dynamic require statements. Using a directory higher up such as `/`
   * may lead to unnecessarily long paths in the generated code and may expose directory names on your machine like your
   * home directory name. By default, it uses the current working directory.
   */
  dynamicRequireRoot?: string;
} //#endregion
//#region src/types/dynamicImportVars.d.ts
interface RollupDynamicImportVarsOptions {
  /**
   * Files to include in this plugin (default all).
   * @default []
   */
  include?: string | RegExp | (string | RegExp)[];
  /**
   * Files to exclude in this plugin (default none).
   * @default []
   */
  exclude?: string | RegExp | (string | RegExp)[];
  /**
   * @deprecated This option is no-op and will be removed in future versions.
   */
  warnOnError?: boolean;
} //#endregion
//#region src/node/plugins/terser.d.ts
interface TerserOptions extends TerserMinifyOptions {
  /**
  * Vite-specific option to specify the max number of workers to spawn
  * when minifying files with terser.
  *
  * @default number of CPUs minus 1
  */
  maxWorkers?: number;
} //#endregion
//#region src/node/plugins/resolve.d.ts
interface EnvironmentResolveOptions {
  /**
  * @default ['browser', 'module', 'jsnext:main', 'jsnext']
  */
  mainFields?: string[];
  conditions?: string[];
  externalConditions?: string[];
  /**
  * @default ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
  */
  extensions?: string[];
  dedupe?: string[];
  /**
  * Prevent listed dependencies from being externalized and will get bundled in build.
  * Only works in server environments for now. Previously this was `ssr.noExternal`.
  * @experimental
  */
  noExternal?: string | RegExp | (string | RegExp)[] | true;
  /**
  * Externalize the given dependencies and their transitive dependencies.
  * Only works in server environments for now. Previously this was `ssr.external`.
  * @experimental
  */
  external?: string[] | true;
  /**
  * Array of strings or regular expressions that indicate what modules are builtin for the environment.
  */
  builtins?: (string | RegExp)[];
}
interface ResolveOptions extends EnvironmentResolveOptions {
  /**
  * @default false
  */
  preserveSymlinks?: boolean;
  /**
  * Enable tsconfig paths resolution
  *
  * @default false
  * @experimental
  */
  tsconfigPaths?: boolean;
}
interface ResolvePluginOptions {
  root: string;
  isBuild: boolean;
  isProduction: boolean;
  packageCache?: PackageCache;
  /**
  * src code mode also attempts the following:
  * - resolving /xxx as URLs
  * - resolving bare imports from optimized deps
  */
  asSrc?: boolean;
  tryIndex?: boolean;
  tryPrefix?: string;
  preferRelative?: boolean;
  isRequire?: boolean;
  scan?: boolean;
  /**
  * Enable when `legacy.inconsistentCjsInterop` is true. See that option for more details.
  */
  legacyInconsistentCjsInterop?: boolean;
}
interface InternalResolveOptions extends Required<ResolveOptions>, ResolvePluginOptions {} //#endregion
//#region src/node/packages.d.ts
/** Cache for package.json resolution and package.json contents */
type PackageCache = Map<string, PackageData>;
interface PackageData {
  dir: string;
  hasSideEffects: (id: string) => boolean | "no-treeshake" | null;
  setResolvedCache: (key: string, entry: string, options: InternalResolveOptions) => void;
  getResolvedCache: (key: string, options: InternalResolveOptions) => string | undefined;
  data: {
    [field: string]: any;
    name: string;
    type: string;
    version: string;
    main: string;
    module: string;
    browser: string | Record<string, string | false>;
    exports: string | Record<string, any> | string[];
    imports: Record<string, any>;
    dependencies: Record<string, string>;
  };
} //#endregion
//#region src/node/plugins/license.d.ts
interface LicenseOptions {
  /**
  * The output file name of the license file relative to the output directory.
  * Specify a path that ends with `.json` to output the raw JSON metadata.
  *
  * @default '.vite/license.md'
  */
  fileName: string;
} //#endregion
//#region src/node/build.d.ts
interface BuildEnvironmentOptions {
  /**
  * Compatibility transform target. The transform is performed with esbuild
  * and the lowest supported target is es2015. Note this only handles
  * syntax transformation and does not cover polyfills
  *
  * Default: 'baseline-widely-available' - transpile targeting browsers that
  * are included in the Baseline Widely Available on 2026-01-01.
  * (Chrome 111+, Edge 111+, Firefox 114+, Safari 16.4+).
  *
  * Another special value is 'esnext' - which only performs minimal transpiling
  * (for minification compat).
  *
  * For custom targets, see https://esbuild.github.io/api/#target and
  * https://esbuild.github.io/content-types/#javascript for more details.
  * @default 'baseline-widely-available'
  */
  target?: "baseline-widely-available" | EsbuildTarget | false;
  /**
  * whether to inject module preload polyfill.
  * Note: does not apply to library mode.
  * @default true
  * @deprecated use `modulePreload.polyfill` instead
  */
  polyfillModulePreload?: boolean;
  /**
  * Configure module preload
  * Note: does not apply to library mode.
  * @default true
  */
  modulePreload?: boolean | ModulePreloadOptions;
  /**
  * Directory relative from `root` where build output will be placed. If the
  * directory exists, it will be removed before the build.
  * @default 'dist'
  */
  outDir?: string;
  /**
  * Directory relative from `outDir` where the built js/css/image assets will
  * be placed.
  * @default 'assets'
  */
  assetsDir?: string;
  /**
  * Static asset files smaller than this number (in bytes) will be inlined as
  * base64 strings. If a callback is passed, a boolean can be returned to opt-in
  * or opt-out of inlining. If nothing is returned the default logic applies.
  *
  * Default limit is `4096` (4 KiB). Set to `0` to disable.
  * @default 4096
  */
  assetsInlineLimit?: number | ((filePath: string, content: Buffer) => boolean | undefined);
  /**
  * Whether to code-split CSS. When enabled, CSS in async chunks will be
  * inlined as strings in the chunk and inserted via dynamically created
  * style tags when the chunk is loaded.
  * @default true
  */
  cssCodeSplit?: boolean;
  /**
  * An optional separate target for CSS minification.
  * As esbuild only supports configuring targets to mainstream
  * browsers, users may need this option when they are targeting
  * a niche browser that comes with most modern JavaScript features
  * but has poor CSS support, e.g. Android WeChat WebView, which
  * doesn't support the #RGBA syntax.
  * @default target
  */
  cssTarget?: EsbuildTarget | false;
  /**
  * Override CSS minification specifically instead of defaulting to `build.minify`,
  * so you can configure minification for JS and CSS separately.
  * @default 'lightningcss'
  */
  cssMinify?: boolean | "lightningcss" | "esbuild";
  /**
  * If `true`, a separate sourcemap file will be created. If 'inline', the
  * sourcemap will be appended to the resulting output file as data URI.
  * 'hidden' works like `true` except that the corresponding sourcemap
  * comments in the bundled files are suppressed.
  * @default false
  */
  sourcemap?: boolean | "inline" | "hidden";
  /**
  * Set to `false` to disable minification, or specify the minifier to use.
  * Available options are 'oxc' or 'terser' or 'esbuild'.
  * @default 'oxc'
  */
  minify?: boolean | "oxc" | "terser" | "esbuild";
  /**
  * Options for terser
  * https://terser.org/docs/api-reference#minify-options
  *
  * In addition, you can also pass a `maxWorkers: number` option to specify the
  * max number of workers to spawn. Defaults to the number of CPUs minus 1.
  */
  terserOptions?: TerserOptions;
  /**
  * Alias to `rolldownOptions`
  * @deprecated Use `rolldownOptions` instead.
  */
  rollupOptions?: RolldownOptions;
  /**
  * Will be merged with internal rolldown options.
  * https://rolldown.rs/reference/config-options
  */
  rolldownOptions?: RolldownOptions;
  /**
  * Options to pass on to `@rollup/plugin-commonjs`
  * @deprecated This option is no-op and will be removed in future versions.
  */
  commonjsOptions?: RollupCommonJSOptions;
  /**
  * Options to pass on to `@rollup/plugin-dynamic-import-vars`
  */
  dynamicImportVarsOptions?: RollupDynamicImportVarsOptions;
  /**
  * Whether to write bundle to disk
  * @default true
  */
  write?: boolean;
  /**
  * Empty outDir on write.
  * @default true when outDir is a sub directory of project root
  */
  emptyOutDir?: boolean | null;
  /**
  * Copy the public directory to outDir on write.
  * @default true
  */
  copyPublicDir?: boolean;
  /**
  * Whether to emit a `.vite/license.md` file that includes all bundled dependencies'
  * licenses. Pass an object to customize the output file name.
  * @default false
  */
  license?: boolean | LicenseOptions;
  /**
  * Whether to emit a .vite/manifest.json in the output dir to map hash-less filenames
  * to their hashed versions. Useful when you want to generate your own HTML
  * instead of using the one generated by Vite.
  *
  * Example:
  *
  * ```json
  * {
  *   "main.js": {
  *     "file": "main.68fe3fad.js",
  *     "css": "main.e6b63442.css",
  *     "imports": [...],
  *     "dynamicImports": [...]
  *   }
  * }
  * ```
  * @default false
  */
  manifest?: boolean | string;
  /**
  * Build in library mode. The value should be the global name of the lib in
  * UMD mode. This will produce esm + cjs + umd bundle formats with default
  * configurations that are suitable for distributing libraries.
  * @default false
  */
  lib?: LibraryOptions | false;
  /**
  * Produce SSR oriented build. Note this requires specifying SSR entry via
  * `rollupOptions.input`.
  * @default false
  */
  ssr?: boolean | string;
  /**
  * Generate SSR manifest for determining style links and asset preload
  * directives in production.
  * @default false
  */
  ssrManifest?: boolean | string;
  /**
  * Emit assets during SSR.
  * @default false
  */
  ssrEmitAssets?: boolean;
  /**
  * Emit assets during build. Frameworks can set environments.ssr.build.emitAssets
  * By default, it is true for the client and false for other environments.
  */
  emitAssets?: boolean;
  /**
  * Set to false to disable reporting compressed chunk sizes.
  * Can slightly improve build speed.
  * @default true
  */
  reportCompressedSize?: boolean;
  /**
  * Adjust chunk size warning limit (in kB).
  * @default 500
  */
  chunkSizeWarningLimit?: number;
  /**
  * Rollup watch options
  * https://rollupjs.org/configuration-options/#watch
  * @default null
  */
  watch?: WatcherOptions | null;
  /**
  * create the Build Environment instance
  */
  createEnvironment?: (name: string, config: ResolvedConfig) => Promise<BuildEnvironment> | BuildEnvironment;
}
type BuildOptions = BuildEnvironmentOptions;
interface LibraryOptions {
  /**
  * Path of library entry
  */
  entry: InputOption;
  /**
  * The name of the exposed global variable. Required when the `formats` option includes
  * `umd` or `iife`
  */
  name?: string;
  /**
  * Output bundle formats
  * @default ['es', 'umd']
  */
  formats?: LibraryFormats[];
  /**
  * The name of the package file output. The default file name is the name option
  * of the project package.json. It can also be defined as a function taking the
  * format as an argument.
  */
  fileName?: string | ((format: ModuleFormat, entryName: string) => string);
  /**
  * The name of the CSS file output if the library imports CSS. Defaults to the
  * same value as `build.lib.fileName` if it's set a string, otherwise it falls
  * back to the name option of the project package.json.
  */
  cssFileName?: string;
}
type LibraryFormats = "es" | "cjs" | "umd" | "iife";
interface ModulePreloadOptions {
  /**
  * Whether to inject a module preload polyfill.
  * Note: does not apply to library mode.
  * @default true
  */
  polyfill?: boolean;
  /**
  * Resolve the list of dependencies to preload for a given dynamic import
  * @experimental
  */
  resolveDependencies?: ResolveModulePreloadDependenciesFn;
}
interface ResolvedModulePreloadOptions {
  polyfill: boolean;
  resolveDependencies?: ResolveModulePreloadDependenciesFn;
}
type ResolveModulePreloadDependenciesFn = (filename: string, deps: string[], context: {
  hostId: string;
  hostType: "html" | "js";
}) => string[];
interface ResolvedBuildEnvironmentOptions extends Required<Omit<BuildEnvironmentOptions, "polyfillModulePreload">> {
  modulePreload: false | ResolvedModulePreloadOptions;
}
interface ResolvedBuildOptions extends Required<Omit<BuildOptions, "polyfillModulePreload">> {
  modulePreload: false | ResolvedModulePreloadOptions;
}
/**
* Bundles a single environment for production.
* Returns a Promise containing the build result.
*/
type RenderBuiltAssetUrl = (filename: string, type: {
  type: "asset" | "public";
  hostId: string;
  hostType: "js" | "css" | "html";
  ssr: boolean;
}) => string | {
  relative?: boolean;
  runtime?: string;
} | undefined;
declare class BuildEnvironment extends BaseEnvironment {
  mode: "build";
  isBuilt: boolean;
  constructor(name: string, config: ResolvedConfig, setup?: {
    options?: EnvironmentOptions;
  });
  init(): Promise<void>;
}
interface ViteBuilder {
  environments: Record<string, BuildEnvironment>;
  config: ResolvedConfig;
  buildApp(): Promise<void>;
  build(environment: BuildEnvironment): Promise<RolldownOutput | RolldownOutput[] | RolldownWatcher>;
  runDevTools(): Promise<void>;
}
interface BuilderOptions {
  /**
  * Whether to share the config instance among environments to align with the behavior of dev server.
  *
  * @default false
  * @experimental
  */
  sharedConfigBuild?: boolean;
  /**
  * Whether to share the plugin instances among environments to align with the behavior of dev server.
  *
  * @default false
  * @experimental
  */
  sharedPlugins?: boolean;
  buildApp?: (builder: ViteBuilder) => Promise<void>;
}
type ResolvedBuilderOptions = Required<BuilderOptions>;
/**
* Creates a ViteBuilder to orchestrate building multiple environments.
* @experimental
*/
type BuildAppHook = (this: MinimalPluginContextWithoutEnvironment, builder: ViteBuilder) => Promise<void>; //#endregion
//#region src/node/environment.d.ts
type Environment = DevEnvironment | BuildEnvironment | ScanEnvironment | UnknownEnvironment;
/**
* Creates a function that hides the complexities of a WeakMap with an initial value
* to implement object metadata. Used by plugins to implement cross hooks per
* environment metadata
*
* @experimental
*/
//#endregion
//#region src/node/server/pluginContainer.d.ts
type SkipInformation = {
  id: string;
  importer: string | undefined;
  plugin: Plugin;
  called?: boolean;
};
declare class EnvironmentPluginContainer<Env extends Environment = Environment> {
  private _pluginContextMap;
  private _resolvedRollupOptions?;
  private _processesing;
  private _seenResolves;
  private _moduleNodeToLoadAddedImports;
  getSortedPluginHooks: PluginHookUtils["getSortedPluginHooks"];
  getSortedPlugins: PluginHookUtils["getSortedPlugins"];
  moduleGraph: EnvironmentModuleGraph | undefined;
  watchFiles: Set<string>;
  minimalContext: MinimalPluginContext$1<Env>;
  private _started;
  private _buildStartPromise;
  private _closed;
  private _updateModuleLoadAddedImports;
  private _getAddedImports;
  getModuleInfo(id: string): ModuleInfo | null;
  private handleHookPromise;
  get options(): InputOptions;
  resolveRollupOptions(): Promise<InputOptions>;
  private _getPluginContext;
  private hookParallel;
  buildStart(_options?: InputOptions): Promise<void>;
  resolveId(rawId: string, importer?: string | undefined, options?: {
    kind?: ImportKind;
    attributes?: Record<string, string>;
    custom?: CustomPluginOptions; /** @deprecated use `skipCalls` instead */
    skip?: Set<Plugin>;
    skipCalls?: readonly SkipInformation[];
    isEntry?: boolean;
  }): Promise<PartialResolvedId | null>;
  load(id: string): Promise<LoadResult | null>;
  transform(code: string, id: string, options?: {
    inMap?: SourceDescription["map"];
    moduleType?: string;
  }): Promise<{
    code: string;
    map: SourceMap$1 | {
      mappings: "";
    } | null;
    moduleType?: ModuleType;
  }>;
  watchChange(id: string, change: {
    event: "create" | "update" | "delete";
  }): Promise<void>;
  close(): Promise<void>;
}
declare class BasicMinimalPluginContext<Meta = PluginContextMeta> {
  meta: Meta;
  private _logger;
  constructor(meta: Meta, _logger: Logger);
  get pluginName(): string;
  debug(rawLog: string | RolldownLog | (() => string | RolldownLog)): void;
  info(rawLog: string | RolldownLog | (() => string | RolldownLog)): void;
  warn(rawLog: string | RolldownLog | (() => string | RolldownLog)): void;
  error(e: string | RolldownError): never;
  private _normalizeRawLog;
}
declare class MinimalPluginContext$1<T extends Environment = Environment> extends BasicMinimalPluginContext implements MinimalPluginContext {
  environment: T;
  constructor(meta: PluginContextMeta, environment: T);
}
declare class PluginContainer {
  private environments;
  constructor(environments: Record<string, Environment>);
  private _getEnvironment;
  private _getPluginContainer;
  getModuleInfo(id: string): ModuleInfo | null;
  get options(): InputOptions;
  buildStart(_options?: InputOptions): Promise<void>;
  watchChange(id: string, change: {
    event: "create" | "update" | "delete";
  }): Promise<void>;
  resolveId(rawId: string, importer?: string, options?: {
    attributes?: Record<string, string>;
    custom?: CustomPluginOptions; /** @deprecated use `skipCalls` instead */
    skip?: Set<Plugin>;
    skipCalls?: readonly SkipInformation[];
    ssr?: boolean;
    isEntry?: boolean;
  }): Promise<PartialResolvedId | null>;
  load(id: string, options?: {
    ssr?: boolean;
  }): Promise<LoadResult | null>;
  transform(code: string, id: string, options?: {
    ssr?: boolean;
    environment?: Environment;
    inMap?: SourceDescription["map"];
  }): Promise<{
    code: string;
    map: SourceMap$1 | {
      mappings: "";
    } | null;
  }>;
  close(): Promise<void>;
}
/**
* server.pluginContainer compatibility
*
* The default environment is in buildStart, buildEnd, watchChange, and closeBundle hooks,
* which are called once for all environments, or when no environment is passed in other hooks.
* The ssrEnvironment is needed for backward compatibility when the ssr flag is passed without
* an environment. The defaultEnvironment in the main pluginContainer in the server should be
* the client environment for backward compatibility.
**/
//#endregion
//#region src/node/server/index.d.ts
interface ServerOptions$1$1 extends CommonServerOptions {
  /**
  * Configure HMR-specific options (port, host, path & protocol)
  */
  hmr?: HmrOptions | boolean;
  /**
  * Do not start the websocket connection.
  * @experimental
  */
  ws?: false;
  /**
  * Warm-up files to transform and cache the results in advance. This improves the
  * initial page load during server starts and prevents transform waterfalls.
  */
  warmup?: {
    /**
    * The files to be transformed and used on the client-side. Supports glob patterns.
    */
    clientFiles?: string[];
    /**
    * The files to be transformed and used in SSR. Supports glob patterns.
    */
    ssrFiles?: string[];
  };
  /**
  * chokidar watch options or null to disable FS watching
  * https://github.com/paulmillr/chokidar/tree/3.6.0#api
  */
  watch?: WatchOptions | null;
  /**
  * Create Vite dev server to be used as a middleware in an existing server
  * @default false
  */
  middlewareMode?: boolean | {
    /**
    * Parent server instance to attach to
    *
    * This is needed to proxy WebSocket connections to the parent server.
    */
    server: HttpServer;
  };
  /**
  * Options for files served via '/\@fs/'.
  */
  fs?: FileSystemServeOptions;
  /**
  * Origin for the generated asset URLs.
  *
  * @example `http://127.0.0.1:8080`
  */
  origin?: string;
  /**
  * Pre-transform known direct imports
  * @default true
  */
  preTransformRequests?: boolean;
  /**
  * Whether or not to ignore-list source files in the dev server sourcemap, used to populate
  * the [`x_google_ignoreList` source map extension](https://developer.chrome.com/blog/devtools-better-angular-debugging/#the-x_google_ignorelist-source-map-extension).
  *
  * By default, it excludes all paths containing `node_modules`. You can pass `false` to
  * disable this behavior, or, for full control, a function that takes the source path and
  * sourcemap path and returns whether to ignore the source path.
  */
  sourcemapIgnoreList?: false | ((sourcePath: string, sourcemapPath: string) => boolean);
  /**
  * Backward compatibility. The buildStart and buildEnd hooks were called only once for
  * the client environment. This option enables per-environment buildStart and buildEnd hooks.
  * @default false
  * @experimental
  */
  perEnvironmentStartEndDuringDev?: boolean;
  /**
  * Backward compatibility. The watchChange hook was called only once for the client environment.
  * This option enables per-environment watchChange hooks.
  * @default false
  * @experimental
  */
  perEnvironmentWatchChangeDuringDev?: boolean;
  /**
  * Run HMR tasks, by default the HMR propagation is done in parallel for all environments
  * @experimental
  */
  hotUpdateEnvironments?: (server: ViteDevServer, hmr: (environment: DevEnvironment) => Promise<void>) => Promise<void>;
  forwardConsole?: boolean | ForwardConsoleOptions;
}
interface ResolvedServerOptions extends Omit<RequiredExceptFor<ServerOptions$1$1, "host" | "https" | "proxy" | "hmr" | "ws" | "watch" | "origin" | "hotUpdateEnvironments">, "fs" | "middlewareMode" | "sourcemapIgnoreList" | "forwardConsole"> {
  fs: Required<FileSystemServeOptions>;
  middlewareMode: NonNullable<ServerOptions$1$1["middlewareMode"]>;
  sourcemapIgnoreList: Exclude<ServerOptions$1$1["sourcemapIgnoreList"], false | undefined>;
  forwardConsole: ResolvedForwardConsoleOptions;
}
interface FileSystemServeOptions {
  /**
  * Strictly restrict file accessing outside of allowing paths.
  *
  * Set to `false` to disable the warning
  *
  * @default true
  */
  strict?: boolean;
  /**
  * Restrict accessing files outside the allowed directories.
  *
  * Accepts absolute path or a path relative to project root.
  * Will try to search up for workspace root by default.
  */
  allow?: string[];
  /**
  * Restrict accessing files that matches the patterns.
  *
  * This will have higher priority than `allow`.
  * picomatch patterns are supported.
  *
  * @default ['.env', '.env.*', '*.{crt,pem}', '**\/.git/**']
  */
  deny?: string[];
}
type ServerHook = (this: MinimalPluginContextWithoutEnvironment, server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>;
type HttpServer = http.Server | Http2SecureServer;
interface ViteDevServer {
  /**
  * The resolved vite config object
  */
  config: ResolvedConfig;
  /**
  * A connect app instance.
  * - Can be used to attach custom middlewares to the dev server.
  * - Can also be used as the handler function of a custom http server
  *   or as a middleware in any connect-style Node.js frameworks
  *
  * https://github.com/senchalabs/connect#use-middleware
  */
  middlewares: Connect.Server;
  /**
  * native Node http server instance
  * will be null in middleware mode
  */
  httpServer: HttpServer | null;
  /**
  * Chokidar watcher instance. If `config.server.watch` is set to `null`,
  * it will not watch any files and calling `add` or `unwatch` will have no effect.
  * https://github.com/paulmillr/chokidar/tree/3.6.0#api
  */
  watcher: FSWatcher;
  /**
  * WebSocket server with `send(payload)` method
  */
  ws: WebSocketServer;
  /**
  * An alias to `server.environments.client.hot`.
  * If you want to interact with all environments, loop over `server.environments`.
  */
  hot: NormalizedHotChannel;
  /**
  * Rollup plugin container that can run plugin hooks on a given file
  */
  pluginContainer: PluginContainer;
  /**
  * Module execution environments attached to the Vite server.
  */
  environments: Record<"client" | "ssr" | (string & {}), DevEnvironment>;
  /**
  * Module graph that tracks the import relationships, url to file mapping
  * and hmr state.
  */
  moduleGraph: ModuleGraph;
  /**
  * The resolved urls Vite prints on the CLI (URL-encoded). Returns `null`
  * in middleware mode or if the server is not listening on any port.
  */
  resolvedUrls: ResolvedServerUrls | null;
  /**
  * Programmatically resolve, load and transform a URL and get the result
  * without going through the http request pipeline.
  */
  transformRequest(url: string, options?: TransformOptions): Promise<TransformResult | null>;
  /**
  * Same as `transformRequest` but only warm up the URLs so the next request
  * will already be cached. The function will never throw as it handles and
  * reports errors internally.
  */
  warmupRequest(url: string, options?: TransformOptions): Promise<void>;
  /**
  * Apply vite built-in HTML transforms and any plugin HTML transforms.
  */
  transformIndexHtml(url: string, html: string, originalUrl?: string): Promise<string>;
  /**
  * Transform module code into SSR format.
  */
  ssrTransform(code: string, inMap: SourceMap$1 | {
    mappings: "";
  } | null, url: string, originalCode?: string): Promise<TransformResult | null>;
  /**
  * Load a given URL as an instantiated module for SSR.
  */
  ssrLoadModule(url: string, opts?: {
    fixStacktrace?: boolean;
  }): Promise<Record<string, any>>;
  /**
  * Returns a fixed version of the given stack
  */
  ssrRewriteStacktrace(stack: string): string;
  /**
  * Mutates the given SSR error by rewriting the stacktrace
  */
  ssrFixStacktrace(e: Error): void;
  /**
  * Triggers HMR for a module in the module graph. You can use the `server.moduleGraph`
  * API to retrieve the module to be reloaded. If `hmr` is false, this is a no-op.
  */
  reloadModule(module: ModuleNode): Promise<void>;
  /**
  * Start the server.
  */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>;
  /**
  * Stop the server.
  */
  close(): Promise<void>;
  /**
  * Print server urls
  */
  printUrls(): void;
  /**
  * Bind CLI shortcuts
  */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void;
  /**
  * Restart the server.
  *
  * @param forceOptimize - force the optimizer to re-bundle, same as --force cli flag
  */
  restart(forceOptimize?: boolean): Promise<void>;
  /**
  * Open browser
  */
  openBrowser(): void;
  /**
  * Calling `await server.waitForRequestsIdle(id)` will wait until all static imports
  * are processed. If called from a load or transform plugin hook, the id needs to be
  * passed as a parameter to avoid deadlocks. Calling this function after the first
  * static imports section of the module graph has been processed will resolve immediately.
  */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>;
}
interface ResolvedServerUrls {
  local: string[];
  network: string[];
}
//#endregion
//#region src/node/plugins/html.d.ts
interface HtmlTagDescriptor {
  tag: string;
  /**
  * attribute values will be escaped automatically if needed
  */
  attrs?: Record<string, string | boolean | undefined>;
  children?: string | HtmlTagDescriptor[];
  /**
  * default: 'head-prepend'
  */
  injectTo?: "head" | "body" | "head-prepend" | "body-prepend";
}
type IndexHtmlTransformResult = string | HtmlTagDescriptor[] | {
  html: string;
  tags: HtmlTagDescriptor[];
};
interface IndexHtmlTransformContext {
  /**
  * public path when served
  */
  path: string;
  /**
  * filename on disk
  */
  filename: string;
  server?: ViteDevServer;
  bundle?: OutputBundle;
  chunk?: OutputChunk;
  originalUrl?: string;
}
type IndexHtmlTransformHook = (this: MinimalPluginContextWithoutEnvironment, html: string, ctx: IndexHtmlTransformContext) => IndexHtmlTransformResult | void | Promise<IndexHtmlTransformResult | void>;
type IndexHtmlTransform = IndexHtmlTransformHook | {
  order?: "pre" | "post" | null;
  handler: IndexHtmlTransformHook;
}; //#endregion
//#region src/node/plugins/pluginFilter.d.ts
type StringFilter<Value = string | RegExp> = Value | Array<Value> | {
  include?: Value | Array<Value>;
  exclude?: Value | Array<Value>;
}; //#endregion
//#region src/node/plugin.d.ts
/**
* Vite plugins extends the Rollup plugin interface with a few extra
* vite-specific options. A valid vite plugin is also a valid Rollup plugin.
* On the contrary, a Rollup plugin may or may NOT be a valid vite universal
* plugin, since some Rollup features do not make sense in an unbundled
* dev server context. That said, as long as a rollup plugin doesn't have strong
* coupling between its bundle phase and output phase hooks then it should
* just work (that means, most of them).
*
* By default, the plugins are run during both serve and build. When a plugin
* is applied during serve, it will only run **non output plugin hooks** (see
* rollup type definition of {@link rollup#PluginHooks}). You can think of the
* dev server as only running `const bundle = rollup.rollup()` but never calling
* `bundle.generate()`.
*
* A plugin that expects to have different behavior depending on serve/build can
* export a factory function that receives the command being run via options.
*
* If a plugin should be applied only for server or build, a function format
* config file can be used to conditional determine the plugins to use.
*
* The current environment can be accessed from the context for the all non-global
* hooks (it is not available in config, configResolved, configureServer, etc).
* It can be a dev, build, or scan environment.
* Plugins can use this.environment.mode === 'dev' to guard for dev specific APIs.
*/
interface PluginContextExtension {
  /**
  * Vite-specific environment instance
  */
  environment: Environment;
}
interface PluginContextMetaExtension {
  viteVersion: string;
}
interface ConfigPluginContext extends Omit<MinimalPluginContext, "meta" | "environment"> {
  meta: Omit<PluginContextMeta, "watchMode">;
}
interface MinimalPluginContextWithoutEnvironment extends Omit<MinimalPluginContext, "environment"> {}
declare module "rolldown" {
  interface MinimalPluginContext extends PluginContextExtension {}
  interface PluginContextMeta extends PluginContextMetaExtension {}
}
/**
* There are two types of plugins in Vite. App plugins and environment plugins.
* Environment Plugins are defined by a constructor function that will be called
* once per each environment allowing users to have completely different plugins
* for each of them. The constructor gets the resolved environment after the server
* and builder has already been created simplifying config access and cache
* management for environment specific plugins.
* Environment Plugins are closer to regular rollup plugins. They can't define
* app level hooks (like config, configResolved, configureServer, etc).
*/
interface Plugin<A = any> extends Plugin$2<A> {
  /**
  * Perform custom handling of HMR updates.
  * The handler receives an options containing changed filename, timestamp, a
  * list of modules affected by the file change, and the dev server instance.
  *
  * - The hook can return a filtered list of modules to narrow down the update.
  *   e.g. for a Vue SFC, we can narrow down the part to update by comparing
  *   the descriptors.
  *
  * - The hook can also return an empty array and then perform custom updates
  *   by sending a custom hmr payload via environment.hot.send().
  *
  * - If the hook doesn't return a value, the hmr update will be performed as
  *   normal.
  */
  hotUpdate?: ObjectHook<(this: MinimalPluginContext & {
    environment: DevEnvironment;
  }, options: HotUpdateOptions) => Array<EnvironmentModuleNode> | void | Promise<Array<EnvironmentModuleNode> | void>>;
  /**
  * extend hooks with ssr flag
  */
  resolveId?: ObjectHook<(this: PluginContext, source: string, importer: string | undefined, options: {
    kind?: ImportKind;
    custom?: CustomPluginOptions;
    ssr?: boolean | undefined;
    isEntry: boolean;
  }) => Promise<ResolveIdResult> | ResolveIdResult, {
    filter?: {
      id?: StringFilter<RegExp>;
    };
  }>;
  load?: ObjectHook<(this: PluginContext, id: string, options?: {
    ssr?: boolean | undefined;
  }) => Promise<LoadResult> | LoadResult, {
    filter?: {
      id?: StringFilter;
    };
  }>;
  transform?: ObjectHook<(this: TransformPluginContext, code: string, id: string, options?: {
    moduleType: ModuleType;
    ssr?: boolean | undefined;
  }) => Promise<TransformResult$1> | TransformResult$1, {
    filter?: {
      id?: StringFilter;
      code?: StringFilter;
      moduleType?: ModuleTypeFilter;
    };
  }>;
  /**
  * Opt-in this plugin into the shared plugins pipeline.
  * For backward-compatibility, plugins are re-recreated for each environment
  * during `vite build --app`
  * We have an opt-in per plugin, and a general `builder.sharedPlugins`
  * In a future major, we'll flip the default to be shared by default
  * @experimental
  */
  sharedDuringBuild?: boolean;
  /**
  * Opt-in this plugin into per-environment buildStart and buildEnd during dev.
  * For backward-compatibility, the buildStart hook is called only once during
  * dev, for the client environment. Plugins can opt-in to be called
  * per-environment, aligning with the build hook behavior.
  * @experimental
  */
  perEnvironmentStartEndDuringDev?: boolean;
  /**
  * Opt-in this plugin into per-environment watchChange during dev.
  * For backward-compatibility, the watchChange hook is called only once during
  * dev, for the client environment. Plugins can opt-in to be called
  * per-environment, aligning with the watchChange hook behavior.
  * @experimental
  */
  perEnvironmentWatchChangeDuringDev?: boolean;
  /**
  * Enforce plugin invocation tier similar to webpack loaders. Hooks ordering
  * is still subject to the `order` property in the hook object.
  *
  * Plugin invocation order:
  * - alias resolution
  * - `enforce: 'pre'` plugins
  * - vite core plugins
  * - normal plugins
  * - vite build plugins
  * - `enforce: 'post'` plugins
  * - vite build post plugins
  */
  enforce?: "pre" | "post";
  /**
  * Apply the plugin only for serve or build, or on certain conditions.
  */
  apply?: "serve" | "build" | ((this: void, config: UserConfig, env: ConfigEnv) => boolean);
  /**
  * Define environments where this plugin should be active
  * By default, the plugin is active in all environments
  * @experimental
  */
  applyToEnvironment?: (environment: PartialEnvironment) => boolean | Promise<boolean> | PluginOption;
  /**
  * Modify vite config before it's resolved. The hook can either mutate the
  * passed-in config directly, or return a partial config object that will be
  * deeply merged into existing config.
  *
  * Note: User plugins are resolved before running this hook so injecting other
  * plugins inside  the `config` hook will have no effect.
  */
  config?: ObjectHook<(this: ConfigPluginContext, config: UserConfig, env: ConfigEnv) => Omit<UserConfig, "plugins"> | null | void | Promise<Omit<UserConfig, "plugins"> | null | void>>;
  /**
  * Modify environment configs before it's resolved. The hook can either mutate the
  * passed-in environment config directly, or return a partial config object that will be
  * deeply merged into existing config.
  * This hook is called for each environment with a partially resolved environment config
  * that already accounts for the default environment config values set at the root level.
  * If plugins need to modify the config of a given environment, they should do it in this
  * hook instead of the config hook. Leaving the config hook only for modifying the root
  * default environment config.
  */
  configEnvironment?: ObjectHook<(this: ConfigPluginContext, name: string, config: EnvironmentOptions, env: ConfigEnv & {
    /**
    * Whether this environment is SSR environment and `ssr.target` is set to `'webworker'`.
    * Only intended to be used for backward compatibility.
    */
    isSsrTargetWebworker?: boolean;
  }) => EnvironmentOptions | null | void | Promise<EnvironmentOptions | null | void>>;
  /**
  * Use this hook to read and store the final resolved vite config.
  */
  configResolved?: ObjectHook<(this: MinimalPluginContextWithoutEnvironment, config: ResolvedConfig) => void | Promise<void>>;
  /**
  * Configure the vite server. The hook receives the {@link ViteDevServer}
  * instance. This can also be used to store a reference to the server
  * for use in other hooks.
  *
  * The hooks will be called before internal middlewares are applied. A hook
  * can return a post hook that will be called after internal middlewares
  * are applied. Hook can be async functions and will be called in series.
  */
  configureServer?: ObjectHook<ServerHook>;
  /**
  * Configure the preview server. The hook receives the {@link PreviewServer}
  * instance. This can also be used to store a reference to the server
  * for use in other hooks.
  *
  * The hooks are called before other middlewares are applied. A hook can
  * return a post hook that will be called after other middlewares are
  * applied. Hooks can be async functions and will be called in series.
  */
  configurePreviewServer?: ObjectHook<PreviewServerHook>;
  /**
  * Transform index.html.
  * The hook receives the following arguments:
  *
  * - html: string
  * - ctx: IndexHtmlTransformContext, which contains:
  *    - path: public path when served
  *    - filename: filename on disk
  *    - server?: ViteDevServer (only present during serve)
  *    - bundle?: rollup.OutputBundle (only present during build)
  *    - chunk?: rollup.OutputChunk
  *    - originalUrl?: string
  *
  * It can either return a transformed string, or a list of html tag
  * descriptors that will be injected into the `<head>` or `<body>`.
  *
  * By default the transform is applied **after** vite's internal html
  * transform. If you need to apply the transform before vite, use an object:
  * `{ order: 'pre', handler: hook }`
  */
  transformIndexHtml?: IndexHtmlTransform;
  /**
  * Build Environments
  *
  * @experimental
  */
  buildApp?: ObjectHook<BuildAppHook>;
  /**
  * Perform custom handling of HMR updates.
  * The handler receives a context containing changed filename, timestamp, a
  * list of modules affected by the file change, and the dev server instance.
  *
  * - The hook can return a filtered list of modules to narrow down the update.
  *   e.g. for a Vue SFC, we can narrow down the part to update by comparing
  *   the descriptors.
  *
  * - The hook can also return an empty array and then perform custom updates
  *   by sending a custom hmr payload via server.ws.send().
  *
  * - If the hook doesn't return a value, the hmr update will be performed as
  *   normal.
  */
  handleHotUpdate?: ObjectHook<(this: MinimalPluginContextWithoutEnvironment, ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>>;
  /**
  * This hook is not supported by Rolldown yet. But the type is declared for compatibility.
  *
  * @deprecated This hook is **not** deprecated. It is marked as deprecated just to make it clear that this hook is currently a no-op.
  */
  shouldTransformCachedModule?: ObjectHook<(this: PluginContext, options: {
    code: string;
    id: string;
    meta: CustomPluginOptions;
    moduleSideEffects: boolean | "no-treeshake";
  }) => boolean | null | void>;
}
type HookHandler<T> = T extends ObjectHook<infer H> ? H : T;
type PluginWithRequiredHook<K extends keyof Plugin> = Plugin & { [P in K]: NonNullable<Plugin[P]> };
type Thenable<T> = T | Promise<T>;
type FalsyPlugin = false | null | undefined;
type PluginOption = Thenable<Plugin | {
  name: string;
} | FalsyPlugin | PluginOption[]>;
/**
* @experimental
*/
//#endregion
//#region src/node/plugins/css.d.ts
interface CSSOptions {
  /**
  * Using lightningcss is an experimental option to handle CSS modules,
  * assets and imports via Lightning CSS. It requires to install it as a
  * peer dependency.
  *
  * @default 'postcss'
  * @experimental
  */
  transformer?: "postcss" | "lightningcss";
  /**
  * https://github.com/css-modules/postcss-modules
  */
  modules?: CSSModulesOptions | false;
  /**
  * Options for preprocessors.
  *
  * In addition to options specific to each processors, Vite supports `additionalData` option.
  * The `additionalData` option can be used to inject extra code for each style content.
  */
  preprocessorOptions?: {
    scss?: SassPreprocessorOptions;
    sass?: SassPreprocessorOptions;
    less?: LessPreprocessorOptions;
    styl?: StylusPreprocessorOptions;
    stylus?: StylusPreprocessorOptions;
  };
  /**
  * If this option is set, preprocessors will run in workers when possible.
  * `true` means the number of CPUs minus 1.
  *
  * @default true
  */
  preprocessorMaxWorkers?: number | true;
  postcss?: string | (ProcessOptions & {
    plugins?: AcceptedPlugin[];
  });
  /**
  * Enables css sourcemaps during dev
  * @default false
  * @experimental
  */
  devSourcemap?: boolean;
  /**
  * @experimental
  */
  lightningcss?: LightningCSSOptions;
}
interface CSSModulesOptions {
  getJSON?: (cssFileName: string, json: Record<string, string>, outputFileName: string) => void;
  scopeBehaviour?: "global" | "local";
  globalModulePaths?: RegExp[];
  exportGlobals?: boolean;
  generateScopedName?: string | ((name: string, filename: string, css: string) => string);
  hashPrefix?: string;
  /**
  * default: undefined
  */
  localsConvention?: "camelCase" | "camelCaseOnly" | "dashes" | "dashesOnly" | ((originalClassName: string, generatedClassName: string, inputFile: string) => string);
}
type ResolvedCSSOptions = Omit<CSSOptions, "lightningcss"> & Required<Pick<CSSOptions, "transformer" | "devSourcemap">> & {
  lightningcss?: LightningCSSOptions;
};
type PreprocessorAdditionalDataResult = string | {
  content: string;
  map?: ExistingRawSourceMap;
};
type PreprocessorAdditionalData = string | ((source: string, filename: string) => PreprocessorAdditionalDataResult | Promise<PreprocessorAdditionalDataResult>);
type SassPreprocessorOptions = {
  additionalData?: PreprocessorAdditionalData;
} & SassModernPreprocessBaseOptions;
type LessPreprocessorOptions = {
  additionalData?: PreprocessorAdditionalData;
} & LessPreprocessorBaseOptions;
type StylusPreprocessorOptions = {
  additionalData?: PreprocessorAdditionalData;
} & StylusPreprocessorBaseOptions; //#endregion
//#region src/node/plugins/esbuild.d.ts
interface ESBuildOptions extends EsbuildTransformOptions {
  include?: string | RegExp | ReadonlyArray<string | RegExp>;
  exclude?: string | RegExp | ReadonlyArray<string | RegExp>;
  jsxInject?: string;
  /**
  * This option is not respected. Use `build.minify` instead.
  */
  minify?: never;
}
//#endregion
//#region src/node/plugins/json.d.ts
interface JsonOptions {
  /**
  * Generate a named export for every property of the JSON object
  * @default true
  */
  namedExports?: boolean;
  /**
  * Generate performant output as JSON.parse("stringified").
  *
  * When set to 'auto', the data will be stringified only if the data is bigger than 10kB.
  * @default 'auto'
  */
  stringify?: boolean | "auto";
} //#endregion
//#region src/node/ssr/index.d.ts
type SSRTarget = "node" | "webworker";
type SsrDepOptimizationConfig = DepOptimizationConfig;
interface SSROptions {
  noExternal?: string | RegExp | (string | RegExp)[] | true;
  external?: string[] | true;
  /**
  * Define the target for the ssr build. The browser field in package.json
  * is ignored for node but used if webworker is the target
  * This option will be removed in a future major version
  * @default 'node'
  */
  target?: SSRTarget;
  /**
  * Control over which dependencies are optimized during SSR and esbuild options
  * During build:
  *   no external CJS dependencies are optimized by default
  * During dev:
  *   explicit no external CJS dependencies are optimized by default
  * @experimental
  */
  optimizeDeps?: SsrDepOptimizationConfig;
  resolve?: {
    /**
    * Conditions that are used in the plugin pipeline. The default value is the root config's `resolve.conditions`.
    *
    * Use this to override the default ssr conditions for the ssr build.
    *
    * @default rootConfig.resolve.conditions
    */
    conditions?: string[];
    /**
    * Conditions that are used during ssr import (including `ssrLoadModule`) of externalized dependencies.
    *
    * @default ['node', 'module-sync']
    */
    externalConditions?: string[];
    mainFields?: string[];
  };
}
interface ResolvedSSROptions extends SSROptions {
  target: SSRTarget;
  optimizeDeps: SsrDepOptimizationConfig;
} //#endregion
//#region src/node/plugins/oxc.d.ts
interface OxcOptions extends Omit<TransformOptions$1, "cwd" | "sourceType" | "lang" | "sourcemap" | "helpers" | "inject" | "tsconfig" | "inputMap"> {
  include?: string | RegExp | ReadonlyArray<string | RegExp>;
  exclude?: string | RegExp | ReadonlyArray<string | RegExp>;
  jsxInject?: string;
  jsxRefreshInclude?: string | RegExp | ReadonlyArray<string | RegExp>;
  jsxRefreshExclude?: string | RegExp | ReadonlyArray<string | RegExp>;
}
//#endregion
//#region src/node/config.d.ts
interface ConfigEnv {
  /**
  * 'serve': during dev (`vite` command)
  * 'build': when building for production (`vite build` command)
  */
  command: "build" | "serve";
  mode: string;
  isSsrBuild?: boolean;
  isPreview?: boolean;
}
/**
* spa: include SPA fallback middleware and configure sirv with `single: true` in preview
*
* mpa: only include non-SPA HTML middlewares
*
* custom: don't include HTML middlewares
*/
type AppType = "spa" | "mpa" | "custom";
interface CreateDevEnvironmentContext {
  ws: WebSocketServer;
}
interface DevEnvironmentOptions {
  /**
  * Files to be pre-transformed. Supports glob patterns.
  */
  warmup?: string[];
  /**
  * Pre-transform known direct imports
  * defaults to true for the client environment, false for the rest
  */
  preTransformRequests?: boolean;
  /**
  * Enables sourcemaps during dev
  * @default { js: true }
  * @experimental
  */
  sourcemap?: boolean | {
    js?: boolean;
    css?: boolean;
  };
  /**
  * Whether or not to ignore-list source files in the dev server sourcemap, used to populate
  * the [`x_google_ignoreList` source map extension](https://developer.chrome.com/blog/devtools-better-angular-debugging/#the-x_google_ignorelist-source-map-extension).
  *
  * By default, it excludes all paths containing `node_modules`. You can pass `false` to
  * disable this behavior, or, for full control, a function that takes the source path and
  * sourcemap path and returns whether to ignore the source path.
  */
  sourcemapIgnoreList?: false | ((sourcePath: string, sourcemapPath: string) => boolean);
  /**
  * create the Dev Environment instance
  */
  createEnvironment?: (name: string, config: ResolvedConfig, context: CreateDevEnvironmentContext) => Promise<DevEnvironment> | DevEnvironment;
  /**
  * For environments that support a full-reload, like the client, we can short-circuit when
  * restarting the server throwing early to stop processing current files. We avoided this for
  * SSR requests. Maybe this is no longer needed.
  * @experimental
  */
  recoverable?: boolean;
  /**
  * For environments associated with a module runner.
  * By default, it is false for the client environment and true for non-client environments.
  * This option can also be used instead of the removed config.experimental.skipSsrTransform.
  */
  moduleRunnerTransform?: boolean;
}
type ResolvedDevEnvironmentOptions = Omit<Required<DevEnvironmentOptions>, "sourcemapIgnoreList"> & {
  sourcemapIgnoreList: Exclude<DevEnvironmentOptions["sourcemapIgnoreList"], false | undefined>;
};
type AllResolveOptions = ResolveOptions & {
  alias?: AliasOptions;
};
interface SharedEnvironmentOptions {
  /**
  * Define global variable replacements.
  * Entries will be defined on `window` during dev and replaced during build.
  */
  define?: Record<string, any>;
  /**
  * Configure resolver
  */
  resolve?: EnvironmentResolveOptions;
  /**
  * Define if this environment is used for Server-Side Rendering
  * @default 'server' if it isn't the client environment
  */
  consumer?: "client" | "server";
  /**
  * If true, `process.env` referenced in code will be preserved as-is and evaluated in runtime.
  * Otherwise, it is statically replaced as an empty object.
  */
  keepProcessEnv?: boolean;
  /**
  * Optimize deps config
  */
  optimizeDeps?: DepOptimizationOptions;
}
interface EnvironmentOptions extends SharedEnvironmentOptions {
  /**
  * Dev specific options
  */
  dev?: DevEnvironmentOptions;
  /**
  * Build specific options
  */
  build?: BuildEnvironmentOptions;
}
type ResolvedResolveOptions = Required<ResolveOptions>;
type ResolvedEnvironmentOptions = {
  define?: Record<string, any>;
  resolve: ResolvedResolveOptions;
  consumer: "client" | "server";
  keepProcessEnv?: boolean;
  optimizeDeps: DepOptimizationOptions;
  dev: ResolvedDevEnvironmentOptions;
  build: ResolvedBuildEnvironmentOptions;
  plugins: readonly Plugin[];
};
type DefaultEnvironmentOptions = Omit<EnvironmentOptions, "consumer" | "resolve" | "keepProcessEnv"> & {
  resolve?: AllResolveOptions;
};
interface UserConfig extends DefaultEnvironmentOptions {
  /**
  * Project root directory. Can be an absolute path, or a path relative from
  * the location of the config file itself.
  * @default process.cwd()
  */
  root?: string;
  /**
  * Base public path when served in development or production.
  * @default '/'
  */
  base?: string;
  /**
  * Directory to serve as plain static assets. Files in this directory are
  * served and copied to build dist dir as-is without transform. The value
  * can be either an absolute file system path or a path relative to project root.
  *
  * Set to `false` or an empty string to disable copied static assets to build dist dir.
  * @default 'public'
  */
  publicDir?: string | false;
  /**
  * Directory to save cache files. Files in this directory are pre-bundled
  * deps or some other cache files that generated by vite, which can improve
  * the performance. You can use `--force` flag or manually delete the directory
  * to regenerate the cache files. The value can be either an absolute file
  * system path or a path relative to project root.
  * Default to `.vite` when no `package.json` is detected.
  * @default 'node_modules/.vite'
  */
  cacheDir?: string;
  /**
  * Explicitly set a mode to run in. This will override the default mode for
  * each command, and can be overridden by the command line --mode option.
  */
  mode?: string;
  /**
  * Array of vite plugins to use.
  */
  plugins?: PluginOption[];
  /**
  * HTML related options
  */
  html?: HTMLOptions;
  /**
  * CSS related options (preprocessors and CSS modules)
  */
  css?: CSSOptions;
  /**
  * JSON loading options
  */
  json?: JsonOptions;
  /**
  * Transform options to pass to esbuild.
  * Or set to `false` to disable esbuild.
  *
  * @deprecated Use `oxc` option instead.
  */
  esbuild?: ESBuildOptions | false;
  /**
  * Transform options to pass to Oxc.
  * Or set to `false` to disable Oxc.
  */
  oxc?: OxcOptions | false;
  /**
  * Specify additional picomatch patterns to be treated as static assets.
  */
  assetsInclude?: string | RegExp | (string | RegExp)[];
  /**
  * Builder specific options
  * @experimental
  */
  builder?: BuilderOptions;
  /**
  * Server specific options, e.g. host, port, https...
  */
  server?: ServerOptions$1$1;
  /**
  * Preview specific options, e.g. host, port, https...
  */
  preview?: PreviewOptions;
  /**
  * Experimental features
  *
  * Features under this field could change in the future and might NOT follow semver.
  * Please be careful and always pin Vite's version when using them.
  * @experimental
  */
  experimental?: ExperimentalOptions;
  /**
  * Options to opt-in to future behavior
  */
  future?: FutureOptions | "warn";
  /**
  * Legacy options
  *
  * Features under this field only follow semver for patches, they could be removed in a
  * future minor version. Please always pin Vite's version to a minor when using them.
  */
  legacy?: LegacyOptions;
  /**
  * Log level.
  * @default 'info'
  */
  logLevel?: LogLevel;
  /**
  * Custom logger.
  */
  customLogger?: Logger;
  /**
  * @default true
  */
  clearScreen?: boolean;
  /**
  * Environment files directory. Can be an absolute path, or a path relative from
  * root.
  * @default root
  */
  envDir?: string | false;
  /**
  * Env variables starts with `envPrefix` will be exposed to your client source code via import.meta.env.
  * @default 'VITE_'
  */
  envPrefix?: string | string[];
  /**
  * Worker bundle options
  */
  worker?: {
    /**
    * Output format for worker bundle
    * @default 'iife'
    */
    format?: "es" | "iife";
    /**
    * Vite plugins that apply to worker bundle. The plugins returned by this function
    * should be new instances every time it is called, because they are used for each
    * rolldown worker bundling process.
    */
    plugins?: () => PluginOption[];
    /**
    * Alias to `rolldownOptions`.
    * @deprecated Use `rolldownOptions` instead.
    */
    rollupOptions?: Omit<RolldownOptions, "plugins" | "input" | "onwarn" | "preserveEntrySignatures">;
    /**
    * Rolldown options to build worker bundle
    */
    rolldownOptions?: Omit<RolldownOptions, "plugins" | "input" | "onwarn" | "preserveEntrySignatures">;
  };
  /**
  * Dep optimization options
  */
  optimizeDeps?: DepOptimizationOptions;
  /**
  * SSR specific options
  * We could make SSROptions be a EnvironmentOptions if we can abstract
  * external/noExternal for environments in general.
  */
  ssr?: SSROptions;
  /**
  * Environment overrides
  */
  environments?: Record<string, EnvironmentOptions>;
  /**
  * Whether your application is a Single Page Application (SPA),
  * a Multi-Page Application (MPA), or Custom Application (SSR
  * and frameworks with custom HTML handling)
  * @default 'spa'
  */
  appType?: AppType;
  /**
  * Enable devtools integration. Ensure that `@vitejs/devtools` is installed as a dependency.
  * This feature is currently supported only in build mode.
  * @experimental
  * @default false
  */
  devtools?: boolean | DevToolsConfig;
}
interface HTMLOptions {
  /**
  * A nonce value placeholder that will be used when generating script/style tags.
  *
  * Make sure that this placeholder will be replaced with a unique value for each request by the server.
  */
  cspNonce?: string;
}
interface FutureOptions {
  removePluginHookHandleHotUpdate?: "warn";
  removePluginHookSsrArgument?: "warn";
  removeServerModuleGraph?: "warn";
  removeServerReloadModule?: "warn";
  removeServerPluginContainer?: "warn";
  removeServerHot?: "warn";
  removeServerTransformRequest?: "warn";
  removeServerWarmupRequest?: "warn";
  removeSsrLoadModule?: "warn";
}
interface ExperimentalOptions {
  /**
  * Append fake `&lang.(ext)` when queries are specified, to preserve the file extension for following plugins to process.
  *
  * @experimental
  * @default false
  */
  importGlobRestoreExtension?: boolean;
  /**
  * Allow finegrain control over assets and public files paths
  *
  * @experimental
  */
  renderBuiltUrl?: RenderBuiltAssetUrl;
  /**
  * Enables support of HMR partial accept via `import.meta.hot.acceptExports`.
  *
  * @experimental
  * @default false
  */
  hmrPartialAccept?: boolean;
  /**
  * Enable full bundle mode.
  *
  * This is highly experimental.
  *
  * @experimental
  * @default false
  */
  bundledDev?: boolean;
}
interface LegacyOptions {
  /**
  * In Vite 6.0.8 and below, WebSocket server was able to connect from any web pages. However,
  * that could be exploited by a malicious web page.
  *
  * In Vite 6.0.9+, the WebSocket server now requires a token to connect from a web page.
  * But this may break some plugins and frameworks that connects to the WebSocket server
  * on their own. Enabling this option will make Vite skip the token check.
  *
  * **We do not recommend enabling this option unless you are sure that you are fine with
  * that security weakness.**
  */
  skipWebSocketTokenCheck?: boolean;
  /**
  * Opt-in to the pre-Vite 8 CJS interop behavior, which was inconsistent.
  *
  * In pre-Vite 8 versions, Vite had inconsistent CJS interop behavior. This was due to
  * the different behavior of esbuild and the Rollup commonjs plugin.
  * Vite 8+ uses Rolldown for both the dependency optimization in dev and the production build,
  * which aligns the behavior to esbuild.
  *
  * See the Vite 8 migration guide for more details.
  */
  inconsistentCjsInterop?: boolean;
}
interface ResolvedWorkerOptions {
  format: "es" | "iife";
  plugins: (bundleChain: string[]) => Promise<ResolvedConfig>;
  /**
  * @deprecated Use `rolldownOptions` instead.
  */
  rollupOptions: RolldownOptions;
  rolldownOptions: RolldownOptions;
}
interface InlineConfig extends UserConfig {
  configFile?: string | false;
  /** @experimental */
  configLoader?: "bundle" | "runner" | "native";
  /** @deprecated */
  envFile?: false;
  forceOptimizeDeps?: boolean;
}
interface ResolvedConfig extends Readonly<Omit<UserConfig, "plugins" | "css" | "json" | "assetsInclude" | "optimizeDeps" | "worker" | "build" | "dev" | "environments" | "experimental" | "future" | "server" | "preview" | "devtools"> & {
  configFile: string | undefined;
  configFileDependencies: string[];
  inlineConfig: InlineConfig;
  root: string;
  base: string;
  publicDir: string;
  cacheDir: string;
  command: "build" | "serve";
  mode: string; /** `true` when build or full-bundle mode dev */
  isBundled: boolean;
  isWorker: boolean;
  isProduction: boolean;
  envDir: string | false;
  env: Record<string, any>;
  resolve: Required<ResolveOptions> & {
    alias: Alias[];
  };
  plugins: readonly Plugin[];
  css: ResolvedCSSOptions;
  json: Required<JsonOptions>; /** @deprecated Use `oxc` option instead. */
  esbuild: ESBuildOptions | false;
  oxc: OxcOptions | false;
  server: ResolvedServerOptions;
  dev: ResolvedDevEnvironmentOptions; /** @experimental */
  builder: ResolvedBuilderOptions | undefined;
  build: ResolvedBuildOptions;
  devtools: ResolvedDevToolsConfig;
  preview: ResolvedPreviewOptions;
  ssr: ResolvedSSROptions;
  assetsInclude: (file: string) => boolean;
  rawAssetsInclude: (string | RegExp)[];
  logger: Logger;
  /**
  * Create an internal resolver to be used in special scenarios, e.g.
  * optimizer & handling css `@imports`.
  *
  * This API is deprecated. It only works for the client and ssr
  * environments. The `aliasOnly` option is also not being used anymore.
  * Plugins should move to `createIdResolver(environment.config)` instead.
  *
  * @deprecated Use `createIdResolver` from `vite` instead.
  */
  createResolver: (options?: Partial<InternalResolveOptions>) => ResolveFn;
  optimizeDeps: DepOptimizationOptions;
  worker: ResolvedWorkerOptions;
  appType: AppType;
  experimental: RequiredExceptFor<ExperimentalOptions, "renderBuiltUrl">;
  future: FutureOptions | undefined;
  environments: Record<string, ResolvedEnvironmentOptions>;
  /**
  * The token to connect to the WebSocket server from browsers.
  *
  * We recommend using `import.meta.hot` rather than connecting
  * to the WebSocket server directly.
  * If you have a usecase that requires connecting to the WebSocket
  * server, please create an issue so that we can discuss.
  *
  * @deprecated
  */
  webSocketToken: string;
} & PluginHookUtils> {}
interface PluginHookUtils {
  getSortedPlugins: <K extends keyof Plugin>(hookName: K) => PluginWithRequiredHook<K>[];
  getSortedPluginHooks: <K extends keyof Plugin>(hookName: K) => NonNullable<HookHandler<Plugin[K]>>[];
}
type ResolveFn = (id: string, importer?: string, aliasOnly?: boolean, ssr?: boolean) => Promise<string | undefined>;
//#endregion
//#region packages/repo-automation/src/build/dtsBundlePlugin.d.ts
interface DtsBundlePluginOptions {
  sourceDir: string;
  tempDir: string;
  outputFile: string;
  modulePrefix: string;
}
declare function dtsBundlePlugin(options: DtsBundlePluginOptions): Plugin;
//#endregion
//#region packages/repo-automation/src/build/buildBanner.d.ts
interface BuildBannerManifest {
  name: string;
  author: string;
  authorUrl: string;
  version: string;
}
interface BuildBannerOptions {
  manifestPath?: string;
  manifest?: BuildBannerManifest;
  fileSystem?: Pick<FileSystem, 'cwd' | 'resolve' | 'readTextSync'>;
}
declare function getBuildBanner(buildType: string, getVersion: (version: string) => string, options?: BuildBannerOptions): string;
//#endregion
export { type BuildBannerOptions, type DtsBundlePluginOptions, type RepoAutomationConfig, dtsBundlePlugin, getBuildBanner };