You must have Xcode and CocoaPods installed.

More instructions [here](https://capacitorjs.com/docs/ios)

## IF YOU ARE ON AN m1 mac

[you must install CocoaPods through brew instead of through the gem](https://stackoverflow.com/questions/64901180/how-to-run-cocoapods-on-apple-silicon-m1)


After you install the CocoaPods, you need to cd ios > app and then `pod install`

Then you can cd to Core-PWA root directory again and run the project using `npx cap open ios` or just double click on the workspace file located in ios > App > App.xcworkspace

You can also run `yarn ios-run`
