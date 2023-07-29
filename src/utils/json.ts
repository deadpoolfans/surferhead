// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

// NOTE: We should store these methods from `JSON`
// since they can be overridden by the client code.
export const parseJSON = JSON.parse;
export const stringifyJSON = JSON.stringify;

const isDOMNode = (data: Record<string, unknown>): boolean => {
  // Check if we have access to `Node`, if yes then we can directly check instance.
  if (typeof Node === "object")
    return data instanceof Node;

  // When no access, we simply check for basic properties in `Node` objects.
  return typeof data.nodeType === "number" && typeof data.nodeName === "string";
};

const isJQueryObject = (data: Record<string, unknown>) => !!(data && data.jquery);

// Functions and objects can be passed as parameter.
type SerializableValueParameter = (() => unknown) | Record<string, unknown> | undefined;
export const isSerializable = (value: SerializableValueParameter) => {
  if (!value) return true;

  // NOTE: JQuery object, DOM nodes and functions are disallowed object
  // types because we can't serialize them correctly.
  if (typeof value === "function" || isJQueryObject(value) || isDOMNode(value))
    return false;

  if (typeof value === "object") {
    for (const prop in value) {
      if (value.hasOwnProperty(prop) && !isSerializable(value[prop] as SerializableValueParameter)) // eslint-disable-line no-prototype-builtins
        return false;
    }
  }

  return true;
};
