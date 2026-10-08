import XCTest

final class NativeSmoke: XCTestCase {
  override func tearDown() {
    let screen = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
    screen.name = "Final native screen"
    screen.lifetime = .keepAlways
    add(screen)
    super.tearDown()
  }

  private func tab(_ name: String, in app: XCUIApplication) -> XCUIElement {
    // React Native macOS exposes role=tab as an AX Other, not an NSButton.
    app.descendants(matching: .any).matching(NSPredicate(format: "label == %@", name)).firstMatch
  }

  func testNativeWorkspace() throws {
    continueAfterFailure = false
    let app = XCUIApplication(bundleIdentifier: "com.clearpathsystems.bindercopy")
    app.launch()
    let builder = app.buttons["A favorite card"]
    XCTAssertTrue(builder.waitForExistence(timeout: 90), app.debugDescription)
    XCTAssertTrue(tab("Build a page", in: app).exists, "Builder heading must be exposed to accessibility")
    let initial = XCTAttachment(screenshot: app.screenshot())
    initial.name = "Native desktop builder"
    initial.lifetime = .keepAlways
    add(initial)
    let name = app.textFields["Page name"]
    XCTAssertTrue(name.exists)
    name.click()
    name.typeKey("a", modifierFlags: .command)
    name.typeText("Desktop test")
    tab("Cards", in: app).click()
    XCTAssertTrue(app.buttons["Fixture 1, Demo set"].waitForExistence(timeout: 30), app.debugDescription)
    app.buttons["Fixture 1, Demo set"].click()
    XCTAssertTrue(app.buttons["Add to collection"].waitForExistence(timeout: 10), app.debugDescription)
    app.buttons["Done"].click()
    app.buttons["Filters"].click()
    XCTAssertTrue(app.buttons["Reset"].waitForExistence(timeout: 10), app.debugDescription)
    app.buttons["Done"].click()
    tab("Library", in: app).click()
    XCTAssertTrue(app.buttons["Open Desktop test"].waitForExistence(timeout: 15), app.debugDescription)
    let library = XCTAttachment(screenshot: app.screenshot())
    library.name = "Native desktop Library"
    library.lifetime = .keepAlways
    add(library)
  }
}
