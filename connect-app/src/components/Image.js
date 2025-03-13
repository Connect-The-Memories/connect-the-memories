import "./Image.css"; 

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Image = ({id, title}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}
        classname="image">
        <input type="checkbox" className="checkbox"/>
        {title}</div>
    );
};