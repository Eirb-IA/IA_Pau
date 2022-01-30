import { FunctionalComponent, h } from "preact";
import style from "./style.css";


export interface ButtonsProps {
    text:string,
    onClick:()=>any,
    style:object
}


const Button:FunctionalComponent<ButtonsProps> = (props) => {
    
    return (
        <button onClick={(e)=>props.onClick()} style={{...props.style, cursor:"pointer", width:"150px"}} class={style.button}>
            {props.text}
        </button>
    );
}


export default Button;