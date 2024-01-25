import React from "react";

export type ShapeMaterialProps = React.HTMLProps<HTMLDivElement> & {
    backgroundColor: string;
    outerColor: string;
    children?: any;
}

const ShapeMaterial = React.forwardRef(({ backgroundColor, outerColor, className, children, ...props }: ShapeMaterialProps, ref?: React.ForwardedRef<HTMLDivElement>) => {
    return (
        <div ref={ref} className={`${className} ${backgroundColor} relative py-1 pb-3 flex flex-col items-center rounded`} {...props}>
            <div className={`h-[6px] w-[50%] absolute -top-[6px] left-1/2 transform -translate-x-1/2 ${backgroundColor}`} style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
            {children}
            <div className={`h-[6px] w-[50%] absolute bottom-0 ${outerColor}`} style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
        </div>
    )
})

export default ShapeMaterial;