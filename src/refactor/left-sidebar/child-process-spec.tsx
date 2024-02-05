import React from "react";
import { RefactorContext, findEntity } from "../context/context";
import { MenuTypes, convertToStringFormat } from "../utils/constant";

const ChildProcessSpec = ({ idEntity }: { idEntity: any }) => {
    const { entities } = React.useContext(RefactorContext) as any;

    const entity = findEntity(entities, idEntity);

    if (!entity) return <h1 className="text-center my-2">Entity Not Found</h1>

    const materials = entity?.children?.filter((child: any) => child.type === MenuTypes.material.type);
    const variables = entity?.children?.filter((child: any) => child.type === MenuTypes.variable.type);

    const materialPriceTotal = materials?.reduce((total: number, curr: any) => curr.data.price + total, 0);
    const variablePriceTotal = variables?.reduce((total: number, curr: any) => curr.data.price + total, 0);

    return (
        <div className="flex flex-col w-full flex-1">
            {materials?.length ? (
                <><p className="font-medium text-gray-500 mb-4">Materials</p>
                    {materials?.map((material: any) => (
                        <p key={material?.idEntity} className="w-full m-0 flex items-center justify-between text-sm">
                            <span className="m-0">{material?.data?.text}</span>
                            <span className="m-0 font-medium text-gray-400">Rp. {convertToStringFormat(material?.data?.price)}</span>
                        </p>
                    ))}
                    <p className="w-full m-0 flex items-center justify-between text-sm mt-4 font-medium">
                        <span className="m-0">Material Total</span>
                        <span className="m-0">Rp. {convertToStringFormat(materialPriceTotal)}</span>
                    </p></>
            ) : null}

            {variables?.length ? (
                <>
                    <p className="font-medium text-gray-500 my-4 mt-7">Variables</p>
                    {variables?.map((variable: any) => (
                        <p key={variable?.idEntity} className="w-full m-0 flex items-center justify-between text-sm">
                            <span className="m-0">{variable?.data?.text}</span>
                            <span className="m-0 font-medium text-gray-400">Rp. {convertToStringFormat(variable?.data?.price)}</span>
                        </p>
                    ))}
                    <p className="w-full m-0 flex items-center justify-between text-sm mt-4 font-medium">
                        <span className="m-0">Variable Total</span>
                        <span className="m-0">Rp. {convertToStringFormat(variablePriceTotal)}</span>
                    </p></>
            ) : null}
        </div>
    )
}

export default ChildProcessSpec;