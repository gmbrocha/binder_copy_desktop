import Foundation
import StoreKit

/// StoreKit only supplies evidence. The API decides access before JS calls finish.
@MainActor
final class BinderPurchaseStore {
  private var listener: Task<Void, Never>?
  private var purchasing = false
  deinit { listener?.cancel() }

  func observe(_ changed: @escaping () -> Void) {
    listener?.cancel()
    listener = Task {
      for await _ in Transaction.updates {
        if Task.isCancelled { return }
        changed()
      }
    }
  }

  func stop() { listener?.cancel(); listener = nil }

  func products(_ ids: [String]) async throws -> [[String: Any]] {
    guard !ids.isEmpty, ids.count <= 10 else { return [] }
    return try await Product.products(for: ids).filter { $0.type == .autoRenewable || $0.type == .consumable }.map {
      ["id": $0.id, "name": $0.displayName, "description": $0.description,
       "type": $0.type == .consumable ? "consumable" : "subscription",
       "displayPrice": $0.displayPrice,
       "periodValue": $0.subscription?.subscriptionPeriod.value ?? 1,
       "periodUnit": String(describing: $0.subscription?.subscriptionPeriod.unit ?? .month)]
    }
  }

  private func account(_ value: String) throws -> UUID {
    guard let token = UUID(uuidString: value) else { throw message("Sign in before purchasing.") }
    return token
  }

  private func message(_ text: String) -> NSError {
    NSError(domain: "BinderCopyPurchases", code: 1, userInfo: [NSLocalizedDescriptionKey: text])
  }

  private func evidence(_ result: VerificationResult<Transaction>, token: UUID) throws -> [String: Any]? {
    guard case .verified(let transaction) = result else { throw message("Apple could not verify this purchase.") }
    guard transaction.appAccountToken == token else { return nil }
    let environment: String
    switch transaction.environment {
    case .production: environment = "Production"
    case .sandbox: environment = "Sandbox"
    default: environment = "Xcode"
    }
    return ["transactionId": String(transaction.id), "signedTransaction": result.jwsRepresentation,
            "environment": environment, "productId": transaction.productID]
  }

  func purchase(_ productId: String, accountToken: String) async throws -> [String: Any] {
    guard !purchasing else { throw message("A purchase is already in progress.") }
    purchasing = true
    defer { purchasing = false }
    let token = try account(accountToken)
    guard let product = try await Product.products(for: [productId]).first,
          product.type == .autoRenewable || product.type == .consumable else { throw message("This purchase is currently unavailable.") }
    switch try await product.purchase(options: [.appAccountToken(token)]) {
    case .success(let result):
      guard let data = try evidence(result, token: token) else { throw message("This purchase belongs to another BinderCopy account. Sign into that account to restore it.") }
      return ["status": "purchased", "transaction": data]
    case .pending: return ["status": "pending"]
    case .userCancelled: return ["status": "cancelled"]
    @unknown default: throw message("Apple could not complete this purchase.")
    }
  }

  func pending(_ accountToken: String) async throws -> [[String: Any]] {
    let token = try account(accountToken)
    var results: [String: [String: Any]] = [:]
    for await result in Transaction.unfinished {
      if let value = try evidence(result, token: token), let id = value["transactionId"] as? String { results[id] = value }
    }
    for await result in Transaction.currentEntitlements {
      if let value = try evidence(result, token: token), let id = value["transactionId"] as? String { results[id] = value }
    }
    return Array(results.values)
  }

  func restore(_ accountToken: String) async throws -> [[String: Any]] {
    _ = try account(accountToken)
    try await AppStore.sync()
    return try await pending(accountToken)
  }

  func finish(_ transactionId: String, accountToken: String) async throws {
    let token = try account(accountToken)
    for await result in Transaction.unfinished {
      guard case .verified(let transaction) = result else { continue }
      if String(transaction.id) == transactionId && transaction.appAccountToken == token {
        await transaction.finish()
        return
      }
    }
  }
}
