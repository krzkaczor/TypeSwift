import Foundation
import JavaScriptCore

struct SharedTypeSwiftContext {
    static var once = dispatch_once_t()

    private static let _defaultContext = JSContext()

    static let defaultContext = {
        () -> JSContext in
        // probably there is a better way to do this... for sure...
        dispatch_once(&once) {
            SharedTypeSwiftContext._defaultContext.exceptionHandler = { context, exception in
                print("JS Error: \(exception)")
            }

            let fileURL = NSBundle.mainBundle().URLForResource("bundle", withExtension: "js")
            let bundle = try! String(contentsOfURL: fileURL!, encoding: NSUTF8StringEncoding)

            SharedTypeSwiftContext._defaultContext.evaluateScript(bundle)
        }
        return SharedTypeSwiftContext._defaultContext
    }
}