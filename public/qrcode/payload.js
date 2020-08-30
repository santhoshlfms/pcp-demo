function getScriptQueryParam() {
  var env = "sandbox";
  return {
    env,
  };
}

function getEnvObj() {
  var env = "sandbox";
  return {
    env,
  };
}

function createCaptureDetailsPayload(uniqueId, qrCode) {
  const qrcObj = {
    point_of_sale_details: {
      store_details: {
        external_id: "teststore2",
      },
      terminal_details: {
        external_id: "5",
        type: "CASH_REGISTER",
      },
      retailer_name: "Retailer Loc 2",
    },
    credential_info: {
      retailer: {
        account_id: "7J5E5MRJUDW9Q",
      },
      customer: {
        qr_code: qrCode,
      },
    },
    transaction: {
      partial_tender: false,
      partial_approval_supported: true,
      amount: {
        currency_code: "USD",
        value: "400.00",
      },
      invoice: {
        external_id: uniqueId + "_invoice_id",
        soft_descriptor: "Test Merchant",
        items: [
          {
            name: "Timex Unisex Originals",
            description: "Watches",
            ean: "001101",
            sku: "110011",
            return_policy_id: "fee1101",
            total_price: {
              currency_code: "USD",
              value: "100.00",
            },
            item_price: {
              currency_code: "USD",
              value: "50.00",
            },
            item_count: "2",
          },

          {
            name: "Lumix Camera Lens",
            description: "Camera",
            ean: "001201",
            sku: "110021",
            return_policy_id: "fee1201",
            total_price: {
              currency_code: "USD",
              value: "300.00",
            },
            item_price: {
              currency_code: "USD",
              value: "300.00",
            },
            item_count: "1",
          },
        ],
      },
    },
    receipt_info: {
      terminal_sales_time: new Date().toISOString(),
      retailer_transaction_id: uniqueId + "_transaction_id",
    },
  };
  return { qrcObj };
}
