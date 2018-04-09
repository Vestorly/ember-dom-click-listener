# ember-dom-click-listener

ember-dom-click-listener is a simple click listener that sends an action when the component is in view.

The primary use case is to trigger a click action that fires when a click occurs outside of a parent component or specified element(s).

Installation
------------------------------------------------------------------------------

```
ember install ember-dom-click-listener
```


Usage
------------------------------------------------------------------------------

You can use the listener wherever you are triggering a display of anything (menu, modal, etc.) and need the ability to close it via clicking outside of the specified element.

If you are using **[Ember Composable Helpers](https://github.com/DockYard/ember-composable-helpers)** and the entire parent component is the allowable click area, you can pass in the a concatenated string of the ID selector `#` and `elementId` as the `parentSelector`:

```
// template.hbs

{{#if menuToggled}}
  {{ember-dom-click-listener
    fireAction=(action 'closeMenu')
    parentSelector=(concat '#' elementId)
  }}
{{/if}}
```

Otherwise you can pass in a string as the `parentSelector`:

```
// template.hbs

{{#if menuToggled}}
  {{ember-dom-click-listener
    fireAction=(action 'closeMenu')
    parentSelector='.my-selector'
  }}
{{/if}}
```

You can also pass in an array of selector strings `allowedSelectors` if you need to specify more allowable click areas:

```
// template.hbs

{{#if menuToggled}}
  {{ember-dom-click-listener
    fireAction=(action 'closeMenu')
    allowedSelectors=myListOfSelectors
    parentSelector='.my-selector'
  }}
{{/if}}

// parent component or controller

export default Component.extend({

  myListOfSelectors: computed(function() {
    return ['.another-selector', '.yet-another-selector'];
  })

});
```

Again, if you're using **[Ember Composable Helpers](https://github.com/DockYard/ember-composable-helpers)** you can concatenate your own array via the `array` helper:

```
// template.hbs

{{#if menuToggled}}
  {{ember-dom-click-listener
    fireAction=(action 'closeMenu')
    allowedSelectors=(array '#selector-1' '.selector-2' '.selector-3')
    parentSelector='.my-selector'
  }}
{{/if}}
```

As for the action, it can be defined in the parent component or passed in as a closure:

```
// parent component or controller

actions: {
  closeMenu() {
    this.toggleProperty('menuToggled');
  }
}

```


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd my-addon`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
