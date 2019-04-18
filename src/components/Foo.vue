<template>
  <div>
    <input type="text" v-model="message">
    <button @click="handleClick">click me!</button>
  </div>
</template>

<script>
export default {
  name: 'Foo',
  props: {
    msg: String
  },
  data() {
    return {
      message: this.msg
    }
  },
  methods: {
    handleClick() {
      alert(this.message);
    }
  }
}
</script>
