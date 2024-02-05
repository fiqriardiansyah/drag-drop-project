import CardOperatorDraw from "../card/operator/draw";
import CardProcessDraw from "../card/process/draw";
import { MenuTypes } from "../utils/constant";

type RenderEntitiesProps = { entities: any[], asChild?: boolean, placement?: "child1" | "child2" }

const RenderEntities = ({ entities, asChild, placement }: RenderEntitiesProps) => {
    return (
        entities.map((entity: any) => {
            if (!asChild && entity?.idEntityParent) return
            if (entity?.type === MenuTypes.operator.type) {
                return (
                    <CardOperatorDraw placement={placement} asChild={asChild} key={entity?.idEntity} attach={entity}>
                        <span className="font-light">{entity?.data?.text}</span>
                    </CardOperatorDraw>
                )
            }
            return (
                <CardProcessDraw placement={placement} asChild={asChild} key={entity?.idEntity} attach={entity}>
                    <span className="font-light">{entity?.data?.text}</span>
                </CardProcessDraw>
            )
        })
    )
}

export default RenderEntities;