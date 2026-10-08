import Foundation
import React

@objc(BinderPurchases)
final class BinderPurchases: RCTEventEmitter {
  private var store: BinderPurchaseStore?
  private var observing = false
  override static func requiresMainQueueSetup() -> Bool { true }
  override func supportedEvents() -> [String]! { ["purchasesChanged"] }
  override func startObserving() { observing = true }
  override func stopObserving() { observing = false }

  @MainActor private func purchaseStore() -> BinderPurchaseStore {
    if let store { return store }
    let next = BinderPurchaseStore()
    next.observe { [weak self] in
      guard let self, self.observing else { return }
      self.sendEvent(withName: "purchasesChanged", body: [:])
    }
    store = next
    return next
  }

  @objc(products:resolve:reject:)
  func products(_ ids: [String], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      do { resolve(try await purchaseStore().products(ids)) }
      catch { reject("purchase_error", error.localizedDescription, error) }
    }
  }
  @objc(purchase:accountToken:resolve:reject:)
  func purchase(_ id: String, accountToken: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      do { resolve(try await purchaseStore().purchase(id, accountToken: accountToken)) }
      catch { reject("purchase_error", error.localizedDescription, error) }
    }
  }
  @objc(pending:resolve:reject:)
  func pending(_ token: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      do { resolve(try await purchaseStore().pending(token)) }
      catch { reject("purchase_error", error.localizedDescription, error) }
    }
  }
  @objc(restore:resolve:reject:)
  func restore(_ token: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      do { resolve(try await purchaseStore().restore(token)) }
      catch { reject("purchase_error", error.localizedDescription, error) }
    }
  }
  @objc(finish:accountToken:resolve:reject:)
  func finish(_ id: String, accountToken: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    Task { @MainActor in
      do { try await purchaseStore().finish(id, accountToken: accountToken); resolve(nil) }
      catch { reject("purchase_error", error.localizedDescription, error) }
    }
  }
}
