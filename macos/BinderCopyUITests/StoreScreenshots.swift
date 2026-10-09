import XCTest

final class StoreScreenshots: XCTestCase {
  private func capture(_ name: String, _ window: XCUIElement) {
    let screen = window.screenshot()
    XCTAssertEqual(screen.image.size.width, 1280)
    XCTAssertEqual(screen.image.size.height, 800)
    let attachment = XCTAttachment(screenshot: screen)
    attachment.name = name
    attachment.lifetime = .keepAlways
    add(attachment)
  }

  func testStoreScreenshots() throws {
    continueAfterFailure = false
    let app = XCUIApplication(bundleIdentifier: "com.clearpathsystems.bindercopy")
    app.launch()
    XCTAssertTrue(app.buttons["A favorite card"].waitForExistence(timeout: 90), app.debugDescription)
    let window = app.windows.firstMatch
    XCTAssertTrue(window.exists)
    let corner = window.coordinate(withNormalizedOffset: CGVector(dx: 1, dy: 1)).withOffset(CGVector(dx: -2, dy: -2))
    let target = corner.withOffset(CGVector(dx: 1280-window.frame.width, dy: 800-window.frame.height))
    corner.press(forDuration: 0.2, thenDragTo: target)
    Thread.sleep(forTimeInterval: 2)
    capture("store-01-builder", window)
    app.buttons["A favorite card"].click()
    XCTAssertTrue(app.buttons["Alakazam, Base Set"].waitForExistence(timeout: 30), app.debugDescription)
    app.buttons["Alakazam, Base Set"].click()
    XCTAssertTrue(app.buttons["Keep this page"].waitForExistence(timeout: 30), app.debugDescription)
    app.buttons["Keep this page"].click()
    XCTAssertTrue(app.buttons["A favorite card"].waitForExistence(timeout: 30), app.debugDescription)
    Thread.sleep(forTimeInterval: 5)
    capture("store-02-page", window)
    app.descendants(matching: .any).matching(NSPredicate(format: "label == %@", "Cards")).firstMatch.click()
    XCTAssertTrue(app.buttons["Alakazam, Base Set"].waitForExistence(timeout: 30), app.debugDescription)
    Thread.sleep(forTimeInterval: 5)
    capture("store-03-catalog", window)
  }
}
