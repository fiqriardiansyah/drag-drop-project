import { MenuTypes, cardVariableItemInfo } from "@/refactor/utils/constant";
import { useDrag } from "react-dnd";
import ShapeMaterial from "../material/shape";

type CardVariableItemProps = React.HTMLProps<HTMLDivElement> & {
    attach?: any;
}

const CardVariableItem = ({ className, attach, ...props }: CardVariableItemProps) => {

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.variable.type,
            item: { ...MenuTypes.variable, ...attach },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [],
    )

    return (
        <ShapeMaterial ref={drag as any} backgroundColor={cardVariableItemInfo.style.color} outerColor="bg-white" className={`cursor-grab text-white ${isDragging ? "opacity-40" : ""} ${className}`} {...props} />
    )
}

export default CardVariableItem;