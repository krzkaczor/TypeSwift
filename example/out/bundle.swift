func test(d: Int?) -> Int? {
    let fn = defaultContext.objectForKeyedSubscript("test")
    
    let result = fn.callWithArguments([(d ?? JSValue.init(nullInContext: defaultContext))!])
    
    if result.isUndefined || result.isNull {
        return nil
    }
    return Int(result.toInt32())
  }