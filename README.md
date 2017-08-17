# ember-dom-click-listener

ember-dom-click-listener is a simple click listener that sends an action when the component is in view.

The primary use case is to trigger a click action that fires when a click occurs outside of a parent component or specified element(s).

## Installation

* `ember install ember-dom-click-listener`

## Usage

You can use the listener wherever you are triggering a display of anything (menu, modal, etc.) and need the ability to close it via clicking outside of the specified element.

If the entire parent component is the allowable click area, you can pass in the `elementId` as the `parentSelector`:

```
// template.hbs

{{#if menuToggled}}
  {{ember-dom-click-listener
    fireAction=(action 'closeMenu')
    parentSelector=elementId
  }}
{{/if}}
```

Otherwise you can pass in a string as the `parentSelector`:

```
// template.hbs

{{#if menuToggled}}
  {{ember-dom-click-listener
    fireAction=(action 'closeMenu')
    parentSelector='my-selector'
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
    parentSelector='my-selector'
  }}
{{/if}}

// parent component or controller

export default Component.extend({

  myListOfSelectors: computed(function() {
    return ['another-selector', 'yet-another-selector'];
  })

});
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
