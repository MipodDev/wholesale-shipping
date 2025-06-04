# Wholesale Shipping App v3

## Important Links

- [Postman Documentation](https://mionebrands.postman.co/workspace/Shopify-Integrations~19c14e98-c0e9-42fb-8313-8f63746b629d/collection/12585826-29556f7e-85bd-4827-9d83-b49d2a5dc847?action=share&creator=12585826)

## Routes

### 🚚 Rates (/api/rates)

#### Get Rates

<details>
 <summary><code>POST</code> <code><b>/:site</b></code> <code>(Get Shipping Rates for Determined Site)</code></summary>

##### Parameters

> | name | type | data type             | description |
> | ---- | ---- | --------------------- | ----------- |
> | rate | body | object (JSON or YAML) | N/A         |

**Example Rate Request:**

```json
{
  "rate": {
    "origin": {
      "country": "US",
      "postal_code": "85008",
      "province": "AZ",
      "city": "Phoenix",
      "name": null,
      "address1": "4908 E Mcdowell Rd",
      "address2": "Suite 100",
      "address3": null,
      "latitude": 33.4667751,
      "longitude": -111.9758635,
      "phone": null,
      "fax": null,
      "email": null,
      "address_type": null,
      "company_name": "mipodwholesale-avalara"
    },
    "destination": {
      "country": "US",
      "postal_code": "85008",
      "province": "AZ",
      "city": "Phoenix",
      "name": "Dylan Walters",
      "address1": "4908 East McDowell Road",
      "address2": null,
      "address3": null,
      "latitude": 33.466806,
      "longitude": -111.9758276,
      "phone": "4802524808",
      "fax": null,
      "email": null,
      "address_type": null,
      "company_name": null
    },
    "items": [
      {
        "name": "Aloe Grape Orion Bar 7500 - Wholesale A / 50mg / 10 Pack",
        "sku": "53364-10",
        "quantity": 9,
        "grams": 850,
        "price": 8000,
        "vendor": "Lost Vape",
        "requires_shipping": true,
        "taxable": true,
        "fulfillment_service": "manual",
        "properties": {},
        "product_id": 8052175536296,
        "variant_id": 45793663484072
      }
    ],
    "currency": "USD",
    "locale": "en-US"
  }
}
```

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{rates: []}`                            |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

**Example Response with Rates**

```json

```

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/rates/:site
> ```

</details>

---

### 👥 Customers (/api/customers)

#### Synchronize Customers

<details>
 <summary><code>POST</code> <code><b>/example</b></code> <code>(synchronize customers from shopify store to database)</code></summary>

##### Parameters

> | name | type       | data type | description |
> | ---- | ---------- | --------- | ----------- |
> | site | Parameters | string    | "B2B"       |

##### Responses

> | http code | content-type              | response                                                  |
> | --------- | ------------------------- | --------------------------------------------------------- |
> | `200`     | `application/json`        | `{message: "Request Received to synchronize customers."}` |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}`                  |
> | `405`     | `text/html;charset=utf-8` | None                                                      |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/customers/synchronize/:site
> ```

</details>

---

### ⚡ Installation (/api/install)

#### Get Installed Services

<details>
 <summary><code>GET</code> <code><b>/:site</b></code> <code>(description)</code></summary>

##### Parameters

> | name | type       | data type | description |
> | ---- | ---------- | --------- | ----------- |
> | site | Parameters | string    | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `[carrier services]`                     |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

**Example Response:**

```json
[
  {
    "id": "gid://shopify/DeliveryCarrierService/71360512168",
    "name": "Mi-One Brands Shipping Rates",
    "callbackUrl": "https://example.com/api/rates/SBX",
    "active": true,
    "supportsServiceDiscovery": true
  }
]
```

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/
> ```

</details>

---

#### Check Installed Carrier Service

<details>
 <summary><code>POST</code> <code><b>/check/:site</b></code> <code>(Retrieve Installed Carrier Service from DB, check installation status on Shopify, update db with any seen changes)</code></summary>

##### Parameters

> | name | type       | data type | description |
> | ---- | ---------- | --------- | ----------- |
> | site | Parameters | string    | "B2B"       |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{carrier_service}`                      |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

**Example Response:**

```json
{
  "_id": "683a0265689c96a0703500db",
  "name": "Mi-Pod Wholesale (SBX)",
  "code": "SBX",
  "my_shopify_url": "mipodwholesale-avalara",
  "createdAt": "2025-05-30T19:09:25.455Z",
  "updatedAt": "2025-05-30T20:50:15.338Z",
  "__v": 0,
  "active": true,
  "app_name": "Mi-One Brands Shipping Rates",
  "callbackUrl": "https://example.com/api/rates/SBX",
  "gid": "gid://shopify/DeliveryCarrierService/71360512168",
  "supportsServiceDiscovery": true
}
```

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/
> ```

</details>

---

#### Install new Carrier Service

<details>
 <summary><code>POST</code> <code><b>/:site</b></code> <code>(Install a new Carrier Service on targeted Shopify store)</code></summary>

##### Parameters

> | name            | type       | data type     | description          |
> | --------------- | ---------- | ------------- | -------------------- |
> | site            | Parameters | string        | "B2B, SBX"           |
> | carrier_service | Body       | Object (JSON) | Carrier Service Body |

**Example `carrier_service`:**

```json
{
  "name": "Mi-Pod Shipping App",
  "callbackUrl": "https://example.com/api/rates",
  "active": true,
  "supportsServiceDiscovery": true
}
```

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{configured carrier_service}`           |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

**Example Response:**

```json
{
  "_id": "683a0265689c96a0703500db",
  "name": "Mi-Pod Wholesale (SBX)",
  "code": "SBX",
  "my_shopify_url": "mipodwholesale-avalara",
  "createdAt": "2025-05-30T19:09:25.455Z",
  "updatedAt": "2025-05-30T20:50:15.338Z",
  "__v": 0,
  "active": true,
  "app_name": "Mi-One Brands Shipping Rates",
  "callbackUrl": "https://example.com/api/rates/SBX",
  "gid": "gid://shopify/DeliveryCarrierService/71360512168",
  "supportsServiceDiscovery": true
}
```

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/
> ```

</details>

---

#### Update Existing Carrier Service

<details>
 <summary><code>PATCH</code> <code><b>/:site</b></code> <code>(Update Installed Carrier Service on Shopify store)</code></summary>

##### Parameters

> | name            | type       | data type     | description          |
> | --------------- | ---------- | ------------- | -------------------- |
> | site            | Parameters | string        | "B2B, SBX"           |
> | carrier_service | Body       | Object (JSON) | Carrier Service Body |

**Example `carrier_service`:**

```json
{
  "id": "gid://shopify/DeliveryCarrierService/71360512168",
  "name": "Mi-One Brands Shipping Rates",
  "callbackUrl": "https://example.com/api/rates/SBX",
  "active": true,
  "supportsServiceDiscovery": true
}
```

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{configured carrier_service}`           |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

**Example Response:**

```json
{
  "_id": "683a0265689c96a0703500db",
  "name": "Mi-Pod Wholesale (SBX)",
  "code": "SBX",
  "my_shopify_url": "mipodwholesale-avalara",
  "createdAt": "2025-05-30T19:09:25.455Z",
  "updatedAt": "2025-05-30T20:50:15.338Z",
  "__v": 0,
  "active": true,
  "app_name": "Mi-One Brands Shipping Rates",
  "callbackUrl": "https://example.com/api/rates/SBX",
  "gid": "gid://shopify/DeliveryCarrierService/71360512168",
  "supportsServiceDiscovery": true
}
```

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/
> ```

</details>

---

### 📄 Rules (/api/rule)

#### Process Rules

<details>
 <summary><code>POST</code> <code><b>/process</b></code> <code>(Runs a procedure to synchronize rule data with states and lists)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                         |
> | --------- | ------------------------- | ------------------------------------------------ |
> | `200`     | `application/json`        | `{message:"Request Received to Process Rules."}` |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}`         |
> | `405`     | `text/html;charset=utf-8` | None                                             |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/rules/process
> ```

</details>

---

#### Create a Rule

<details>
 <summary><code>POST</code> <code><b>/</b></code> <code>(Create a Shipping Rule)</code></summary>

##### Parameters

> | name  | type | data type             | description                 |
> | ----- | ---- | --------------------- | --------------------------- |
> | input | body | object (JSON or YAML) | Input for new Shipping Rule |

**Example Input:**

```json
{
  "name": "Example Rule",
  "range": "state",
  "type": "Exemption",
  "states": [
    {
      "name": "Arizona",
      "code": "AZ"
    }
  ],
  "cities": [],
  "zipCodes": [],
  "lists": [
    {
      "id": "40b99c04-a8f4-4d26-a90c-319bb0d90d0c",
      "name": "Uncategorized Product List",
      "category": "Uncategorized"
    }
  ],
  "skus": []
}
```

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{created_rule}`                         |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

**Example Response:**

```json
{
  "id": "f658f268-9aea-4dc8-8a5d-6288cfb1ee75",
  "name": "Example Rule",
  "range": "state",
  "type": "exemption",
  "targeted_areas": [],
  "states": [
    {
      "name": "Arizona",
      "code": "AZ",
      "_id": "683f5fd397dc0083344661d5"
    }
  ],
  "cities": [],
  "zipCodes": [],
  "lists": [
    {
      "id": "40b99c04-a8f4-4d26-a90c-319bb0d90d0c",
      "name": "Uncategorized Product List",
      "category": "Uncategorized",
      "_id": "683f5fd397dc0083344661d6"
    }
  ],
  "targeted_skus": [],
  "_id": "683f5fd397dc0083344661d4",
  "targeted_lists": [],
  "__v": 0
}
```

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/rule
> ```

</details>

---

#### Update a Rule

<details>
 <summary><code>PATCH</code> <code><b>/:id</b></code> <code>(Update an Existing Rule)</code></summary>

##### Parameters

> | name  | type   | data type             | description                     |
> | ----- | ------ | --------------------- | ------------------------------- |
> | id    | params | object id             | id, not \_id (uuid)             |
> | input | body   | object (JSON or YAML) | Input for updated Shipping Rule |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{updated rule}`     |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

```json
{
  "_id": "683f5fd397dc0083344661d4",
  "id": "f658f268-9aea-4dc8-8a5d-6288cfb1ee75",
  "name": "Example Rule test",
  "range": "state",
  "type": "exemption",
  "targeted_areas": [],
  "states": [
    {
      "name": "Arizona",
      "code": "AZ",
      "_id": "683f603197dc0083344661de"
    }
  ],
  "cities": [],
  "zipCodes": [],
  "lists": [
    {
      "id": "40b99c04-a8f4-4d26-a90c-319bb0d90d0c",
      "name": "Uncategorized Product List",
      "category": "Uncategorized",
      "_id": "683f603197dc0083344661df"
    }
  ],
  "targeted_skus": [],
  "targeted_lists": [],
  "__v": 1
}
```
##### Example cURL

> ```javascript
>  curl -X PATCH -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/rule/:id
> ```

</details>

---

#### Delete a Rule

<details>
 <summary><code>DELETE</code> <code><b>/:id</b></code> <code>(Deletes a specific rule)</code></summary>

##### Parameters

> | name | type   | data type | description         |
> | ---- | ------ | --------- | ------------------- |
> | id   | params | object id | id, not \_id (uuid) |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{"message": "Rule deleted"}`            |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X DELETE -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/rule/:id
> ```

</details>

---

#### Get a Rule

<details>
 <summary><code>GET</code> <code><b>/:id</b></code> <code>(Retreive a specific rule)</code></summary>

##### Parameters

> | name | type   | data type | description         |
> | ---- | ------ | --------- | ------------------- |
> | id   | params | object id | id, not \_id (uuid) |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `Configuration created successfully`     |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

```json
{
  "_id": "683f5fd397dc0083344661d4",
  "id": "f658f268-9aea-4dc8-8a5d-6288cfb1ee75",
  "name": "Example Rule",
  "range": "state",
  "type": "exemption",
  "targeted_areas": [],
  "states": [
    {
      "name": "Arizona",
      "code": "AZ",
      "_id": "683f5fd397dc0083344661d5"
    }
  ],
  "cities": [],
  "zipCodes": [],
  "lists": [
    {
      "id": "40b99c04-a8f4-4d26-a90c-319bb0d90d0c",
      "name": "Uncategorized Product List",
      "category": "Uncategorized",
      "_id": "683f5fd397dc0083344661d6"
    }
  ],
  "targeted_skus": [],
  "targeted_lists": [],
  "__v": 0
}
```

##### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/rule/:id
> ```

</details>

---

#### Get all Rules

<details>
 <summary><code>GET</code> <code><b>/</b></code> <code>(Retreive all rules)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `[{rules}]`                              |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/rule
> ```

</details>

---

### 📜 Lists (/api/list)

#### Process Lists

<details>
 <summary><code>POST</code> <code><b>/process</b></code> <code>(Runs a procedure to synchronize list data with rules)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `Request Received to Process Lists`      |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/list/process
> ```

</details>

---

#### Create a List

<details>
 <summary><code>POST</code> <code><b>/example</b></code> <code>(description)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `Configuration created successfully`     |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/
> ```

</details>

---

#### Update a List

<details>
 <summary><code>POST</code> <code><b>/example</b></code> <code>(description)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `Configuration created successfully`     |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/
> ```

</details>

---

#### Delete a List

<details>
 <summary><code>POST</code> <code><b>/example</b></code> <code>(description)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `Configuration created successfully`     |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/
> ```

</details>

---

#### Get a List

<details>
 <summary><code>POST</code> <code><b>/example</b></code> <code>(description)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `Configuration created successfully`     |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/
> ```

</details>

---

#### Get all Lists

<details>
 <summary><code>POST</code> <code><b>/example</b></code> <code>(description)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `Configuration created successfully`     |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/
> ```

</details>

---

### 🌐 States

#### Example Route

<details>
 <summary><code>POST</code> <code><b>/example</b></code> <code>(description)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `Configuration created successfully`     |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/
> ```

</details>

---
