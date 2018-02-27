<template lang='pug'>
  .container
    h1 index
    line-chart(:chart-data='parsedSnapshots', :options='lineOptions')
</template>

<script>
import {mapGetters} from 'vuex';

import LineChart from '../components/Chart';

export default {
  name: 'Application',
  components: {
    LineChart
  },
  data() {
    return {
      lineOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            distribution: 'series',
            scaleLabel: {
              display: true,
              labelString: 'Date'
            }
          }],
          yAxes: [
            {
              display: true,
              id: 'fiat',
              scaleLabel: {
                display: true,
                labelString: 'Value (Fiat)'
              }
            },
            {
              display: true,
              id: 'btc',
              gridLines: {
                display: false
              },
              scaleLabel: {
                display: true,
                labelString: 'Value (BTC)'
              }
            }
          ]
        }
      }
    };
  },
  created() {
    this.$store.dispatch('fetchSnapshots');
    setTimeout(() => {
      this.$store.dispatch('fetchSnapshots');
    }, 120000);
  },
  computed: {
    ...mapGetters(['snapshots']),
    parsedSnapshots() {
      const snapshots = this.snapshots;
      const combined = snapshots.filter((s) => {
        return s.exchange === 'combined';
      });
      const parsedEntriesBTC = combined.map((s) => {
        return {
          x: s.time,
          y: s.snapshot.totalAssetValue
        };
      });
      const parsedEntriesFiat = combined.map((s) => {
        return {
          x: s.time,
          y: s.snapshot.totalAssetValue * s.snapshot.BTC.price
        };
      });
      return {
        datasets: [
          {
            label: 'Combined Fiat',
            yAxisID: 'fiat',
            backgroundColor: 'RGBA(80, 66, 192, 0.3)',
            data: parsedEntriesFiat
          },
          {
            label: 'Combined BTC',
            yAxisID: 'btc',
            backgroundColor: 'RGBA(192, 169, 66, 0.3)',
            data: parsedEntriesBTC
          }
        ]
      };
    }
  }
};
</script>
<style>
</style>
