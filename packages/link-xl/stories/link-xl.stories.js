import LgLinkXl from '../src/link-xl.vue'

export default {
  title: 'LgLinkXl',
  component: LgLinkXl,
}

export const LinkXl = (_) => ({
  components: { LgLinkXl },
  template: `
    <div>
      <lg-link-xl :disabled="true" href="http://www.baidu.com">baidu</lg-link-xl>
    </div>
  `,
})
