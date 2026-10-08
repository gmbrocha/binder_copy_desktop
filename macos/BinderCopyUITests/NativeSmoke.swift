import XCTest

final class NativeSmoke: XCTestCase {
  override func tearDown() {
    let screen = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
    screen.name = "Final native screen"
    screen.lifetime = .keepAlways
    add(screen)
    super.tearDown()
  }

  private func waitUntilGone(_ element: XCUIElement, in app: XCUIApplication) {
    let gone = expectation(for: NSPredicate(format: "exists == false"), evaluatedWith: element)
    wait(for: [gone], timeout: 15)
    XCTAssertFalse(element.exists, app.debugDescription)
  }

  private func capture(_ title: String, in app: XCUIApplication) {
    let shot = XCTAttachment(screenshot: app.screenshot())
    shot.name = title
    shot.lifetime = .keepAlways
    add(shot)
  }

  private func tab(_ name: String, in app: XCUIApplication) -> XCUIElement {
    // React Native macOS exposes role=tab as an AX Other, not an NSButton.
    app.descendants(matching: .any).matching(NSPredicate(format: "label == %@", name)).firstMatch
  }

  func testNativeWorkspace() throws {
    continueAfterFailure = false
    let app = XCUIApplication(bundleIdentifier: "com.clearpathsystems.bindercopy")
    app.launch()
    XCTAssertTrue(app.buttons["New"].waitForExistence(timeout: 90), app.debugDescription)
    app.buttons["New"].click()
    let builder = app.buttons["A favorite card"]
    XCTAssertTrue(builder.waitForExistence(timeout: 90), app.debugDescription)
    XCTAssertTrue(tab("Build a page", in: app).exists, "Builder heading must be exposed to accessibility")
    let initial = XCTAttachment(screenshot: app.screenshot())
    initial.name = "Native desktop builder"
    initial.lifetime = .keepAlways
    add(initial)
    app.buttons["Page name"].click()
    let name = app.textFields["Page name"]
    XCTAssertTrue(name.waitForExistence(timeout: 10), app.debugDescription)
    capture("Compact page name", in: app)
    name.click()
    name.typeKey("a", modifierFlags: .command)
    name.typeText("Desktop test")
    app.buttons["Save page"].click()
    waitUntilGone(name, in: app)
    tab("Cards", in: app).click()
    XCTAssertTrue(app.buttons["Fixture 1, Demo set"].waitForExistence(timeout: 30), app.debugDescription)
    app.buttons["Fixture 1, Demo set"].click()
    XCTAssertTrue(app.buttons["Add to collection"].waitForExistence(timeout: 10), app.debugDescription)
    capture("Card details", in: app)
    app.buttons["Done"].click()
    waitUntilGone(app.buttons["Add to collection"], in: app)
    app.buttons["Filters"].click()
    XCTAssertTrue(app.buttons["Reset"].waitForExistence(timeout: 10), app.debugDescription)
    capture("Card filters", in: app)
    app.buttons["Done"].click()
    waitUntilGone(app.buttons["Reset"], in: app)
    tab("Library", in: app).click()
    XCTAssertTrue(app.buttons["Open Desktop test"].waitForExistence(timeout: 15), app.debugDescription)
    let library = XCTAttachment(screenshot: app.screenshot())
    library.name = "Native desktop Library"
    library.lifetime = .keepAlways
    add(library)
    XCTAssertFalse(app.buttons["Dismiss error"].exists, "Native persistence must not report a secure-storage or save error: \(app.debugDescription)")
    app.buttons["Open Desktop test"].click()
    XCTAssertTrue(builder.waitForExistence(timeout: 15), app.debugDescription)
    app.buttons["Page name"].click()
    XCTAssertTrue(app.textFields["Page name"].waitForExistence(timeout: 10), app.debugDescription)
    XCTAssertEqual(app.textFields["Page name"].value as? String, "Desktop test")
    app.buttons["Cancel"].click()
    waitUntilGone(name, in: app)
    XCTAssertFalse(app.buttons["Dismiss error"].exists, app.debugDescription)
    app.terminate()
    app.launch()
    XCTAssertTrue(builder.waitForExistence(timeout: 30), app.debugDescription)
    tab("Library", in: app).click()
    XCTAssertTrue(app.buttons["Open Desktop test"].waitForExistence(timeout: 15), app.debugDescription)
    app.buttons["Open Desktop test"].click()
    XCTAssertTrue(builder.waitForExistence(timeout: 15), app.debugDescription)
    app.buttons["Page name"].click()
    XCTAssertTrue(app.textFields["Page name"].waitForExistence(timeout: 10), app.debugDescription)
    XCTAssertEqual(app.textFields["Page name"].value as? String, "Desktop test")
    app.buttons["Cancel"].click()
    waitUntilGone(name, in: app)
    XCTAssertFalse(app.buttons["Dismiss error"].exists, app.debugDescription)
  }

  func testNativePhotoAndExport() throws {
    continueAfterFailure = false
    let app = XCUIApplication(bundleIdentifier: "com.clearpathsystems.bindercopy")
    app.launch()
    XCTAssertTrue(app.buttons["A favorite card"].waitForExistence(timeout: 90), app.debugDescription)
    XCTAssertTrue(app.buttons["A photo"].waitForExistence(timeout: 10))
    app.buttons["A photo"].click()
    XCTAssertTrue(app.windows["open-panel"].buttons["OKButton"].waitForExistence(timeout: 10), app.debugDescription)
    app.typeKey("g", modifierFlags: [.command, .shift])
    app.typeText("/tmp/bindercopy-native-photo.png")
    app.typeKey(.return, modifierFlags: [])
    app.windows["open-panel"].buttons["OKButton"].click()
    XCTAssertTrue(app.buttons["Keep this page"].waitForExistence(timeout: 30), app.debugDescription)
    capture("Photo proposal", in: app)
    app.buttons["Keep this page"].click()
    waitUntilGone(app.buttons["Keep this page"], in: app)
    XCTAssertTrue(app.buttons["Export"].waitForExistence(timeout: 10))
    capture("Kept desktop page", in: app)
    XCTAssertTrue(app.buttons["Custom color"].waitForExistence(timeout: 15), app.debugDescription)
    app.buttons["Custom color"].click()
    let hex = app.textFields["Hex color"]
    XCTAssertTrue(hex.waitForExistence(timeout: 10), app.debugDescription)
    let colorScroll = app.scrollViews.containing(.textField, identifier: "Hex color").firstMatch
    for _ in 0..<4 { if hex.isHittable { break }; colorScroll.scroll(byDeltaX: 0, deltaY: -300) }
    XCTAssertTrue(hex.isHittable, app.debugDescription)
    hex.click()
    hex.typeKey("a", modifierFlags: .command)
    hex.typeText("#D7C2F0")
    app.buttons["Apply color"].click()
    capture("Free custom background color", in: app)

    app.buttons["Export"].click()
    app.buttons["Download image"].click()
    XCTAssertTrue(app.windows.buttons["OKButton"].waitForExistence(timeout: 15), app.debugDescription)
    app.typeKey("g", modifierFlags: [.command, .shift])
    app.typeText("/tmp/bindercopy-media-results")
    app.typeKey(.return, modifierFlags: [])
    app.windows.buttons["OKButton"].click()
    let exported = URL(fileURLWithPath: "/tmp/bindercopy-media-results/BinderCopy.png")
    let saved = expectation(for: NSPredicate { _, _ in FileManager.default.fileExists(atPath: exported.path) }, evaluatedWith: nil)
    wait(for: [saved], timeout: 10)
    XCTAssertEqual(try Data(contentsOf: exported), try Data(contentsOf: URL(fileURLWithPath: "/tmp/bindercopy-native-photo.png")))
    let media = XCTAttachment(screenshot: app.screenshot())
    media.name = "Native photo generation and saved PNG"
    media.lifetime = .keepAlways
    add(media)
  }
}
