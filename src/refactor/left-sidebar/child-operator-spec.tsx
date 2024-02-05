import React from "react";
import { RefactorContext, findEntity } from "../context/context";
import { convertToStringFormat } from "../utils/constant";
import { operatorIcons } from "../card/operator/item";

const ChildOperatorSpec = ({ idEntity }: { idEntity: any }) => {
    const { entities, entitiesWithTotal } = React.useContext(RefactorContext) as any;

    const entity = findEntity(entities, idEntity);

    if (!entity) return <h1 className="text-center my-2">Entity Not Found</h1>

    const child1 = findEntity(entities, entity?.child1);
    const child1Total = entitiesWithTotal.find((ent: any) => ent.idEntity === child1?.idEntity)?.total;

    const child2 = findEntity(entities, entity?.child2);
    const child2Total = entitiesWithTotal.find((ent: any) => ent.idEntity === child2?.idEntity)?.total;

    const operator = operatorIcons.find((icon) => icon.id === entity.data.icon) as any;

    return (
        <div className="flex flex-col w-full flex-1 gap-4">
            {child1 && (
                <div className="w-full">
                    <p className="m-0 font-medium text-gray-400 mb-2">Operator 1</p>
                    <div className="flex items-center justify-between text-sm">
                        <span>{child1?.data?.text}</span>
                        <span className="font-medium">Rp. {convertToStringFormat(child1Total)}</span>
                    </div>
                </div>
            )}
            {child2 && (
                <div className="w-full">
                    <p className="m-0 font-medium text-gray-400 mb-2">Operator 2</p>
                    <div className="flex items-center justify-between text-sm">
                        <span>{child2?.data?.text}</span>
                        <span className="font-medium">Rp. {convertToStringFormat(child2Total)}</span>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-400 text-base">Operation</span>
                <span className="font-medium flex items-center">{operator?.name} ({operator?.icon})</span>
            </div>
        </div>
    )
}

export default ChildOperatorSpec;