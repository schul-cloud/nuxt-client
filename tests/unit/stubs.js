const transitionStub = () => ({
  render () {
    // eslint-disable-next-line no-underscore-dangle
    return this.$options._renderChildren
  }
})

export default {
  transition: transitionStub
}
