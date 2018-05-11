import {
  isObject,
  isArray,
  isFunction,
  isRegExp,
  isNumber,
  isString,
  isElement,
  isDate
} from 'lodash';

export function handleAsyncExceptions() {
  if (handleAsyncExceptions.hooked === false) {
    process.on('unhandledRejection', (err) => {
      throw err;
    });
    handleAsyncExceptions.hooked = true;
  }
}

export function isEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function isContactNumber(number) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(number);
}

handleAsyncExceptions.hooked = false;

export function printIp() {
  const os = require('os');
  const ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach((ifname) => {
    let alias = 0;

    ifaces[ifname].forEach((iface) => {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
      }
      alias = alias+1;
    });
  });
}

export function isUsableObject(val) {
  return isObject(val) && ! (
    isArray(val) || isFunction(val) || isRegExp(val) || isNumber(val) || isString(val) ||
    isElement(val) || isDate(val)
  );
}