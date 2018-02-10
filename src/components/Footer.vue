<template lang='pug'>
  footer.footer
    .footer__main
    .footer__sub
      .footer__container
        ul.list--unstyled
          li
            a.footer__link(href='https://github.com/coinolio/coinolio') GitHub
          li
            a.footer__link(href='https://coinolio.readme.io/') Documentation
          li
            a.footer__link(href='https://discord.gg/QYTShcN') Community Discord
        span.footer__copyright &copy; Coinolio, 2018
</template>
<style lang='scss' scoped>
  .footer {
    background-color: $color--black;
    color: $color--white;
  }

  .footer__logo {
    width: 100px;

    img {
      width: 100%;
      height: auto;
    }
  }
  .footer__main {
    padding: rem(35px) 0;
    border-bottom: 1px solid rgba(188,198,208,0.4);
  }

  .footer__main__right {
    text-align: right;
  }

  .footer__vert-list {
    display: inline-block;
    margin-right: $grid--gutter * 2;
    text-align: center;
    vertical-align: top;

    > li {
      margin-bottom: $grid--gutter / 2;
    }
  }
  .footer__sub {
    padding: rem(25px) 0 rem(25px);

    ul {
      @include  clearfix;

      > li {
        float: left;
        margin-right: 1.5rem;
      }
    }
  }

  .footer__container {
    position: relative;
    padding: 0 $grid--gutter;
  }

  .footer__copyright {
    position: absolute;
    right: $grid--gutter * 2;
    top: 50%;
    transform: translateY(-50%);
    font-weight: 300;
    color: #fff;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .footer__link, .footer__title {
    font-family: $base--font-heading;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.085em;
    text-transform: uppercase;
    font-size: rem(11px);
    text-decoration: none;

    .footer__sub & {
      font-size: rem(10px);
    }
  }

  .footer__title {
    font-size: rem(14px);
    color: $color--primary;
  }
</style>

