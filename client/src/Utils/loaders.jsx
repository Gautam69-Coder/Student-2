import { tailChase } from 'ldrs'

tailChase.register()

export const DotLoader = ({ size, color }) => {
  return (
    <l-tail-chase
      size={size || "40px"}
      speed="1.75"
      color={color || "black"}
    ></l-tail-chase>
  )
}




