import { hourglass } from 'ldrs'
hourglass.register()

export const TimeLine = ({ size, color }) => {
    return (
        <l-hourglass
            size={size}
            bg-opacity="0.1"
            speed="1.75"
            color={color}
        ></l-hourglass>
    )
}