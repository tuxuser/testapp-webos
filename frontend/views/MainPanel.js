var
  kind = require('enyo/kind'),
  Panel = require('moonstone/Panel'),
  FittableColumns = require('layout/FittableColumns'),
  BodyText = require('moonstone/BodyText'),
  LunaService = require('enyo-webos/LunaService'),
	Divider = require('moonstone/Divider'),
	Scroller = require('moonstone/Scroller'),
  Item = require('moonstone/Item'),
	ToggleItem = require('moonstone/ToggleItem'),
  LabeledTextItem = require('moonstone/LabeledTextItem');

var daemonName = "TestApp";
var serviceName = "org.webosbrew.testapp.service";
var lunaServiceUri = "luna://" + serviceName;

var not = function (x) { return !x };
var yes_no_bool = function (x) {
  if (x)
    return "Yes";
  else
    return "No";
}

module.exports = kind({
  name: 'MainPanel',
  kind: Panel,
  title: daemonName,
  titleBelow: "WebOS 3.4.0 service communication",
  headerType: 'medium',
  components: [
    {kind: FittableColumns, classes: 'enyo-center', fit: true, components: [
      {kind: Scroller, fit: true, components: [
        {classes: 'moon-hspacing', controlClasses: 'moon-12h', components: [
          {components: [
            // {kind: Divider, content: 'Toggle Items'},
            {
              kind: LabeledTextItem,
              label: 'Status',
              name: 'testStatusText',
              text: 'unknown',
              disabled: false,
            },
            {kind: Item, name: 'rebootButton', content: 'Reboot system', ontap: "reboot"},
          ]},
        ]},
      ]},
    ]},
    {components: [
      {kind: Divider, content: 'Result'},
      {kind: BodyText, name: 'result', content: 'Nothing selected...'}
    ]},
    {kind: LunaService, name: 'testStatus', service: lunaServiceUri, method: 'test', onResponse: 'onTestStatus', onError: 'onTestStatus'},
    {kind: LunaService, name: 'systemReboot', service: 'luna://org.webosbrew.hbchannel.service', method: 'reboot' }
  ],

  testStatusText: 'unknown',
  resultText: 'unknown',

  bindings: [
    {from: "testStatusText", to: '$.testStatusText.text'},
    {from: "resultText", to: '$.result.content'}
  ],

  create: function () {
    this.inherited(arguments);
    console.info("Application created");
    require("fs").writeFile("/tmp/testapp.init", "testapp.ui.create");
    this.set('resultText', 'Trying to talk to native service!');
    self.$.testStatus.send({});
  },
  reboot: function () {
    console.info("Sending reboot command");
    this.$.systemReboot.send({});
  },
  onTestStatus: function (sender, evt) {
    console.info("onTestStatus");
    console.info(sender, evt);

    this.set('resultText', 'Test status received!');
    require("fs").writeFile("/tmp/testapp.on_status", "testapp.ui.status_result_received");
  }
});