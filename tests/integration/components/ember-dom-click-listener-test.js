import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { get, set, setProperties } from '@ember/object';

module('Integration - components/ember-dom-click-listener', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    const actionToFire = () => set(this, 'actionFired', true);

    setProperties(this, {
      actionToFire,
      actionFired: false
    });
  });

  test('Can fire action if clicked outside allowed element', async function(assert) {
    await render(hbs`
      {{ember-dom-click-listener
        fireAction=(action actionToFire)
        parentSelector='.click-will-not-fire-action'
      }}
      <div class="click-will-not-fire-action">
        <span>Inside parent selector</span>
      </div>
      <div class="click-will-fire-action"></div>
    `);

    await click('.click-will-fire-action');
    assert.ok(get(this, 'actionFired'), 'Action is fired');
  });

  test('Does not fire action if clicked inside allowed element', async function(assert) {
    await render(hbs`
      {{ember-dom-click-listener
        fireAction=(action actionToFire)
        parentSelector='.click-will-not-fire-action'
      }}
      <div class="click-will-not-fire-action">
        <span>Inside parent selector</span>
      </div>
      <div class="click-will-fire-action"></div>
    `);

    await click('.click-will-not-fire-action');
    assert.notOk(get(this, 'actionFired'), 'Action was not fired');
  });

  test('Can take an array of allowed selectors for allowed elements and will not fire action if any of them are clicked', async function(assert) {
    const allowedSelectors = ['.allowed-selector-1', '.allowed-selector-2', '#allowed-id-selector'];
    set(this, 'allowedSelectors', allowedSelectors);

    await render(hbs`
      {{ember-dom-click-listener
        fireAction=(action actionToFire)
        parentSelector='.click-will-not-fire-action'
        allowedSelectors=allowedSelectors
      }}
      <div class="click-will-not-fire-action">
        <span>Inside parent selector</span>
      </div>
      <div class="allowed-selector-1"></div>
      <div class="allowed-selector-2"></div>
      <div id="allowed-id-selector"></div>
      <div class="click-will-fire-action"></div>
    `);

    await click('.allowed-selector-1');
    assert.notOk(get(this, 'actionFired'), 'Action was not fired');

    await click('.allowed-selector-2');
    assert.notOk(get(this, 'actionFired'), 'Action was not fired');

    await click('#allowed-id-selector');
    assert.notOk(get(this, 'actionFired'), 'Action was not fired');
  });
});
