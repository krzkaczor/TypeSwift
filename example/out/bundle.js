"use strict";
function test(d) { if (d) return 5; }

class Greeter {
  constructor(private name:string) {
  }

  greet():string {
    return `Hello ${name}`
  }

  maybeGreet():string {
    if (Math.random() >= 0.5) {
      return this.greet()
    }
  }
}
//# sourceMappingURL=Greeter.js.map