import CardMaterialItem from "@/refactor/card/material/item";
import { RefactorContext } from "@/refactor/context/context";
import { MenuTypes, convertToStringFormat } from "@/refactor/utils/constant";
import { AnimatePresence } from "framer-motion";
import React from "react";

const ListMaterial = () => {
    const { menu, setMenu } = React.useContext(RefactorContext) as any;

    const dummyMaterials = [{
        id: 1,
        text: "Material 1",
        price: 150000
    }, {
        id: 2,
        text: "Material 2",
        price: 230000
    }, {
        id: 3,
        text: "Material 3",
        price: 520000
    }]

    if (menu !== MenuTypes.material.id) return null
    return (
        <AnimatePresence>
            {menu === MenuTypes.material.id ? (
                <div className="flex flex-col gap-2">
                    {dummyMaterials.map((item) => (
                        <CardMaterialItem key={item.id} attach={{ data: item }}>
                            <div className="flex flex-col">
                                <span>{item.text}</span>
                                <span className="text-gray-600 text-xs font-medium">Rp. {convertToStringFormat(item.price)}</span>
                            </div>
                        </CardMaterialItem>
                    ))}
                </div>
            ) : null}
        </AnimatePresence>
    )
}

export default ListMaterial;