# Routes

### 👥 Customers

**Root URL:** `/api/customers`

##### **Synchronize Customers**

**POST** `/synchronize`

- Retreives customer data from Shopify, imports into Mongo DB
- Should be ran incrementally to ensure customers are synchronized with Shipping Application

**Response:**

```json
Request Received to synchronize customers.
```

### ⚡ Installation

**Root URL:** `/api/install`

##### **Retrieve Installations**

**GET** `/:site`

**Allowed Parameters**: `B2B`, `SBX`

**Response:**

```json
[
  {
    "id": "gid://shopify/DeliveryCarrierService/71360512168",
    "name": "test carrier service",
    "callbackUrl": "https://4p5zvprf-3000.usw3.devtunnels.ms/rates",
    "active": true,
    "supportsServiceDiscovery": true
  }
]
```

##### **Check Installation**

**POST** `/check/:site`

Allowed Parameters: `B2B`, `SBX`

**Response:**

```json

```

##### **Update Installation**

**PATCH** `/:site`

Allowed Parameters: `B2B`, `SBX`

**Response:**

```json

```

##### **Create Installation**

**POST** `/:site`

Allowed Parameters: `B2B`, `SBX`

**Response:**

```json

```

### 🚚 Rates

**Root URL:** `/api/rates`

##### **Get Shipping Rates**

**POST** `/:site`
