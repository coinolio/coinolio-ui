<template lang='pug'>
  .container
    h1.h2 Events
    el-row
      el-col(:xs='12', :sm='6', :md='4', v-for='(e, index) in events', :key='e.id', :offset='index > 0 ? 1 : 0')
        el-card(:class='{disabled: !e.enabled}')
          h4.text--centered {{e.title}}
          p.text--centered {{e.description}}
          p.text--centered
            el-tag(v-if='!e.enabled', type='danger') Disabled
            el-tag(v-else, type='success') Enabled
          //- p(v-if='e.type === "summary"') {{convertCron(e.config.schedule)}}
          .bottom.clearfix
            button.btn.btn--primary.btn--block.btn--large(@click='editEvent(e.id)') Edit
    el-row
      el-col
        el-card
          button.btn.btn--block.btn--large.btn--affirmative(@click='addEvent') Add event
          el-dialog(title="Event", :visible.sync="addEventVisible")
            el-form(:model="eventForm", label-width="100px")
              el-form-item(label="Event Type")
                el-select(v-model="eventForm.type", placeholder="Please select a event")
                  el-option(v-for='e in validEvents', :label="e", :value="e.toLowerCase()", :key='e')
              el-form-item(label='Plugins')
                el-select(v-model="eventForm.plugins", multiple, placeholder="Please select plugins to use")
                  el-option(v-for='e in validPlugins', :label="e.name", :value="e.id", :key='e.id')
              el-form-item(label='Title')
                el-input(v-model='eventForm.title', auto-complete='off')
              el-form-item(label='Description')
                el-input(v-model='eventForm.description', auto-complete='off')
              template(v-if='eventForm.type === "summary"')
                el-form-item(label="Schedule")
                  el-input(v-model="eventForm.config.schedule", auto-complete="off")
                  el-tag(size="mini") {{convertCron(eventForm.config.schedule)}}
                el-form-item(label="Interval (minutes)")
                  el-input-number(v-model="eventForm.config.interval", controls-position='right', :min='2')
              el-form-item(label="Enabled")
                el-switch(v-model="eventForm.enabled")
              el-form-item(v-if='editMode')
                button.btn.btn--destructive(@click.prevent='deleteEvent') Delete
            span.dialog-footer(slot="footer")
              el-button(@click="clearEvent") Cancel
              el-button(type="primary", @click="submitEvent")
                span(v-if='!editMode') Create
                span(v-if='editMode') Save

</template>

<script>
import {mapGetters} from 'vuex';
import cronstrue from 'cronstrue';

export default {
  name: 'Events',
  data() {
    return {
      addEventVisible: false,
      editMode: false,
      eventForm: {
        title: '',
        description: '',
        type: '',
        plugins: [],
        config: {},
        enabled: true
      },
      validEvents: ['Summary', 'Trade']
    };
  },
  created() {
    this.$store.dispatch('fetchEvents');
    this.$store.dispatch('fetchPlugins');
  },
  computed: {
    ...mapGetters(['events']),
    ...mapGetters(['plugins']),
    validPlugins() {
      return this.plugins.filter((p) => {
        return p.enabled;
      });
    }
  },
  methods: {
    addEvent() {
      this.editMode = false;
      this.addEventVisible = true;
    },
    clearEvent() {
      this.editMode = false;
      this.eventForm = {
        title: '',
        description: '',
        type: '',
        plugins: [],
        config: {},
        enabled: true
      };
      this.addEventVisible = false;
    },
    editEvent(id) {
      this.editMode = true;
      const target = this.events.find((e) => {
        return e.id === id;
      });
      this.eventForm = {
        id: target.id,
        title: target.title,
        description: target.description,
        type: target.type,
        plugins: target.plugins ? target.plugins.map((p) => {
          return p.id;
        }) : [],
        config: target.config,
        enabled: target.enabled
      };
      this.addEventVisible = true;
    },
    submitEvent() {
      if (this.eventForm.type === 'summary') {
        this.eventForm.config.duration = (this.eventForm.config.duration / 60) * 2;
      }

      if (this.editMode) {
        this.$store.dispatch('editEvent', this.eventForm);
      } else {
        this.$store.dispatch('addEvent', this.eventForm);
      }
      this.clearEvent();
    },
    deleteEvent() {
      this.$confirm('This will permanently delete the event. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('removeEvent', this.eventForm.id);
          this.$message({
            type: 'success',
            message: 'Delete completed'
          });
          this.clearEvent();
        });
    },
    convertCron(text) {
      return cronstrue.toString(text, {verbose: true});
    }
  }
};
</script>
<style lang='scss'>
  .el-row + .el-row {
    margin-top: spacing(extra-loose);
  }

  .el-select-dropdown__item {
    margin-left: 0;
  }

  .el-card.disabled {
    opacity: 0.7;
  }
</style>
