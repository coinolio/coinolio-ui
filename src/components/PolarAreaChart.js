import {PolarArea, mixins} from 'vue-chartjs';

export default {
  extends: PolarArea,
  mixins: [mixins.reactiveProp],
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
