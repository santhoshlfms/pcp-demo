function renderHostedButton() {

    if (paypal.HostedFields.isEligible() === true) {
        var type = $("#hostedFieldsType").val();
        var src = 'bootstrap_pcp.ejs'
        switch(type) {
            case 'Animate' :
                src = 'animate_pcp';
                break;
            case '3dtransform' :
                src = '3dtransform_pcp';
                break;
            case 'Bootstrap':
                src = 'bootstrap_pcp'
                break;
            case 'Minimal':
                src = 'minimal_pcp'
                break;
            default :
            src = 'bootstrap_pcp'
        
        }
        
        $.get("../"+src + ".ejs", function (data) {
            $("#hcontainer").empty();
            $("#hcontainer").append(data);
            $("#hostedButton").show();
            loadHostedButtons();
        });
    } else {
        addToConsole("Not eligible for Hosted Fields ","error");
    }
}


function createOrderHosted() {


    $.LoadingOverlay("show", {
        image: "",
        text: "Creating Order...",
        textClass: "loadingText"                                
    });

    const { envObj , orderObj } = getCreateOrderPayload();
    
    addToConsole("Creating Order");

    addToConsole("Create Order Request");

    addToConsole("<pre style='max-height:320px'>"+JSON.stringify(orderObj, null, 2)+"</pre>");  
   
    
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
        addToConsole(
            "<pre style='max-height:320px'>" +
              JSON.stringify(res, null, 2) +
              "</pre>", "error");
        else
        addToConsole("Order Id : "+ res.id)
        return res;
    })
    .then(d => d.id)
    .catch((err) => {
        console.log("error", err)
    })
    .finally(() => {
        $.LoadingOverlay("hide");
    })
}
