(this["webpackJsonphw-components"]=this["webpackJsonphw-components"]||[]).push([[0],{100:function(e,t,a){"use strict";a.r(t);var r=a(0),n=a.n(r),o=a(10),i=a.n(o),s=(a(83),a(13)),l=a(52),c=a(150),d=a(9),u=a(145),m=a(156),p=a(149),f=a(154),g=a(155),y=a(153),h=a(102),E=a(146),T=a(148),b=a(11),N=a(44);function C(e){var t=Object(r.useState)(e),a=Object(s.a)(t,2),n=a[0],o=a[1];return[n,function(e,t){o(Object(d.a)(Object(d.a)({},n),{},Object(N.a)({},e,t)))}]}var O=a(157),v=a(144),P=Object(u.a)({helperText:{marginBottom:5}});function S(e){var t=P(),a=e.formElem,r=e.handleFieldChange,o=e.handleBlur,i=e.fields;return a.map((function(e,a){var s;switch(e.type){case"text":case"password":s=n.a.createElement(O.a,{key:e+""+a,fullWidth:!0,margin:"dense"},n.a.createElement(b.TextValidator,{type:e.type,label:e.label,ref:e.ref,disabled:e.disabled,onChange:r,onBlur:o(e.ref),name:e.name,id:e.name,value:i[e.id],validators:e.validators,errorMessages:e.errorMessages}),n.a.createElement(v.a,{id:"my-helper-text",className:t.helperText},e.helperText," ",e.isOptional?"":"*"));break;case"date":s=n.a.createElement(O.a,{key:e+""+a,fullWidth:!0,margin:"dense"},n.a.createElement(b.TextValidator,{type:e.type,ref:e.ref,onChange:r,onBlur:o(e.ref),name:e.name,id:e.name,value:i[e.id],validators:e.validators,errorMessages:e.errorMessages}),n.a.createElement(v.a,{id:"my-helper-text",className:t.helperText},e.helperText," ",e.isOptional?"":"*"));break;case"select":s=n.a.createElement(O.a,{key:e+""+a,fullWidth:!0,margin:"dense"},n.a.createElement(b.TextValidator,{select:!0,ref:e.ref,onChange:r,name:e.name,disabled:e.disabled,id:e.name,value:i[e.id],validators:e.validators,errorMessages:e.errorMessages,SelectProps:{native:!0}},Object.keys(e.entries).map((function(t){return n.a.createElement("option",{key:e.entries[t],value:e.entries[t]},t)}))),n.a.createElement(v.a,{id:"my-helper-text",className:t.helperText},e.helperText," ",e.isOptional?"":"*"));break;default:s=null}return s}))}var k={"Select Country":"",US:"US",AD:"AD",AE:"AE",AG:"AG",AI:"AI",AL:"AL",AM:"AM",AN:"AN",AO:"AO",AR:"AR",AT:"AT",AU:"AU",AW:"AW",AZ:"AZ",BA:"BA",BB:"BB",BE:"BE",BF:"BF",BG:"BG",BH:"BH",BI:"BI",BJ:"BJ",BM:"BM",BN:"BN",BO:"BO",BR:"BR",BS:"BS",BT:"BT",BW:"BW",BY:"BY",BZ:"BZ",CA:"CA",CD:"CD",CG:"CG",CH:"CH",CI:"CI",CK:"CK",CL:"CL",CM:"CM",CN:"CN",CO:"CO",CR:"CR",CV:"CV",CY:"CY",CZ:"CZ",DE:"DE",DJ:"DJ",DK:"DK",DM:"DM",DO:"DO",DZ:"DZ",EC:"EC",EE:"EE",EG:"EG",ER:"ER",ES:"ES",ET:"ET",FI:"FI",FJ:"FJ",FK:"FK",FM:"FM",FO:"FO",FR:"FR",GA:"GA",GB:"GB",GD:"GD",GE:"GE",GF:"GF",GI:"GI",GL:"GL",GM:"GM",GN:"GN",GP:"GP",GR:"GR",GT:"GT",GW:"GW",GY:"GY",HK:"HK",HN:"HN",HR:"HR",HU:"HU",ID:"ID",IE:"IE",IL:"IL",IN:"IN",IS:"IS",IT:"IT",JM:"JM",JO:"JO",JP:"JP",KE:"KE",KG:"KG",KH:"KH",KI:"KI",KM:"KM",KN:"KN",KR:"KR",KW:"KW",KY:"KY",KZ:"KZ",LA:"LA",LC:"LC",LI:"LI",LK:"LK",LS:"LS",LT:"LT",LU:"LU",LV:"LV",MA:"MA",MC:"MC",MD:"MD",ME:"ME",MG:"MG",MH:"MH",MK:"MK",ML:"ML",MN:"MN",MQ:"MQ",MR:"MR",MS:"MS",MT:"MT",MU:"MU",MV:"MV",MW:"MW",MX:"MX",MY:"MY",MZ:"MZ",NA:"NA",NC:"NC",NE:"NE",NF:"NF",NG:"NG",NI:"NI",NL:"NL",NO:"NO",NP:"NP",NR:"NR",NU:"NU",NZ:"NZ",OM:"OM",PA:"PA",PE:"PE",PF:"PF",PG:"PG",PH:"PH",PL:"PL",PM:"PM",PN:"PN",PT:"PT",PW:"PW",PY:"PY",QA:"QA",RE:"RE",RO:"RO",RS:"RS",RU:"RU",RW:"RW",SA:"SA",SB:"SB",SC:"SC",SE:"SE",SG:"SG",SH:"SH",SI:"SI",SJ:"SJ",SK:"SK",SL:"SL",SM:"SM",SN:"SN",SO:"SO",SR:"SR",ST:"ST",SV:"SV",SZ:"SZ",TC:"TC",TD:"TD",TG:"TG",TH:"TH",TJ:"TJ",TM:"TM",TN:"TN",TO:"TO",TR:"TR",TT:"TT",TV:"TV",TW:"TW",TZ:"TZ",UA:"UA",UG:"UG",UY:"UY",VA:"VA",VC:"VC",VE:"VE",VG:"VG",VN:"VN",VU:"VU",WF:"WF",WS:"WS",YE:"YE",YT:"YT",ZA:"ZA",ZM:"ZM",ZW:"ZW"},M={"Select Currency":"",USD:"USD",AUD:"AUD",BRL:"BRL",CAD:"CAD",CZK:"CZK",DKK:"DKK",EUR:"EUR",HKD:"HKD",HUF:"HUF",INR:"INR",ILS:"ILS",JPY:"JPY",MYR:"MYR",MXN:"MXN",TWD:"TWD",NZD:"NZD",NOK:"NOK",PHP:"PHP",PLN:"PLN",GBP:"GBP",RUB:"RUB",SGD:"SGD",SEK:"SEK",CHF:"CHF",THB:"THB"},R={"Select Purpose":"",Bonus:"GP0001",Commission:"GP0002",Expense:"GP0003","Non-Taxable Payment":"GP0004",Income:"GP0005",Pension:"GP0006","Charity Donation":"GP0007"},A=a(17),j=a.n(A),q=(a(59),Object(u.a)({button:{marginTop:10,marginRight:10},actionsContainer:{marginBottom:10,marginTop:20},resetContainer:{padding:20},helperText:{marginBottom:5}}));var L=n.a.memo((function(e){var t=e.handleNext,a=e.activeStep,o=e.steps,i=e.handleBack,l=e.appData,c=e.updateAppData,u=e.updateStatus,m=q(),p=Object(r.useRef)(),f=Object(r.useRef)(),g=Object(r.useRef)(),h=Object(r.useRef)(),E=Object(r.useRef)(),T=Object(r.useRef)(),N=Object(r.useRef)(),O=Object(r.useRef)(),v=Object(r.useRef)(),P=Object(r.useRef)(),M=Object(r.useRef)(),R=Object(r.useRef)(),A=[{type:"text",label:"Profile Type",ref:{profileTypeRef:p},name:"profileType",id:"profileType",validators:["required","isNotEmpty"],errorMessages:["Profile Type is required","Profile Type is required"],helperText:"Enter Profile Type"},{type:"text",label:"Client User ID",ref:{clientUserIdRef:f},name:"clientUserId",id:"clientUserId",validators:["required","isNotEmpty"],errorMessages:["Client User ID is required","Client User ID is required"],helperText:"Enter Client User ID"},{type:"text",label:"First Name",ref:{firstNameRef:g},name:"firstName",id:"firstName",validators:["required","isNotEmpty"],errorMessages:["First Name is required","First Name is required"],helperText:"Enter First Name"},{type:"text",label:"Middle Name",ref:{middleNameRef:h},name:"middleName",id:"middleName",isOptional:!0,helperText:"Enter Middle Name"},{type:"text",label:"Last Name",ref:{lastNameRef:E},name:"lastName",id:"lastName",validators:["required","isNotEmpty"],errorMessages:["Last Name is required","Last Name is required"],helperText:"Enter Last Name"},{type:"text",label:"Email",ref:{emailRef:T},name:"email",id:"email",validators:["required","isNotEmpty","isEmail"],errorMessages:["Email is required","Email is required","Enter Valid Email"],helperText:"Enter Email"},{type:"date",label:"Date of Birth",ref:{dateOfBirthRef:N},name:"dateOfBirth",id:"dateOfBirth",validators:["required","isNotEmpty"],errorMessages:["Date of Birth is required","Date of Birth is required"],helperText:"Enter Date of Birth"},{type:"text",label:"Address Line 1",ref:{addressLine1Ref:O},name:"addressLine1",id:"addressLine1",validators:["required","isNotEmpty"],errorMessages:["Address Line 1 is required","Address Line 1 is required"],helperText:"Enter Address Line 1"},{type:"text",label:"Address Line 2",ref:{addressLine2Ref:v},name:"addressLine2",id:"addressLine2",isOptional:!0,helperText:"Enter Address Line 2"},{type:"select",label:"Country",ref:{countryRef:Object(r.useRef)()},entries:k,name:"country",id:"country",validators:["required","isNotEmpty"],errorMessages:["Country is required","Country is required"],helperText:"Select Country"},{type:"text",label:"State",ref:{stateRef:R},name:"stateProvince",id:"stateProvince",validators:["required","isNotEmpty"],errorMessages:["State is required","State is required"],helperText:"Enter State"},{type:"text",label:"City",ref:{cityRef:P},name:"city",id:"city",validators:["required","isNotEmpty"],errorMessages:["City is required","City is required"],helperText:"Enter City"},{type:"text",label:"Postal Code",ref:{postalCodeRef:M},name:"postalCode",id:"postalCode",validators:["required","isNotEmpty"],errorMessages:["Postal Code is required","Postal Code is required"],helperText:"Enter Postal Code"}],L=C(Object(d.a)(Object(d.a)({},{profileType:"",clientUserId:"",firstName:"",middleName:"",lastName:"",email:"",dateOfBirth:"",addressLine1:"",addressLine2:"",city:"",postalCode:"",stateProvince:"",country:""}),l)),I=Object(s.a)(L,2),B=I[0],x=I[1],D=function(e){x(e.target.id,e.target.value)};return Object(r.useEffect)((function(){return b.ValidatorForm.addValidationRule("isNotEmpty",(function(e){return""!==e})),function(){b.ValidatorForm.removeValidationRule("isNotEmpty")}}),[]),n.a.createElement(n.a.Fragment,null,n.a.createElement(b.ValidatorForm,{onSubmit:function(){!function(){j.a.LoadingOverlay("show",{image:"",text:"Creating User...",textClass:"loadingText"}),u([{message:"Creating User",type:"info"}]);var e="curl --location --request POST 'https://api.sandbox.hyperwallet.com/rest/v3/users' \n--header 'Authorization: Basic <username>:<password>' \n--header 'Content-Type: application/json' \n--header 'Accept: application/json' \n--data-raw '{\n      \"profileType\": \"".concat(B.profileType,'",\n      "clientUserId": "').concat(B.clientUserId,'",\n      "firstName": "').concat(B.firstName,'",\n      "middleName": "').concat(B.middleName,'",\n      "lastName": "').concat(B.lastName,'",\n      "email": "').concat(B.email,'",\n      "dateOfBirth": "').concat(B.dateOfBirth,'",\n      "addressLine1": "').concat(B.addressLine1,'",\n      "addressLine2": "').concat(B.addressLine2,'",\n      "city": "').concat(B.city,'",\n      "country": "').concat(B.country,'",\n      "stateProvince": "').concat(B.stateProvince,'",\n      "postalCode": "').concat(B.postalCode,'",\n      "programToken": "').concat(B.programToken,"\"\n  }'\n    ");u([{message:"Create User API Request....",type:"request",req:e}]);var a="";fetch("/hw-create-user",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(Object(d.a)(Object(d.a)({},l),B))}).then((function(e){return e.json()})).then((function(e){if(e.error)return console.log("error in creating user"),console.log(e.error),j.a.LoadingOverlay("hide"),alert("Error Occurred. Check Playground Status"),void u([{message:"Create User API Error...",type:"request",req:JSON.stringify(e.error,null,2),status:"error"}]);console.log("Created user"),u([{message:"User created Successfully...",type:"request",req:JSON.stringify(e.data,null,2)}]),e.data.token&&(a=e.data.token),setTimeout((function(){t()}),1e3)})).catch((function(e){console.log("error in creating user"),console.log(e),j.a.LoadingOverlay("hide"),alert("Error Occurred. Check Playground Status"),u([{message:"Create User API Error...",type:"request",req:JSON.stringify(e,null,2),status:"error"}])})).finally((function(){c(Object(d.a)(Object(d.a)({},B),{},{userToken:a})),j.a.LoadingOverlay("hide")}))}()},onError:function(e){return console.log(e)}},n.a.createElement(S,{formElem:A,handleBlur:function(e){return function(t){e.current.validate(t.target.value),D(t)}},handleFieldChange:D,fields:B}),n.a.createElement("div",{className:m.actionsContainer},n.a.createElement(y.a,{disabled:0===a,onClick:i,className:m.button,variant:"contained",color:"secondary"},"Back"),n.a.createElement(y.a,{type:"submit",variant:"contained",color:"primary",className:m.button},a===o.length-1?"Finish":"Create"))))})),I=Object(u.a)({root:{width:"100%"},button:{marginTop:10,marginRight:10},actionsContainer:{marginBottom:10,marginTop:20},resetContainer:{padding:20}});var B=n.a.memo((function(e){var t=e.handleNext,a=e.activeStep,o=e.steps,i=e.handleBack,l=e.appData,c=e.updateAppData,u=e.updateStatus,m=I(),p=[{type:"text",label:"API Username",ref:{usernameRef:Object(r.useRef)()},name:"username",id:"username",validators:["required","isNotEmpty"],errorMessages:["API Username is required","API Username is required"],helperText:"Enter API Username"},{type:"password",label:"API Password",ref:{passwordRef:Object(r.useRef)()},name:"password",id:"password",validators:["required","isNotEmpty"],errorMessages:["API Password is required","API Password is required"],helperText:"Enter API Password"},{type:"text",label:"Program Token",ref:{programTokenRef:Object(r.useRef)()},name:"programToken",id:"programToken",validators:["required","isNotEmpty"],errorMessages:["Program Token is required","Program Token is required"],helperText:"Enter Program Token"}],f=C(Object(d.a)(Object(d.a)({},{username:"",password:"",programToken:""}),l)),g=Object(s.a)(f,2),h=g[0],E=g[1],T=function(e){E(e.target.id,e.target.value)};return Object(r.useEffect)((function(){return b.ValidatorForm.addValidationRule("isNotEmpty",(function(e){return""!==e})),function(){b.ValidatorForm.removeValidationRule("isNotEmpty")}}),[]),n.a.createElement(b.ValidatorForm,{onSubmit:function(){c(h),u([{message:"Credentials Loaded",type:"info"}]),t()},onError:function(e){return console.log(e)}},n.a.createElement(S,{formElem:p,handleBlur:function(e){return function(t){e.current.validate(t.target.value),T(t)}},handleFieldChange:T,fields:h}),n.a.createElement("div",{className:m.actionsContainer},n.a.createElement(y.a,{disabled:0===a,onClick:i,className:m.button,variant:"contained",color:"secondary"},"Back"),n.a.createElement(y.a,{type:"submit",variant:"contained",color:"primary",className:m.button},a===o.length-1?"Finish":"Next")))})),x=a(63),D=a(64),U=a(47),G=a(67),F=a(66),w=a(158),K=a(147),V=Object(u.a)({backdrop:{zIndex:10001,color:"#fff"},msg:{textTransform:"uppercase",padding:2}});function J(e){var t=V(),a=e.obj;return n.a.createElement("div",null,n.a.createElement(w.a,{className:t.backdrop,open:a.open},n.a.createElement(E.a,{className:t.msg},a.message),n.a.createElement(K.a,{color:"primary"})))}a(95);var H={open:!0,message:"Loading Drop-in UI..."},W=function(e){Object(G.a)(a,e);var t=Object(F.a)(a);function a(){var e;Object(x.a)(this,a);for(var r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];return(e=t.call.apply(t,[this].concat(n))).state={isSdkReady:!1,isUILoaded:!1,isError:!1},e._addPaypalSdk=function(){var t=e.props,a=t.environment,r=t.onComplete,n=t.onError,o=t.appData,i=document.createElement("script");i.type="text/javascript",i.src="https://".concat(a,".hyperwallet.com/rest/widgets/transfer-methods/").concat(o.userToken,"/en.min.js"),i.async=!0,i.onload=function(){e.setState({isSdkReady:!0}),console.log("profile type ",o.profileType),window.HWWidgets.initialize(e._getAuthenticationToken),window.HWWidgets.transferMethods.configure({template:"plain",el:document.getElementById("TransferMethodUI"),profile:{profileType:o.profileType,firstName:o.firstName,middleName:o.middleName,lastName:o.lastName,addressLine1:o.addressLine1,addressLine2:o.addressLine2,country:o.country,stateProvince:o.stateProvince,city:o.city,postalCode:o.postalCode,email:o.email},onComplete:function(e,t){r(e,t)}}).display(function(){var e=this;setTimeout((function(){e.setState({isUILoaded:!0})}),7e3)}.bind(Object(U.a)(e)))},i.onerror=function(){e.setState({isError:!0}),n()},document.body.appendChild(i)},e._getAuthenticationToken=function(t){console.log("get auth token"),H.message="Creating Transfer method...",e.props.getAuthenticationToken(t)},e}return Object(D.a)(a,[{key:"shouldComponentUpdate",value:function(e,t){return e.appData.userToken!==this.props.appData.userToken||t.isSdkReady!==this.state.isSdkReady||t.isUILoaded!==this.state.isUILoaded||t.isError!==this.state.isError}},{key:"componentDidMount",value:function(){this._addPaypalSdk()}},{key:"render",value:function(){return n.a.createElement("div",{style:{padding:20}},this.state.isUILoaded?null:n.a.createElement(J,{obj:H}),n.a.createElement("div",{id:"TransferMethodUI"}))}}]),a}(n.a.Component),Z=Object(u.a)({root:{width:"100%"},button:{marginTop:10,marginRight:10},actionsContainer:{marginBottom:10,marginTop:20},resetContainer:{padding:20}});var Y=n.a.memo((function(e){var t=e.handleNext,a=e.activeStep,o=e.handleBack,i=e.appData,s=e.updateAppData,l=e.updateStatus,c=function(e,t){return[Object(r.useCallback)((function(a){console.log("Auth callback"),e([{message:"Fetching Auth Token",type:"info"}]);var r='curl -X "POST" "https://api.sandbox.hyperwallet.com/rest/v3/users/'.concat(t.userToken,"/authentication-token\"  \n        --header 'Authorization: Basic <username>:<password>' \n        --header 'Content-Type: application/json' \n        --header 'Accept: application/json' \n        ");e([{message:"Auth Token API Request....",type:"request",req:r}]),fetch("/hw-auth-token",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({username:t.username,password:t.password,userToken:t.userToken})}).then((function(e){return e.json()})).then((function(t){if(t.error)return console.log("error in getting auth token"),console.log(t.error),void e([{message:"Fetch Auth Token API Error...",type:"request",req:JSON.stringify(t.error,null,2),status:"error"}]);console.log("Got auth token"),console.log(" Token "+t.data.value),e([{message:"Received auth token...",type:"request",req:JSON.stringify(t.data,null,2)}]),a(t.data.value)})).catch((function(t){console.log("error in getting auth token"),console.log(t),e([{message:"Fetch Auth Token API Error...",type:"request",req:JSON.stringify(t,null,2),status:"error"}])})).finally((function(){}))}),[t.userToken,t.username,t.password,e])]}(l,i)[0],d=Object(r.useCallback)((function(e,a){console.log("Transfer method created"),console.log(e,a),l([{message:"Transfer method has been created",type:"info"}]),s({destinationToken:e.token,currency:e.transferMethodCurrency}),l([{message:"Transfer Method API Response...",type:"request",req:JSON.stringify(e,null,2)}]),setTimeout((function(){l([{message:"You can make a payment to this user now...",type:"info"}]),t()}),1e3)}),[t,s,l]),u=Object(r.useCallback)((function(){console.log("error "),l([{message:"Error occurred in loading Drop-in UI",type:"info"}])}),[l]),m=Z(),p={profileType:i.profileType,firstName:i.firstName,middleName:i.middleName,lastName:i.lastName,addressLine1:i.addressLine1,addressLine2:i.addressLine2,country:i.country,stateProvince:i.stateProvince,city:i.city,postalCode:i.postalCode,email:i.email,userToken:i.userToken};return n.a.createElement(n.a.Fragment,null,n.a.createElement(W,{environment:"sandbox",getAuthenticationToken:c,onComplete:d,onError:u,appData:p,template:"plain"}),n.a.createElement("div",{className:m.actionsContainer},n.a.createElement(y.a,{variant:"contained",color:"secondary",disabled:0===a,onClick:o,className:m.button},"Back")))})),z=Object(u.a)({button:{marginTop:10,marginRight:10},actionsContainer:{marginBottom:10,marginTop:20},resetContainer:{padding:20},helperText:{marginBottom:5}});var X=n.a.memo((function(e){var t=e.handleNext,a=e.activeStep,o=e.steps,i=e.handleBack,l=e.appData,c=e.updateStatus,u=e.updateAppData,m=z(),p=Object(r.useRef)(),f=Object(r.useRef)(),g=Object(r.useRef)(),h=Object(r.useRef)(),E=Object(r.useRef)(),T=Object(r.useRef)(),N=[{type:"text",label:"Program Token",ref:{programTokenRef:p},disabled:!0,name:"programToken",id:"programToken",validators:["required","isNotEmpty"],errorMessages:["Program Token is required","Program Token is required"],helperText:"Enter Program Token"},{type:"text",label:"Destination Token",ref:{destinationTokenRef:f},disabled:!0,name:"destinationToken",id:"destinationToken",validators:["required","isNotEmpty"],errorMessages:["Destination Token is required","Destination Token is required"],helperText:"Enter Destination Token"},{type:"text",label:"Client Payment ID",ref:{clientPaymentIdRef:g},disabled:!1,name:"clientPaymentId",id:"clientPaymentId",validators:["required","isNotEmpty"],errorMessages:["Client Payment ID is required","Client Payment ID is required"],helperText:"Enter Client Payment ID"},{type:"text",label:"Amount",ref:{amountRef:E},name:"amount",id:"amount",validators:["required","isNotEmpty","isNumber","isLessThan"],errorMessages:["Amount is required","Amount is required","Amount must be a Number","Amount exceeded approved limit"],helperText:"Enter Amount"},{type:"select",label:"Currency",ref:{currencyRef:h},disabled:!0,entries:M,name:"currency",id:"currency",validators:["required","isNotEmpty"],errorMessages:["Currency is required","Currency is required"],helperText:"Select Currency"},{type:"select",label:"Purpose",ref:{purposeRef:T},entries:R,name:"purpose",id:"purpose",validators:["required","isNotEmpty"],errorMessages:["Purpose is required","Purpose is required"],helperText:"Select Purpose"}],O=C(Object(d.a)(Object(d.a)({},{programToken:"",destinationToken:"",clientPaymentId:"",currency:"",amount:"",purpose:""}),l)),v=Object(s.a)(O,2),P=v[0],k=v[1],A=function(e){k(e.target.id,e.target.value)};return Object(r.useEffect)((function(){return b.ValidatorForm.addValidationRule("isNotEmpty",(function(e){return""!==e})),b.ValidatorForm.addValidationRule("isLessThan",(function(e){return!(parseInt(e)>100)})),function(){b.ValidatorForm.removeValidationRule("isNotEmpty"),b.ValidatorForm.removeValidationRule("isLessThan")}}),[]),n.a.createElement(n.a.Fragment,null,n.a.createElement(b.ValidatorForm,{onSubmit:function(){!function(){j.a.LoadingOverlay("show",{image:"",text:"Making Payment...",textClass:"loadingText"}),c([{message:"Calling Make Payment API....",type:"info"}]);var e="curl --location --request POST 'https://api.sandbox.hyperwallet.com/rest/v3/payments' \n--header 'Authorization: Basic <username>:<password>' \n--header 'Content-Type: application/json' \n--header 'Accept: application/json' \n--data-raw '{\n      \"programToken\": \"".concat(P.programToken,'",\n      "destinationToken": "').concat(P.destinationToken,'",\n      "clientPaymentId": "').concat(P.clientPaymentId,'",\n      "amount": "').concat(P.amount,'",\n      "currency": "').concat(P.currency,'",\n      "purpose": "').concat(P.purpose,"\"\n  }'\n    ");c([{message:"Make Payment Request....",type:"request",req:e}]),fetch("/hw-make-payment",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(Object(d.a)(Object(d.a)({},l),P))}).then((function(e){return e.json()})).then((function(e){if(e.error)return console.log("error in making payment"),console.log(e.error),alert("Error Occurred. Check Playground Status"),void c([{message:"Make Payment API Error...",type:"request",req:JSON.stringify(e.error,null,2),status:"error"}]);console.log("Payment Successful"),alert("Payment Successful"),c([{message:"Payment successfull...",type:"request",req:JSON.stringify(e.data,null,2)}]),setTimeout((function(){j.a.LoadingOverlay("hide"),t()}),2e3)})).catch((function(e){console.log("error in making payment"),console.log(e),alert("Error Occurred. Check Playground Status"),c([{message:"Make Payment API Error...",type:"request",req:JSON.stringify(e,null,2),status:"error"}]),j.a.LoadingOverlay("hide")})).finally((function(){u(Object(d.a)({},P)),j.a.LoadingOverlay("hide")}))}()},onError:function(e){return console.log(e)}},n.a.createElement(S,{formElem:N,handleBlur:function(e){return function(t){e.current.validate(t.target.value),A(t)}},handleFieldChange:A,fields:P}),n.a.createElement("div",{className:m.actionsContainer},n.a.createElement(y.a,{disabled:0===a,onClick:i,className:m.button,variant:"contained",color:"secondary"},"Back"),n.a.createElement(y.a,{type:"submit",variant:"contained",color:"primary",className:m.button},a===o.length-1?"Make Payment":null))))})),Q=a(39),_=a(65),$=new(a.n(_).a),ee={username:"restapiuser@33086521615",password:"Test@123456",programToken:"prg-a4f57e52-a848-42bd-9b53-250102c4eac2",profileType:"INDIVIDUAL",clientUserId:"".concat(Object(Q.uuid)()),firstName:"John",middleName:"",lastName:"Doe",email:$.email({domain:"test.com"}),dateOfBirth:"1990-03-03",addressLine1:"1st Lane street",addressLine2:"",city:"San Jose",postalCode:"65001",stateProvince:"California",country:"US",userToken:"",destinationToken:"",clientPaymentId:"".concat(Object(Q.uuid)()),amount:"10",currency:"USD",purpose:"GP0005"},te=Object(u.a)({root:{marginTop:0},button:{marginTop:30,marginRight:10},actionsContainer:{marginBottom:10},resetContainer:{padding:20},grid:{marginTop:20}});var ae=n.a.memo((function(e){var t=Object(r.useState)(ee),a=Object(s.a)(t,2),o=a[0],i=a[1],l=e.updateStatus,u=e.resetStatus,b=te(),N=Object(r.useState)(0),C=Object(s.a)(N,2),O=C[0],v=C[1],P=[{title:"Credentials Section",component:B},{title:"Create User/Payee",component:L},{title:"Create Transfer",component:Y},{title:"Make Payment",component:X}],S=Object(r.useCallback)((function(e){i((function(t){return Object(d.a)(Object(d.a)({},t),e)}))}),[i]),k=Object(r.useCallback)((function(){v((function(e){return e+1}))}),[v]),M=Object(r.useCallback)((function(){v((function(e){return e-1}))}),[v]),R=Object(r.useCallback)((function(){i(Object(d.a)(Object(d.a)({},ee),{},{clientUserId:"".concat(Object(Q.uuid)()),email:$.email({domain:"test.com"}),clientPaymentId:"".concat(Object(Q.uuid)())})),v(0),u()}),[v,u]),A=function(e){var t=e.obj.component;return n.a.createElement(n.a.Fragment,null,n.a.createElement(g.a,e,n.a.createElement("div",null,n.a.createElement(t,{appData:o,activeStep:O,handleNext:k,steps:P,updateAppData:S,handleBack:M,updateStatus:l}),e.children)))};return n.a.createElement(T.a,{maxWidth:"sm",className:b.root},n.a.createElement(m.a,{activeStep:O,orientation:"vertical"},P.map((function(e,t){return n.a.createElement(p.a,{key:e.title},n.a.createElement(f.a,null,n.a.createElement("h3",null,e.title)),n.a.createElement(A,{obj:e}))}))),O===P.length&&n.a.createElement(n.a.Fragment,null,n.a.createElement(h.a,{square:!0,elevation:3,className:b.resetContainer},n.a.createElement(E.a,{variant:"h5",color:"primary",gutterBottom:!0},"Payment Successful. Details below"),n.a.createElement(c.a,{container:!0,spacing:3,className:b.grid},n.a.createElement(c.a,{item:!0,xs:6},n.a.createElement(E.a,{variant:"h6"},"Email ")),n.a.createElement(c.a,{item:!0,xs:6},n.a.createElement(E.a,{variant:"h6"},o.email," ")),n.a.createElement(c.a,{item:!0,xs:6},n.a.createElement(E.a,{variant:"h6"},"Amount ")),n.a.createElement(c.a,{item:!0,xs:6},n.a.createElement(E.a,{variant:"h6"},o.amount," ")),n.a.createElement(c.a,{item:!0,xs:6},n.a.createElement(E.a,{variant:"h6"},"Currency ")),n.a.createElement(c.a,{item:!0,xs:6},n.a.createElement(E.a,{variant:"h6"},o.currency," ")))),n.a.createElement(y.a,{onClick:M,className:b.button,variant:"contained",color:"secondary"},"Back"),n.a.createElement(y.a,{onClick:R,className:b.button,variant:"contained",color:"primary"},"Restart Flow")))})),re=a(151),ne=a(152),oe=Object(u.a)({button:{marginTop:10,marginRight:10},actionsContainer:{marginBottom:10},parent:{marginTop:25},info:{color:"#4dabf5",paddingLeft:20,marginTop:20},req:{color:"green",paddingLeft:20,marginTop:20},reqMessage:{color:"green",whiteSpace:"break-spaces",paddingLeft:20,marginTop:20},error:{color:"#f6685e",paddingLeft:20,marginTop:20},errorMessage:{color:"red",whiteSpace:"break-spaces",paddingLeft:20,marginTop:20},statusheight:{height:"85vh",paddingTop:20,overflowY:"auto",background:"black"}});function ie(e){var t=oe(),a=e.status,r=void 0===a?[]:a,o=r.map((function(e,a){var o=e.req,i=e.type,s=e.status,l=e.message;switch(i){case"info":return n.a.createElement("p",{className:t.info,key:l},r.length-a," - ",l);case"request":var c="error"===s?t.error:t.info,d="error"===s?t.errorMessage:t.reqMessage;return n.a.createElement("div",{key:l},n.a.createElement("span",{className:c},r.length-a," - ",l),n.a.createElement("pre",{className:d},o));default:return null}}));return n.a.createElement(T.a,{fixed:!0,className:t.parent},n.a.createElement(re.a,{position:"static"},n.a.createElement(ne.a,{variant:"dense"},n.a.createElement(E.a,{variant:"h6",color:"inherit"},"Playground Status"))),n.a.createElement(h.a,{square:!0,elevation:1,className:t.statusheight},o))}var se=function(e,t){return t?[].concat(Object(l.a)(t),Object(l.a)(e)):[]};function le(){var e=Object(r.useReducer)(se,[]),t=Object(s.a)(e,2),a=t[0],o=t[1],i=Object(r.useCallback)((function(){o(null)}),[o]);return Object(r.useEffect)((function(){return window.scrollTo(0,0),o([{message:"Enter Credentials",type:"info"}]),function(){}}),[o]),n.a.createElement(c.a,{container:!0,spacing:0},n.a.createElement(c.a,{item:!0,xs:12,sm:12,md:6,lg:6,xl:6},n.a.createElement(ae,{updateStatus:o,resetStatus:i})),n.a.createElement(c.a,{item:!0,xs:12,sm:12,md:6,lg:6,xl:6},n.a.createElement(ie,{status:a})))}i.a.render(n.a.createElement(r.Suspense,{fallback:n.a.createElement("h1",null,"Loading...")},n.a.createElement(le,null)),document.getElementById("root"))},78:function(e,t,a){e.exports=a(100)},83:function(e,t,a){},95:function(e,t,a){}},[[78,1,2]]]);
//# sourceMappingURL=main.71e5bba4.chunk.js.map