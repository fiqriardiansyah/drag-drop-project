import { useDrag } from "react-dnd";
import { MenuTypes } from "./App";

const MaterialItem = ({ item, asList, children, className, ...props }: any) => {

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.MATERIAL,
            item: { ...item },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }))

    if (isDragging) {
        return null
    }

    return (
        <div ref={drag} className={`border bg-blue-200 text-gray-700 relative border-blue-400 rounded px-3 py-1 ${className} `} {...props}>
            {children}
        </div>
    )
}

export default MaterialItem;