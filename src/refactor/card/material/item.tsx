import { MenuTypes, cardMaterialItemInfo } from "@/refactor/utils/constant";
import { useDrag } from "react-dnd";
import ShapeMaterial from "./shape";

type CardMaterialItemProps = React.HTMLProps<HTMLDivElement> & {
    attach?: any;
}

const CardMaterialItem = ({ className, attach, ...props }: CardMaterialItemProps) => {

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.material.type,
            item: { ...MenuTypes.material, ...attach },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [],
    )

    return (
        <ShapeMaterial ref={drag as any} backgroundColor={cardMaterialItemInfo.style.color} outerColor="bg-white" className={`cursor-grab text-white ${isDragging ? "opacity-40" : ""} ${className}`} {...props} />
    )
}

export default CardMaterialItem;