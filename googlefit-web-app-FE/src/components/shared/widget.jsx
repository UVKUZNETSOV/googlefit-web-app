import "./widget.css"

const Widget = (props) => {
  return (
    <div className="container">
      <h1 className="title">
          {props.title}
        </h1>
        <img className="img" src={props.img} alt="" />
        <h2>
          {props.activity}
        </h2>
    </div>
  )
}

export default Widget;