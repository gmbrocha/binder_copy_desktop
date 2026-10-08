import XCTest

final class NativeSmoke: XCTestCase {
  func testNativeWorkspace() throws {
    continueAfterFailure = false
    let app = XCUIApplication(bundleIdentifier: "com.clearpathsystems.bindercopy")
    app.launch()
    let builder = app.staticTexts["Build a page"]
    XCTAssertTrue(builder.waitForExistence(timeout: 90), app.debugDescription)
    let initial = XCTAttachment(screenshot: app.screenshot())
    initial.name = "Native desktop builder"
    initial.lifetime = .keepAlways
    add(initial)
    let name = app.textFields["Page name"]
    XCTAssertTrue(name.exists)
    name.click()
    name.typeKey("a", modifierFlags: .command)
    name.typeText("Desktop test")
    app.buttons["Cards"].click()
    XCTAssertTrue(app.buttons["Fixture 1, Demo set"].waitForExistence(timeout: 30), app.debugDescription)
    app.buttons["Fixture 1, Demo set"].click()
    XCTAssertTrue(app.staticTexts["Card details"].waitForExistence(timeout: 10), app.debugDescription)
    app.buttons["Done"].click()
    app.buttons["Library"].click()
    XCTAssertTrue(app.buttons["Open Desktop test"].waitForExistence(timeout: 15), app.debugDescription)
    let library = XCTAttachment(screenshot: app.screenshot())
    library.name = "Native desktop Library"
    library.lifetime = .keepAlways
    add(library)
  }
}
