import { tailChase } from 'ldrs'

tailChase.register()

export const DotLoader = ({ size = "40", color = "#4F46E5" }) => {
  return (
    <l-tail-chase
      size={size}
      speed="1.75"
      color={color}
    ></l-tail-chase>
  )
}




