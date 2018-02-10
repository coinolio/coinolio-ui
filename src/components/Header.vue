<template lang='pug'>
  header.main-header
    authed-nav(v-if='user')
</template>
<script>
import AuthedNav from './navigation/Authed';

export default {
  components: {
    AuthedNav
  },
  data() {
    return {
      user: this.$store.state.authUser
    };
  },
  methods: {}
};
</script>
<style lang='scss'>
  .navigation {
    display: flex;
    flex: 1;
    margin-bottom: 0;
  }

  .navigation--vertical {
    flex-direction: column;

    &> :last-child {
      padding-bottom: spacing();
    }
  }

  .navigation__item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 0;

    .navigation--vertical & {
      justify-content: left;
    }

    a {
      display: flex;
      flex-grow: 1;
      align-items: center;
      padding: spacing();
      text-decoration: none;
      @include text-style-body;
      transition: all linear duration();

      .navigation--vertical & {
        width: 100%;
        padding: spacing(tight) spacing();
        margin-right: 2px;
      }

      &:hover, &:focus, &:active {
        background-color: color(sky, light);
        box-shadow: 0px 2px 0px 0px color(sky, light);

        .navigation--vertical & {
          box-shadow: 2px 0px 0px 0px color(sky, light);
        }
      }

      &.router-link-exact-active {
        box-shadow: 0px 2px 0px 0px color(teal);

        .navigation--vertical & {
          box-shadow: 2px 0px 0px 0px color(teal);
        }
      }

    }

    > .navigation {
      display: none;
      position: absolute;
      top: rem(58px);
      right: 0;
      min-width: 100%;
      z-index: 100;

      .navigation__item {
        display: block;
        margin-left: 0;
      }
    }

    &:hover > .navigation {
      display: block;
      background: color(white);
    }
  }

  .navigation__item--right {
    margin-left: auto;
  }

  .navigation__item--disabled {
    opacity: 0.3;
    pointer-events: none;

    &:hover, &:focus, &:active {
      background: none;
    }
  }

  .navigation__heading {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding-left: spacing();
    margin-top: spacing();
    min-height: rem(32px);
    color: color(ink, lightest);
  }

  .navigation__group {
    flex-shrink: 0;
  }

  .navigation__group--parent {
    margin-top: spacing();

    & :first-child {
      margin-top: 0;
    }
  }

  .navigation__heading {
    &:not(.navigation__heading--hidden) + .navigation__group--parent, &:first-child + .navigation__group--parent {
      margin-top: 0;
    }
  }

  .navigation__align-bottom {
    flex-grow: 1;
  }

  .navigation__label {
    flex-grow: 1;
    padding-left: spacing(tight);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .top-navigation {
    display: flex;
    width: 100%;
    height: rem(58px);
    align-items: stretch;
    background-color: color(white);
    border-bottom: border(dark, thin);
  }

  .top-navigation__branding {
    display: flex;
    align-items: center;
    height: 100%;
    width: rem(240px);
    min-width: rem(240px);
    padding-left: rem(16px);
    padding-right: rem(8px);
  }

  .top-navigation__list {
    display: flex;
    flex: 1;
  }

  .top-navigation__item {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: rem(56px);
    height: 100%;

    a {
      @include text-style-subheading();
    }
  }

  .top-navigation__item--right {
    margin-left: auto;
    padding-right: spacing();
  }

  .top-navigation__item--seperate {
    border-left: border(dark, thin);
  }

</style>
