# Wholesale Shipping App v3

## Important Links

- [Postman Documentation](https://mionebrands.postman.co/workspace/Wholesale-Shipping-App~64c8d2ba-945d-4acc-b2b8-08631418cf85/collection/12585826-f68d8f0b-5713-4bc2-8f22-3512d5eb5f28?action=share&creator=12585826)




## How it Works...

- [x] Sync Products
  - [x] Shopify => Products
    - Retreive all Active Shopify Products, sync updates to DB
- [x] Sync Customers
  - [x] Shopify => Customers
    - Retreive all Shopify Customers, sync updates to DB
- [x] Sync Lists
  - [x] Products => Lists
    - Retrieve Products Included & Excluded, Update Lists.Skus & Lists.Products
- [X] Sync Rules
  - [x] Lists => Rules.Skus
  - Retreive Lists targeted by Rule, update Rule Skus with unique skus
- [ ] Sync Zip Codes
  - [ ] Business Central => Zip Codes
    - Retreive all BC Zip Codes, sync updates to DB
- [ ] Sync Carrier Services
  - [ ] Zip Codes => Carrier Services.Zip Codes
  - Retreive Zip Codes by Mapped Carrier & Assigned States, update Carrier Services Zip Codes
- [ ] Sync States
  - [x] Carrier Services => States
  - [ ] Zip Codes => States
  - [x] Rules => States
- [x] Full Sync Controller
  - [x]   Sequentially run each sync, using completion of last to drive the next
## Routes

### 🛒 Rates (/api/rates)

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
{
  "rates": [
    {
      "service_name": "Ground Shipping",
      "service_code": "Ground Shipping - LOC",
      "total_price": "0",
      "currency": "USD"
    },
    {
      "service_name": "Local Delivery",
      "service_code": "Local Delivery",
      "total_price": "0",
      "currency": "USD"
    }
  ]
}
```

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/rates/:site
> ```

</details>

---

### 📄 Rules (/api/rules)

#### Synchronize all Rules

<details>
 <summary><code>POST</code> <code><b>/synchronize</b></code> <code>(Synchronizes Skus from Lists to all Rules)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                         |
> | --------- | ------------------------- | ------------------------------------------------ |
> | `200`     | `application/json`        | `{results}` |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}`         |
> | `405`     | `text/html;charset=utf-8` | None                                             |

**Example Response:**

```json
{
  "req_id": "20125978-9d95-4c2d-866d-814b079cb507",
  "results": [
    {
      "req_id": "20125978-9d95-4c2d-866d-814b079cb507",
      "rule_id": "ad385d89-cc02-460c-b565-1e51257a0c64",
      "updates": 0,
      "errors": []
    },
    {
      "req_id": "20125978-9d95-4c2d-866d-814b079cb507",
      "rule_id": "a2d9295e-7f11-4364-b822-7e10de67563e",
      "updates": 0,
      "errors": []
    }
  ]
}
```

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/rules/synchronize
> ```

</details>

---

#### Synchronize one Rule

<details>
 <summary><code>POST</code> <code><b>/synchronize/:id</b></code> <code>(Synchronizes Skus from Lists to one Rules)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | id | strsing | Rule ID | N/A         |

##### Responses

> | http code | content-type              | response                                         |
> | --------- | ------------------------- | ------------------------------------------------ |
> | `200`     | `application/json`        | `{message:"Request Received to Process Rules."}` |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}`         |
> | `405`     | `text/html;charset=utf-8` | None                                             |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/rules/synchronize/:id
> ```

</details>

---

#### Create a Rule

<details>
 <summary><code>POST</code> <code><b>/</b></code> <code>(Create a Shipping Rule)</code></summary>

##### Parameters

> | name     | type | data type                       | description                 |
> | -------- | ---- | ------------------------------- | --------------------------- |
> | name     | body | string                          | Input for new Shipping Rule |
> | range    | body | State, City, Zip Code, Customer | Input for new Shipping Rule |
> | type     | body | Ban, Exemption, Registry        | Input for new Shipping Rule |
> | states   | body | Array of State Codes            | Input for new Shipping Rule |
> | cities   | body | Array of Cities {objects}       | Input for new Shipping Rule |
> | zipCodes | body | Array of Zip Codes {objects}    | Input for new Shipping Rule |
> | lists    | body | Array of List(s) {object}       | Input for new Shipping Rule |

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
> | `200`     | `application/json`        | `{updated rule}`                         |
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

#### Shipping Rule Fields:

| Field          | Type   | Description                          | Example                                                                                    |
| -------------- | ------ | ------------------------------------ | ------------------------------------------------------------------------------------------ |
| id             | guid   | unique identifier                    | `3adacae2-e302-4811-8f3c-39acc16b0035`                                                     |
| name           | string | Shipping Rule Name                   | `Arizona Registry`                                                                         |
| range          | string | Range of Rule                        | `State`                                                                                    |
| type           | string | Type of Rule                         | `Registry`                                                                                 |
| targeted_areas | string | States or Provinces (dep)            | `["AZ"]`                                                                                   |
| states         | guid   | States affected by Rule              | `[{name:"Arizona", code:"AZ"}]`                                                            |
| cities         | guid   | Cities affected by Rule              | `[{code: "AZ",name:"Phoenix"}]` (Only necesarry if Range is City)                          |
| zipCodes       | guid   | Zip Codes affected by Rule           | `[{stateCode:"AZ","code:"85008",county:"Maricopa"}]` (Only necessary if Range is Zip Code) |
| lists          | guid   | Product Lists included in Rule       | `[{id, name, category}]`                                                                   |
| targeted_lists | guid   | Product Lists included in Rule (dep) | `[{id, name, category}]`                                                                   |
| targeted_skus  | guid   | Unique Skus from Product Lists (dep) | `["skus"...]`                                                                              |
| skus           | guid   | Unique Skus from Product Lists       | `["skus"...]`                                                                              |

### 🚚 Services (WIP)

**Carrier Service Fields:**

| Field                   | Type          | Description                                                                 | Example                                |
| ----------------------- | ------------- | --------------------------------------------------------------------------- | -------------------------------------- |
| id                      | guid          | Unique Identifier                                                           | `3adacae2-e302-4811-8f3c-39acc16b0035` |
| name                    | string        | (Staff-Facing) Name                                                         | `Ground Shipping - LOC`                |
| description             | string        | (Staff-Facing) Description                                                  | `Ground Shipping`                      |
| provinces               | array[string] | Active States in Zone                                                       | `["AZ","CA"]`                          |
| minimum_order_value     | integer       | Minimum order value, returns no rates for undervalued carts                 | `10000` (for $100.00)                  |
| price                   | integer       | Base Price of Shipping Service                                              | `2999` (for $29.99)                    |
| free_shipping_threshold | integer       | If not null, Provides free shipping for carts over value set                | `100000` (for $1,000.00)               |
| per_box_value_set       | integer       | If not null, multiplies price (cart_total / per_box_value_set = multiplier) | `3999` (for $39.99-valued boxes)       |
| service_name            | string        | (Shopify-Facing) Shipping Service Name - Displayed to Customer              | `Ground Shipping`                      |
| service_code            | string        | (Shopify-Facing) Shipping Service Code - Used in Order Sync                 | `Ground Shipping - LOC`                |
| for_zips                | array[string] | Active Zip Codes in Zone                                                    | `["86008","85226"]`                    |
| mapped_carrier          | string        | Mapped to BC Carrier (Zip Codes)                                            | `GLS`                                  |

### 📜 Lists (/api/lists)

#### Synchronize all Lists

<details>
 <summary><code>POST</code> <code><b>/synchronize</b></code> <code>(Runs a procedure to synchronize all Product Lists with targeted products)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                     |
> | --------- | ------------------------- | -------------------------------------------- |
> | `200`     | `application/json`        | `{req_id, lists: 0, updated: 0, errors: []}` |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}`     |
> | `405`     | `text/html;charset=utf-8` | None                                         |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/lists/synchronize
> ```

</details>

---

#### Synchronize one List

<details>
 <summary><code>POST</code> <code><b>/synchronize/:id</b></code> <code>(Runs a procedure to synchronize one Product Lists with targeted products)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                                                    |
> | --------- | ------------------------- | --------------------------------------------------------------------------- |
> | `200`     | `application/json`        | `{message:"List was updated succesfully"},{message:"No changes were made"}` |
> | `400`     | `application/json`        | `{{"code":"400","message":"Bad Request"}}`                                  |
> | `405`     | `text/html;charset=utf-8` | None                                                                        |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/lists/synchronize/:id
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

#### Product List Fields:

| Field         | Type         | Description                       | Example                                                                   |
| ------------- | ------------ | --------------------------------- | ------------------------------------------------------------------------- |
| id            | string       | unique identifier                 | `3adacae2-e302-4811-8f3c-39acc16b0035`                                    |
| name          | string       | Product List Name                 | `Not-Nic Salt E-Liquid Products`                                          |
| category      | string       | Shopify Metafield Target          | `E-Liquid`                                                                |
| targeted_skus | [string]     | Unique Skus in Products           | `["sku",...]`                                                             |
| include       | [{clusion}]  | Inclusion Rules                   | `[{key:"category", value:"E-Liquid"},{key:"category", value:"E-Liquid"}]` |
| exclude       | [{clusion}]  | Exclusion Rules                   | `[{ket:"tags", value:"ns"}]`                                              |
| products      | [{products}] | Shopify Products included in Rule | `[{id, title, status, variants: [{id, sku}]}]`                            |

---

### 📃 Zip Codes (WIP)

> [!warning] (WIP) Zip Codes are synchronized from Business Central on a schedule.

**Zip Code Fields:**

| Field     | Type   | Description                | Example    |
| --------- | ------ | -------------------------- | ---------- |
| stateCode | string | State Code                 | `AZ`       |
| code      | string | Zip Code/Postal Code value | `85008`    |
| county    | string | Localized County           | `Maricopa` |

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

> [!warning] (WIP) Customers are synchronized from Shopify and Business Central on a schedule.

**Customer Fields:**

| Field          | Type        | Description                        | Example                        |
| -------------- | ----------- | ---------------------------------- | ------------------------------ |
| id             | shopify gid | unique identifier                  | `Arizona`                      |
| email          | string      | Customer Email                     | `example@email.com`            |
| phone          | string      | Customer Phone                     | `8001234321`                   |
| customerNumber | string      | Customer Number (Business Central) | `C0000001`                     |
| rules          | [{rules}]   | Shipping Rules - Customer Level    | `[{id,name,range,type,lists}]` |
| site           | string      | Customer Site                      | `B2B`                          |

### 🌐 States (/api/state)

#### Get All States

<details>
 <summary><code>GET</code> <code><b>/</b></code> <code>(Get All States)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `[{state},{state}]`                      |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X GET -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/state
> ```

</details>

---

#### Get One State

<details>
 <summary><code>GET</code> <code><b>/:stateCode</b></code> <code>(Get One State by State Code)</code></summary>

##### Parameters

> | name      | type     | data type | description |
> | --------- | -------- | --------- | ----------- |
> | stateCode | required | parameter | `AZ`        |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{state}`                                |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/state/AZ
> ```

</details>

---

#### Create a State

<details>
 <summary><code>POST</code> <code><b>/</b></code> <code>(Create a State)</code></summary>

##### Parameters

> | name     | type               | data type       | description |
> | -------- | ------------------ | --------------- | ----------- |
> | name     | required           | string          | N/A         |
> | code     | required           | string          | N/A         |
> | status   | default - disabled | string          | N/A         |
> | rules    | required           | array[rules]    | N/A         |
> | zipCodes | required           | array[zipCodes] | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{state}`                                |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/state
> ```

</details>

---

#### Update a State

<details>
 <summary><code>PATCH</code> <code><b>/:stateCode</b></code> <code>(Update a State by State Code)</code></summary>

##### Parameters

> | name      | type     | data type | description |
> | --------- | -------- | --------- | ----------- |
> | stateCode | required | string    | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{updates: [], state: {}}`               |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X PATCH -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/state/:stateCode
> ```

</details>

---

#### Delete a State

<details>
 <summary><code>DELETE</code> <code><b>/:stateCode</b></code> <code>(Delete a State by State Code)</code></summary>

##### Parameters

> | name      | type     | data type | description |
> | --------- | -------- | --------- | ----------- |
> | stateCode | required | string    | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `[{ message: "State deleted" }]`         |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X DELETE -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/state/:stateCode
> ```

</details>

---

#### Synchronize All States

<details>
 <summary><code>POST</code> <code><b>/synchronize</b></code> <code>(Synchronize all States (rules, services, zip codes))</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | None | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `[results]`                              |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/state/synchronize
> ```

</details>

---

#### Delete a State

<details>
 <summary><code>POST</code> <code><b>/synchronize/:stateCode</b></code> <code>(Synchronize one State (rules, services, zip codes))</code></summary>

##### Parameters

> | name      | type     | data type | description |
> | --------- | -------- | --------- | ----------- |
> | stateCode | required | string    | N/A         |

##### Responses

> | http code | content-type              | response                                 |
> | --------- | ------------------------- | ---------------------------------------- |
> | `200`     | `application/json`        | `{ results }`                            |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}` |
> | `405`     | `text/html;charset=utf-8` | None                                     |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/state/synchronize/:stateCode
> ```

</details>

---

#### State Fields:

| Field    | Type         | Description                          | Example                                                       |
| -------- | ------------ | ------------------------------------ | ------------------------------------------------------------- |
| name     | string       | State Name                           | `Arizona`                                                     |
| code     | string       | State Code                           | `AZ`                                                          |
| status   | string       | Shipping Availability Status         | `enabled : disabled`                                          |
| rules    | [{rules}]    | Shipping Rules                       | `[{id,name,range,type,cities,zipCodes,lists,targeted_lists}]` |
| zipCodes | [{zipCodes}] | Zip Codes in State                   | `[{code, county}]`                                            |
| services | [{services}] | Shipping Services available in State | `[{id, name, description}]`                                   |

### 🛍️ Products (/api/products)

#### Synchronize Products

<details>
 <summary><code>POST</code> <code><b>/synchronize/:site</b></code> <code>(Synchronize Products from Targeted Store)</code></summary>

##### Parameters

> | name | type     | data type             | description |
> | ---- | -------- | --------------------- | ----------- |
> | site | required | object (JSON or YAML) | N/A         |

##### Responses

> | http code | content-type              | response                                                             |
> | --------- | ------------------------- | -------------------------------------------------------------------- |
> | `200`     | `application/json`        | `{ message: `Request Received to Synchronize Products on ${site}` }` |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}`                             |
> | `405`     | `text/html;charset=utf-8` | None                                                                 |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/products/synchronize
> ```

</details>

---

#### Synchronize One Product

<details>
 <summary><code>POST</code> <code><b>/synchronize/:site/:product_id</b></code> <code>(Synchronize One Product from Targeted Store)</code></summary>

##### Parameters

> | name       | type     | data type | description |
> | ---------- | -------- | --------- | ----------- |
> | site       | required | string    | N/A         |
> | product_id | required | string    | N/A         |

##### Responses

> | http code | content-type              | response                                                                           |
> | --------- | ------------------------- | ---------------------------------------------------------------------------------- |
> | `200`     | `application/json`        | `{ message: "Request Received to Synchronize Product on ${site}: ${product_id}" }` |
> | `400`     | `application/json`        | `{"code":"400","message":"Bad Request"}`                                           |
> | `405`     | `text/html;charset=utf-8` | None                                                                               |

##### Example cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @post.json http://localhost:7000/api/products/synchronize/:site/:product_id
> ```

</details>

---

#### Product Fields:

| Field         | Type         | Description                        | Example                               |
| ------------- | ------------ | ---------------------------------- | ------------------------------------- |
| product_id    | shopify gid  | unique identifier                  | `gid://shopify/Product/4630028910655` |
| title         | string       | Shopify Product Title              | `Reds Apple Berries Iced Salts`       |
| status        | string       | Product Status                     | `ACTIVE`                              |
| category      | string       | Metafield: filter.product_category | `E-Liquid`                            |
| variantsCount | integer      | Count of Total Variants            | `12`                                  |
| unique_skus   | [string]     | Unique Skus within Variants        | `["50288","50289"]`                   |
| tags          | [string]     | Product Tags                       | `["eliquid","ns",...]`                |
| site          | string       | From-Website                       | `B2B`                                 |
| variants      | [{variants}] | Shopify Variants                   | `[{id, sku, title},...]`              |

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
