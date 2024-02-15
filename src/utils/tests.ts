// eslint-disable-next-line import/no-extraneous-dependencies
import {
  shallowMount as originalShallowMount,
  mount as originalMount,
} from '@vue/test-utils';
import merge from 'lodash/merge';

import ElementPlus from 'element-plus';

export function mount(...args: Parameters<typeof originalMount>) {
  const component = args[0];
  const opts = args[1] ?? {};

  return originalMount(component, merge(opts, {
    global: {
      plugins: [ElementPlus],
    },
  }));
}

export function shallowMount(...args: Parameters<typeof originalShallowMount>) {
  const component = args[0];
  const opts = args[1] ?? {};

  return originalShallowMount(component, merge(opts, {
    global: {
      plugins: [ElementPlus],
    },
  }));
}
