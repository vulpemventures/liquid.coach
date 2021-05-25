'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var ReactDOM = _interopDefault(require('react-dom'));
var liquidjsLib = require('liquidjs-lib');
var bip39 = require('bip39');
var bip32 = require('bip32');
var copyLite = require('copy-lite');
var b58 = _interopDefault(require('bs58check'));
var reactHookForm = require('react-hook-form');
var useGlobalStorage = _interopDefault(require('use-global-storage'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var Layout = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Layout, _React$Component);

  function Layout() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Layout.prototype;

  _proto.changeUrl = function changeUrl() {
    var errorMsg = 'Not valid endpoint';
    var url = prompt('Custom Electrs REST endpoint to use');

    try {
      if (!url || typeof url != 'string' || url.length <= 0) {
        throw new Error();
      }

      new URL(url);
      if (url.includes('localhost')) url = "http://" + url;
      this.props.onExplorer(url);
    } catch (ignore) {
      alert(errorMsg);
    }
  };

  _proto.render = function render() {
    var _this = this;

    var withCleanButton = this.props.onClean ? React__default.createElement("span", {
      className: "button is-pulled-right",
      onClick: this.props.onClean
    }, "Reset") : null;
    var withExplorer = this.props.showExplorer ? React__default.createElement("span", {
      className: "button is-pulled-right",
      onClick: function onClick() {
        return _this.changeUrl();
      }
    }, "Explorer") : null;
    var withTitle = this.props.title ? React__default.createElement("section", {
      className: "hero is-light"
    }, React__default.createElement("div", {
      className: "hero-body"
    }, React__default.createElement("div", {
      className: "container"
    }, React__default.createElement("div", {
      className: "columns"
    }, React__default.createElement("div", {
      className: "column is-8 is-desktop is-offset-2 has-text-centered"
    }, React__default.createElement("h1", {
      className: "title"
    }, this.props.title)), React__default.createElement("div", {
      className: "column is-1 has-text-centered"
    }, withExplorer), React__default.createElement("div", {
      className: "column is-1 has-text-centered"
    }, withCleanButton))))) : null;
    return React__default.createElement("div", {
      style: {
        minHeight: '100vh',
        position: 'relative'
      }
    }, withTitle, React__default.createElement("div", {
      style: {
        paddingTop: '5rem',
        paddingRight: '1rem',
        paddingLeft: '1rem',
        paddingBottom: '5rem'
      }
    }, this.props.children), React__default.createElement("footer", {
      style: {
        position: 'absolute',
        bottom: 0,
        height: '5rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, React__default.createElement("p", null, React__default.createElement("a", {
      href: "https://vulpem.com",
      target: "_blank",
      rel: "noopener noreferrer"
    }, "\xA9 Vulpem Ventures OU"))));
  };

  return Layout;
}(React__default.Component);

var InputWithCopy = function InputWithCopy(props) {
  var _useState = React.useState(''),
      copySuccess = _useState[0],
      setCopySuccess = _useState[1];

  var copy = function copy() {
    copyLite.copyToClipboard(props.value);
    setCopySuccess('👌 Copied!');
  };

  return React__default.createElement("div", {
    className: "notification " + (props.bgColor || 'is-success')
  }, React__default.createElement("button", {
    className: "button is-pulled-right",
    onClick: copy
  }, "Copy"), React__default.createElement("p", {
    className: "subtitle"
  }, copySuccess), React__default.createElement("br", null), React__default.createElement("p", {
    className: "subtitle"
  }, props.value));
};

// This has benne taken from https://github.com/Casa/xpub-converter/blob/master/js/xpubConvert.js
var prefixes = /*#__PURE__*/new Map([['xpub', '0488b21e'], ['ypub', '049d7cb2'], ['Ypub', '0295b43f'], ['zpub', '04b24746'], ['Zpub', '02aa7ed3'], ['tpub', '043587cf'], ['upub', '044a5262'], ['Upub', '024289ef'], ['vpub', '045f1cf6'], ['Vpub', '02575483']]);
/*
 * This function takes an extended public key (with any version bytes, it doesn't need to be an xpub)
 * and converts it to an extended public key formatted with the desired version bytes
 * @param xpub: an extended public key in base58 format. Example: xpub6CpihtY9HVc1jNJWCiXnRbpXm5BgVNKqZMsM4XqpDcQigJr6AHNwaForLZ3kkisDcRoaXSUms6DJNhxFtQGeZfWAQWCZQe1esNetx5Wqe4M
 * @param targetFormat: a string representing the desired prefix; must exist in the "prefixes" mapping defined above. Example: Zpub
 */

function changeVersionBytes(xpub, targetFormat) {
  if (!prefixes.has(targetFormat)) {
    return 'Invalid target version';
  } // trim whitespace


  xpub = xpub.trim();

  try {
    var data = b58.decode(xpub);
    data = data.slice(4);
    data = Buffer.concat([Buffer.from(prefixes.get(targetFormat), 'hex'), data]);
    return b58.encode(data);
  } catch (err) {
    throw new Error("Invalid extended public key! Please double check that you didn't accidentally paste extra data.");
  }
}
function isValidAddress(value, network) {
  try {
    liquidjsLib.address.toOutputScript(value, network);
  } catch (e) {
    return false;
  }

  return true;
}
function isValidBlindingKey(value) {
  try {
    liquidjsLib.ECPair.fromPrivateKey(Buffer.from(value, 'hex'));
    return true;
  } catch (e) {
    return false;
  }
}

function isValidConfidentialAddress(value) {
  try {
    liquidjsLib.address.fromConfidential(value);
    return true;
  } catch (e) {
    return false;
  }
}

function validate(value, type, network) {
  if (network === void 0) {
    network = liquidjsLib.networks.regtest;
  }

  switch (type) {
    case 'asset':
      if (value.length !== 64) {
        return false;
      }

      return true;

    case 'address':
      try {
        if (isValidConfidentialAddress(value)) throw new Error('Unconfidential only');
        if (value !== 'LBTC_FEES') liquidjsLib.address.toOutputScript(value, network);
      } catch (ignore) {
        console.error(ignore);
        return false;
      }

      return true;

    case 'amount':
      try {
        liquidjsLib.confidential.satoshiToConfidentialValue(Number(value));
      } catch (ignore) {
        return false;
      }

      return true;

    default:
      return false;
  }
}

/**
 * Shortens a long string to a human-friendly abbreviated one.
 *
 * A string like 2ed982c220fed6c9374e63804670fc16bd481b8f provides no more value to a human than
 * a shortened version like 2ed9...1b8f. However, screen real estate is precious, especially to real users
 * and not developers with high-res monitors.
 */

function toHumanFriendlyString(x) {
  var previewLength = 4;
  var previewPrefix = x.substring(0, previewLength);
  var previewSuffix = x.substring(x.length - previewLength);
  return previewPrefix + "..." + previewSuffix;
}
function fromSatoshi(x) {
  return Math.floor(x) / Math.pow(10, 8);
}
function toAssetHash(x) {
  var withoutFirstByte = x.slice(1);
  return withoutFirstByte.reverse().toString('hex');
}

var Load = function Load(props) {
  var _useState = React.useState(false),
      isLiquid = _useState[0],
      setIsLiquid = _useState[1];

  var _useState2 = React.useState(false),
      showConfirm = _useState2[0],
      setShowConfirm = _useState2[1];

  var _useState3 = React.useState(false),
      showBlinding = _useState3[0],
      setShowBlinding = _useState3[1];

  var _useState4 = React.useState(''),
      blindingPubkey = _useState4[0],
      setBlindingPubkey = _useState4[1];

  var pubkey = React.useRef(null);
  var blindingPrivKey = React.useRef(null);
  var networkString = isLiquid ? 'liquid' : 'regtest';
  var currentNetwork = liquidjsLib.networks[networkString];

  var onAddressInputChange = function onAddressInputChange(value) {
    try {
      var _address$fromConfiden = liquidjsLib.address.fromConfidential(value),
          blindingKey = _address$fromConfiden.blindingKey;

      setShowBlinding(true);
      setBlindingPubkey(blindingKey.toString('hex'));
    } catch (ignore) {
      setShowBlinding(false);
    }
  };

  var checkInput = function checkInput() {
    if (!pubkey || !pubkey.current) return alert('Missing address');
    var pub = pubkey.current.value;
    if (!isValidAddress(pub, currentNetwork)) return alert('Given address is not a valid segwit address');

    if (showBlinding) {
      if (!blindingPrivKey || !blindingPrivKey.current) return alert('Missing blinding key');
      var blinding = blindingPrivKey.current.value;
      if (!isValidBlindingKey(blinding)) return alert('Given blinding key is not valid');
      var blindKeyPair = liquidjsLib.ECPair.fromPrivateKey(Buffer.from(blinding, 'hex'));
      if (blindKeyPair.publicKey.toString('hex') !== blindingPubkey) return alert('Given blinding private key do not corresponds to the given address');
      return props.onLoad(pub, networkString, blinding);
    }

    props.onLoad(pub, networkString);
  };

  var confirmModal = function confirmModal() {
    var mnemonic = bip39.generateMnemonic();
    if (!bip39.validateMnemonic(mnemonic)) return alert('Something went wrong');
    var seed = bip39.mnemonicToSeedSync(mnemonic);
    var root = bip32.fromSeed(seed, currentNetwork);
    var xpub = root.toBase58();
    var version = isLiquid ? 'zpub' : 'vpub';
    var extPub = changeVersionBytes(xpub, version);
    return React__default.createElement("div", {
      className: "modal is-active"
    }, React__default.createElement("div", {
      className: "modal-background"
    }), React__default.createElement("div", {
      className: "modal-card"
    }, React__default.createElement("header", {
      className: "modal-card-head"
    }, React__default.createElement("p", {
      className: "modal-card-title"
    }, "Liquid ", "" + (!isLiquid ? 'regtest' : ''), " wallet")), React__default.createElement("section", {
      className: "modal-card-body"
    }, React__default.createElement("label", {
      className: "label"
    }, "Mnemonic"), React__default.createElement("p", {
      className: "subtitle is-6"
    }, "You will never see it again. You may want to write it down"), React__default.createElement(InputWithCopy, {
      value: mnemonic,
      bgColor: "is-info is-light"
    }), React__default.createElement("p", {
      className: "subtitle is-6"
    }, "The derivation path used for generating the address is", ' ', React__default.createElement("b", null, "m/84'/0'/0'/0")), React__default.createElement("label", {
      className: "label"
    }, "Extended public key"), React__default.createElement(InputWithCopy, {
      value: extPub,
      bgColor: "is-info is-light"
    })), React__default.createElement("footer", {
      className: "modal-card-foot"
    }, React__default.createElement("button", {
      className: "button is-primary",
      onClick: function onClick() {
        var node = root.derivePath("m/84'/0'/0'/0");
        var wpkh = liquidjsLib.payments.p2wpkh({
          pubkey: node.publicKey,
          network: currentNetwork
        });
        props.onLoad(wpkh.address, networkString);
      }
    }, "Confirm"), React__default.createElement("button", {
      className: "button",
      onClick: function onClick() {
        return setShowConfirm(false);
      }
    }, "Cancel"))));
  };

  return React__default.createElement("div", {
    className: "column has-text-centered is-10-mobile is-6-desktop is-offset-1-mobile is-offset-3-desktop"
  }, React__default.createElement("div", {
    className: "field",
    onClick: function onClick() {
      return setIsLiquid(!isLiquid);
    }
  }, React__default.createElement("input", {
    type: "checkbox",
    className: "switch is-medium is-link",
    checked: isLiquid,
    onChange: function onChange() {}
  }), React__default.createElement("label", {
    className: "label"
  }, "" + (isLiquid ? 'Liquid' : 'Regtest'))), React__default.createElement("input", {
    type: "text",
    ref: pubkey,
    className: "input is-medium mb-6",
    onChange: function onChange(e) {
      return onAddressInputChange(e.target.value);
    },
    placeholder: "Your native segwit address here..."
  }), showBlinding && React__default.createElement("input", {
    type: "text",
    ref: blindingPrivKey,
    className: "input is-medium mb-6",
    placeholder: "Your private blinding key here (hex format)..."
  }), React__default.createElement("br", null), React__default.createElement("br", null), React__default.createElement("button", {
    className: "button is-link is-large",
    onClick: checkInput
  }, "Load"), React__default.createElement("br", null), React__default.createElement("br", null), React__default.createElement("div", null, React__default.createElement("p", {
    className: "subtitle"
  }, "or create a new one..."), React__default.createElement("button", {
    className: "button is-primary is-large",
    onClick: function onClick() {
      return setShowConfirm(true);
    }
  }, "Generate"), showConfirm && confirmModal()));
};

var TextWithCopy = function TextWithCopy(props) {
  var _useState = React.useState(''),
      copySuccess = _useState[0],
      setCopySuccess = _useState[1];

  var copy = function copy() {
    copyLite.copyToClipboard(props.value);
    setCopySuccess('👌 Copied!');
    setTimeout(function () {
      return setCopySuccess('');
    }, 1500);
  };

  var textClass = props.textClass ? props.textClass : 'subtitle';
  return React__default.createElement("span", {
    onClick: copy
  }, React__default.createElement("p", {
    className: textClass
  }, props.label || props.value, " ", copySuccess));
};

var Update = function Update(props) {
  var utxosByAsset = props.utxos,
      lbtc = props.lbtc,
      network = props.network;

  var _useState = React.useState(0),
      inputAssetIndex = _useState[0],
      setInputAssetIndex = _useState[1];

  var _useState2 = React.useState(0),
      utxoIndex = _useState2[0],
      setUtxoIndex = _useState2[1];

  var _useState3 = React.useState(props.inputs),
      inputs = _useState3[0],
      setInputs = _useState3[1];

  var _useState4 = React.useState(props.outputs),
      outputs = _useState4[0],
      setOutputs = _useState4[1];

  var assets = Object.keys(utxosByAsset);
  var utxos = utxosByAsset[assets[inputAssetIndex]];

  var addInput = function addInput(e) {
    e.preventDefault();
    setInputs(function (is) {
      return is.concat([utxos[utxoIndex]]);
    });
  };

  var onAssetChange = function onAssetChange(e) {
    setInputAssetIndex(e.target.value);
    setUtxoIndex(0);
  };

  var onUtxoChange = function onUtxoChange(e) {
    return setUtxoIndex(e.target.value);
  };

  var _useForm = reactHookForm.useForm(),
      register = _useForm.register,
      handleSubmit = _useForm.handleSubmit,
      errors = _useForm.errors,
      setError = _useForm.setError;

  var addOutput = function addOutput(_ref) {
    var amount = _ref.amount,
        asset = _ref.asset,
        address = _ref.address;

    if (!validate(asset, 'asset')) {
      setError('asset');
      return;
    }

    if (!validate(address, 'address', liquidjsLib.networks[network])) {
      setError('address');
      return;
    }

    if (!validate(amount, 'amount')) {
      setError('amount');
      return;
    }

    setOutputs(function (os) {
      return os.concat([{
        value: amount,
        asset: asset,
        address: address
      }]);
    });
  };

  var removeInput = function removeInput(index) {
    return setInputs(inputs.filter(function (_o, i) {
      return i !== index;
    }));
  };

  var removeOutput = function removeOutput(index) {
    return setOutputs(outputs.filter(function (_o, i) {
      return i !== index;
    }));
  };

  var addFeeOutput = function addFeeOutput() {
    var amount = prompt('Enter the amount in satoshis to cover fees');
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return alert('Not a valid number');
    setOutputs(function (os) {
      return os.concat([{
        value: amount,
        address: 'LBTC_FEES',
        asset: lbtc
      }]);
    });
  };

  return React__default.createElement("div", null, React__default.createElement("div", {
    className: "box"
  }, React__default.createElement("h1", {
    className: "title"
  }, "Inputs"), React__default.createElement("div", {
    className: "field has-addons"
  }, React__default.createElement("div", {
    className: "control is-expanded has-text-centered"
  }, React__default.createElement("label", {
    className: "label"
  }, "Asset"), React__default.createElement("div", {
    className: "select is-info is-medium is-fullwidth"
  }, React__default.createElement("select", {
    value: inputAssetIndex,
    onChange: onAssetChange
  }, assets.map(function (a, i) {
    return React__default.createElement("option", {
      key: i,
      value: i
    }, a === lbtc ? 'L-BTC' : toHumanFriendlyString(a));
  })))), React__default.createElement("div", {
    className: "control is-expanded has-text-centered"
  }, React__default.createElement("label", {
    className: "label"
  }, "Unspent"), React__default.createElement("div", {
    className: "select is-info is-medium is-fullwidth"
  }, React__default.createElement("select", {
    value: utxoIndex,
    onChange: onUtxoChange
  }, utxos.map(function (u, i) {
    return React__default.createElement("option", {
      key: i,
      value: i
    }, toHumanFriendlyString(u.txid) + ' ' + u.value);
  })))), React__default.createElement("div", {
    className: "control"
  }, React__default.createElement("label", {
    style: {
      visibility: 'hidden'
    },
    className: "label"
  }, React__default.createElement("span", {
    role: "img",
    "aria-label": "vulpem"
  }, "\uD83E\uDD8A")), React__default.createElement("button", {
    className: "button is-link is-medium",
    onClick: addInput
  }, ' ', "Add", ' '))), React__default.createElement("span", null, inputs.map(function (i, index) {
    return React__default.createElement("div", {
      key: index,
      className: "field has-addons"
    }, React__default.createElement("button", {
      className: "button is-medium is-fullwidth",
      style: {
        borderColor: 'transparent'
      }
    }, React__default.createElement(TextWithCopy, {
      label: i.asset === lbtc ? 'L-BTC' : toHumanFriendlyString(i.asset),
      value: i.asset
    })), React__default.createElement("button", {
      className: "button is-medium is-fullwidth",
      style: {
        borderColor: 'transparent'
      }
    }, React__default.createElement(TextWithCopy, {
      label: toHumanFriendlyString(i.txid) + ' ' + i.value,
      value: i.txid
    })), React__default.createElement("button", {
      className: "button is-danger",
      onClick: function onClick() {
        return removeInput(index);
      }
    }, "Delete"));
  }))), React__default.createElement("div", {
    className: "box"
  }, React__default.createElement("div", {
    className: "columns"
  }, React__default.createElement("div", {
    className: "column is-6 is-offset-3"
  }, React__default.createElement("h1", {
    className: "title"
  }, "Outputs")), React__default.createElement("div", {
    className: "column is-3"
  }, React__default.createElement("button", {
    className: "button is-pulled-right",
    onClick: addFeeOutput
  }, "Add Fee output"))), React__default.createElement("form", {
    className: "form",
    onSubmit: handleSubmit(function (data) {
      return addOutput(data);
    })
  }, React__default.createElement("div", {
    className: "field has-addons"
  }, React__default.createElement("div", {
    className: "control is-expanded has-text-centered"
  }, React__default.createElement("label", {
    className: "label"
  }, "Asset"), React__default.createElement("input", {
    className: "input is-medium is-fullwidth",
    type: "text",
    name: "asset",
    placeholder: "Asset hash",
    ref: register({
      required: true
    })
  }), errors.asset && React__default.createElement("div", {
    className: "notification is-danger"
  }, "This field is not valid")), React__default.createElement("div", {
    className: "control is-expanded has-text-centered"
  }, React__default.createElement("label", {
    className: "label"
  }, "Address"), React__default.createElement("input", {
    className: "input is-medium is-fullwidth",
    name: "address",
    type: "text",
    placeholder: "Unconfidential address only",
    ref: register({
      required: true
    })
  }), errors.address && React__default.createElement("div", {
    className: "notification is-danger"
  }, "This field is not valid")), React__default.createElement("div", {
    className: "control is-expanded has-text-centered"
  }, React__default.createElement("label", {
    className: "label"
  }, "Amount"), React__default.createElement("input", {
    className: "input is-medium is-fullwidth",
    name: "amount",
    type: "number",
    placeholder: "In satoshis",
    ref: register({
      required: true
    })
  }), errors.amount && React__default.createElement("div", {
    className: "notification is-danger"
  }, "This field is not valid")), React__default.createElement("div", {
    className: "control"
  }, React__default.createElement("label", {
    style: {
      visibility: 'hidden'
    },
    className: "label"
  }, React__default.createElement("span", {
    role: "img",
    "aria-label": "vulpem"
  }, "\uD83E\uDD8A")), React__default.createElement("button", {
    type: "submit",
    className: "button is-link is-medium"
  }, ' ', "Add", ' ')))), React__default.createElement("span", null, React__default.createElement("br", null), outputs.map(function (o, index) {
    return React__default.createElement("div", {
      key: index,
      className: "field has-addons"
    }, React__default.createElement("button", {
      className: "button is-medium is-fullwidth",
      style: {
        borderColor: 'transparent'
      }
    }, React__default.createElement(TextWithCopy, {
      label: toHumanFriendlyString(o.asset),
      value: o.asset
    })), React__default.createElement("button", {
      className: "button is-medium is-fullwidth",
      style: {
        borderColor: 'transparent'
      }
    }, React__default.createElement(TextWithCopy, {
      label: toHumanFriendlyString(o.address),
      value: o.address
    })), React__default.createElement("button", {
      className: "button is-medium is-fullwidth",
      style: {
        borderColor: 'transparent'
      }
    }, React__default.createElement(TextWithCopy, {
      label: o.value,
      value: o.value
    })), React__default.createElement("button", {
      className: "button is-danger",
      onClick: function onClick() {
        return removeOutput(index);
      }
    }, "Delete"));
  }))), React__default.createElement("div", {
    className: "box is-centered"
  }, React__default.createElement("p", {
    className: "subtitle"
  }, " Total inputs ", inputs.length, " "), React__default.createElement("p", {
    className: "subtitle"
  }, " Total outputs ", outputs.length, " "), React__default.createElement("button", {
    className: "button is-large",
    onClick: function onClick() {
      return props.onEncode(inputs, outputs);
    }
  }, React__default.createElement("span", {
    role: "img",
    "aria-label": "encode psbt"
  }, "\uD83D\uDE9C"), "\u200DEncode"), React__default.createElement("button", {
    className: "button is-large",
    onClick: props.onSign
  }, React__default.createElement("span", {
    role: "img",
    "aria-label": "sign psbt"
  }, "\u270D"), "Sign")));
};

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var fetchBalances = function fetchBalances(address, url, blindingKey) {
  try {
    return Promise.resolve(fetchUtxos(address, url)).then(function (_fetchUtxos) {
      function _temp2() {
        var balances = fetchedData.reduce(function (storage, item) {
          // get the first instance of the key by which we're grouping
          var group = item['asset']; // set `storage` for this instance of group to the outer scope (if not empty) or initialize it

          storage[group] = storage[group] || 0; // add this item to its group within `storage`

          storage[group] += item.value; // return the updated storage to the reduce function, which will then loop through the next

          return storage;
        }, {}); // {} is the initial value of the storage

        var utxos = fetchedData.reduce(function (storage, item) {
          // get the first instance of the key by which we're grouping
          var group = item['asset']; // set `storage` for this instance of group to the outer scope (if not empty) or initialize it

          storage[group] = storage[group] || []; // add this item to its group within `storage`

          storage[group].push(item); // return the updated storage to the reduce function, which will then loop through the next

          return storage;
        }, {}); // {} is the initial value of the storage

        return {
          balances: balances,
          utxos: utxos
        };
      }

      var fetchedData = _fetchUtxos.map(function (utxo) {
        return utxo;
      });

      var _temp = function () {
        if (blindingKey && isValidBlindingKey(blindingKey)) {
          return Promise.resolve(unblindUtxos(fetchedData, blindingKey, url)).then(function (_unblindUtxos) {
            fetchedData = _unblindUtxos;
          });
        }
      }();

      return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp);
    });
  } catch (e) {
    return Promise.reject(e);
  }
};
var unblindUtxos = function unblindUtxos(utxos, blindingKey, url) {
  try {
    var promises = utxos.map(function (utxo) {
      return fetch(url + "/tx/" + utxo.txid + "/hex").then(function (r) {
        return r.text();
      }).then(function (txHex) {
        var prevTx = liquidjsLib.Transaction.fromHex(txHex);
        var prevOut = prevTx.outs[utxo.vout];
        return {
          prevOut: prevOut,
          utxo: utxo
        };
      });
    });
    return Promise.resolve(_catch(function () {
      return Promise.resolve(Promise.all(promises)).then(function (prevOuts) {
        var unblinds = prevOuts.map(function (po) {
          var prevOut = po.prevOut,
              utxo = po.utxo;
          var result = liquidjsLib.confidential.unblindOutput(prevOut.nonce, Buffer.from(blindingKey, 'hex'), prevOut.rangeProof, prevOut.value, prevOut.asset, prevOut.script);
          var assetHash = result.asset.reverse().toString('hex');
          return _extends({}, result, {
            asset: assetHash,
            txid: utxo.txid,
            vout: utxo.vout
          });
        });
        return unblinds;
      });
    }, function (e) {
      throw e;
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
var fetch = window.fetch;
var EXPLORER_URL = {
  liquid: 'https://blockstream.info/liquid/api',
  regtest: 'https://nigiri.network/liquid/api'
};

var LiquidWallet = /*#__PURE__*/function () {
  function LiquidWallet(identity, network, blindingKey) {
    try {
      liquidjsLib.address.toOutputScript(identity, network);
      if (blindingKey && !isValidBlindingKey) throw new Error('Invalid blinding key');
    } catch (ignore) {
      throw new Error('Invalid address');
    }

    var payOpts = blindingKey ? {
      confidentialAddress: identity
    } : {
      address: identity
    };
    var payment = liquidjsLib.payments.p2wpkh(_extends({}, payOpts, {
      network: network
    }));
    this.scriptPubKey = payment.output.toString('hex');
    this.address = payment.address;
    this.network = network;
    this.blindingKey = blindingKey;
  }

  LiquidWallet.createTx = function createTx() {
    var psbt = new liquidjsLib.Psbt();
    return psbt.toBase64();
  };

  LiquidWallet.isValidMnemonic = function isValidMnemonic(m) {
    return bip39.validateMnemonic(m);
  };

  LiquidWallet.isValidWIF = function isValidWIF(wif, network) {
    try {
      liquidjsLib.ECPair.fromWIF(wif, network);
      return true;
    } catch (e) {
      return false;
    }
  };

  var _proto = LiquidWallet.prototype;

  _proto.decodeTx = function decodeTx(psbtBase64) {
    var _this = this;

    var psbt;

    try {
      psbt = liquidjsLib.Psbt.fromBase64(psbtBase64);
    } catch (ignore) {
      throw new Error('Invalid psbt');
    }

    var bufferTx = psbt.data.globalMap.unsignedTx.toBuffer();
    var transaction = liquidjsLib.Transaction.fromBuffer(bufferTx);
    var inputs = [],
        outputs = [];
    psbt.data.inputs.forEach(function (i, index) {
      var _i$witnessUtxo, _i$witnessUtxo2;

      var txid = transaction.ins[index].hash.reverse().toString('hex');
      var vout = transaction.ins[index].index;
      var script = i.witnessUtxo.script.toString('hex');
      var value = liquidjsLib.confidential.confidentialValueToSatoshi((_i$witnessUtxo = i.witnessUtxo) === null || _i$witnessUtxo === void 0 ? void 0 : _i$witnessUtxo.value);
      var asset = toAssetHash((_i$witnessUtxo2 = i.witnessUtxo) === null || _i$witnessUtxo2 === void 0 ? void 0 : _i$witnessUtxo2.asset);
      var partialSig = i.partialSig;
      var sighashType = i.sighashType;
      inputs.push({
        txid: txid,
        vout: vout,
        value: value,
        asset: asset,
        script: script,
        partialSig: partialSig,
        sighashType: sighashType
      });
    });
    transaction.outs.forEach(function (o) {
      var asset = toAssetHash(o.asset);
      var value = liquidjsLib.confidential.confidentialValueToSatoshi(o.value);
      var addr = o.script.equals(Buffer.alloc(0)) ? 'LBTC_FEES' : liquidjsLib.address.fromOutputScript(o.script, _this.network);
      outputs.push({
        asset: asset,
        value: value,
        address: addr
      });
    });
    return {
      inputs: inputs,
      outputs: outputs
    };
  };

  _proto.updateTx = function updateTx(psbtBase64, inputs, outputs) {
    var _this2 = this;

    var psbt;

    try {
      psbt = liquidjsLib.Psbt.fromBase64(psbtBase64);
    } catch (ignore) {
      throw new Error('Invalid psbt');
    }

    inputs.forEach(function (i) {
      return psbt.addInput({
        hash: i.txid,
        index: i.vout,
        witnessUtxo: {
          script: i.script ? Buffer.from(i.script, 'hex') : Buffer.from(_this2.scriptPubKey, 'hex'),
          asset: Buffer.concat([Buffer.from('01', 'hex'), Buffer.from(i.asset, 'hex').reverse()]),
          value: liquidjsLib.confidential.satoshiToConfidentialValue(Number(i.value)),
          nonce: Buffer.from('00', 'hex')
        },
        partialSig: i.partialSig || [],
        sighashType: i.sighashType || liquidjsLib.Transaction.SIGHASH_ALL
      });
    });
    outputs.forEach(function (o) {
      var script = o.address === 'LBTC_FEES' ? Buffer.alloc(0) : liquidjsLib.address.toOutputScript(o.address, _this2.network);
      psbt.addOutput({
        script: script,
        asset: Buffer.concat([Buffer.from('01', 'hex'), Buffer.from(o.asset, 'hex').reverse()]),
        value: liquidjsLib.confidential.satoshiToConfidentialValue(Number(o.value)),
        nonce: Buffer.from('00', 'hex')
      });
    });
    return psbt.toBase64();
  };

  _proto.signPsbtWithMnemonic = function signPsbtWithMnemonic(psbtBase64, mnemonic) {
    var seed = bip39.mnemonicToSeedSync(mnemonic);
    var root = bip32.fromSeed(seed, this.network);
    var node = root.derivePath("m/84'/0'/0'/0");
    var keyPair = liquidjsLib.ECPair.fromWIF(node.toWIF(), this.network);
    var decoded = liquidjsLib.Psbt.fromBase64(psbtBase64);
    return this.sign(decoded, keyPair);
  };

  _proto.signPsbtWithPrivateKey = function signPsbtWithPrivateKey(psbtBase64, wif) {
    var keyPair = liquidjsLib.ECPair.fromWIF(wif, this.network);
    var decoded = liquidjsLib.Psbt.fromBase64(psbtBase64);
    return this.sign(decoded, keyPair);
  };

  _proto.sign = function sign(psbt, keyPair) {
    var signedPsbt = this.partiallySign(psbt, keyPair);
    var hex = signedPsbt.extractTransaction().toHex();
    return hex;
  };

  _proto.partiallySign = function partiallySign(psbt, keyPair) {
    psbt.data.inputs.forEach(function (input, index) {
      if (input.partialSig && input.partialSig.length > 0) {
        psbt.validateSignaturesOfInput(index);
        psbt.finalizeInput(index);
        return;
      }

      try {
        psbt.signInput(index, keyPair);
        psbt.validateSignaturesOfInput(index);
        psbt.finalizeInput(index);
      } catch (ignore) {
        console.warn(ignore);
      }
    });
    return psbt;
  };

  return LiquidWallet;
}();
function fetchUtxos(address, url) {
  return fetch(url + "/address/" + address + "/utxo").then(function (r) {
    return r.json();
  });
}
function faucet(address, url) {
  return fetch(url + "/faucet", {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address: address
    })
  });
}
function mint(address, quantity, url) {
  return fetch(url + "/mint", {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address: address,
      quantity: quantity
    })
  });
}

var Create = function Create(props) {
  var identity = props.identity,
      network = props.network,
      lbtc = props.lbtc,
      utxos = props.utxos,
      blindingKey = props.blindingKey;
  var currentNetwork = liquidjsLib.networks[network];
  var wallet = new LiquidWallet(identity, currentNetwork, blindingKey);

  var _useState = React.useState(''),
      encoded = _useState[0],
      setEncoded = _useState[1];

  var onEncode = function onEncode(inputs, outputs) {
    var emptyPsbt = LiquidWallet.createTx();
    var psbt = wallet.updateTx(emptyPsbt, inputs, outputs);
    setEncoded(psbt);
  };

  var onSign = function onSign() {
    if (encoded.length === 0) return alert('Encode the transaction on every change before signing');
    var mnemonicOrWif = prompt('Enter your mnemonic or WIF private key');

    if (LiquidWallet.isValidMnemonic(mnemonicOrWif)) {
      try {
        var hex = wallet.signPsbtWithMnemonic(encoded, mnemonicOrWif);
        setEncoded(hex);
        return;
      } catch (ignore) {
        return alert(ignore);
      }
    }

    if (LiquidWallet.isValidWIF(mnemonicOrWif, currentNetwork)) {
      try {
        var _hex = wallet.signPsbtWithPrivateKey(encoded, mnemonicOrWif);

        setEncoded(_hex);
        return;
      } catch (ignore) {
        return alert(ignore);
      }
    }

    return alert('Mnemonic or WIF not valid');
  };

  return React__default.createElement("div", null, React__default.createElement(Update, {
    network: network,
    lbtc: lbtc,
    utxos: utxos,
    inputs: [],
    outputs: [],
    onEncode: onEncode,
    onSign: onSign
  }), encoded.length > 0 && React__default.createElement("div", {
    className: "box"
  }, ' ', React__default.createElement(InputWithCopy, {
    value: encoded
  }), ' '));
};

var Decode = function Decode(props) {
  var identity = props.identity,
      network = props.network,
      lbtc = props.lbtc,
      utxos = props.utxos,
      blindingKey = props.blindingKey;
  var currentNetwork = liquidjsLib.networks[network];
  var wallet = new LiquidWallet(identity, currentNetwork, blindingKey);

  var _useState = React.useState({
    hasBeenDecoded: false,
    inputs: [],
    outputs: []
  }),
      state = _useState[0],
      setState = _useState[1];

  var _useState2 = React.useState(''),
      encoded = _useState2[0],
      setEncoded = _useState2[1];

  var psbtInput = React.useRef(null);

  var onDecodeClick = function onDecodeClick(e) {
    e.preventDefault();

    var _wallet$decodeTx = wallet.decodeTx(psbtInput.current.value),
        inputs = _wallet$decodeTx.inputs,
        outputs = _wallet$decodeTx.outputs;

    setState({
      hasBeenDecoded: true,
      inputs: inputs,
      outputs: outputs
    });
  };

  var onEncode = function onEncode(inputs, outputs) {
    var emptyPsbt = LiquidWallet.createTx();
    var psbt = wallet.updateTx(emptyPsbt, inputs, outputs);
    setEncoded(psbt);
  };

  var onSign = function onSign() {
    if (encoded.length === 0) return alert('Encode the transaction on every change before signing');
    var mnemonicOrWif = prompt('Enter your mnemonic or WIF private key');

    if (LiquidWallet.isValidMnemonic(mnemonicOrWif)) {
      try {
        var hex = wallet.signPsbtWithMnemonic(encoded, mnemonicOrWif);
        setEncoded(hex);
        return;
      } catch (ignore) {
        return alert(ignore);
      }
    }

    if (LiquidWallet.isValidWIF(mnemonicOrWif, currentNetwork)) {
      try {
        var _hex = wallet.signPsbtWithPrivateKey(encoded, mnemonicOrWif);

        setEncoded(_hex);
        return;
      } catch (ignore) {
        return alert(ignore);
      }
    }

    return alert('Mnemonic or WIF not valid');
  };

  return React__default.createElement("div", null, React__default.createElement("div", {
    className: "field has-addons"
  }, React__default.createElement("input", {
    type: "text",
    ref: psbtInput,
    className: "input is-medium",
    placeholder: "Your base64 encoded PSBT here..."
  }), React__default.createElement("button", {
    className: "button is-link is-medium",
    onClick: onDecodeClick
  }, "Decode")), state.hasBeenDecoded && React__default.createElement(Update, {
    network: network,
    lbtc: lbtc,
    utxos: utxos,
    inputs: state.inputs,
    outputs: state.outputs,
    onEncode: onEncode,
    onSign: onSign
  }), encoded.length > 0 && React__default.createElement("div", {
    className: "box"
  }, ' ', React__default.createElement(InputWithCopy, {
    value: encoded
  }), ' '));
};

var Circle = function Circle(props) {
  return React__default.createElement("div", {
    className: "hero box is-inline-block has-background-link",
    style: {
      borderRadius: '50%',
      height: '250px',
      width: '250px',
      margin: '2rem'
    }
  }, React__default.createElement("div", {
    className: "hero-body"
  }, React__default.createElement("div", {
    className: "container"
  }, React__default.createElement("p", {
    className: "subtitle is-5 has-text-white"
  }, " ", props.asset), React__default.createElement("h1", {
    className: "title is-2 has-text-white"
  }, ' ', props.balance.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8
  }), ' '))));
};

var Balances = function Balances(props) {
  return React__default.createElement("div", null, React__default.createElement("p", {
    className: "subtitle is-4"
  }, "Balances"), React__default.createElement("div", {
    className: "buttons is-centered"
  }, Object.entries(props.balances).map(function (_ref, index) {
    var assetHash = _ref[0],
        balanceInSatoshis = _ref[1];
    var asset;
    if (assetHash === props.lbtc) asset = 'L-BTC';else asset = toHumanFriendlyString(assetHash);
    return React__default.createElement(Circle, {
      key: index,
      balance: fromSatoshi(balanceInSatoshis),
      asset: asset
    });
  })));
};

var Spinner = function Spinner() {
  return React__default.createElement("section", {
    className: "section"
  }, React__default.createElement("div", {
    className: "buttons is-centered"
  }, React__default.createElement("span", {
    className: "loader"
  })));
};

var Wallet = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Wallet, _React$Component);

  function Wallet() {
    var _this;

    _this = _React$Component.apply(this, arguments) || this;
    _this.state = {
      showCreate: false,
      showImport: false,
      hasBalances: false,
      balances: {},
      utxos: {},
      isLoading: true
    };

    _this.getBalances = function () {
      _this.setState({
        isLoading: true
      });

      var _this$props = _this.props,
          identity = _this$props.identity,
          network = _this$props.network,
          explorerUrl = _this$props.explorerUrl,
          blindingKey = _this$props.blindingKey;
      fetchBalances(identity, explorerUrl || EXPLORER_URL[network], blindingKey).then(function (data) {
        if (Object.keys(data.utxos).length > 0) _this.setState({
          balances: data.balances,
          utxos: data.utxos,
          hasBalances: true,
          isLoading: false
        });else _this.setState({
          isLoading: false
        });
        return;
      }).catch(function (e) {
        console.error(e);
        alert('Something went wrong. Explorer may be down');

        _this.setState({
          isLoading: false
        });
      });
    };

    _this.callFaucet = function () {
      _this.setState({
        isLoading: true
      });

      faucet(_this.props.identity, _this.props.explorerUrl || EXPLORER_URL.regtest).then(function () {
        return _this.getBalances();
      }).catch(function (e) {
        console.error(e);
        alert('Something went wrong. Explorer may be down');

        _this.setState({
          isLoading: false
        });
      });
    };

    _this.callMint = function () {
      _this.setState({
        isLoading: true
      });

      var qtyString = prompt('How many asset you want to issue?');

      if (!qtyString || isNaN(Number(qtyString))) {
        alert('You need to pass a valid amount');

        _this.setState({
          isLoading: false
        });

        return;
      }

      mint(_this.props.identity, Number(qtyString), _this.props.explorerUrl || EXPLORER_URL.regtest).then(function () {
        return _this.getBalances();
      }).catch(function (e) {
        console.error(e);
        alert('Something went wrong. Explorer may be down');

        _this.setState({
          isLoading: false
        });
      });
    };

    return _this;
  }

  var _proto = Wallet.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.getBalances();
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$props2 = this.props,
        network = _this$props2.network,
        identity = _this$props2.identity,
        blindingKey = _this$props2.blindingKey;
    var _this$state = this.state,
        showCreate = _this$state.showCreate,
        showImport = _this$state.showImport,
        balances = _this$state.balances,
        hasBalances = _this$state.hasBalances,
        isLoading = _this$state.isLoading,
        utxos = _this$state.utxos;
    var LBTC_ASSET_HASH = liquidjsLib.networks[network].assetHash;
    var isRegtest = network === 'regtest';
    return React__default.createElement("div", {
      className: "column has-text-centered"
    }, React__default.createElement(TextWithCopy, {
      value: identity,
      textClass: "title is-5"
    }), blindingKey && React__default.createElement("span", null, React__default.createElement("br", null), React__default.createElement("p", {
      className: "title is-6"
    }, "UNCONFIDENTIAL"), React__default.createElement(TextWithCopy, {
      value: liquidjsLib.address.fromConfidential(identity).unconfidentialAddress,
      textClass: "title is-5"
    }), React__default.createElement("br", null), React__default.createElement("br", null)), !isLoading && hasBalances && React__default.createElement(Balances, {
      balances: balances,
      lbtc: LBTC_ASSET_HASH
    }), React__default.createElement("br", null), !isLoading && !hasBalances && React__default.createElement("p", {
      className: "subtitle is-6"
    }, ' ', "You don't have any unspent output. Your balances will appear here.", ' '), isRegtest && !hasBalances && !isLoading && React__default.createElement("button", {
      className: "button is-link",
      onClick: this.callFaucet
    }, React__default.createElement("span", {
      role: "img",
      "aria-label": "create"
    }, "\uD83D\uDEB0"), ' ', "Faucet"), isRegtest && !isLoading && React__default.createElement("button", {
      className: "button is-link",
      onClick: this.callMint
    }, React__default.createElement("span", {
      role: "img",
      "aria-label": "create"
    }, "\uD83D\uDCB8"), ' ', "Mint"), !hasBalances && !isLoading && React__default.createElement("button", {
      className: "button",
      onClick: this.getBalances
    }, React__default.createElement("span", {
      role: "img",
      "aria-label": "create"
    }, "\u267B"), ' ', "Reload"), isLoading && React__default.createElement(Spinner, null), hasBalances && React__default.createElement("section", {
      className: "section"
    }, React__default.createElement("p", {
      className: "subtitle is-4"
    }, "Transaction"), React__default.createElement("button", {
      className: "button is-large " + (!isLoading && showCreate && "is-link"),
      onClick: function onClick() {
        return _this2.setState({
          showCreate: true,
          showImport: false
        });
      }
    }, React__default.createElement("span", {
      role: "img",
      "aria-label": "create"
    }, "\uD83D\uDEE0"), ' ', "Create"), React__default.createElement("button", {
      className: "button is-large " + (!isLoading && showImport && "is-link"),
      onClick: function onClick() {
        return _this2.setState({
          showImport: true,
          showCreate: false
        });
      }
    }, React__default.createElement("span", {
      role: "img",
      "aria-label": "import"
    }, "\uD83D\uDCC0"), ' ', "Import")), !isLoading && showCreate && React__default.createElement(Create, {
      utxos: utxos,
      lbtc: LBTC_ASSET_HASH,
      identity: identity,
      network: network,
      blindingKey: blindingKey
    }), !isLoading && showImport && React__default.createElement(Decode, {
      utxos: utxos,
      lbtc: LBTC_ASSET_HASH,
      identity: identity,
      network: network,
      blindingKey: blindingKey
    }));
  };

  return Wallet;
}(React__default.Component);

var App = function App() {
  var useStorage = useGlobalStorage({
    storageOptions: {
      name: 'liquid-coach-db'
    }
  });

  var _useStorage = useStorage('state', null),
      state = _useStorage[0],
      setState = _useStorage[1];

  return React__default.createElement("div", null, React__default.createElement(Layout, {
    title: "\uD83C\uDFCB\uFE0F\u200D\u2642\uFE0F Liquid.Coach",
    showExplorer: !state,
    onExplorer: function onExplorer(explorer) {
      setState({
        explorerUrl: explorer
      });
    },
    onClean: function onClean() {
      setState(null);
    }
  }, React__default.createElement("div", {
    className: "container"
  }, React__default.createElement("div", {
    className: "container"
  }, React__default.createElement("div", {
    className: "columns"
  }, !state || !state.loaded ? React__default.createElement(Load, {
    onLoad: function onLoad(xpubOrAddress, selectedNetwork, blindingPrivKey) {
      setState(_extends({
        loaded: true,
        identity: xpubOrAddress,
        network: selectedNetwork,
        blindingKey: blindingPrivKey
      }, state));
    }
  }) : React__default.createElement(Wallet, {
    identity: state.identity,
    network: state.network,
    blindingKey: state.blindingKey && state.blindingKey.length > 0 ? state.blindingKey : undefined,
    explorerUrl: state.explorerUrl
  }))))));
};

ReactDOM.render(React__default.createElement(App, null), document.getElementById('root'));
//# sourceMappingURL=liquid.coach.cjs.development.js.map
