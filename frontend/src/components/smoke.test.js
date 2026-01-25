import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Home from '../views/home/Home.vue';
import { i18n } from '../i18n';

describe('smoke', () => {
  it('renders home hero', () => {
    i18n.global.locale.value = 'ja';
    const wrapper = mount(Home, {
      global: {
        plugins: [i18n],
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    });
    expect(wrapper.text()).toContain(i18n.global.t('home.hero.primary'));
  });
});
