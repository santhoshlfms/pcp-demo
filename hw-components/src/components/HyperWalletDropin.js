import React from 'react';
import Loader from "./Loader"
import "./DropIn.css"

export default class HyperwalletTranferMethodDropIn extends React.PureComponent {
    
    state = {
      isSdkReady: false,
      isUILoaded: false,
      isError: false
    }
  
    componentDidMount() {
      this._addPaypalSdk()
    }
  
    render() {
      if (this.state.isSdkReady) {
        window.HWWidgets.initialize(this._getAuthenticationToken)
      }
  
      return (
        <div style={{padding: 20}}>
          {this.state.isUILoaded ? null: <Loader open={true}></Loader>
        }
          <div id='TransferMethodUI' />
        </div>
      )
    }
  
    _addPaypalSdk = () => {
      const {
        userToken,
        environment,
        onComplete,
        onError
      } = this.props
  
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://${environment}.hyperwallet.com/rest/widgets/transfer-methods/${userToken}/en.min.js`
      script.async = true
      script.onload = () => {
        this.setState({ isSdkReady: true })
        window.HWWidgets.transferMethods.configure({
          'template': 'plain',
          'el': document.getElementById('TransferMethodUI'),
          'onComplete': function (trmObject, completionResult) {
            onComplete(trmObject, completionResult)
          }
        }).display(function () {
            console.log("Dispay")
          // this is a callback event called when display is done
          setTimeout(()=>this.setState({ isUILoaded: true }) ,4000);
        }.bind(this))
      }
      script.onerror = () => {
        this.setState({isError: true})
        onError()
      }
  
      document.body.appendChild(script)
    }
  
    _getAuthenticationToken = (callback) => {
        console.log("getAuth")
       this.props.getAuthenticationToken(callback)
    }
  }