import React from "react";
import Loader from "./Loader";
import "./DropIn.css";

let obj = { open: true, message: "Loading Transfer Method Drop-in UI..." };

export default class HyperwalletTransferMethodDropIn extends React.Component {
  state = {
    isSdkReady: false,
    isUILoaded: false,
    isError: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.appData.userToken !== this.props.appData.userToken ||
      nextState.isSdkReady !== this.state.isSdkReady ||
      nextState.isUILoaded !== this.state.isUILoaded ||
      nextState.isError !== this.state.isError
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this._addPaypalSdk();
  }

  render() {
    return (
      <div style={{ padding: 20 }}>
        {this.state.isUILoaded ? null : <Loader obj={obj}></Loader>}
        <div id="TransferMethodUI" />
      </div>
    );
  }

  _addPaypalSdk = () => {
    const { environment, onComplete, onError, appData } = this.props;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://${environment}.hyperwallet.com/rest/widgets/transfer-methods/${appData.userToken}/en.min.js`;
    script.async = true;
    script.onload = () => {
      this.setState({ isSdkReady: true });

      console.log("profile type ", appData.profileType);

      window.HWWidgets.initialize(this._getAuthenticationToken);

      window.HWWidgets.transferMethods
        .configure({
          template: "plain",
          el: document.getElementById("TransferMethodUI"),
          // transferMethodConfiguration: {
          //   country: appData.country
          // },
          profile: {
            profileType: appData.profileType,
            firstName: appData.firstName,
            middleName: appData.middleName,
            lastName: appData.lastName,
            addressLine1: appData.addressLine1,
            addressLine2: appData.addressLine2,
            country: appData.country,
            stateProvince: appData.stateProvince,
            city: appData.city,
            postalCode: appData.postalCode,
            email: appData.email,
          },
          
          onComplete: function (trmObject, completionResult) {
            onComplete(trmObject, completionResult);
          },
        })
        .display(
          function () {
            // this is a callback event called when display is done
            setTimeout(() => {
              this.setState({ isUILoaded: true });
            }, 7000);
          }.bind(this)
        );
    };
    script.onerror = () => {
      this.setState({ isError: true });
      onError();
    };

    document.body.appendChild(script);
  };

  _getAuthenticationToken = (callback) => {
    console.log("get auth token");
    obj.message = "Creating Transfer method...";
    this.props.getAuthenticationToken(callback);
  };
}
