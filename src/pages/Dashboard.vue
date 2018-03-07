<template lang='pug'>
  .container
    h1.h2 Overview
    el-row
      el-col(:span='12')
        h3 Current
        ul.list--unstyled(v-if='latestSnapshot')
          li
            strong Latest Fiat:&nbsp;
            span {{(latestSnapshot.data.snapshot.totalAssetValue * latestSnapshot.data.snapshot.BTC.price).toFixed(2)}}
            small &nbsp;({{latestSnapshot.data.snapshot.BTC.currency}})
            i(v-if='latestSnapshot.direction.fiat === 1', class="direction direction--up el-icon-arrow-up")
            i(v-if='latestSnapshot.direction.fiat === -1', class="direction direction--down el-icon-arrow-down")

          li
            strong Latest BTC:&nbsp;
            span {{latestSnapshot.data.snapshot.totalAssetValue}}
            small &nbsp;(BTC)
            i(v-if='latestSnapshot.direction.btc === 1', class="direction direction--up el-icon-arrow-up")
            i(v-if='latestSnapshot.direction.btc === -1', class="direction direction--down el-icon-arrow-down")

    el-row
      el-col(:span='12')
        line-chart(:chart-data='parsedSnapshots', :options='lineOptions')
      el-col(:span='12')
        bar-chart(:chart-data='parsedAssets', :options='barOptions')
</template>

<script>
import {mapGetters} from 'vuex';
import union from 'lodash.union';

import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import PolarAreaChart from '../components/PolarAreaChart';

export default {
  name: 'Application',
  components: {
    LineChart,
    BarChart,
    PolarAreaChart
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
      },
      barOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value (BTC)'
            }
          }]
        }
      }
    };
  },
  created() {
    this.$store.dispatch('fetchSnapshots');
    this.$store.dispatch('fetchExchanges');
    setInterval(() => {
      this.$store.dispatch('fetchSnapshots');
    }, 120000);
  },
  computed: {
    ...mapGetters(['snapshots']),
    ...mapGetters(['enabledExchanges']),
    latestSnapshot() {
      const combined = this.snapshots.filter((s) => {
        return s.exchange === 'combined';
      });

      if (!combined.length) return;

      const ret = {
        data: combined[0]
      };

      if (combined[1]) {
        const lastBTC = combined[0].snapshot.totalAssetValue;
        const lastFiat = combined[0].snapshot.totalAssetValue * combined[0].snapshot.BTC.price;
        const prevBTC = combined[1].snapshot.totalAssetValue;
        const prevFiat = combined[1].snapshot.totalAssetValue * combined[1].snapshot.BTC.price;

        ret.direction = {
          fiat: lastFiat > prevFiat ? 1 : lastFiat === prevFiat ? 0 : -1,
          btc: lastBTC > prevBTC ? 1 : lastBTC === prevBTC ? 0 : -1
        };
      }

      return ret;
    },
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
            pointRadius: 0,
            backgroundColor: 'RGBA(80, 66, 192, 0.3)',
            data: parsedEntriesFiat
          },
          {
            label: 'Combined BTC',
            yAxisID: 'btc',
            pointRadius: 0,
            backgroundColor: 'RGBA(35, 210, 210, 0.3)',
            data: parsedEntriesBTC
          }
        ]
      };
    },
    parsedAssets() {
      const snapshots = this.snapshots;

      let labels = [];
      let datasets = [];

      // Add combined data
      if (this.enabledExchanges.length > 1) {
        const combined = snapshots.filter((s) => {
          return s.exchange === 'combined';
        });
        let dataCombined = [];

        datasets.push({
          label: 'Combined',
          backgroundColor: 'RGBA(80, 66, 192, 0.3)',
          data: dataCombined
        });

        if (combined.length > 0) {
          const assets = combined[0].snapshot.balances;
          const keys = Object.keys(assets);

          labels = union(labels, keys);

          for (let i=0; i < keys.length; i++) {
            const key = keys[i];
            const keyIndex = labels.indexOf(key);

            const val = assets[key].valueBTC;
            if (keyIndex > -1) {
              const c = dataCombined[keyIndex] || 0;
              dataCombined[keyIndex] = c + val;
            }
          }
        }
      }

      for (let i=0; i<this.enabledExchanges.length; i++) {
        const exchange = this.enabledExchanges[i];
        const snaps = snapshots.filter((s) => {
          return s.exchange === exchange.name.toLowerCase();
        });

        let data = [];

        datasets.push({
          label: exchange.name,
          data
        });

        if (snaps.length > 0) {
          const assets = snaps[0].snapshot.balances;

          for (let i=0; i < labels.length; i++) {
            const key = labels[i];
            const keyIndex = labels.indexOf(key);
            const val = assets[key] ? assets[key].valueBTC : 0;
            const c = data[keyIndex] || 0;
            data[keyIndex] = c + val;
          }
        }
      }

      return {
        labels,
        datasets
      };
    }
  }
};
</script>
<style scoped lang='scss'>
  .el-row {
    margin-bottom: rem(20px);
  }
</style>
