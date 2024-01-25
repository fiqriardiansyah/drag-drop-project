import { RefactorContext } from "@/refactor/context/context";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import ListProcess from "./list-process";
import { MenuTypes } from "@/refactor/utils/constant";
import { useDrop } from "react-dnd";
import ListMaterial from "./list-material";
import ListOperator from "./list-operator";

const ListOption = () => {
    const { menu, setMenu, entities } = React.useContext(RefactorContext) as any;
    const activeMenu = Object.keys(MenuTypes).map((key) => MenuTypes[key as keyof typeof MenuTypes]).find((item) => item.id === menu);

    const closeOptionMenu = () => {
        setMenu("")
    }

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: [MenuTypes.process.type, MenuTypes.material.type],
            collect: (monitor) => ({
                isOver: !!monitor.isOver() && menu === (monitor.getItem() as any)?.id && !!(monitor.getItem() as any)?.idEntity,
            })
        }),
        [menu],
    )

    return (
        <AnimatePresence>
            {menu ? (<motion.div ref={drop} initial={{ left: '-150px' }} animate={{ left: '80px' }} exit={{ left: '-150px' }} transition={{ duration: .3, ease: "easeInOut" }} className="w-[200px] z-50 top-3 bottom-3 fixed rounded shadow-lg bg-white flex flex-col">
                <div className="flex items-center gap-2 px-2 w-full py-1">
                    <button title="close" className="text-xl rounded-full w-10 h-10 hover:bg-gray-100 flex items-center justify-center" onClick={closeOptionMenu}>
                        <IoArrowBackOutline />
                    </button>
                    <h1 className="font-medium">{activeMenu?.text}</h1>
                </div>
                <div className="flex flex-col p-3 relative">
                    <ListProcess />
                    <ListMaterial />
                    <ListOperator />
                </div>
                <AnimatePresence>
                    {isOver ? <motion.div className="w-full absolute h-full bg-white top-0 left-0 rounded p-3">
                        drop to delete
                    </motion.div> : null}
                </AnimatePresence>
            </motion.div>) : null}
        </AnimatePresence>
    )
}

export default ListOption;