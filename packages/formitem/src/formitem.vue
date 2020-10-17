<template>
  <div>
    <label>{{ label }}</label>
    <div>
      <slot></slot>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import AsyncValidator from 'async-validator'
export default {
  name: 'LgFormItem',
  inject: ['form'],
  props: {
    label: {
      type: String,
    },
    prop: {
      type: String,
    },
  },
  data() {
    return {
      errorMessage: '',
    }
  },
  mounted() {
    this.$on('validate', () => {
      this.validate()
    })
  },
  methods: {
    validate() {
      if (!this.prop) return
      const value = this.form.model[this.prop]
      const rules = this.form.rules[this.prop]

      const decriptor = { [this.prop]: rules }
      const validator = new AsyncValidator(decriptor)
      return validator.validate({ [this.prop]: value }, (errors) => {
        if (errors) {
          this.errorMessage = errors[0].message
        } else {
          this.errorMessage = ''
        }
      })
    },
  },
}
</script>

<style></style>
