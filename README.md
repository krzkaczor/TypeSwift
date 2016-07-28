#TypeSwift

Generate typed Swift wrappers for JavaScript code based on TypeScript definition files.

##Why?
`JavaScriptCore` does a great job enabling Swift developers easily interaction with JavaScript world. The problem is that due to
dynamic nature of JS this interaction doesn't feel native at all. For example to run simple function which adds two numbers we need to write this:
```
let sum = context.objectForKeyedSubscript("sum")
let result = sum.callWithArguments([2, 2]).toInt32()
```

What we could do is to manually write wrapper which would hide complexity and enable simple invocation:
```
let sum = sum(2, 2)
```

`TypeSwift` enables to automatically generate these wrappers. If you use TypeScript or library that you want to interact with 
has TypeScript definition files you can generate typed wrappers for exported functions/classes automatically.
 
 
##Abstraction leaks
###JavaScript `number` type.
JavaScript has one numeric type which server for integers and doubles. We cannot easily transpile this behaviour to Swift.
 Currently I have two ideas to mitigate that problem:
 1) Generate two overloaded signatures for all required types: one using ints and one using doubles
 2) Use NSDecimal
 
###Optionals
It happens that in TypeScript all values are optionals i.e. they can be `null` or `undefined`. That's why we currently wrap every
input/output value in `Optional` which thanks to automatic coercing is not that ugly but for sure it's not beautiful either.

Fortunately when TypeScript 2.0 will be out we can fix this issue with `string null checks`.

##Status:

- function wrappers
- support for basic types (number, string, bool)
- figured out `SharedContext` between entities
- `example/` dir shows what currently works