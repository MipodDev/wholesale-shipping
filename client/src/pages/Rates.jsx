import { useState, useEffect } from "react";
import axios from "axios";

const ORIGIN = {
  country: "US",
  postal_code: "85008",
  province: "AZ",
  city: "Phoenix",
  address1: "4908 E Mcdowell Rd",
  address2: "Suite 100",
  company_name: "mipodwholesale-avalara",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatCurrencyInput = (val) => {
  const num = parseFloat(val || 0);
  return isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
};

const parseCurrencyInput = (val) => {
  return val.replace(/[^\d.]/g, "");
};

const StateDetails = ({ state }) => {
  if (!state) return null;

  return (
    <div className="mt-8 mb-6 p-4 bg-gray-800 rounded border border-gray-600">
      <h3 className="text-xl font-bold mb-2">
        ({state.code}) {state.name}
      </h3>

      <ul className="mb-4 text-sm text-gray-300">
        <li>
          Status: <strong>{state.status}</strong>
        </li>
        <li>Rules: {state.rules.length}</li>
        <li>Services: {state.services.length}</li>
        <li>Zip Codes: {state.zipCodes?.length ?? 0}</li>
      </ul>

      <h4 className="text-lg font-semibold mt-4">Services</h4>
      {state.services.length ? (
        <ul>
          {state.services.map((s) => (
            <li key={s._id} className=" px-2 py-1">
              {s.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-yellow-400 mt-2">
          No services available for this state.
        </p>
      )}

      <h4 className="text-lg font-semibold mt-4">Rules</h4>
      {state.rules.length ? (
        <table className="w-full mt-2 border border-gray-700 text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="border border-gray-600 px-2 py-1">Name</th>
              <th className="border border-gray-600 px-2 py-1">Range</th>
              <th className="border border-gray-600 px-2 py-1">Type</th>
            </tr>
          </thead>
          <tbody>
            {state.rules.map((r) => (
              <tr key={r._id} className="bg-gray-900">
                <td className="border border-gray-600 px-2 py-1">{r.name}</td>
                <td className="border border-gray-600 px-2 py-1">{r.range}</td>
                <td className="border border-gray-600 px-2 py-1">{r.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-yellow-400 mt-2">
          No rules configured for this state.
        </p>
      )}
    </div>
  );
};

const AvailableRates = ({ rates, requested }) => {
  if (!requested)
    return <p className="mt-4 text-gray-400">Please make a request</p>;
  if (!rates?.length)
    return <p className="mt-4 text-red-400">No rates available</p>;

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Available Rates</h2>
      <table className="mt-6 w-full border-collapse border border-gray-600 text-white">
        <thead>
          <tr className="bg-gray-800">
            <th className="text-left border border-gray-600 px-4 py-2">
              Service Name
            </th>
            <th className="text-left border border-gray-600 px-4 py-2">
              Service Code
            </th>
            <th className="text-left border border-gray-600 px-4 py-2">
              Total Price
            </th>
            <th className="text-left border border-gray-600 px-4 py-2">
              Currency
            </th>
          </tr>
        </thead>
        <tbody>
          {rates.map((r, idx) => (
            <tr key={idx} className="bg-gray-700">
              <td className="border border-gray-600 px-4 py-2">
                {r.service_name}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {r.service_code}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {currencyFormatter.format(r.total_price / 100)}
              </td>
              <td className="border border-gray-600 px-4 py-2">{r.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default function Rates() {
  const [destination, setDestination] = useState({
    country: "US",
    postal_code: "",
    province: "",
    city: "",
    address1: "",
    address2: "",
    phone: "",
  });

  const [items, setItems] = useState([
    { sku: "", quantity: 1, grams: 0, price: "0.00" },
  ]);
  const [rates, setRates] = useState(null);
  const [requested, setRequested] = useState(false);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    axios.get("/web/states").then((res) => setStates(res.data));
  }, []);

  const handleDestinationChange = (e) => {
    const { name, value } = e.target;
    setDestination({ ...destination, [name]: value });

    if (name === "province") {
      const match = states.find((s) => s.code === value);
      setSelectedState(match || null);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    if (field === "price") {
      updated[index][field] = parseCurrencyInput(value);
    } else if (field === "quantity" || field === "grams") {
      updated[index][field] = Math.max(0, Number(value));
    } else {
      updated[index][field] = value;
    }
    setItems(updated);
  };

  const addItem = () =>
    setItems([...items, { sku: "", quantity: 1, grams: 0, price: "0.00" }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const fetchRates = async () => {
    const rateRequest = {
      rate: {
        origin: ORIGIN,
        destination,
        items: items.map((item) => ({
          sku: item.sku,
          quantity: Number(item.quantity),
          grams: Number(item.grams),
          price: Math.round(Number(item.price) * 100), // convert to cents
        })),
        currency: "USD",
        locale: "en-US",
      },
    };

    const res = await axios.post("/api/rates/B2B", rateRequest);
    setRequested(true);
    setRates(res.data.rates);
  };

  return (
    <div className="text-white max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Rate Testing</h1>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Destination Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="country"
            value={destination.country}
            onChange={handleDestinationChange}
            placeholder="Country"
            className="p-2 bg-gray-800 border border-gray-600 rounded"
          />
          <input
            name="postal_code"
            value={destination.postal_code}
            onChange={handleDestinationChange}
            placeholder="Postal Code"
            className="p-2 bg-gray-800 border border-gray-600 rounded"
          />
          <select
            name="province"
            value={destination.province}
            onChange={handleDestinationChange}
            className="p-2 bg-gray-800 border border-gray-600 rounded"
          >
            <option value="">Select State/Province</option>
            {states.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code}: {s.name}
              </option>
            ))}
          </select>
          <input
            name="city"
            value={destination.city}
            onChange={handleDestinationChange}
            placeholder="City"
            className="p-2 bg-gray-800 border border-gray-600 rounded"
          />
          <input
            name="address1"
            value={destination.address1}
            onChange={handleDestinationChange}
            placeholder="Address Line 1"
            className="p-2 bg-gray-800 border border-gray-600 rounded col-span-2"
          />
          <input
            name="address2"
            value={destination.address2}
            onChange={handleDestinationChange}
            placeholder="Address Line 2"
            className="p-2 bg-gray-800 border border-gray-600 rounded col-span-2"
          />
          <input
            name="phone"
            value={destination.phone}
            onChange={handleDestinationChange}
            placeholder="Phone"
            className="p-2 bg-gray-800 border border-gray-600 rounded col-span-2"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Items</h2>
        <table className="w-full border-collapse border border-gray-600 text-white mb-2">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-gray-600 px-4 py-2">SKU</th>
              <th className="border border-gray-600 px-4 py-2">Quantity</th>
              <th className="border border-gray-600 px-4 py-2">Grams</th>
              <th className="border border-gray-600 px-4 py-2">Price</th>
              <th className="border border-gray-600 px-4 py-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="bg-gray-700">
                <td className="border border-gray-600 px-2 py-1">
                  <input
                    className="w-full p-1 bg-gray-900 border border-gray-700 rounded"
                    value={item.sku}
                    onChange={(e) =>
                      handleItemChange(idx, "sku", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-600 px-2 py-1">
                  <input
                    type="number"
                    className="w-full p-1 bg-gray-900 border border-gray-700 rounded"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(idx, "quantity", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-600 px-2 py-1">
                  <input
                    type="number"
                    className="w-full p-1 bg-gray-900 border border-gray-700 rounded"
                    min="0"
                    value={item.grams}
                    onChange={(e) =>
                      handleItemChange(idx, "grams", e.target.value)
                    }
                  />
                </td>
                <td className="border border-gray-600 px-2 py-1">
                  <input
                    className="w-full p-1 bg-gray-900 border border-gray-700 rounded"
                    value={formatCurrencyInput(item.price)}
                    onChange={(e) =>
                      handleItemChange(idx, "price", e.target.value)
                    }
                  />
                </td>
                <td className="text-center border border-gray-600">
                  <button
                    onClick={() => removeItem(idx)}
                    className="text-purple-300 hover:text-purple-100"
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addItem}
          className="text-green-400 hover:text-green-200 mt-1"
        >
          + Add Item
        </button>
      </div>

      <button
        onClick={fetchRates}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold mb-4"
      >
        Fetch Rates
      </button>
      {selectedState && <StateDetails state={selectedState} />}

      <hr className="mb-6" />
      <AvailableRates rates={rates} requested={requested} />
    </div>
  );
}
