var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-http-regex", "Regex", RegexAccessory);
}

function RegexAccessory(log, config) {
    // Config
    this.name = config["name"];
    this.endpoint = config["endpoint"]
    this.regex = new RegExp(config["pattern"])
    this.interval = config["interval"] || 10000 // Ten second default interval

    // Internal
    this.log = log;
    this.service = new Service.ContactSensor(this.name)

    // State information
    this.error = false
    this.state = false
}

RegexAccessory.prototype.updateState = function() {
    // Clean any possible previous error
    this.error = false

    this.log(`Sending GET request to: ${this.endpoint}`)
    request.get({
        url: this.endpoint
    }, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            this.log(`Testing response body with RegEx: ${this.regex}`)
            this.state = this.regex.test(body)
            this.log(`Setting sensor state: ${this.state}`)

            // Set the current for HomeKit
            this.service.setCharacteristic(Characteristic.ContactSensorState, this.state)
        } else {
            this.log(`Error while performing GET request: ${err}`)
            this.error = true
        }
    }.bind(this))
}

RegexAccessory.prototype.getState = function(callback) {
    if (this.error) {
        // Send error to Homebridge
        callback(this.error)
    } else {
        // Send current state to Homebridge
        callback(null, this.state)
    }
}

RegexAccessory.prototype.getServices = function() {
    // Set sensor information
    var informationService = new Service.AccessoryInformation();
    informationService
        .setCharacteristic(Characteristic.Manufacturer, "@WouterJanson")
        .setCharacteristic(Characteristic.Model, "HTTP RegEx")
        .setCharacteristic(Characteristic.SerialNumber, "Version 0.0.1");

    // Homekit state request
    this.service.getCharacteristic(Characteristic.ContactSensorState)
        .on('get', this.getState.bind(this));

    // Interval state update
    if (this.interval > 0) {
        this.timer = setInterval(this.updateState.bind(this), this.interval);
    }

    return [informationService, this.service];
}