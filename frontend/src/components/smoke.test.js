import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Home from '../views/home/Home.vue';

describe('smoke', () => {
  it('renders home hero', () => {
    const wrapper = mount(Home, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    });
    expect(wrapper.text()).toContain('あなたの時間を、週で見える化する');
  });
});
