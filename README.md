# homebridge-http-regex
[![GitHub issues](https://img.shields.io/github/issues/WouterJanson/homebridge-http-regex.svg)](https://github.com/WouterJanson/homebridge-http-regex/issues)
[![license](https://img.shields.io/github/license/WouterJanson/homebridge-http-regex.svg)](https://github.com/WouterJanson/homebridge-http-regex/blob/master/LICENCE)

HTTP RegEx plugin for [HomeBridge](https://github.com/nfarina/homebridge)

Plugin for Homebridge which checks a HTTP response against a RegEx pattern. It creates a contact sensor which opens when RegEx pattern is matched against the HTTP response.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-http-regex`
3. Update your configuration file. See snippet below.

## Configuration
You'll need to add a `Regex` accessory to your homebridge config.json. This example below would check the apple store page every 5 minutes and opens the contact sensor if it's closed.

```JSON
{
  "accessories": [
    {
      "accessory": "Regex",
      "name": "Apple Store",
      "endpoint": "https://store.apple.com",
      "pattern": "(We'll be back.)",
      "interval": 300000
    }
  ]
}
```

### Value summary
`accessory`: The name of the accessory, this must be `Regex`.  
`name`: The name of the contact sensor in HomeKit.  
`endpoint`: The addres for the HTTP Get request.  
`Pattern`: The RegEx pattern which needs te be checked against.  
`interval`: The interval between checks in milliseconds. The default is set to `10 seconds` if you don't specify an interval.  

**Note:** You'll need to obmit the opening and closing slash from the pattern. Backslashes within the pattern need to be escaped with another backslash.
