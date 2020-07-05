// util to render pp button
function renderPPButton() {
  $("#paypal-button").empty();
  $("#paypal-button").show();
  //var label = $("[name=label]").val();
  
  const { envObj , orderObj } = getCreateOrderPayload();
  
  const intent = $("[name=intent]:checked").attr("data-value");

  paypal
    .Buttons({
      // Specify the style of the button
      style: {
        layout: "vertical",
        shape: "rect", // pill | rect
        color: "gold", // gold | blue | silve | black
        label: "checkout" // checkout | pay | paypal
      },
      createOrder: function(data, actions) {
       
        addToConsole("Creating Order");
        return fetch("/pcp-create-order", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            envObj,
            orderObj
          })
        })
        .then(res => res.json())
        .then(res => {
          if(!res.id)
            addToConsole(JSON.stringify(res, null, 4));
          else
            addToConsole("Order Id : "+ res.id)
          return res;
        })
        .then(d => d.id);
      },
     
      onApprove: function(data, actions) {
        // Get the transaction details
        return fetch("/pcp-get-order?id="+data.orderID,{
          method: 'POST',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            envObj,
          })
        })
        .then(res => res.json())
        .then(res => {
            if(!res.id) {
                addToConsole(JSON.stringify(res,null,4));
            }
            return res;
        })
        .then(function(details) {
          // Optionally display the transaction details to the buyer
          addToConsole("Authorized by Buyer");
          addToConsole("Create order response");  
          addToConsole("<pre style='height:200px'>"+JSON.stringify(details, null, 2)+"</pre>");  

          console.log(data.orderID, details.id);
          // Capture the funds from the transaction
          if(intent == 'authorize') {
              return fetch("/pcp-auth-order?id="+details.id,{
                method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  envObj,
                })
              })
              .then(res => res.json())
              .then(res => {
                if (!res.id) {
                  addToConsole(JSON.stringify(res, null, 4),"error");
                  return "Error";
                }
                return res;
            })
          }
          else {
            return fetch("/pcp-capture-order?id="+data.orderID,{
                method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  envObj,
                })
            })
            .then(res => res.json())
            .then(res => {
              if (!res.id) {
                addToConsole(JSON.stringify(res, null, 4),"error");
                return "Error";
              }
                return res;
            })
          }
        }).then(function(details) {
            if(details === "Error") { 
              alert("Some Error Occurred");
              return;
            }
            // Show a success message to your buyer
            if(intent=='capture') {
                alert("Payment Successful")
                addToConsole("Payment successful");
            } else {
                alert("Payment Authorized. Capture the Order once you are ready")
                addToConsole("Payment Authorized. Capture the Order once you are ready");
            }
            addToConsole("<pre style='height:200px'>"+JSON.stringify(details, null, 2)+"</pre>");  
        });
      },
      onCancel : function(err) {
        addToConsole("You cancelled the operation","error");
        return  alert("You cancelled the operation");
      },
      onError: function(err) {
        console.log("Some error occurred " + err);
        addToConsole("ERROR - "+err.message,"error");
        alert(
          "Some Error Occurred . Please open console to see the error " +
            JSON.stringify(err)
        );
      },
      onInit: function(data, actions) {
        addToConsole("PayPal Button Loaded");  
      }
    })
    .render("#paypal-button")
    .catch(err => {
      console.log("errrrrror ", err);
      $("#paypal-error-container").html("<br/> " + err.message);
      $("#paypal-error-container").show();
      addToConsole("ERROR - " + err.message, "error");
    })
    
} // end of pp button render
