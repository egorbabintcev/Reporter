import { describe, expect, it } from 'vitest';

// import { HOUR, MILLISECOND } from '@/utils/time.ts';
import { shallowMount } from '@/utils/tests.ts';
//
import HoursStatsCard from './index.vue';

describe('Card with hours stats', () => {
  describe('Main stats about current worked hours and total quota', () => {
    describe('Displaying current worked hours', () => {
      it('Should correctly show integer values', () => {
        const hoursWorked = 8;
        const hoursWorkedInSeconds = hoursWorked * 3600;
        const wrapper = shallowMount(HoursStatsCard, {
          props: {
            currentTime: hoursWorkedInSeconds,
          },
        });

        expect(
          wrapper
            .find('[data-test-id="hours-stats-card_title_current-hours"]')
            .text()
            .includes(hoursWorked.toString(10)),
        ).toBeTruthy();
      });

      it('Should correctly show float values up to 2 digits after point', () => {
        const hoursWorked = 8.15;
        const hoursWorkedInSeconds = hoursWorked * 3600;
        const wrapper = shallowMount(HoursStatsCard, {
          props: {
            currentTime: hoursWorkedInSeconds,
          },
        });

        expect(
          wrapper
            .find('[data-test-id="hours-stats-card_title_current-hours"]')
            .text()
            .includes(hoursWorked.toString(10)),
        ).toBeTruthy();
      });

      it('Should floor float values with more than 2 digits after point', () => {
        const hoursWorkedFloat = 8.1575;
        const hoursWorkedFloored = 8.15;
        const hoursWorkedInSeconds = hoursWorkedFloat * 3600;
        const wrapper = shallowMount(HoursStatsCard, {
          props: {
            currentTime: hoursWorkedInSeconds,
          },
        });

        expect(
          wrapper
            .find('[data-test-id="hours-stats-card_title_current-hours"]')
            .text()
            .includes(hoursWorkedFloored.toString(10)),
        ).toBeTruthy();
      });
    });

    describe('Displaying total quota hours', () => {
      it.skip('Should correctly show integer values', () => {

      });

      it.skip('Should correctly show float values up to 2 digits after point', () => {

      });

      it.skip('Should round float values with more than 2 digits after point', () => {

      });
    });
  });
});
