export default function test(d:number):number {if (d) return 5;}
window['test'] = test;
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