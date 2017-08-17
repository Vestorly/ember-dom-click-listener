import Ember$ from 'jquery';
import Component from 'ember-component';
import computed from 'ember-computed';
import run from 'ember-runloop';
import { isEmpty, isPresent } from 'ember-utils';
import { guidFor } from 'ember-metal/utils';

/**
  Checks to see if the selector already has the appropriate syntax and
  returns the proper element (if it exists).
*/

const getDomElement = function(selector) {
  let idSelector, classSelector;

  if (selector.indexOf('#') === 0 || selector.indexOf('.') === 0) {
    return Ember$(`${selector}`);
  } else {
    idSelector = Ember$(`#${selector}`);
    classSelector = Ember$(`.${selector}`);
  }
  return isPresent(idSelector) ? idSelector : classSelector;
};

/**
  A simple component that detects and handles clicks outside of target element(s).

  @class EmberDomClickListener
  @public
*/

export default Component.extend({

  /**
    Holds the parent element selector name.

    @property parentSelector
    @type {String}
    @default ''
    @public
  */

  parentSelector: '',

  /**
    Holds a list of allowed selector names to check against.
    Useful if there are elements that you do not wish to fire the action.

    @property allowedSelectors
    @type {Array}
    @default []
    @public
  */

  allowedSelectors: computed(() => []),

  /**
    Holds the list of allowed elements in which are acceptable to click inside.

    @property allowedElements
    @type {Array}
    @private
  */

  allowedElements: computed('allowedSelectors', function() {
    return this.get('allowedSelectors').map(selector => {
      return getDomElement(selector);
    })
  }),

  /**
    The parent element that provides the context in which is acceptable to click inside.

    @property parentElement
    @type {String}
    @public
  */

  parentElement: computed('selector', function() {
    return getDomElement(this.get('selector'));
  }),

  /**
    Removes click event outside the context of the component/view on destroy.

    @method willDestroyElement
    @public
  */

  willDestroyElement() {
    this._super(...arguments);
    this._removeDomClickEvent();
  },

  /**
    Adds click event outside the context of the component/view.

    @method didReceiveAttrs
    @public
  */

  didInsertElement() {
    this._super(...arguments);
    run.next(()=> this._setDomClickEvent());
  },

  /**
    Holds the action to trigger when clicking outside the context.
    @property fireAction
    @public
  */

  fireAction() {},

  /**
    The click handle method to resets the toggled property and removes
    click listener if clicked outside.
    @method clickHandler
    @param {Object} event
    @public
  */

  clickHandler(event) {
    let allowedElements = this.get('allowedElements');
    let parentElement = this.get('parentElement');
    let $target = Ember$(event.target);
    let clickedOnAllowable;

    let clickedOutside = isEmpty($target.closest(parentElement));

    if (isPresent(allowedElements)) {
      clickedOnAllowable = allowedElements.filter(selector => isPresent($target.closest(selector)));
    }

    if (clickedOutside && isEmpty(clickedOnAllowable)) {
      event.preventDefault();
      this.sendAction('fireAction');
    }
  },

  /**
    Adds click event outside the context of the component/view.
    @method setDomClickEvent
    @public
  */

  _setDomClickEvent() {
    return Ember$(window).on(`click.${guidFor(this)}`, event => {
      return this.clickHandler(event);
    });
  },

  /**
    Removes click event outside the context of the component/view.
    @method _removeDomClickEvent
    @public
  */

  _removeDomClickEvent() {
    Ember$(window).off(`click.${guidFor(this)}`);
  }
});