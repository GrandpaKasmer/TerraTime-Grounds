import { Application } from '@nativescript/core';
import { registerElement } from '@nativescript/angular';
import { registerTranslator } from './i18n/translator';

// Register custom elements
// registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer);

// Register translator for i18n
registerTranslator();

Application.run({ moduleName: 'app-root' });