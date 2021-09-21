interface VideoState {
  disabled: boolean
}

const InitalVideoState = (): VideoState => ({
  disabled: false,
})

export default InitalVideoState
