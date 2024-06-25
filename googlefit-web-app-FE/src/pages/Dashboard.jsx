import background from '../img/background.png';
import Widget from "../components/shared/widget";
import "../style/dashboard.css"

import stepIcon from '../assets/icons/steps.svg'
import calloriesIcon from '../assets/icons/callories.svg'
import weightIcon from '../assets/icons/weight.svg'
import heightIcon from '../assets/icons/height.svg'

function Dashboard() {
  const weight = 83;
  const height = 184;

  const steps = localStorage.getItem("steps")
  const callories = localStorage.getItem("callories")

  return(
    <div className="inner" style={{backgroundImage: `url(${background})`}}>
      <Widget
        title={"Шаги"}
        img={stepIcon}
        activity={steps}
      />
      <Widget
        title={"Калории"}
        img={calloriesIcon}
        activity={callories}
      />
      <Widget
        title={"Вес"}
        img={weightIcon}
        activity={weight}
      />
      <Widget
        title={"Рост"}
        img={heightIcon}
        activity={height}
      />
    </div>
  )
}

export {Dashboard};