import { FunctionalComponent, h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

const Header: FunctionalComponent = () => {
    return (
        <header class={style.header}>
            <h1><span style={{color:"#8888ff"}}>Surfrider x Eirb'IA</span> - Trash Classifier</h1>
        </header>
    );
};

export default Header;
