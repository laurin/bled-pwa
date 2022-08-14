
export function debounce(timeout: number) {
  // store timeout value for cancel the timeout
  let timeoutRef: any = undefined;
  let calledDuringCooldown = false;

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

    // store original function for future use
    const original = descriptor.value;

    // override original function
    descriptor.value = function (...args: any) {

      if (timeoutRef) {
        calledDuringCooldown = true;
      } else {
        // sechudle timer
        timeoutRef = setTimeout(async () => {

          // call original function
          if (calledDuringCooldown) {
            await original.apply(this, args);
            calledDuringCooldown = false;
          }

          timeoutRef = undefined;
        }, timeout);
        original.apply(this, args);
      }
    }

    // return descriptor with new value
    return descriptor;
  }
}