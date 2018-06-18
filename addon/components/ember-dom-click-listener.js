import Ember from 'ember';
import jquery from 'jquery';
import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { run } from '@ember/runloop';
import { isBlank, isEmpty, isPresent } from '@ember/utils';
import { guidFor } from '@ember/object/internals';
import { isArray } from '@ember/array';

const { Logger: { error } } = Ember;

const noParentErrorMssage = 'A `parentSelector` is required to check if a click occurred outside the parent. ' +
                            'Examples: `.my-selector` or `#my-selector`';

const allowedSelectorsErrorMessage = '`allowedSelectors` must be an array of selectors.';

/**
 * A simple component that detects and handles clicks outside of target element(s).
 *
 * @class EmberDomClickListener
 * @public
 */

export default Component.extend({

  /**
  * Holds the parent element selector name.
  *
  * @property parentSelector
  * @type {String}
  * @default ''
  * @public
  */

  parentSelector: '',

  /**
   * Holds a list of allowed selector names to check against.
   * Useful if there are elements that you do not wish to fire the action.
   *
   * @property allowedSelectors
   * @type {Array}
   * @default []
   * @public
   */

  allowedSelectors: computed(() => []),

  /**
   * The parent element that provides the context in which is acceptable to click inside.
   *
   * @property parentElement
   * @type {String}
   * @public
   */

  parentElement: computed('parentSelector', function() {
    let parentSelector = get(this, 'parentSelector');
    if (isBlank(parentSelector)) {
      error(noParentErrorMssage);
    }
    return jquery(parentSelector);
  }),

  /**
   * Removes click event outside the context of the component/view on destroy.
   *
   * @method willDestroyElement
   * @public
   */

  willDestroyElement() {
    this._super(...arguments);
    this._removeDomClickEvent();
  },

  /**
   * Adds click event outside the context of the component/view.
   *
   * @method didReceiveAttrs
   * @public
   */

  didInsertElement() {
    this._super(...arguments);
    if (!isArray(get(this, 'allowedSelectors'))) {
      error(allowedSelectorsErrorMessage);
    }
    run.next(()=> this._setDomClickEvent());
  },

  /**
   * Holds the action to trigger when clicking outside the context.
   * @property fireAction
   * @public
   */

  fireAction() {},

  /**
   * The click handle method to resets the toggled property and removes
   * click listener if clicked outside.
   * @method clickHandler
   * @param {Object} event
   * @public
   */

  clickHandler(event) {
    let allowedSelectors = get(this, 'allowedSelectors');
    let parentElement = get(this, 'parentElement');
    let $target = jquery(event.target);
    let clickedOnAllowable;

    let clickedOutside = isEmpty($target.closest(parentElement));

    if (isPresent(allowedSelectors)) {
      clickedOnAllowable = allowedSelectors.filter(selector => isPresent($target.closest(selector)));
    }

    if (clickedOutside && isEmpty(clickedOnAllowable)) {
      event.preventDefault();

      const fireAction = get(this, 'fireAction');

      if (typeof fireAction === 'function') {
        fireAction();
      } else {
        error('Must pass "fireAction" as a closure action.');
      }
    }
  },

  /**
   * Adds click event outside the context of the component/view.
   * @method setDomClickEvent
   * @public
   */

  _setDomClickEvent() {
    return jquery(window).on(`click.${guidFor(this)}`, event => {
      return this.clickHandler(event);
    });
  },

  /**
   * Removes click event outside the context of the component/view.
   * @method _removeDomClickEvent
   * @public
   */

  _removeDomClickEvent() {
    jquery(window).off(`click.${guidFor(this)}`);
  }
});
