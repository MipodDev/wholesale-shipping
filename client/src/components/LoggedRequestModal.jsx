import React from "react";
import { Dialog } from "@headlessui/react";

export default function LoggedRequestModal({ open, onClose, log }) {
  if (!log) return null;

  const { request, rates, rules, approval, site, type, createdAt } = log;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <Dialog.Panel className="bg-zinc-800 rounded-lg p-6 w-full max-w-4xl text-white shadow-xl">
          <Dialog.Title className="text-xl font-bold mb-4">
            Logged Request Details
          </Dialog.Title>

          <section className="mb-4">
            <h3 className="font-semibold text-lg mb-1">🧾 General Info</h3>
            <p>
              <b>Site:</b> {site}
            </p>
            <p>
              <b>Type:</b> {type}
            </p>
            <p>
              <b>Created:</b> {new Date(createdAt).toLocaleString()}
            </p>
          </section>

          {/* <section className="mb-4">
            <h3 className="font-semibold text-lg mb-1">📍 Origin</h3>
            <pre className="bg-zinc-700 p-2 rounded text-sm">{JSON.stringify(request.origin, null, 2)}</pre>
          </section> */}

          <section className="mb-4">
            <h3 className="font-semibold text-lg mb-1">🚚 Destination</h3>
            <p>
              <span className="font-semibold text-zinc-200">Address 1:</span>{" "}
              {request.destination.address1 ? (
                request.destination.address1
              ) : (
                <i className="text-zinc-500">undefined</i>
              )}
            </p>
            <p>
              <span className="font-semibold text-zinc-200">Address 2:</span>{" "}
              {request.destination.address2 ? (
                request.destination.address2
              ) : (
                <i className="text-zinc-500">undefined</i>
              )}
            </p>
            <p>
              <span className="font-semibold text-zinc-200">Zip Code:</span>{" "}
              {request.destination.postal_code ? (
                request.destination.postal_code
              ) : (
                <i className="text-zinc-500">undefined</i>
              )}
            </p>
            <p>
              <span className="font-semibold text-zinc-200">
                State/Province:
              </span>{" "}
              {request.destination.province ? (
                request.destination.province
              ) : (
                <i className="text-zinc-500">undefined</i>
              )}
            </p>
            <p>
              <span className="font-semibold text-zinc-200">City:</span>{" "}
              {request.destination.city ? (
                request.destination.city
              ) : (
                <i className="text-zinc-500">undefined</i>
              )}
            </p>
            <p>
              <span className="font-semibold text-zinc-200">Country:</span>{" "}
              {request.destination.country ? (
                request.destination.country
              ) : (
                <i className="text-zinc-500">undefined</i>
              )}
            </p>
            <p>
              <span className="font-semibold text-zinc-200">Phone:</span>{" "}
              {request.destination.phone ? (
                request.destination.phone
              ) : (
                <i className="text-zinc-500">undefined</i>
              )}
            </p>
          </section>

          <section className="mb-4">
            <h3 className="font-semibold text-lg mb-1">📦 Items</h3>
            <table className="w-full text-sm border border-zinc-600">
              <thead className="bg-zinc-700">
                <tr>
                  <th>Item No</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Vendor</th>
                  <th>Product Id</th>
                  <th>Variant Id</th>
                </tr>
              </thead>
              <tbody>
                {request.items.map((item, i) => (
                  <tr key={i} className="border-t border-zinc-700 text-center">
                    <td>{item.sku}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.vendor}</td>
                    <td>{item.product_id}</td>
                    <td>{item.variant_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mb-4">
            <h3 className="font-semibold text-lg mb-1">📏 Rules</h3>
            {rules.length > 0 ? (
              <table className="w-full text-sm border border-zinc-600">
                <thead className="bg-zinc-700">
                  <tr>
                    <th>Name</th>
                    <th>Range</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule, i) => (
                    <tr
                      key={i}
                      className="border-t border-zinc-700 text-center"
                    >
                      <td>{rule.name}</td>
                      <td>{rule.range}</td>
                      <td>{rule.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-zinc-500">No rules were applied...</p>
            )}
          </section>

          <section className="mb-6">
            <h3 className="font-semibold text-lg mb-1">🚚 Rates</h3>
            {rates.length > 0 ? (
              <table className="w-full text-sm border border-zinc-600">
                <thead className="bg-zinc-700">
                  <tr>
                    <th>Service Name</th>
                    <th>Code</th>
                    <th>Price</th>
                    <th>Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map((r, i) => (
                    <tr
                      key={i}
                      className="border-t border-zinc-700 text-center"
                    >
                      <td>{r.service_name}</td>
                      <td>{r.service_code}</td>
                      <td>${r.total_price / 100}</td>
                      <td>{r.currency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-red-500 bg-red-600/20 p-6 rounded font-lg font-bold">🚨 No rates were provided...</p>
            )}

  
          </section>

          <section className="mb-4">
            <h3 className="font-semibold text-lg mb-1">⚖️ Approval</h3>
            <p>
              <span className="font-semibold text-zinc-200">
                Allow Shipping Rates:{" "}
              </span>
              {approval.allow ? "🟢 True" : "⭕ False"}
            </p>
            <p>
              <span className="font-semibold text-zinc-200">
                Provide Price Exemption:{" "}
              </span>
              {approval.exempt ? "🟢 True" : "⭕ False"}
            </p>
            <p>
              <span className="font-semibold text-zinc-200">Reason: </span>
              {approval.reason ? approval.reason : "--n/a--"}
            </p>
          </section>
          <button
            onClick={onClose}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 font-semibold"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
