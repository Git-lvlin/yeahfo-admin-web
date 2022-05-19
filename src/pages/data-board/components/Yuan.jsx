import numeral from 'numeral'

const yuan = (val) => `${numeral(val).format('0,0')}`
const num = (val) => `${numeral(val).format('0,0.00')}`

export default class Yuan extends React.Component {
  main = null

  componentDidMount() {
    this.renderToHtml()
  }

  componentDidUpdate() {
    this.renderToHtml()
  }

  renderToHtml = () => {
    const { children } = this.props

    if (this.main&&Number.isInteger(children)) {
      this.main.innerHTML = yuan(children)
    } else {
      this.main.innerHTML = num(children)
    }
  };

  render() {
    return (
      <span
        ref={(ref) => {
          this.main = ref
        }}
      />
    )
  }
}