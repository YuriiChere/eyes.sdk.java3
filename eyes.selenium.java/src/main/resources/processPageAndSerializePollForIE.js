/* @applitools/dom-snapshot@3.2.1 */

function __processPageAndSerializePollForIE() {
  var processPageAndSerializePollForIE = (function () {
            'use strict';

            var global$1 = (typeof global !== "undefined" ? global :
                        typeof self !== "undefined" ? self :
                        typeof window !== "undefined" ? window : {});

            function createCommonjsModule(fn, module) {
            	return module = { exports: {} }, fn(module, module.exports), module.exports;
            }

            function getCjsExportFromNamespace (n) {
            	return n && n['default'] || n;
            }

            var check = function (it) {
              return it && it.Math == Math && it;
            };

            // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
            var global_1 =
              // eslint-disable-next-line no-undef
              check(typeof globalThis == 'object' && globalThis) ||
              check(typeof window == 'object' && window) ||
              check(typeof self == 'object' && self) ||
              check(typeof global$1 == 'object' && global$1) ||
              // eslint-disable-next-line no-new-func
              Function('return this')();

            var fails = function (exec) {
              try {
                return !!exec();
              } catch (error) {
                return true;
              }
            };

            // Thank's IE8 for his funny defineProperty
            var descriptors = !fails(function () {
              return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
            });

            var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
            var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

            // Nashorn ~ JDK8 bug
            var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

            // `Object.prototype.propertyIsEnumerable` method implementation
            // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
            var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
              var descriptor = getOwnPropertyDescriptor(this, V);
              return !!descriptor && descriptor.enumerable;
            } : nativePropertyIsEnumerable;

            var objectPropertyIsEnumerable = {
            	f: f
            };

            var createPropertyDescriptor = function (bitmap, value) {
              return {
                enumerable: !(bitmap & 1),
                configurable: !(bitmap & 2),
                writable: !(bitmap & 4),
                value: value
              };
            };

            var toString = {}.toString;

            var classofRaw = function (it) {
              return toString.call(it).slice(8, -1);
            };

            var split = ''.split;

            // fallback for non-array-like ES3 and non-enumerable old V8 strings
            var indexedObject = fails(function () {
              // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
              // eslint-disable-next-line no-prototype-builtins
              return !Object('z').propertyIsEnumerable(0);
            }) ? function (it) {
              return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
            } : Object;

            // `RequireObjectCoercible` abstract operation
            // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
            var requireObjectCoercible = function (it) {
              if (it == undefined) throw TypeError("Can't call method on " + it);
              return it;
            };

            // toObject with fallback for non-array-like ES3 strings



            var toIndexedObject = function (it) {
              return indexedObject(requireObjectCoercible(it));
            };

            var isObject = function (it) {
              return typeof it === 'object' ? it !== null : typeof it === 'function';
            };

            // `ToPrimitive` abstract operation
            // https://tc39.github.io/ecma262/#sec-toprimitive
            // instead of the ES6 spec version, we didn't implement @@toPrimitive case
            // and the second argument - flag - preferred type is a string
            var toPrimitive = function (input, PREFERRED_STRING) {
              if (!isObject(input)) return input;
              var fn, val;
              if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
              if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
              if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
              throw TypeError("Can't convert object to primitive value");
            };

            var hasOwnProperty = {}.hasOwnProperty;

            var has = function (it, key) {
              return hasOwnProperty.call(it, key);
            };

            var document$1 = global_1.document;
            // typeof document.createElement is 'object' in old IE
            var EXISTS = isObject(document$1) && isObject(document$1.createElement);

            var documentCreateElement = function (it) {
              return EXISTS ? document$1.createElement(it) : {};
            };

            // Thank's IE8 for his funny defineProperty
            var ie8DomDefine = !descriptors && !fails(function () {
              return Object.defineProperty(documentCreateElement('div'), 'a', {
                get: function () { return 7; }
              }).a != 7;
            });

            var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

            // `Object.getOwnPropertyDescriptor` method
            // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
            var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
              O = toIndexedObject(O);
              P = toPrimitive(P, true);
              if (ie8DomDefine) try {
                return nativeGetOwnPropertyDescriptor(O, P);
              } catch (error) { /* empty */ }
              if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
            };

            var objectGetOwnPropertyDescriptor = {
            	f: f$1
            };

            var anObject = function (it) {
              if (!isObject(it)) {
                throw TypeError(String(it) + ' is not an object');
              } return it;
            };

            var nativeDefineProperty = Object.defineProperty;

            // `Object.defineProperty` method
            // https://tc39.github.io/ecma262/#sec-object.defineproperty
            var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
              anObject(O);
              P = toPrimitive(P, true);
              anObject(Attributes);
              if (ie8DomDefine) try {
                return nativeDefineProperty(O, P, Attributes);
              } catch (error) { /* empty */ }
              if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
              if ('value' in Attributes) O[P] = Attributes.value;
              return O;
            };

            var objectDefineProperty = {
            	f: f$2
            };

            var createNonEnumerableProperty = descriptors ? function (object, key, value) {
              return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
            } : function (object, key, value) {
              object[key] = value;
              return object;
            };

            var setGlobal = function (key, value) {
              try {
                createNonEnumerableProperty(global_1, key, value);
              } catch (error) {
                global_1[key] = value;
              } return value;
            };

            var isPure = false;

            var SHARED = '__core-js_shared__';
            var store = global_1[SHARED] || setGlobal(SHARED, {});

            var sharedStore = store;

            var shared = createCommonjsModule(function (module) {
            (module.exports = function (key, value) {
              return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
            })('versions', []).push({
              version: '3.4.7',
              mode: 'global',
              copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
            });
            });

            var functionToString = Function.toString;

            var inspectSource = shared('inspectSource', function (it) {
              return functionToString.call(it);
            });

            var WeakMap$1 = global_1.WeakMap;

            var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

            var id = 0;
            var postfix = Math.random();

            var uid = function (key) {
              return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
            };

            var keys = shared('keys');

            var sharedKey = function (key) {
              return keys[key] || (keys[key] = uid(key));
            };

            var hiddenKeys = {};

            var WeakMap$2 = global_1.WeakMap;
            var set, get, has$1;

            var enforce = function (it) {
              return has$1(it) ? get(it) : set(it, {});
            };

            var getterFor = function (TYPE) {
              return function (it) {
                var state;
                if (!isObject(it) || (state = get(it)).type !== TYPE) {
                  throw TypeError('Incompatible receiver, ' + TYPE + ' required');
                } return state;
              };
            };

            if (nativeWeakMap) {
              var store$1 = new WeakMap$2();
              var wmget = store$1.get;
              var wmhas = store$1.has;
              var wmset = store$1.set;
              set = function (it, metadata) {
                wmset.call(store$1, it, metadata);
                return metadata;
              };
              get = function (it) {
                return wmget.call(store$1, it) || {};
              };
              has$1 = function (it) {
                return wmhas.call(store$1, it);
              };
            } else {
              var STATE = sharedKey('state');
              hiddenKeys[STATE] = true;
              set = function (it, metadata) {
                createNonEnumerableProperty(it, STATE, metadata);
                return metadata;
              };
              get = function (it) {
                return has(it, STATE) ? it[STATE] : {};
              };
              has$1 = function (it) {
                return has(it, STATE);
              };
            }

            var internalState = {
              set: set,
              get: get,
              has: has$1,
              enforce: enforce,
              getterFor: getterFor
            };

            var redefine = createCommonjsModule(function (module) {
            var getInternalState = internalState.get;
            var enforceInternalState = internalState.enforce;
            var TEMPLATE = String(String).split('String');

            (module.exports = function (O, key, value, options) {
              var unsafe = options ? !!options.unsafe : false;
              var simple = options ? !!options.enumerable : false;
              var noTargetGet = options ? !!options.noTargetGet : false;
              if (typeof value == 'function') {
                if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
                enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
              }
              if (O === global_1) {
                if (simple) O[key] = value;
                else setGlobal(key, value);
                return;
              } else if (!unsafe) {
                delete O[key];
              } else if (!noTargetGet && O[key]) {
                simple = true;
              }
              if (simple) O[key] = value;
              else createNonEnumerableProperty(O, key, value);
            // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
            })(Function.prototype, 'toString', function toString() {
              return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
            });
            });

            var path = global_1;

            var aFunction = function (variable) {
              return typeof variable == 'function' ? variable : undefined;
            };

            var getBuiltIn = function (namespace, method) {
              return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
                : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
            };

            var ceil = Math.ceil;
            var floor = Math.floor;

            // `ToInteger` abstract operation
            // https://tc39.github.io/ecma262/#sec-tointeger
            var toInteger = function (argument) {
              return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
            };

            var min = Math.min;

            // `ToLength` abstract operation
            // https://tc39.github.io/ecma262/#sec-tolength
            var toLength = function (argument) {
              return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
            };

            var max = Math.max;
            var min$1 = Math.min;

            // Helper for a popular repeating case of the spec:
            // Let integer be ? ToInteger(index).
            // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
            var toAbsoluteIndex = function (index, length) {
              var integer = toInteger(index);
              return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
            };

            // `Array.prototype.{ indexOf, includes }` methods implementation
            var createMethod = function (IS_INCLUDES) {
              return function ($this, el, fromIndex) {
                var O = toIndexedObject($this);
                var length = toLength(O.length);
                var index = toAbsoluteIndex(fromIndex, length);
                var value;
                // Array#includes uses SameValueZero equality algorithm
                // eslint-disable-next-line no-self-compare
                if (IS_INCLUDES && el != el) while (length > index) {
                  value = O[index++];
                  // eslint-disable-next-line no-self-compare
                  if (value != value) return true;
                // Array#indexOf ignores holes, Array#includes - not
                } else for (;length > index; index++) {
                  if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
                } return !IS_INCLUDES && -1;
              };
            };

            var arrayIncludes = {
              // `Array.prototype.includes` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.includes
              includes: createMethod(true),
              // `Array.prototype.indexOf` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
              indexOf: createMethod(false)
            };

            var indexOf = arrayIncludes.indexOf;


            var objectKeysInternal = function (object, names) {
              var O = toIndexedObject(object);
              var i = 0;
              var result = [];
              var key;
              for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
              // Don't enum bug & hidden keys
              while (names.length > i) if (has(O, key = names[i++])) {
                ~indexOf(result, key) || result.push(key);
              }
              return result;
            };

            // IE8- don't enum bug keys
            var enumBugKeys = [
              'constructor',
              'hasOwnProperty',
              'isPrototypeOf',
              'propertyIsEnumerable',
              'toLocaleString',
              'toString',
              'valueOf'
            ];

            var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

            // `Object.getOwnPropertyNames` method
            // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
            var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
              return objectKeysInternal(O, hiddenKeys$1);
            };

            var objectGetOwnPropertyNames = {
            	f: f$3
            };

            var f$4 = Object.getOwnPropertySymbols;

            var objectGetOwnPropertySymbols = {
            	f: f$4
            };

            // all object keys, includes non-enumerable and symbols
            var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
              var keys = objectGetOwnPropertyNames.f(anObject(it));
              var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
              return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
            };

            var copyConstructorProperties = function (target, source) {
              var keys = ownKeys(source);
              var defineProperty = objectDefineProperty.f;
              var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
              for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
              }
            };

            var replacement = /#|\.prototype\./;

            var isForced = function (feature, detection) {
              var value = data[normalize(feature)];
              return value == POLYFILL ? true
                : value == NATIVE ? false
                : typeof detection == 'function' ? fails(detection)
                : !!detection;
            };

            var normalize = isForced.normalize = function (string) {
              return String(string).replace(replacement, '.').toLowerCase();
            };

            var data = isForced.data = {};
            var NATIVE = isForced.NATIVE = 'N';
            var POLYFILL = isForced.POLYFILL = 'P';

            var isForced_1 = isForced;

            var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






            /*
              options.target      - name of the target object
              options.global      - target is the global object
              options.stat        - export as static methods of target
              options.proto       - export as prototype methods of target
              options.real        - real prototype method for the `pure` version
              options.forced      - export even if the native feature is available
              options.bind        - bind methods to the target, required for the `pure` version
              options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
              options.unsafe      - use the simple assignment of property instead of delete + defineProperty
              options.sham        - add a flag to not completely full polyfills
              options.enumerable  - export as enumerable property
              options.noTargetGet - prevent calling a getter on target
            */
            var _export = function (options, source) {
              var TARGET = options.target;
              var GLOBAL = options.global;
              var STATIC = options.stat;
              var FORCED, target, key, targetProperty, sourceProperty, descriptor;
              if (GLOBAL) {
                target = global_1;
              } else if (STATIC) {
                target = global_1[TARGET] || setGlobal(TARGET, {});
              } else {
                target = (global_1[TARGET] || {}).prototype;
              }
              if (target) for (key in source) {
                sourceProperty = source[key];
                if (options.noTargetGet) {
                  descriptor = getOwnPropertyDescriptor$1(target, key);
                  targetProperty = descriptor && descriptor.value;
                } else targetProperty = target[key];
                FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
                // contained in target
                if (!FORCED && targetProperty !== undefined) {
                  if (typeof sourceProperty === typeof targetProperty) continue;
                  copyConstructorProperties(sourceProperty, targetProperty);
                }
                // add a flag to not completely full polyfills
                if (options.sham || (targetProperty && targetProperty.sham)) {
                  createNonEnumerableProperty(sourceProperty, 'sham', true);
                }
                // extend global
                redefine(target, key, sourceProperty, options);
              }
            };

            var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
              // Chrome 38 Symbol has incorrect toString conversion
              // eslint-disable-next-line no-undef
              return !String(Symbol());
            });

            var useSymbolAsUid = nativeSymbol
              // eslint-disable-next-line no-undef
              && !Symbol.sham
              // eslint-disable-next-line no-undef
              && typeof Symbol() == 'symbol';

            // `IsArray` abstract operation
            // https://tc39.github.io/ecma262/#sec-isarray
            var isArray = Array.isArray || function isArray(arg) {
              return classofRaw(arg) == 'Array';
            };

            // `ToObject` abstract operation
            // https://tc39.github.io/ecma262/#sec-toobject
            var toObject = function (argument) {
              return Object(requireObjectCoercible(argument));
            };

            // `Object.keys` method
            // https://tc39.github.io/ecma262/#sec-object.keys
            var objectKeys = Object.keys || function keys(O) {
              return objectKeysInternal(O, enumBugKeys);
            };

            // `Object.defineProperties` method
            // https://tc39.github.io/ecma262/#sec-object.defineproperties
            var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
              anObject(O);
              var keys = objectKeys(Properties);
              var length = keys.length;
              var index = 0;
              var key;
              while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
              return O;
            };

            var html = getBuiltIn('document', 'documentElement');

            var IE_PROTO = sharedKey('IE_PROTO');

            var PROTOTYPE = 'prototype';
            var Empty = function () { /* empty */ };

            // Create object with fake `null` prototype: use iframe Object with cleared prototype
            var createDict = function () {
              // Thrash, waste and sodomy: IE GC bug
              var iframe = documentCreateElement('iframe');
              var length = enumBugKeys.length;
              var lt = '<';
              var script = 'script';
              var gt = '>';
              var js = 'java' + script + ':';
              var iframeDocument;
              iframe.style.display = 'none';
              html.appendChild(iframe);
              iframe.src = String(js);
              iframeDocument = iframe.contentWindow.document;
              iframeDocument.open();
              iframeDocument.write(lt + script + gt + 'document.F=Object' + lt + '/' + script + gt);
              iframeDocument.close();
              createDict = iframeDocument.F;
              while (length--) delete createDict[PROTOTYPE][enumBugKeys[length]];
              return createDict();
            };

            // `Object.create` method
            // https://tc39.github.io/ecma262/#sec-object.create
            var objectCreate = Object.create || function create(O, Properties) {
              var result;
              if (O !== null) {
                Empty[PROTOTYPE] = anObject(O);
                result = new Empty();
                Empty[PROTOTYPE] = null;
                // add "__proto__" for Object.getPrototypeOf polyfill
                result[IE_PROTO] = O;
              } else result = createDict();
              return Properties === undefined ? result : objectDefineProperties(result, Properties);
            };

            hiddenKeys[IE_PROTO] = true;

            var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

            var toString$1 = {}.toString;

            var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
              ? Object.getOwnPropertyNames(window) : [];

            var getWindowNames = function (it) {
              try {
                return nativeGetOwnPropertyNames(it);
              } catch (error) {
                return windowNames.slice();
              }
            };

            // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
            var f$5 = function getOwnPropertyNames(it) {
              return windowNames && toString$1.call(it) == '[object Window]'
                ? getWindowNames(it)
                : nativeGetOwnPropertyNames(toIndexedObject(it));
            };

            var objectGetOwnPropertyNamesExternal = {
            	f: f$5
            };

            var WellKnownSymbolsStore = shared('wks');
            var Symbol$1 = global_1.Symbol;
            var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : uid;

            var wellKnownSymbol = function (name) {
              if (!has(WellKnownSymbolsStore, name)) {
                if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
                else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
              } return WellKnownSymbolsStore[name];
            };

            var f$6 = wellKnownSymbol;

            var wrappedWellKnownSymbol = {
            	f: f$6
            };

            var defineProperty = objectDefineProperty.f;

            var defineWellKnownSymbol = function (NAME) {
              var Symbol = path.Symbol || (path.Symbol = {});
              if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
                value: wrappedWellKnownSymbol.f(NAME)
              });
            };

            var defineProperty$1 = objectDefineProperty.f;



            var TO_STRING_TAG = wellKnownSymbol('toStringTag');

            var setToStringTag = function (it, TAG, STATIC) {
              if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
                defineProperty$1(it, TO_STRING_TAG, { configurable: true, value: TAG });
              }
            };

            var aFunction$1 = function (it) {
              if (typeof it != 'function') {
                throw TypeError(String(it) + ' is not a function');
              } return it;
            };

            // optional / simple context binding
            var bindContext = function (fn, that, length) {
              aFunction$1(fn);
              if (that === undefined) return fn;
              switch (length) {
                case 0: return function () {
                  return fn.call(that);
                };
                case 1: return function (a) {
                  return fn.call(that, a);
                };
                case 2: return function (a, b) {
                  return fn.call(that, a, b);
                };
                case 3: return function (a, b, c) {
                  return fn.call(that, a, b, c);
                };
              }
              return function (/* ...args */) {
                return fn.apply(that, arguments);
              };
            };

            var SPECIES = wellKnownSymbol('species');

            // `ArraySpeciesCreate` abstract operation
            // https://tc39.github.io/ecma262/#sec-arrayspeciescreate
            var arraySpeciesCreate = function (originalArray, length) {
              var C;
              if (isArray(originalArray)) {
                C = originalArray.constructor;
                // cross-realm fallback
                if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
                else if (isObject(C)) {
                  C = C[SPECIES];
                  if (C === null) C = undefined;
                }
              } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
            };

            var push = [].push;

            // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
            var createMethod$1 = function (TYPE) {
              var IS_MAP = TYPE == 1;
              var IS_FILTER = TYPE == 2;
              var IS_SOME = TYPE == 3;
              var IS_EVERY = TYPE == 4;
              var IS_FIND_INDEX = TYPE == 6;
              var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
              return function ($this, callbackfn, that, specificCreate) {
                var O = toObject($this);
                var self = indexedObject(O);
                var boundFunction = bindContext(callbackfn, that, 3);
                var length = toLength(self.length);
                var index = 0;
                var create = specificCreate || arraySpeciesCreate;
                var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
                var value, result;
                for (;length > index; index++) if (NO_HOLES || index in self) {
                  value = self[index];
                  result = boundFunction(value, index, O);
                  if (TYPE) {
                    if (IS_MAP) target[index] = result; // map
                    else if (result) switch (TYPE) {
                      case 3: return true;              // some
                      case 5: return value;             // find
                      case 6: return index;             // findIndex
                      case 2: push.call(target, value); // filter
                    } else if (IS_EVERY) return false;  // every
                  }
                }
                return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
              };
            };

            var arrayIteration = {
              // `Array.prototype.forEach` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
              forEach: createMethod$1(0),
              // `Array.prototype.map` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.map
              map: createMethod$1(1),
              // `Array.prototype.filter` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.filter
              filter: createMethod$1(2),
              // `Array.prototype.some` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.some
              some: createMethod$1(3),
              // `Array.prototype.every` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.every
              every: createMethod$1(4),
              // `Array.prototype.find` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.find
              find: createMethod$1(5),
              // `Array.prototype.findIndex` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
              findIndex: createMethod$1(6)
            };

            var $forEach = arrayIteration.forEach;

            var HIDDEN = sharedKey('hidden');
            var SYMBOL = 'Symbol';
            var PROTOTYPE$1 = 'prototype';
            var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
            var setInternalState = internalState.set;
            var getInternalState = internalState.getterFor(SYMBOL);
            var ObjectPrototype = Object[PROTOTYPE$1];
            var $Symbol = global_1.Symbol;
            var $stringify = getBuiltIn('JSON', 'stringify');
            var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
            var nativeDefineProperty$1 = objectDefineProperty.f;
            var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
            var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
            var AllSymbols = shared('symbols');
            var ObjectPrototypeSymbols = shared('op-symbols');
            var StringToSymbolRegistry = shared('string-to-symbol-registry');
            var SymbolToStringRegistry = shared('symbol-to-string-registry');
            var WellKnownSymbolsStore$1 = shared('wks');
            var QObject = global_1.QObject;
            // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
            var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

            // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
            var setSymbolDescriptor = descriptors && fails(function () {
              return objectCreate(nativeDefineProperty$1({}, 'a', {
                get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
              })).a != 7;
            }) ? function (O, P, Attributes) {
              var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
              if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
              nativeDefineProperty$1(O, P, Attributes);
              if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
                nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
              }
            } : nativeDefineProperty$1;

            var wrap = function (tag, description) {
              var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
              setInternalState(symbol, {
                type: SYMBOL,
                tag: tag,
                description: description
              });
              if (!descriptors) symbol.description = description;
              return symbol;
            };

            var isSymbol = nativeSymbol && typeof $Symbol.iterator == 'symbol' ? function (it) {
              return typeof it == 'symbol';
            } : function (it) {
              return Object(it) instanceof $Symbol;
            };

            var $defineProperty = function defineProperty(O, P, Attributes) {
              if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
              anObject(O);
              var key = toPrimitive(P, true);
              anObject(Attributes);
              if (has(AllSymbols, key)) {
                if (!Attributes.enumerable) {
                  if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
                  O[HIDDEN][key] = true;
                } else {
                  if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
                  Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
                } return setSymbolDescriptor(O, key, Attributes);
              } return nativeDefineProperty$1(O, key, Attributes);
            };

            var $defineProperties = function defineProperties(O, Properties) {
              anObject(O);
              var properties = toIndexedObject(Properties);
              var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
              $forEach(keys, function (key) {
                if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
              });
              return O;
            };

            var $create = function create(O, Properties) {
              return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
            };

            var $propertyIsEnumerable = function propertyIsEnumerable(V) {
              var P = toPrimitive(V, true);
              var enumerable = nativePropertyIsEnumerable$1.call(this, P);
              if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
              return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
            };

            var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
              var it = toIndexedObject(O);
              var key = toPrimitive(P, true);
              if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
              var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
              if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
                descriptor.enumerable = true;
              }
              return descriptor;
            };

            var $getOwnPropertyNames = function getOwnPropertyNames(O) {
              var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
              var result = [];
              $forEach(names, function (key) {
                if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
              });
              return result;
            };

            var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
              var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
              var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
              var result = [];
              $forEach(names, function (key) {
                if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
                  result.push(AllSymbols[key]);
                }
              });
              return result;
            };

            // `Symbol` constructor
            // https://tc39.github.io/ecma262/#sec-symbol-constructor
            if (!nativeSymbol) {
              $Symbol = function Symbol() {
                if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
                var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
                var tag = uid(description);
                var setter = function (value) {
                  if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
                  if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
                  setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
                };
                if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
                return wrap(tag, description);
              };

              redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
                return getInternalState(this).tag;
              });

              objectPropertyIsEnumerable.f = $propertyIsEnumerable;
              objectDefineProperty.f = $defineProperty;
              objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
              objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
              objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

              if (descriptors) {
                // https://github.com/tc39/proposal-Symbol-description
                nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
                  configurable: true,
                  get: function description() {
                    return getInternalState(this).description;
                  }
                });
                if (!isPure) {
                  redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
                }
              }
            }

            if (!useSymbolAsUid) {
              wrappedWellKnownSymbol.f = function (name) {
                return wrap(wellKnownSymbol(name), name);
              };
            }

            _export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
              Symbol: $Symbol
            });

            $forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
              defineWellKnownSymbol(name);
            });

            _export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
              // `Symbol.for` method
              // https://tc39.github.io/ecma262/#sec-symbol.for
              'for': function (key) {
                var string = String(key);
                if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
                var symbol = $Symbol(string);
                StringToSymbolRegistry[string] = symbol;
                SymbolToStringRegistry[symbol] = string;
                return symbol;
              },
              // `Symbol.keyFor` method
              // https://tc39.github.io/ecma262/#sec-symbol.keyfor
              keyFor: function keyFor(sym) {
                if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
                if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
              },
              useSetter: function () { USE_SETTER = true; },
              useSimple: function () { USE_SETTER = false; }
            });

            _export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
              // `Object.create` method
              // https://tc39.github.io/ecma262/#sec-object.create
              create: $create,
              // `Object.defineProperty` method
              // https://tc39.github.io/ecma262/#sec-object.defineproperty
              defineProperty: $defineProperty,
              // `Object.defineProperties` method
              // https://tc39.github.io/ecma262/#sec-object.defineproperties
              defineProperties: $defineProperties,
              // `Object.getOwnPropertyDescriptor` method
              // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
              getOwnPropertyDescriptor: $getOwnPropertyDescriptor
            });

            _export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
              // `Object.getOwnPropertyNames` method
              // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
              getOwnPropertyNames: $getOwnPropertyNames,
              // `Object.getOwnPropertySymbols` method
              // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
              getOwnPropertySymbols: $getOwnPropertySymbols
            });

            // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
            // https://bugs.chromium.org/p/v8/issues/detail?id=3443
            _export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
              getOwnPropertySymbols: function getOwnPropertySymbols(it) {
                return objectGetOwnPropertySymbols.f(toObject(it));
              }
            });

            // `JSON.stringify` method behavior with symbols
            // https://tc39.github.io/ecma262/#sec-json.stringify
            if ($stringify) {
              var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
                var symbol = $Symbol();
                // MS Edge converts symbol values to JSON as {}
                return $stringify([symbol]) != '[null]'
                  // WebKit converts symbol values to JSON as null
                  || $stringify({ a: symbol }) != '{}'
                  // V8 throws on boxed symbols
                  || $stringify(Object(symbol)) != '{}';
              });

              _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
                // eslint-disable-next-line no-unused-vars
                stringify: function stringify(it, replacer, space) {
                  var args = [it];
                  var index = 1;
                  var $replacer;
                  while (arguments.length > index) args.push(arguments[index++]);
                  $replacer = replacer;
                  if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
                  if (!isArray(replacer)) replacer = function (key, value) {
                    if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
                    if (!isSymbol(value)) return value;
                  };
                  args[1] = replacer;
                  return $stringify.apply(null, args);
                }
              });
            }

            // `Symbol.prototype[@@toPrimitive]` method
            // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
            if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
              createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
            }
            // `Symbol.prototype[@@toStringTag]` property
            // https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
            setToStringTag($Symbol, SYMBOL);

            hiddenKeys[HIDDEN] = true;

            // `Symbol.asyncIterator` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.asynciterator
            defineWellKnownSymbol('asyncIterator');

            var defineProperty$2 = objectDefineProperty.f;


            var NativeSymbol = global_1.Symbol;

            if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
              // Safari 12 bug
              NativeSymbol().description !== undefined
            )) {
              var EmptyStringDescriptionStore = {};
              // wrap Symbol constructor for correct work with undefined description
              var SymbolWrapper = function Symbol() {
                var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
                var result = this instanceof SymbolWrapper
                  ? new NativeSymbol(description)
                  // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
                  : description === undefined ? NativeSymbol() : NativeSymbol(description);
                if (description === '') EmptyStringDescriptionStore[result] = true;
                return result;
              };
              copyConstructorProperties(SymbolWrapper, NativeSymbol);
              var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
              symbolPrototype.constructor = SymbolWrapper;

              var symbolToString = symbolPrototype.toString;
              var native = String(NativeSymbol('test')) == 'Symbol(test)';
              var regexp = /^Symbol\((.*)\)[^)]+$/;
              defineProperty$2(symbolPrototype, 'description', {
                configurable: true,
                get: function description() {
                  var symbol = isObject(this) ? this.valueOf() : this;
                  var string = symbolToString.call(symbol);
                  if (has(EmptyStringDescriptionStore, symbol)) return '';
                  var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
                  return desc === '' ? undefined : desc;
                }
              });

              _export({ global: true, forced: true }, {
                Symbol: SymbolWrapper
              });
            }

            // `Symbol.hasInstance` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.hasinstance
            defineWellKnownSymbol('hasInstance');

            // `Symbol.isConcatSpreadable` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
            defineWellKnownSymbol('isConcatSpreadable');

            // `Symbol.iterator` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.iterator
            defineWellKnownSymbol('iterator');

            // `Symbol.match` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.match
            defineWellKnownSymbol('match');

            // `Symbol.matchAll` well-known symbol
            defineWellKnownSymbol('matchAll');

            // `Symbol.replace` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.replace
            defineWellKnownSymbol('replace');

            // `Symbol.search` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.search
            defineWellKnownSymbol('search');

            // `Symbol.species` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.species
            defineWellKnownSymbol('species');

            // `Symbol.split` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.split
            defineWellKnownSymbol('split');

            // `Symbol.toPrimitive` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.toprimitive
            defineWellKnownSymbol('toPrimitive');

            // `Symbol.toStringTag` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.tostringtag
            defineWellKnownSymbol('toStringTag');

            // `Symbol.unscopables` well-known symbol
            // https://tc39.github.io/ecma262/#sec-symbol.unscopables
            defineWellKnownSymbol('unscopables');

            var nativeAssign = Object.assign;
            var defineProperty$3 = Object.defineProperty;

            // `Object.assign` method
            // https://tc39.github.io/ecma262/#sec-object.assign
            var objectAssign = !nativeAssign || fails(function () {
              // should have correct order of operations (Edge bug)
              if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$3({}, 'a', {
                enumerable: true,
                get: function () {
                  defineProperty$3(this, 'b', {
                    value: 3,
                    enumerable: false
                  });
                }
              }), { b: 2 })).b !== 1) return true;
              // should work with symbols and should have deterministic property order (V8 bug)
              var A = {};
              var B = {};
              // eslint-disable-next-line no-undef
              var symbol = Symbol();
              var alphabet = 'abcdefghijklmnopqrst';
              A[symbol] = 7;
              alphabet.split('').forEach(function (chr) { B[chr] = chr; });
              return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
            }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
              var T = toObject(target);
              var argumentsLength = arguments.length;
              var index = 1;
              var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
              var propertyIsEnumerable = objectPropertyIsEnumerable.f;
              while (argumentsLength > index) {
                var S = indexedObject(arguments[index++]);
                var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
                var length = keys.length;
                var j = 0;
                var key;
                while (length > j) {
                  key = keys[j++];
                  if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
                }
              } return T;
            } : nativeAssign;

            // `Object.assign` method
            // https://tc39.github.io/ecma262/#sec-object.assign
            _export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
              assign: objectAssign
            });

            // `Object.create` method
            // https://tc39.github.io/ecma262/#sec-object.create
            _export({ target: 'Object', stat: true, sham: !descriptors }, {
              create: objectCreate
            });

            // `Object.defineProperty` method
            // https://tc39.github.io/ecma262/#sec-object.defineproperty
            _export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
              defineProperty: objectDefineProperty.f
            });

            // `Object.defineProperties` method
            // https://tc39.github.io/ecma262/#sec-object.defineproperties
            _export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
              defineProperties: objectDefineProperties
            });

            var propertyIsEnumerable = objectPropertyIsEnumerable.f;

            // `Object.{ entries, values }` methods implementation
            var createMethod$2 = function (TO_ENTRIES) {
              return function (it) {
                var O = toIndexedObject(it);
                var keys = objectKeys(O);
                var length = keys.length;
                var i = 0;
                var result = [];
                var key;
                while (length > i) {
                  key = keys[i++];
                  if (!descriptors || propertyIsEnumerable.call(O, key)) {
                    result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
                  }
                }
                return result;
              };
            };

            var objectToArray = {
              // `Object.entries` method
              // https://tc39.github.io/ecma262/#sec-object.entries
              entries: createMethod$2(true),
              // `Object.values` method
              // https://tc39.github.io/ecma262/#sec-object.values
              values: createMethod$2(false)
            };

            var $entries = objectToArray.entries;

            // `Object.entries` method
            // https://tc39.github.io/ecma262/#sec-object.entries
            _export({ target: 'Object', stat: true }, {
              entries: function entries(O) {
                return $entries(O);
              }
            });

            var freezing = !fails(function () {
              return Object.isExtensible(Object.preventExtensions({}));
            });

            var internalMetadata = createCommonjsModule(function (module) {
            var defineProperty = objectDefineProperty.f;



            var METADATA = uid('meta');
            var id = 0;

            var isExtensible = Object.isExtensible || function () {
              return true;
            };

            var setMetadata = function (it) {
              defineProperty(it, METADATA, { value: {
                objectID: 'O' + ++id, // object ID
                weakData: {}          // weak collections IDs
              } });
            };

            var fastKey = function (it, create) {
              // return a primitive with prefix
              if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
              if (!has(it, METADATA)) {
                // can't set metadata to uncaught frozen object
                if (!isExtensible(it)) return 'F';
                // not necessary to add metadata
                if (!create) return 'E';
                // add missing metadata
                setMetadata(it);
              // return object ID
              } return it[METADATA].objectID;
            };

            var getWeakData = function (it, create) {
              if (!has(it, METADATA)) {
                // can't set metadata to uncaught frozen object
                if (!isExtensible(it)) return true;
                // not necessary to add metadata
                if (!create) return false;
                // add missing metadata
                setMetadata(it);
              // return the store of weak collections IDs
              } return it[METADATA].weakData;
            };

            // add metadata on freeze-family methods calling
            var onFreeze = function (it) {
              if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
              return it;
            };

            var meta = module.exports = {
              REQUIRED: false,
              fastKey: fastKey,
              getWeakData: getWeakData,
              onFreeze: onFreeze
            };

            hiddenKeys[METADATA] = true;
            });
            var internalMetadata_1 = internalMetadata.REQUIRED;
            var internalMetadata_2 = internalMetadata.fastKey;
            var internalMetadata_3 = internalMetadata.getWeakData;
            var internalMetadata_4 = internalMetadata.onFreeze;

            var onFreeze = internalMetadata.onFreeze;

            var nativeFreeze = Object.freeze;
            var FAILS_ON_PRIMITIVES = fails(function () { nativeFreeze(1); });

            // `Object.freeze` method
            // https://tc39.github.io/ecma262/#sec-object.freeze
            _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !freezing }, {
              freeze: function freeze(it) {
                return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
              }
            });

            var iterators = {};

            var ITERATOR = wellKnownSymbol('iterator');
            var ArrayPrototype = Array.prototype;

            // check on default Array iterator
            var isArrayIteratorMethod = function (it) {
              return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
            };

            var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
            var test = {};

            test[TO_STRING_TAG$1] = 'z';

            var toStringTagSupport = String(test) === '[object z]';

            var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
            // ES3 wrong here
            var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

            // fallback for IE11 Script Access Denied error
            var tryGet = function (it, key) {
              try {
                return it[key];
              } catch (error) { /* empty */ }
            };

            // getting tag from ES6+ `Object.prototype.toString`
            var classof = toStringTagSupport ? classofRaw : function (it) {
              var O, tag, result;
              return it === undefined ? 'Undefined' : it === null ? 'Null'
                // @@toStringTag case
                : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
                // builtinTag case
                : CORRECT_ARGUMENTS ? classofRaw(O)
                // ES3 arguments fallback
                : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
            };

            var ITERATOR$1 = wellKnownSymbol('iterator');

            var getIteratorMethod = function (it) {
              if (it != undefined) return it[ITERATOR$1]
                || it['@@iterator']
                || iterators[classof(it)];
            };

            // call something on iterator step with safe closing on error
            var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
              try {
                return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
              // 7.4.6 IteratorClose(iterator, completion)
              } catch (error) {
                var returnMethod = iterator['return'];
                if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
                throw error;
              }
            };

            var iterate_1 = createCommonjsModule(function (module) {
            var Result = function (stopped, result) {
              this.stopped = stopped;
              this.result = result;
            };

            var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
              var boundFunction = bindContext(fn, that, AS_ENTRIES ? 2 : 1);
              var iterator, iterFn, index, length, result, next, step;

              if (IS_ITERATOR) {
                iterator = iterable;
              } else {
                iterFn = getIteratorMethod(iterable);
                if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
                // optimisation for array iterators
                if (isArrayIteratorMethod(iterFn)) {
                  for (index = 0, length = toLength(iterable.length); length > index; index++) {
                    result = AS_ENTRIES
                      ? boundFunction(anObject(step = iterable[index])[0], step[1])
                      : boundFunction(iterable[index]);
                    if (result && result instanceof Result) return result;
                  } return new Result(false);
                }
                iterator = iterFn.call(iterable);
              }

              next = iterator.next;
              while (!(step = next.call(iterator)).done) {
                result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
                if (typeof result == 'object' && result && result instanceof Result) return result;
              } return new Result(false);
            };

            iterate.stop = function (result) {
              return new Result(true, result);
            };
            });

            var createProperty = function (object, key, value) {
              var propertyKey = toPrimitive(key);
              if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
              else object[propertyKey] = value;
            };

            // `Object.fromEntries` method
            // https://github.com/tc39/proposal-object-from-entries
            _export({ target: 'Object', stat: true }, {
              fromEntries: function fromEntries(iterable) {
                var obj = {};
                iterate_1(iterable, function (k, v) {
                  createProperty(obj, k, v);
                }, undefined, true);
                return obj;
              }
            });

            var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;


            var FAILS_ON_PRIMITIVES$1 = fails(function () { nativeGetOwnPropertyDescriptor$2(1); });
            var FORCED = !descriptors || FAILS_ON_PRIMITIVES$1;

            // `Object.getOwnPropertyDescriptor` method
            // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
            _export({ target: 'Object', stat: true, forced: FORCED, sham: !descriptors }, {
              getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
                return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
              }
            });

            // `Object.getOwnPropertyDescriptors` method
            // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
            _export({ target: 'Object', stat: true, sham: !descriptors }, {
              getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
                var O = toIndexedObject(object);
                var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
                var keys = ownKeys(O);
                var result = {};
                var index = 0;
                var key, descriptor;
                while (keys.length > index) {
                  descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
                  if (descriptor !== undefined) createProperty(result, key, descriptor);
                }
                return result;
              }
            });

            var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

            var FAILS_ON_PRIMITIVES$2 = fails(function () { return !Object.getOwnPropertyNames(1); });

            // `Object.getOwnPropertyNames` method
            // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
            _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
              getOwnPropertyNames: nativeGetOwnPropertyNames$2
            });

            var correctPrototypeGetter = !fails(function () {
              function F() { /* empty */ }
              F.prototype.constructor = null;
              return Object.getPrototypeOf(new F()) !== F.prototype;
            });

            var IE_PROTO$1 = sharedKey('IE_PROTO');
            var ObjectPrototype$1 = Object.prototype;

            // `Object.getPrototypeOf` method
            // https://tc39.github.io/ecma262/#sec-object.getprototypeof
            var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
              O = toObject(O);
              if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
              if (typeof O.constructor == 'function' && O instanceof O.constructor) {
                return O.constructor.prototype;
              } return O instanceof Object ? ObjectPrototype$1 : null;
            };

            var FAILS_ON_PRIMITIVES$3 = fails(function () { objectGetPrototypeOf(1); });

            // `Object.getPrototypeOf` method
            // https://tc39.github.io/ecma262/#sec-object.getprototypeof
            _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3, sham: !correctPrototypeGetter }, {
              getPrototypeOf: function getPrototypeOf(it) {
                return objectGetPrototypeOf(toObject(it));
              }
            });

            // `SameValue` abstract operation
            // https://tc39.github.io/ecma262/#sec-samevalue
            var sameValue = Object.is || function is(x, y) {
              // eslint-disable-next-line no-self-compare
              return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
            };

            // `Object.is` method
            // https://tc39.github.io/ecma262/#sec-object.is
            _export({ target: 'Object', stat: true }, {
              is: sameValue
            });

            var nativeIsExtensible = Object.isExtensible;
            var FAILS_ON_PRIMITIVES$4 = fails(function () { });

            // `Object.isExtensible` method
            // https://tc39.github.io/ecma262/#sec-object.isextensible
            _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 }, {
              isExtensible: function isExtensible(it) {
                return isObject(it) ? nativeIsExtensible ? nativeIsExtensible(it) : true : false;
              }
            });

            var nativeIsFrozen = Object.isFrozen;
            var FAILS_ON_PRIMITIVES$5 = fails(function () { });

            // `Object.isFrozen` method
            // https://tc39.github.io/ecma262/#sec-object.isfrozen
            _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5 }, {
              isFrozen: function isFrozen(it) {
                return isObject(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
              }
            });

            var nativeIsSealed = Object.isSealed;
            var FAILS_ON_PRIMITIVES$6 = fails(function () { });

            // `Object.isSealed` method
            // https://tc39.github.io/ecma262/#sec-object.issealed
            _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$6 }, {
              isSealed: function isSealed(it) {
                return isObject(it) ? nativeIsSealed ? nativeIsSealed(it) : false : true;
              }
            });

            var FAILS_ON_PRIMITIVES$7 = fails(function () { objectKeys(1); });

            // `Object.keys` method
            // https://tc39.github.io/ecma262/#sec-object.keys
            _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$7 }, {
              keys: function keys(it) {
                return objectKeys(toObject(it));
              }
            });

            var onFreeze$1 = internalMetadata.onFreeze;



            var nativePreventExtensions = Object.preventExtensions;
            var FAILS_ON_PRIMITIVES$8 = fails(function () { nativePreventExtensions(1); });

            // `Object.preventExtensions` method
            // https://tc39.github.io/ecma262/#sec-object.preventextensions
            _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$8, sham: !freezing }, {
              preventExtensions: function preventExtensions(it) {
                return nativePreventExtensions && isObject(it) ? nativePreventExtensions(onFreeze$1(it)) : it;
              }
            });

            var onFreeze$2 = internalMetadata.onFreeze;



            var nativeSeal = Object.seal;
            var FAILS_ON_PRIMITIVES$9 = fails(function () { nativeSeal(1); });

            // `Object.seal` method
            // https://tc39.github.io/ecma262/#sec-object.seal
            _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$9, sham: !freezing }, {
              seal: function seal(it) {
                return nativeSeal && isObject(it) ? nativeSeal(onFreeze$2(it)) : it;
              }
            });

            var aPossiblePrototype = function (it) {
              if (!isObject(it) && it !== null) {
                throw TypeError("Can't set " + String(it) + ' as a prototype');
              } return it;
            };

            // `Object.setPrototypeOf` method
            // https://tc39.github.io/ecma262/#sec-object.setprototypeof
            // Works with __proto__ only. Old v8 can't work with null proto objects.
            /* eslint-disable no-proto */
            var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
              var CORRECT_SETTER = false;
              var test = {};
              var setter;
              try {
                setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
                setter.call(test, []);
                CORRECT_SETTER = test instanceof Array;
              } catch (error) { /* empty */ }
              return function setPrototypeOf(O, proto) {
                anObject(O);
                aPossiblePrototype(proto);
                if (CORRECT_SETTER) setter.call(O, proto);
                else O.__proto__ = proto;
                return O;
              };
            }() : undefined);

            // `Object.setPrototypeOf` method
            // https://tc39.github.io/ecma262/#sec-object.setprototypeof
            _export({ target: 'Object', stat: true }, {
              setPrototypeOf: objectSetPrototypeOf
            });

            var $values = objectToArray.values;

            // `Object.values` method
            // https://tc39.github.io/ecma262/#sec-object.values
            _export({ target: 'Object', stat: true }, {
              values: function values(O) {
                return $values(O);
              }
            });

            // `Object.prototype.toString` method implementation
            // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
            var objectToString = toStringTagSupport ? {}.toString : function toString() {
              return '[object ' + classof(this) + ']';
            };

            // `Object.prototype.toString` method
            // https://tc39.github.io/ecma262/#sec-object.prototype.tostring
            if (!toStringTagSupport) {
              redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
            }

            // Forced replacement object prototype accessors methods
            var forcedObjectPrototypeAccessorsMethods = isPure || !fails(function () {
              var key = Math.random();
              // In FF throws only define methods
              // eslint-disable-next-line no-undef, no-useless-call
              __defineSetter__.call(null, key, function () { /* empty */ });
              delete global_1[key];
            });

            // `Object.prototype.__defineGetter__` method
            // https://tc39.github.io/ecma262/#sec-object.prototype.__defineGetter__
            if (descriptors) {
              _export({ target: 'Object', proto: true, forced: forcedObjectPrototypeAccessorsMethods }, {
                __defineGetter__: function __defineGetter__(P, getter) {
                  objectDefineProperty.f(toObject(this), P, { get: aFunction$1(getter), enumerable: true, configurable: true });
                }
              });
            }

            // `Object.prototype.__defineSetter__` method
            // https://tc39.github.io/ecma262/#sec-object.prototype.__defineSetter__
            if (descriptors) {
              _export({ target: 'Object', proto: true, forced: forcedObjectPrototypeAccessorsMethods }, {
                __defineSetter__: function __defineSetter__(P, setter) {
                  objectDefineProperty.f(toObject(this), P, { set: aFunction$1(setter), enumerable: true, configurable: true });
                }
              });
            }

            var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;

            // `Object.prototype.__lookupGetter__` method
            // https://tc39.github.io/ecma262/#sec-object.prototype.__lookupGetter__
            if (descriptors) {
              _export({ target: 'Object', proto: true, forced: forcedObjectPrototypeAccessorsMethods }, {
                __lookupGetter__: function __lookupGetter__(P) {
                  var O = toObject(this);
                  var key = toPrimitive(P, true);
                  var desc;
                  do {
                    if (desc = getOwnPropertyDescriptor$2(O, key)) return desc.get;
                  } while (O = objectGetPrototypeOf(O));
                }
              });
            }

            var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;

            // `Object.prototype.__lookupSetter__` method
            // https://tc39.github.io/ecma262/#sec-object.prototype.__lookupSetter__
            if (descriptors) {
              _export({ target: 'Object', proto: true, forced: forcedObjectPrototypeAccessorsMethods }, {
                __lookupSetter__: function __lookupSetter__(P) {
                  var O = toObject(this);
                  var key = toPrimitive(P, true);
                  var desc;
                  do {
                    if (desc = getOwnPropertyDescriptor$3(O, key)) return desc.set;
                  } while (O = objectGetPrototypeOf(O));
                }
              });
            }

            var slice = [].slice;
            var factories = {};

            var construct = function (C, argsLength, args) {
              if (!(argsLength in factories)) {
                for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
                // eslint-disable-next-line no-new-func
                factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
              } return factories[argsLength](C, args);
            };

            // `Function.prototype.bind` method implementation
            // https://tc39.github.io/ecma262/#sec-function.prototype.bind
            var functionBind = Function.bind || function bind(that /* , ...args */) {
              var fn = aFunction$1(this);
              var partArgs = slice.call(arguments, 1);
              var boundFunction = function bound(/* args... */) {
                var args = partArgs.concat(slice.call(arguments));
                return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
              };
              if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
              return boundFunction;
            };

            // `Function.prototype.bind` method
            // https://tc39.github.io/ecma262/#sec-function.prototype.bind
            _export({ target: 'Function', proto: true }, {
              bind: functionBind
            });

            var defineProperty$4 = objectDefineProperty.f;

            var FunctionPrototype = Function.prototype;
            var FunctionPrototypeToString = FunctionPrototype.toString;
            var nameRE = /^\s*function ([^ (]*)/;
            var NAME = 'name';

            // Function instances `.name` property
            // https://tc39.github.io/ecma262/#sec-function-instances-name
            if (descriptors && !(NAME in FunctionPrototype)) {
              defineProperty$4(FunctionPrototype, NAME, {
                configurable: true,
                get: function () {
                  try {
                    return FunctionPrototypeToString.call(this).match(nameRE)[1];
                  } catch (error) {
                    return '';
                  }
                }
              });
            }

            var HAS_INSTANCE = wellKnownSymbol('hasInstance');
            var FunctionPrototype$1 = Function.prototype;

            // `Function.prototype[@@hasInstance]` method
            // https://tc39.github.io/ecma262/#sec-function.prototype-@@hasinstance
            if (!(HAS_INSTANCE in FunctionPrototype$1)) {
              objectDefineProperty.f(FunctionPrototype$1, HAS_INSTANCE, { value: function (O) {
                if (typeof this != 'function' || !isObject(O)) return false;
                if (!isObject(this.prototype)) return O instanceof this;
                // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
                while (O = objectGetPrototypeOf(O)) if (this.prototype === O) return true;
                return false;
              } });
            }

            // `globalThis` object
            // https://github.com/tc39/proposal-global
            _export({ global: true }, {
              globalThis: global_1
            });

            // `Array.from` method implementation
            // https://tc39.github.io/ecma262/#sec-array.from
            var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
              var O = toObject(arrayLike);
              var C = typeof this == 'function' ? this : Array;
              var argumentsLength = arguments.length;
              var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
              var mapping = mapfn !== undefined;
              var index = 0;
              var iteratorMethod = getIteratorMethod(O);
              var length, result, step, iterator, next;
              if (mapping) mapfn = bindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
              // if the target is not iterable or it's an array with the default iterator - use a simple case
              if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
                iterator = iteratorMethod.call(O);
                next = iterator.next;
                result = new C();
                for (;!(step = next.call(iterator)).done; index++) {
                  createProperty(result, index, mapping
                    ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
                    : step.value
                  );
                }
              } else {
                length = toLength(O.length);
                result = new C(length);
                for (;length > index; index++) {
                  createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
                }
              }
              result.length = index;
              return result;
            };

            var ITERATOR$2 = wellKnownSymbol('iterator');
            var SAFE_CLOSING = false;

            var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
              if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
              var ITERATION_SUPPORT = false;
              try {
                var object = {};
                object[ITERATOR$2] = function () {
                  return {
                    next: function () {
                      return { done: ITERATION_SUPPORT = true };
                    }
                  };
                };
                exec(object);
              } catch (error) { /* empty */ }
              return ITERATION_SUPPORT;
            };

            var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
            });

            // `Array.from` method
            // https://tc39.github.io/ecma262/#sec-array.from
            _export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
              from: arrayFrom
            });

            // `Array.isArray` method
            // https://tc39.github.io/ecma262/#sec-array.isarray
            _export({ target: 'Array', stat: true }, {
              isArray: isArray
            });

            var ISNT_GENERIC = fails(function () {
              function F() { /* empty */ }
              return !(Array.of.call(F) instanceof F);
            });

            // `Array.of` method
            // https://tc39.github.io/ecma262/#sec-array.of
            // WebKit Array.of isn't generic
            _export({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
              of: function of(/* ...args */) {
                var index = 0;
                var argumentsLength = arguments.length;
                var result = new (typeof this == 'function' ? this : Array)(argumentsLength);
                while (argumentsLength > index) createProperty(result, index, arguments[index++]);
                result.length = argumentsLength;
                return result;
              }
            });

            var userAgent = getBuiltIn('navigator', 'userAgent') || '';

            var process = global_1.process;
            var versions = process && process.versions;
            var v8 = versions && versions.v8;
            var match, version;

            if (v8) {
              match = v8.split('.');
              version = match[0] + match[1];
            } else if (userAgent) {
              match = userAgent.match(/Edge\/(\d+)/);
              if (!match || match[1] >= 74) {
                match = userAgent.match(/Chrome\/(\d+)/);
                if (match) version = match[1];
              }
            }

            var v8Version = version && +version;

            var SPECIES$1 = wellKnownSymbol('species');

            var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
              // We can't use this feature detection in V8 since it causes
              // deoptimization and serious performance degradation
              // https://github.com/zloirock/core-js/issues/677
              return v8Version >= 51 || !fails(function () {
                var array = [];
                var constructor = array.constructor = {};
                constructor[SPECIES$1] = function () {
                  return { foo: 1 };
                };
                return array[METHOD_NAME](Boolean).foo !== 1;
              });
            };

            var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
            var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
            var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

            // We can't use this feature detection in V8 since it causes
            // deoptimization and serious performance degradation
            // https://github.com/zloirock/core-js/issues/679
            var IS_CONCAT_SPREADABLE_SUPPORT = v8Version >= 51 || !fails(function () {
              var array = [];
              array[IS_CONCAT_SPREADABLE] = false;
              return array.concat()[0] !== array;
            });

            var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

            var isConcatSpreadable = function (O) {
              if (!isObject(O)) return false;
              var spreadable = O[IS_CONCAT_SPREADABLE];
              return spreadable !== undefined ? !!spreadable : isArray(O);
            };

            var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

            // `Array.prototype.concat` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.concat
            // with adding support of @@isConcatSpreadable and @@species
            _export({ target: 'Array', proto: true, forced: FORCED$1 }, {
              concat: function concat(arg) { // eslint-disable-line no-unused-vars
                var O = toObject(this);
                var A = arraySpeciesCreate(O, 0);
                var n = 0;
                var i, k, length, len, E;
                for (i = -1, length = arguments.length; i < length; i++) {
                  E = i === -1 ? O : arguments[i];
                  if (isConcatSpreadable(E)) {
                    len = toLength(E.length);
                    if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                    for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
                  } else {
                    if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
                    createProperty(A, n++, E);
                  }
                }
                A.length = n;
                return A;
              }
            });

            var min$2 = Math.min;

            // `Array.prototype.copyWithin` method implementation
            // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
            var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
              var O = toObject(this);
              var len = toLength(O.length);
              var to = toAbsoluteIndex(target, len);
              var from = toAbsoluteIndex(start, len);
              var end = arguments.length > 2 ? arguments[2] : undefined;
              var count = min$2((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
              var inc = 1;
              if (from < to && to < from + count) {
                inc = -1;
                from += count - 1;
                to += count - 1;
              }
              while (count-- > 0) {
                if (from in O) O[to] = O[from];
                else delete O[to];
                to += inc;
                from += inc;
              } return O;
            };

            var UNSCOPABLES = wellKnownSymbol('unscopables');
            var ArrayPrototype$1 = Array.prototype;

            // Array.prototype[@@unscopables]
            // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
            if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
              createNonEnumerableProperty(ArrayPrototype$1, UNSCOPABLES, objectCreate(null));
            }

            // add a key to Array.prototype[@@unscopables]
            var addToUnscopables = function (key) {
              ArrayPrototype$1[UNSCOPABLES][key] = true;
            };

            // `Array.prototype.copyWithin` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
            _export({ target: 'Array', proto: true }, {
              copyWithin: arrayCopyWithin
            });

            // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
            addToUnscopables('copyWithin');

            var sloppyArrayMethod = function (METHOD_NAME, argument) {
              var method = [][METHOD_NAME];
              return !method || !fails(function () {
                // eslint-disable-next-line no-useless-call,no-throw-literal
                method.call(null, argument || function () { throw 1; }, 1);
              });
            };

            var $every = arrayIteration.every;


            // `Array.prototype.every` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.every
            _export({ target: 'Array', proto: true, forced: sloppyArrayMethod('every') }, {
              every: function every(callbackfn /* , thisArg */) {
                return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            // `Array.prototype.fill` method implementation
            // https://tc39.github.io/ecma262/#sec-array.prototype.fill
            var arrayFill = function fill(value /* , start = 0, end = @length */) {
              var O = toObject(this);
              var length = toLength(O.length);
              var argumentsLength = arguments.length;
              var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
              var end = argumentsLength > 2 ? arguments[2] : undefined;
              var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
              while (endPos > index) O[index++] = value;
              return O;
            };

            // `Array.prototype.fill` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.fill
            _export({ target: 'Array', proto: true }, {
              fill: arrayFill
            });

            // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
            addToUnscopables('fill');

            var $filter = arrayIteration.filter;



            var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
            // Edge 14- issue
            var USES_TO_LENGTH = HAS_SPECIES_SUPPORT && !fails(function () {
              [].filter.call({ length: -1, 0: 1 }, function (it) { throw it; });
            });

            // `Array.prototype.filter` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.filter
            // with adding support of @@species
            _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
              filter: function filter(callbackfn /* , thisArg */) {
                return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            var $find = arrayIteration.find;


            var FIND = 'find';
            var SKIPS_HOLES = true;

            // Shouldn't skip holes
            if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

            // `Array.prototype.find` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.find
            _export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
              find: function find(callbackfn /* , that = undefined */) {
                return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
            addToUnscopables(FIND);

            var $findIndex = arrayIteration.findIndex;


            var FIND_INDEX = 'findIndex';
            var SKIPS_HOLES$1 = true;

            // Shouldn't skip holes
            if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES$1 = false; });

            // `Array.prototype.findIndex` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.findindex
            _export({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
              findIndex: function findIndex(callbackfn /* , that = undefined */) {
                return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
            addToUnscopables(FIND_INDEX);

            // `FlattenIntoArray` abstract operation
            // https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
            var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
              var targetIndex = start;
              var sourceIndex = 0;
              var mapFn = mapper ? bindContext(mapper, thisArg, 3) : false;
              var element;

              while (sourceIndex < sourceLen) {
                if (sourceIndex in source) {
                  element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

                  if (depth > 0 && isArray(element)) {
                    targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
                  } else {
                    if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
                    target[targetIndex] = element;
                  }

                  targetIndex++;
                }
                sourceIndex++;
              }
              return targetIndex;
            };

            var flattenIntoArray_1 = flattenIntoArray;

            // `Array.prototype.flat` method
            // https://github.com/tc39/proposal-flatMap
            _export({ target: 'Array', proto: true }, {
              flat: function flat(/* depthArg = 1 */) {
                var depthArg = arguments.length ? arguments[0] : undefined;
                var O = toObject(this);
                var sourceLen = toLength(O.length);
                var A = arraySpeciesCreate(O, 0);
                A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger(depthArg));
                return A;
              }
            });

            // `Array.prototype.flatMap` method
            // https://github.com/tc39/proposal-flatMap
            _export({ target: 'Array', proto: true }, {
              flatMap: function flatMap(callbackfn /* , thisArg */) {
                var O = toObject(this);
                var sourceLen = toLength(O.length);
                var A;
                aFunction$1(callbackfn);
                A = arraySpeciesCreate(O, 0);
                A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
                return A;
              }
            });

            var $forEach$1 = arrayIteration.forEach;


            // `Array.prototype.forEach` method implementation
            // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
            var arrayForEach = sloppyArrayMethod('forEach') ? function forEach(callbackfn /* , thisArg */) {
              return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
            } : [].forEach;

            // `Array.prototype.forEach` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
            _export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
              forEach: arrayForEach
            });

            var $includes = arrayIncludes.includes;


            // `Array.prototype.includes` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.includes
            _export({ target: 'Array', proto: true }, {
              includes: function includes(el /* , fromIndex = 0 */) {
                return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
            addToUnscopables('includes');

            var $indexOf = arrayIncludes.indexOf;


            var nativeIndexOf = [].indexOf;

            var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
            var SLOPPY_METHOD = sloppyArrayMethod('indexOf');

            // `Array.prototype.indexOf` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
            _export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
              indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
                return NEGATIVE_ZERO
                  // convert -0 to +0
                  ? nativeIndexOf.apply(this, arguments) || 0
                  : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            var nativeJoin = [].join;

            var ES3_STRINGS = indexedObject != Object;
            var SLOPPY_METHOD$1 = sloppyArrayMethod('join', ',');

            // `Array.prototype.join` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.join
            _export({ target: 'Array', proto: true, forced: ES3_STRINGS || SLOPPY_METHOD$1 }, {
              join: function join(separator) {
                return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
              }
            });

            var min$3 = Math.min;
            var nativeLastIndexOf = [].lastIndexOf;
            var NEGATIVE_ZERO$1 = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
            var SLOPPY_METHOD$2 = sloppyArrayMethod('lastIndexOf');

            // `Array.prototype.lastIndexOf` method implementation
            // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
            var arrayLastIndexOf = (NEGATIVE_ZERO$1 || SLOPPY_METHOD$2) ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
              // convert -0 to +0
              if (NEGATIVE_ZERO$1) return nativeLastIndexOf.apply(this, arguments) || 0;
              var O = toIndexedObject(this);
              var length = toLength(O.length);
              var index = length - 1;
              if (arguments.length > 1) index = min$3(index, toInteger(arguments[1]));
              if (index < 0) index = length + index;
              for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
              return -1;
            } : nativeLastIndexOf;

            // `Array.prototype.lastIndexOf` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
            _export({ target: 'Array', proto: true, forced: arrayLastIndexOf !== [].lastIndexOf }, {
              lastIndexOf: arrayLastIndexOf
            });

            var $map = arrayIteration.map;



            var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('map');
            // FF49- issue
            var USES_TO_LENGTH$1 = HAS_SPECIES_SUPPORT$1 && !fails(function () {
              [].map.call({ length: -1, 0: 1 }, function (it) { throw it; });
            });

            // `Array.prototype.map` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.map
            // with adding support of @@species
            _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$1 }, {
              map: function map(callbackfn /* , thisArg */) {
                return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            // `Array.prototype.{ reduce, reduceRight }` methods implementation
            var createMethod$3 = function (IS_RIGHT) {
              return function (that, callbackfn, argumentsLength, memo) {
                aFunction$1(callbackfn);
                var O = toObject(that);
                var self = indexedObject(O);
                var length = toLength(O.length);
                var index = IS_RIGHT ? length - 1 : 0;
                var i = IS_RIGHT ? -1 : 1;
                if (argumentsLength < 2) while (true) {
                  if (index in self) {
                    memo = self[index];
                    index += i;
                    break;
                  }
                  index += i;
                  if (IS_RIGHT ? index < 0 : length <= index) {
                    throw TypeError('Reduce of empty array with no initial value');
                  }
                }
                for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
                  memo = callbackfn(memo, self[index], index, O);
                }
                return memo;
              };
            };

            var arrayReduce = {
              // `Array.prototype.reduce` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
              left: createMethod$3(false),
              // `Array.prototype.reduceRight` method
              // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
              right: createMethod$3(true)
            };

            var $reduce = arrayReduce.left;


            // `Array.prototype.reduce` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
            _export({ target: 'Array', proto: true, forced: sloppyArrayMethod('reduce') }, {
              reduce: function reduce(callbackfn /* , initialValue */) {
                return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            var $reduceRight = arrayReduce.right;


            // `Array.prototype.reduceRight` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
            _export({ target: 'Array', proto: true, forced: sloppyArrayMethod('reduceRight') }, {
              reduceRight: function reduceRight(callbackfn /* , initialValue */) {
                return $reduceRight(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            var nativeReverse = [].reverse;
            var test$1 = [1, 2];

            // `Array.prototype.reverse` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.reverse
            // fix for Safari 12.0 bug
            // https://bugs.webkit.org/show_bug.cgi?id=188794
            _export({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
              reverse: function reverse() {
                // eslint-disable-next-line no-self-assign
                if (isArray(this)) this.length = this.length;
                return nativeReverse.call(this);
              }
            });

            var SPECIES$2 = wellKnownSymbol('species');
            var nativeSlice = [].slice;
            var max$1 = Math.max;

            // `Array.prototype.slice` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.slice
            // fallback for not array-like ES3 strings and DOM objects
            _export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('slice') }, {
              slice: function slice(start, end) {
                var O = toIndexedObject(this);
                var length = toLength(O.length);
                var k = toAbsoluteIndex(start, length);
                var fin = toAbsoluteIndex(end === undefined ? length : end, length);
                // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
                var Constructor, result, n;
                if (isArray(O)) {
                  Constructor = O.constructor;
                  // cross-realm fallback
                  if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
                    Constructor = undefined;
                  } else if (isObject(Constructor)) {
                    Constructor = Constructor[SPECIES$2];
                    if (Constructor === null) Constructor = undefined;
                  }
                  if (Constructor === Array || Constructor === undefined) {
                    return nativeSlice.call(O, k, fin);
                  }
                }
                result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
                for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
                result.length = n;
                return result;
              }
            });

            var $some = arrayIteration.some;


            // `Array.prototype.some` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.some
            _export({ target: 'Array', proto: true, forced: sloppyArrayMethod('some') }, {
              some: function some(callbackfn /* , thisArg */) {
                return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            var test$2 = [];
            var nativeSort = test$2.sort;

            // IE8-
            var FAILS_ON_UNDEFINED = fails(function () {
              test$2.sort(undefined);
            });
            // V8 bug
            var FAILS_ON_NULL = fails(function () {
              test$2.sort(null);
            });
            // Old WebKit
            var SLOPPY_METHOD$3 = sloppyArrayMethod('sort');

            var FORCED$2 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || SLOPPY_METHOD$3;

            // `Array.prototype.sort` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.sort
            _export({ target: 'Array', proto: true, forced: FORCED$2 }, {
              sort: function sort(comparefn) {
                return comparefn === undefined
                  ? nativeSort.call(toObject(this))
                  : nativeSort.call(toObject(this), aFunction$1(comparefn));
              }
            });

            var max$2 = Math.max;
            var min$4 = Math.min;
            var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
            var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

            // `Array.prototype.splice` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.splice
            // with adding support of @@species
            _export({ target: 'Array', proto: true, forced: !arrayMethodHasSpeciesSupport('splice') }, {
              splice: function splice(start, deleteCount /* , ...items */) {
                var O = toObject(this);
                var len = toLength(O.length);
                var actualStart = toAbsoluteIndex(start, len);
                var argumentsLength = arguments.length;
                var insertCount, actualDeleteCount, A, k, from, to;
                if (argumentsLength === 0) {
                  insertCount = actualDeleteCount = 0;
                } else if (argumentsLength === 1) {
                  insertCount = 0;
                  actualDeleteCount = len - actualStart;
                } else {
                  insertCount = argumentsLength - 2;
                  actualDeleteCount = min$4(max$2(toInteger(deleteCount), 0), len - actualStart);
                }
                if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
                  throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
                }
                A = arraySpeciesCreate(O, actualDeleteCount);
                for (k = 0; k < actualDeleteCount; k++) {
                  from = actualStart + k;
                  if (from in O) createProperty(A, k, O[from]);
                }
                A.length = actualDeleteCount;
                if (insertCount < actualDeleteCount) {
                  for (k = actualStart; k < len - actualDeleteCount; k++) {
                    from = k + actualDeleteCount;
                    to = k + insertCount;
                    if (from in O) O[to] = O[from];
                    else delete O[to];
                  }
                  for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
                } else if (insertCount > actualDeleteCount) {
                  for (k = len - actualDeleteCount; k > actualStart; k--) {
                    from = k + actualDeleteCount - 1;
                    to = k + insertCount - 1;
                    if (from in O) O[to] = O[from];
                    else delete O[to];
                  }
                }
                for (k = 0; k < insertCount; k++) {
                  O[k + actualStart] = arguments[k + 2];
                }
                O.length = len - actualDeleteCount + insertCount;
                return A;
              }
            });

            var SPECIES$3 = wellKnownSymbol('species');

            var setSpecies = function (CONSTRUCTOR_NAME) {
              var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
              var defineProperty = objectDefineProperty.f;

              if (descriptors && Constructor && !Constructor[SPECIES$3]) {
                defineProperty(Constructor, SPECIES$3, {
                  configurable: true,
                  get: function () { return this; }
                });
              }
            };

            // `Array[@@species]` getter
            // https://tc39.github.io/ecma262/#sec-get-array-@@species
            setSpecies('Array');

            // this method was added to unscopables after implementation
            // in popular engines, so it's moved to a separate module


            addToUnscopables('flat');

            // this method was added to unscopables after implementation
            // in popular engines, so it's moved to a separate module


            addToUnscopables('flatMap');

            var ITERATOR$3 = wellKnownSymbol('iterator');
            var BUGGY_SAFARI_ITERATORS = false;

            var returnThis = function () { return this; };

            // `%IteratorPrototype%` object
            // https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
            var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

            if ([].keys) {
              arrayIterator = [].keys();
              // Safari 8 has buggy iterators w/o `next`
              if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
              else {
                PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
                if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
              }
            }

            if (IteratorPrototype == undefined) IteratorPrototype = {};

            // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
            if (!has(IteratorPrototype, ITERATOR$3)) {
              createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
            }

            var iteratorsCore = {
              IteratorPrototype: IteratorPrototype,
              BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
            };

            var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





            var returnThis$1 = function () { return this; };

            var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
              var TO_STRING_TAG = NAME + ' Iterator';
              IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
              setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
              iterators[TO_STRING_TAG] = returnThis$1;
              return IteratorConstructor;
            };

            var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
            var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
            var ITERATOR$4 = wellKnownSymbol('iterator');
            var KEYS = 'keys';
            var VALUES = 'values';
            var ENTRIES = 'entries';

            var returnThis$2 = function () { return this; };

            var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
              createIteratorConstructor(IteratorConstructor, NAME, next);

              var getIterationMethod = function (KIND) {
                if (KIND === DEFAULT && defaultIterator) return defaultIterator;
                if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
                switch (KIND) {
                  case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
                  case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
                  case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
                } return function () { return new IteratorConstructor(this); };
              };

              var TO_STRING_TAG = NAME + ' Iterator';
              var INCORRECT_VALUES_NAME = false;
              var IterablePrototype = Iterable.prototype;
              var nativeIterator = IterablePrototype[ITERATOR$4]
                || IterablePrototype['@@iterator']
                || DEFAULT && IterablePrototype[DEFAULT];
              var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
              var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
              var CurrentIteratorPrototype, methods, KEY;

              // fix native
              if (anyNativeIterator) {
                CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
                if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
                  if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
                    if (objectSetPrototypeOf) {
                      objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
                    } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
                      createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
                    }
                  }
                  // Set @@toStringTag to native iterators
                  setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
                }
              }

              // fix Array#{values, @@iterator}.name in V8 / FF
              if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
                INCORRECT_VALUES_NAME = true;
                defaultIterator = function values() { return nativeIterator.call(this); };
              }

              // define iterator
              if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
                createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
              }
              iterators[NAME] = defaultIterator;

              // export additional methods
              if (DEFAULT) {
                methods = {
                  values: getIterationMethod(VALUES),
                  keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
                  entries: getIterationMethod(ENTRIES)
                };
                if (FORCED) for (KEY in methods) {
                  if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
                    redefine(IterablePrototype, KEY, methods[KEY]);
                  }
                } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
              }

              return methods;
            };

            var ARRAY_ITERATOR = 'Array Iterator';
            var setInternalState$1 = internalState.set;
            var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

            // `Array.prototype.entries` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.entries
            // `Array.prototype.keys` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.keys
            // `Array.prototype.values` method
            // https://tc39.github.io/ecma262/#sec-array.prototype.values
            // `Array.prototype[@@iterator]` method
            // https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
            // `CreateArrayIterator` internal method
            // https://tc39.github.io/ecma262/#sec-createarrayiterator
            var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
              setInternalState$1(this, {
                type: ARRAY_ITERATOR,
                target: toIndexedObject(iterated), // target
                index: 0,                          // next index
                kind: kind                         // kind
              });
            // `%ArrayIteratorPrototype%.next` method
            // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
            }, function () {
              var state = getInternalState$1(this);
              var target = state.target;
              var kind = state.kind;
              var index = state.index++;
              if (!target || index >= target.length) {
                state.target = undefined;
                return { value: undefined, done: true };
              }
              if (kind == 'keys') return { value: index, done: false };
              if (kind == 'values') return { value: target[index], done: false };
              return { value: [index, target[index]], done: false };
            }, 'values');

            // argumentsList[@@iterator] is %ArrayProto_values%
            // https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
            // https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
            iterators.Arguments = iterators.Array;

            // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
            addToUnscopables('keys');
            addToUnscopables('values');
            addToUnscopables('entries');

            var fromCharCode = String.fromCharCode;
            var nativeFromCodePoint = String.fromCodePoint;

            // length should be 1, old FF problem
            var INCORRECT_LENGTH = !!nativeFromCodePoint && nativeFromCodePoint.length != 1;

            // `String.fromCodePoint` method
            // https://tc39.github.io/ecma262/#sec-string.fromcodepoint
            _export({ target: 'String', stat: true, forced: INCORRECT_LENGTH }, {
              fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
                var elements = [];
                var length = arguments.length;
                var i = 0;
                var code;
                while (length > i) {
                  code = +arguments[i++];
                  if (toAbsoluteIndex(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point');
                  elements.push(code < 0x10000
                    ? fromCharCode(code)
                    : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00)
                  );
                } return elements.join('');
              }
            });

            // `String.raw` method
            // https://tc39.github.io/ecma262/#sec-string.raw
            _export({ target: 'String', stat: true }, {
              raw: function raw(template) {
                var rawTemplate = toIndexedObject(template.raw);
                var literalSegments = toLength(rawTemplate.length);
                var argumentsLength = arguments.length;
                var elements = [];
                var i = 0;
                while (literalSegments > i) {
                  elements.push(String(rawTemplate[i++]));
                  if (i < argumentsLength) elements.push(String(arguments[i]));
                } return elements.join('');
              }
            });

            // `String.prototype.{ codePointAt, at }` methods implementation
            var createMethod$4 = function (CONVERT_TO_STRING) {
              return function ($this, pos) {
                var S = String(requireObjectCoercible($this));
                var position = toInteger(pos);
                var size = S.length;
                var first, second;
                if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
                first = S.charCodeAt(position);
                return first < 0xD800 || first > 0xDBFF || position + 1 === size
                  || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
                    ? CONVERT_TO_STRING ? S.charAt(position) : first
                    : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
              };
            };

            var stringMultibyte = {
              // `String.prototype.codePointAt` method
              // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
              codeAt: createMethod$4(false),
              // `String.prototype.at` method
              // https://github.com/mathiasbynens/String.prototype.at
              charAt: createMethod$4(true)
            };

            var codeAt = stringMultibyte.codeAt;

            // `String.prototype.codePointAt` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
            _export({ target: 'String', proto: true }, {
              codePointAt: function codePointAt(pos) {
                return codeAt(this, pos);
              }
            });

            var MATCH = wellKnownSymbol('match');

            // `IsRegExp` abstract operation
            // https://tc39.github.io/ecma262/#sec-isregexp
            var isRegexp = function (it) {
              var isRegExp;
              return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
            };

            var notARegexp = function (it) {
              if (isRegexp(it)) {
                throw TypeError("The method doesn't accept regular expressions");
              } return it;
            };

            var MATCH$1 = wellKnownSymbol('match');

            var correctIsRegexpLogic = function (METHOD_NAME) {
              var regexp = /./;
              try {
                '/./'[METHOD_NAME](regexp);
              } catch (e) {
                try {
                  regexp[MATCH$1] = false;
                  return '/./'[METHOD_NAME](regexp);
                } catch (f) { /* empty */ }
              } return false;
            };

            var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;






            var nativeEndsWith = ''.endsWith;
            var min$5 = Math.min;

            var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('endsWith');
            // https://github.com/zloirock/core-js/pull/702
            var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
              var descriptor = getOwnPropertyDescriptor$4(String.prototype, 'endsWith');
              return descriptor && !descriptor.writable;
            }();

            // `String.prototype.endsWith` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.endswith
            _export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
              endsWith: function endsWith(searchString /* , endPosition = @length */) {
                var that = String(requireObjectCoercible(this));
                notARegexp(searchString);
                var endPosition = arguments.length > 1 ? arguments[1] : undefined;
                var len = toLength(that.length);
                var end = endPosition === undefined ? len : min$5(toLength(endPosition), len);
                var search = String(searchString);
                return nativeEndsWith
                  ? nativeEndsWith.call(that, search, end)
                  : that.slice(end - search.length, end) === search;
              }
            });

            // `String.prototype.includes` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.includes
            _export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
              includes: function includes(searchString /* , position = 0 */) {
                return !!~String(requireObjectCoercible(this))
                  .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            // `RegExp.prototype.flags` getter implementation
            // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
            var regexpFlags = function () {
              var that = anObject(this);
              var result = '';
              if (that.global) result += 'g';
              if (that.ignoreCase) result += 'i';
              if (that.multiline) result += 'm';
              if (that.dotAll) result += 's';
              if (that.unicode) result += 'u';
              if (that.sticky) result += 'y';
              return result;
            };

            var nativeExec = RegExp.prototype.exec;
            // This always refers to the native implementation, because the
            // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
            // which loads this file before patching the method.
            var nativeReplace = String.prototype.replace;

            var patchedExec = nativeExec;

            var UPDATES_LAST_INDEX_WRONG = (function () {
              var re1 = /a/;
              var re2 = /b*/g;
              nativeExec.call(re1, 'a');
              nativeExec.call(re2, 'a');
              return re1.lastIndex !== 0 || re2.lastIndex !== 0;
            })();

            // nonparticipating capturing group, copied from es5-shim's String#split patch.
            var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

            var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

            if (PATCH) {
              patchedExec = function exec(str) {
                var re = this;
                var lastIndex, reCopy, match, i;

                if (NPCG_INCLUDED) {
                  reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
                }
                if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

                match = nativeExec.call(re, str);

                if (UPDATES_LAST_INDEX_WRONG && match) {
                  re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
                }
                if (NPCG_INCLUDED && match && match.length > 1) {
                  // Fix browsers whose `exec` methods don't consistently return `undefined`
                  // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
                  nativeReplace.call(match[0], reCopy, function () {
                    for (i = 1; i < arguments.length - 2; i++) {
                      if (arguments[i] === undefined) match[i] = undefined;
                    }
                  });
                }

                return match;
              };
            }

            var regexpExec = patchedExec;

            var SPECIES$4 = wellKnownSymbol('species');

            var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
              // #replace needs built-in support for named groups.
              // #match works fine because it just return the exec results, even if it has
              // a "grops" property.
              var re = /./;
              re.exec = function () {
                var result = [];
                result.groups = { a: '7' };
                return result;
              };
              return ''.replace(re, '$<a>') !== '7';
            });

            // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
            // Weex JS has frozen built-in prototypes, so use try / catch wrapper
            var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
              var re = /(?:)/;
              var originalExec = re.exec;
              re.exec = function () { return originalExec.apply(this, arguments); };
              var result = 'ab'.split(re);
              return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
            });

            var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
              var SYMBOL = wellKnownSymbol(KEY);

              var DELEGATES_TO_SYMBOL = !fails(function () {
                // String methods call symbol-named RegEp methods
                var O = {};
                O[SYMBOL] = function () { return 7; };
                return ''[KEY](O) != 7;
              });

              var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
                // Symbol-named RegExp methods call .exec
                var execCalled = false;
                var re = /a/;

                if (KEY === 'split') {
                  // We can't use real regex here since it causes deoptimization
                  // and serious performance degradation in V8
                  // https://github.com/zloirock/core-js/issues/306
                  re = {};
                  // RegExp[@@split] doesn't call the regex's exec method, but first creates
                  // a new one. We need to return the patched regex when creating the new one.
                  re.constructor = {};
                  re.constructor[SPECIES$4] = function () { return re; };
                  re.flags = '';
                  re[SYMBOL] = /./[SYMBOL];
                }

                re.exec = function () { execCalled = true; return null; };

                re[SYMBOL]('');
                return !execCalled;
              });

              if (
                !DELEGATES_TO_SYMBOL ||
                !DELEGATES_TO_EXEC ||
                (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
                (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
              ) {
                var nativeRegExpMethod = /./[SYMBOL];
                var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
                  if (regexp.exec === regexpExec) {
                    if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
                      // The native String method already delegates to @@method (this
                      // polyfilled function), leasing to infinite recursion.
                      // We avoid it by directly calling the native @@method method.
                      return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
                    }
                    return { done: true, value: nativeMethod.call(str, regexp, arg2) };
                  }
                  return { done: false };
                });
                var stringMethod = methods[0];
                var regexMethod = methods[1];

                redefine(String.prototype, KEY, stringMethod);
                redefine(RegExp.prototype, SYMBOL, length == 2
                  // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
                  // 21.2.5.11 RegExp.prototype[@@split](string, limit)
                  ? function (string, arg) { return regexMethod.call(string, this, arg); }
                  // 21.2.5.6 RegExp.prototype[@@match](string)
                  // 21.2.5.9 RegExp.prototype[@@search](string)
                  : function (string) { return regexMethod.call(string, this); }
                );
                if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
              }
            };

            var charAt = stringMultibyte.charAt;

            // `AdvanceStringIndex` abstract operation
            // https://tc39.github.io/ecma262/#sec-advancestringindex
            var advanceStringIndex = function (S, index, unicode) {
              return index + (unicode ? charAt(S, index).length : 1);
            };

            // `RegExpExec` abstract operation
            // https://tc39.github.io/ecma262/#sec-regexpexec
            var regexpExecAbstract = function (R, S) {
              var exec = R.exec;
              if (typeof exec === 'function') {
                var result = exec.call(R, S);
                if (typeof result !== 'object') {
                  throw TypeError('RegExp exec method returned something other than an Object or null');
                }
                return result;
              }

              if (classofRaw(R) !== 'RegExp') {
                throw TypeError('RegExp#exec called on incompatible receiver');
              }

              return regexpExec.call(R, S);
            };

            // @@match logic
            fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
              return [
                // `String.prototype.match` method
                // https://tc39.github.io/ecma262/#sec-string.prototype.match
                function match(regexp) {
                  var O = requireObjectCoercible(this);
                  var matcher = regexp == undefined ? undefined : regexp[MATCH];
                  return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
                },
                // `RegExp.prototype[@@match]` method
                // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
                function (regexp) {
                  var res = maybeCallNative(nativeMatch, regexp, this);
                  if (res.done) return res.value;

                  var rx = anObject(regexp);
                  var S = String(this);

                  if (!rx.global) return regexpExecAbstract(rx, S);

                  var fullUnicode = rx.unicode;
                  rx.lastIndex = 0;
                  var A = [];
                  var n = 0;
                  var result;
                  while ((result = regexpExecAbstract(rx, S)) !== null) {
                    var matchStr = String(result[0]);
                    A[n] = matchStr;
                    if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                    n++;
                  }
                  return n === 0 ? null : A;
                }
              ];
            });

            var SPECIES$5 = wellKnownSymbol('species');

            // `SpeciesConstructor` abstract operation
            // https://tc39.github.io/ecma262/#sec-speciesconstructor
            var speciesConstructor = function (O, defaultConstructor) {
              var C = anObject(O).constructor;
              var S;
              return C === undefined || (S = anObject(C)[SPECIES$5]) == undefined ? defaultConstructor : aFunction$1(S);
            };

            var MATCH_ALL = wellKnownSymbol('matchAll');
            var REGEXP_STRING = 'RegExp String';
            var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
            var setInternalState$2 = internalState.set;
            var getInternalState$2 = internalState.getterFor(REGEXP_STRING_ITERATOR);
            var RegExpPrototype = RegExp.prototype;
            var regExpBuiltinExec = RegExpPrototype.exec;
            var nativeMatchAll = ''.matchAll;

            var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails(function () {
              'a'.matchAll(/./);
            });

            var regExpExec = function (R, S) {
              var exec = R.exec;
              var result;
              if (typeof exec == 'function') {
                result = exec.call(R, S);
                if (typeof result != 'object') throw TypeError('Incorrect exec result');
                return result;
              } return regExpBuiltinExec.call(R, S);
            };

            // eslint-disable-next-line max-len
            var $RegExpStringIterator = createIteratorConstructor(function RegExpStringIterator(regexp, string, global, fullUnicode) {
              setInternalState$2(this, {
                type: REGEXP_STRING_ITERATOR,
                regexp: regexp,
                string: string,
                global: global,
                unicode: fullUnicode,
                done: false
              });
            }, REGEXP_STRING, function next() {
              var state = getInternalState$2(this);
              if (state.done) return { value: undefined, done: true };
              var R = state.regexp;
              var S = state.string;
              var match = regExpExec(R, S);
              if (match === null) return { value: undefined, done: state.done = true };
              if (state.global) {
                if (String(match[0]) == '') R.lastIndex = advanceStringIndex(S, toLength(R.lastIndex), state.unicode);
                return { value: match, done: false };
              }
              state.done = true;
              return { value: match, done: false };
            });

            var $matchAll = function (string) {
              var R = anObject(this);
              var S = String(string);
              var C, flagsValue, flags, matcher, global, fullUnicode;
              C = speciesConstructor(R, RegExp);
              flagsValue = R.flags;
              if (flagsValue === undefined && R instanceof RegExp && !('flags' in RegExpPrototype)) {
                flagsValue = regexpFlags.call(R);
              }
              flags = flagsValue === undefined ? '' : String(flagsValue);
              matcher = new C(C === RegExp ? R.source : R, flags);
              global = !!~flags.indexOf('g');
              fullUnicode = !!~flags.indexOf('u');
              matcher.lastIndex = toLength(R.lastIndex);
              return new $RegExpStringIterator(matcher, S, global, fullUnicode);
            };

            // `String.prototype.matchAll` method
            // https://github.com/tc39/proposal-string-matchall
            _export({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
              matchAll: function matchAll(regexp) {
                var O = requireObjectCoercible(this);
                var flags, S, matcher, rx;
                if (regexp != null) {
                  if (isRegexp(regexp)) {
                    flags = String(requireObjectCoercible('flags' in RegExpPrototype
                      ? regexp.flags
                      : regexpFlags.call(regexp)
                    ));
                    if (!~flags.indexOf('g')) throw TypeError('`.matchAll` does not allow non-global regexes');
                  }
                  if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
                  matcher = regexp[MATCH_ALL];
                  if (matcher === undefined && isPure && classofRaw(regexp) == 'RegExp') matcher = $matchAll;
                  if (matcher != null) return aFunction$1(matcher).call(regexp, O);
                } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
                S = String(O);
                rx = new RegExp(regexp, 'g');
                return rx[MATCH_ALL](S);
              }
            });

            MATCH_ALL in RegExpPrototype || createNonEnumerableProperty(RegExpPrototype, MATCH_ALL, $matchAll);

            // `String.prototype.repeat` method implementation
            // https://tc39.github.io/ecma262/#sec-string.prototype.repeat
            var stringRepeat = ''.repeat || function repeat(count) {
              var str = String(requireObjectCoercible(this));
              var result = '';
              var n = toInteger(count);
              if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
              for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
              return result;
            };

            // https://github.com/tc39/proposal-string-pad-start-end




            var ceil$1 = Math.ceil;

            // `String.prototype.{ padStart, padEnd }` methods implementation
            var createMethod$5 = function (IS_END) {
              return function ($this, maxLength, fillString) {
                var S = String(requireObjectCoercible($this));
                var stringLength = S.length;
                var fillStr = fillString === undefined ? ' ' : String(fillString);
                var intMaxLength = toLength(maxLength);
                var fillLen, stringFiller;
                if (intMaxLength <= stringLength || fillStr == '') return S;
                fillLen = intMaxLength - stringLength;
                stringFiller = stringRepeat.call(fillStr, ceil$1(fillLen / fillStr.length));
                if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
                return IS_END ? S + stringFiller : stringFiller + S;
              };
            };

            var stringPad = {
              // `String.prototype.padStart` method
              // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
              start: createMethod$5(false),
              // `String.prototype.padEnd` method
              // https://tc39.github.io/ecma262/#sec-string.prototype.padend
              end: createMethod$5(true)
            };

            // https://github.com/zloirock/core-js/issues/280


            // eslint-disable-next-line unicorn/no-unsafe-regex
            var webkitStringPadBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);

            var $padEnd = stringPad.end;


            // `String.prototype.padEnd` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.padend
            _export({ target: 'String', proto: true, forced: webkitStringPadBug }, {
              padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
                return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            var $padStart = stringPad.start;


            // `String.prototype.padStart` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
            _export({ target: 'String', proto: true, forced: webkitStringPadBug }, {
              padStart: function padStart(maxLength /* , fillString = ' ' */) {
                return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
              }
            });

            // `String.prototype.repeat` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.repeat
            _export({ target: 'String', proto: true }, {
              repeat: stringRepeat
            });

            var max$3 = Math.max;
            var min$6 = Math.min;
            var floor$1 = Math.floor;
            var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
            var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

            var maybeToString = function (it) {
              return it === undefined ? it : String(it);
            };

            // @@replace logic
            fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative) {
              return [
                // `String.prototype.replace` method
                // https://tc39.github.io/ecma262/#sec-string.prototype.replace
                function replace(searchValue, replaceValue) {
                  var O = requireObjectCoercible(this);
                  var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
                  return replacer !== undefined
                    ? replacer.call(searchValue, O, replaceValue)
                    : nativeReplace.call(String(O), searchValue, replaceValue);
                },
                // `RegExp.prototype[@@replace]` method
                // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
                function (regexp, replaceValue) {
                  var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
                  if (res.done) return res.value;

                  var rx = anObject(regexp);
                  var S = String(this);

                  var functionalReplace = typeof replaceValue === 'function';
                  if (!functionalReplace) replaceValue = String(replaceValue);

                  var global = rx.global;
                  if (global) {
                    var fullUnicode = rx.unicode;
                    rx.lastIndex = 0;
                  }
                  var results = [];
                  while (true) {
                    var result = regexpExecAbstract(rx, S);
                    if (result === null) break;

                    results.push(result);
                    if (!global) break;

                    var matchStr = String(result[0]);
                    if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
                  }

                  var accumulatedResult = '';
                  var nextSourcePosition = 0;
                  for (var i = 0; i < results.length; i++) {
                    result = results[i];

                    var matched = String(result[0]);
                    var position = max$3(min$6(toInteger(result.index), S.length), 0);
                    var captures = [];
                    // NOTE: This is equivalent to
                    //   captures = result.slice(1).map(maybeToString)
                    // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
                    // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
                    // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
                    for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
                    var namedCaptures = result.groups;
                    if (functionalReplace) {
                      var replacerArgs = [matched].concat(captures, position, S);
                      if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
                      var replacement = String(replaceValue.apply(undefined, replacerArgs));
                    } else {
                      replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
                    }
                    if (position >= nextSourcePosition) {
                      accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
                      nextSourcePosition = position + matched.length;
                    }
                  }
                  return accumulatedResult + S.slice(nextSourcePosition);
                }
              ];

              // https://tc39.github.io/ecma262/#sec-getsubstitution
              function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
                var tailPos = position + matched.length;
                var m = captures.length;
                var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
                if (namedCaptures !== undefined) {
                  namedCaptures = toObject(namedCaptures);
                  symbols = SUBSTITUTION_SYMBOLS;
                }
                return nativeReplace.call(replacement, symbols, function (match, ch) {
                  var capture;
                  switch (ch.charAt(0)) {
                    case '$': return '$';
                    case '&': return matched;
                    case '`': return str.slice(0, position);
                    case "'": return str.slice(tailPos);
                    case '<':
                      capture = namedCaptures[ch.slice(1, -1)];
                      break;
                    default: // \d\d?
                      var n = +ch;
                      if (n === 0) return match;
                      if (n > m) {
                        var f = floor$1(n / 10);
                        if (f === 0) return match;
                        if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
                        return match;
                      }
                      capture = captures[n - 1];
                  }
                  return capture === undefined ? '' : capture;
                });
              }
            });

            // @@search logic
            fixRegexpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
              return [
                // `String.prototype.search` method
                // https://tc39.github.io/ecma262/#sec-string.prototype.search
                function search(regexp) {
                  var O = requireObjectCoercible(this);
                  var searcher = regexp == undefined ? undefined : regexp[SEARCH];
                  return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
                },
                // `RegExp.prototype[@@search]` method
                // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
                function (regexp) {
                  var res = maybeCallNative(nativeSearch, regexp, this);
                  if (res.done) return res.value;

                  var rx = anObject(regexp);
                  var S = String(this);

                  var previousLastIndex = rx.lastIndex;
                  if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
                  var result = regexpExecAbstract(rx, S);
                  if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
                  return result === null ? -1 : result.index;
                }
              ];
            });

            var arrayPush = [].push;
            var min$7 = Math.min;
            var MAX_UINT32 = 0xFFFFFFFF;

            // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
            var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

            // @@split logic
            fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
              var internalSplit;
              if (
                'abbc'.split(/(b)*/)[1] == 'c' ||
                'test'.split(/(?:)/, -1).length != 4 ||
                'ab'.split(/(?:ab)*/).length != 2 ||
                '.'.split(/(.?)(.?)/).length != 4 ||
                '.'.split(/()()/).length > 1 ||
                ''.split(/.?/).length
              ) {
                // based on es5-shim implementation, need to rework it
                internalSplit = function (separator, limit) {
                  var string = String(requireObjectCoercible(this));
                  var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
                  if (lim === 0) return [];
                  if (separator === undefined) return [string];
                  // If `separator` is not a regex, use native split
                  if (!isRegexp(separator)) {
                    return nativeSplit.call(string, separator, lim);
                  }
                  var output = [];
                  var flags = (separator.ignoreCase ? 'i' : '') +
                              (separator.multiline ? 'm' : '') +
                              (separator.unicode ? 'u' : '') +
                              (separator.sticky ? 'y' : '');
                  var lastLastIndex = 0;
                  // Make `global` and avoid `lastIndex` issues by working with a copy
                  var separatorCopy = new RegExp(separator.source, flags + 'g');
                  var match, lastIndex, lastLength;
                  while (match = regexpExec.call(separatorCopy, string)) {
                    lastIndex = separatorCopy.lastIndex;
                    if (lastIndex > lastLastIndex) {
                      output.push(string.slice(lastLastIndex, match.index));
                      if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
                      lastLength = match[0].length;
                      lastLastIndex = lastIndex;
                      if (output.length >= lim) break;
                    }
                    if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
                  }
                  if (lastLastIndex === string.length) {
                    if (lastLength || !separatorCopy.test('')) output.push('');
                  } else output.push(string.slice(lastLastIndex));
                  return output.length > lim ? output.slice(0, lim) : output;
                };
              // Chakra, V8
              } else if ('0'.split(undefined, 0).length) {
                internalSplit = function (separator, limit) {
                  return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
                };
              } else internalSplit = nativeSplit;

              return [
                // `String.prototype.split` method
                // https://tc39.github.io/ecma262/#sec-string.prototype.split
                function split(separator, limit) {
                  var O = requireObjectCoercible(this);
                  var splitter = separator == undefined ? undefined : separator[SPLIT];
                  return splitter !== undefined
                    ? splitter.call(separator, O, limit)
                    : internalSplit.call(String(O), separator, limit);
                },
                // `RegExp.prototype[@@split]` method
                // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
                //
                // NOTE: This cannot be properly polyfilled in engines that don't support
                // the 'y' flag.
                function (regexp, limit) {
                  var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
                  if (res.done) return res.value;

                  var rx = anObject(regexp);
                  var S = String(this);
                  var C = speciesConstructor(rx, RegExp);

                  var unicodeMatching = rx.unicode;
                  var flags = (rx.ignoreCase ? 'i' : '') +
                              (rx.multiline ? 'm' : '') +
                              (rx.unicode ? 'u' : '') +
                              (SUPPORTS_Y ? 'y' : 'g');

                  // ^(? + rx + ) is needed, in combination with some S slicing, to
                  // simulate the 'y' flag.
                  var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
                  var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
                  if (lim === 0) return [];
                  if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
                  var p = 0;
                  var q = 0;
                  var A = [];
                  while (q < S.length) {
                    splitter.lastIndex = SUPPORTS_Y ? q : 0;
                    var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
                    var e;
                    if (
                      z === null ||
                      (e = min$7(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
                    ) {
                      q = advanceStringIndex(S, q, unicodeMatching);
                    } else {
                      A.push(S.slice(p, q));
                      if (A.length === lim) return A;
                      for (var i = 1; i <= z.length - 1; i++) {
                        A.push(z[i]);
                        if (A.length === lim) return A;
                      }
                      q = p = e;
                    }
                  }
                  A.push(S.slice(p));
                  return A;
                }
              ];
            }, !SUPPORTS_Y);

            var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor.f;






            var nativeStartsWith = ''.startsWith;
            var min$8 = Math.min;

            var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegexpLogic('startsWith');
            // https://github.com/zloirock/core-js/pull/702
            var MDN_POLYFILL_BUG$1 = !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
              var descriptor = getOwnPropertyDescriptor$5(String.prototype, 'startsWith');
              return descriptor && !descriptor.writable;
            }();

            // `String.prototype.startsWith` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.startswith
            _export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
              startsWith: function startsWith(searchString /* , position = 0 */) {
                var that = String(requireObjectCoercible(this));
                notARegexp(searchString);
                var index = toLength(min$8(arguments.length > 1 ? arguments[1] : undefined, that.length));
                var search = String(searchString);
                return nativeStartsWith
                  ? nativeStartsWith.call(that, search, index)
                  : that.slice(index, index + search.length) === search;
              }
            });

            // a string of all valid unicode whitespaces
            // eslint-disable-next-line max-len
            var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

            var whitespace = '[' + whitespaces + ']';
            var ltrim = RegExp('^' + whitespace + whitespace + '*');
            var rtrim = RegExp(whitespace + whitespace + '*$');

            // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
            var createMethod$6 = function (TYPE) {
              return function ($this) {
                var string = String(requireObjectCoercible($this));
                if (TYPE & 1) string = string.replace(ltrim, '');
                if (TYPE & 2) string = string.replace(rtrim, '');
                return string;
              };
            };

            var stringTrim = {
              // `String.prototype.{ trimLeft, trimStart }` methods
              // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
              start: createMethod$6(1),
              // `String.prototype.{ trimRight, trimEnd }` methods
              // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
              end: createMethod$6(2),
              // `String.prototype.trim` method
              // https://tc39.github.io/ecma262/#sec-string.prototype.trim
              trim: createMethod$6(3)
            };

            var non = '\u200B\u0085\u180E';

            // check that a method works with the correct list
            // of whitespaces and has a correct name
            var forcedStringTrimMethod = function (METHOD_NAME) {
              return fails(function () {
                return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
              });
            };

            var $trim = stringTrim.trim;


            // `String.prototype.trim` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.trim
            _export({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
              trim: function trim() {
                return $trim(this);
              }
            });

            var $trimStart = stringTrim.start;


            var FORCED$3 = forcedStringTrimMethod('trimStart');

            var trimStart = FORCED$3 ? function trimStart() {
              return $trimStart(this);
            } : ''.trimStart;

            // `String.prototype.{ trimStart, trimLeft }` methods
            // https://github.com/tc39/ecmascript-string-left-right-trim
            _export({ target: 'String', proto: true, forced: FORCED$3 }, {
              trimStart: trimStart,
              trimLeft: trimStart
            });

            var $trimEnd = stringTrim.end;


            var FORCED$4 = forcedStringTrimMethod('trimEnd');

            var trimEnd = FORCED$4 ? function trimEnd() {
              return $trimEnd(this);
            } : ''.trimEnd;

            // `String.prototype.{ trimEnd, trimRight }` methods
            // https://github.com/tc39/ecmascript-string-left-right-trim
            _export({ target: 'String', proto: true, forced: FORCED$4 }, {
              trimEnd: trimEnd,
              trimRight: trimEnd
            });

            var charAt$1 = stringMultibyte.charAt;



            var STRING_ITERATOR = 'String Iterator';
            var setInternalState$3 = internalState.set;
            var getInternalState$3 = internalState.getterFor(STRING_ITERATOR);

            // `String.prototype[@@iterator]` method
            // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
            defineIterator(String, 'String', function (iterated) {
              setInternalState$3(this, {
                type: STRING_ITERATOR,
                string: String(iterated),
                index: 0
              });
            // `%StringIteratorPrototype%.next` method
            // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
            }, function next() {
              var state = getInternalState$3(this);
              var string = state.string;
              var index = state.index;
              var point;
              if (index >= string.length) return { value: undefined, done: true };
              point = charAt$1(string, index);
              state.index += point.length;
              return { value: point, done: false };
            });

            var quot = /"/g;

            // B.2.3.2.1 CreateHTML(string, tag, attribute, value)
            // https://tc39.github.io/ecma262/#sec-createhtml
            var createHtml = function (string, tag, attribute, value) {
              var S = String(requireObjectCoercible(string));
              var p1 = '<' + tag;
              if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
              return p1 + '>' + S + '</' + tag + '>';
            };

            // check the existence of a method, lowercase
            // of a tag and escaping quotes in arguments
            var forcedStringHtmlMethod = function (METHOD_NAME) {
              return fails(function () {
                var test = ''[METHOD_NAME]('"');
                return test !== test.toLowerCase() || test.split('"').length > 3;
              });
            };

            // `String.prototype.anchor` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.anchor
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('anchor') }, {
              anchor: function anchor(name) {
                return createHtml(this, 'a', 'name', name);
              }
            });

            // `String.prototype.big` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.big
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('big') }, {
              big: function big() {
                return createHtml(this, 'big', '', '');
              }
            });

            // `String.prototype.blink` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.blink
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('blink') }, {
              blink: function blink() {
                return createHtml(this, 'blink', '', '');
              }
            });

            // `String.prototype.bold` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.bold
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('bold') }, {
              bold: function bold() {
                return createHtml(this, 'b', '', '');
              }
            });

            // `String.prototype.fixed` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.fixed
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('fixed') }, {
              fixed: function fixed() {
                return createHtml(this, 'tt', '', '');
              }
            });

            // `String.prototype.fontcolor` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.fontcolor
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('fontcolor') }, {
              fontcolor: function fontcolor(color) {
                return createHtml(this, 'font', 'color', color);
              }
            });

            // `String.prototype.fontsize` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.fontsize
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('fontsize') }, {
              fontsize: function fontsize(size) {
                return createHtml(this, 'font', 'size', size);
              }
            });

            // `String.prototype.italics` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.italics
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('italics') }, {
              italics: function italics() {
                return createHtml(this, 'i', '', '');
              }
            });

            // `String.prototype.link` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.link
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('link') }, {
              link: function link(url) {
                return createHtml(this, 'a', 'href', url);
              }
            });

            // `String.prototype.small` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.small
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('small') }, {
              small: function small() {
                return createHtml(this, 'small', '', '');
              }
            });

            // `String.prototype.strike` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.strike
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('strike') }, {
              strike: function strike() {
                return createHtml(this, 'strike', '', '');
              }
            });

            // `String.prototype.sub` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.sub
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('sub') }, {
              sub: function sub() {
                return createHtml(this, 'sub', '', '');
              }
            });

            // `String.prototype.sup` method
            // https://tc39.github.io/ecma262/#sec-string.prototype.sup
            _export({ target: 'String', proto: true, forced: forcedStringHtmlMethod('sup') }, {
              sup: function sup() {
                return createHtml(this, 'sup', '', '');
              }
            });

            // makes subclassing work correct for wrapped built-ins
            var inheritIfRequired = function ($this, dummy, Wrapper) {
              var NewTarget, NewTargetPrototype;
              if (
                // it can work only with native `setPrototypeOf`
                objectSetPrototypeOf &&
                // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
                typeof (NewTarget = dummy.constructor) == 'function' &&
                NewTarget !== Wrapper &&
                isObject(NewTargetPrototype = NewTarget.prototype) &&
                NewTargetPrototype !== Wrapper.prototype
              ) objectSetPrototypeOf($this, NewTargetPrototype);
              return $this;
            };

            var defineProperty$5 = objectDefineProperty.f;
            var getOwnPropertyNames = objectGetOwnPropertyNames.f;







            var MATCH$2 = wellKnownSymbol('match');
            var NativeRegExp = global_1.RegExp;
            var RegExpPrototype$1 = NativeRegExp.prototype;
            var re1 = /a/g;
            var re2 = /a/g;

            // "new" should create a new object, old webkit bug
            var CORRECT_NEW = new NativeRegExp(re1) !== re1;

            var FORCED$5 = descriptors && isForced_1('RegExp', (!CORRECT_NEW || fails(function () {
              re2[MATCH$2] = false;
              // RegExp constructor can alter flags and IsRegExp works correct with @@match
              return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
            })));

            // `RegExp` constructor
            // https://tc39.github.io/ecma262/#sec-regexp-constructor
            if (FORCED$5) {
              var RegExpWrapper = function RegExp(pattern, flags) {
                var thisIsRegExp = this instanceof RegExpWrapper;
                var patternIsRegExp = isRegexp(pattern);
                var flagsAreUndefined = flags === undefined;
                return !thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined ? pattern
                  : inheritIfRequired(CORRECT_NEW
                    ? new NativeRegExp(patternIsRegExp && !flagsAreUndefined ? pattern.source : pattern, flags)
                    : NativeRegExp((patternIsRegExp = pattern instanceof RegExpWrapper)
                      ? pattern.source
                      : pattern, patternIsRegExp && flagsAreUndefined ? regexpFlags.call(pattern) : flags)
                  , thisIsRegExp ? this : RegExpPrototype$1, RegExpWrapper);
              };
              var proxy = function (key) {
                key in RegExpWrapper || defineProperty$5(RegExpWrapper, key, {
                  configurable: true,
                  get: function () { return NativeRegExp[key]; },
                  set: function (it) { NativeRegExp[key] = it; }
                });
              };
              var keys$1 = getOwnPropertyNames(NativeRegExp);
              var index = 0;
              while (keys$1.length > index) proxy(keys$1[index++]);
              RegExpPrototype$1.constructor = RegExpWrapper;
              RegExpWrapper.prototype = RegExpPrototype$1;
              redefine(global_1, 'RegExp', RegExpWrapper);
            }

            // https://tc39.github.io/ecma262/#sec-get-regexp-@@species
            setSpecies('RegExp');

            _export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
              exec: regexpExec
            });

            // `RegExp.prototype.flags` getter
            // https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
            if (descriptors && /./g.flags != 'g') {
              objectDefineProperty.f(RegExp.prototype, 'flags', {
                configurable: true,
                get: regexpFlags
              });
            }

            var TO_STRING = 'toString';
            var RegExpPrototype$2 = RegExp.prototype;
            var nativeToString = RegExpPrototype$2[TO_STRING];

            var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
            // FF44- RegExp#toString has a wrong name
            var INCORRECT_NAME = nativeToString.name != TO_STRING;

            // `RegExp.prototype.toString` method
            // https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
            if (NOT_GENERIC || INCORRECT_NAME) {
              redefine(RegExp.prototype, TO_STRING, function toString() {
                var R = anObject(this);
                var p = String(R.source);
                var rf = R.flags;
                var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$2) ? regexpFlags.call(R) : rf);
                return '/' + p + '/' + f;
              }, { unsafe: true });
            }

            var trim = stringTrim.trim;


            var nativeParseInt = global_1.parseInt;
            var hex = /^[+-]?0[Xx]/;
            var FORCED$6 = nativeParseInt(whitespaces + '08') !== 8 || nativeParseInt(whitespaces + '0x16') !== 22;

            // `parseInt` method
            // https://tc39.github.io/ecma262/#sec-parseint-string-radix
            var _parseInt = FORCED$6 ? function parseInt(string, radix) {
              var S = trim(String(string));
              return nativeParseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
            } : nativeParseInt;

            // `parseInt` method
            // https://tc39.github.io/ecma262/#sec-parseint-string-radix
            _export({ global: true, forced: parseInt != _parseInt }, {
              parseInt: _parseInt
            });

            var trim$1 = stringTrim.trim;


            var nativeParseFloat = global_1.parseFloat;
            var FORCED$7 = 1 / nativeParseFloat(whitespaces + '-0') !== -Infinity;

            // `parseFloat` method
            // https://tc39.github.io/ecma262/#sec-parsefloat-string
            var _parseFloat = FORCED$7 ? function parseFloat(string) {
              var trimmedString = trim$1(String(string));
              var result = nativeParseFloat(trimmedString);
              return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
            } : nativeParseFloat;

            // `parseFloat` method
            // https://tc39.github.io/ecma262/#sec-parsefloat-string
            _export({ global: true, forced: parseFloat != _parseFloat }, {
              parseFloat: _parseFloat
            });

            var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
            var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor.f;
            var defineProperty$6 = objectDefineProperty.f;
            var trim$2 = stringTrim.trim;

            var NUMBER = 'Number';
            var NativeNumber = global_1[NUMBER];
            var NumberPrototype = NativeNumber.prototype;

            // Opera ~12 has broken Object#toString
            var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

            // `ToNumber` abstract operation
            // https://tc39.github.io/ecma262/#sec-tonumber
            var toNumber = function (argument) {
              var it = toPrimitive(argument, false);
              var first, third, radix, maxCode, digits, length, index, code;
              if (typeof it == 'string' && it.length > 2) {
                it = trim$2(it);
                first = it.charCodeAt(0);
                if (first === 43 || first === 45) {
                  third = it.charCodeAt(2);
                  if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
                } else if (first === 48) {
                  switch (it.charCodeAt(1)) {
                    case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
                    case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
                    default: return +it;
                  }
                  digits = it.slice(2);
                  length = digits.length;
                  for (index = 0; index < length; index++) {
                    code = digits.charCodeAt(index);
                    // parseInt parses a string to a first unavailable symbol
                    // but ToNumber should return NaN if a string contains unavailable symbols
                    if (code < 48 || code > maxCode) return NaN;
                  } return parseInt(digits, radix);
                }
              } return +it;
            };

            // `Number` constructor
            // https://tc39.github.io/ecma262/#sec-number-constructor
            if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
              var NumberWrapper = function Number(value) {
                var it = arguments.length < 1 ? 0 : value;
                var dummy = this;
                return dummy instanceof NumberWrapper
                  // check on 1..constructor(foo) case
                  && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
                    ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
              };
              for (var keys$2 = descriptors ? getOwnPropertyNames$1(NativeNumber) : (
                // ES3:
                'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
                // ES2015 (in case, if modules with ES2015 Number statics required before):
                'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
                'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
              ).split(','), j = 0, key; keys$2.length > j; j++) {
                if (has(NativeNumber, key = keys$2[j]) && !has(NumberWrapper, key)) {
                  defineProperty$6(NumberWrapper, key, getOwnPropertyDescriptor$6(NativeNumber, key));
                }
              }
              NumberWrapper.prototype = NumberPrototype;
              NumberPrototype.constructor = NumberWrapper;
              redefine(global_1, NUMBER, NumberWrapper);
            }

            // `Number.EPSILON` constant
            // https://tc39.github.io/ecma262/#sec-number.epsilon
            _export({ target: 'Number', stat: true }, {
              EPSILON: Math.pow(2, -52)
            });

            var globalIsFinite = global_1.isFinite;

            // `Number.isFinite` method
            // https://tc39.github.io/ecma262/#sec-number.isfinite
            var numberIsFinite = Number.isFinite || function isFinite(it) {
              return typeof it == 'number' && globalIsFinite(it);
            };

            // `Number.isFinite` method
            // https://tc39.github.io/ecma262/#sec-number.isfinite
            _export({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

            var floor$2 = Math.floor;

            // `Number.isInteger` method implementation
            // https://tc39.github.io/ecma262/#sec-number.isinteger
            var isInteger = function isInteger(it) {
              return !isObject(it) && isFinite(it) && floor$2(it) === it;
            };

            // `Number.isInteger` method
            // https://tc39.github.io/ecma262/#sec-number.isinteger
            _export({ target: 'Number', stat: true }, {
              isInteger: isInteger
            });

            // `Number.isNaN` method
            // https://tc39.github.io/ecma262/#sec-number.isnan
            _export({ target: 'Number', stat: true }, {
              isNaN: function isNaN(number) {
                // eslint-disable-next-line no-self-compare
                return number != number;
              }
            });

            var abs = Math.abs;

            // `Number.isSafeInteger` method
            // https://tc39.github.io/ecma262/#sec-number.issafeinteger
            _export({ target: 'Number', stat: true }, {
              isSafeInteger: function isSafeInteger(number) {
                return isInteger(number) && abs(number) <= 0x1FFFFFFFFFFFFF;
              }
            });

            // `Number.MAX_SAFE_INTEGER` constant
            // https://tc39.github.io/ecma262/#sec-number.max_safe_integer
            _export({ target: 'Number', stat: true }, {
              MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
            });

            // `Number.MIN_SAFE_INTEGER` constant
            // https://tc39.github.io/ecma262/#sec-number.min_safe_integer
            _export({ target: 'Number', stat: true }, {
              MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
            });

            // `Number.parseFloat` method
            // https://tc39.github.io/ecma262/#sec-number.parseFloat
            _export({ target: 'Number', stat: true, forced: Number.parseFloat != _parseFloat }, {
              parseFloat: _parseFloat
            });

            // `Number.parseInt` method
            // https://tc39.github.io/ecma262/#sec-number.parseint
            _export({ target: 'Number', stat: true, forced: Number.parseInt != _parseInt }, {
              parseInt: _parseInt
            });

            // `thisNumberValue` abstract operation
            // https://tc39.github.io/ecma262/#sec-thisnumbervalue
            var thisNumberValue = function (value) {
              if (typeof value != 'number' && classofRaw(value) != 'Number') {
                throw TypeError('Incorrect invocation');
              }
              return +value;
            };

            var nativeToFixed = 1.0.toFixed;
            var floor$3 = Math.floor;

            var pow = function (x, n, acc) {
              return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
            };

            var log = function (x) {
              var n = 0;
              var x2 = x;
              while (x2 >= 4096) {
                n += 12;
                x2 /= 4096;
              }
              while (x2 >= 2) {
                n += 1;
                x2 /= 2;
              } return n;
            };

            var FORCED$8 = nativeToFixed && (
              0.00008.toFixed(3) !== '0.000' ||
              0.9.toFixed(0) !== '1' ||
              1.255.toFixed(2) !== '1.25' ||
              1000000000000000128.0.toFixed(0) !== '1000000000000000128'
            ) || !fails(function () {
              // V8 ~ Android 4.3-
              nativeToFixed.call({});
            });

            // `Number.prototype.toFixed` method
            // https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
            _export({ target: 'Number', proto: true, forced: FORCED$8 }, {
              // eslint-disable-next-line max-statements
              toFixed: function toFixed(fractionDigits) {
                var number = thisNumberValue(this);
                var fractDigits = toInteger(fractionDigits);
                var data = [0, 0, 0, 0, 0, 0];
                var sign = '';
                var result = '0';
                var e, z, j, k;

                var multiply = function (n, c) {
                  var index = -1;
                  var c2 = c;
                  while (++index < 6) {
                    c2 += n * data[index];
                    data[index] = c2 % 1e7;
                    c2 = floor$3(c2 / 1e7);
                  }
                };

                var divide = function (n) {
                  var index = 6;
                  var c = 0;
                  while (--index >= 0) {
                    c += data[index];
                    data[index] = floor$3(c / n);
                    c = (c % n) * 1e7;
                  }
                };

                var dataToString = function () {
                  var index = 6;
                  var s = '';
                  while (--index >= 0) {
                    if (s !== '' || index === 0 || data[index] !== 0) {
                      var t = String(data[index]);
                      s = s === '' ? t : s + stringRepeat.call('0', 7 - t.length) + t;
                    }
                  } return s;
                };

                if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
                // eslint-disable-next-line no-self-compare
                if (number != number) return 'NaN';
                if (number <= -1e21 || number >= 1e21) return String(number);
                if (number < 0) {
                  sign = '-';
                  number = -number;
                }
                if (number > 1e-21) {
                  e = log(number * pow(2, 69, 1)) - 69;
                  z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
                  z *= 0x10000000000000;
                  e = 52 - e;
                  if (e > 0) {
                    multiply(0, z);
                    j = fractDigits;
                    while (j >= 7) {
                      multiply(1e7, 0);
                      j -= 7;
                    }
                    multiply(pow(10, j, 1), 0);
                    j = e - 1;
                    while (j >= 23) {
                      divide(1 << 23);
                      j -= 23;
                    }
                    divide(1 << j);
                    multiply(1, 1);
                    divide(2);
                    result = dataToString();
                  } else {
                    multiply(0, z);
                    multiply(1 << -e, 0);
                    result = dataToString() + stringRepeat.call('0', fractDigits);
                  }
                }
                if (fractDigits > 0) {
                  k = result.length;
                  result = sign + (k <= fractDigits
                    ? '0.' + stringRepeat.call('0', fractDigits - k) + result
                    : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
                } else {
                  result = sign + result;
                } return result;
              }
            });

            var nativeToPrecision = 1.0.toPrecision;

            var FORCED$9 = fails(function () {
              // IE7-
              return nativeToPrecision.call(1, undefined) !== '1';
            }) || !fails(function () {
              // V8 ~ Android 4.3-
              nativeToPrecision.call({});
            });

            // `Number.prototype.toPrecision` method
            // https://tc39.github.io/ecma262/#sec-number.prototype.toprecision
            _export({ target: 'Number', proto: true, forced: FORCED$9 }, {
              toPrecision: function toPrecision(precision) {
                return precision === undefined
                  ? nativeToPrecision.call(thisNumberValue(this))
                  : nativeToPrecision.call(thisNumberValue(this), precision);
              }
            });

            var log$1 = Math.log;

            // `Math.log1p` method implementation
            // https://tc39.github.io/ecma262/#sec-math.log1p
            var mathLog1p = Math.log1p || function log1p(x) {
              return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log$1(1 + x);
            };

            var nativeAcosh = Math.acosh;
            var log$2 = Math.log;
            var sqrt = Math.sqrt;
            var LN2 = Math.LN2;

            var FORCED$a = !nativeAcosh
              // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
              || Math.floor(nativeAcosh(Number.MAX_VALUE)) != 710
              // Tor Browser bug: Math.acosh(Infinity) -> NaN
              || nativeAcosh(Infinity) != Infinity;

            // `Math.acosh` method
            // https://tc39.github.io/ecma262/#sec-math.acosh
            _export({ target: 'Math', stat: true, forced: FORCED$a }, {
              acosh: function acosh(x) {
                return (x = +x) < 1 ? NaN : x > 94906265.62425156
                  ? log$2(x) + LN2
                  : mathLog1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
              }
            });

            var nativeAsinh = Math.asinh;
            var log$3 = Math.log;
            var sqrt$1 = Math.sqrt;

            function asinh(x) {
              return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log$3(x + sqrt$1(x * x + 1));
            }

            // `Math.asinh` method
            // https://tc39.github.io/ecma262/#sec-math.asinh
            // Tor Browser bug: Math.asinh(0) -> -0
            _export({ target: 'Math', stat: true, forced: !(nativeAsinh && 1 / nativeAsinh(0) > 0) }, {
              asinh: asinh
            });

            var nativeAtanh = Math.atanh;
            var log$4 = Math.log;

            // `Math.atanh` method
            // https://tc39.github.io/ecma262/#sec-math.atanh
            // Tor Browser bug: Math.atanh(-0) -> 0
            _export({ target: 'Math', stat: true, forced: !(nativeAtanh && 1 / nativeAtanh(-0) < 0) }, {
              atanh: function atanh(x) {
                return (x = +x) == 0 ? x : log$4((1 + x) / (1 - x)) / 2;
              }
            });

            // `Math.sign` method implementation
            // https://tc39.github.io/ecma262/#sec-math.sign
            var mathSign = Math.sign || function sign(x) {
              // eslint-disable-next-line no-self-compare
              return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
            };

            var abs$1 = Math.abs;
            var pow$1 = Math.pow;

            // `Math.cbrt` method
            // https://tc39.github.io/ecma262/#sec-math.cbrt
            _export({ target: 'Math', stat: true }, {
              cbrt: function cbrt(x) {
                return mathSign(x = +x) * pow$1(abs$1(x), 1 / 3);
              }
            });

            var floor$4 = Math.floor;
            var log$5 = Math.log;
            var LOG2E = Math.LOG2E;

            // `Math.clz32` method
            // https://tc39.github.io/ecma262/#sec-math.clz32
            _export({ target: 'Math', stat: true }, {
              clz32: function clz32(x) {
                return (x >>>= 0) ? 31 - floor$4(log$5(x + 0.5) * LOG2E) : 32;
              }
            });

            var nativeExpm1 = Math.expm1;
            var exp = Math.exp;

            // `Math.expm1` method implementation
            // https://tc39.github.io/ecma262/#sec-math.expm1
            var mathExpm1 = (!nativeExpm1
              // Old FF bug
              || nativeExpm1(10) > 22025.465794806719 || nativeExpm1(10) < 22025.4657948067165168
              // Tor Browser bug
              || nativeExpm1(-2e-17) != -2e-17
            ) ? function expm1(x) {
              return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
            } : nativeExpm1;

            var nativeCosh = Math.cosh;
            var abs$2 = Math.abs;
            var E = Math.E;

            // `Math.cosh` method
            // https://tc39.github.io/ecma262/#sec-math.cosh
            _export({ target: 'Math', stat: true, forced: !nativeCosh || nativeCosh(710) === Infinity }, {
              cosh: function cosh(x) {
                var t = mathExpm1(abs$2(x) - 1) + 1;
                return (t + 1 / (t * E * E)) * (E / 2);
              }
            });

            // `Math.expm1` method
            // https://tc39.github.io/ecma262/#sec-math.expm1
            _export({ target: 'Math', stat: true, forced: mathExpm1 != Math.expm1 }, { expm1: mathExpm1 });

            var abs$3 = Math.abs;
            var pow$2 = Math.pow;
            var EPSILON = pow$2(2, -52);
            var EPSILON32 = pow$2(2, -23);
            var MAX32 = pow$2(2, 127) * (2 - EPSILON32);
            var MIN32 = pow$2(2, -126);

            var roundTiesToEven = function (n) {
              return n + 1 / EPSILON - 1 / EPSILON;
            };

            // `Math.fround` method implementation
            // https://tc39.github.io/ecma262/#sec-math.fround
            var mathFround = Math.fround || function fround(x) {
              var $abs = abs$3(x);
              var $sign = mathSign(x);
              var a, result;
              if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
              a = (1 + EPSILON32 / EPSILON) * $abs;
              result = a - (a - $abs);
              // eslint-disable-next-line no-self-compare
              if (result > MAX32 || result != result) return $sign * Infinity;
              return $sign * result;
            };

            // `Math.fround` method
            // https://tc39.github.io/ecma262/#sec-math.fround
            _export({ target: 'Math', stat: true }, { fround: mathFround });

            var $hypot = Math.hypot;
            var abs$4 = Math.abs;
            var sqrt$2 = Math.sqrt;

            // Chrome 77 bug
            // https://bugs.chromium.org/p/v8/issues/detail?id=9546
            var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

            // `Math.hypot` method
            // https://tc39.github.io/ecma262/#sec-math.hypot
            _export({ target: 'Math', stat: true, forced: BUGGY }, {
              hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
                var sum = 0;
                var i = 0;
                var aLen = arguments.length;
                var larg = 0;
                var arg, div;
                while (i < aLen) {
                  arg = abs$4(arguments[i++]);
                  if (larg < arg) {
                    div = larg / arg;
                    sum = sum * div * div + 1;
                    larg = arg;
                  } else if (arg > 0) {
                    div = arg / larg;
                    sum += div * div;
                  } else sum += arg;
                }
                return larg === Infinity ? Infinity : larg * sqrt$2(sum);
              }
            });

            var nativeImul = Math.imul;

            var FORCED$b = fails(function () {
              return nativeImul(0xFFFFFFFF, 5) != -5 || nativeImul.length != 2;
            });

            // `Math.imul` method
            // https://tc39.github.io/ecma262/#sec-math.imul
            // some WebKit versions fails with big numbers, some has wrong arity
            _export({ target: 'Math', stat: true, forced: FORCED$b }, {
              imul: function imul(x, y) {
                var UINT16 = 0xFFFF;
                var xn = +x;
                var yn = +y;
                var xl = UINT16 & xn;
                var yl = UINT16 & yn;
                return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
              }
            });

            var log$6 = Math.log;
            var LOG10E = Math.LOG10E;

            // `Math.log10` method
            // https://tc39.github.io/ecma262/#sec-math.log10
            _export({ target: 'Math', stat: true }, {
              log10: function log10(x) {
                return log$6(x) * LOG10E;
              }
            });

            // `Math.log1p` method
            // https://tc39.github.io/ecma262/#sec-math.log1p
            _export({ target: 'Math', stat: true }, { log1p: mathLog1p });

            var log$7 = Math.log;
            var LN2$1 = Math.LN2;

            // `Math.log2` method
            // https://tc39.github.io/ecma262/#sec-math.log2
            _export({ target: 'Math', stat: true }, {
              log2: function log2(x) {
                return log$7(x) / LN2$1;
              }
            });

            // `Math.sign` method
            // https://tc39.github.io/ecma262/#sec-math.sign
            _export({ target: 'Math', stat: true }, {
              sign: mathSign
            });

            var abs$5 = Math.abs;
            var exp$1 = Math.exp;
            var E$1 = Math.E;

            var FORCED$c = fails(function () {
              return Math.sinh(-2e-17) != -2e-17;
            });

            // `Math.sinh` method
            // https://tc39.github.io/ecma262/#sec-math.sinh
            // V8 near Chromium 38 has a problem with very small numbers
            _export({ target: 'Math', stat: true, forced: FORCED$c }, {
              sinh: function sinh(x) {
                return abs$5(x = +x) < 1 ? (mathExpm1(x) - mathExpm1(-x)) / 2 : (exp$1(x - 1) - exp$1(-x - 1)) * (E$1 / 2);
              }
            });

            var exp$2 = Math.exp;

            // `Math.tanh` method
            // https://tc39.github.io/ecma262/#sec-math.tanh
            _export({ target: 'Math', stat: true }, {
              tanh: function tanh(x) {
                var a = mathExpm1(x = +x);
                var b = mathExpm1(-x);
                return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp$2(x) + exp$2(-x));
              }
            });

            // Math[@@toStringTag] property
            // https://tc39.github.io/ecma262/#sec-math-@@tostringtag
            setToStringTag(Math, 'Math', true);

            var ceil$2 = Math.ceil;
            var floor$5 = Math.floor;

            // `Math.trunc` method
            // https://tc39.github.io/ecma262/#sec-math.trunc
            _export({ target: 'Math', stat: true }, {
              trunc: function trunc(it) {
                return (it > 0 ? floor$5 : ceil$2)(it);
              }
            });

            // `Date.now` method
            // https://tc39.github.io/ecma262/#sec-date.now
            _export({ target: 'Date', stat: true }, {
              now: function now() {
                return new Date().getTime();
              }
            });

            var FORCED$d = fails(function () {
              return new Date(NaN).toJSON() !== null
                || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
            });

            // `Date.prototype.toJSON` method
            // https://tc39.github.io/ecma262/#sec-date.prototype.tojson
            _export({ target: 'Date', proto: true, forced: FORCED$d }, {
              // eslint-disable-next-line no-unused-vars
              toJSON: function toJSON(key) {
                var O = toObject(this);
                var pv = toPrimitive(O);
                return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
              }
            });

            var padStart = stringPad.start;

            var abs$6 = Math.abs;
            var DatePrototype = Date.prototype;
            var getTime = DatePrototype.getTime;
            var nativeDateToISOString = DatePrototype.toISOString;

            // `Date.prototype.toISOString` method implementation
            // https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
            // PhantomJS / old WebKit fails here:
            var dateToIsoString = (fails(function () {
              return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
            }) || !fails(function () {
              nativeDateToISOString.call(new Date(NaN));
            })) ? function toISOString() {
              if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
              var date = this;
              var year = date.getUTCFullYear();
              var milliseconds = date.getUTCMilliseconds();
              var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
              return sign + padStart(abs$6(year), sign ? 6 : 4, 0) +
                '-' + padStart(date.getUTCMonth() + 1, 2, 0) +
                '-' + padStart(date.getUTCDate(), 2, 0) +
                'T' + padStart(date.getUTCHours(), 2, 0) +
                ':' + padStart(date.getUTCMinutes(), 2, 0) +
                ':' + padStart(date.getUTCSeconds(), 2, 0) +
                '.' + padStart(milliseconds, 3, 0) +
                'Z';
            } : nativeDateToISOString;

            // `Date.prototype.toISOString` method
            // https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
            // PhantomJS / old WebKit has a broken implementations
            _export({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== dateToIsoString }, {
              toISOString: dateToIsoString
            });

            var DatePrototype$1 = Date.prototype;
            var INVALID_DATE = 'Invalid Date';
            var TO_STRING$1 = 'toString';
            var nativeDateToString = DatePrototype$1[TO_STRING$1];
            var getTime$1 = DatePrototype$1.getTime;

            // `Date.prototype.toString` method
            // https://tc39.github.io/ecma262/#sec-date.prototype.tostring
            if (new Date(NaN) + '' != INVALID_DATE) {
              redefine(DatePrototype$1, TO_STRING$1, function toString() {
                var value = getTime$1.call(this);
                // eslint-disable-next-line no-self-compare
                return value === value ? nativeDateToString.call(this) : INVALID_DATE;
              });
            }

            var dateToPrimitive = function (hint) {
              if (hint !== 'string' && hint !== 'number' && hint !== 'default') {
                throw TypeError('Incorrect hint');
              } return toPrimitive(anObject(this), hint !== 'number');
            };

            var TO_PRIMITIVE$1 = wellKnownSymbol('toPrimitive');
            var DatePrototype$2 = Date.prototype;

            // `Date.prototype[@@toPrimitive]` method
            // https://tc39.github.io/ecma262/#sec-date.prototype-@@toprimitive
            if (!(TO_PRIMITIVE$1 in DatePrototype$2)) {
              createNonEnumerableProperty(DatePrototype$2, TO_PRIMITIVE$1, dateToPrimitive);
            }

            var $stringify$1 = getBuiltIn('JSON', 'stringify');
            var re = /[\uD800-\uDFFF]/g;
            var low = /^[\uD800-\uDBFF]$/;
            var hi = /^[\uDC00-\uDFFF]$/;

            var fix = function (match, offset, string) {
              var prev = string.charAt(offset - 1);
              var next = string.charAt(offset + 1);
              if ((low.test(match) && !hi.test(next)) || (hi.test(match) && !low.test(prev))) {
                return '\\u' + match.charCodeAt(0).toString(16);
              } return match;
            };

            var FORCED$e = fails(function () {
              return $stringify$1('\uDF06\uD834') !== '"\\udf06\\ud834"'
                || $stringify$1('\uDEAD') !== '"\\udead"';
            });

            if ($stringify$1) {
              // https://github.com/tc39/proposal-well-formed-stringify
              _export({ target: 'JSON', stat: true, forced: FORCED$e }, {
                // eslint-disable-next-line no-unused-vars
                stringify: function stringify(it, replacer, space) {
                  var result = $stringify$1.apply(null, arguments);
                  return typeof result == 'string' ? result.replace(re, fix) : result;
                }
              });
            }

            // JSON[@@toStringTag] property
            // https://tc39.github.io/ecma262/#sec-json-@@tostringtag
            setToStringTag(global_1.JSON, 'JSON', true);

            var nativePromiseConstructor = global_1.Promise;

            var redefineAll = function (target, src, options) {
              for (var key in src) redefine(target, key, src[key], options);
              return target;
            };

            var anInstance = function (it, Constructor, name) {
              if (!(it instanceof Constructor)) {
                throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
              } return it;
            };

            var isIos = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);

            var location = global_1.location;
            var set$1 = global_1.setImmediate;
            var clear = global_1.clearImmediate;
            var process$1 = global_1.process;
            var MessageChannel = global_1.MessageChannel;
            var Dispatch = global_1.Dispatch;
            var counter = 0;
            var queue = {};
            var ONREADYSTATECHANGE = 'onreadystatechange';
            var defer, channel, port;

            var run = function (id) {
              // eslint-disable-next-line no-prototype-builtins
              if (queue.hasOwnProperty(id)) {
                var fn = queue[id];
                delete queue[id];
                fn();
              }
            };

            var runner = function (id) {
              return function () {
                run(id);
              };
            };

            var listener = function (event) {
              run(event.data);
            };

            var post = function (id) {
              // old engines have not location.origin
              global_1.postMessage(id + '', location.protocol + '//' + location.host);
            };

            // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
            if (!set$1 || !clear) {
              set$1 = function setImmediate(fn) {
                var args = [];
                var i = 1;
                while (arguments.length > i) args.push(arguments[i++]);
                queue[++counter] = function () {
                  // eslint-disable-next-line no-new-func
                  (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
                };
                defer(counter);
                return counter;
              };
              clear = function clearImmediate(id) {
                delete queue[id];
              };
              // Node.js 0.8-
              if (classofRaw(process$1) == 'process') {
                defer = function (id) {
                  process$1.nextTick(runner(id));
                };
              // Sphere (JS game engine) Dispatch API
              } else if (Dispatch && Dispatch.now) {
                defer = function (id) {
                  Dispatch.now(runner(id));
                };
              // Browsers with MessageChannel, includes WebWorkers
              // except iOS - https://github.com/zloirock/core-js/issues/624
              } else if (MessageChannel && !isIos) {
                channel = new MessageChannel();
                port = channel.port2;
                channel.port1.onmessage = listener;
                defer = bindContext(port.postMessage, port, 1);
              // Browsers with postMessage, skip WebWorkers
              // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
              } else if (global_1.addEventListener && typeof postMessage == 'function' && !global_1.importScripts && !fails(post)) {
                defer = post;
                global_1.addEventListener('message', listener, false);
              // IE8-
              } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
                defer = function (id) {
                  html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
                    html.removeChild(this);
                    run(id);
                  };
                };
              // Rest old browsers
              } else {
                defer = function (id) {
                  setTimeout(runner(id), 0);
                };
              }
            }

            var task = {
              set: set$1,
              clear: clear
            };

            var getOwnPropertyDescriptor$7 = objectGetOwnPropertyDescriptor.f;

            var macrotask = task.set;


            var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
            var process$2 = global_1.process;
            var Promise$1 = global_1.Promise;
            var IS_NODE = classofRaw(process$2) == 'process';
            // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
            var queueMicrotaskDescriptor = getOwnPropertyDescriptor$7(global_1, 'queueMicrotask');
            var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

            var flush, head, last, notify, toggle, node, promise, then;

            // modern engines have queueMicrotask method
            if (!queueMicrotask) {
              flush = function () {
                var parent, fn;
                if (IS_NODE && (parent = process$2.domain)) parent.exit();
                while (head) {
                  fn = head.fn;
                  head = head.next;
                  try {
                    fn();
                  } catch (error) {
                    if (head) notify();
                    else last = undefined;
                    throw error;
                  }
                } last = undefined;
                if (parent) parent.enter();
              };

              // Node.js
              if (IS_NODE) {
                notify = function () {
                  process$2.nextTick(flush);
                };
              // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
              } else if (MutationObserver && !isIos) {
                toggle = true;
                node = document.createTextNode('');
                new MutationObserver(flush).observe(node, { characterData: true });
                notify = function () {
                  node.data = toggle = !toggle;
                };
              // environments with maybe non-completely correct, but existent Promise
              } else if (Promise$1 && Promise$1.resolve) {
                // Promise.resolve without an argument throws an error in LG WebOS 2
                promise = Promise$1.resolve(undefined);
                then = promise.then;
                notify = function () {
                  then.call(promise, flush);
                };
              // for other environments - macrotask based on:
              // - setImmediate
              // - MessageChannel
              // - window.postMessag
              // - onreadystatechange
              // - setTimeout
              } else {
                notify = function () {
                  // strange IE + webpack dev server bug - use .call(global)
                  macrotask.call(global_1, flush);
                };
              }
            }

            var microtask = queueMicrotask || function (fn) {
              var task$$1 = { fn: fn, next: undefined };
              if (last) last.next = task$$1;
              if (!head) {
                head = task$$1;
                notify();
              } last = task$$1;
            };

            var PromiseCapability = function (C) {
              var resolve, reject;
              this.promise = new C(function ($$resolve, $$reject) {
                if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
                resolve = $$resolve;
                reject = $$reject;
              });
              this.resolve = aFunction$1(resolve);
              this.reject = aFunction$1(reject);
            };

            // 25.4.1.5 NewPromiseCapability(C)
            var f$7 = function (C) {
              return new PromiseCapability(C);
            };

            var newPromiseCapability = {
            	f: f$7
            };

            var promiseResolve = function (C, x) {
              anObject(C);
              if (isObject(x) && x.constructor === C) return x;
              var promiseCapability = newPromiseCapability.f(C);
              var resolve = promiseCapability.resolve;
              resolve(x);
              return promiseCapability.promise;
            };

            var hostReportErrors = function (a, b) {
              var console = global_1.console;
              if (console && console.error) {
                arguments.length === 1 ? console.error(a) : console.error(a, b);
              }
            };

            var perform = function (exec) {
              try {
                return { error: false, value: exec() };
              } catch (error) {
                return { error: true, value: error };
              }
            };

            var task$1 = task.set;










            var SPECIES$6 = wellKnownSymbol('species');
            var PROMISE = 'Promise';
            var getInternalState$4 = internalState.get;
            var setInternalState$4 = internalState.set;
            var getInternalPromiseState = internalState.getterFor(PROMISE);
            var PromiseConstructor = nativePromiseConstructor;
            var TypeError$1 = global_1.TypeError;
            var document$2 = global_1.document;
            var process$3 = global_1.process;
            var $fetch = getBuiltIn('fetch');
            var newPromiseCapability$1 = newPromiseCapability.f;
            var newGenericPromiseCapability = newPromiseCapability$1;
            var IS_NODE$1 = classofRaw(process$3) == 'process';
            var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
            var UNHANDLED_REJECTION = 'unhandledrejection';
            var REJECTION_HANDLED = 'rejectionhandled';
            var PENDING = 0;
            var FULFILLED = 1;
            var REJECTED = 2;
            var HANDLED = 1;
            var UNHANDLED = 2;
            var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

            var FORCED$f = isForced_1(PROMISE, function () {
              var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
              if (!GLOBAL_CORE_JS_PROMISE) {
                // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
                // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
                // We can't detect it synchronously, so just check versions
                if (v8Version === 66) return true;
                // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
                if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
              }
              // We can't use @@species feature detection in V8 since it causes
              // deoptimization and performance degradation
              // https://github.com/zloirock/core-js/issues/679
              if (v8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
              // Detect correctness of subclassing with @@species support
              var promise = PromiseConstructor.resolve(1);
              var FakePromise = function (exec) {
                exec(function () { /* empty */ }, function () { /* empty */ });
              };
              var constructor = promise.constructor = {};
              constructor[SPECIES$6] = FakePromise;
              return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
            });

            var INCORRECT_ITERATION$1 = FORCED$f || !checkCorrectnessOfIteration(function (iterable) {
              PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
            });

            // helpers
            var isThenable = function (it) {
              var then;
              return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
            };

            var notify$1 = function (promise, state, isReject) {
              if (state.notified) return;
              state.notified = true;
              var chain = state.reactions;
              microtask(function () {
                var value = state.value;
                var ok = state.state == FULFILLED;
                var index = 0;
                // variable length - can't use forEach
                while (chain.length > index) {
                  var reaction = chain[index++];
                  var handler = ok ? reaction.ok : reaction.fail;
                  var resolve = reaction.resolve;
                  var reject = reaction.reject;
                  var domain = reaction.domain;
                  var result, then, exited;
                  try {
                    if (handler) {
                      if (!ok) {
                        if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
                        state.rejection = HANDLED;
                      }
                      if (handler === true) result = value;
                      else {
                        if (domain) domain.enter();
                        result = handler(value); // can throw
                        if (domain) {
                          domain.exit();
                          exited = true;
                        }
                      }
                      if (result === reaction.promise) {
                        reject(TypeError$1('Promise-chain cycle'));
                      } else if (then = isThenable(result)) {
                        then.call(result, resolve, reject);
                      } else resolve(result);
                    } else reject(value);
                  } catch (error) {
                    if (domain && !exited) domain.exit();
                    reject(error);
                  }
                }
                state.reactions = [];
                state.notified = false;
                if (isReject && !state.rejection) onUnhandled(promise, state);
              });
            };

            var dispatchEvent = function (name, promise, reason) {
              var event, handler;
              if (DISPATCH_EVENT) {
                event = document$2.createEvent('Event');
                event.promise = promise;
                event.reason = reason;
                event.initEvent(name, false, true);
                global_1.dispatchEvent(event);
              } else event = { promise: promise, reason: reason };
              if (handler = global_1['on' + name]) handler(event);
              else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
            };

            var onUnhandled = function (promise, state) {
              task$1.call(global_1, function () {
                var value = state.value;
                var IS_UNHANDLED = isUnhandled(state);
                var result;
                if (IS_UNHANDLED) {
                  result = perform(function () {
                    if (IS_NODE$1) {
                      process$3.emit('unhandledRejection', value, promise);
                    } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
                  });
                  // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
                  state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
                  if (result.error) throw result.value;
                }
              });
            };

            var isUnhandled = function (state) {
              return state.rejection !== HANDLED && !state.parent;
            };

            var onHandleUnhandled = function (promise, state) {
              task$1.call(global_1, function () {
                if (IS_NODE$1) {
                  process$3.emit('rejectionHandled', promise);
                } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
              });
            };

            var bind = function (fn, promise, state, unwrap) {
              return function (value) {
                fn(promise, state, value, unwrap);
              };
            };

            var internalReject = function (promise, state, value, unwrap) {
              if (state.done) return;
              state.done = true;
              if (unwrap) state = unwrap;
              state.value = value;
              state.state = REJECTED;
              notify$1(promise, state, true);
            };

            var internalResolve = function (promise, state, value, unwrap) {
              if (state.done) return;
              state.done = true;
              if (unwrap) state = unwrap;
              try {
                if (promise === value) throw TypeError$1("Promise can't be resolved itself");
                var then = isThenable(value);
                if (then) {
                  microtask(function () {
                    var wrapper = { done: false };
                    try {
                      then.call(value,
                        bind(internalResolve, promise, wrapper, state),
                        bind(internalReject, promise, wrapper, state)
                      );
                    } catch (error) {
                      internalReject(promise, wrapper, error, state);
                    }
                  });
                } else {
                  state.value = value;
                  state.state = FULFILLED;
                  notify$1(promise, state, false);
                }
              } catch (error) {
                internalReject(promise, { done: false }, error, state);
              }
            };

            // constructor polyfill
            if (FORCED$f) {
              // 25.4.3.1 Promise(executor)
              PromiseConstructor = function Promise(executor) {
                anInstance(this, PromiseConstructor, PROMISE);
                aFunction$1(executor);
                Internal.call(this);
                var state = getInternalState$4(this);
                try {
                  executor(bind(internalResolve, this, state), bind(internalReject, this, state));
                } catch (error) {
                  internalReject(this, state, error);
                }
              };
              // eslint-disable-next-line no-unused-vars
              Internal = function Promise(executor) {
                setInternalState$4(this, {
                  type: PROMISE,
                  done: false,
                  notified: false,
                  parent: false,
                  reactions: [],
                  rejection: false,
                  state: PENDING,
                  value: undefined
                });
              };
              Internal.prototype = redefineAll(PromiseConstructor.prototype, {
                // `Promise.prototype.then` method
                // https://tc39.github.io/ecma262/#sec-promise.prototype.then
                then: function then(onFulfilled, onRejected) {
                  var state = getInternalPromiseState(this);
                  var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
                  reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
                  reaction.fail = typeof onRejected == 'function' && onRejected;
                  reaction.domain = IS_NODE$1 ? process$3.domain : undefined;
                  state.parent = true;
                  state.reactions.push(reaction);
                  if (state.state != PENDING) notify$1(this, state, false);
                  return reaction.promise;
                },
                // `Promise.prototype.catch` method
                // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
                'catch': function (onRejected) {
                  return this.then(undefined, onRejected);
                }
              });
              OwnPromiseCapability = function () {
                var promise = new Internal();
                var state = getInternalState$4(promise);
                this.promise = promise;
                this.resolve = bind(internalResolve, promise, state);
                this.reject = bind(internalReject, promise, state);
              };
              newPromiseCapability.f = newPromiseCapability$1 = function (C) {
                return C === PromiseConstructor || C === PromiseWrapper
                  ? new OwnPromiseCapability(C)
                  : newGenericPromiseCapability(C);
              };

              if (typeof nativePromiseConstructor == 'function') {
                nativeThen = nativePromiseConstructor.prototype.then;

                // wrap native Promise#then for native async functions
                redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
                  var that = this;
                  return new PromiseConstructor(function (resolve, reject) {
                    nativeThen.call(that, resolve, reject);
                  }).then(onFulfilled, onRejected);
                // https://github.com/zloirock/core-js/issues/640
                }, { unsafe: true });

                // wrap fetch result
                if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
                  // eslint-disable-next-line no-unused-vars
                  fetch: function fetch(input /* , init */) {
                    return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
                  }
                });
              }
            }

            _export({ global: true, wrap: true, forced: FORCED$f }, {
              Promise: PromiseConstructor
            });

            setToStringTag(PromiseConstructor, PROMISE, false, true);
            setSpecies(PROMISE);

            PromiseWrapper = getBuiltIn(PROMISE);

            // statics
            _export({ target: PROMISE, stat: true, forced: FORCED$f }, {
              // `Promise.reject` method
              // https://tc39.github.io/ecma262/#sec-promise.reject
              reject: function reject(r) {
                var capability = newPromiseCapability$1(this);
                capability.reject.call(undefined, r);
                return capability.promise;
              }
            });

            _export({ target: PROMISE, stat: true, forced: FORCED$f }, {
              // `Promise.resolve` method
              // https://tc39.github.io/ecma262/#sec-promise.resolve
              resolve: function resolve(x) {
                return promiseResolve(this, x);
              }
            });

            _export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
              // `Promise.all` method
              // https://tc39.github.io/ecma262/#sec-promise.all
              all: function all(iterable) {
                var C = this;
                var capability = newPromiseCapability$1(C);
                var resolve = capability.resolve;
                var reject = capability.reject;
                var result = perform(function () {
                  var $promiseResolve = aFunction$1(C.resolve);
                  var values = [];
                  var counter = 0;
                  var remaining = 1;
                  iterate_1(iterable, function (promise) {
                    var index = counter++;
                    var alreadyCalled = false;
                    values.push(undefined);
                    remaining++;
                    $promiseResolve.call(C, promise).then(function (value) {
                      if (alreadyCalled) return;
                      alreadyCalled = true;
                      values[index] = value;
                      --remaining || resolve(values);
                    }, reject);
                  });
                  --remaining || resolve(values);
                });
                if (result.error) reject(result.value);
                return capability.promise;
              },
              // `Promise.race` method
              // https://tc39.github.io/ecma262/#sec-promise.race
              race: function race(iterable) {
                var C = this;
                var capability = newPromiseCapability$1(C);
                var reject = capability.reject;
                var result = perform(function () {
                  var $promiseResolve = aFunction$1(C.resolve);
                  iterate_1(iterable, function (promise) {
                    $promiseResolve.call(C, promise).then(capability.resolve, reject);
                  });
                });
                if (result.error) reject(result.value);
                return capability.promise;
              }
            });

            // `Promise.allSettled` method
            // https://github.com/tc39/proposal-promise-allSettled
            _export({ target: 'Promise', stat: true }, {
              allSettled: function allSettled(iterable) {
                var C = this;
                var capability = newPromiseCapability.f(C);
                var resolve = capability.resolve;
                var reject = capability.reject;
                var result = perform(function () {
                  var promiseResolve = aFunction$1(C.resolve);
                  var values = [];
                  var counter = 0;
                  var remaining = 1;
                  iterate_1(iterable, function (promise) {
                    var index = counter++;
                    var alreadyCalled = false;
                    values.push(undefined);
                    remaining++;
                    promiseResolve.call(C, promise).then(function (value) {
                      if (alreadyCalled) return;
                      alreadyCalled = true;
                      values[index] = { status: 'fulfilled', value: value };
                      --remaining || resolve(values);
                    }, function (e) {
                      if (alreadyCalled) return;
                      alreadyCalled = true;
                      values[index] = { status: 'rejected', reason: e };
                      --remaining || resolve(values);
                    });
                  });
                  --remaining || resolve(values);
                });
                if (result.error) reject(result.value);
                return capability.promise;
              }
            });

            // Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
            var NON_GENERIC = !!nativePromiseConstructor && fails(function () {
              nativePromiseConstructor.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
            });

            // `Promise.prototype.finally` method
            // https://tc39.github.io/ecma262/#sec-promise.prototype.finally
            _export({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
              'finally': function (onFinally) {
                var C = speciesConstructor(this, getBuiltIn('Promise'));
                var isFunction = typeof onFinally == 'function';
                return this.then(
                  isFunction ? function (x) {
                    return promiseResolve(C, onFinally()).then(function () { return x; });
                  } : onFinally,
                  isFunction ? function (e) {
                    return promiseResolve(C, onFinally()).then(function () { throw e; });
                  } : onFinally
                );
              }
            });

            // patch native Promise.prototype for native async functions
            if (typeof nativePromiseConstructor == 'function' && !nativePromiseConstructor.prototype['finally']) {
              redefine(nativePromiseConstructor.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);
            }

            var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
              var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
              var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
              var ADDER = IS_MAP ? 'set' : 'add';
              var NativeConstructor = global_1[CONSTRUCTOR_NAME];
              var NativePrototype = NativeConstructor && NativeConstructor.prototype;
              var Constructor = NativeConstructor;
              var exported = {};

              var fixMethod = function (KEY) {
                var nativeMethod = NativePrototype[KEY];
                redefine(NativePrototype, KEY,
                  KEY == 'add' ? function add(value) {
                    nativeMethod.call(this, value === 0 ? 0 : value);
                    return this;
                  } : KEY == 'delete' ? function (key) {
                    return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
                  } : KEY == 'get' ? function get(key) {
                    return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
                  } : KEY == 'has' ? function has(key) {
                    return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
                  } : function set(key, value) {
                    nativeMethod.call(this, key === 0 ? 0 : key, value);
                    return this;
                  }
                );
              };

              // eslint-disable-next-line max-len
              if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
                new NativeConstructor().entries().next();
              })))) {
                // create collection constructor
                Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
                internalMetadata.REQUIRED = true;
              } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
                var instance = new Constructor();
                // early implementations not supports chaining
                var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
                // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
                var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
                // most early implementations doesn't supports iterables, most modern - not close it correctly
                // eslint-disable-next-line no-new
                var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
                // for early implementations -0 and +0 not the same
                var BUGGY_ZERO = !IS_WEAK && fails(function () {
                  // V8 ~ Chromium 42- fails only with 5+ elements
                  var $instance = new NativeConstructor();
                  var index = 5;
                  while (index--) $instance[ADDER](index, index);
                  return !$instance.has(-0);
                });

                if (!ACCEPT_ITERABLES) {
                  Constructor = wrapper(function (dummy, iterable) {
                    anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
                    var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
                    if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
                    return that;
                  });
                  Constructor.prototype = NativePrototype;
                  NativePrototype.constructor = Constructor;
                }

                if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
                  fixMethod('delete');
                  fixMethod('has');
                  IS_MAP && fixMethod('get');
                }

                if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

                // weak collections should not contains .clear method
                if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
              }

              exported[CONSTRUCTOR_NAME] = Constructor;
              _export({ global: true, forced: Constructor != NativeConstructor }, exported);

              setToStringTag(Constructor, CONSTRUCTOR_NAME);

              if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

              return Constructor;
            };

            var defineProperty$7 = objectDefineProperty.f;








            var fastKey = internalMetadata.fastKey;


            var setInternalState$5 = internalState.set;
            var internalStateGetterFor = internalState.getterFor;

            var collectionStrong = {
              getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
                var C = wrapper(function (that, iterable) {
                  anInstance(that, C, CONSTRUCTOR_NAME);
                  setInternalState$5(that, {
                    type: CONSTRUCTOR_NAME,
                    index: objectCreate(null),
                    first: undefined,
                    last: undefined,
                    size: 0
                  });
                  if (!descriptors) that.size = 0;
                  if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
                });

                var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

                var define = function (that, key, value) {
                  var state = getInternalState(that);
                  var entry = getEntry(that, key);
                  var previous, index;
                  // change existing entry
                  if (entry) {
                    entry.value = value;
                  // create new entry
                  } else {
                    state.last = entry = {
                      index: index = fastKey(key, true),
                      key: key,
                      value: value,
                      previous: previous = state.last,
                      next: undefined,
                      removed: false
                    };
                    if (!state.first) state.first = entry;
                    if (previous) previous.next = entry;
                    if (descriptors) state.size++;
                    else that.size++;
                    // add to index
                    if (index !== 'F') state.index[index] = entry;
                  } return that;
                };

                var getEntry = function (that, key) {
                  var state = getInternalState(that);
                  // fast case
                  var index = fastKey(key);
                  var entry;
                  if (index !== 'F') return state.index[index];
                  // frozen object case
                  for (entry = state.first; entry; entry = entry.next) {
                    if (entry.key == key) return entry;
                  }
                };

                redefineAll(C.prototype, {
                  // 23.1.3.1 Map.prototype.clear()
                  // 23.2.3.2 Set.prototype.clear()
                  clear: function clear() {
                    var that = this;
                    var state = getInternalState(that);
                    var data = state.index;
                    var entry = state.first;
                    while (entry) {
                      entry.removed = true;
                      if (entry.previous) entry.previous = entry.previous.next = undefined;
                      delete data[entry.index];
                      entry = entry.next;
                    }
                    state.first = state.last = undefined;
                    if (descriptors) state.size = 0;
                    else that.size = 0;
                  },
                  // 23.1.3.3 Map.prototype.delete(key)
                  // 23.2.3.4 Set.prototype.delete(value)
                  'delete': function (key) {
                    var that = this;
                    var state = getInternalState(that);
                    var entry = getEntry(that, key);
                    if (entry) {
                      var next = entry.next;
                      var prev = entry.previous;
                      delete state.index[entry.index];
                      entry.removed = true;
                      if (prev) prev.next = next;
                      if (next) next.previous = prev;
                      if (state.first == entry) state.first = next;
                      if (state.last == entry) state.last = prev;
                      if (descriptors) state.size--;
                      else that.size--;
                    } return !!entry;
                  },
                  // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
                  // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
                  forEach: function forEach(callbackfn /* , that = undefined */) {
                    var state = getInternalState(this);
                    var boundFunction = bindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
                    var entry;
                    while (entry = entry ? entry.next : state.first) {
                      boundFunction(entry.value, entry.key, this);
                      // revert to the last existing entry
                      while (entry && entry.removed) entry = entry.previous;
                    }
                  },
                  // 23.1.3.7 Map.prototype.has(key)
                  // 23.2.3.7 Set.prototype.has(value)
                  has: function has(key) {
                    return !!getEntry(this, key);
                  }
                });

                redefineAll(C.prototype, IS_MAP ? {
                  // 23.1.3.6 Map.prototype.get(key)
                  get: function get(key) {
                    var entry = getEntry(this, key);
                    return entry && entry.value;
                  },
                  // 23.1.3.9 Map.prototype.set(key, value)
                  set: function set(key, value) {
                    return define(this, key === 0 ? 0 : key, value);
                  }
                } : {
                  // 23.2.3.1 Set.prototype.add(value)
                  add: function add(value) {
                    return define(this, value = value === 0 ? 0 : value, value);
                  }
                });
                if (descriptors) defineProperty$7(C.prototype, 'size', {
                  get: function () {
                    return getInternalState(this).size;
                  }
                });
                return C;
              },
              setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
                var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
                var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
                var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
                // add .keys, .values, .entries, [@@iterator]
                // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
                defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
                  setInternalState$5(this, {
                    type: ITERATOR_NAME,
                    target: iterated,
                    state: getInternalCollectionState(iterated),
                    kind: kind,
                    last: undefined
                  });
                }, function () {
                  var state = getInternalIteratorState(this);
                  var kind = state.kind;
                  var entry = state.last;
                  // revert to the last existing entry
                  while (entry && entry.removed) entry = entry.previous;
                  // get next entry
                  if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
                    // or finish the iteration
                    state.target = undefined;
                    return { value: undefined, done: true };
                  }
                  // return step by kind
                  if (kind == 'keys') return { value: entry.key, done: false };
                  if (kind == 'values') return { value: entry.value, done: false };
                  return { value: [entry.key, entry.value], done: false };
                }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

                // add [@@species], 23.1.2.2, 23.2.2.2
                setSpecies(CONSTRUCTOR_NAME);
              }
            };

            // `Map` constructor
            // https://tc39.github.io/ecma262/#sec-map-objects
            var es_map = collection('Map', function (init) {
              return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
            }, collectionStrong);

            // `Set` constructor
            // https://tc39.github.io/ecma262/#sec-set-objects
            var es_set = collection('Set', function (init) {
              return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
            }, collectionStrong);

            var getWeakData = internalMetadata.getWeakData;








            var setInternalState$6 = internalState.set;
            var internalStateGetterFor$1 = internalState.getterFor;
            var find = arrayIteration.find;
            var findIndex = arrayIteration.findIndex;
            var id$1 = 0;

            // fallback for uncaught frozen keys
            var uncaughtFrozenStore = function (store) {
              return store.frozen || (store.frozen = new UncaughtFrozenStore());
            };

            var UncaughtFrozenStore = function () {
              this.entries = [];
            };

            var findUncaughtFrozen = function (store, key) {
              return find(store.entries, function (it) {
                return it[0] === key;
              });
            };

            UncaughtFrozenStore.prototype = {
              get: function (key) {
                var entry = findUncaughtFrozen(this, key);
                if (entry) return entry[1];
              },
              has: function (key) {
                return !!findUncaughtFrozen(this, key);
              },
              set: function (key, value) {
                var entry = findUncaughtFrozen(this, key);
                if (entry) entry[1] = value;
                else this.entries.push([key, value]);
              },
              'delete': function (key) {
                var index = findIndex(this.entries, function (it) {
                  return it[0] === key;
                });
                if (~index) this.entries.splice(index, 1);
                return !!~index;
              }
            };

            var collectionWeak = {
              getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
                var C = wrapper(function (that, iterable) {
                  anInstance(that, C, CONSTRUCTOR_NAME);
                  setInternalState$6(that, {
                    type: CONSTRUCTOR_NAME,
                    id: id$1++,
                    frozen: undefined
                  });
                  if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
                });

                var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

                var define = function (that, key, value) {
                  var state = getInternalState(that);
                  var data = getWeakData(anObject(key), true);
                  if (data === true) uncaughtFrozenStore(state).set(key, value);
                  else data[state.id] = value;
                  return that;
                };

                redefineAll(C.prototype, {
                  // 23.3.3.2 WeakMap.prototype.delete(key)
                  // 23.4.3.3 WeakSet.prototype.delete(value)
                  'delete': function (key) {
                    var state = getInternalState(this);
                    if (!isObject(key)) return false;
                    var data = getWeakData(key);
                    if (data === true) return uncaughtFrozenStore(state)['delete'](key);
                    return data && has(data, state.id) && delete data[state.id];
                  },
                  // 23.3.3.4 WeakMap.prototype.has(key)
                  // 23.4.3.4 WeakSet.prototype.has(value)
                  has: function has$$1(key) {
                    var state = getInternalState(this);
                    if (!isObject(key)) return false;
                    var data = getWeakData(key);
                    if (data === true) return uncaughtFrozenStore(state).has(key);
                    return data && has(data, state.id);
                  }
                });

                redefineAll(C.prototype, IS_MAP ? {
                  // 23.3.3.3 WeakMap.prototype.get(key)
                  get: function get(key) {
                    var state = getInternalState(this);
                    if (isObject(key)) {
                      var data = getWeakData(key);
                      if (data === true) return uncaughtFrozenStore(state).get(key);
                      return data ? data[state.id] : undefined;
                    }
                  },
                  // 23.3.3.5 WeakMap.prototype.set(key, value)
                  set: function set(key, value) {
                    return define(this, key, value);
                  }
                } : {
                  // 23.4.3.1 WeakSet.prototype.add(value)
                  add: function add(value) {
                    return define(this, value, true);
                  }
                });

                return C;
              }
            };

            var es_weakMap = createCommonjsModule(function (module) {






            var enforceIternalState = internalState.enforce;


            var IS_IE11 = !global_1.ActiveXObject && 'ActiveXObject' in global_1;
            var isExtensible = Object.isExtensible;
            var InternalWeakMap;

            var wrapper = function (init) {
              return function WeakMap() {
                return init(this, arguments.length ? arguments[0] : undefined);
              };
            };

            // `WeakMap` constructor
            // https://tc39.github.io/ecma262/#sec-weakmap-constructor
            var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak);

            // IE11 WeakMap frozen keys fix
            // We can't use feature detection because it crash some old IE builds
            // https://github.com/zloirock/core-js/issues/485
            if (nativeWeakMap && IS_IE11) {
              InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
              internalMetadata.REQUIRED = true;
              var WeakMapPrototype = $WeakMap.prototype;
              var nativeDelete = WeakMapPrototype['delete'];
              var nativeHas = WeakMapPrototype.has;
              var nativeGet = WeakMapPrototype.get;
              var nativeSet = WeakMapPrototype.set;
              redefineAll(WeakMapPrototype, {
                'delete': function (key) {
                  if (isObject(key) && !isExtensible(key)) {
                    var state = enforceIternalState(this);
                    if (!state.frozen) state.frozen = new InternalWeakMap();
                    return nativeDelete.call(this, key) || state.frozen['delete'](key);
                  } return nativeDelete.call(this, key);
                },
                has: function has(key) {
                  if (isObject(key) && !isExtensible(key)) {
                    var state = enforceIternalState(this);
                    if (!state.frozen) state.frozen = new InternalWeakMap();
                    return nativeHas.call(this, key) || state.frozen.has(key);
                  } return nativeHas.call(this, key);
                },
                get: function get(key) {
                  if (isObject(key) && !isExtensible(key)) {
                    var state = enforceIternalState(this);
                    if (!state.frozen) state.frozen = new InternalWeakMap();
                    return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
                  } return nativeGet.call(this, key);
                },
                set: function set(key, value) {
                  if (isObject(key) && !isExtensible(key)) {
                    var state = enforceIternalState(this);
                    if (!state.frozen) state.frozen = new InternalWeakMap();
                    nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
                  } else nativeSet.call(this, key, value);
                  return this;
                }
              });
            }
            });

            // `WeakSet` constructor
            // https://tc39.github.io/ecma262/#sec-weakset-constructor
            collection('WeakSet', function (init) {
              return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
            }, collectionWeak);

            var defineProperty$8 = objectDefineProperty.f;





            var DataView$1 = global_1.DataView;
            var DataViewPrototype = DataView$1 && DataView$1.prototype;
            var Int8Array$1 = global_1.Int8Array;
            var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
            var Uint8ClampedArray = global_1.Uint8ClampedArray;
            var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
            var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
            var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
            var ObjectPrototype$2 = Object.prototype;
            var isPrototypeOf = ObjectPrototype$2.isPrototypeOf;

            var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
            var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
            var NATIVE_ARRAY_BUFFER = !!(global_1.ArrayBuffer && DataView$1);
            // Fixing native typed arrays in Opera Presto crashes the browser, see #595
            var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
            var TYPED_ARRAY_TAG_REQIRED = false;
            var NAME$1;

            var TypedArrayConstructorsList = {
              Int8Array: 1,
              Uint8Array: 1,
              Uint8ClampedArray: 1,
              Int16Array: 2,
              Uint16Array: 2,
              Int32Array: 4,
              Uint32Array: 4,
              Float32Array: 4,
              Float64Array: 8
            };

            var isView = function isView(it) {
              var klass = classof(it);
              return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
            };

            var isTypedArray = function (it) {
              return isObject(it) && has(TypedArrayConstructorsList, classof(it));
            };

            var aTypedArray = function (it) {
              if (isTypedArray(it)) return it;
              throw TypeError('Target is not a typed array');
            };

            var aTypedArrayConstructor = function (C) {
              if (objectSetPrototypeOf) {
                if (isPrototypeOf.call(TypedArray, C)) return C;
              } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME$1)) {
                var TypedArrayConstructor = global_1[ARRAY];
                if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
                  return C;
                }
              } throw TypeError('Target is not a typed array constructor');
            };

            var exportTypedArrayMethod = function (KEY, property, forced) {
              if (!descriptors) return;
              if (forced) for (var ARRAY in TypedArrayConstructorsList) {
                var TypedArrayConstructor = global_1[ARRAY];
                if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
                  delete TypedArrayConstructor.prototype[KEY];
                }
              }
              if (!TypedArrayPrototype[KEY] || forced) {
                redefine(TypedArrayPrototype, KEY, forced ? property
                  : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
              }
            };

            var exportTypedArrayStaticMethod = function (KEY, property, forced) {
              var ARRAY, TypedArrayConstructor;
              if (!descriptors) return;
              if (objectSetPrototypeOf) {
                if (forced) for (ARRAY in TypedArrayConstructorsList) {
                  TypedArrayConstructor = global_1[ARRAY];
                  if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
                    delete TypedArrayConstructor[KEY];
                  }
                }
                if (!TypedArray[KEY] || forced) {
                  // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
                  try {
                    return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
                  } catch (error) { /* empty */ }
                } else return;
              }
              for (ARRAY in TypedArrayConstructorsList) {
                TypedArrayConstructor = global_1[ARRAY];
                if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
                  redefine(TypedArrayConstructor, KEY, property);
                }
              }
            };

            for (NAME$1 in TypedArrayConstructorsList) {
              if (!global_1[NAME$1]) NATIVE_ARRAY_BUFFER_VIEWS = false;
            }

            // WebKit bug - typed arrays constructors prototype is Object.prototype
            if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
              // eslint-disable-next-line no-shadow
              TypedArray = function TypedArray() {
                throw TypeError('Incorrect invocation');
              };
              if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
                if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1], TypedArray);
              }
            }

            if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$2) {
              TypedArrayPrototype = TypedArray.prototype;
              if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME$1 in TypedArrayConstructorsList) {
                if (global_1[NAME$1]) objectSetPrototypeOf(global_1[NAME$1].prototype, TypedArrayPrototype);
              }
            }

            // WebKit bug - one more object in Uint8ClampedArray prototype chain
            if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
              objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
            }

            if (descriptors && !has(TypedArrayPrototype, TO_STRING_TAG$3)) {
              TYPED_ARRAY_TAG_REQIRED = true;
              defineProperty$8(TypedArrayPrototype, TO_STRING_TAG$3, { get: function () {
                return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
              } });
              for (NAME$1 in TypedArrayConstructorsList) if (global_1[NAME$1]) {
                createNonEnumerableProperty(global_1[NAME$1], TYPED_ARRAY_TAG, NAME$1);
              }
            }

            // WebKit bug - the same parent prototype for typed arrays and data view
            if (NATIVE_ARRAY_BUFFER && objectSetPrototypeOf && objectGetPrototypeOf(DataViewPrototype) !== ObjectPrototype$2) {
              objectSetPrototypeOf(DataViewPrototype, ObjectPrototype$2);
            }

            var arrayBufferViewCore = {
              NATIVE_ARRAY_BUFFER: NATIVE_ARRAY_BUFFER,
              NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
              TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
              aTypedArray: aTypedArray,
              aTypedArrayConstructor: aTypedArrayConstructor,
              exportTypedArrayMethod: exportTypedArrayMethod,
              exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
              isView: isView,
              isTypedArray: isTypedArray,
              TypedArray: TypedArray,
              TypedArrayPrototype: TypedArrayPrototype
            };

            // `ToIndex` abstract operation
            // https://tc39.github.io/ecma262/#sec-toindex
            var toIndex = function (it) {
              if (it === undefined) return 0;
              var number = toInteger(it);
              var length = toLength(number);
              if (number !== length) throw RangeError('Wrong length or index');
              return length;
            };

            // IEEE754 conversions based on https://github.com/feross/ieee754
            // eslint-disable-next-line no-shadow-restricted-names
            var Infinity$1 = 1 / 0;
            var abs$7 = Math.abs;
            var pow$3 = Math.pow;
            var floor$6 = Math.floor;
            var log$8 = Math.log;
            var LN2$2 = Math.LN2;

            var pack = function (number, mantissaLength, bytes) {
              var buffer = new Array(bytes);
              var exponentLength = bytes * 8 - mantissaLength - 1;
              var eMax = (1 << exponentLength) - 1;
              var eBias = eMax >> 1;
              var rt = mantissaLength === 23 ? pow$3(2, -24) - pow$3(2, -77) : 0;
              var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
              var index = 0;
              var exponent, mantissa, c;
              number = abs$7(number);
              // eslint-disable-next-line no-self-compare
              if (number != number || number === Infinity$1) {
                // eslint-disable-next-line no-self-compare
                mantissa = number != number ? 1 : 0;
                exponent = eMax;
              } else {
                exponent = floor$6(log$8(number) / LN2$2);
                if (number * (c = pow$3(2, -exponent)) < 1) {
                  exponent--;
                  c *= 2;
                }
                if (exponent + eBias >= 1) {
                  number += rt / c;
                } else {
                  number += rt * pow$3(2, 1 - eBias);
                }
                if (number * c >= 2) {
                  exponent++;
                  c /= 2;
                }
                if (exponent + eBias >= eMax) {
                  mantissa = 0;
                  exponent = eMax;
                } else if (exponent + eBias >= 1) {
                  mantissa = (number * c - 1) * pow$3(2, mantissaLength);
                  exponent = exponent + eBias;
                } else {
                  mantissa = number * pow$3(2, eBias - 1) * pow$3(2, mantissaLength);
                  exponent = 0;
                }
              }
              for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
              exponent = exponent << mantissaLength | mantissa;
              exponentLength += mantissaLength;
              for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
              buffer[--index] |= sign * 128;
              return buffer;
            };

            var unpack = function (buffer, mantissaLength) {
              var bytes = buffer.length;
              var exponentLength = bytes * 8 - mantissaLength - 1;
              var eMax = (1 << exponentLength) - 1;
              var eBias = eMax >> 1;
              var nBits = exponentLength - 7;
              var index = bytes - 1;
              var sign = buffer[index--];
              var exponent = sign & 127;
              var mantissa;
              sign >>= 7;
              for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
              mantissa = exponent & (1 << -nBits) - 1;
              exponent >>= -nBits;
              nBits += mantissaLength;
              for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
              if (exponent === 0) {
                exponent = 1 - eBias;
              } else if (exponent === eMax) {
                return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1;
              } else {
                mantissa = mantissa + pow$3(2, mantissaLength);
                exponent = exponent - eBias;
              } return (sign ? -1 : 1) * mantissa * pow$3(2, exponent - mantissaLength);
            };

            var ieee754 = {
              pack: pack,
              unpack: unpack
            };

            var NATIVE_ARRAY_BUFFER$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER;








            var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
            var defineProperty$9 = objectDefineProperty.f;




            var getInternalState$5 = internalState.get;
            var setInternalState$7 = internalState.set;
            var ARRAY_BUFFER = 'ArrayBuffer';
            var DATA_VIEW = 'DataView';
            var PROTOTYPE$2 = 'prototype';
            var WRONG_LENGTH = 'Wrong length';
            var WRONG_INDEX = 'Wrong index';
            var NativeArrayBuffer = global_1[ARRAY_BUFFER];
            var $ArrayBuffer = NativeArrayBuffer;
            var $DataView = global_1[DATA_VIEW];
            var RangeError$1 = global_1.RangeError;

            var packIEEE754 = ieee754.pack;
            var unpackIEEE754 = ieee754.unpack;

            var packInt8 = function (number) {
              return [number & 0xFF];
            };

            var packInt16 = function (number) {
              return [number & 0xFF, number >> 8 & 0xFF];
            };

            var packInt32 = function (number) {
              return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
            };

            var unpackInt32 = function (buffer) {
              return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
            };

            var packFloat32 = function (number) {
              return packIEEE754(number, 23, 4);
            };

            var packFloat64 = function (number) {
              return packIEEE754(number, 52, 8);
            };

            var addGetter = function (Constructor, key) {
              defineProperty$9(Constructor[PROTOTYPE$2], key, { get: function () { return getInternalState$5(this)[key]; } });
            };

            var get$1 = function (view, count, index, isLittleEndian) {
              var intIndex = toIndex(index);
              var store = getInternalState$5(view);
              if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
              var bytes = getInternalState$5(store.buffer).bytes;
              var start = intIndex + store.byteOffset;
              var pack = bytes.slice(start, start + count);
              return isLittleEndian ? pack : pack.reverse();
            };

            var set$2 = function (view, count, index, conversion, value, isLittleEndian) {
              var intIndex = toIndex(index);
              var store = getInternalState$5(view);
              if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
              var bytes = getInternalState$5(store.buffer).bytes;
              var start = intIndex + store.byteOffset;
              var pack = conversion(+value);
              for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
            };

            if (!NATIVE_ARRAY_BUFFER$1) {
              $ArrayBuffer = function ArrayBuffer(length) {
                anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
                var byteLength = toIndex(length);
                setInternalState$7(this, {
                  bytes: arrayFill.call(new Array(byteLength), 0),
                  byteLength: byteLength
                });
                if (!descriptors) this.byteLength = byteLength;
              };

              $DataView = function DataView(buffer, byteOffset, byteLength) {
                anInstance(this, $DataView, DATA_VIEW);
                anInstance(buffer, $ArrayBuffer, DATA_VIEW);
                var bufferLength = getInternalState$5(buffer).byteLength;
                var offset = toInteger(byteOffset);
                if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
                byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
                if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
                setInternalState$7(this, {
                  buffer: buffer,
                  byteLength: byteLength,
                  byteOffset: offset
                });
                if (!descriptors) {
                  this.buffer = buffer;
                  this.byteLength = byteLength;
                  this.byteOffset = offset;
                }
              };

              if (descriptors) {
                addGetter($ArrayBuffer, 'byteLength');
                addGetter($DataView, 'buffer');
                addGetter($DataView, 'byteLength');
                addGetter($DataView, 'byteOffset');
              }

              redefineAll($DataView[PROTOTYPE$2], {
                getInt8: function getInt8(byteOffset) {
                  return get$1(this, 1, byteOffset)[0] << 24 >> 24;
                },
                getUint8: function getUint8(byteOffset) {
                  return get$1(this, 1, byteOffset)[0];
                },
                getInt16: function getInt16(byteOffset /* , littleEndian */) {
                  var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
                  return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
                },
                getUint16: function getUint16(byteOffset /* , littleEndian */) {
                  var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
                  return bytes[1] << 8 | bytes[0];
                },
                getInt32: function getInt32(byteOffset /* , littleEndian */) {
                  return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
                },
                getUint32: function getUint32(byteOffset /* , littleEndian */) {
                  return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
                },
                getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
                  return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
                },
                getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
                  return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
                },
                setInt8: function setInt8(byteOffset, value) {
                  set$2(this, 1, byteOffset, packInt8, value);
                },
                setUint8: function setUint8(byteOffset, value) {
                  set$2(this, 1, byteOffset, packInt8, value);
                },
                setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
                  set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
                },
                setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
                  set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
                },
                setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
                  set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
                },
                setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
                  set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
                },
                setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
                  set$2(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
                },
                setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
                  set$2(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
                }
              });
            } else {
              if (!fails(function () {
                NativeArrayBuffer(1);
              }) || !fails(function () {
                new NativeArrayBuffer(-1); // eslint-disable-line no-new
              }) || fails(function () {
                new NativeArrayBuffer(); // eslint-disable-line no-new
                new NativeArrayBuffer(1.5); // eslint-disable-line no-new
                new NativeArrayBuffer(NaN); // eslint-disable-line no-new
                return NativeArrayBuffer.name != ARRAY_BUFFER;
              })) {
                $ArrayBuffer = function ArrayBuffer(length) {
                  anInstance(this, $ArrayBuffer);
                  return new NativeArrayBuffer(toIndex(length));
                };
                var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE$2] = NativeArrayBuffer[PROTOTYPE$2];
                for (var keys$3 = getOwnPropertyNames$2(NativeArrayBuffer), j$1 = 0, key$1; keys$3.length > j$1;) {
                  if (!((key$1 = keys$3[j$1++]) in $ArrayBuffer)) {
                    createNonEnumerableProperty($ArrayBuffer, key$1, NativeArrayBuffer[key$1]);
                  }
                }
                ArrayBufferPrototype.constructor = $ArrayBuffer;
              }
              // iOS Safari 7.x bug
              var testView = new $DataView(new $ArrayBuffer(2));
              var nativeSetInt8 = $DataView[PROTOTYPE$2].setInt8;
              testView.setInt8(0, 2147483648);
              testView.setInt8(1, 2147483649);
              if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataView[PROTOTYPE$2], {
                setInt8: function setInt8(byteOffset, value) {
                  nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
                },
                setUint8: function setUint8(byteOffset, value) {
                  nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
                }
              }, { unsafe: true });
            }

            setToStringTag($ArrayBuffer, ARRAY_BUFFER);
            setToStringTag($DataView, DATA_VIEW);

            var arrayBuffer = {
              ArrayBuffer: $ArrayBuffer,
              DataView: $DataView
            };

            var ARRAY_BUFFER$1 = 'ArrayBuffer';
            var ArrayBuffer$1 = arrayBuffer[ARRAY_BUFFER$1];
            var NativeArrayBuffer$1 = global_1[ARRAY_BUFFER$1];

            // `ArrayBuffer` constructor
            // https://tc39.github.io/ecma262/#sec-arraybuffer-constructor
            _export({ global: true, forced: NativeArrayBuffer$1 !== ArrayBuffer$1 }, {
              ArrayBuffer: ArrayBuffer$1
            });

            setSpecies(ARRAY_BUFFER$1);

            var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

            // `ArrayBuffer.isView` method
            // https://tc39.github.io/ecma262/#sec-arraybuffer.isview
            _export({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS$1 }, {
              isView: arrayBufferViewCore.isView
            });

            var ArrayBuffer$2 = arrayBuffer.ArrayBuffer;
            var DataView$2 = arrayBuffer.DataView;
            var nativeArrayBufferSlice = ArrayBuffer$2.prototype.slice;

            var INCORRECT_SLICE = fails(function () {
              return !new ArrayBuffer$2(2).slice(1, undefined).byteLength;
            });

            // `ArrayBuffer.prototype.slice` method
            // https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
            _export({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
              slice: function slice(start, end) {
                if (nativeArrayBufferSlice !== undefined && end === undefined) {
                  return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
                }
                var length = anObject(this).byteLength;
                var first = toAbsoluteIndex(start, length);
                var fin = toAbsoluteIndex(end === undefined ? length : end, length);
                var result = new (speciesConstructor(this, ArrayBuffer$2))(toLength(fin - first));
                var viewSource = new DataView$2(this);
                var viewTarget = new DataView$2(result);
                var index = 0;
                while (first < fin) {
                  viewTarget.setUint8(index++, viewSource.getUint8(first++));
                } return result;
              }
            });

            var NATIVE_ARRAY_BUFFER$2 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER;

            // `DataView` constructor
            // https://tc39.github.io/ecma262/#sec-dataview-constructor
            _export({ global: true, forced: !NATIVE_ARRAY_BUFFER$2 }, {
              DataView: arrayBuffer.DataView
            });

            /* eslint-disable no-new */



            var NATIVE_ARRAY_BUFFER_VIEWS$2 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

            var ArrayBuffer$3 = global_1.ArrayBuffer;
            var Int8Array$2 = global_1.Int8Array;

            var typedArraysConstructorsRequiresWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$2 || !fails(function () {
              Int8Array$2(1);
            }) || !fails(function () {
              new Int8Array$2(-1);
            }) || !checkCorrectnessOfIteration(function (iterable) {
              new Int8Array$2();
              new Int8Array$2(null);
              new Int8Array$2(1.5);
              new Int8Array$2(iterable);
            }, true) || fails(function () {
              // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
              return new Int8Array$2(new ArrayBuffer$3(2), 1, undefined).length !== 1;
            });

            var toPositiveInteger = function (it) {
              var result = toInteger(it);
              if (result < 0) throw RangeError("The argument can't be less than 0");
              return result;
            };

            var toOffset = function (it, BYTES) {
              var offset = toPositiveInteger(it);
              if (offset % BYTES) throw RangeError('Wrong offset');
              return offset;
            };

            var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

            var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
              var O = toObject(source);
              var argumentsLength = arguments.length;
              var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
              var mapping = mapfn !== undefined;
              var iteratorMethod = getIteratorMethod(O);
              var i, length, result, step, iterator, next;
              if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
                iterator = iteratorMethod.call(O);
                next = iterator.next;
                O = [];
                while (!(step = next.call(iterator)).done) {
                  O.push(step.value);
                }
              }
              if (mapping && argumentsLength > 2) {
                mapfn = bindContext(mapfn, arguments[2], 2);
              }
              length = toLength(O.length);
              result = new (aTypedArrayConstructor$1(this))(length);
              for (i = 0; length > i; i++) {
                result[i] = mapping ? mapfn(O[i], i) : O[i];
              }
              return result;
            };

            var typedArrayConstructor = createCommonjsModule(function (module) {


















            var getOwnPropertyNames = objectGetOwnPropertyNames.f;

            var forEach = arrayIteration.forEach;






            var getInternalState = internalState.get;
            var setInternalState = internalState.set;
            var nativeDefineProperty = objectDefineProperty.f;
            var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
            var round = Math.round;
            var RangeError = global_1.RangeError;
            var ArrayBuffer = arrayBuffer.ArrayBuffer;
            var DataView = arrayBuffer.DataView;
            var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
            var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
            var TypedArray = arrayBufferViewCore.TypedArray;
            var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
            var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
            var isTypedArray = arrayBufferViewCore.isTypedArray;
            var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
            var WRONG_LENGTH = 'Wrong length';

            var fromList = function (C, list) {
              var index = 0;
              var length = list.length;
              var result = new (aTypedArrayConstructor(C))(length);
              while (length > index) result[index] = list[index++];
              return result;
            };

            var addGetter = function (it, key) {
              nativeDefineProperty(it, key, { get: function () {
                return getInternalState(this)[key];
              } });
            };

            var isArrayBuffer = function (it) {
              var klass;
              return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
            };

            var isTypedArrayIndex = function (target, key) {
              return isTypedArray(target)
                && typeof key != 'symbol'
                && key in target
                && String(+key) == String(key);
            };

            var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
              return isTypedArrayIndex(target, key = toPrimitive(key, true))
                ? createPropertyDescriptor(2, target[key])
                : nativeGetOwnPropertyDescriptor(target, key);
            };

            var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
              if (isTypedArrayIndex(target, key = toPrimitive(key, true))
                && isObject(descriptor)
                && has(descriptor, 'value')
                && !has(descriptor, 'get')
                && !has(descriptor, 'set')
                // TODO: add validation descriptor w/o calling accessors
                && !descriptor.configurable
                && (!has(descriptor, 'writable') || descriptor.writable)
                && (!has(descriptor, 'enumerable') || descriptor.enumerable)
              ) {
                target[key] = descriptor.value;
                return target;
              } return nativeDefineProperty(target, key, descriptor);
            };

            if (descriptors) {
              if (!NATIVE_ARRAY_BUFFER_VIEWS) {
                objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
                objectDefineProperty.f = wrappedDefineProperty;
                addGetter(TypedArrayPrototype, 'buffer');
                addGetter(TypedArrayPrototype, 'byteOffset');
                addGetter(TypedArrayPrototype, 'byteLength');
                addGetter(TypedArrayPrototype, 'length');
              }

              _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
                getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
                defineProperty: wrappedDefineProperty
              });

              module.exports = function (TYPE, wrapper, CLAMPED) {
                var BYTES = TYPE.match(/\d+$/)[0] / 8;
                var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
                var GETTER = 'get' + TYPE;
                var SETTER = 'set' + TYPE;
                var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
                var TypedArrayConstructor = NativeTypedArrayConstructor;
                var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
                var exported = {};

                var getter = function (that, index) {
                  var data = getInternalState(that);
                  return data.view[GETTER](index * BYTES + data.byteOffset, true);
                };

                var setter = function (that, index, value) {
                  var data = getInternalState(that);
                  if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
                  data.view[SETTER](index * BYTES + data.byteOffset, value, true);
                };

                var addElement = function (that, index) {
                  nativeDefineProperty(that, index, {
                    get: function () {
                      return getter(this, index);
                    },
                    set: function (value) {
                      return setter(this, index, value);
                    },
                    enumerable: true
                  });
                };

                if (!NATIVE_ARRAY_BUFFER_VIEWS) {
                  TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
                    anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
                    var index = 0;
                    var byteOffset = 0;
                    var buffer, byteLength, length;
                    if (!isObject(data)) {
                      length = toIndex(data);
                      byteLength = length * BYTES;
                      buffer = new ArrayBuffer(byteLength);
                    } else if (isArrayBuffer(data)) {
                      buffer = data;
                      byteOffset = toOffset(offset, BYTES);
                      var $len = data.byteLength;
                      if ($length === undefined) {
                        if ($len % BYTES) throw RangeError(WRONG_LENGTH);
                        byteLength = $len - byteOffset;
                        if (byteLength < 0) throw RangeError(WRONG_LENGTH);
                      } else {
                        byteLength = toLength($length) * BYTES;
                        if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
                      }
                      length = byteLength / BYTES;
                    } else if (isTypedArray(data)) {
                      return fromList(TypedArrayConstructor, data);
                    } else {
                      return typedArrayFrom.call(TypedArrayConstructor, data);
                    }
                    setInternalState(that, {
                      buffer: buffer,
                      byteOffset: byteOffset,
                      byteLength: byteLength,
                      length: length,
                      view: new DataView(buffer)
                    });
                    while (index < length) addElement(that, index++);
                  });

                  if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
                  TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
                } else if (typedArraysConstructorsRequiresWrappers) {
                  TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
                    anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
                    return inheritIfRequired(function () {
                      if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
                      if (isArrayBuffer(data)) return $length !== undefined
                        ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
                        : typedArrayOffset !== undefined
                          ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
                          : new NativeTypedArrayConstructor(data);
                      if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
                      return typedArrayFrom.call(TypedArrayConstructor, data);
                    }(), dummy, TypedArrayConstructor);
                  });

                  if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
                  forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
                    if (!(key in TypedArrayConstructor)) {
                      createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
                    }
                  });
                  TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
                }

                if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
                  createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
                }

                if (TYPED_ARRAY_TAG) {
                  createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
                }

                exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

                _export({
                  global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
                }, exported);

                if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
                  createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
                }

                if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
                  createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
                }

                setSpecies(CONSTRUCTOR_NAME);
              };
            } else module.exports = function () { /* empty */ };
            });

            // `Int8Array` constructor
            // https://tc39.github.io/ecma262/#sec-typedarray-objects
            typedArrayConstructor('Int8', function (init) {
              return function Int8Array(data, byteOffset, length) {
                return init(this, data, byteOffset, length);
              };
            });

            // `Uint8Array` constructor
            // https://tc39.github.io/ecma262/#sec-typedarray-objects
            typedArrayConstructor('Uint8', function (init) {
              return function Uint8Array(data, byteOffset, length) {
                return init(this, data, byteOffset, length);
              };
            });

            // `Uint8ClampedArray` constructor
            // https://tc39.github.io/ecma262/#sec-typedarray-objects
            typedArrayConstructor('Uint8', function (init) {
              return function Uint8ClampedArray(data, byteOffset, length) {
                return init(this, data, byteOffset, length);
              };
            }, true);

            // `Int16Array` constructor
            // https://tc39.github.io/ecma262/#sec-typedarray-objects
            typedArrayConstructor('Int16', function (init) {
              return function Int16Array(data, byteOffset, length) {
                return init(this, data, byteOffset, length);
              };
            });

            // `Uint16Array` constructor
            // https://tc39.github.io/ecma262/#sec-typedarray-objects
            typedArrayConstructor('Uint16', function (init) {
              return function Uint16Array(data, byteOffset, length) {
                return init(this, data, byteOffset, length);
              };
            });

            // `Int32Array` constructor
            // https://tc39.github.io/ecma262/#sec-typedarray-objects
            typedArrayConstructor('Int32', function (init) {
              return function Int32Array(data, byteOffset, length) {
                return init(this, data, byteOffset, length);
              };
            });

            // `Uint32Array` constructor
            // https://tc39.github.io/ecma262/#sec-typedarray-objects
            typedArrayConstructor('Uint32', function (init) {
              return function Uint32Array(data, byteOffset, length) {
                return init(this, data, byteOffset, length);
              };
            });

            // `Float32Array` constructor
            // https://tc39.github.io/ecma262/#sec-typedarray-objects
            typedArrayConstructor('Float32', function (init) {
              return function Float32Array(data, byteOffset, length) {
                return init(this, data, byteOffset, length);
              };
            });

            // `Float64Array` constructor
            // https://tc39.github.io/ecma262/#sec-typedarray-objects
            typedArrayConstructor('Float64', function (init) {
              return function Float64Array(data, byteOffset, length) {
                return init(this, data, byteOffset, length);
              };
            });

            var exportTypedArrayStaticMethod$1 = arrayBufferViewCore.exportTypedArrayStaticMethod;


            // `%TypedArray%.from` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.from
            exportTypedArrayStaticMethod$1('from', typedArrayFrom, typedArraysConstructorsRequiresWrappers);

            var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
            var exportTypedArrayStaticMethod$2 = arrayBufferViewCore.exportTypedArrayStaticMethod;

            // `%TypedArray%.of` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.of
            exportTypedArrayStaticMethod$2('of', function of(/* ...items */) {
              var index = 0;
              var length = arguments.length;
              var result = new (aTypedArrayConstructor$2(this))(length);
              while (length > index) result[index] = arguments[index++];
              return result;
            }, typedArraysConstructorsRequiresWrappers);

            var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.copyWithin` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
            exportTypedArrayMethod$1('copyWithin', function copyWithin(target, start /* , end */) {
              return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
            });

            var $every$1 = arrayIteration.every;

            var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.every` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
            exportTypedArrayMethod$2('every', function every(callbackfn /* , thisArg */) {
              return $every$1(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
            });

            var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.fill` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
            // eslint-disable-next-line no-unused-vars
            exportTypedArrayMethod$3('fill', function fill(value /* , start, end */) {
              return arrayFill.apply(aTypedArray$3(this), arguments);
            });

            var $filter$1 = arrayIteration.filter;


            var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
            var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;
            var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.filter` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
            exportTypedArrayMethod$4('filter', function filter(callbackfn /* , thisArg */) {
              var list = $filter$1(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
              var C = speciesConstructor(this, this.constructor);
              var index = 0;
              var length = list.length;
              var result = new (aTypedArrayConstructor$3(C))(length);
              while (length > index) result[index] = list[index++];
              return result;
            });

            var $find$1 = arrayIteration.find;

            var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.find` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
            exportTypedArrayMethod$5('find', function find(predicate /* , thisArg */) {
              return $find$1(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
            });

            var $findIndex$1 = arrayIteration.findIndex;

            var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.findIndex` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
            exportTypedArrayMethod$6('findIndex', function findIndex(predicate /* , thisArg */) {
              return $findIndex$1(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
            });

            var $forEach$2 = arrayIteration.forEach;

            var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.forEach` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
            exportTypedArrayMethod$7('forEach', function forEach(callbackfn /* , thisArg */) {
              $forEach$2(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
            });

            var $includes$1 = arrayIncludes.includes;

            var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.includes` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
            exportTypedArrayMethod$8('includes', function includes(searchElement /* , fromIndex */) {
              return $includes$1(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
            });

            var $indexOf$1 = arrayIncludes.indexOf;

            var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.indexOf` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
            exportTypedArrayMethod$9('indexOf', function indexOf(searchElement /* , fromIndex */) {
              return $indexOf$1(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
            });

            var ITERATOR$5 = wellKnownSymbol('iterator');
            var Uint8Array$1 = global_1.Uint8Array;
            var arrayValues = es_array_iterator.values;
            var arrayKeys = es_array_iterator.keys;
            var arrayEntries = es_array_iterator.entries;
            var aTypedArray$a = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
            var nativeTypedArrayIterator = Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$5];

            var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
              && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

            var typedArrayValues = function values() {
              return arrayValues.call(aTypedArray$a(this));
            };

            // `%TypedArray%.prototype.entries` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
            exportTypedArrayMethod$a('entries', function entries() {
              return arrayEntries.call(aTypedArray$a(this));
            });
            // `%TypedArray%.prototype.keys` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
            exportTypedArrayMethod$a('keys', function keys() {
              return arrayKeys.call(aTypedArray$a(this));
            });
            // `%TypedArray%.prototype.values` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
            exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME);
            // `%TypedArray%.prototype[@@iterator]` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
            exportTypedArrayMethod$a(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

            var aTypedArray$b = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
            var $join = [].join;

            // `%TypedArray%.prototype.join` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
            // eslint-disable-next-line no-unused-vars
            exportTypedArrayMethod$b('join', function join(separator) {
              return $join.apply(aTypedArray$b(this), arguments);
            });

            var aTypedArray$c = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.lastIndexOf` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
            // eslint-disable-next-line no-unused-vars
            exportTypedArrayMethod$c('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
              return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
            });

            var $map$1 = arrayIteration.map;


            var aTypedArray$d = arrayBufferViewCore.aTypedArray;
            var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
            var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.map` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
            exportTypedArrayMethod$d('map', function map(mapfn /* , thisArg */) {
              return $map$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
                return new (aTypedArrayConstructor$4(speciesConstructor(O, O.constructor)))(length);
              });
            });

            var $reduce$1 = arrayReduce.left;

            var aTypedArray$e = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.reduce` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
            exportTypedArrayMethod$e('reduce', function reduce(callbackfn /* , initialValue */) {
              return $reduce$1(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
            });

            var $reduceRight$1 = arrayReduce.right;

            var aTypedArray$f = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.reduceRicht` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
            exportTypedArrayMethod$f('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
              return $reduceRight$1(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
            });

            var aTypedArray$g = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;
            var floor$7 = Math.floor;

            // `%TypedArray%.prototype.reverse` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
            exportTypedArrayMethod$g('reverse', function reverse() {
              var that = this;
              var length = aTypedArray$g(that).length;
              var middle = floor$7(length / 2);
              var index = 0;
              var value;
              while (index < middle) {
                value = that[index];
                that[index++] = that[--length];
                that[length] = value;
              } return that;
            });

            var aTypedArray$h = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

            var FORCED$g = fails(function () {
              // eslint-disable-next-line no-undef
              new Int8Array(1).set({});
            });

            // `%TypedArray%.prototype.set` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
            exportTypedArrayMethod$h('set', function set(arrayLike /* , offset */) {
              aTypedArray$h(this);
              var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
              var length = this.length;
              var src = toObject(arrayLike);
              var len = toLength(src.length);
              var index = 0;
              if (len + offset > length) throw RangeError('Wrong length');
              while (index < len) this[offset + index] = src[index++];
            }, FORCED$g);

            var aTypedArray$i = arrayBufferViewCore.aTypedArray;
            var aTypedArrayConstructor$5 = arrayBufferViewCore.aTypedArrayConstructor;
            var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;
            var $slice = [].slice;

            var FORCED$h = fails(function () {
              // eslint-disable-next-line no-undef
              new Int8Array(1).slice();
            });

            // `%TypedArray%.prototype.slice` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
            exportTypedArrayMethod$i('slice', function slice(start, end) {
              var list = $slice.call(aTypedArray$i(this), start, end);
              var C = speciesConstructor(this, this.constructor);
              var index = 0;
              var length = list.length;
              var result = new (aTypedArrayConstructor$5(C))(length);
              while (length > index) result[index] = list[index++];
              return result;
            }, FORCED$h);

            var $some$1 = arrayIteration.some;

            var aTypedArray$j = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.some` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
            exportTypedArrayMethod$j('some', function some(callbackfn /* , thisArg */) {
              return $some$1(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
            });

            var aTypedArray$k = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
            var $sort = [].sort;

            // `%TypedArray%.prototype.sort` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
            exportTypedArrayMethod$k('sort', function sort(comparefn) {
              return $sort.call(aTypedArray$k(this), comparefn);
            });

            var aTypedArray$l = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

            // `%TypedArray%.prototype.subarray` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
            exportTypedArrayMethod$l('subarray', function subarray(begin, end) {
              var O = aTypedArray$l(this);
              var length = O.length;
              var beginIndex = toAbsoluteIndex(begin, length);
              return new (speciesConstructor(O, O.constructor))(
                O.buffer,
                O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
                toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
              );
            });

            var Int8Array$3 = global_1.Int8Array;
            var aTypedArray$m = arrayBufferViewCore.aTypedArray;
            var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;
            var $toLocaleString = [].toLocaleString;
            var $slice$1 = [].slice;

            // iOS Safari 6.x fails here
            var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails(function () {
              $toLocaleString.call(new Int8Array$3(1));
            });

            var FORCED$i = fails(function () {
              return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
            }) || !fails(function () {
              Int8Array$3.prototype.toLocaleString.call([1, 2]);
            });

            // `%TypedArray%.prototype.toLocaleString` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
            exportTypedArrayMethod$m('toLocaleString', function toLocaleString() {
              return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
            }, FORCED$i);

            var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;



            var Uint8Array$2 = global_1.Uint8Array;
            var Uint8ArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype || {};
            var arrayToString = [].toString;
            var arrayJoin = [].join;

            if (fails(function () { arrayToString.call({}); })) {
              arrayToString = function toString() {
                return arrayJoin.call(this);
              };
            }

            var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

            // `%TypedArray%.prototype.toString` method
            // https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
            exportTypedArrayMethod$n('toString', arrayToString, IS_NOT_ARRAY_METHOD);

            var nativeApply = getBuiltIn('Reflect', 'apply');
            var functionApply = Function.apply;

            // MS Edge argumentsList argument is optional
            var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
              nativeApply(function () { /* empty */ });
            });

            // `Reflect.apply` method
            // https://tc39.github.io/ecma262/#sec-reflect.apply
            _export({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
              apply: function apply(target, thisArgument, argumentsList) {
                aFunction$1(target);
                anObject(argumentsList);
                return nativeApply
                  ? nativeApply(target, thisArgument, argumentsList)
                  : functionApply.call(target, thisArgument, argumentsList);
              }
            });

            var nativeConstruct = getBuiltIn('Reflect', 'construct');

            // `Reflect.construct` method
            // https://tc39.github.io/ecma262/#sec-reflect.construct
            // MS Edge supports only 2 arguments and argumentsList argument is optional
            // FF Nightly sets third argument as `new.target`, but does not create `this` from it
            var NEW_TARGET_BUG = fails(function () {
              function F() { /* empty */ }
              return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
            });
            var ARGS_BUG = !fails(function () {
              nativeConstruct(function () { /* empty */ });
            });
            var FORCED$j = NEW_TARGET_BUG || ARGS_BUG;

            _export({ target: 'Reflect', stat: true, forced: FORCED$j, sham: FORCED$j }, {
              construct: function construct(Target, args /* , newTarget */) {
                aFunction$1(Target);
                anObject(args);
                var newTarget = arguments.length < 3 ? Target : aFunction$1(arguments[2]);
                if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
                if (Target == newTarget) {
                  // w/o altered newTarget, optimization for 0-4 arguments
                  switch (args.length) {
                    case 0: return new Target();
                    case 1: return new Target(args[0]);
                    case 2: return new Target(args[0], args[1]);
                    case 3: return new Target(args[0], args[1], args[2]);
                    case 4: return new Target(args[0], args[1], args[2], args[3]);
                  }
                  // w/o altered newTarget, lot of arguments case
                  var $args = [null];
                  $args.push.apply($args, args);
                  return new (functionBind.apply(Target, $args))();
                }
                // with altered newTarget, not support built-in constructors
                var proto = newTarget.prototype;
                var instance = objectCreate(isObject(proto) ? proto : Object.prototype);
                var result = Function.apply.call(Target, instance, args);
                return isObject(result) ? result : instance;
              }
            });

            // MS Edge has broken Reflect.defineProperty - throwing instead of returning false
            var ERROR_INSTEAD_OF_FALSE = fails(function () {
              // eslint-disable-next-line no-undef
              Reflect.defineProperty(objectDefineProperty.f({}, 1, { value: 1 }), 1, { value: 2 });
            });

            // `Reflect.defineProperty` method
            // https://tc39.github.io/ecma262/#sec-reflect.defineproperty
            _export({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !descriptors }, {
              defineProperty: function defineProperty(target, propertyKey, attributes) {
                anObject(target);
                var key = toPrimitive(propertyKey, true);
                anObject(attributes);
                try {
                  objectDefineProperty.f(target, key, attributes);
                  return true;
                } catch (error) {
                  return false;
                }
              }
            });

            var getOwnPropertyDescriptor$8 = objectGetOwnPropertyDescriptor.f;

            // `Reflect.deleteProperty` method
            // https://tc39.github.io/ecma262/#sec-reflect.deleteproperty
            _export({ target: 'Reflect', stat: true }, {
              deleteProperty: function deleteProperty(target, propertyKey) {
                var descriptor = getOwnPropertyDescriptor$8(anObject(target), propertyKey);
                return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
              }
            });

            // `Reflect.get` method
            // https://tc39.github.io/ecma262/#sec-reflect.get
            function get$2(target, propertyKey /* , receiver */) {
              var receiver = arguments.length < 3 ? target : arguments[2];
              var descriptor, prototype;
              if (anObject(target) === receiver) return target[propertyKey];
              if (descriptor = objectGetOwnPropertyDescriptor.f(target, propertyKey)) return has(descriptor, 'value')
                ? descriptor.value
                : descriptor.get === undefined
                  ? undefined
                  : descriptor.get.call(receiver);
              if (isObject(prototype = objectGetPrototypeOf(target))) return get$2(prototype, propertyKey, receiver);
            }

            _export({ target: 'Reflect', stat: true }, {
              get: get$2
            });

            // `Reflect.getOwnPropertyDescriptor` method
            // https://tc39.github.io/ecma262/#sec-reflect.getownpropertydescriptor
            _export({ target: 'Reflect', stat: true, sham: !descriptors }, {
              getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
                return objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
              }
            });

            // `Reflect.getPrototypeOf` method
            // https://tc39.github.io/ecma262/#sec-reflect.getprototypeof
            _export({ target: 'Reflect', stat: true, sham: !correctPrototypeGetter }, {
              getPrototypeOf: function getPrototypeOf(target) {
                return objectGetPrototypeOf(anObject(target));
              }
            });

            // `Reflect.has` method
            // https://tc39.github.io/ecma262/#sec-reflect.has
            _export({ target: 'Reflect', stat: true }, {
              has: function has(target, propertyKey) {
                return propertyKey in target;
              }
            });

            var objectIsExtensible = Object.isExtensible;

            // `Reflect.isExtensible` method
            // https://tc39.github.io/ecma262/#sec-reflect.isextensible
            _export({ target: 'Reflect', stat: true }, {
              isExtensible: function isExtensible(target) {
                anObject(target);
                return objectIsExtensible ? objectIsExtensible(target) : true;
              }
            });

            // `Reflect.ownKeys` method
            // https://tc39.github.io/ecma262/#sec-reflect.ownkeys
            _export({ target: 'Reflect', stat: true }, {
              ownKeys: ownKeys
            });

            // `Reflect.preventExtensions` method
            // https://tc39.github.io/ecma262/#sec-reflect.preventextensions
            _export({ target: 'Reflect', stat: true, sham: !freezing }, {
              preventExtensions: function preventExtensions(target) {
                anObject(target);
                try {
                  var objectPreventExtensions = getBuiltIn('Object', 'preventExtensions');
                  if (objectPreventExtensions) objectPreventExtensions(target);
                  return true;
                } catch (error) {
                  return false;
                }
              }
            });

            // `Reflect.set` method
            // https://tc39.github.io/ecma262/#sec-reflect.set
            function set$3(target, propertyKey, V /* , receiver */) {
              var receiver = arguments.length < 4 ? target : arguments[3];
              var ownDescriptor = objectGetOwnPropertyDescriptor.f(anObject(target), propertyKey);
              var existingDescriptor, prototype;
              if (!ownDescriptor) {
                if (isObject(prototype = objectGetPrototypeOf(target))) {
                  return set$3(prototype, propertyKey, V, receiver);
                }
                ownDescriptor = createPropertyDescriptor(0);
              }
              if (has(ownDescriptor, 'value')) {
                if (ownDescriptor.writable === false || !isObject(receiver)) return false;
                if (existingDescriptor = objectGetOwnPropertyDescriptor.f(receiver, propertyKey)) {
                  if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
                  existingDescriptor.value = V;
                  objectDefineProperty.f(receiver, propertyKey, existingDescriptor);
                } else objectDefineProperty.f(receiver, propertyKey, createPropertyDescriptor(0, V));
                return true;
              }
              return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
            }

            // MS Edge 17-18 Reflect.set allows setting the property to object
            // with non-writable property on the prototype
            var MS_EDGE_BUG = fails(function () {
              var object = objectDefineProperty.f({}, 'a', { configurable: true });
              // eslint-disable-next-line no-undef
              return Reflect.set(objectGetPrototypeOf(object), 'a', 1, object) !== false;
            });

            _export({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
              set: set$3
            });

            // `Reflect.setPrototypeOf` method
            // https://tc39.github.io/ecma262/#sec-reflect.setprototypeof
            if (objectSetPrototypeOf) _export({ target: 'Reflect', stat: true }, {
              setPrototypeOf: function setPrototypeOf(target, proto) {
                anObject(target);
                aPossiblePrototype(proto);
                try {
                  objectSetPrototypeOf(target, proto);
                  return true;
                } catch (error) {
                  return false;
                }
              }
            });

            // iterable DOM collections
            // flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
            var domIterables = {
              CSSRuleList: 0,
              CSSStyleDeclaration: 0,
              CSSValueList: 0,
              ClientRectList: 0,
              DOMRectList: 0,
              DOMStringList: 0,
              DOMTokenList: 1,
              DataTransferItemList: 0,
              FileList: 0,
              HTMLAllCollection: 0,
              HTMLCollection: 0,
              HTMLFormElement: 0,
              HTMLSelectElement: 0,
              MediaList: 0,
              MimeTypeArray: 0,
              NamedNodeMap: 0,
              NodeList: 1,
              PaintRequestList: 0,
              Plugin: 0,
              PluginArray: 0,
              SVGLengthList: 0,
              SVGNumberList: 0,
              SVGPathSegList: 0,
              SVGPointList: 0,
              SVGStringList: 0,
              SVGTransformList: 0,
              SourceBufferList: 0,
              StyleSheetList: 0,
              TextTrackCueList: 0,
              TextTrackList: 0,
              TouchList: 0
            };

            for (var COLLECTION_NAME in domIterables) {
              var Collection = global_1[COLLECTION_NAME];
              var CollectionPrototype = Collection && Collection.prototype;
              // some Chrome versions have non-configurable methods on DOMTokenList
              if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
                createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
              } catch (error) {
                CollectionPrototype.forEach = arrayForEach;
              }
            }

            var ITERATOR$6 = wellKnownSymbol('iterator');
            var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
            var ArrayValues = es_array_iterator.values;

            for (var COLLECTION_NAME$1 in domIterables) {
              var Collection$1 = global_1[COLLECTION_NAME$1];
              var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
              if (CollectionPrototype$1) {
                // some Chrome versions have non-configurable methods on DOMTokenList
                if (CollectionPrototype$1[ITERATOR$6] !== ArrayValues) try {
                  createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$6, ArrayValues);
                } catch (error) {
                  CollectionPrototype$1[ITERATOR$6] = ArrayValues;
                }
                if (!CollectionPrototype$1[TO_STRING_TAG$4]) {
                  createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$4, COLLECTION_NAME$1);
                }
                if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
                  // some Chrome versions have non-configurable methods on DOMTokenList
                  if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
                    createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
                  } catch (error) {
                    CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
                  }
                }
              }
            }

            var FORCED$k = !global_1.setImmediate || !global_1.clearImmediate;

            // http://w3c.github.io/setImmediate/
            _export({ global: true, bind: true, enumerable: true, forced: FORCED$k }, {
              // `setImmediate` method
              // http://w3c.github.io/setImmediate/#si-setImmediate
              setImmediate: task.set,
              // `clearImmediate` method
              // http://w3c.github.io/setImmediate/#si-clearImmediate
              clearImmediate: task.clear
            });

            var process$4 = global_1.process;
            var isNode = classofRaw(process$4) == 'process';

            // `queueMicrotask` method
            // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
            _export({ global: true, enumerable: true, noTargetGet: true }, {
              queueMicrotask: function queueMicrotask(fn) {
                var domain = isNode && process$4.domain;
                microtask(domain ? domain.bind(fn) : fn);
              }
            });

            var slice$1 = [].slice;
            var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

            var wrap$1 = function (scheduler) {
              return function (handler, timeout /* , ...arguments */) {
                var boundArgs = arguments.length > 2;
                var args = boundArgs ? slice$1.call(arguments, 2) : undefined;
                return scheduler(boundArgs ? function () {
                  // eslint-disable-next-line no-new-func
                  (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
                } : handler, timeout);
              };
            };

            // ie9- setTimeout & setInterval additional parameters fix
            // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
            _export({ global: true, bind: true, forced: MSIE }, {
              // `setTimeout` method
              // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
              setTimeout: wrap$1(global_1.setTimeout),
              // `setInterval` method
              // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
              setInterval: wrap$1(global_1.setInterval)
            });

            var ITERATOR$7 = wellKnownSymbol('iterator');

            var nativeUrl = !fails(function () {
              var url = new URL('b?a=1&b=2&c=3', 'http://a');
              var searchParams = url.searchParams;
              var result = '';
              url.pathname = 'c%20d';
              searchParams.forEach(function (value, key) {
                searchParams['delete']('b');
                result += key + value;
              });
              return !searchParams.sort
                || url.href !== 'http://a/c%20d?a=1&c=3'
                || searchParams.get('c') !== '3'
                || String(new URLSearchParams('?a=1')) !== 'a=1'
                || !searchParams[ITERATOR$7]
                // throws in Edge
                || new URL('https://a@b').username !== 'a'
                || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
                // not punycoded in Edge
                || new URL('http://тест').host !== 'xn--e1aybc'
                // not escaped in Chrome 62-
                || new URL('http://a#б').hash !== '#%D0%B1'
                // fails in Chrome 66-
                || result !== 'a1c3'
                // throws in Safari
                || new URL('http://x', undefined).host !== 'x';
            });

            // based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
            var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
            var base = 36;
            var tMin = 1;
            var tMax = 26;
            var skew = 38;
            var damp = 700;
            var initialBias = 72;
            var initialN = 128; // 0x80
            var delimiter = '-'; // '\x2D'
            var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
            var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
            var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
            var baseMinusTMin = base - tMin;
            var floor$8 = Math.floor;
            var stringFromCharCode = String.fromCharCode;

            /**
             * Creates an array containing the numeric code points of each Unicode
             * character in the string. While JavaScript uses UCS-2 internally,
             * this function will convert a pair of surrogate halves (each of which
             * UCS-2 exposes as separate characters) into a single code point,
             * matching UTF-16.
             */
            var ucs2decode = function (string) {
              var output = [];
              var counter = 0;
              var length = string.length;
              while (counter < length) {
                var value = string.charCodeAt(counter++);
                if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                  // It's a high surrogate, and there is a next character.
                  var extra = string.charCodeAt(counter++);
                  if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
                    output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                  } else {
                    // It's an unmatched surrogate; only append this code unit, in case the
                    // next code unit is the high surrogate of a surrogate pair.
                    output.push(value);
                    counter--;
                  }
                } else {
                  output.push(value);
                }
              }
              return output;
            };

            /**
             * Converts a digit/integer into a basic code point.
             */
            var digitToBasic = function (digit) {
              //  0..25 map to ASCII a..z or A..Z
              // 26..35 map to ASCII 0..9
              return digit + 22 + 75 * (digit < 26);
            };

            /**
             * Bias adaptation function as per section 3.4 of RFC 3492.
             * https://tools.ietf.org/html/rfc3492#section-3.4
             */
            var adapt = function (delta, numPoints, firstTime) {
              var k = 0;
              delta = firstTime ? floor$8(delta / damp) : delta >> 1;
              delta += floor$8(delta / numPoints);
              for (; delta > baseMinusTMin * tMax >> 1; k += base) {
                delta = floor$8(delta / baseMinusTMin);
              }
              return floor$8(k + (baseMinusTMin + 1) * delta / (delta + skew));
            };

            /**
             * Converts a string of Unicode symbols (e.g. a domain name label) to a
             * Punycode string of ASCII-only symbols.
             */
            // eslint-disable-next-line  max-statements
            var encode = function (input) {
              var output = [];

              // Convert the input in UCS-2 to an array of Unicode code points.
              input = ucs2decode(input);

              // Cache the length.
              var inputLength = input.length;

              // Initialize the state.
              var n = initialN;
              var delta = 0;
              var bias = initialBias;
              var i, currentValue;

              // Handle the basic code points.
              for (i = 0; i < input.length; i++) {
                currentValue = input[i];
                if (currentValue < 0x80) {
                  output.push(stringFromCharCode(currentValue));
                }
              }

              var basicLength = output.length; // number of basic code points.
              var handledCPCount = basicLength; // number of code points that have been handled;

              // Finish the basic string with a delimiter unless it's empty.
              if (basicLength) {
                output.push(delimiter);
              }

              // Main encoding loop:
              while (handledCPCount < inputLength) {
                // All non-basic code points < n have been handled already. Find the next larger one:
                var m = maxInt;
                for (i = 0; i < input.length; i++) {
                  currentValue = input[i];
                  if (currentValue >= n && currentValue < m) {
                    m = currentValue;
                  }
                }

                // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
                var handledCPCountPlusOne = handledCPCount + 1;
                if (m - n > floor$8((maxInt - delta) / handledCPCountPlusOne)) {
                  throw RangeError(OVERFLOW_ERROR);
                }

                delta += (m - n) * handledCPCountPlusOne;
                n = m;

                for (i = 0; i < input.length; i++) {
                  currentValue = input[i];
                  if (currentValue < n && ++delta > maxInt) {
                    throw RangeError(OVERFLOW_ERROR);
                  }
                  if (currentValue == n) {
                    // Represent delta as a generalized variable-length integer.
                    var q = delta;
                    for (var k = base; /* no condition */; k += base) {
                      var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
                      if (q < t) break;
                      var qMinusT = q - t;
                      var baseMinusT = base - t;
                      output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
                      q = floor$8(qMinusT / baseMinusT);
                    }

                    output.push(stringFromCharCode(digitToBasic(q)));
                    bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                    delta = 0;
                    ++handledCPCount;
                  }
                }

                ++delta;
                ++n;
              }
              return output.join('');
            };

            var punycodeToAscii = function (input) {
              var encoded = [];
              var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
              var i, label;
              for (i = 0; i < labels.length; i++) {
                label = labels[i];
                encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
              }
              return encoded.join('.');
            };

            var getIterator = function (it) {
              var iteratorMethod = getIteratorMethod(it);
              if (typeof iteratorMethod != 'function') {
                throw TypeError(String(it) + ' is not iterable');
              } return anObject(iteratorMethod.call(it));
            };

            // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















            var $fetch$1 = getBuiltIn('fetch');
            var Headers = getBuiltIn('Headers');
            var ITERATOR$8 = wellKnownSymbol('iterator');
            var URL_SEARCH_PARAMS = 'URLSearchParams';
            var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
            var setInternalState$8 = internalState.set;
            var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
            var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

            var plus = /\+/g;
            var sequences = Array(4);

            var percentSequence = function (bytes) {
              return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
            };

            var percentDecode = function (sequence) {
              try {
                return decodeURIComponent(sequence);
              } catch (error) {
                return sequence;
              }
            };

            var deserialize = function (it) {
              var result = it.replace(plus, ' ');
              var bytes = 4;
              try {
                return decodeURIComponent(result);
              } catch (error) {
                while (bytes) {
                  result = result.replace(percentSequence(bytes--), percentDecode);
                }
                return result;
              }
            };

            var find$1 = /[!'()~]|%20/g;

            var replace = {
              '!': '%21',
              "'": '%27',
              '(': '%28',
              ')': '%29',
              '~': '%7E',
              '%20': '+'
            };

            var replacer = function (match) {
              return replace[match];
            };

            var serialize = function (it) {
              return encodeURIComponent(it).replace(find$1, replacer);
            };

            var parseSearchParams = function (result, query) {
              if (query) {
                var attributes = query.split('&');
                var index = 0;
                var attribute, entry;
                while (index < attributes.length) {
                  attribute = attributes[index++];
                  if (attribute.length) {
                    entry = attribute.split('=');
                    result.push({
                      key: deserialize(entry.shift()),
                      value: deserialize(entry.join('='))
                    });
                  }
                }
              }
            };

            var updateSearchParams = function (query) {
              this.entries.length = 0;
              parseSearchParams(this.entries, query);
            };

            var validateArgumentsLength = function (passed, required) {
              if (passed < required) throw TypeError('Not enough arguments');
            };

            var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
              setInternalState$8(this, {
                type: URL_SEARCH_PARAMS_ITERATOR,
                iterator: getIterator(getInternalParamsState(params).entries),
                kind: kind
              });
            }, 'Iterator', function next() {
              var state = getInternalIteratorState(this);
              var kind = state.kind;
              var step = state.iterator.next();
              var entry = step.value;
              if (!step.done) {
                step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
              } return step;
            });

            // `URLSearchParams` constructor
            // https://url.spec.whatwg.org/#interface-urlsearchparams
            var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
              anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
              var init = arguments.length > 0 ? arguments[0] : undefined;
              var that = this;
              var entries = [];
              var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

              setInternalState$8(that, {
                type: URL_SEARCH_PARAMS,
                entries: entries,
                updateURL: function () { /* empty */ },
                updateSearchParams: updateSearchParams
              });

              if (init !== undefined) {
                if (isObject(init)) {
                  iteratorMethod = getIteratorMethod(init);
                  if (typeof iteratorMethod === 'function') {
                    iterator = iteratorMethod.call(init);
                    next = iterator.next;
                    while (!(step = next.call(iterator)).done) {
                      entryIterator = getIterator(anObject(step.value));
                      entryNext = entryIterator.next;
                      if (
                        (first = entryNext.call(entryIterator)).done ||
                        (second = entryNext.call(entryIterator)).done ||
                        !entryNext.call(entryIterator).done
                      ) throw TypeError('Expected sequence with length 2');
                      entries.push({ key: first.value + '', value: second.value + '' });
                    }
                  } else for (key in init) if (has(init, key)) entries.push({ key: key, value: init[key] + '' });
                } else {
                  parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
                }
              }
            };

            var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

            redefineAll(URLSearchParamsPrototype, {
              // `URLSearchParams.prototype.appent` method
              // https://url.spec.whatwg.org/#dom-urlsearchparams-append
              append: function append(name, value) {
                validateArgumentsLength(arguments.length, 2);
                var state = getInternalParamsState(this);
                state.entries.push({ key: name + '', value: value + '' });
                state.updateURL();
              },
              // `URLSearchParams.prototype.delete` method
              // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
              'delete': function (name) {
                validateArgumentsLength(arguments.length, 1);
                var state = getInternalParamsState(this);
                var entries = state.entries;
                var key = name + '';
                var index = 0;
                while (index < entries.length) {
                  if (entries[index].key === key) entries.splice(index, 1);
                  else index++;
                }
                state.updateURL();
              },
              // `URLSearchParams.prototype.get` method
              // https://url.spec.whatwg.org/#dom-urlsearchparams-get
              get: function get(name) {
                validateArgumentsLength(arguments.length, 1);
                var entries = getInternalParamsState(this).entries;
                var key = name + '';
                var index = 0;
                for (; index < entries.length; index++) {
                  if (entries[index].key === key) return entries[index].value;
                }
                return null;
              },
              // `URLSearchParams.prototype.getAll` method
              // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
              getAll: function getAll(name) {
                validateArgumentsLength(arguments.length, 1);
                var entries = getInternalParamsState(this).entries;
                var key = name + '';
                var result = [];
                var index = 0;
                for (; index < entries.length; index++) {
                  if (entries[index].key === key) result.push(entries[index].value);
                }
                return result;
              },
              // `URLSearchParams.prototype.has` method
              // https://url.spec.whatwg.org/#dom-urlsearchparams-has
              has: function has$$1(name) {
                validateArgumentsLength(arguments.length, 1);
                var entries = getInternalParamsState(this).entries;
                var key = name + '';
                var index = 0;
                while (index < entries.length) {
                  if (entries[index++].key === key) return true;
                }
                return false;
              },
              // `URLSearchParams.prototype.set` method
              // https://url.spec.whatwg.org/#dom-urlsearchparams-set
              set: function set(name, value) {
                validateArgumentsLength(arguments.length, 1);
                var state = getInternalParamsState(this);
                var entries = state.entries;
                var found = false;
                var key = name + '';
                var val = value + '';
                var index = 0;
                var entry;
                for (; index < entries.length; index++) {
                  entry = entries[index];
                  if (entry.key === key) {
                    if (found) entries.splice(index--, 1);
                    else {
                      found = true;
                      entry.value = val;
                    }
                  }
                }
                if (!found) entries.push({ key: key, value: val });
                state.updateURL();
              },
              // `URLSearchParams.prototype.sort` method
              // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
              sort: function sort() {
                var state = getInternalParamsState(this);
                var entries = state.entries;
                // Array#sort is not stable in some engines
                var slice = entries.slice();
                var entry, entriesIndex, sliceIndex;
                entries.length = 0;
                for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
                  entry = slice[sliceIndex];
                  for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
                    if (entries[entriesIndex].key > entry.key) {
                      entries.splice(entriesIndex, 0, entry);
                      break;
                    }
                  }
                  if (entriesIndex === sliceIndex) entries.push(entry);
                }
                state.updateURL();
              },
              // `URLSearchParams.prototype.forEach` method
              forEach: function forEach(callback /* , thisArg */) {
                var entries = getInternalParamsState(this).entries;
                var boundFunction = bindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
                var index = 0;
                var entry;
                while (index < entries.length) {
                  entry = entries[index++];
                  boundFunction(entry.value, entry.key, this);
                }
              },
              // `URLSearchParams.prototype.keys` method
              keys: function keys() {
                return new URLSearchParamsIterator(this, 'keys');
              },
              // `URLSearchParams.prototype.values` method
              values: function values() {
                return new URLSearchParamsIterator(this, 'values');
              },
              // `URLSearchParams.prototype.entries` method
              entries: function entries() {
                return new URLSearchParamsIterator(this, 'entries');
              }
            }, { enumerable: true });

            // `URLSearchParams.prototype[@@iterator]` method
            redefine(URLSearchParamsPrototype, ITERATOR$8, URLSearchParamsPrototype.entries);

            // `URLSearchParams.prototype.toString` method
            // https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
            redefine(URLSearchParamsPrototype, 'toString', function toString() {
              var entries = getInternalParamsState(this).entries;
              var result = [];
              var index = 0;
              var entry;
              while (index < entries.length) {
                entry = entries[index++];
                result.push(serialize(entry.key) + '=' + serialize(entry.value));
              } return result.join('&');
            }, { enumerable: true });

            setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

            _export({ global: true, forced: !nativeUrl }, {
              URLSearchParams: URLSearchParamsConstructor
            });

            // Wrap `fetch` for correct work with polyfilled `URLSearchParams`
            // https://github.com/zloirock/core-js/issues/674
            if (!nativeUrl && typeof $fetch$1 == 'function' && typeof Headers == 'function') {
              _export({ global: true, enumerable: true, forced: true }, {
                fetch: function fetch(input /* , init */) {
                  var args = [input];
                  var init, body, headers;
                  if (arguments.length > 1) {
                    init = arguments[1];
                    if (isObject(init)) {
                      body = init.body;
                      if (classof(body) === URL_SEARCH_PARAMS) {
                        headers = init.headers ? new Headers(init.headers) : new Headers();
                        if (!headers.has('content-type')) {
                          headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                        }
                        init = objectCreate(init, {
                          body: createPropertyDescriptor(0, String(body)),
                          headers: createPropertyDescriptor(0, headers)
                        });
                      }
                    }
                    args.push(init);
                  } return $fetch$1.apply(this, args);
                }
              });
            }

            var web_urlSearchParams = {
              URLSearchParams: URLSearchParamsConstructor,
              getState: getInternalParamsState
            };

            // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











            var codeAt$1 = stringMultibyte.codeAt;





            var NativeURL = global_1.URL;
            var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
            var getInternalSearchParamsState = web_urlSearchParams.getState;
            var setInternalState$9 = internalState.set;
            var getInternalURLState = internalState.getterFor('URL');
            var floor$9 = Math.floor;
            var pow$4 = Math.pow;

            var INVALID_AUTHORITY = 'Invalid authority';
            var INVALID_SCHEME = 'Invalid scheme';
            var INVALID_HOST = 'Invalid host';
            var INVALID_PORT = 'Invalid port';

            var ALPHA = /[A-Za-z]/;
            var ALPHANUMERIC = /[\d+\-.A-Za-z]/;
            var DIGIT = /\d/;
            var HEX_START = /^(0x|0X)/;
            var OCT = /^[0-7]+$/;
            var DEC = /^\d+$/;
            var HEX = /^[\dA-Fa-f]+$/;
            // eslint-disable-next-line no-control-regex
            var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
            // eslint-disable-next-line no-control-regex
            var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
            // eslint-disable-next-line no-control-regex
            var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
            // eslint-disable-next-line no-control-regex
            var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
            var EOF;

            var parseHost = function (url, input) {
              var result, codePoints, index;
              if (input.charAt(0) == '[') {
                if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
                result = parseIPv6(input.slice(1, -1));
                if (!result) return INVALID_HOST;
                url.host = result;
              // opaque host
              } else if (!isSpecial(url)) {
                if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
                result = '';
                codePoints = arrayFrom(input);
                for (index = 0; index < codePoints.length; index++) {
                  result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
                }
                url.host = result;
              } else {
                input = punycodeToAscii(input);
                if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
                result = parseIPv4(input);
                if (result === null) return INVALID_HOST;
                url.host = result;
              }
            };

            var parseIPv4 = function (input) {
              var parts = input.split('.');
              var partsLength, numbers, index, part, radix, number, ipv4;
              if (parts.length && parts[parts.length - 1] == '') {
                parts.pop();
              }
              partsLength = parts.length;
              if (partsLength > 4) return input;
              numbers = [];
              for (index = 0; index < partsLength; index++) {
                part = parts[index];
                if (part == '') return input;
                radix = 10;
                if (part.length > 1 && part.charAt(0) == '0') {
                  radix = HEX_START.test(part) ? 16 : 8;
                  part = part.slice(radix == 8 ? 1 : 2);
                }
                if (part === '') {
                  number = 0;
                } else {
                  if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
                  number = parseInt(part, radix);
                }
                numbers.push(number);
              }
              for (index = 0; index < partsLength; index++) {
                number = numbers[index];
                if (index == partsLength - 1) {
                  if (number >= pow$4(256, 5 - partsLength)) return null;
                } else if (number > 255) return null;
              }
              ipv4 = numbers.pop();
              for (index = 0; index < numbers.length; index++) {
                ipv4 += numbers[index] * pow$4(256, 3 - index);
              }
              return ipv4;
            };

            // eslint-disable-next-line max-statements
            var parseIPv6 = function (input) {
              var address = [0, 0, 0, 0, 0, 0, 0, 0];
              var pieceIndex = 0;
              var compress = null;
              var pointer = 0;
              var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

              var char = function () {
                return input.charAt(pointer);
              };

              if (char() == ':') {
                if (input.charAt(1) != ':') return;
                pointer += 2;
                pieceIndex++;
                compress = pieceIndex;
              }
              while (char()) {
                if (pieceIndex == 8) return;
                if (char() == ':') {
                  if (compress !== null) return;
                  pointer++;
                  pieceIndex++;
                  compress = pieceIndex;
                  continue;
                }
                value = length = 0;
                while (length < 4 && HEX.test(char())) {
                  value = value * 16 + parseInt(char(), 16);
                  pointer++;
                  length++;
                }
                if (char() == '.') {
                  if (length == 0) return;
                  pointer -= length;
                  if (pieceIndex > 6) return;
                  numbersSeen = 0;
                  while (char()) {
                    ipv4Piece = null;
                    if (numbersSeen > 0) {
                      if (char() == '.' && numbersSeen < 4) pointer++;
                      else return;
                    }
                    if (!DIGIT.test(char())) return;
                    while (DIGIT.test(char())) {
                      number = parseInt(char(), 10);
                      if (ipv4Piece === null) ipv4Piece = number;
                      else if (ipv4Piece == 0) return;
                      else ipv4Piece = ipv4Piece * 10 + number;
                      if (ipv4Piece > 255) return;
                      pointer++;
                    }
                    address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
                    numbersSeen++;
                    if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
                  }
                  if (numbersSeen != 4) return;
                  break;
                } else if (char() == ':') {
                  pointer++;
                  if (!char()) return;
                } else if (char()) return;
                address[pieceIndex++] = value;
              }
              if (compress !== null) {
                swaps = pieceIndex - compress;
                pieceIndex = 7;
                while (pieceIndex != 0 && swaps > 0) {
                  swap = address[pieceIndex];
                  address[pieceIndex--] = address[compress + swaps - 1];
                  address[compress + --swaps] = swap;
                }
              } else if (pieceIndex != 8) return;
              return address;
            };

            var findLongestZeroSequence = function (ipv6) {
              var maxIndex = null;
              var maxLength = 1;
              var currStart = null;
              var currLength = 0;
              var index = 0;
              for (; index < 8; index++) {
                if (ipv6[index] !== 0) {
                  if (currLength > maxLength) {
                    maxIndex = currStart;
                    maxLength = currLength;
                  }
                  currStart = null;
                  currLength = 0;
                } else {
                  if (currStart === null) currStart = index;
                  ++currLength;
                }
              }
              if (currLength > maxLength) {
                maxIndex = currStart;
                maxLength = currLength;
              }
              return maxIndex;
            };

            var serializeHost = function (host) {
              var result, index, compress, ignore0;
              // ipv4
              if (typeof host == 'number') {
                result = [];
                for (index = 0; index < 4; index++) {
                  result.unshift(host % 256);
                  host = floor$9(host / 256);
                } return result.join('.');
              // ipv6
              } else if (typeof host == 'object') {
                result = '';
                compress = findLongestZeroSequence(host);
                for (index = 0; index < 8; index++) {
                  if (ignore0 && host[index] === 0) continue;
                  if (ignore0) ignore0 = false;
                  if (compress === index) {
                    result += index ? ':' : '::';
                    ignore0 = true;
                  } else {
                    result += host[index].toString(16);
                    if (index < 7) result += ':';
                  }
                }
                return '[' + result + ']';
              } return host;
            };

            var C0ControlPercentEncodeSet = {};
            var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
              ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
            });
            var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
              '#': 1, '?': 1, '{': 1, '}': 1
            });
            var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
              '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
            });

            var percentEncode = function (char, set) {
              var code = codeAt$1(char, 0);
              return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
            };

            var specialSchemes = {
              ftp: 21,
              file: null,
              http: 80,
              https: 443,
              ws: 80,
              wss: 443
            };

            var isSpecial = function (url) {
              return has(specialSchemes, url.scheme);
            };

            var includesCredentials = function (url) {
              return url.username != '' || url.password != '';
            };

            var cannotHaveUsernamePasswordPort = function (url) {
              return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
            };

            var isWindowsDriveLetter = function (string, normalized) {
              var second;
              return string.length == 2 && ALPHA.test(string.charAt(0))
                && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
            };

            var startsWithWindowsDriveLetter = function (string) {
              var third;
              return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
                string.length == 2 ||
                ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
              );
            };

            var shortenURLsPath = function (url) {
              var path = url.path;
              var pathSize = path.length;
              if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
                path.pop();
              }
            };

            var isSingleDot = function (segment) {
              return segment === '.' || segment.toLowerCase() === '%2e';
            };

            var isDoubleDot = function (segment) {
              segment = segment.toLowerCase();
              return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
            };

            // States:
            var SCHEME_START = {};
            var SCHEME = {};
            var NO_SCHEME = {};
            var SPECIAL_RELATIVE_OR_AUTHORITY = {};
            var PATH_OR_AUTHORITY = {};
            var RELATIVE = {};
            var RELATIVE_SLASH = {};
            var SPECIAL_AUTHORITY_SLASHES = {};
            var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
            var AUTHORITY = {};
            var HOST = {};
            var HOSTNAME = {};
            var PORT = {};
            var FILE = {};
            var FILE_SLASH = {};
            var FILE_HOST = {};
            var PATH_START = {};
            var PATH = {};
            var CANNOT_BE_A_BASE_URL_PATH = {};
            var QUERY = {};
            var FRAGMENT = {};

            // eslint-disable-next-line max-statements
            var parseURL = function (url, input, stateOverride, base) {
              var state = stateOverride || SCHEME_START;
              var pointer = 0;
              var buffer = '';
              var seenAt = false;
              var seenBracket = false;
              var seenPasswordToken = false;
              var codePoints, char, bufferCodePoints, failure;

              if (!stateOverride) {
                url.scheme = '';
                url.username = '';
                url.password = '';
                url.host = null;
                url.port = null;
                url.path = [];
                url.query = null;
                url.fragment = null;
                url.cannotBeABaseURL = false;
                input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
              }

              input = input.replace(TAB_AND_NEW_LINE, '');

              codePoints = arrayFrom(input);

              while (pointer <= codePoints.length) {
                char = codePoints[pointer];
                switch (state) {
                  case SCHEME_START:
                    if (char && ALPHA.test(char)) {
                      buffer += char.toLowerCase();
                      state = SCHEME;
                    } else if (!stateOverride) {
                      state = NO_SCHEME;
                      continue;
                    } else return INVALID_SCHEME;
                    break;

                  case SCHEME:
                    if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
                      buffer += char.toLowerCase();
                    } else if (char == ':') {
                      if (stateOverride && (
                        (isSpecial(url) != has(specialSchemes, buffer)) ||
                        (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
                        (url.scheme == 'file' && !url.host)
                      )) return;
                      url.scheme = buffer;
                      if (stateOverride) {
                        if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
                        return;
                      }
                      buffer = '';
                      if (url.scheme == 'file') {
                        state = FILE;
                      } else if (isSpecial(url) && base && base.scheme == url.scheme) {
                        state = SPECIAL_RELATIVE_OR_AUTHORITY;
                      } else if (isSpecial(url)) {
                        state = SPECIAL_AUTHORITY_SLASHES;
                      } else if (codePoints[pointer + 1] == '/') {
                        state = PATH_OR_AUTHORITY;
                        pointer++;
                      } else {
                        url.cannotBeABaseURL = true;
                        url.path.push('');
                        state = CANNOT_BE_A_BASE_URL_PATH;
                      }
                    } else if (!stateOverride) {
                      buffer = '';
                      state = NO_SCHEME;
                      pointer = 0;
                      continue;
                    } else return INVALID_SCHEME;
                    break;

                  case NO_SCHEME:
                    if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
                    if (base.cannotBeABaseURL && char == '#') {
                      url.scheme = base.scheme;
                      url.path = base.path.slice();
                      url.query = base.query;
                      url.fragment = '';
                      url.cannotBeABaseURL = true;
                      state = FRAGMENT;
                      break;
                    }
                    state = base.scheme == 'file' ? FILE : RELATIVE;
                    continue;

                  case SPECIAL_RELATIVE_OR_AUTHORITY:
                    if (char == '/' && codePoints[pointer + 1] == '/') {
                      state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
                      pointer++;
                    } else {
                      state = RELATIVE;
                      continue;
                    } break;

                  case PATH_OR_AUTHORITY:
                    if (char == '/') {
                      state = AUTHORITY;
                      break;
                    } else {
                      state = PATH;
                      continue;
                    }

                  case RELATIVE:
                    url.scheme = base.scheme;
                    if (char == EOF) {
                      url.username = base.username;
                      url.password = base.password;
                      url.host = base.host;
                      url.port = base.port;
                      url.path = base.path.slice();
                      url.query = base.query;
                    } else if (char == '/' || (char == '\\' && isSpecial(url))) {
                      state = RELATIVE_SLASH;
                    } else if (char == '?') {
                      url.username = base.username;
                      url.password = base.password;
                      url.host = base.host;
                      url.port = base.port;
                      url.path = base.path.slice();
                      url.query = '';
                      state = QUERY;
                    } else if (char == '#') {
                      url.username = base.username;
                      url.password = base.password;
                      url.host = base.host;
                      url.port = base.port;
                      url.path = base.path.slice();
                      url.query = base.query;
                      url.fragment = '';
                      state = FRAGMENT;
                    } else {
                      url.username = base.username;
                      url.password = base.password;
                      url.host = base.host;
                      url.port = base.port;
                      url.path = base.path.slice();
                      url.path.pop();
                      state = PATH;
                      continue;
                    } break;

                  case RELATIVE_SLASH:
                    if (isSpecial(url) && (char == '/' || char == '\\')) {
                      state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
                    } else if (char == '/') {
                      state = AUTHORITY;
                    } else {
                      url.username = base.username;
                      url.password = base.password;
                      url.host = base.host;
                      url.port = base.port;
                      state = PATH;
                      continue;
                    } break;

                  case SPECIAL_AUTHORITY_SLASHES:
                    state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
                    if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
                    pointer++;
                    break;

                  case SPECIAL_AUTHORITY_IGNORE_SLASHES:
                    if (char != '/' && char != '\\') {
                      state = AUTHORITY;
                      continue;
                    } break;

                  case AUTHORITY:
                    if (char == '@') {
                      if (seenAt) buffer = '%40' + buffer;
                      seenAt = true;
                      bufferCodePoints = arrayFrom(buffer);
                      for (var i = 0; i < bufferCodePoints.length; i++) {
                        var codePoint = bufferCodePoints[i];
                        if (codePoint == ':' && !seenPasswordToken) {
                          seenPasswordToken = true;
                          continue;
                        }
                        var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
                        if (seenPasswordToken) url.password += encodedCodePoints;
                        else url.username += encodedCodePoints;
                      }
                      buffer = '';
                    } else if (
                      char == EOF || char == '/' || char == '?' || char == '#' ||
                      (char == '\\' && isSpecial(url))
                    ) {
                      if (seenAt && buffer == '') return INVALID_AUTHORITY;
                      pointer -= arrayFrom(buffer).length + 1;
                      buffer = '';
                      state = HOST;
                    } else buffer += char;
                    break;

                  case HOST:
                  case HOSTNAME:
                    if (stateOverride && url.scheme == 'file') {
                      state = FILE_HOST;
                      continue;
                    } else if (char == ':' && !seenBracket) {
                      if (buffer == '') return INVALID_HOST;
                      failure = parseHost(url, buffer);
                      if (failure) return failure;
                      buffer = '';
                      state = PORT;
                      if (stateOverride == HOSTNAME) return;
                    } else if (
                      char == EOF || char == '/' || char == '?' || char == '#' ||
                      (char == '\\' && isSpecial(url))
                    ) {
                      if (isSpecial(url) && buffer == '') return INVALID_HOST;
                      if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
                      failure = parseHost(url, buffer);
                      if (failure) return failure;
                      buffer = '';
                      state = PATH_START;
                      if (stateOverride) return;
                      continue;
                    } else {
                      if (char == '[') seenBracket = true;
                      else if (char == ']') seenBracket = false;
                      buffer += char;
                    } break;

                  case PORT:
                    if (DIGIT.test(char)) {
                      buffer += char;
                    } else if (
                      char == EOF || char == '/' || char == '?' || char == '#' ||
                      (char == '\\' && isSpecial(url)) ||
                      stateOverride
                    ) {
                      if (buffer != '') {
                        var port = parseInt(buffer, 10);
                        if (port > 0xFFFF) return INVALID_PORT;
                        url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
                        buffer = '';
                      }
                      if (stateOverride) return;
                      state = PATH_START;
                      continue;
                    } else return INVALID_PORT;
                    break;

                  case FILE:
                    url.scheme = 'file';
                    if (char == '/' || char == '\\') state = FILE_SLASH;
                    else if (base && base.scheme == 'file') {
                      if (char == EOF) {
                        url.host = base.host;
                        url.path = base.path.slice();
                        url.query = base.query;
                      } else if (char == '?') {
                        url.host = base.host;
                        url.path = base.path.slice();
                        url.query = '';
                        state = QUERY;
                      } else if (char == '#') {
                        url.host = base.host;
                        url.path = base.path.slice();
                        url.query = base.query;
                        url.fragment = '';
                        state = FRAGMENT;
                      } else {
                        if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
                          url.host = base.host;
                          url.path = base.path.slice();
                          shortenURLsPath(url);
                        }
                        state = PATH;
                        continue;
                      }
                    } else {
                      state = PATH;
                      continue;
                    } break;

                  case FILE_SLASH:
                    if (char == '/' || char == '\\') {
                      state = FILE_HOST;
                      break;
                    }
                    if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
                      if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
                      else url.host = base.host;
                    }
                    state = PATH;
                    continue;

                  case FILE_HOST:
                    if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
                      if (!stateOverride && isWindowsDriveLetter(buffer)) {
                        state = PATH;
                      } else if (buffer == '') {
                        url.host = '';
                        if (stateOverride) return;
                        state = PATH_START;
                      } else {
                        failure = parseHost(url, buffer);
                        if (failure) return failure;
                        if (url.host == 'localhost') url.host = '';
                        if (stateOverride) return;
                        buffer = '';
                        state = PATH_START;
                      } continue;
                    } else buffer += char;
                    break;

                  case PATH_START:
                    if (isSpecial(url)) {
                      state = PATH;
                      if (char != '/' && char != '\\') continue;
                    } else if (!stateOverride && char == '?') {
                      url.query = '';
                      state = QUERY;
                    } else if (!stateOverride && char == '#') {
                      url.fragment = '';
                      state = FRAGMENT;
                    } else if (char != EOF) {
                      state = PATH;
                      if (char != '/') continue;
                    } break;

                  case PATH:
                    if (
                      char == EOF || char == '/' ||
                      (char == '\\' && isSpecial(url)) ||
                      (!stateOverride && (char == '?' || char == '#'))
                    ) {
                      if (isDoubleDot(buffer)) {
                        shortenURLsPath(url);
                        if (char != '/' && !(char == '\\' && isSpecial(url))) {
                          url.path.push('');
                        }
                      } else if (isSingleDot(buffer)) {
                        if (char != '/' && !(char == '\\' && isSpecial(url))) {
                          url.path.push('');
                        }
                      } else {
                        if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
                          if (url.host) url.host = '';
                          buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
                        }
                        url.path.push(buffer);
                      }
                      buffer = '';
                      if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
                        while (url.path.length > 1 && url.path[0] === '') {
                          url.path.shift();
                        }
                      }
                      if (char == '?') {
                        url.query = '';
                        state = QUERY;
                      } else if (char == '#') {
                        url.fragment = '';
                        state = FRAGMENT;
                      }
                    } else {
                      buffer += percentEncode(char, pathPercentEncodeSet);
                    } break;

                  case CANNOT_BE_A_BASE_URL_PATH:
                    if (char == '?') {
                      url.query = '';
                      state = QUERY;
                    } else if (char == '#') {
                      url.fragment = '';
                      state = FRAGMENT;
                    } else if (char != EOF) {
                      url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
                    } break;

                  case QUERY:
                    if (!stateOverride && char == '#') {
                      url.fragment = '';
                      state = FRAGMENT;
                    } else if (char != EOF) {
                      if (char == "'" && isSpecial(url)) url.query += '%27';
                      else if (char == '#') url.query += '%23';
                      else url.query += percentEncode(char, C0ControlPercentEncodeSet);
                    } break;

                  case FRAGMENT:
                    if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
                    break;
                }

                pointer++;
              }
            };

            // `URL` constructor
            // https://url.spec.whatwg.org/#url-class
            var URLConstructor = function URL(url /* , base */) {
              var that = anInstance(this, URLConstructor, 'URL');
              var base = arguments.length > 1 ? arguments[1] : undefined;
              var urlString = String(url);
              var state = setInternalState$9(that, { type: 'URL' });
              var baseState, failure;
              if (base !== undefined) {
                if (base instanceof URLConstructor) baseState = getInternalURLState(base);
                else {
                  failure = parseURL(baseState = {}, String(base));
                  if (failure) throw TypeError(failure);
                }
              }
              failure = parseURL(state, urlString, null, baseState);
              if (failure) throw TypeError(failure);
              var searchParams = state.searchParams = new URLSearchParams$1();
              var searchParamsState = getInternalSearchParamsState(searchParams);
              searchParamsState.updateSearchParams(state.query);
              searchParamsState.updateURL = function () {
                state.query = String(searchParams) || null;
              };
              if (!descriptors) {
                that.href = serializeURL.call(that);
                that.origin = getOrigin.call(that);
                that.protocol = getProtocol.call(that);
                that.username = getUsername.call(that);
                that.password = getPassword.call(that);
                that.host = getHost.call(that);
                that.hostname = getHostname.call(that);
                that.port = getPort.call(that);
                that.pathname = getPathname.call(that);
                that.search = getSearch.call(that);
                that.searchParams = getSearchParams.call(that);
                that.hash = getHash.call(that);
              }
            };

            var URLPrototype = URLConstructor.prototype;

            var serializeURL = function () {
              var url = getInternalURLState(this);
              var scheme = url.scheme;
              var username = url.username;
              var password = url.password;
              var host = url.host;
              var port = url.port;
              var path = url.path;
              var query = url.query;
              var fragment = url.fragment;
              var output = scheme + ':';
              if (host !== null) {
                output += '//';
                if (includesCredentials(url)) {
                  output += username + (password ? ':' + password : '') + '@';
                }
                output += serializeHost(host);
                if (port !== null) output += ':' + port;
              } else if (scheme == 'file') output += '//';
              output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
              if (query !== null) output += '?' + query;
              if (fragment !== null) output += '#' + fragment;
              return output;
            };

            var getOrigin = function () {
              var url = getInternalURLState(this);
              var scheme = url.scheme;
              var port = url.port;
              if (scheme == 'blob') try {
                return new URL(scheme.path[0]).origin;
              } catch (error) {
                return 'null';
              }
              if (scheme == 'file' || !isSpecial(url)) return 'null';
              return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
            };

            var getProtocol = function () {
              return getInternalURLState(this).scheme + ':';
            };

            var getUsername = function () {
              return getInternalURLState(this).username;
            };

            var getPassword = function () {
              return getInternalURLState(this).password;
            };

            var getHost = function () {
              var url = getInternalURLState(this);
              var host = url.host;
              var port = url.port;
              return host === null ? ''
                : port === null ? serializeHost(host)
                : serializeHost(host) + ':' + port;
            };

            var getHostname = function () {
              var host = getInternalURLState(this).host;
              return host === null ? '' : serializeHost(host);
            };

            var getPort = function () {
              var port = getInternalURLState(this).port;
              return port === null ? '' : String(port);
            };

            var getPathname = function () {
              var url = getInternalURLState(this);
              var path = url.path;
              return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
            };

            var getSearch = function () {
              var query = getInternalURLState(this).query;
              return query ? '?' + query : '';
            };

            var getSearchParams = function () {
              return getInternalURLState(this).searchParams;
            };

            var getHash = function () {
              var fragment = getInternalURLState(this).fragment;
              return fragment ? '#' + fragment : '';
            };

            var accessorDescriptor = function (getter, setter) {
              return { get: getter, set: setter, configurable: true, enumerable: true };
            };

            if (descriptors) {
              objectDefineProperties(URLPrototype, {
                // `URL.prototype.href` accessors pair
                // https://url.spec.whatwg.org/#dom-url-href
                href: accessorDescriptor(serializeURL, function (href) {
                  var url = getInternalURLState(this);
                  var urlString = String(href);
                  var failure = parseURL(url, urlString);
                  if (failure) throw TypeError(failure);
                  getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
                }),
                // `URL.prototype.origin` getter
                // https://url.spec.whatwg.org/#dom-url-origin
                origin: accessorDescriptor(getOrigin),
                // `URL.prototype.protocol` accessors pair
                // https://url.spec.whatwg.org/#dom-url-protocol
                protocol: accessorDescriptor(getProtocol, function (protocol) {
                  var url = getInternalURLState(this);
                  parseURL(url, String(protocol) + ':', SCHEME_START);
                }),
                // `URL.prototype.username` accessors pair
                // https://url.spec.whatwg.org/#dom-url-username
                username: accessorDescriptor(getUsername, function (username) {
                  var url = getInternalURLState(this);
                  var codePoints = arrayFrom(String(username));
                  if (cannotHaveUsernamePasswordPort(url)) return;
                  url.username = '';
                  for (var i = 0; i < codePoints.length; i++) {
                    url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
                  }
                }),
                // `URL.prototype.password` accessors pair
                // https://url.spec.whatwg.org/#dom-url-password
                password: accessorDescriptor(getPassword, function (password) {
                  var url = getInternalURLState(this);
                  var codePoints = arrayFrom(String(password));
                  if (cannotHaveUsernamePasswordPort(url)) return;
                  url.password = '';
                  for (var i = 0; i < codePoints.length; i++) {
                    url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
                  }
                }),
                // `URL.prototype.host` accessors pair
                // https://url.spec.whatwg.org/#dom-url-host
                host: accessorDescriptor(getHost, function (host) {
                  var url = getInternalURLState(this);
                  if (url.cannotBeABaseURL) return;
                  parseURL(url, String(host), HOST);
                }),
                // `URL.prototype.hostname` accessors pair
                // https://url.spec.whatwg.org/#dom-url-hostname
                hostname: accessorDescriptor(getHostname, function (hostname) {
                  var url = getInternalURLState(this);
                  if (url.cannotBeABaseURL) return;
                  parseURL(url, String(hostname), HOSTNAME);
                }),
                // `URL.prototype.port` accessors pair
                // https://url.spec.whatwg.org/#dom-url-port
                port: accessorDescriptor(getPort, function (port) {
                  var url = getInternalURLState(this);
                  if (cannotHaveUsernamePasswordPort(url)) return;
                  port = String(port);
                  if (port == '') url.port = null;
                  else parseURL(url, port, PORT);
                }),
                // `URL.prototype.pathname` accessors pair
                // https://url.spec.whatwg.org/#dom-url-pathname
                pathname: accessorDescriptor(getPathname, function (pathname) {
                  var url = getInternalURLState(this);
                  if (url.cannotBeABaseURL) return;
                  url.path = [];
                  parseURL(url, pathname + '', PATH_START);
                }),
                // `URL.prototype.search` accessors pair
                // https://url.spec.whatwg.org/#dom-url-search
                search: accessorDescriptor(getSearch, function (search) {
                  var url = getInternalURLState(this);
                  search = String(search);
                  if (search == '') {
                    url.query = null;
                  } else {
                    if ('?' == search.charAt(0)) search = search.slice(1);
                    url.query = '';
                    parseURL(url, search, QUERY);
                  }
                  getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
                }),
                // `URL.prototype.searchParams` getter
                // https://url.spec.whatwg.org/#dom-url-searchparams
                searchParams: accessorDescriptor(getSearchParams),
                // `URL.prototype.hash` accessors pair
                // https://url.spec.whatwg.org/#dom-url-hash
                hash: accessorDescriptor(getHash, function (hash) {
                  var url = getInternalURLState(this);
                  hash = String(hash);
                  if (hash == '') {
                    url.fragment = null;
                    return;
                  }
                  if ('#' == hash.charAt(0)) hash = hash.slice(1);
                  url.fragment = '';
                  parseURL(url, hash, FRAGMENT);
                })
              });
            }

            // `URL.prototype.toJSON` method
            // https://url.spec.whatwg.org/#dom-url-tojson
            redefine(URLPrototype, 'toJSON', function toJSON() {
              return serializeURL.call(this);
            }, { enumerable: true });

            // `URL.prototype.toString` method
            // https://url.spec.whatwg.org/#URL-stringification-behavior
            redefine(URLPrototype, 'toString', function toString() {
              return serializeURL.call(this);
            }, { enumerable: true });

            if (NativeURL) {
              var nativeCreateObjectURL = NativeURL.createObjectURL;
              var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
              // `URL.createObjectURL` method
              // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
              // eslint-disable-next-line no-unused-vars
              if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
                return nativeCreateObjectURL.apply(NativeURL, arguments);
              });
              // `URL.revokeObjectURL` method
              // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
              // eslint-disable-next-line no-unused-vars
              if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
                return nativeRevokeObjectURL.apply(NativeURL, arguments);
              });
            }

            setToStringTag(URLConstructor, 'URL');

            _export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
              URL: URLConstructor
            });

            // `URL.prototype.toJSON` method
            // https://url.spec.whatwg.org/#dom-url-tojson
            _export({ target: 'URL', proto: true, enumerable: true }, {
              toJSON: function toJSON() {
                return URL.prototype.toString.call(this);
              }
            });

            (function(global) {
              /**
               * Polyfill URLSearchParams
               *
               * Inspired from : https://github.com/WebReflection/url-search-params/blob/master/src/url-search-params.js
               */

              var checkIfIteratorIsSupported = function() {
                try {
                  return !!Symbol.iterator;
                } catch (error) {
                  return false;
                }
              };


              var iteratorSupported = checkIfIteratorIsSupported();

              var createIterator = function(items) {
                var iterator = {
                  next: function() {
                    var value = items.shift();
                    return { done: value === void 0, value: value };
                  }
                };

                if (iteratorSupported) {
                  iterator[Symbol.iterator] = function() {
                    return iterator;
                  };
                }

                return iterator;
              };

              /**
               * Search param name and values should be encoded according to https://url.spec.whatwg.org/#urlencoded-serializing
               * encodeURIComponent() produces the same result except encoding spaces as `%20` instead of `+`.
               */
              var serializeParam = function(value) {
                return encodeURIComponent(value).replace(/%20/g, '+');
              };

              var deserializeParam = function(value) {
                return decodeURIComponent(String(value).replace(/\+/g, ' '));
              };

              var polyfillURLSearchParams = function() {

                var URLSearchParams = function(searchString) {
                  Object.defineProperty(this, '_entries', { writable: true, value: {} });
                  var typeofSearchString = typeof searchString;

                  if (typeofSearchString === 'undefined') ; else if (typeofSearchString === 'string') {
                    if (searchString !== '') {
                      this._fromString(searchString);
                    }
                  } else if (searchString instanceof URLSearchParams) {
                    var _this = this;
                    searchString.forEach(function(value, name) {
                      _this.append(name, value);
                    });
                  } else if ((searchString !== null) && (typeofSearchString === 'object')) {
                    if (Object.prototype.toString.call(searchString) === '[object Array]') {
                      for (var i = 0; i < searchString.length; i++) {
                        var entry = searchString[i];
                        if ((Object.prototype.toString.call(entry) === '[object Array]') || (entry.length !== 2)) {
                          this.append(entry[0], entry[1]);
                        } else {
                          throw new TypeError('Expected [string, any] as entry at index ' + i + ' of URLSearchParams\'s input');
                        }
                      }
                    } else {
                      for (var key in searchString) {
                        if (searchString.hasOwnProperty(key)) {
                          this.append(key, searchString[key]);
                        }
                      }
                    }
                  } else {
                    throw new TypeError('Unsupported input\'s type for URLSearchParams');
                  }
                };

                var proto = URLSearchParams.prototype;

                proto.append = function(name, value) {
                  if (name in this._entries) {
                    this._entries[name].push(String(value));
                  } else {
                    this._entries[name] = [String(value)];
                  }
                };

                proto.delete = function(name) {
                  delete this._entries[name];
                };

                proto.get = function(name) {
                  return (name in this._entries) ? this._entries[name][0] : null;
                };

                proto.getAll = function(name) {
                  return (name in this._entries) ? this._entries[name].slice(0) : [];
                };

                proto.has = function(name) {
                  return (name in this._entries);
                };

                proto.set = function(name, value) {
                  this._entries[name] = [String(value)];
                };

                proto.forEach = function(callback, thisArg) {
                  var entries;
                  for (var name in this._entries) {
                    if (this._entries.hasOwnProperty(name)) {
                      entries = this._entries[name];
                      for (var i = 0; i < entries.length; i++) {
                        callback.call(thisArg, entries[i], name, this);
                      }
                    }
                  }
                };

                proto.keys = function() {
                  var items = [];
                  this.forEach(function(value, name) {
                    items.push(name);
                  });
                  return createIterator(items);
                };

                proto.values = function() {
                  var items = [];
                  this.forEach(function(value) {
                    items.push(value);
                  });
                  return createIterator(items);
                };

                proto.entries = function() {
                  var items = [];
                  this.forEach(function(value, name) {
                    items.push([name, value]);
                  });
                  return createIterator(items);
                };

                if (iteratorSupported) {
                  proto[Symbol.iterator] = proto.entries;
                }

                proto.toString = function() {
                  var searchArray = [];
                  this.forEach(function(value, name) {
                    searchArray.push(serializeParam(name) + '=' + serializeParam(value));
                  });
                  return searchArray.join('&');
                };


                global.URLSearchParams = URLSearchParams;
              };

              var checkIfURLSearchParamsSupported = function() {
                try {
                  var URLSearchParams = global.URLSearchParams;

                  return (new URLSearchParams('?a=1').toString() === 'a=1') && (typeof URLSearchParams.prototype.set === 'function');
                } catch (e) {
                  return false;
                }
              };

              if (!checkIfURLSearchParamsSupported()) {
                polyfillURLSearchParams();
              }

              var proto = global.URLSearchParams.prototype;

              if (typeof proto.sort !== 'function') {
                proto.sort = function() {
                  var _this = this;
                  var items = [];
                  this.forEach(function(value, name) {
                    items.push([name, value]);
                    if (!_this._entries) {
                      _this.delete(name);
                    }
                  });
                  items.sort(function(a, b) {
                    if (a[0] < b[0]) {
                      return -1;
                    } else if (a[0] > b[0]) {
                      return +1;
                    } else {
                      return 0;
                    }
                  });
                  if (_this._entries) { // force reset because IE keeps keys index
                    _this._entries = {};
                  }
                  for (var i = 0; i < items.length; i++) {
                    this.append(items[i][0], items[i][1]);
                  }
                };
              }

              if (typeof proto._fromString !== 'function') {
                Object.defineProperty(proto, '_fromString', {
                  enumerable: false,
                  configurable: false,
                  writable: false,
                  value: function(searchString) {
                    if (this._entries) {
                      this._entries = {};
                    } else {
                      var keys = [];
                      this.forEach(function(value, name) {
                        keys.push(name);
                      });
                      for (var i = 0; i < keys.length; i++) {
                        this.delete(keys[i]);
                      }
                    }

                    searchString = searchString.replace(/^\?/, '');
                    var attributes = searchString.split('&');
                    var attribute;
                    for (var i = 0; i < attributes.length; i++) {
                      attribute = attributes[i].split('=');
                      this.append(
                        deserializeParam(attribute[0]),
                        (attribute.length > 1) ? deserializeParam(attribute[1]) : ''
                      );
                    }
                  }
                });
              }

              // HTMLAnchorElement

            })(
              (typeof global$1 !== 'undefined') ? global$1
                : ((typeof window !== 'undefined') ? window
                : ((typeof self !== 'undefined') ? self : undefined))
            );

            (function(global) {
              /**
               * Polyfill URL
               *
               * Inspired from : https://github.com/arv/DOM-URL-Polyfill/blob/master/src/url.js
               */

              var checkIfURLIsSupported = function() {
                try {
                  var u = new global.URL('b', 'http://a');
                  u.pathname = 'c%20d';
                  return (u.href === 'http://a/c%20d') && u.searchParams;
                } catch (e) {
                  return false;
                }
              };


              var polyfillURL = function() {
                var _URL = global.URL;

                var URL = function(url, base) {
                  if (typeof url !== 'string') url = String(url);

                  // Only create another document if the base is different from current location.
                  var doc = document, baseElement;
                  if (base && (global.location === void 0 || base !== global.location.href)) {
                    doc = document.implementation.createHTMLDocument('');
                    baseElement = doc.createElement('base');
                    baseElement.href = base;
                    doc.head.appendChild(baseElement);
                    try {
                      if (baseElement.href.indexOf(base) !== 0) throw new Error(baseElement.href);
                    } catch (err) {
                      throw new Error('URL unable to set base ' + base + ' due to ' + err);
                    }
                  }

                  var anchorElement = doc.createElement('a');
                  anchorElement.href = url;
                  if (baseElement) {
                    doc.body.appendChild(anchorElement);
                    anchorElement.href = anchorElement.href; // force href to refresh
                  }

                  if (anchorElement.protocol === ':' || !/:/.test(anchorElement.href)) {
                    throw new TypeError('Invalid URL');
                  }

                  Object.defineProperty(this, '_anchorElement', {
                    value: anchorElement
                  });


                  // create a linked searchParams which reflect its changes on URL
                  var searchParams = new global.URLSearchParams(this.search);
                  var enableSearchUpdate = true;
                  var enableSearchParamsUpdate = true;
                  var _this = this;
                  ['append', 'delete', 'set'].forEach(function(methodName) {
                    var method = searchParams[methodName];
                    searchParams[methodName] = function() {
                      method.apply(searchParams, arguments);
                      if (enableSearchUpdate) {
                        enableSearchParamsUpdate = false;
                        _this.search = searchParams.toString();
                        enableSearchParamsUpdate = true;
                      }
                    };
                  });

                  Object.defineProperty(this, 'searchParams', {
                    value: searchParams,
                    enumerable: true
                  });

                  var search = void 0;
                  Object.defineProperty(this, '_updateSearchParams', {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: function() {
                      if (this.search !== search) {
                        search = this.search;
                        if (enableSearchParamsUpdate) {
                          enableSearchUpdate = false;
                          this.searchParams._fromString(this.search);
                          enableSearchUpdate = true;
                        }
                      }
                    }
                  });
                };

                var proto = URL.prototype;

                var linkURLWithAnchorAttribute = function(attributeName) {
                  Object.defineProperty(proto, attributeName, {
                    get: function() {
                      return this._anchorElement[attributeName];
                    },
                    set: function(value) {
                      this._anchorElement[attributeName] = value;
                    },
                    enumerable: true
                  });
                };

                ['hash', 'host', 'hostname', 'port', 'protocol']
                  .forEach(function(attributeName) {
                    linkURLWithAnchorAttribute(attributeName);
                  });

                Object.defineProperty(proto, 'search', {
                  get: function() {
                    return this._anchorElement['search'];
                  },
                  set: function(value) {
                    this._anchorElement['search'] = value;
                    this._updateSearchParams();
                  },
                  enumerable: true
                });

                Object.defineProperties(proto, {

                  'toString': {
                    get: function() {
                      var _this = this;
                      return function() {
                        return _this.href;
                      };
                    }
                  },

                  'href': {
                    get: function() {
                      return this._anchorElement.href.replace(/\?$/, '');
                    },
                    set: function(value) {
                      this._anchorElement.href = value;
                      this._updateSearchParams();
                    },
                    enumerable: true
                  },

                  'pathname': {
                    get: function() {
                      return this._anchorElement.pathname.replace(/(^\/?)/, '/');
                    },
                    set: function(value) {
                      this._anchorElement.pathname = value;
                    },
                    enumerable: true
                  },

                  'origin': {
                    get: function() {
                      // get expected port from protocol
                      var expectedPort = { 'http:': 80, 'https:': 443, 'ftp:': 21 }[this._anchorElement.protocol];
                      // add port to origin if, expected port is different than actual port
                      // and it is not empty f.e http://foo:8080
                      // 8080 != 80 && 8080 != ''
                      var addPortToOrigin = this._anchorElement.port != expectedPort &&
                        this._anchorElement.port !== '';

                      return this._anchorElement.protocol +
                        '//' +
                        this._anchorElement.hostname +
                        (addPortToOrigin ? (':' + this._anchorElement.port) : '');
                    },
                    enumerable: true
                  },

                  'password': { // TODO
                    get: function() {
                      return '';
                    },
                    set: function(value) {
                    },
                    enumerable: true
                  },

                  'username': { // TODO
                    get: function() {
                      return '';
                    },
                    set: function(value) {
                    },
                    enumerable: true
                  },
                });

                URL.createObjectURL = function(blob) {
                  return _URL.createObjectURL.apply(_URL, arguments);
                };

                URL.revokeObjectURL = function(url) {
                  return _URL.revokeObjectURL.apply(_URL, arguments);
                };

                global.URL = URL;

              };

              if (!checkIfURLIsSupported()) {
                polyfillURL();
              }

              if ((global.location !== void 0) && !('origin' in global.location)) {
                var getOrigin = function() {
                  return global.location.protocol + '//' + global.location.hostname + (global.location.port ? (':' + global.location.port) : '');
                };

                try {
                  Object.defineProperty(global.location, 'origin', {
                    get: getOrigin,
                    enumerable: true
                  });
                } catch (e) {
                  setInterval(function() {
                    global.location.origin = getOrigin();
                  }, 100);
                }
              }

            })(
              (typeof global$1 !== 'undefined') ? global$1
                : ((typeof window !== 'undefined') ? window
                : ((typeof self !== 'undefined') ? self : undefined))
            );

            var urlPolyfill = /*#__PURE__*/Object.freeze({

            });

            var support = {
              searchParams: 'URLSearchParams' in self,
              iterable: 'Symbol' in self && 'iterator' in Symbol,
              blob:
                'FileReader' in self &&
                'Blob' in self &&
                (function() {
                  try {
                    new Blob();
                    return true
                  } catch (e) {
                    return false
                  }
                })(),
              formData: 'FormData' in self,
              arrayBuffer: 'ArrayBuffer' in self
            };

            function isDataView(obj) {
              return obj && DataView.prototype.isPrototypeOf(obj)
            }

            if (support.arrayBuffer) {
              var viewClasses = [
                '[object Int8Array]',
                '[object Uint8Array]',
                '[object Uint8ClampedArray]',
                '[object Int16Array]',
                '[object Uint16Array]',
                '[object Int32Array]',
                '[object Uint32Array]',
                '[object Float32Array]',
                '[object Float64Array]'
              ];

              var isArrayBufferView =
                ArrayBuffer.isView ||
                function(obj) {
                  return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
                };
            }

            function normalizeName(name) {
              if (typeof name !== 'string') {
                name = String(name);
              }
              if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
                throw new TypeError('Invalid character in header field name')
              }
              return name.toLowerCase()
            }

            function normalizeValue(value) {
              if (typeof value !== 'string') {
                value = String(value);
              }
              return value
            }

            // Build a destructive iterator for the value list
            function iteratorFor(items) {
              var iterator = {
                next: function() {
                  var value = items.shift();
                  return {done: value === undefined, value: value}
                }
              };

              if (support.iterable) {
                iterator[Symbol.iterator] = function() {
                  return iterator
                };
              }

              return iterator
            }

            function Headers$1(headers) {
              this.map = {};

              if (headers instanceof Headers$1) {
                headers.forEach(function(value, name) {
                  this.append(name, value);
                }, this);
              } else if (Array.isArray(headers)) {
                headers.forEach(function(header) {
                  this.append(header[0], header[1]);
                }, this);
              } else if (headers) {
                Object.getOwnPropertyNames(headers).forEach(function(name) {
                  this.append(name, headers[name]);
                }, this);
              }
            }

            Headers$1.prototype.append = function(name, value) {
              name = normalizeName(name);
              value = normalizeValue(value);
              var oldValue = this.map[name];
              this.map[name] = oldValue ? oldValue + ', ' + value : value;
            };

            Headers$1.prototype['delete'] = function(name) {
              delete this.map[normalizeName(name)];
            };

            Headers$1.prototype.get = function(name) {
              name = normalizeName(name);
              return this.has(name) ? this.map[name] : null
            };

            Headers$1.prototype.has = function(name) {
              return this.map.hasOwnProperty(normalizeName(name))
            };

            Headers$1.prototype.set = function(name, value) {
              this.map[normalizeName(name)] = normalizeValue(value);
            };

            Headers$1.prototype.forEach = function(callback, thisArg) {
              for (var name in this.map) {
                if (this.map.hasOwnProperty(name)) {
                  callback.call(thisArg, this.map[name], name, this);
                }
              }
            };

            Headers$1.prototype.keys = function() {
              var items = [];
              this.forEach(function(value, name) {
                items.push(name);
              });
              return iteratorFor(items)
            };

            Headers$1.prototype.values = function() {
              var items = [];
              this.forEach(function(value) {
                items.push(value);
              });
              return iteratorFor(items)
            };

            Headers$1.prototype.entries = function() {
              var items = [];
              this.forEach(function(value, name) {
                items.push([name, value]);
              });
              return iteratorFor(items)
            };

            if (support.iterable) {
              Headers$1.prototype[Symbol.iterator] = Headers$1.prototype.entries;
            }

            function consumed(body) {
              if (body.bodyUsed) {
                return Promise.reject(new TypeError('Already read'))
              }
              body.bodyUsed = true;
            }

            function fileReaderReady(reader) {
              return new Promise(function(resolve, reject) {
                reader.onload = function() {
                  resolve(reader.result);
                };
                reader.onerror = function() {
                  reject(reader.error);
                };
              })
            }

            function readBlobAsArrayBuffer(blob) {
              var reader = new FileReader();
              var promise = fileReaderReady(reader);
              reader.readAsArrayBuffer(blob);
              return promise
            }

            function readBlobAsText(blob) {
              var reader = new FileReader();
              var promise = fileReaderReady(reader);
              reader.readAsText(blob);
              return promise
            }

            function readArrayBufferAsText(buf) {
              var view = new Uint8Array(buf);
              var chars = new Array(view.length);

              for (var i = 0; i < view.length; i++) {
                chars[i] = String.fromCharCode(view[i]);
              }
              return chars.join('')
            }

            function bufferClone(buf) {
              if (buf.slice) {
                return buf.slice(0)
              } else {
                var view = new Uint8Array(buf.byteLength);
                view.set(new Uint8Array(buf));
                return view.buffer
              }
            }

            function Body() {
              this.bodyUsed = false;

              this._initBody = function(body) {
                this._bodyInit = body;
                if (!body) {
                  this._bodyText = '';
                } else if (typeof body === 'string') {
                  this._bodyText = body;
                } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                  this._bodyBlob = body;
                } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                  this._bodyFormData = body;
                } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                  this._bodyText = body.toString();
                } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                  this._bodyArrayBuffer = bufferClone(body.buffer);
                  // IE 10-11 can't handle a DataView body.
                  this._bodyInit = new Blob([this._bodyArrayBuffer]);
                } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                  this._bodyArrayBuffer = bufferClone(body);
                } else {
                  this._bodyText = body = Object.prototype.toString.call(body);
                }

                if (!this.headers.get('content-type')) {
                  if (typeof body === 'string') {
                    this.headers.set('content-type', 'text/plain;charset=UTF-8');
                  } else if (this._bodyBlob && this._bodyBlob.type) {
                    this.headers.set('content-type', this._bodyBlob.type);
                  } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                    this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
                  }
                }
              };

              if (support.blob) {
                this.blob = function() {
                  var rejected = consumed(this);
                  if (rejected) {
                    return rejected
                  }

                  if (this._bodyBlob) {
                    return Promise.resolve(this._bodyBlob)
                  } else if (this._bodyArrayBuffer) {
                    return Promise.resolve(new Blob([this._bodyArrayBuffer]))
                  } else if (this._bodyFormData) {
                    throw new Error('could not read FormData body as blob')
                  } else {
                    return Promise.resolve(new Blob([this._bodyText]))
                  }
                };

                this.arrayBuffer = function() {
                  if (this._bodyArrayBuffer) {
                    return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
                  } else {
                    return this.blob().then(readBlobAsArrayBuffer)
                  }
                };
              }

              this.text = function() {
                var rejected = consumed(this);
                if (rejected) {
                  return rejected
                }

                if (this._bodyBlob) {
                  return readBlobAsText(this._bodyBlob)
                } else if (this._bodyArrayBuffer) {
                  return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
                } else if (this._bodyFormData) {
                  throw new Error('could not read FormData body as text')
                } else {
                  return Promise.resolve(this._bodyText)
                }
              };

              if (support.formData) {
                this.formData = function() {
                  return this.text().then(decode)
                };
              }

              this.json = function() {
                return this.text().then(JSON.parse)
              };

              return this
            }

            // HTTP methods whose capitalization should be normalized
            var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

            function normalizeMethod(method) {
              var upcased = method.toUpperCase();
              return methods.indexOf(upcased) > -1 ? upcased : method
            }

            function Request(input, options) {
              options = options || {};
              var body = options.body;

              if (input instanceof Request) {
                if (input.bodyUsed) {
                  throw new TypeError('Already read')
                }
                this.url = input.url;
                this.credentials = input.credentials;
                if (!options.headers) {
                  this.headers = new Headers$1(input.headers);
                }
                this.method = input.method;
                this.mode = input.mode;
                this.signal = input.signal;
                if (!body && input._bodyInit != null) {
                  body = input._bodyInit;
                  input.bodyUsed = true;
                }
              } else {
                this.url = String(input);
              }

              this.credentials = options.credentials || this.credentials || 'same-origin';
              if (options.headers || !this.headers) {
                this.headers = new Headers$1(options.headers);
              }
              this.method = normalizeMethod(options.method || this.method || 'GET');
              this.mode = options.mode || this.mode || null;
              this.signal = options.signal || this.signal;
              this.referrer = null;

              if ((this.method === 'GET' || this.method === 'HEAD') && body) {
                throw new TypeError('Body not allowed for GET or HEAD requests')
              }
              this._initBody(body);
            }

            Request.prototype.clone = function() {
              return new Request(this, {body: this._bodyInit})
            };

            function decode(body) {
              var form = new FormData();
              body
                .trim()
                .split('&')
                .forEach(function(bytes) {
                  if (bytes) {
                    var split = bytes.split('=');
                    var name = split.shift().replace(/\+/g, ' ');
                    var value = split.join('=').replace(/\+/g, ' ');
                    form.append(decodeURIComponent(name), decodeURIComponent(value));
                  }
                });
              return form
            }

            function parseHeaders(rawHeaders) {
              var headers = new Headers$1();
              // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
              // https://tools.ietf.org/html/rfc7230#section-3.2
              var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
              preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
                var parts = line.split(':');
                var key = parts.shift().trim();
                if (key) {
                  var value = parts.join(':').trim();
                  headers.append(key, value);
                }
              });
              return headers
            }

            Body.call(Request.prototype);

            function Response(bodyInit, options) {
              if (!options) {
                options = {};
              }

              this.type = 'default';
              this.status = options.status === undefined ? 200 : options.status;
              this.ok = this.status >= 200 && this.status < 300;
              this.statusText = 'statusText' in options ? options.statusText : 'OK';
              this.headers = new Headers$1(options.headers);
              this.url = options.url || '';
              this._initBody(bodyInit);
            }

            Body.call(Response.prototype);

            Response.prototype.clone = function() {
              return new Response(this._bodyInit, {
                status: this.status,
                statusText: this.statusText,
                headers: new Headers$1(this.headers),
                url: this.url
              })
            };

            Response.error = function() {
              var response = new Response(null, {status: 0, statusText: ''});
              response.type = 'error';
              return response
            };

            var redirectStatuses = [301, 302, 303, 307, 308];

            Response.redirect = function(url, status) {
              if (redirectStatuses.indexOf(status) === -1) {
                throw new RangeError('Invalid status code')
              }

              return new Response(null, {status: status, headers: {location: url}})
            };

            var DOMException = self.DOMException;
            try {
              new DOMException();
            } catch (err) {
              DOMException = function(message, name) {
                this.message = message;
                this.name = name;
                var error = Error(message);
                this.stack = error.stack;
              };
              DOMException.prototype = Object.create(Error.prototype);
              DOMException.prototype.constructor = DOMException;
            }

            function fetch(input, init) {
              return new Promise(function(resolve, reject) {
                var request = new Request(input, init);

                if (request.signal && request.signal.aborted) {
                  return reject(new DOMException('Aborted', 'AbortError'))
                }

                var xhr = new XMLHttpRequest();

                function abortXhr() {
                  xhr.abort();
                }

                xhr.onload = function() {
                  var options = {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: parseHeaders(xhr.getAllResponseHeaders() || '')
                  };
                  options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
                  var body = 'response' in xhr ? xhr.response : xhr.responseText;
                  resolve(new Response(body, options));
                };

                xhr.onerror = function() {
                  reject(new TypeError('Network request failed'));
                };

                xhr.ontimeout = function() {
                  reject(new TypeError('Network request failed'));
                };

                xhr.onabort = function() {
                  reject(new DOMException('Aborted', 'AbortError'));
                };

                xhr.open(request.method, request.url, true);

                if (request.credentials === 'include') {
                  xhr.withCredentials = true;
                } else if (request.credentials === 'omit') {
                  xhr.withCredentials = false;
                }

                if ('responseType' in xhr && support.blob) {
                  xhr.responseType = 'blob';
                }

                request.headers.forEach(function(value, name) {
                  xhr.setRequestHeader(name, value);
                });

                if (request.signal) {
                  request.signal.addEventListener('abort', abortXhr);

                  xhr.onreadystatechange = function() {
                    // DONE (success or failure)
                    if (xhr.readyState === 4) {
                      request.signal.removeEventListener('abort', abortXhr);
                    }
                  };
                }

                xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
              })
            }

            fetch.polyfill = true;

            if (!self.fetch) {
              self.fetch = fetch;
              self.Headers = Headers$1;
              self.Request = Request;
              self.Response = Response;
            }

            var fetch$1 = /*#__PURE__*/Object.freeze({
                        Headers: Headers$1,
                        Request: Request,
                        Response: Response,
                        get DOMException () { return DOMException; },
                        fetch: fetch
            });

            var EYES_NAME_SPACE = '__EYES__APPLITOOLS__';

            function pullify(script) {
              var win = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
              return function () {
                var scriptName = script.name;

                if (!win[EYES_NAME_SPACE]) {
                  win[EYES_NAME_SPACE] = {};
                }

                if (!win[EYES_NAME_SPACE][scriptName]) {
                  win[EYES_NAME_SPACE][scriptName] = {
                    status: 'WIP',
                    value: null,
                    error: null
                  };
                  script.apply(null, arguments).then(function (r) {
                    return resultObject.status = 'SUCCESS', resultObject.value = r;
                  }).catch(function (e) {
                    return resultObject.status = 'ERROR', resultObject.error = e.message;
                  });
                }

                var resultObject = win[EYES_NAME_SPACE][scriptName];

                if (resultObject.status === 'SUCCESS') {
                  win[EYES_NAME_SPACE][scriptName] = null;
                }

                return JSON.stringify(resultObject);
              };
            }

            var pollify = pullify;

            // License: https://github.com/beatgammit/base64-js/blob/bf68aaa277d9de7007cc0c58279c411bb10670ac/LICENSE

            function arrayBufferToBase64(ab) {
              var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
              var uint8 = new Uint8Array(ab);
              var len = uint8.length;
              var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes

              var parts = [];
              var maxChunkLength = 16383; // must be multiple of 3

              var tmp; // go through the array every three bytes, we'll deal with trailing stuff later

              for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
                parts.push(encodeChunk(i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
              } // pad the end with zeros, but make sure to not forget the extra bytes


              if (extraBytes === 1) {
                tmp = uint8[len - 1];
                parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 0x3f] + '==');
              } else if (extraBytes === 2) {
                tmp = (uint8[len - 2] << 8) + uint8[len - 1];
                parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 0x3f] + lookup[tmp << 2 & 0x3f] + '=');
              }

              return parts.join('');

              function tripletToBase64(num) {
                return lookup[num >> 18 & 0x3f] + lookup[num >> 12 & 0x3f] + lookup[num >> 6 & 0x3f] + lookup[num & 0x3f];
              }

              function encodeChunk(start, end) {
                var tmp;
                var output = [];

                for (var _i = start; _i < end; _i += 3) {
                  tmp = (uint8[_i] << 16 & 0xff0000) + (uint8[_i + 1] << 8 & 0xff00) + (uint8[_i + 2] & 0xff);
                  output.push(tripletToBase64(tmp));
                }

                return output.join('');
              }
            }

            var arrayBufferToBase64_1 = arrayBufferToBase64;

            function extractLinks() {
              var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
              var srcsetUrls = Array.from(doc.querySelectorAll('img[srcset],source[srcset]')).map(function (srcsetEl) {
                return srcsetEl.getAttribute('srcset').split(', ').map(function (str) {
                  return str.trim().split(/\s+/)[0];
                });
              }).reduce(function (acc, urls) {
                return acc.concat(urls);
              }, []);
              var srcUrls = Array.from(doc.querySelectorAll('img[src],source[src],input[type="image"][src]')).map(function (srcEl) {
                return srcEl.getAttribute('src');
              });
              var imageUrls = Array.from(doc.querySelectorAll('image,use')).map(function (hrefEl) {
                return hrefEl.getAttribute('href') || hrefEl.getAttribute('xlink:href');
              }).filter(function (u) {
                return u && u[0] !== '#';
              });
              var objectUrls = Array.from(doc.querySelectorAll('object')).map(function (el) {
                return el.getAttribute('data');
              }).filter(Boolean);
              var cssUrls = Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).map(function (link) {
                return link.getAttribute('href');
              });
              var videoPosterUrls = Array.from(doc.querySelectorAll('video[poster]')).map(function (videoEl) {
                return videoEl.getAttribute('poster');
              });
              return Array.from(srcsetUrls).concat(Array.from(srcUrls)).concat(Array.from(imageUrls)).concat(Array.from(cssUrls)).concat(Array.from(videoPosterUrls)).concat(Array.from(objectUrls));
            }

            var extractLinks_1 = extractLinks;

            function uuid() {
              return window.crypto.getRandomValues(new Uint32Array(1))[0];
            }

            var uuid_1 = uuid;

            function isInlineFrame(frame) {
              return !/^https?:.+/.test(frame.src) || frame.contentDocument && frame.contentDocument.location && frame.contentDocument.location.href === 'about:blank';
            }

            var isInlineFrame_1 = isInlineFrame;

            function isAccessibleFrame(frame) {
              try {
                var doc = frame.contentDocument;
                return !!(doc && doc.defaultView && doc.defaultView.frameElement);
              } catch (err) {// for CORS frames
              }
            }

            var isAccessibleFrame_1 = isAccessibleFrame;

            function absolutizeUrl(url, absoluteUrl) {
              return new URL(url, absoluteUrl).href;
            }

            var absolutizeUrl_1 = absolutizeUrl;

            var NEED_MAP_INPUT_TYPES = new Set(['date', 'datetime-local', 'email', 'month', 'number', 'password', 'search', 'tel', 'text', 'time', 'url', 'week']);

            function domNodesToCdt(docNode, baseUrl) {
              var cdt = [{
                nodeType: Node.DOCUMENT_NODE
              }];
              var docRoots = [docNode];
              var canvasElements = [];
              var inlineFrames = [];
              cdt[0].childNodeIndexes = childrenFactory(cdt, docNode.childNodes);
              return {
                cdt: cdt,
                docRoots: docRoots,
                canvasElements: canvasElements,
                inlineFrames: inlineFrames
              };

              function childrenFactory(cdt, elementNodes) {
                if (!elementNodes || elementNodes.length === 0) return null;
                var childIndexes = [];
                Array.prototype.forEach.call(elementNodes, function (elementNode) {
                  var index = elementNodeFactory(cdt, elementNode);

                  if (index !== null) {
                    childIndexes.push(index);
                  }
                });
                return childIndexes;
              }

              function elementNodeFactory(cdt, elementNode) {
                var node, manualChildNodeIndexes, dummyUrl;
                var nodeType = elementNode.nodeType;

                if ([Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].includes(nodeType)) {
                  if (elementNode.nodeName !== 'SCRIPT') {
                    if (elementNode.nodeName === 'STYLE' && elementNode.sheet && elementNode.sheet.cssRules.length) {
                      cdt.push(getCssRulesNode(elementNode));
                      manualChildNodeIndexes = [cdt.length - 1];
                    }

                    if (elementNode.tagName === 'TEXTAREA' && elementNode.value !== elementNode.textContent) {
                      cdt.push(getTextContentNode(elementNode));
                      manualChildNodeIndexes = [cdt.length - 1];
                    }

                    node = getBasicNode(elementNode);
                    node.childNodeIndexes = manualChildNodeIndexes || (elementNode.childNodes.length ? childrenFactory(cdt, elementNode.childNodes) : []);

                    if (elementNode.shadowRoot) {
                      node.shadowRootIndex = elementNodeFactory(cdt, elementNode.shadowRoot);
                      docRoots.push(elementNode.shadowRoot);
                    }

                    if (elementNode.nodeName === 'CANVAS') {
                      dummyUrl = absolutizeUrl_1("applitools-canvas-".concat(uuid_1(), ".png"), baseUrl);
                      node.attributes.push({
                        name: 'data-applitools-src',
                        value: dummyUrl
                      });
                      canvasElements.push({
                        element: elementNode,
                        url: dummyUrl
                      });
                    }

                    if (elementNode.nodeName === 'IFRAME' && isAccessibleFrame_1(elementNode) && isInlineFrame_1(elementNode)) {
                      dummyUrl = absolutizeUrl_1("?applitools-iframe=".concat(uuid_1()), baseUrl);
                      node.attributes.push({
                        name: 'data-applitools-src',
                        value: dummyUrl
                      });
                      inlineFrames.push({
                        element: elementNode,
                        url: dummyUrl
                      });
                    }
                  } else {
                    node = getScriptNode(elementNode);
                  }
                } else if (nodeType === Node.TEXT_NODE) {
                  node = getTextNode(elementNode);
                } else if (nodeType === Node.DOCUMENT_TYPE_NODE) {
                  node = getDocNode(elementNode);
                }

                if (node) {
                  cdt.push(node);
                  return cdt.length - 1;
                } else {
                  return null;
                }
              }

              function nodeAttributes(_ref) {
                var _ref$attributes = _ref.attributes,
                    attributes = _ref$attributes === void 0 ? {} : _ref$attributes;
                return Object.keys(attributes).filter(function (k) {
                  return attributes[k] && attributes[k].name;
                });
              }

              function getCssRulesNode(elementNode) {
                return {
                  nodeType: Node.TEXT_NODE,
                  nodeValue: Array.from(elementNode.sheet.cssRules).map(function (rule) {
                    return rule.cssText;
                  }).join('')
                };
              }

              function getTextContentNode(elementNode) {
                return {
                  nodeType: Node.TEXT_NODE,
                  nodeValue: elementNode.value
                };
              }

              function getBasicNode(elementNode) {
                var node = {
                  nodeType: elementNode.nodeType,
                  nodeName: elementNode.nodeName,
                  attributes: nodeAttributes(elementNode).map(function (key) {
                    var value = elementNode.attributes[key].value;
                    var name = elementNode.attributes[key].name;

                    if (/^blob:/.test(value)) {
                      value = value.replace(/^blob:/, '');
                    }

                    return {
                      name: name,
                      value: value
                    };
                  })
                };

                if (elementNode.tagName === 'INPUT' && ['checkbox', 'radio'].includes(elementNode.type)) {
                  if (elementNode.attributes.checked && !elementNode.checked) {
                    var idx = node.attributes.findIndex(function (a) {
                      return a.name === 'checked';
                    });
                    node.attributes.splice(idx, 1);
                  }

                  if (!elementNode.attributes.checked && elementNode.checked) {
                    node.attributes.push({
                      name: 'checked'
                    });
                  }
                }

                if (elementNode.tagName === 'INPUT' && NEED_MAP_INPUT_TYPES.has(elementNode.type) && (elementNode.attributes.value && elementNode.attributes.value.value) !== elementNode.value) {
                  var nodeAttr = node.attributes.find(function (a) {
                    return a.name === 'value';
                  });

                  if (nodeAttr) {
                    nodeAttr.value = elementNode.value;
                  } else {
                    node.attributes.push({
                      name: 'value',
                      value: elementNode.value
                    });
                  }
                }

                if (elementNode.tagName === 'OPTION' && elementNode.parentElement.value === elementNode.value) {
                  var _nodeAttr = node.attributes.find(function (a) {
                    return a.name === 'selected';
                  });

                  if (!_nodeAttr) {
                    node.attributes.push({
                      name: 'selected',
                      value: ''
                    });
                  }
                }

                return node;
              }

              function getScriptNode(elementNode) {
                return {
                  nodeType: Node.ELEMENT_NODE,
                  nodeName: 'SCRIPT',
                  attributes: nodeAttributes(elementNode).map(function (key) {
                    return {
                      name: elementNode.attributes[key].name,
                      value: elementNode.attributes[key].value
                    };
                  }).filter(function (attr) {
                    return attr.name !== 'src';
                  }),
                  childNodeIndexes: []
                };
              }

              function getTextNode(elementNode) {
                return {
                  nodeType: Node.TEXT_NODE,
                  nodeValue: elementNode.nodeValue
                };
              }

              function getDocNode(elementNode) {
                return {
                  nodeType: Node.DOCUMENT_TYPE_NODE,
                  nodeName: elementNode.nodeName
                };
              }
            }

            var domNodesToCdt_1 = domNodesToCdt;

            function uniq(arr) {
              var result = [];
              new Set(arr).forEach(function (v) {
                return v && result.push(v);
              });
              return result;
            }

            var uniq_1 = uniq;

            function aggregateResourceUrlsAndBlobs(resourceUrlsAndBlobsArr) {
              return resourceUrlsAndBlobsArr.reduce(function (_ref, _ref2) {
                var allResourceUrls = _ref.resourceUrls,
                    allBlobsObj = _ref.blobsObj;
                var resourceUrls = _ref2.resourceUrls,
                    blobsObj = _ref2.blobsObj;
                return {
                  resourceUrls: uniq_1(allResourceUrls.concat(resourceUrls)),
                  blobsObj: Object.assign(allBlobsObj, blobsObj)
                };
              }, {
                resourceUrls: [],
                blobsObj: {}
              });
            }

            var aggregateResourceUrlsAndBlobs_1 = aggregateResourceUrlsAndBlobs;

            function makeGetResourceUrlsAndBlobs(_ref) {
              var processResource = _ref.processResource,
                  aggregateResourceUrlsAndBlobs = _ref.aggregateResourceUrlsAndBlobs;
              return function getResourceUrlsAndBlobs(_ref2) {
                var documents = _ref2.documents,
                    urls = _ref2.urls,
                    _ref2$forceCreateStyl = _ref2.forceCreateStyle,
                    forceCreateStyle = _ref2$forceCreateStyl === void 0 ? false : _ref2$forceCreateStyl;
                return Promise.all(urls.map(function (url) {
                  return processResource({
                    url: url,
                    documents: documents,
                    getResourceUrlsAndBlobs: getResourceUrlsAndBlobs,
                    forceCreateStyle: forceCreateStyle
                  });
                })).then(function (resourceUrlsAndBlobsArr) {
                  return aggregateResourceUrlsAndBlobs(resourceUrlsAndBlobsArr);
                });
              };
            }

            var getResourceUrlsAndBlobs = makeGetResourceUrlsAndBlobs;

            function _defineProperty(obj, key, value) {
              if (key in obj) {
                Object.defineProperty(obj, key, {
                  value: value,
                  enumerable: true,
                  configurable: true,
                  writable: true
                });
              } else {
                obj[key] = value;
              }

              return obj;
            }

            function filterInlineUrl(absoluteUrl) {
              return /^(blob|https?):/.test(absoluteUrl);
            }

            var filterInlineUrl_1 = filterInlineUrl;

            function toUnAnchoredUri(url) {
              var m = url && url.match(/(^[^#]*)/);
              var res = m && m[1] || url;
              return res && res.replace(/\?\s*$/, '') || url;
            }

            var toUnAnchoredUri_1 = toUnAnchoredUri;

            var noop = function noop() {};

            function flat(arr) {
              return arr.reduce(function (flatArr, item) {
                return flatArr.concat(item);
              }, []);
            }

            var flat_1 = flat;

            function makeProcessResource(_ref) {
              var fetchUrl = _ref.fetchUrl,
                  findStyleSheetByUrl = _ref.findStyleSheetByUrl,
                  getCorsFreeStyleSheet = _ref.getCorsFreeStyleSheet,
                  extractResourcesFromStyleSheet = _ref.extractResourcesFromStyleSheet,
                  extractResourcesFromSvg = _ref.extractResourcesFromSvg,
                  sessionCache = _ref.sessionCache,
                  _ref$cache = _ref.cache,
                  cache = _ref$cache === void 0 ? {} : _ref$cache,
                  _ref$log = _ref.log,
                  log = _ref$log === void 0 ? noop : _ref$log;
              return function processResource(_ref2) {
                var url = _ref2.url,
                    documents = _ref2.documents,
                    getResourceUrlsAndBlobs = _ref2.getResourceUrlsAndBlobs,
                    _ref2$forceCreateStyl = _ref2.forceCreateStyle,
                    forceCreateStyle = _ref2$forceCreateStyl === void 0 ? false : _ref2$forceCreateStyl;

                if (!cache[url]) {
                  if (sessionCache && sessionCache.getItem(url)) {
                    var resourceUrls = getDependencies(url);
                    log('doProcessResource from sessionStorage', url, 'deps:', resourceUrls.slice(1));
                    cache[url] = Promise.resolve({
                      resourceUrls: resourceUrls
                    });
                  } else {
                    var now = Date.now();
                    cache[url] = doProcessResource(url).then(function (result) {
                      log('doProcessResource', "[".concat(Date.now() - now, "ms]"), url);
                      return result;
                    });
                  }
                }

                return cache[url];

                function doProcessResource(url) {
                  log('fetching', url);
                  var now = Date.now();
                  return fetchUrl(url).catch(function (e) {
                    if (probablyCORS(e)) {
                      return {
                        probablyCORS: true,
                        url: url
                      };
                    } else {
                      throw e;
                    }
                  }).then(function (_ref3) {
                    var url = _ref3.url,
                        type = _ref3.type,
                        value = _ref3.value,
                        probablyCORS = _ref3.probablyCORS;

                    if (probablyCORS) {
                      sessionCache && sessionCache.setItem(url, []);
                      return {
                        resourceUrls: [url]
                      };
                    }

                    log('fetched', "[".concat(Date.now() - now, "ms]"), url);

                    var thisBlob = _defineProperty({}, url, {
                      type: type,
                      value: value
                    });

                    var dependentUrls;

                    if (/text\/css/.test(type)) {
                      var styleSheet = findStyleSheetByUrl(url, documents);

                      if (styleSheet || forceCreateStyle) {
                        var _getCorsFreeStyleShee = getCorsFreeStyleSheet(value, styleSheet),
                            corsFreeStyleSheet = _getCorsFreeStyleShee.corsFreeStyleSheet,
                            cleanStyleSheet = _getCorsFreeStyleShee.cleanStyleSheet;

                        dependentUrls = extractResourcesFromStyleSheet(corsFreeStyleSheet);
                        cleanStyleSheet();
                      }
                    } else if (/image\/svg/.test(type)) {
                      try {
                        dependentUrls = extractResourcesFromSvg(value);
                        forceCreateStyle = !!dependentUrls;
                      } catch (e) {
                        console.log('could not parse svg content', e);
                      }
                    }

                    if (dependentUrls) {
                      var absoluteDependentUrls = dependentUrls.map(function (resourceUrl) {
                        return absolutizeUrl_1(resourceUrl, url.replace(/^blob:/, ''));
                      }).map(toUnAnchoredUri_1).filter(filterInlineUrl_1);
                      sessionCache && sessionCache.setItem(url, absoluteDependentUrls);
                      return getResourceUrlsAndBlobs({
                        documents: documents,
                        urls: absoluteDependentUrls,
                        forceCreateStyle: forceCreateStyle
                      }).then(function (_ref4) {
                        var resourceUrls = _ref4.resourceUrls,
                            blobsObj = _ref4.blobsObj;
                        return {
                          resourceUrls: resourceUrls,
                          blobsObj: Object.assign(blobsObj, thisBlob)
                        };
                      });
                    } else {
                      sessionCache && sessionCache.setItem(url, []);
                      return {
                        blobsObj: thisBlob
                      };
                    }
                  }).catch(function (err) {
                    log('error while fetching', url, err);
                    sessionCache && clearFromSessionStorage();
                    return {};
                  });
                }

                function probablyCORS(err) {
                  var msg = err.message && (err.message.includes('Failed to fetch') || err.message.includes('Network request failed'));
                  var name = err.name && err.name.includes('TypeError');
                  return msg && name;
                }

                function getDependencies(url) {
                  var dependentUrls = sessionCache.getItem(url);
                  return [url].concat(dependentUrls ? uniq_1(flat_1(dependentUrls.map(getDependencies))) : []);
                }

                function clearFromSessionStorage() {
                  log('clearing from sessionStorage:', url);
                  sessionCache.keys().forEach(function (key) {
                    var dependentUrls = sessionCache.getItem(key);
                    sessionCache.setItem(key, dependentUrls.filter(function (dep) {
                      return dep !== url;
                    }));
                  });
                  log('cleared from sessionStorage:', url);
                }
              };
            }

            var processResource = makeProcessResource;

            function getUrlFromCssText(cssText) {
              var re = /url\((?!['"]?:)['"]?([^'")]*)['"]?\)/g;
              var ret = [];
              var result;

              while ((result = re.exec(cssText)) !== null) {
                ret.push(result[1]);
              }

              return ret;
            }

            var getUrlFromCssText_1 = getUrlFromCssText;

            function makeExtractResourcesFromSvg(_ref) {
              var parser = _ref.parser,
                  decoder = _ref.decoder,
                  extractResourceUrlsFromStyleTags = _ref.extractResourceUrlsFromStyleTags;
              return function (svgArrayBuffer) {
                var decooder = decoder || new TextDecoder('utf-8');
                var svgStr = decooder.decode(svgArrayBuffer);
                var domparser = parser || new DOMParser();
                var doc = domparser.parseFromString(svgStr, 'image/svg+xml');
                var srcsetUrls = Array.from(doc.querySelectorAll('img[srcset]')).map(function (srcsetEl) {
                  return srcsetEl.getAttribute('srcset').split(', ').map(function (str) {
                    return str.trim().split(/\s+/)[0];
                  });
                }).reduce(function (acc, urls) {
                  return acc.concat(urls);
                }, []);
                var srcUrls = Array.from(doc.querySelectorAll('img[src]')).map(function (srcEl) {
                  return srcEl.getAttribute('src');
                });
                var fromHref = Array.from(doc.querySelectorAll('image,use,link[rel="stylesheet"]')).map(function (e) {
                  return e.getAttribute('href') || e.getAttribute('xlink:href');
                });
                var fromObjects = Array.from(doc.getElementsByTagName('object')).map(function (e) {
                  return e.getAttribute('data');
                });
                var fromStyleTags = extractResourceUrlsFromStyleTags(doc, false);
                var fromStyleAttrs = urlsFromStyleAttrOfDoc(doc);
                return srcsetUrls.concat(srcUrls).concat(fromHref).concat(fromObjects).concat(fromStyleTags).concat(fromStyleAttrs).filter(function (u) {
                  return u[0] !== '#';
                });
              };
            }

            function urlsFromStyleAttrOfDoc(doc) {
              return flat_1(Array.from(doc.querySelectorAll('*[style]')).map(function (e) {
                return e.style.cssText;
              }).map(getUrlFromCssText_1).filter(Boolean));
            }

            var makeExtractResourcesFromSvg_1 = makeExtractResourcesFromSvg;

            /* global window */

            function fetchUrl(url) {
              var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.fetch;
              // Why return a `new Promise` like this? Because people like Atlassian do horrible things.
              // They monkey patched window.fetch, and made it so it throws a synchronous exception if the route is not well known.
              // Returning a new Promise guarantees that `fetchUrl` is the async function that it declares to be.
              return new Promise(function (resolve, reject) {
                return fetch(url, {
                  cache: 'force-cache',
                  credentials: 'same-origin'
                }).then(function (resp) {
                  return resp.status === 200 ? resp.arrayBuffer().then(function (buff) {
                    return {
                      url: url,
                      type: resp.headers.get('Content-Type'),
                      value: buff
                    };
                  }) : Promise.reject("bad status code ".concat(resp.status));
                }).then(resolve).catch(function (err) {
                  return reject(err);
                });
              });
            }

            var fetchUrl_1 = fetchUrl;

            function sanitizeAuthUrl(urlStr) {
              var url = new URL(urlStr);

              if (url.username) {
                url.username = '';
              }

              if (url.password) {
                url.password = '';
              }

              return url.href;
            }

            var sanitizeAuthUrl_1 = sanitizeAuthUrl;

            function makeFindStyleSheetByUrl(_ref) {
              var styleSheetCache = _ref.styleSheetCache;
              return function findStyleSheetByUrl(url, documents) {
                var allStylesheets = flat_1(documents.map(function (d) {
                  return Array.from(d.styleSheets);
                }));
                return styleSheetCache[url] || allStylesheets.find(function (styleSheet) {
                  var styleUrl = styleSheet.href && toUnAnchoredUri_1(styleSheet.href);
                  return styleUrl && sanitizeAuthUrl_1(styleUrl) === url;
                });
              };
            }

            var findStyleSheetByUrl = makeFindStyleSheetByUrl;

            function makeExtractResourcesFromStyleSheet(_ref) {
              var styleSheetCache = _ref.styleSheetCache,
                  _ref$CSSRule = _ref.CSSRule,
                  CSSRule = _ref$CSSRule === void 0 ? window.CSSRule : _ref$CSSRule;
              return function extractResourcesFromStyleSheet(styleSheet) {
                var urls = uniq_1(Array.from(styleSheet.cssRules || []).reduce(function (acc, rule) {
                  var _CSSRule$IMPORT_RULE$;

                  var getRuleUrls = (_CSSRule$IMPORT_RULE$ = {}, _defineProperty(_CSSRule$IMPORT_RULE$, CSSRule.IMPORT_RULE, function () {
                    if (rule.styleSheet) {
                      styleSheetCache[rule.styleSheet.href] = rule.styleSheet;
                      return rule.href;
                    }
                  }), _defineProperty(_CSSRule$IMPORT_RULE$, CSSRule.FONT_FACE_RULE, function () {
                    return getUrlFromCssText_1(rule.cssText);
                  }), _defineProperty(_CSSRule$IMPORT_RULE$, CSSRule.SUPPORTS_RULE, function () {
                    return extractResourcesFromStyleSheet(rule);
                  }), _defineProperty(_CSSRule$IMPORT_RULE$, CSSRule.MEDIA_RULE, function () {
                    return extractResourcesFromStyleSheet(rule);
                  }), _defineProperty(_CSSRule$IMPORT_RULE$, CSSRule.STYLE_RULE, function () {
                    var rv = [];

                    for (var i = 0, ii = rule.style.length; i < ii; i++) {
                      var _urls = getUrlFromCssText_1(rule.style.getPropertyValue(rule.style[i]));

                      rv = rv.concat(_urls);
                    }

                    return rv;
                  }), _CSSRule$IMPORT_RULE$)[rule.type];
                  var urls = getRuleUrls && getRuleUrls() || [];
                  return acc.concat(urls);
                }, []));
                return urls.filter(function (u) {
                  return u[0] !== '#';
                });
              };
            }

            var extractResourcesFromStyleSheet = makeExtractResourcesFromStyleSheet;

            function extractResourceUrlsFromStyleAttrs(cdt) {
              return cdt.reduce(function (acc, node) {
                if (node.nodeType === 1) {
                  var styleAttr = node.attributes && node.attributes.find(function (attr) {
                    return attr.name.toUpperCase() === 'STYLE';
                  });
                  if (styleAttr) acc = acc.concat(getUrlFromCssText_1(styleAttr.value));
                }

                return acc;
              }, []);
            }

            var extractResourceUrlsFromStyleAttrs_1 = extractResourceUrlsFromStyleAttrs;

            function makeExtractResourceUrlsFromStyleTags(extractResourcesFromStyleSheet) {
              return function extractResourceUrlsFromStyleTags(doc) {
                var onlyDocStylesheet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
                return uniq_1(Array.from(doc.querySelectorAll('style')).reduce(function (resourceUrls, styleEl) {
                  var styleSheet = onlyDocStylesheet ? Array.from(doc.styleSheets).find(function (styleSheet) {
                    return styleSheet.ownerNode === styleEl;
                  }) : styleEl.sheet;
                  return styleSheet ? resourceUrls.concat(extractResourcesFromStyleSheet(styleSheet)) : resourceUrls;
                }, []));
              };
            }

            var extractResourceUrlsFromStyleTags = makeExtractResourceUrlsFromStyleTags;

            function createTempStylsheet(cssArrayBuffer) {
              var cssText = new TextDecoder('utf-8').decode(cssArrayBuffer);
              var head = document.head || document.querySelectorAll('head')[0];
              var style = document.createElement('style');
              style.type = 'text/css';
              style.setAttribute('data-desc', 'Applitools tmp variable created by DOM SNAPSHOT');
              head.appendChild(style); // This is required for IE8 and below.

              if (style.styleSheet) {
                style.styleSheet.cssText = cssText;
              } else {
                style.appendChild(document.createTextNode(cssText));
              }

              return style.sheet;
            }

            var createTempStyleSheet = createTempStylsheet;

            function getCorsFreeStyleSheet(cssArrayBuffer, styleSheet) {
              var corsFreeStyleSheet;

              if (styleSheet) {
                try {
                  styleSheet.cssRules;
                  corsFreeStyleSheet = styleSheet;
                } catch (e) {
                  console.log("[dom-snapshot] could not access cssRules for ".concat(styleSheet.href, " ").concat(e, "\ncreating temp style for access."));
                  corsFreeStyleSheet = createTempStyleSheet(cssArrayBuffer);
                }
              } else {
                corsFreeStyleSheet = createTempStyleSheet(cssArrayBuffer);
              }

              return {
                corsFreeStyleSheet: corsFreeStyleSheet,
                cleanStyleSheet: cleanStyleSheet
              };

              function cleanStyleSheet() {
                if (corsFreeStyleSheet !== styleSheet) {
                  corsFreeStyleSheet.ownerNode.parentNode.removeChild(corsFreeStyleSheet.ownerNode);
                }
              }
            }

            var getCorsFreeStyleSheet_1 = getCorsFreeStyleSheet;

            function base64ToArrayBuffer(base64) {
              var binary_string = window.atob(base64);
              var len = binary_string.length;
              var bytes = new Uint8Array(len);

              for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
              }

              return bytes.buffer;
            }

            var base64ToArrayBuffer_1 = base64ToArrayBuffer;

            function buildCanvasBlobs(canvasElements) {
              return canvasElements.map(function (_ref) {
                var url = _ref.url,
                    element = _ref.element;
                var data = element.toDataURL('image/png');
                var value = base64ToArrayBuffer_1(data.split(',')[1]);
                return {
                  url: url,
                  type: 'image/png',
                  value: value
                };
              });
            }

            var buildCanvasBlobs_1 = buildCanvasBlobs;

            function extractFrames() {
              var documents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [document];
              var iframes = flat_1(documents.map(function (d) {
                return Array.from(d.querySelectorAll('iframe[src]:not([src=""])'));
              }));
              return iframes.filter(function (f) {
                return isAccessibleFrame_1(f) && !isInlineFrame_1(f);
              }).map(function (f) {
                return f.contentDocument;
              });
            }

            var extractFrames_1 = extractFrames;

            var getBaesUrl = function getBaesUrl(doc) {
              var baseUrl = doc.querySelectorAll('base')[0] && doc.querySelectorAll('base')[0].href;

              if (baseUrl && isUrl(baseUrl)) {
                return baseUrl;
              }
            };

            function isUrl(url) {
              return url && !/^(about:blank|javascript:void|blob:)/.test(url);
            }

            var getBaseUrl = getBaesUrl;

            function toUriEncoding(url) {
              var result = url && url.replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, function (s) {
                var int = parseInt(s.substr(1).trim(), 16);
                return String.fromCodePoint(int);
              }) || url;
              return result;
            }

            var toUriEncoding_1 = toUriEncoding;

            function makeLog(referenceTime) {
              return function log() {
                var args = ['[dom-snapshot]', "[+".concat(Date.now() - referenceTime, "ms]")].concat(Array.from(arguments));
                console.log.apply(console, args);
              };
            }

            var log$9 = makeLog;

            var RESOURCE_STORAGE_KEY = '__process_resource';

            function makeSessionCache(_ref) {
              var log = _ref.log,
                  sessionStorage = _ref.sessionStorage;
              var sessionStorageCache;

              try {
                sessionStorage = sessionStorage || window.sessionStorage;
                var sessionStorageCacheStr = sessionStorage.getItem(RESOURCE_STORAGE_KEY);
                sessionStorageCache = sessionStorageCacheStr ? JSON.parse(sessionStorageCacheStr) : {};
              } catch (ex) {
                log('error creating session cache', ex);
              }

              return {
                getItem: getItem,
                setItem: setItem,
                keys: keys,
                persist: persist
              };

              function getItem(key) {
                if (sessionStorageCache) {
                  return sessionStorageCache[key];
                }
              }

              function setItem(key, value) {
                if (sessionStorageCache) {
                  log('saving to in-memory sessionStorage, key:', key, 'value:', value);
                  sessionStorageCache[key] = value;
                }
              }

              function keys() {
                if (sessionStorageCache) {
                  return Object.keys(sessionStorageCache);
                } else {
                  return [];
                }
              }

              function persist() {
                if (sessionStorageCache) {
                  sessionStorage.setItem(RESOURCE_STORAGE_KEY, JSON.stringify(sessionStorageCache));
                }
              }
            }

            var sessionCache = makeSessionCache;

            function processPage() {
              var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

              var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
                  showLogs = _ref.showLogs,
                  useSessionCache = _ref.useSessionCache,
                  dontFetchResources = _ref.dontFetchResources;

              var log = showLogs ? log$9(Date.now()) : noop;
              log('processPage start');
              var sessionCache$$1 = useSessionCache && sessionCache({
                log: log
              });
              var styleSheetCache = {};
              var extractResourcesFromStyleSheet$$1 = extractResourcesFromStyleSheet({
                styleSheetCache: styleSheetCache
              });
              var findStyleSheetByUrl$$1 = findStyleSheetByUrl({
                styleSheetCache: styleSheetCache
              });
              var extractResourceUrlsFromStyleTags$$1 = extractResourceUrlsFromStyleTags(extractResourcesFromStyleSheet$$1);
              var extractResourcesFromSvg = makeExtractResourcesFromSvg_1({
                extractResourceUrlsFromStyleTags: extractResourceUrlsFromStyleTags$$1
              });
              var processResource$$1 = processResource({
                fetchUrl: fetchUrl_1,
                findStyleSheetByUrl: findStyleSheetByUrl$$1,
                getCorsFreeStyleSheet: getCorsFreeStyleSheet_1,
                extractResourcesFromStyleSheet: extractResourcesFromStyleSheet$$1,
                extractResourcesFromSvg: extractResourcesFromSvg,
                absolutizeUrl: absolutizeUrl_1,
                log: log,
                sessionCache: sessionCache$$1
              });
              var getResourceUrlsAndBlobs$$1 = getResourceUrlsAndBlobs({
                processResource: processResource$$1,
                aggregateResourceUrlsAndBlobs: aggregateResourceUrlsAndBlobs_1
              });
              return doProcessPage(doc).then(function (result) {
                log('processPage end');
                result.scriptVersion = '3.2.0';
                return result;
              });

              function doProcessPage(doc) {
                var pageUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : doc.location.href;
                var baseUrl = getBaseUrl(doc) || pageUrl;

                var _domNodesToCdt = domNodesToCdt_1(doc, baseUrl),
                    cdt = _domNodesToCdt.cdt,
                    docRoots = _domNodesToCdt.docRoots,
                    canvasElements = _domNodesToCdt.canvasElements,
                    inlineFrames = _domNodesToCdt.inlineFrames;

                var linkUrls = flat_1(docRoots.map(extractLinks_1));
                var styleTagUrls = flat_1(docRoots.map(extractResourceUrlsFromStyleTags$$1));
                var absolutizeThisUrl = getAbsolutizeByUrl(baseUrl);
                var urls = uniq_1(Array.from(linkUrls).concat(Array.from(styleTagUrls)).concat(extractResourceUrlsFromStyleAttrs_1(cdt))).map(toUriEncoding_1).map(absolutizeThisUrl).map(toUnAnchoredUri_1).filter(filterInlineUrlsIfExisting);
                var resourceUrlsAndBlobsPromise = dontFetchResources ? Promise.resolve({
                  resourceUrls: urls,
                  blobsObj: {}
                }) : getResourceUrlsAndBlobs$$1({
                  documents: docRoots,
                  urls: urls
                }).then(function (result) {
                  sessionCache$$1 && sessionCache$$1.persist();
                  return result;
                });
                var canvasBlobs = buildCanvasBlobs_1(canvasElements);
                var frameDocs = extractFrames_1(docRoots);
                var processFramesPromise = frameDocs.map(function (f) {
                  return doProcessPage(f, f.defaultView.frameElement.src);
                });
                var processInlineFramesPromise = inlineFrames.map(function (_ref2) {
                  var element = _ref2.element,
                      url = _ref2.url;
                  return doProcessPage(element.contentDocument, url);
                });
                var srcAttr = doc.defaultView && doc.defaultView.frameElement && doc.defaultView.frameElement.getAttribute('src');
                return Promise.all([resourceUrlsAndBlobsPromise].concat(processFramesPromise).concat(processInlineFramesPromise)).then(function (resultsWithFrameResults) {
                  var _resultsWithFrameResu = resultsWithFrameResults[0],
                      resourceUrls = _resultsWithFrameResu.resourceUrls,
                      blobsObj = _resultsWithFrameResu.blobsObj;
                  var framesResults = resultsWithFrameResults.slice(1);
                  return {
                    cdt: cdt,
                    url: pageUrl,
                    srcAttr: srcAttr,
                    resourceUrls: resourceUrls.map(function (url) {
                      return url.replace(/^blob:/, '');
                    }),
                    blobs: blobsObjToArray(blobsObj).concat(canvasBlobs),
                    frames: framesResults
                  };
                });
              }
            }

            function getAbsolutizeByUrl(url) {
              return function (someUrl) {
                try {
                  return absolutizeUrl_1(someUrl, url);
                } catch (err) {// can't do anything with a non-absolute url
                }
              };
            }

            function blobsObjToArray(blobsObj) {
              return Object.keys(blobsObj).map(function (blobUrl) {
                return Object.assign({
                  url: blobUrl.replace(/^blob:/, '')
                }, blobsObj[blobUrl]);
              });
            }

            function filterInlineUrlsIfExisting(absoluteUrl) {
              return absoluteUrl && filterInlineUrl_1(absoluteUrl);
            }

            var processPage_1 = processPage;

            function processPageAndSerialize() {
              return processPage_1.apply(this, arguments).then(serializeFrame);
            }

            function serializeFrame(frame) {
              frame.blobs = frame.blobs.map(function (_ref) {
                var url = _ref.url,
                    type = _ref.type,
                    value = _ref.value;
                return {
                  url: url,
                  type: type,
                  value: arrayBufferToBase64_1(value)
                };
              });
              frame.frames.forEach(serializeFrame);
              return frame;
            }

            var processPageAndSerialize_1 = processPageAndSerialize;

            getCjsExportFromNamespace(urlPolyfill);

            getCjsExportFromNamespace(fetch$1);

            var processPageAndSerializePoll = pollify(processPageAndSerialize_1);

            return processPageAndSerializePoll;

}());

  return processPageAndSerializePollForIE.apply(this, arguments);
}