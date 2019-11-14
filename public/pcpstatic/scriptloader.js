    var timerId = null;
      
    function loadPPJS() {
      var isLoaded = false;
      
      // handle error if the JS script doesn't load after a specific time
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        $.LoadingOverlay("hide");
        if(!isLoaded) {
          addToConsole("Some error has occurred . Please check your configurations ","error");
          alert("Some error has occurred . Please check your configurations ")
        }
      },15000)

      try {
        //$("#loader-wrapper").show();
        $.LoadingOverlay("show");
        var elem = document.getElementById("ppscript");
   
        let {
          env,
          clientId,
          clientSecret,
          country,
          buyercountry,
          lang,
          merchantId,
          customerId,
          currency,
          setLocale,
          setBuyerCountry,
          intent
        } = getScriptQueryParam();
  
        $("#paypal-button").empty();
        $("#paypal-button").hide();     
        
        if(elem)
            elem.parentNode.removeChild(elem);
  
        var file = `https://www.paypal.com/sdk/js?client-id=${clientId}&commit=true&components=buttons&debug=false&currency=${currency}`;
        
        file += `&intent=${intent}`;
        
        if(merchantId && merchantId.length > 0) {
          file += `&merchant-id=${merchantId}`;
        }
  
        if(setLocale == 'true') {
          file += `&locale=${lang+'_'+country}`;
        }
  
        if(setBuyerCountry == 'true') {
          file += `&buyer-country=${buyercountry}`;
        }
        
        var jsElm = document.createElement("script");
        jsElm.type = "application/javascript";
        jsElm.src = file;
        jsElm.id = "ppscript";
        document.body.appendChild(jsElm);
  
        jsElm.onload = function() {
            $("#paypal-button").show();  
            renderPPButton();
            setTimeout(function() {
              //$("#loader-wrapper").hide();
              $.LoadingOverlay("hide");
              isLoaded = true;
            },4000)
        }
      } catch(err) {
        console.log("Error ",err);
        $.LoadingOverlay("hide");
        addToConsole("Some error has occurred in loading PP Button. Please check your configurations "+err.message,"error");
        alert("Some error has occurred in loading PP Button. Please check your configurations ")
        throw err;
      }
    }
  
    async function loadPPAndHostedJS(type) {
      var isLoaded = false;
      
      // handle error if the JS script doesn't load after a specific time
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        $.LoadingOverlay("hide");
        if(!isLoaded) {
          addToConsole("Some error has occurred . Please check your configurations ","error");
          alert("Some error has occurred . Please check your configurations ")
        }
      },15000)

      try {
        //$("#loader-wrapper").show();
        $.LoadingOverlay("show");
        var elem = document.getElementById("ppscript");
        
        let {
          env,
          clientId,
          clientSecret,
          country,
          buyercountry,
          lang,
          merchantId,
          customerId,
          currency,
          setLocale,
          setBuyerCountry,
          intent
        } = getScriptQueryParam();
  
        if(elem)
            elem.parentNode.removeChild(elem);
        
        let vaultingEnabled = $("[name=vaultingEnabled]").val();
        
        let envObj = {
          clientId,
          clientSecret,
          merchantId,
          env,
          customerId,
          isVaulting: vaultingEnabled == "Yes"
        };

        if(vaultingEnabled == "Yes" && !customerId )  {
          alert("Enter Customer ID");
          return;
        }

        
        let clientTokenRespJson = await fetch("/pcp-get-client-token", {
          method:"POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            envObj
          })
        });

        let clientTokenResp = await clientTokenRespJson.json();

        console.log(clientTokenResp);
        if(!clientTokenResp.status || !clientTokenResp.clientToken)  {
          alert("Some Error Occured in loading Hosted fields. Check the configuration");
          addToConsole("Some Error Occured in loading Hosted fields. Check the configuration","error");
          addToConsole(JSON.stringify(clientTokenResp.error));
          return;
        }

        let clientToken = clientTokenResp.clientToken;

        let components = "hosted-fields"
        if(type=="both") {
          components = "buttons,hosted-fields"
        }
        
        var file = `https://www.paypal.com/sdk/js?client-id=${clientId}&commit=true&components=${components}&debug=false&currency=${currency}`;
        
        file += `&intent=${intent}`;
        
        if(merchantId && merchantId.length > 0) {
          file += `&merchant-id=${merchantId}`;
        }
  
        if(setLocale == 'true') {
          file += `&locale=${lang+'_'+country}`;
        }
  
        if(setBuyerCountry == 'true') {
          file += `&buyer-country=${buyercountry}`;
        }
        
        var jsElm = document.createElement("script");
        jsElm.type = "application/javascript";
        jsElm.src = file;
        jsElm.id = "ppscript";
        jsElm.dataset["clientToken"] = clientToken;
        document.body.appendChild(jsElm);
  
        jsElm.onload = function() {
            renderHostedButton();
  
            if(type == "both") {
              renderPPButton();
            }
            setTimeout(function() {
              //$("#loader-wrapper").hide();
              $.LoadingOverlay("hide");
              isLoaded = true;
            },4000)
        }
      } catch(err) {
        console.log("Error ",err);
        $.LoadingOverlay("hide");
        addToConsole("ERROR - "+err.message,"error");
        alert("Some error has occurred in loading Hosted Fields. Please check your configurations ")
        throw err;
      }
    }
    

    function save() {
      $("#plgStatus").empty();
    
      var components = $("[name=components]:checked").map(function () {
            return this.value;
          }).get()

        console.log(components);

        if(!components || components.length == 0) {
          alert("Please select atleast one Component");
          return;
        }

        if(components && components.length == 1) {
          if(components.includes("buttons")) {
            loadPPJS();
          }
          else if(components.includes("hosted-fields")) {
            loadPPAndHostedJS("one");
          }
        } else {
          loadPPAndHostedJS("both")
        }
      
    }

    function addToConsole(msg, state) {
      if(!state)
          $("#plgStatus").append("<span style='color:green'>"+msg+"</span><span style='float:right'>"+ moment(new Date()).format("HH:mm:ss a")+"</span>");
      else
          $("#plgStatus").append("<span style='color:red'>"+msg+"</span><span style='float:right'>"+ moment(new Date()).format("HH:mm:ss a")+"</span>");
      
      $("#plgStatus").append("<br/><br/>")
    }

    window.onerror = function (message, url, line, column, error) {
      console.log("Uncaught error"  + message + " "+ error);
      $("#paypal-error-container").html("<br/>Error Occurred while rendering buttons.");
    }
