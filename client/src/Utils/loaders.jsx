import { tailChase } from 'ldrs'

tailChase.register()

export const DotLoader = ({ size = "40", color = "black" }) => {
  return (
    <l-tail-chase
      size={size}
      speed="1.75"
      color={color}
    ></l-tail-chase>
  )
}




