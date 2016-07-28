function test(d:number):number {if (d) return 5;}


function upperCase(s: string): string {
  return s.toUpperCase()
}

function isEven(n: number): boolean {
  return n % 2 === 0
}

// class Greeter {
//   constructor(private name:string) {
//   }
//
//   greet():string {
//     return `Hello ${name}`
//   }
//
//   maybeGreet():string {
//     if (Math.random() >= 0.5) {
//       return this.greet()
//     }
//   }
// }