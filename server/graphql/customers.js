const { shopifyQl } = require("../api/Shopify.QL");

async function retreiveCustomerData(site, filter) {
  const query = `{
  customers(${filter}) {
    edges {
      cursor
      node {
        defaultEmailAddress {
          emailAddress
        }
        id
        defaultPhoneNumber {
          phoneNumber
        }
        numberOfOrders
      }
    }
    pageInfo {
      endCursor
    }
  }
}`;
  const input = null;
  const response = await shopifyQl(site, query, input);
  return response.data;
}

async function deleteCustomer(site, id) {
  const query = `mutation customerDelete($id: ID!) {
  customerDelete(input: {id: $id}) {
    shop {
      id
    }
    userErrors {
      field
      message
    }
    deletedCustomerId
  }
}`;
  const input = {
    id,
  };
  const response = await shopifyQl(site, query, input);
  return response.data;
}

async function customerCleanupQuery(site, filter) {
  const query = `{
  customers(${filter}) {
    edges {
      cursor
      node {
        defaultEmailAddress {
          emailAddress
          validFormat
        }
        id
        defaultPhoneNumber {
          phoneNumber
        }
        numberOfOrders
        canDelete
        note
        state
        tags
        verifiedEmail
        createdAt
      }
    }
    pageInfo {
      endCursor
    }
  }
}`;
  const input = null;
  const response = await shopifyQl(site, query, input);
  return response.data;
}

module.exports = { retreiveCustomerData, deleteCustomer, customerCleanupQuery };
