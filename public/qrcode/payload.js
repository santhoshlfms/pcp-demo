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
      retailer_name: "Jewellery Loc 2",
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
        value: "3.50",
      },
      invoice: {
        external_id: uniqueId,
        soft_descriptor: "Test Merchant",
        items: [
          {
            name: "Ticondra Pencil",
            description: "Long lasting and laser tip LED",
            ean: "001101",
            sku: "110011",
            return_policy_id: "fee1101",
            total_price: {
              currency_code: "USD",
              value: "5.00",
            },
            item_price: {
              currency_code: "USD",
              value: "5.00",
            },
            item_count: "2",
            discounts: [
              {
                name: "Ticondra Promotional discount",
                description: "Buy one get one free",
                amount: {
                  currency_code: "USD",
                  value: "5.00",
                },
                redeemed_offer_type: "MERCHANT_COUPON",
                redeemed_offer_id: uniqueId,
              },
            ],
          },
        ],
        discounts: [
          {
            name: "MerchantCoupon",
            description: "This is a merchant coupon for 1.00 $",
            amount: {
              currency_code: "USD",
              value: "2.50",
            },
            redeemed_offer_type: "MERCHANT_COUPON",
            redeemed_offer_id: uniqueId,
          },
        ],
      },
    },
    receipt_info: {
      terminal_sales_time: new Date().toISOString(),
      retailer_transaction_id: "transaction_id",
    },
  };
  return { qrcObj };
}
