import set from 'lodash/fp/set'

const localStorage = global.localStorage || {
  setItem () {},
  getItem () {},
  removeItem () {}
}

/**
 * getItem() wrapper of the native getItem() method of the Storage interface,
 * when passed a key name, will return that key's value or null if the key does not exist.
 * @param {String} key Key of value that you want to get from local storage.
 * @return {(String|null)} String representation of value or null if the key does not exist.
 */
const getItem = (key) => {
  return localStorage.getItem(key)
}

/**
 * getParsedItem() wrapper of the native getItem() method of the Storage interface,
 * when passed a key name, will return that key's parsed value or null if the key does not exist.
 * @param {String} key Key of value that you want to get from local storage.
 * @returns {(Object|null)} Object representation of value or null if the key does not exist.
 */
const getParsedItem = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

/**
 * setItem() wrapper of the native setItem() method of Storage interface,
 * when passed a key name and value, will add that key to the storage,
 * or update that key's value if it already exists.
 * @param {String} key Key that you want to create / update.
 * @param {Any} value Value that will be stored / updated for the key.
 */
const setItem = (key, value) => {
  localStorage.setItem(key, value)
}

/**
 * setStringifyItem() wrapper of the native setItem() method of Storage interface,
 * when passed a key name and value, will add that key to the storage,
 * or update that key's value if it already exists.
 * The value will be stringifyed.
 * @param {String} key Key that you want to create / update.
 * @param {Any} value Value that will be stored / updated for the key.
 */
const setStringifyItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * setParsedItem() wrapper of the native setItem() method of Storage interface,
 * when passed a key name and value, will add that key to the storage,
 * or update that key's value if it already exists.
 * @param {String} key Key that you want to create / update. Key also can be a path of the property to set.
 * @param {Any} value Value that will be stored / updated for the key.
 */
const setParsedItem = (key, value) => {
  const path = key.split('.')
  const i = getParsedItem(path[0])
  const v = set(path.slice(1))(value)(i)
  setStringifyItem(path[0], v)
}

/**
 * removeItem() wrapper of the native removeItem() method of Storage interface,
 * when passed a key name and value, will add that key to the storage,
 * or update that key's value if it already exists.
 * @param {String} key Key that you want to create / update.
 * @param {Any} value Value that will be stored / updated for the key.
 */
const removeItem = (key, value) => {
  localStorage.removeItem(key, value)
}

export {
  getItem,
  getParsedItem,
  setItem,
  setStringifyItem,
  setParsedItem,
  removeItem
}
