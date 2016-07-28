import Foundation
import JavaScriptCore

struct SharedTypeSwiftContext {
    static let sharedInstance = SharedTypeSwiftContext()
    let context = JSContext()

    private init() {
        self.context.exceptionHandler = { context, exception in
            print("JS Error: \(exception)")
        }

        let fileURL = NSBundle.mainBundle().URLForResource("bundle", withExtension: "js")
        let bundle = try! String(contentsOfURL: fileURL!, encoding: NSUTF8StringEncoding)
        context.evaluateScript(bundle)
    }
}